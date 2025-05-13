//index.js

const router = require('express').Router();
const { getIndex, getDashboard } = require('../controllers/index.controller');
const { redirectIfAuthenticated } = require('../middlewares/auth.middleware')
const { runDockerContainer } = require('../utils/docker-run');

router.get('/',getIndex)

// Routes
router.get('/dashboard', getDashboard)

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


module.exports = router;