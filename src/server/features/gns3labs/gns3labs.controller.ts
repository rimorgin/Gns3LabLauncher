import type { Request, Response, NextFunction } from "express";
import { exec } from "child_process";
import { promisify } from "util";
import { runGns3ServerDockerContainer } from "@srvr/scripts/run-gns3server.script.ts";
import {
  checkContainerHealth,
  isContainerRunning,
} from "@srvr/utils/docker-run.utils.ts";
import { HTTP_RESPONSE_CODE } from "@srvr/configs/constants.config.ts";

const execAsync = promisify(exec);

export async function startGns3Container(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const { containerName } = req.params;

  if (!containerName) {
    res
      .status(HTTP_RESPONSE_CODE.BAD_REQUEST)
      .json({ error: "containerName is required" });
    return;
  }

  try {
    console.log(`🚀 Starting GNS3 container: ${containerName}`);
    if (await isContainerRunning(containerName)) {
      console.log(`${containerName} is already running!`);
      res
        .status(HTTP_RESPONSE_CODE.SUCCESS)
        .json({ message: `Your lab instance is already running` });
      return;
    }

    const containerId = await runGns3ServerDockerContainer(containerName);

    const healthy = await checkContainerHealth(containerId);

    if (!healthy) {
      res.status(HTTP_RESPONSE_CODE.SERVER_ERROR).json({
        error: "Container started but failed health checks",
        containerId,
      });
      return;
    }

    res.status(HTTP_RESPONSE_CODE.SUCCESS).json({
      message: "Gns3 instance started successfully",
      containerId,
    });
  } catch (error) {
    console.error("❌ Error starting GNS3 container:", error);
    next(error);
  }
}

export async function stopGns3Container(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const { containerName } = req.params;

  if (!containerName) {
    res.status(400).json({ error: "containerName is required" });
    return;
  }
  // containers are automatically remove when stopped because of the flag --rm
  try {
    console.log(`🛑 Stopping container: ${containerName}`);
    await execAsync(`docker stop ${containerName}`);
    res.status(HTTP_RESPONSE_CODE.SUCCESS).json({
      message: "Container stopped",
      containerName,
    });
  } catch (error) {
    console.error("❌ Error stopping container:", error);
    next(error);
  }
}

export async function listGns3Containers(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { stdout } = await execAsync(
      `docker ps -a --filter ancestor=rimorgin/gns3server --format "{{.ID}} {{.Names}} {{.Status}}"`,
    );

    const containers = stdout
      .trim()
      .split("\n")
      .filter(Boolean)
      .map((line) => {
        const [id, ...rest] = line.split(" ");
        const name = rest.shift()!;
        const status = rest.join(" ");
        return { id, name, status };
      });

    res.status(HTTP_RESPONSE_CODE.SUCCESS).json({ containers });
  } catch (error) {
    console.error("❌ Error listing GNS3 containers:", error);
    next(error);
  }
}

/* export async function streamGns3ContainerLogs(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const { containerName } = req.params;

  if (!containerName) {
    res.status(400).json({ error: "containerName is required" });
    return;
  }

  try {
    console.log(`📄 Streaming logs for container: ${containerName}`);

    // You could optionally emit an event here to notify the frontend to start listening
    io.to(containerName).emit("log", `📄 Starting logs for ${containerName}`);

    const dockerLogs = spawn("docker", ["logs", "-f", containerName]);

    dockerLogs.stdout.on("data", (data) => {
      io.to(containerName).emit("log", data.toString());
    });

    dockerLogs.stderr.on("data", (data) => {
      io.to(containerName).emit("log", data.toString());
    });

    dockerLogs.on("close", (code) => {
      io.to(containerName).emit("log", `📄 Log stream ended with code ${code}`);
    });

    res.status(200).json({
      message: `Started streaming logs for ${containerName}`,
    });
  } catch (error) {
    console.error("❌ Error streaming container logs:", error);
    next(error);
  }
} */
