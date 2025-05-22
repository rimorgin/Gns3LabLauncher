import { exec } from 'child_process';
import { networkInterfaces } from 'os';

function startContainers() {

  const nets = networkInterfaces();
    let SERVER_IP = '';

    for (const name of Object.keys(nets)) {
        for (const net of nets[name]) {
            // Check for IPv4 and non-internal addresses
            if (net.family === 'IPv4' && !net.internal) {
                SERVER_IP = net.address;
                break;
            }
        }
        if (SERVER_IP) break;
    }

    if (!SERVER_IP) {
        throw new Error('Unable to determine the local machine IP address.');
    }


  return new Promise<void>((resolve, reject) => {
    const start_containers = exec(
      `docker compose -f docker-compose.yml --env-file ./.env up `
    );
    // Stream stdout
    start_containers.stdout.on('data', function onData(data) {
      console.log(`${data}`);
      // Check if MongoDB is ready
      if (data.includes('Waiting for connections')) {
        start_containers.stdout.off('data', onData); // Remove listener after resolve
        resolve();
      }
    });

    // Stream stderr
    start_containers.stderr.on('data', (data) => {
        console.error(`${data}`);
    });

    // Handle process exit
    start_containers.on('close', (code) => {
        if (code !== 0) {
            reject(new Error(`Process exited with code ${code}`));
        }
    });

     // Handle graceful shutdown
     const shutdown = () => {
      console.log('\nShutting down services gracefully...');

          // Optionally stop containers via Docker CLI too
          exec('docker compose down', (err) => {
              if (err) console.warn('Error stopping containers:', err.message);
              else console.log('Containers stopped.');
              process.exit(0);
          });
      };

      // Listen for termination signals
      process.on('SIGINT', shutdown);
      process.on('SIGTERM', shutdown);
      process.on('SIGQUIT', shutdown);

  });
}

startContainers();