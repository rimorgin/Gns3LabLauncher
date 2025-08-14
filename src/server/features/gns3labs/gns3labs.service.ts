import docker from "@srvr/configs/docker.config.ts";
import prisma from "@srvr/utils/db/prisma.ts";
import {
  checkContainerHealth,
  ensureImageExists,
  isContainerRunning,
} from "@srvr/utils/docker-run.utils.ts";
import type { Container } from "dockerode";
import { Readable } from "stream";

interface ContainerOptions {
  containerName: string;
  imageName?: string;
  networkMode?: string; // e.g., 'host' or 'mynet'
}

export class Gns3DockerService {
  static readonly DEFAULT_IMAGE = "rimorgin/gns3server";
  static readonly DEFAULT_NETWORK = "host"; //gns3vlan or host
  static readonly DATA_PATH = "/var/opt/gns3lablauncher/gns3:/data";

  /**
   * Runs a GNS3 Docker container.
   */

  static async run({
    containerName,
    imageName = Gns3DockerService.DEFAULT_IMAGE,
    networkMode = Gns3DockerService.DEFAULT_NETWORK,
  }: ContainerOptions): Promise<{
    id: string;
    tunIp: string | null;
  }> {
    const isValidName = /^[a-zA-Z0-9][a-zA-Z0-9_.-]{0,63}$/.test(containerName);
    if (!isValidName) throw new Error("Invalid container name");

    await ensureImageExists(imageName);

    const isRunning = await isContainerRunning(containerName);
    let container: Container;
    let tunIp: string | null = null;

    if (!isRunning) {
      container = await docker.createContainer({
        Image: imageName,
        name: containerName,
        Hostname: "gns3vm",
        Env: [`GNS3_USERNAME=${containerName}`, "SSL=true", "OPENVPN=true"],
        HostConfig: {
          NetworkMode: networkMode,
          Privileged: true,
          CapAdd: ["NET_ADMIN"],
          Binds: [Gns3DockerService.DATA_PATH],
          //AutoRemove: true,
        },
        StopSignal: "SIGTERM",
      });

      await container.start();

      // Extract tun IP from logs after startup
      tunIp = await new Promise<string | null>((resolve) => {
        container.logs(
          {
            stdout: true,
            stderr: true,
            follow: true,
            timestamps: false,
            tail: 100,
          },
          (err, stream) => {
            if (err || !stream) return resolve(null);

            const readable = stream as Readable;
            let buffer = "";

            readable.on("data", (chunk) => {
              buffer += chunk.toString("utf8");
              const match = buffer.match(
                /\[INFO\] Tunnel IP: (\d+\.\d+\.\d+\.\d+)/,
              );
              //console.log("🚀 ~ Gns3DockerService ~ run ~ match:", match);
              if (match?.[1]) {
                readable.destroy();
                resolve(match[1]);
              }
            });

            readable.on("error", () => resolve(null));
            setTimeout(() => {
              readable.destroy();
              resolve(null);
            }, 5000);
          },
        );
      });
    } else {
      container = docker.getContainer(containerName);

      // 🔍 Extract tun IP from logs even if running
      const logsOutput = await container.logs({
        stdout: true,
        stderr: true,
        timestamps: false,
      });

      const logStr = logsOutput.toString("utf8");
      const match = logStr.match(/\[INFO\] Tunnel IP: (\d+\.\d+\.\d+\.\d+)/);
      tunIp = match?.[1] || null; // 🛠 fixed: assign to the outer variable
    }

    /* const healthy = await checkContainerHealth(container.id);

    if (!healthy) {
      throw new Error("Container started but failed health checks");
    } */
    return { id: container.id, tunIp };
  }

  /**
   * Stops a running GNS3 Docker container.
   */
  static async stop(containerName: string): Promise<void> {
    const container = docker.getContainer(containerName);

    try {
      await container.stop();
      await container.wait();
      await container.remove();
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

  /**
   * Resets a GNS3 Docker container by restarting it and extracting the new tun IP.
   */
  static async restart(
    containerName: string,
  ): Promise<{ id: string; tunIp: string | null }> {
    const container = docker.getContainer(containerName);
    try {
      await container.restart();
      const healthy = await checkContainerHealth(container.id);

      if (!healthy) {
        throw new Error("Container started but failed health checks");
      }
      const tunIp = await new Promise<string | null>((resolve) => {
        container.logs(
          {
            stdout: true,
            stderr: true,
            follow: true,
            timestamps: false,
            tail: 100,
          },
          (err, stream) => {
            if (err || !stream) return resolve(null);

            const readable = stream as Readable;
            let buffer = "";

            readable.on("data", (chunk) => {
              buffer += chunk.toString("utf8");
              const match = buffer.match(
                /\[INFO\] Tunnel IP: (\d+\.\d+\.\d+\.\d+)/,
              );
              if (match?.[1]) {
                readable.destroy();
                resolve(match[1]);
              }
            });

            readable.on("error", () => resolve(null));
            setTimeout(() => {
              readable.destroy();
              resolve(null);
            }, 5000);
          },
        );
      });

      return { id: container.id, tunIp };
    } catch (err) {
      console.error(`Failed to reset container "${containerName}":`, err);
      throw err;
    }
  }

  static async list(): Promise<
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
    const instances = await this.list();

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
