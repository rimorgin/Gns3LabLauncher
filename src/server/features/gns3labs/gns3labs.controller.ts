import type { Request, Response, NextFunction } from "express";
import { HTTP_RESPONSE_CODE } from "@srvr/configs/constants.config.ts";
import { Gns3DockerService } from "./gns3labs.service.ts";

export async function startGns3Container(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const { containerName } = req.params;

  if (!containerName) {
    res
      .status(HTTP_RESPONSE_CODE.BAD_REQUEST)
      .json({ message: "containerName is required" });
    return;
  }

  try {
    const { id: containerId, tunIp } = await Gns3DockerService.run({
      containerName,
    });

    console.log("About to send success response...");
    console.log("Response values:", { containerId, tunIp });

    return res.status(HTTP_RESPONSE_CODE.SUCCESS).json({
      message: "Gns3 instance started successfully",
      tunIp,
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
    res
      .status(HTTP_RESPONSE_CODE.BAD_REQUEST)
      .json({ error: "containerName is required" });
    return;
  }

  try {
    console.log(`🛑 Stopping container: ${containerName}`);

    // Check if we're stopping a critical service
    if (containerName === "postgres" || containerName === "redis") {
      console.warn(`⚠️ Stopping critical service: ${containerName}`);
    }

    await Gns3DockerService.stop(containerName);

    res.status(HTTP_RESPONSE_CODE.SUCCESS).json({
      message: "Container stopped",
      containerName,
    });
  } catch (error) {
    console.error("❌ Error stopping container:", error);
    next(error);
  }
}

export async function restartGns3Container(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const { containerName } = req.params;

  if (!containerName) {
    res
      .status(HTTP_RESPONSE_CODE.BAD_REQUEST)
      .json({ message: "containerName is required" });
    return;
  }

  try {
    const { id: containerId, tunIp } =
      await Gns3DockerService.restart(containerName);

    console.log("About to send success response...");
    console.log("Response values:", { containerId, tunIp });

    return res.status(HTTP_RESPONSE_CODE.SUCCESS).json({
      message: "Gns3 instance started successfully",
      tunIp,
    });
  } catch (error) {
    console.error("❌ Error starting GNS3 container:", error);
    next(error);
  }
}

export async function listAllGns3Containers(req: Request, res: Response) {
  try {
    const gns3Containers = await Gns3DockerService.list();
    res.status(HTTP_RESPONSE_CODE.SUCCESS).json({
      message: "Fetched Running Gns3 Containers",
      gns3Containers,
    });
    return;
  } catch {
    res.status(HTTP_RESPONSE_CODE.SERVER_ERROR).json({
      error: "Failed to fetch GNS3 containers",
    });
  }
}

export async function listAllGns3ContainersWithUsersInfo(
  req: Request,
  res: Response,
) {
  try {
    const gns3Containers = await Gns3DockerService.listContainersWithUserInfo();
    res.status(HTTP_RESPONSE_CODE.SUCCESS).json({
      message: "Fetched Running Gns3 Containers with User Info",
      gns3Containers,
    });
    return;
  } catch {
    res.status(HTTP_RESPONSE_CODE.SERVER_ERROR).json({
      error: "Failed to fetch GNS3 containers",
    });
  }
}
