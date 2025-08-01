import docker from "@srvr/configs/docker.config.ts";
import { exec, spawn } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

export async function ensureImageExists(imageName: string) {
  try {
    await docker.getImage(imageName).inspect();
  } catch {
    console.log(`Image ${imageName} not found. Pulling...`);
    const stream = await docker.pull(imageName);
    await new Promise((resolve, reject) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
  } catch {
    return false; // Container doesn't exist or inaccessible
  }
}

export async function checkContainerHealth(containerId: string) {
  const startPeriod = 10 * 1000; // ms
  const interval = 10 * 1000; // ms
  const retries = 5;

  console.log(`🔍 Starting health check for container: ${containerId}`);
  console.log(`Waiting ${startPeriod / 1000}s for container to start...`);

  await new Promise((resolve) => setTimeout(resolve, startPeriod));

  for (let i = 0; i < retries; i++) {
    try {
      console.log(`🔄 Health check attempt ${i + 1}/${retries}`);

      const container = docker.getContainer(containerId);

      // Create exec instance
      const exec = await container.exec({
        Cmd: ["/bin/sh", "-c", 'ss -tunl | grep ":3080"'],
        AttachStdout: true,
        AttachStderr: true,
      });

      // Start the exec and get the stream
      const stream = await exec.start({
        hijack: true,
        stdin: false,
      });

      // Collect output from stream
      const output = await new Promise<string>((resolve, reject) => {
        const chunks: Buffer[] = [];
        const timeout = setTimeout(() => {
          reject(new Error("Command timeout"));
        }, 5000);

        stream.on("data", (chunk: Buffer) => {
          chunks.push(chunk);
        });

        stream.on("end", () => {
          clearTimeout(timeout);
          const result = Buffer.concat(chunks).toString();
          resolve(result);
        });

        stream.on("error", (error) => {
          clearTimeout(timeout);
          reject(error);
        });
      });

      console.log(`📊 Command output: "${output.trim()}"`);

      if (output.trim()) {
        console.log(`✅ Port 3080 is listening (attempt ${i + 1})`);
        return true;
      } else {
        console.log(`⚠️ Port 3080 not found in output (attempt ${i + 1})`);
      }
    } catch (error) {
      console.warn(
        `⚠️ Port 3080 check failed (attempt ${i + 1}):`,
        error.message,
      );
    }

    if (i < retries - 1) {
      console.log(`⏳ Retrying in ${interval / 1000}s...`);
      await new Promise((resolve) => setTimeout(resolve, interval));
    }
  }

  console.error("❌ Container did not listen on port 3080 in time");
  return false;
}

export async function waitForContainerToBeCreated(
  containerName: string,
  timeout = 30000,
) {
  const start = Date.now();

  return new Promise<void>((resolve, reject) => {
    const interval = setInterval(() => {
      const inspect = spawn("docker", ["inspect", containerName]);
      inspect.on("close", (code) => {
        if (code === 0) {
          clearInterval(interval);
          resolve();
        } else if (Date.now() - start > timeout) {
          clearInterval(interval);
          reject(new Error("Container was not created in time"));
        }
      });
    }, 500);
  });
}

export async function waitForContainer(containerName: string, timeout = 5000) {
  const start = Date.now();

  return new Promise((resolve, reject) => {
    const interval = setInterval(() => {
      const inspect = spawn("docker", [
        "inspect",
        "-f",
        "{{.State.Running}}",
        containerName,
      ]);
      let output = "";

      inspect.stdout.on("data", (data) => {
        output += data.toString();
      });

      inspect.on("close", () => {
        if (output.trim() === "true") {
          clearInterval(interval);
          resolve(true);
        } else if (Date.now() - start > timeout) {
          clearInterval(interval);
          reject(new Error("Container did not start in time"));
        }
      });
    }, 500);
  });
}

export async function onProcessShutdownStopGns3Containers() {
  try {
    const { stdout } = await execAsync(
      "docker ps --filter ancestor=rimorgin/gns3server -q",
    );
    const ids = stdout.trim().split("\n").filter(Boolean);
    if (ids.length > 0) {
      await execAsync(`docker stop ${ids.join(" ")}`);
      console.log("✅ GNS3 containers stopped.");
    } else {
      console.log("ℹ️ No GNS3 containers to stop.");
    }
  } catch (err) {
    console.error("⚠️ Error stopping GNS3 containers:", err);
  }
}
