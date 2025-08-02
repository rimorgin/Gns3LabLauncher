import docker from "@srvr/configs/docker.config.ts";
import prisma from "@srvr/utils/db/prisma.ts";
import {
  ensureImageExists,
  isContainerRunning,
} from "@srvr/utils/docker-run.utils.ts";
import { Readable } from "stream";

interface ContainerOptions {
  containerName: string;
  imageName?: string;
  networkMode?: string; // e.g., 'host' or 'mynet'
}

export class Gns3DockerService {
  static readonly DEFAULT_IMAGE = "rimorgin/gns3server";
  static readonly DEFAULT_NETWORK = "gns3vlan"; //gns3vlan or host
  static readonly DATA_PATH = "/var/opt/gns3lablauncher/gns3:/data";

  /**
   * Runs a GNS3 Docker container.
   */

  static async runContainer({
    containerName,
    imageName = Gns3DockerService.DEFAULT_IMAGE,
    networkMode = Gns3DockerService.DEFAULT_NETWORK,
  }: ContainerOptions): Promise<{
    id: string;
    ip: string | undefined;
    tunIp: string | null;
  }> {
    const isValidName = /^[a-zA-Z0-9][a-zA-Z0-9_.-]{0,63}$/.test(containerName);
    if (!isValidName) throw new Error("Invalid container name");

    await ensureImageExists(imageName);

    const alreadyRunning = await isContainerRunning(containerName);
    if (alreadyRunning)
      throw new Error(`Container "${containerName}" is already running`);

    const container = await docker.createContainer({
      Image: imageName,
      name: containerName,
      Hostname: "gns3vm",
      Env: [`GNS3_USERNAME=${containerName}`, "SSL=true", "OPENVPN=true"],
      HostConfig: {
        NetworkMode: networkMode,
        Privileged: true,
        CapAdd: ["NET_ADMIN"],
        Binds: [Gns3DockerService.DATA_PATH],
        AutoRemove: true,
      },
      StopSignal: "SIGTERM",
    });

    await container.start();

    // ✅ Start following logs and resolve when tun IP appears
    const tunIp = await new Promise<string | null>((resolve, reject) => {
      container.logs(
        {
          stdout: true,
          stderr: true,
          follow: true,
          timestamps: false,
        },
        (err, stream) => {
          if (err || !stream)
            return reject(err || new Error("Failed to get logs"));

          const readable = stream as Readable;
          let buffer = "";

          readable.on("data", (chunk) => {
            buffer += chunk.toString("utf8");

            const match = buffer.match(
              /\[INFO\] Tunnel IP: (\d+\.\d+\.\d+\.\d+)/,
            );
            if (match?.[1]) {
              readable.destroy(); // Stop reading logs
              resolve(match[1]); // Resolve with the tun IP
            }
          });

          readable.on("error", reject);
          // Timeout or safety fallback after 15s
          setTimeout(() => {
            readable.destroy();
            resolve(null); // fallback if no tun IP found
          }, 15000);
        },
      );
    });

    const data = await container.inspect();
    const ip =
      networkMode && data.NetworkSettings.Networks?.[networkMode]?.IPAddress;

    console.log("🚀 ~ Gns3DockerService ~ runContainer ~ tunIp:", tunIp);
    return { id: data.Id, ip, tunIp };
  }

  /**
   * Stops a running GNS3 Docker container.
   */
  static async stopContainer(containerName: string): Promise<void> {
    const container = docker.getContainer(containerName);

    try {
      await container.stop();
    } catch (err: unknown) {
      if (
        typeof err === "object" &&
        err !== null &&
        "statusCode" in err &&
        "message" in err &&
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        typeof (err as any).message === "string"
      ) {
        const e = err as { statusCode: number; message: string };
        if (e.statusCode === 304 || e.message.includes("not running")) {
          console.log(`Container "${containerName}" was already stopped.`);
          return;
        }
      }

      throw err;
    }
  }
  static async listContainers(): Promise<
    Array<{ name: string; status: string; state: string }>
  > {
    try {
      const containers = await docker.listContainers();
      const gns3Containers = containers
        .filter((container) => container.Image.includes("rimorgin/gns3server"))
        .map((containerInfo) => ({
          name: containerInfo.Names[0].replace(/^\//, ""),
          status: containerInfo.Status,
          state: containerInfo.State,
        }));
      return gns3Containers; // This is an array of ContainerInfo
    } catch (error) {
      throw new Error("Failed to list containers: " + error);
    }
  }
  static async listContainersWithUserInfo() {
    const instances = await this.listContainers();

    const users = await prisma.$transaction(
      instances.map((instance) =>
        prisma.user.findUnique({
          where: { username: instance.name },
          select: {
            id: true,
            email: true,
            name: true,
            student: {
              select: {
                classrooms: {
                  select: {
                    classroomName: true,
                    course: {
                      select: {
                        courseName: true,
                        courseCode: true,
                      },
                    },
                  },
                },
              },
            },
          },
        }),
      ),
    );

    const combined = instances.map((instance, idx) => ({
      container: instance,
      user: users[idx],
    }));

    return combined;
  }
}
