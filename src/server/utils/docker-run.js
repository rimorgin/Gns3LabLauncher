const { exec } = require("child_process");
const { promisify } = require("util");
const execAsync = promisify(exec);

/*
 * Runs a Docker container with the specified image and container name.
 * * @param {string} imageName - The name of the Docker image to run.
 * * @param {string} containerName - The name of the Docker container.
 * * @param {function} callback - The callback function to handle the result.
 * * @returns {void}
*/

async function runDockerContainer(containerName, imageName, portNumber) {
  if (!containerName || !imageName) {
    throw new Error("Container name and image name are required");
  }
  switch (imageName) {
    case "openvpn":
      imageName = "rimorgin/openvpn";
      break;
    case "gns3":
      imageName = "rimorgin/gns3server";
      break;
    default:
      throw new Error("Unsupported image name");
  }

  let command = `docker run -d --name ${containerName} --restart unless-stopped --privileged`;

  if (imageName === "rimorgin/openvpn") {
    command += ` \
    --cap-add=NET_ADMIN \
    -p 1194:1194/udp \
    -e OPENVPN_SERVER_IP=10.15.20.34 \
    --device /dev/net/tun:/dev/net/tun \
    -v ${process.cwd().replace(/\\/g, "/")}/data/docker/openvpn:/data`;
  } else if (imageName === "rimorgin/gns3server") {
    if (!portNumber) throw new Error("port number for gns3 is required");
    command += ` \
    --cap-add=NET_ADMIN \
    -p ${portNumber}:3080 \
    -e BRIDGE_ADDRESS=172.21.1.1/24 \
    -v ${process.cwd().replace(/\\/g, "/")}/data/docker/gns3:/data`;
  }

  command += ` ${imageName}`;

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


module.exports = {runDockerContainer, checkContainerHealth};