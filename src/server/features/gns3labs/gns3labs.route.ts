import { Router } from "express";
import {
  listGns3Containers,
  startGns3Container,
  stopGns3Container,
} from "@srvr/features/gns3labs/gns3labs.controller.ts";

const router = Router();

/**
 * @route POST /gns3labs/start/:containerName
 * @desc Starts a GNS3 Docker container with the given name and checks health
 * @params { containerName: string }
 */
router.post("/start/:containerName", startGns3Container);

/**
 * @route POST /gns3labs/stop/:containerName
 */
router.post("/stop/:containerName", stopGns3Container);

/**
 * @route GET /gns3labs/list
 * @desc Lists all Docker containers (running & stopped)
 */
router.get("/list", listGns3Containers);

export default router;
