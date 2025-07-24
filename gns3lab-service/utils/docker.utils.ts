// @srvr/utils/docker-run.utils.ts
import docker from "../config/docker.config.ts";

export async function ensureImageExists(imageName: string) {
  try {
    await docker.getImage(imageName).inspect();
  } catch {
    console.log(`Image ${imageName} not found. Pulling...`);
    const stream = await docker.pull(imageName);
    await new Promise((resolve, reject) => {
      docker.modem.followProgress(stream, (err: any, output: any) => {
        if (err) reject(err);
        else resolve(output);
      });
    });
    console.log(`Image ${imageName} pulled successfully`);
  }
}

export async function isContainerRunning(
  containerName: string,
): Promise<boolean> {
  try {
    const container = docker.getContainer(containerName);
    const data = await container.inspect();
    return data.State.Running;
  } catch (err) {
    return false; // Container doesn't exist or inaccessible
  }
}

export async function waitForContainer(
  containerName: string,
  timeoutMs = 30_000,
) {
  const start = Date.now();
  const intervalMs = 500;

  while (Date.now() - start < timeoutMs) {
    if (await isContainerRunning(containerName)) {
      return;
    }
    await new Promise((r) => setTimeout(r, intervalMs));
  }
  throw new Error(`Timeout waiting for container '${containerName}' to start`);
}

export async function waitForContainerToBeCreated(
  containerName: string,
  timeoutMs = 30_000,
) {
  const start = Date.now();
  const intervalMs = 500;

  while (Date.now() - start < timeoutMs) {
    try {
      const container = docker.getContainer(containerName);
      await container.inspect(); // If no error → exists
      return;
    } catch (err) {
      /* ignore */
    }
    await new Promise((r) => setTimeout(r, intervalMs));
  }
  throw new Error(`Container '${containerName}' was not created in time`);
}
