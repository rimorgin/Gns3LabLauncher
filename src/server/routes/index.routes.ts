import { Router } from "express";
import {
  getIndex,
  getUserPermissions,
} from "@srvr/controllers/index.controller.ts";
import {
  checkAuthentication,
  checkPermission,
} from "@srvr/middlewares/auth.middleware.ts";
import { redisCache } from "@srvr/middlewares/redis-cache.middleware.ts";
import { mongoWebGuiProxyInstance } from "@srvr/middlewares/http-proxy.middleware.ts";

const router: Router = Router();
//const { runDockerContainer } = require('../utils/docker-run');

/**
 * @route   GET /
 * @desc    A protected route main application
 * @access  Admin/Instructor/Student
 */

router.get(
  "/",
  checkAuthentication,
  checkPermission(["read_dashboard"]),
  getIndex,
);

/**
 * @route   GET /permissions
 * @desc    A protected route for getting current logged in user's correct permissions
 * @access  Admin/Instructor/Student
 */

router.get(
  "/permissions",
  checkAuthentication,
  redisCache(),
  getUserPermissions,
);

/*
router.post('/run-docker', async function(req, res, next) {
  const { containerName, imageName, portNumber } = req.body;

  if (!containerName || !imageName) {
    return res.status(400).json({ error: '"Container name and image name are required' });
  }

  try {
    const containerId = await runDockerContainer(containerName, imageName);
    res.send({ success: true, containerId });
  } catch (error) {
    console.error('Error running Docker container:', error);
    res.status(500).json({ error: 'Failed to start Docker container', details: error.message });
  }
});
*/

router.use('/proxy/mongo-gui', mongoWebGuiProxyInstance)

export default router;
