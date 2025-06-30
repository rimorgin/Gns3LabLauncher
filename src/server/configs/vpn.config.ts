import { exec } from "child_process";
import { spawn } from "child_process";
import path from "path";
import fs from "fs";

// Get today's date in YYYY-MM-DD
const today = new Date();
const configDate = today.toISOString().split("T")[0]; // '2025-05-28'

const openvpnConfigPath = path.join(
  process.cwd(),
  "/src/server/var/openvpn",
  `netlab-${configDate}`,
  `netlab-${configDate}-LINUX.ovpn`,
);

const checkOpenVPNHealth = () =>
  new Promise<boolean>((resolve) => {
    exec(
      "docker exec openvpn cat /etc/openvpn/openvpn.log | grep 'Initialization Sequence Completed'",
      (error, stdout, stderr) => {
        if (
          error ||
          stderr ||
          !stdout.includes("Initialization Sequence Completed")
        ) {
          return resolve(false);
        }
        resolve(true);
      },
    );
  });

export const connectToOpenVPNServer = (): Promise<boolean> => {
  return new Promise((resolve) => {
    if (!fs.existsSync(openvpnConfigPath)) {
      throw new Error(
        `OpenVPN config file not found at ${openvpnConfigPath}. Please ensure the file exists and is correctly named and try again.`,
      );
    }
    //console.log(openvpnConfigPath)
    const vpnProcess = spawn("openvpn", ["--config", openvpnConfigPath]);

    let output = "";

    vpnProcess.stdout.on("data", (data) => {
      output += data.toString();
      console.log(output);
      if (output.includes("Initialization Sequence Completed")) {
        console.log("✅ OpenVPN connected");
        resolve(true);
      }
    });

    vpnProcess.stderr.on("data", (data) => {
      console.error("❌ VPN Error:", data.toString());
    });

    vpnProcess.on("exit", (code) => {
      console.error(`[APP ERROR]: VPN exited with code ${code}`);
    });

    setTimeout(() => {
      if (!output.includes("Initialization Sequence Completed")) {
        console.error("❌ VPN connection timed out. Killing process...");
        vpnProcess.kill("SIGTERM");
        resolve(false);
      }
    }, 15000);
  });
};

export default async function vpnConnect() {
  let isOpenVPNHealthy = false;

  while (!isOpenVPNHealthy) {
    const healthy = await checkOpenVPNHealth();
    if (healthy) {
      console.log("✅ OpenVPN is healthy");
      isOpenVPNHealthy = true;
      break;
    } else {
      console.log("⏳ Waiting for OpenVPN...");
      await new Promise((res) => setTimeout(res, 2000));
    }
  }

  await connectToOpenVPNServer();
}
