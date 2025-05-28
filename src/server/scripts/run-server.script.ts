import { exec, execSync } from 'child_process';
import { promisify } from 'util';
import fs from 'fs';
import path from 'path';

const MODE = process.env.NODE_ENV;

console.log('Environment mode:', MODE);

let runScript: string;
let runEnvFile: string;

if (MODE === 'production') {
  runScript = 'yarn run prod';
  runEnvFile = './.env.production';
} else {
  runScript = 'yarn run dev';
  runEnvFile = './.env.development';
}

const execAsync = promisify(exec);

// Create certs if in production
function createCertsIfNeeded(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (MODE !== 'production') return resolve();

    const certDir = path.resolve('./cert');
    const services = ['vite-express', 'mongo-gui'];

    try {
      if (!fs.existsSync(certDir)) {
        fs.mkdirSync(certDir, { recursive: true });
      }

      for (const service of services) {
        const keyPath = path.join(certDir, `${service}.key.pem`);
        const certPath = path.join(certDir, `${service}.cert.pem`);

        const keyExists = fs.existsSync(keyPath);
        const certExists = fs.existsSync(certPath);

        if (!keyExists || !certExists) {
          console.log(`🔐 Generating self-signed HTTPS certs for ${service}...`);

          execSync(
            `openssl req -x509 -newkey rsa:2048 -nodes -keyout ${keyPath} -out ${certPath} -days 365 -subj "/CN=localhost"`
          );

          console.log(`✅ HTTPS certs generated for ${service}`);
        }
      }

      resolve();
    } catch (err: any) {
      console.error('❌ Failed to generate certificates:', err.message);
      reject(err);
    }
  });
}



// Starts Docker containers
async function startContainers(): Promise<void> {
  console.log('🐳 Starting Docker containers...');
  try {
    const { stdout, stderr } = await execAsync(
      `docker compose -f docker-compose.yml --env-file ${runEnvFile} up -d`
    );
    if (stdout) console.log(stdout);
    if (stderr) console.error(stderr);
  } catch (error: any) {
    console.error('❌ Failed to start containers:', error.stderr || error.message);
    throw error;
  }
}

// Starts the application
async function startViteExpress(): Promise<void> {
  createCertsIfNeeded();
  await startContainers();

  const appProcess = exec(runScript);

  appProcess.stdout?.on('data', (data) => {
    console.log(`[APP LOG]: ${data}`);
  });

  appProcess.stderr?.on('data', (data) => {
    console.error(`[APP ERROR]: ${data}`);
  });

  const shutdown = () => {
    console.log('\n🛑 Shutting down services gracefully...');
    exec('rm -rf /home/rimor/Documents/VSCodes/Gns3LabLauncher/cert', err => {
      if (err) {
        console.warn('⚠️ Error removing dir: ', err.message);
      } else {
        console.log('✅ cert directory removed');
      }
    })
    exec(`docker compose -f docker-compose.yml --env-file ${runEnvFile} down`, (err) => {
      if (err) {
        console.warn('⚠️ Error stopping containers:', err.message);
      } else {
        console.log('✅ All containers stopped.');
      }
      process.exit(0);
    });
  };

  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
  process.on('SIGQUIT', shutdown);
  process.on('uncaughtException', (err) => {
    console.error('❌ Uncaught exception:', err);
    shutdown();
  });
}

startViteExpress();
