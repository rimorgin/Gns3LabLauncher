import { Router } from "express";
import {
  listAllGns3Containers,
  listAllGns3ContainersWithUsersInfo,
  startGns3Container,
  stopGns3Container,
} from "@srvr/features/gns3labs/gns3labs.controller.ts";
import { checkAuthentication } from "@srvr/middlewares/auth.middleware.ts";

const router = Router();

/**
 * @route POST /gns3labs/start/:containerName
 * @desc Starts a GNS3 Docker container with the given name and checks health
 * @params { containerName: string }
 */
router.post("/start/:containerName", checkAuthentication, startGns3Container);

/**
 * @route POST /gns3labs/stop/:containerName
 */
router.post("/stop/:containerName", checkAuthentication, stopGns3Container);

/*
 * @route GET /gns3labs/list
 * @desc Lists all Docker containers (running & stopped)
 */
router.get("/list", checkAuthentication, listAllGns3Containers);

/*
 * @route GET /gns3labs/list-userinfo
 * @desc Lists all Docker containers (running & stopped)
 */
router.get(
  "/list-userinfo",
  checkAuthentication,
  listAllGns3ContainersWithUsersInfo,
);

export default router;
