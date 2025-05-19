const { exec } = require("child_process");
const { promisify } = require("util");
const execAsync = promisify(exec);

/*
 * Runs a Docker container with the specified container name.
 * * @param {string} containerName - The name of the Docker container.
 * * @param {function} callback - The callback function to handle the result.
 * * @returns {void}
*/

async function runGns3ServerDockerContainer(containerName) {
  if (!containerName ) {
    throw new Error("Container name is required");
  }

  let command = `docker run -d --name ${containerName} \
                --restart unless-stopped \
                -h gns3vm --privileged \
                --network host \
                --cap-add=NET_ADMIN \   
                
                -e GNS3_USERNAME=${containerName} \
                -e SSL=true -e OPENVPN=true\
                -v ${process.cwd()}/src/server/var/:/data \
                rimorgin/gns3server`;

  try {
    const { stdout, stderr } = await execAsync(command);
    if (stderr) console.warn(`Docker stderr: ${stderr}`);
    //console.log(`Docker stdout: ${stdout}`);
    return stdout.trim(); // container ID
  } catch (error) {
    console.error(`Docker error: ${error.message}`);
    throw error;
  }
}

async function checkContainerHealth(containerId) {
  const startPeriod = 10 * 1000; // ms
  const interval = 10 * 1000; // ms
  const timeout = 5 * 1000; // ms
  const retries = 5;

  console.log(`Waiting ${startPeriod / 1000}s for container to start...`);
  await new Promise(resolve => setTimeout(resolve, startPeriod));

  for (let i = 0; i < retries; i++) {
    try {
      const { stdout } = await execAsync(
        `docker exec ${containerId} /bin/sh -c 'pgrep openvpn'`,
        { timeout }
      );

      if (stdout.trim()) {
        console.log(`Health check passed on attempt ${i + 1}`);
        return true;
      }
    } catch (error) {
      console.warn(`Health check failed on attempt ${i + 1}: ${error.message}`);
    }

    if (i < retries - 1) {
      console.log(`Retrying in ${interval / 1000}s...`);
      await new Promise(resolve => setTimeout(resolve, interval));
    }
  }

  console.error('Container failed health checks');
  return false;
}


module.exports = { runGns3ServerDockerContainer, checkContainerHealth };