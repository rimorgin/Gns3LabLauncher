import { exec, spawn } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

export async function isContainerRunning(
  containerName: string,
): Promise<boolean> {
  try {
    const { stdout } = await execAsync(
      `docker ps --filter "name=^/${containerName}$" --filter "status=running" --format "{{.ID}}"`
    );
    return !!stdout.trim();
  } catch {
    return false;
  }
}

export async function checkContainerHealth(containerId: string) {
  const startPeriod = 10 * 1000; // ms
  const interval = 10 * 1000; // ms
  const timeout = 5 * 1000; // ms
  const retries = 5;

  console.log(`Waiting ${startPeriod / 1000}s for container to start...`);
  await new Promise((resolve) => setTimeout(resolve, startPeriod));

  for (let i = 0; i < retries; i++) {
    try {
      const { stdout } = await execAsync(
        `docker exec ${containerId} /bin/sh -c "ss -tunl | grep ':3080'"`,
        { timeout },
      );

      if (stdout.trim()) {
        console.log(`✅ Port 3080 is listening (attempt ${i + 1})`);
        return true;
      }
    } catch (error) {
      console.warn(`⚠️ Port 3080 check failed (attempt ${i + 1}): ${error}`);
    }

    if (i < retries - 1) {
      console.log(`⏳ Retrying in ${interval / 1000}s...`);
      await new Promise((resolve) => setTimeout(resolve, interval));
    }
  }

  console.error("❌ Container did not listen on port 3080 in time");
  return false;
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
