const { exec } = require('child_process');
const { networkInterfaces } = require('os');

function startRedis() {
    return new Promise((resolve, reject) => {
        const start_redis = exec('docker run --rm --name redis -p 6379:6379 redis:8.0-rc1');

        // Stream stdout
        start_redis.stdout.on('data', (data) => {
            console.log(`${data}`);
            // Check if Redis is ready
            if (data.includes('Ready to accept connections')) {
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
            -v ${process.cwd()}/data/docker/openvpn/:/data \
            -e OPENVPN_SERVER_IP=${SERVER_IP} \
            rimorgin/openvpn`)

        start_openvpn.stdout.on('data', (data) => {
            console.log(`${data}`);
            // Check if OpenVPN is ready
            if (data.includes('Initialization Sequence Completed')) {
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
        await startRedis();
        await startOpenVPN();
        console.log('Redis and OpenVPN are both ready. Starting the app...');
        const start_app = exec('npm run post-start');

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
            console.log('\nShutting down services...');

            // Optionally stop containers via Docker CLI too
            exec('docker stop redis openvpn', (err) => {
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