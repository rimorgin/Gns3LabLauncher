/* eslint-disable @typescript-eslint/no-explicit-any */
import docker from "@srvr/configs/docker.config.ts";
import {
  ensureImageExists,
  isContainerRunning,
} from "@srvr/utils/docker-run.utils.ts";

interface ContainerOptions {
  containerName: string;
  imageName?: string;
  networkMode?: string; // e.g., 'host' or 'mynet'
}

export class Gns3DockerService {
  static readonly DEFAULT_IMAGE = "rimorgin/gns3server";
  static readonly DEFAULT_NETWORK = "gns3vlan";
  static readonly DATA_PATH = "/var/opt/gns3lablauncher/gns3:/data";

  /**
   * Runs a GNS3 Docker container.
   */
  static async runContainer({
    containerName,
    imageName = Gns3DockerService.DEFAULT_IMAGE,
    networkMode = Gns3DockerService.DEFAULT_NETWORK,
  }: ContainerOptions): Promise<string> {
    const isValidName = /^[a-zA-Z0-9][a-zA-Z0-9_.-]{0,63}$/.test(containerName);
    if (!isValidName) {
      throw new Error("Invalid container name");
    }

    await ensureImageExists(imageName);

    const alreadyRunning = await isContainerRunning(containerName);
    if (alreadyRunning) {
      throw new Error(`Container "${containerName}" is already running`);
    }

    try {
      const container = await docker.createContainer({
        Image: imageName,
        name: containerName,
        Hostname: "gns3vm",
        Env: [`GNS3_USERNAME=${containerName}`],
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

      const data = await container.inspect();
      return data.Id;
    } catch {
      throw new Error(
        `Error creating GNS3 container for "${containerName.toUpperCase()}"`,
      );
    }
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
}
