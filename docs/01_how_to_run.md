
# 🧪 How to Run Gns3LabLauncher

This guide walks you through setting up and running the **Gns3LabLauncher** system, covering both server and client environments. Note that openvpn is optional if you want secure connections.

---

## 🖥️ Server Requirements

### 1. Node.js (v18+)
Install Node.js and npm:

```bash
sudo apt update
sudo apt install nodejs npm
node -v
````

> 💡 For the latest versions, consider using [NodeSource](https://github.com/nodesource/distributions).

---

### 2. Docker

Install Docker and enable it on system boot:

```bash
sudo apt install docker.io
sudo systemctl enable --now docker
sudo usermod -aG docker $USER
newgrp docker  # Apply group change
```

---

### 3. OpenVPN

Install OpenVPN:

```bash
sudo apt install openvpn
```

* Connect using a `.ovpn` file.
* The server certificate **must** have the common name `Gns3LabLauncherServer`.

---

### 4. Docker MacVLAN Networking

Ensure your Linux system supports MacVLAN networking.

* [Docker MacVLAN Docs →](https://docs.docker.com/network/macvlan/)

Create a MacVLAN network (replace `eth0` with your actual interface):

```bash
docker network create -d macvlan \
  --subnet=192.168.100.0/24 \
  --gateway=192.168.100.1 \
  -o parent=eth0 \
  gns3vlan
```
strictly name the docker network into: ___gns3vlan___

---

## 💻 Client Requirements

### 1. GNS3 Client

Download and install:

- [GNS3 Desktop GUI](https://www.gns3.com/software/download) or [GNS3 WebClient](https://www.gns3.com/software/download). Download the installer and you can select whether you install either Desktop GUI along with WebClient or Desktop GUI alone.

---

### 2. OpenVPN

Install OpenVPN:

```bash
sudo apt install openvpn
```

For improved DNS support on Linux, only if OPENVPN Server is configured/enabled to have DNS compatibility:

```bash
sudo apt install openvpn-systemd-resolved
```

---

## 🚀 Running Gns3LabLauncher

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd Gns3LabLauncher
```

---

### 2. Install Dependencies

Using npm:

```bash
npm install
```

Or using yarn:

```bash
yarn install
```

---

## 🏗️ Running in Production

### 1. Build the Frontend

```bash
npm run build:production
```

---

### 2. Start the Backend Server

```bash
npm run start:prod
```

> This runs:
>
> ```json
> "start:prod": "NODE_ENV=production sx src/server/scripts/run-server.script.ts"
> ```

Make sure:

* `.env` is configured
* `tsx` is globally installed (`npm i -g tsx`)

---

### 3. Recommended Production Setup

* ✅ Use [PM2](https://pm2.keymetrics.io/) or `systemd` to manage the server
* 🔐 Secure your `.env` and secrets
* 🛠️ Monitor services (Docker, OpenVPN, MacVLAN)

---

## 🧰 Troubleshooting & Tips

| Issue                   | Solution                                              |
| ----------------------- | ----------------------------------------------------- |
| Docker not running?     | Use `docker ps` to verify                             |
| OpenVPN not connecting? | Use `ip a` to check for `tun0` or `tap0`              |
| MacVLAN not working?    | Ensure correct `parent` interface, avoid IP conflicts |
| Node.js crash/restart?  | Use PM2 logs or `journalctl` if using systemd         |

---

## 📦 Key Scripts Summary

| Script             | Description                           |
| ------------------ | ------------------------------------- |
| `build:production` | Builds frontend for production        |
| `start:prod`       | Starts backend with production config |

> 🔎 See `package.json` for full script list.

---

## 🔐 OpenVPN Notes

* Ensure both server and client use correct `.ovpn` files and matching CNs.
* Example CNs:

  * Server: `Gns3LabLauncherServer`
  * Clients: `ClientA`, `Student01`, etc.

---

## 📚 Further Reading

* [`/docs/`](./docs) folder for advanced configuration
* [Docker MacVLAN Documentation](https://docs.docker.com/network/macvlan/)
* [GNS3 Official Docs](https://docs.gns3.com/)

