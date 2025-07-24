// @srvr/scripts/run-gns3server.script.ts
import docker from "../config/docker.config";
import { ensureImageExists } from "../utils/docker.utils";

interface StartContainerOptions {
  containerName: string;
  imageName?: string;
  networkMode?: string; // e.g., 'host' or 'mynet'
}

export async function runGns3ServerDockerContainer({
  containerName,
  imageName = "rimorgin/gns3server",
  networkMode = "host", // change to 'mynet' for macvlan
}: StartContainerOptions): Promise<string> {
  const isValidName = /^[a-zA-Z0-9][a-zA-Z0-9_.-]{0,63}$/.test(containerName);
  if (!isValidName) {
    throw new Error("Invalid container name");
  }

  // Optional: Pull image first
  await ensureImageExists(imageName);

  try {
    const container = await docker.createContainer({
      Image: imageName,
      name: containerName,
      Hostname: "gns3vm",
      Env: [`GNS3_USERNAME=${containerName}`, "SSL=true"],
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
  } catch (err: any) {
    if (err.statusCode === 409) {
      throw new Error(
        `Container with name "${(container, containerName)}" already exists`,
      );
    }
    throw err;
  }
}

// In @srvr/scripts/run-gns3server.script.ts
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

export async function onProcessShutdownStopGns3Containers() {
  try {
    const containers = await docker.listContainers({
      filters: { ancestor: ["rimorgin/gns3server"] },
    });

    if (containers.length === 0) {
      console.log("ℹ️ No GNS3 containers to stop.");
      return;
    }

    const stopPromises = containers.map(async (cInfo) => {
      const container = docker.getContainer(cInfo.Id);
      try {
        await container.stop();
        console.log(`✅ Stopped ${cInfo.Names[0]}`);
      } catch (err: any) {
        if (!err.message.includes("not running")) {
          console.error(`⚠️ Failed to stop ${cInfo.Names[0]}:`, err.message);
        }
      }
    });

    await Promise.all(stopPromises);
  } catch (err) {
    console.error("🚨 Unexpected error during shutdown:", err);
  }
}
