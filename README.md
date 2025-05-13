# 🚀 Gns3LabLauncher - Automatic Deployment of GNS3 Instances

GNS3 (Graphical Network Simulator-3) is a powerful network simulation tool that allows users to design, configure, and test network topologies in a virtualized environment. 🌐 It is widely used by network engineers, cybersecurity professionals such as penetration testers, educators, and students to emulate real-world networking and security scenarios without the need for physical hardware. 🖥️ Beyond penetration testing, GNS3 is also utilized for tasks such as network design, troubleshooting, performance optimization, and training. Its support for a variety of devices, including routers, switches, firewalls, and other network appliances, makes it an essential tool for a broad range of networking and cybersecurity applications. 🔧

### 🤔 What Does This Launcher Do?

The launcher provides automated GNS3 sessions and can be accessed via a web GUI or desktop GUI. 🖱️💻

---

# ✨ Features
- 🛠️ **Session management** for efficient control of GNS3 instances with Docker.
- 💾 **Persistent project files** to save work seamlessly.
- 🔒 **OpenVPN integration** for secure connectivity with **Split Tunneling configuration** to route traffic only destined to private networks, preventing congestion.
- 🌐 **GNS3 WebGUI interface** for easy access and management.

---

# 🎯 Motivation

Gns3LabLauncher was created to provide students, educators, and professionals with streamlined access to virtualized network environments—especially in situations where physical hardware is unavailable or limited. 📚 While tools like Cisco Packet Tracer are useful for learning concepts, they often fall short when it comes to simulating real-world scenarios and device behavior. 🌍

This project addresses the gap by automating the deployment of GNS3 labs and enabling secure, remote access via OpenVPN. Gns3LabLauncher offers a scalable and flexible platform for hands-on training in network design, configuration, troubleshooting, and security testing. 🛡️ It empowers instructors to deliver immersive, practical learning experiences and allows students to develop real-world skills from virtually anywhere. 🌟

---

# 🐳 Docker Repositories
- 📦 `rimorgin/docker-gns3-server`
- 📦 `rimorgin/openvpn`

---

# 🖥️ Client-Side Requirements
- 🔑 `openvpn`
- 🌐 `gns3client` application/web GUI
