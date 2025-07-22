import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

/*
 * Runs a Docker container with the specified container name.
 * * @param {string} containerName - The name of the Docker container.
 * * @param {function} callback - The callback function to handle the result.
 * * @returns {void}
 */
async function runGns3ServerDockerContainer(containerName: string) {
  const command = `docker run -d --rm \
                --name ${containerName} \
                -h gns3vm --privileged \
                --network host \
                --cap-add=NET_ADMIN \
                -e GNS3_USERNAME=${containerName} \
                -e SSL=true\
                -v /var/opt/gns3lablauncher/gns3:/data \
                rimorgin/gns3server`;

  try {
    const { stdout, stderr } = await execAsync(command);
    if (stderr) console.warn(`Docker stderr: ${stderr}`);
    //console.log(`Docker stdout: ${stdout}`);
    return stdout.trim(); // container ID
  } catch (error) {
    console.error(`Docker error: ${error}`);
    throw error;
  }
}

async function stopGns3ServerDockerContainer(containerName: string) {
  const command = `docker stop ${containerName}`;
  try {
    const { stdout, stderr } = await execAsync(command);
    if (stderr) console.warn(`Docker stderr: ${stderr}`);
    //console.log(`Docker stdout: ${stdout}`);
    return stdout.trim(); // container ID
  } catch (error) {
    console.error(`Docker error: ${error}`);
    throw error;
  }
}

export { runGns3ServerDockerContainer, stopGns3ServerDockerContainer };
