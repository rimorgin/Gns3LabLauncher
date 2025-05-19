import { exec } from 'child_process';
import { networkInterfaces } from 'os';
import { envMongoDBUsername, envMongoDBPassword } from '../configs/env.config.js';

function startMongoDB() {
  return new Promise((resolve, reject) => {
    const start_mongodb = exec(
      `docker run --rm \
      --name mongodb \
      -e MONGO_INITDB_ROOT_USERNAME="${envMongoDBUsername}" \
      -e MONGO_INITDB_ROOT_PASSWORD="${envMongoDBPassword}" \
      -v "${process.cwd()}/src/server/var/mongodb:/data/db" \
      -p 27017:27017 \
      mongo:latest`
    );
    // Stream stdout
    start_mongodb.stdout.on('data', function onData(data) {
      console.log(`${data}`);
      // Check if MongoDB is ready
      if (data.includes('Waiting for connections')) {
        start_mongodb.stdout.off('data', onData); // Remove listener after resolve
        // silently start mongodb gui admin
        exec('mongo-gui -u mongodb://gns3mongodb:aisnf%5E*jawgwie%5E%26*SADgjna493utnqaisjdgno_es0j340yaerg@localhost:27017/ -p 5001', { stdio: 'ignore', detached: true }).unref();
        resolve();
      }
    });

    // Stream stderr
    start_mongodb.stderr.on('data', (data) => {
        console.error(`${data}`);
    });

    // Handle process exit
    start_mongodb.on('close', (code) => {
        if (code !== 0) {
            reject(new Error(`MongoDB process exited with code ${code}`));
        }
    });
  });
}

async function startRedis() {
    return new Promise((resolve, reject) => {
        const start_redis = exec('docker run --rm --name redis -p 6379:6379 redis:8.0-rc1');

        start_redis.stdout.on('data', function onData(data) {
          console.log(`${data}`);
          // Check if Redis is ready
          if (data.includes('Ready to accept connections')) {
            start_redis.stdout.off('data', onData); // Remove listener after resolve
            resolve();
          }
        });

        // Stream stderr
        start_redis.stderr.on('data', (data) => {
            console.error(`${data}`);
        });

        // Handle process exit
        start_redis.on('close', (code) => {
            if (code !== 0) {
                reject(new Error(`Redis process exited with code ${code}`));
            }
        });
    });
}

function startOpenVPN() {
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

    return new Promise((resolve, reject) => {

        const start_openvpn = exec(`docker run --rm \
            --privileged --name openvpn \
            -p 1194:1194/udp \
            --cap-add=NET_ADMIN \
            --cap-add=MKNOD \
            -v ${process.cwd()}/src/server/var/openvpn/:/data \
            -e OPENVPN_SERVER_IP=${SERVER_IP} \
            rimorgin/openvpn`)

        start_openvpn.stdout.on('data', function onData(data) {
          console.log(`${data}`);
          // Check if Redis is ready
          if (data.includes('Initialization Sequence Completed')) {
            start_openvpn.stdout.off('data', onData); // Remove listener after resolve
            resolve();
          }
        });
        

        // Stream stderr
        start_openvpn.stderr.on('data', (data) => {
            console.error(`${data}`);
        });

        // Handle process exit
        start_openvpn.on('close', (code) => {
            if (code !== 0) {
                reject(new Error(`OpenVPN process exited with code ${code}`));
            }
        });
    })
}

async function startApp() {
    try {
        await startMongoDB();
        await startRedis();
        await startOpenVPN();
        console.log('MongoDB, Redis and OpenVPN are both ready. Starting the app...');
        
        const start_app = exec('npm run dev');

        // Stream stdout
        start_app.stdout.on('data', (data) => {
            console.log(`${data}`);
        });

        // Stream stderr
        start_app.stderr.on('data', (data) => {
            console.error(`${data}`);
        });

        // Handle process exit
        start_app.on('close', (code) => {
            console.log(`App process exited with code ${code}`);
        });

        // Handle graceful shutdown
        const shutdown = () => {
            console.log('\nShutting down services gracefully...');

            // Optionally stop containers via Docker CLI too
            exec('docker stop redis openvpn mongodb', (err) => {
                if (err) console.warn('Error stopping containers:', err.message);
                else console.log('Containers stopped.');
                process.exit(0);
            });
        };

        // Listen for termination signals
        process.on('SIGINT', shutdown);
        process.on('SIGTERM', shutdown);
        process.on('SIGQUIT', shutdown);

    } catch (error) {
        console.error('Failed to start:', error.message);
    }
}

startApp();