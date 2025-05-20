//index.js

import { Router } from 'express';
import { getIndex, getUsers } from '@srvr/controllers/index.controller.js';
import { checkAuthentication, checkPermission } from '@srvr/middlewares/auth.middleware.js';

const router = Router();
//const { runDockerContainer } = require('../utils/docker-run');

router.get('/', checkAuthentication, getIndex)
router.get('/users', checkAuthentication, getUsers)


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

export default router;