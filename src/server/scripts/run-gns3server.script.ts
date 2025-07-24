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

/*
 * Runs a Docker container with the specified container name.
 * * @param {string} containerName - The name of the Docker container.
 * * @param {function} callback - The callback function to handle the result.
 * * @returns {void}
 */

export async function runGns3ServerDockerContainer({
  containerName,
  imageName = "rimorgin/gns3server",
  networkMode = "gns3vlan", // change to 'gns3vlan' for macvlan and must exists
}: ContainerOptions): Promise<string> {
  const isValidName = /^[a-zA-Z0-9][a-zA-Z0-9_.-]{0,63}$/.test(containerName);
  if (!isValidName) {
    throw new Error("Invalid container name");
  }

  // Pull image first if not exists
  await ensureImageExists(imageName);
  const isAlreadyRunning = await isContainerRunning(containerName);

  if (isAlreadyRunning) {
    throw new Error("Instance is running");
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
        Binds: ["/var/opt/gns3lablauncher/gns3:/data"],
        AutoRemove: true, // equivalent to --rm
      },
      // Stop signal – graceful shutdown hint
      StopSignal: "SIGTERM",
    });

    await container.start();

    const data = await container.inspect();
    return data.Id; // Return container ID
  } catch {
    throw new Error(
      `Error creating gns3 instance for "${containerName.toUpperCase()}"`,
    );
  }
}

export async function stopGns3ServerDockerContainer(containerName: string) {
  const container = docker.getContainer(containerName);

  try {
    await container.stop();
    // No need to remove — AutoRemove: true handles it
  } catch (err: any) {
    if (err.statusCode === 304 || err.message.includes("not running")) {
      console.log(`Container ${containerName} was already stopped`);
      return;
    }
    throw err;
  }
}
