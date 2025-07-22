import {
  IconDashboard,
  IconUserScreen,
  IconFolder,
  IconHelp,
  IconSearch,
  IconSettings,
  IconUsers,
  IconHeartCog,
  IconCheckupList,
  IconCalendarWeekFilled,
  IconChalkboardTeacher,
  IconMessage2Code,
  IconUsersGroup,
  IconDatabase,
  IconLibrary,
  IconSandbox,
} from "@tabler/icons-react";
import type {
  LabTemplate,
  LabTemplateCategory,
} from "@clnt/types/lab-template";

// Define NavConfig type if not imported from elsewhere
export type NavConfig = {
  main: Array<{ title: string; icon: React.FC }>;
  reports: Array<{ title: string; icon: React.FC }>;
  system: Array<{ title: string; icon: React.FC }>;
  secondary: Array<{ title: string; url: string; icon: React.FC }>;
};

export type ImagesConfig = {
  courseImages: {
    name: string;
    src: string;
  }[];
  userGroupImages: {
    name: string;
    src: string;
  }[];
  projectImages: {
    name: string;
    src: string;
    tags: string;
  }[];
};

export const data = {
  nav: {
    main: [
      {
        title: "Dashboard",
        icon: IconDashboard,
      },
      {
        title: "Users",
        icon: IconUsers,
      },
      {
        title: "User Groups",
        icon: IconUsersGroup,
      },
      {
        title: "Course",
        icon: IconChalkboardTeacher,
      },
      {
        title: "Classroom",
        icon: IconUserScreen,
      },
      {
        title: "Projects",
        icon: IconFolder,
      },
      {
        title: "Labs Library",
        icon: IconLibrary,
      },
      {
        title: "Labs Playground",
        icon: IconSandbox,
      },
    ],
    /*   documents: [
      {
        name: "Data Library",
        url: "#",
        icon: IconDatabase,
      },
      {
        name: "Reports",
        url: "#",
        icon: IconReport,
      },
      {
        name: "Word Assistant",
        url: "#",
        icon: IconFileWord,
      },
    ], */
    reports: [
      {
        title: "Completions",
        icon: IconCheckupList,
      },
      {
        title: "Calendar",
        icon: IconCalendarWeekFilled,
      },
    ],
    system: [
      {
        title: "Data Library",
        icon: IconDatabase,
      },
      {
        title: "System Health",
        icon: IconHeartCog,
      },
      {
        title: "System Logs",
        icon: IconMessage2Code,
      },
    ],
    secondary: [
      {
        title: "Settings",
        url: "#",
        icon: IconSettings,
      },
      {
        title: "Get Help",
        url: "#",
        icon: IconHelp,
      },
      {
        title: "Search",
        url: "#",
        icon: IconSearch,
      },
    ],
  } satisfies NavConfig,

  navItemsByRole: {
    administrator: [
      "Dashboard",
      "Users",
      "User Groups",
      "Course",
      "Classroom",
      "Projects",
      "Labs Library",
      "Labs Playground",
      "Completions",
      "Calendar",
      "Data Library",
      "System Health",
      "System Logs",
    ],
    instructor: [
      "Dashboard",
      "Users",
      "User Groups",
      "Course",
      "Classroom",
      "Projects",
      "Labs Library",
      "Labs Playground",
      "Completions",
      "Calender",
    ],
    student: ["Classroom", "Completions", "Calendar"],
  },

  images: {
    courseImages: [
      {
        name: "alpine-forest",
        src: "src/client/assets/courses/9f9c813d-d96a-46dc-bd19-6f7b658d218e.jpg",
      },
      {
        name: "azure-sky",
        src: "src/client/assets/courses/b146bd30-776a-4052-afab-24103530d50b.jpg",
      },
      {
        name: "crimson-sunset",
        src: "src/client/assets/courses/b899dcd9-9d1b-4a19-97c0-6c2e0d157f5e.jpg",
      },
      {
        name: "emerald-lake",
        src: "src/client/assets/courses/fb608910-bafe-43d4-87a0-2a47e81356ef.jpg",
      },
      {
        name: "golden-meadow",
        src: "src/client/assets/courses/4c4e0c3b-bf85-4081-989b-8e3ea4a57bd5.jpg",
      },
      {
        name: "silent-harbor",
        src: "src/client/assets/courses/721cb2f0-5168-409a-b178-79728ed92e37.jpg",
      },
      {
        name: "misty-mountain",
        src: "src/client/assets/courses/156008b4-1855-4d09-ade4-07e4082eb333.jpg",
      },
      {
        name: "silver-river",
        src: "src/client/assets/courses/f86c62db-cfd6-4a02-b5b3-1d078fc4445c.jpg",
      },
      {
        name: "autumn-valley",
        src: "src/client/assets/courses/9b10ab1d-ea21-4d94-8af4-013ce21624cf.jpg",
      },
      {
        name: "frosty-peak",
        src: "src/client/assets/courses/6ecc0531-e6d0-453e-8fe7-750cd018f88a.jpg",
      },
      {
        name: "sunny-hills",
        src: "src/client/assets/courses/f95ab719-ed40-44c0-b248-2952c4118eee.jpg",
      },
      {
        name: "quiet-cove",
        src: "src/client/assets/courses/936ef989-53d2-4dfc-b7ce-7254ec2ff936.jpg",
      },
      {
        name: "hidden-grove",
        src: "src/client/assets/courses/e75380af-8b60-4c26-a676-8868f6645965.jpg",
      },
      {
        name: "willow-creek",
        src: "src/client/assets/courses/e75380af-8b60-4c26-a676-8868f6645965.jpg",
      },
      {
        name: "pine-ridge",
        src: "src/client/assets/courses/4a4118ab-b27d-44ae-90ba-b1e48be85f79.jpg",
      },
    ],
    userGroupImages: [
      {
        name: "crazy-groups",
        src: "src/client/assets/groups/6ddaf776-ebf9-4cae-91cd-1a1b95b89857.jpg",
      },
      {
        name: "azure-groups",
        src: "src/client/assets/groups/794e9a10-dd3b-4e75-97e9-dd8500fcc073.jpg",
      },
      {
        name: "groups-sunset",
        src: "src/client/assets/groups/0917a030-8ec5-44db-bc5f-623382437bec.jpg",
      },
      {
        name: "emerald-group",
        src: "src/client/assets/groups/c256245f-e63a-402b-81a3-688b57c28bda.jpg",
      },
    ],
    projectImages: [
      {
        name: "physical-topology",
        src: "src/client/assets/projects/1751433310.png",
        tags: "networking",
      },
      {
        name: "data-center",
        src: "src/client/assets/projects/4335662a-470a-42cc-af9b-7cd6b604b9de.jpg",
        tags: "networking",
      },
      {
        name: "data-center-2",
        src: "src/client/assets/projects/37bd2db6-bbd0-4524-93bc-ff5511f96f09.jpg",
        tags: "networking",
      },
      {
        name: "routers-and-switches",
        src: "src/client/assets/projects/8ba2115e-f708-4f8e-830e-9eb0d2da5332.jpg",
        tags: "networking",
      },
      {
        name: "routers-and-switches-2",
        src: "src/client/assets/projects/6c78003d-dbea-402d-99f2-9aac39e8ebb4.jpg",
        tags: "networking",
      },
      {
        name: "routers-and-switches-3",
        src: "src/client/assets/projects/7df2a902-d302-44ab-934d-abcd290ae2a1.jpg",
        tags: "networking",
      },
      {
        name: "hacking-guy",
        src: "src/client/assets/projects/dc31b93e-be9d-4d32-bafc-39fbb759cdf9.jpg",
        tags: "cybersecurity",
      },
      {
        name: "security-engineer",
        src: "src/client/assets/projects/b46c0a05-53a0-4a4a-932b-13502e5c96ef.jpg",
        tags: "cyberscurity",
      },
      {
        name: "malicious-attacker",
        src: "src/client/assets/projects/7e4efece-6b33-4fc8-a421-9c3bcfb79f25.jpg",
        tags: "cybersecurity",
      },
    ],
  } satisfies ImagesConfig,
};

export const labTemplates: LabTemplate[] = [
  {
    id: "basic-router-config",
    title: "Basic Router Configuration",
    description:
      "Learn fundamental router configuration including hostname, passwords, interface setup, and static routing",
    category: "Networking Fundamentals",
    difficulty: "BEGINNER",
    estimatedTime: 90,
    tags: ["router", "basic", "configuration", "interfaces", "static-routing"],
    thumbnail: "/templates/basic-router.png",
    objectives: [
      "Configure basic router settings including hostname and passwords",
      "Set up router interfaces with IP addresses and subnet masks",
      "Implement static routing between networks",
      "Test network connectivity using ping and traceroute",
      "Verify router configuration using show commands",
    ],
    prerequisites: [
      "Basic understanding of IP addressing and subnetting",
      "Familiarity with command line interfaces",
      "Knowledge of OSI model and TCP/IP stack",
    ],
    environment: {
      id: "lab_env_1",
      type: "GNS3",
      topology: {
        nodes: [
          {
            id: "r1",
            name: "Router1",
            type: "router",
            x: 200,
            y: 150,
            icon: "router",
            status: "stopped",
          },
          {
            id: "r2",
            name: "Router2",
            type: "router",
            x: 500,
            y: 150,
            icon: "router",
            status: "stopped",
          },
          {
            id: "pc1",
            name: "PC1",
            type: "pc",
            x: 100,
            y: 250,
            icon: "pc",
            status: "stopped",
          },
          {
            id: "pc2",
            name: "PC2",
            type: "pc",
            x: 600,
            y: 250,
            icon: "pc",
            status: "stopped",
          },
        ],
        links: [
          {
            id: "link1",
            source: "pc1",
            target: "r1",
            sourcePort: "eth0",
            targetPort: "g0/0",
            status: "down",
          },
          {
            id: "link2",
            source: "r1",
            target: "r2",
            sourcePort: "g0/1",
            targetPort: "g0/1",
            status: "down",
          },
          {
            id: "link3",
            source: "r2",
            target: "pc2",
            sourcePort: "g0/0",
            targetPort: "eth0",
            status: "down",
          },
        ],
        layout: {
          width: 800,
          height: 400,
        },
      },
      devices: [
        {
          id: "r1",
          name: "Router1",
          type: "router",
          applianceName: "Cisco 2901",
          ipAddress: "192.168.1.1",
          credentials: {
            username: "admin",
            password: "cisco",
          },
          interfaces: [
            {
              name: "GigabitEthernet0/0",
              ipAddress: "192.168.1.1",
              subnet: "255.255.255.0",
              enabled: false,
              status: "down",
            },
            {
              name: "GigabitEthernet0/1",
              ipAddress: "10.0.0.1",
              subnet: "255.255.255.252",
              enabled: false,
              status: "down",
            },
          ],
        },
        {
          id: "r2",
          name: "Router2",
          type: "router",
          applianceName: "Cisco 2901",
          ipAddress: "192.168.2.1",
          credentials: {
            username: "admin",
            password: "cisco",
          },
          interfaces: [
            {
              name: "GigabitEthernet0/0",
              ipAddress: "192.168.2.1",
              subnet: "255.255.255.0",
              enabled: false,
              status: "down",
            },
            {
              name: "GigabitEthernet0/1",
              ipAddress: "10.0.0.2",
              subnet: "255.255.255.252",
              enabled: false,
              status: "down",
            },
          ],
        },
        {
          id: "pc1",
          name: "PC1",
          type: "pc",
          applianceName: "Virtual PC",
          ipAddress: "192.168.1.10",
          interfaces: [
            {
              name: "eth0",
              ipAddress: "192.168.1.10",
              subnet: "255.255.255.0",
              enabled: true,
              status: "down",
            },
          ],
        },
        {
          id: "pc2",
          name: "PC2",
          type: "pc",
          applianceName: "Virtual PC",
          ipAddress: "192.168.2.10",
          interfaces: [
            {
              name: "eth0",
              ipAddress: "192.168.2.10",
              subnet: "255.255.255.0",
              enabled: true,
              status: "down",
            },
          ],
        },
      ],
    },

    guide: {
      id: "basic-router-guide",
      sections: [
        {
          id: "intro",
          title: "Introduction to Router Configuration",
          type: "introduction",
          order: 1,
          estimatedTime: 15,
          content: [
            {
              id: "intro-text",
              type: "text",
              content:
                "Welcome to the Basic Router Configuration lab. In this lab, you will learn the fundamentals of configuring Cisco routers, including basic settings, interface configuration, and static routing. This lab provides hands-on experience with essential networking concepts that form the foundation of network administration.",
            },
            {
              id: "topology-overview",
              type: "callout",
              content:
                "The lab topology consists of two routers (Router1 and Router2) connected via a point-to-point link, with a PC connected to each router's LAN interface. This simple topology allows you to practice basic routing concepts and inter-network communication.",
              metadata: {
                callout_type: "info",
              },
            },
            {
              id: "objectives-callout",
              type: "callout",
              content:
                "By the end of this lab, you will be able to configure basic router settings, set up interfaces, implement static routing, and verify network connectivity.",
              metadata: {
                callout_type: "info",
              },
            },
          ],
          tasks: [],
          verification: [],
          hints: [],
        },
        {
          id: "basic-config",
          title: "Basic Router Configuration",
          type: "step",
          order: 2,
          estimatedTime: 25,
          content: [
            {
              id: "hostname-intro",
              type: "text",
              content:
                "First, we'll configure basic settings on both routers including hostname, enable password, and console settings. These basic configurations are essential for router management and security.",
            },
            {
              id: "config-commands",
              type: "code",
              content: `Router> enable
Router# configure terminal
Router(config)# hostname Router1
Router1(config)# enable secret cisco
Router1(config)# line console 0
Router1(config-line)# password console
Router1(config-line)# login
Router1(config-line)# logging synchronous
Router1(config-line)# exec-timeout 0 0
Router1(config-line)# exit
Router1(config)# no ip domain-lookup`,
              metadata: {
                language: "cisco",
                device: "Router1",
              },
            },
            {
              id: "config-explanation",
              type: "text",
              content:
                "The commands above set the hostname to Router1, configure an enable secret password, set up console access with a password, enable synchronous logging to prevent command interruption, disable exec timeout, and turn off DNS lookups to speed up the CLI.",
            },
          ],
          tasks: [
            {
              id: "task1",
              description: "Configure hostname on Router1",
              device: "Router1",
              commands: ["enable", "configure terminal", "hostname Router1"],
              expectedResult: "Router prompt should change to Router1",
              isCompleted: false,
              hints: [
                "Use the hostname command in global configuration mode",
                "The prompt will change immediately after entering the command",
              ],
            },
            {
              id: "task2",
              description: "Set enable secret password to 'cisco'",
              device: "Router1",
              commands: ["enable secret cisco"],
              expectedResult: "Enable secret password is configured",
              isCompleted: false,
              hints: [
                "The enable secret command encrypts the password",
                "This password is required to enter privileged EXEC mode",
              ],
            },
            {
              id: "task3",
              description: "Configure console password and settings",
              device: "Router1",
              commands: [
                "line console 0",
                "password console",
                "login",
                "logging synchronous",
                "exec-timeout 0 0",
              ],
              expectedResult:
                "Console line is configured with password and settings",
              isCompleted: false,
              hints: [
                "Line console 0 configures the console port",
                "Logging synchronous prevents output from interrupting commands",
              ],
            },
          ],
          verification: [
            {
              id: "verify1",
              description: "Verify hostname configuration",
              command: "show running-config | include hostname",
              expectedOutput: "hostname Router1",
              device: "Router1",
              isCompleted: false,
            },
            {
              id: "verify2",
              description: "Verify enable secret is configured",
              command: "show running-config | include enable",
              expectedOutput: "enable secret",
              device: "Router1",
              isCompleted: false,
            },
          ],
          hints: [
            "Remember to enter global configuration mode first",
            "Save your configuration with 'copy running-config startup-config'",
          ],
        },
        {
          id: "interface-config",
          title: "Interface Configuration",
          type: "step",
          order: 3,
          estimatedTime: 30,
          content: [
            {
              id: "interface-intro",
              type: "text",
              content:
                "Now we'll configure the router interfaces with IP addresses. Proper interface configuration is crucial for network connectivity. We'll configure both the LAN interface (connected to PC1) and the WAN interface (connected to Router2).",
            },
            {
              id: "interface-commands",
              type: "code",
              content: `Router1(config)# interface gigabitethernet 0/0
Router1(config-if)# description LAN Interface to PC1
Router1(config-if)# ip address 192.168.1.1 255.255.255.0
Router1(config-if)# no shutdown
Router1(config-if)# exit
Router1(config)# interface gigabitethernet 0/1
Router1(config-if)# description WAN Interface to Router2
Router1(config-if)# ip address 10.0.0.1 255.255.255.252
Router1(config-if)# no shutdown`,
              metadata: {
                language: "cisco",
                device: "Router1",
              },
            },
            {
              id: "interface-explanation",
              type: "text",
              content:
                "The 'no shutdown' command is essential as router interfaces are administratively down by default. The description command helps with documentation and troubleshooting.",
            },
          ],
          tasks: [
            {
              id: "task4",
              description: "Configure GigabitEthernet0/0 interface on Router1",
              device: "Router1",
              commands: [
                "interface gigabitethernet 0/0",
                "description LAN Interface to PC1",
                "ip address 192.168.1.1 255.255.255.0",
                "no shutdown",
              ],
              expectedResult: "Interface should be configured and enabled",
              isCompleted: false,
              hints: [
                "Use 'interface gigabitethernet 0/0' to enter interface configuration mode",
                "Don't forget the 'no shutdown' command",
              ],
            },
            {
              id: "task5",
              description: "Configure GigabitEthernet0/1 interface on Router1",
              device: "Router1",
              commands: [
                "interface gigabitethernet 0/1",
                "description WAN Interface to Router2",
                "ip address 10.0.0.1 255.255.255.252",
                "no shutdown",
              ],
              expectedResult: "WAN interface should be configured and enabled",
              isCompleted: false,
              hints: [
                "The /30 subnet (255.255.255.252) is commonly used for point-to-point links",
                "Interface descriptions help with network documentation",
              ],
            },
          ],
          verification: [
            {
              id: "verify3",
              description: "Verify interface configuration",
              command: "show ip interface brief",
              expectedOutput:
                "GigabitEthernet0/0    192.168.1.1     YES manual up                    up",
              device: "Router1",
              isCompleted: false,
            },
            {
              id: "verify4",
              description: "Check interface status",
              command: "show interfaces gigabitethernet 0/0",
              expectedOutput: "GigabitEthernet0/0 is up, line protocol is up",
              device: "Router1",
              isCompleted: false,
            },
          ],
          hints: [
            "Interfaces are administratively down by default",
            "Use 'show ip interface brief' to quickly check all interfaces",
          ],
        },
        {
          id: "static-routing",
          title: "Static Routing Configuration",
          type: "step",
          order: 4,
          estimatedTime: 20,
          content: [
            {
              id: "routing-intro",
              type: "text",
              content:
                "Static routing allows routers to learn about remote networks manually. We'll configure static routes so that PC1 can communicate with PC2 through both routers.",
            },
            {
              id: "routing-commands",
              type: "code",
              content: `Router1(config)# ip route 192.168.2.0 255.255.255.0 10.0.0.2
Router1(config)# exit
Router1# show ip route static`,
              metadata: {
                language: "cisco",
                device: "Router1",
              },
            },
            {
              id: "routing-explanation",
              type: "text",
              content:
                "The static route tells Router1 that to reach the 192.168.2.0/24 network, it should forward packets to 10.0.0.2 (Router2's WAN interface).",
            },
          ],
          tasks: [
            {
              id: "task6",
              description:
                "Configure static route on Router1 to reach PC2's network",
              device: "Router1",
              commands: ["ip route 192.168.2.0 255.255.255.0 10.0.0.2"],
              expectedResult: "Static route should be added to routing table",
              isCompleted: false,
              hints: [
                "The syntax is: ip route destination_network subnet_mask next_hop",
                "The next hop is Router2's WAN interface IP",
              ],
            },
          ],
          verification: [
            {
              id: "verify5",
              description: "Verify static route in routing table",
              command: "show ip route static",
              expectedOutput: "S    192.168.2.0/24 [1/0] via 10.0.0.2",
              device: "Router1",
              isCompleted: false,
            },
          ],
          hints: [
            "Static routes have an administrative distance of 1",
            "Use 'show ip route' to see the complete routing table",
          ],
        },
        {
          id: "connectivity-test",
          title: "Testing Network Connectivity",
          type: "verification",
          order: 5,
          estimatedTime: 15,
          content: [
            {
              id: "testing-intro",
              type: "text",
              content:
                "Now we'll test connectivity between the networks using ping and traceroute commands. This verifies that our configuration is working correctly.",
            },
            {
              id: "ping-example",
              type: "code",
              content: `Router1# ping 10.0.0.2
Type escape sequence to abort.
Sending 5, 100-byte ICMP Echos to 10.0.0.2, timeout is 2 seconds:
!!!!!
Success rate is 100 percent (5/5), round-trip min/avg/max = 1/1/4 ms`,
              metadata: {
                language: "cisco",
                device: "Router1",
                command: "ping",
                expected_output: "Success rate is 100 percent",
              },
            },
          ],
          tasks: [
            {
              id: "task7",
              description: "Test connectivity to Router2's WAN interface",
              device: "Router1",
              commands: ["ping 10.0.0.2"],
              expectedResult:
                "Ping should be successful with 100% success rate",
              isCompleted: false,
              hints: [
                "Ping tests Layer 3 connectivity",
                "A successful ping shows !!!!! symbols",
              ],
            },
          ],
          verification: [
            {
              id: "verify6",
              description: "Verify ping to Router2",
              command: "ping 10.0.0.2",
              expectedOutput: "Success rate is 100 percent",
              device: "Router1",
              isCompleted: false,
            },
          ],
          hints: [
            "If ping fails, check interface status and IP configuration",
            "Use 'show ip route' to verify routing table",
          ],
        },
      ],
      currentSection: 0,
      completedSections: [],
    },
    resources: [
      {
        id: "cisco-commands",
        title: "Cisco IOS Command Reference",
        type: "reference",
        url: "/resources/cisco-ios-commands.pdf",
        description:
          "Complete reference guide for Cisco IOS commands used in basic router configuration",
      },
      {
        id: "subnetting-guide",
        title: "IP Subnetting Quick Reference",
        type: "cheat_sheet",
        url: "/resources/subnetting-cheatsheet.pdf",
        description: "Quick reference for IP subnetting and VLSM calculations",
      },
      {
        id: "troubleshooting-guide",
        title: "Router Troubleshooting Guide",
        type: "documentation",
        url: "/resources/router-troubleshooting.pdf",
        description:
          "Step-by-step troubleshooting procedures for common router issues",
      },
    ],
    variables: [
      {
        name: "router1_hostname",
        type: "string",
        defaultValue: "Router1",
        description: "Hostname for the first router",
        required: true,
      },
      {
        name: "router2_hostname",
        type: "string",
        defaultValue: "Router2",
        description: "Hostname for the second router",
        required: true,
      },
      {
        name: "lan1_network",
        type: "ip",
        defaultValue: "192.168.1.0",
        description: "Network address for LAN 1 (PC1's network)",
        required: true,
      },
      {
        name: "lan2_network",
        type: "ip",
        defaultValue: "192.168.2.0",
        description: "Network address for LAN 2 (PC2's network)",
        required: true,
      },
      {
        name: "wan_network",
        type: "ip",
        defaultValue: "10.0.0.0",
        description: "Point-to-point network between routers",
        required: true,
      },
      {
        name: "enable_password",
        type: "string",
        defaultValue: "cisco",
        description: "Enable secret password for privileged mode",
        required: true,
      },
    ],
    isPublic: true,
    authorId: "system",
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-15"),
    usageCount: 1247,
  },
  {
    id: "lab_1",
    title: "GNS3 Basic Router Configuration Lab",
    description:
      "Learn to configure basic router settings, interfaces, and routing in a hands-on GNS3 environment",
    difficulty: "BEGINNER",
    estimatedTime: 90,
    category: "Networking",
    tags: ["GNS3", "Routing", "Configuration", "Cisco"],
    objectives: [
      "Configure basic router settings and hostname",
      "Set up router interfaces with IP addresses",
      "Configure static routing between networks",
      "Verify connectivity using ping and traceroute",
      "Save and backup router configurations",
    ],
    prerequisites: [
      "Basic understanding of IP addressing",
      "Familiarity with command line interfaces",
      "GNS3 software installed (provided in lab environment)",
    ],
    environment: {
      id: "env_1",
      type: "GNS3",
      topology: {
        nodes: [
          {
            id: "r1",
            name: "Router1",
            type: "router",
            x: 150,
            y: 200,
            icon: "router",
            status: "running",
          },
          {
            id: "r2",
            name: "Router2",
            type: "router",
            x: 450,
            y: 200,
            icon: "router",
            status: "running",
          },
          {
            id: "pc1",
            name: "PC1",
            type: "pc",
            x: 50,
            y: 300,
            icon: "pc",
            status: "running",
          },
          {
            id: "pc2",
            name: "PC2",
            type: "pc",
            x: 550,
            y: 300,
            icon: "pc",
            status: "running",
          },
        ],
        links: [
          {
            id: "link1",
            source: "r1",
            target: "r2",
            sourcePort: "f0/1",
            targetPort: "f0/1",
            status: "up",
          },
          {
            id: "link2",
            source: "r1",
            target: "pc1",
            sourcePort: "f0/0",
            targetPort: "eth0",
            status: "up",
          },
          {
            id: "link3",
            source: "r2",
            target: "pc2",
            sourcePort: "f0/0",
            targetPort: "eth0",
            status: "up",
          },
        ],
        layout: { width: 600, height: 400 },
      },
      devices: [
        {
          id: "r1",
          name: "Router1",
          type: "Cisco 2691",
          ipAddress: "192.168.1.1",
          credentials: { username: "admin", password: "cisco" },
          interfaces: [
            {
              name: "FastEthernet0/0",
              ipAddress: "192.168.1.1",
              subnet: "255.255.255.0",
              status: "up",
            },
            {
              name: "FastEthernet0/1",
              ipAddress: "10.0.0.1",
              subnet: "255.255.255.252",
              status: "up",
            },
          ],
        },
        {
          id: "r2",
          name: "Router2",
          type: "Cisco 2691",
          ipAddress: "192.168.2.1",
          credentials: { username: "admin", password: "cisco" },
          interfaces: [
            {
              name: "FastEthernet0/0",
              ipAddress: "192.168.2.1",
              subnet: "255.255.255.0",
              status: "up",
            },
            {
              name: "FastEthernet0/1",
              ipAddress: "10.0.0.2",
              subnet: "255.255.255.252",
              status: "up",
            },
          ],
        },
        {
          id: "pc1",
          name: "PC1",
          type: "pc",
          applianceName: "Virtual PC",
          ipAddress: "192.168.1.10",
          interfaces: [
            {
              name: "eth0",
              ipAddress: "192.168.1.10",
              subnet: "255.255.255.0",
              status: "up",
            },
          ],
        },
        {
          id: "pc2",
          name: "PC2",
          type: "pc",
          applianceName: "Virtual PC",
          ipAddress: "192.168.2.10",
          interfaces: [
            {
              name: "eth0",
              ipAddress: "192.168.2.10",
              subnet: "255.255.255.0",
              status: "up",
            },
          ],
        },
      ],
      connections: [
        { id: "conn1", from: "r1", to: "r2", fromPort: "f0/1", toPort: "f0/1" },
        {
          id: "conn2",
          from: "r1",
          to: "pc1",
          fromPort: "f0/0",
          toPort: "eth0",
        },
        {
          id: "conn3",
          from: "r2",
          to: "pc2",
          fromPort: "f0/0",
          toPort: "eth0",
        },
      ],
    },
    guide: {
      id: "guide_1",
      currentSection: 0,
      completedSections: [],
      sections: [
        {
          id: "intro",
          title: "Lab Introduction and Objectives",
          type: "introduction",
          order: 1,
          estimatedTime: 10,
          content: [
            {
              id: "intro_text",
              type: "text",
              content: `<h3>Welcome to the GNS3 Basic Router Configuration Lab!</h3>
            <p>In this hands-on lab, you'll learn the fundamentals of router configuration using GNS3. This lab simulates a real network environment where you'll configure two Cisco routers to enable communication between different network segments.</p>
            
            <h4>What You'll Learn:</h4>
            <ul>
              <li>How to access and navigate Cisco router CLI</li>
              <li>Basic router configuration commands</li>
              <li>Interface configuration and IP addressing</li>
              <li>Static routing configuration</li>
              <li>Network connectivity verification</li>
            </ul>
            
            <h4>Lab Scenario:</h4>
            <p>You are a network administrator tasked with connecting two office locations. Each location has its own network segment, and you need to configure routers to enable communication between them.</p>`,
            },
            {
              id: "topology_overview",
              type: "callout",
              content:
                "The lab topology consists of two routers (Router1 and Router2) connected via a point-to-point link, with each router serving a local network segment with connected PCs.",
              metadata: { callout_type: "info" },
            },
          ],
          tasks: [],
          verification: [],
          hints: [],
        },
        {
          id: "step1",
          title: "Step 1: Access Router Console and Basic Configuration",
          type: "step",
          order: 2,
          estimatedTime: 20,
          content: [
            {
              id: "step1_intro",
              type: "text",
              content: `<h3>Accessing the Router Console</h3>
            <p>First, we need to access the router console to begin configuration. In GNS3, you can access the console by right-clicking on the router and selecting "Console".</p>
            
            <p>Once connected, you'll see the router prompt. Let's start with basic configuration.</p>`,
            },
            {
              id: "enable_mode",
              type: "terminal",
              content: "enable",
              metadata: {
                device: "Router1",
                command: "enable",
                expected_output: "Router1#",
              },
            },
            {
              id: "config_mode",
              type: "terminal",
              content: "configure terminal",
              metadata: {
                device: "Router1",
                command: "configure terminal",
                expected_output: "Router1(config)#",
              },
            },
            {
              id: "hostname_config",
              type: "code",
              content: `hostname R1
no ip domain-lookup
line console 0
 logging synchronous
 exec-timeout 0 0
exit`,
              metadata: {
                device: "Router1",
                language: "cisco",
              },
            },
            {
              id: "config_tip",
              type: "callout",
              content:
                "The 'no ip domain-lookup' command prevents the router from trying to resolve unknown commands as hostnames, which can cause delays. The console line configuration improves the user experience.",
              metadata: { callout_type: "tip" },
            },
          ],
          tasks: [
            {
              id: "task1_1",
              description:
                "Access Router1 console and enter privileged EXEC mode",
              device: "Router1",
              commands: ["enable"],
              expectedResult: "Router prompt changes to Router1#",
              isCompleted: false,
              hints: [
                "Use the 'enable' command to enter privileged mode",
                "The prompt should change from > to #",
              ],
            },
            {
              id: "task1_2",
              description:
                "Enter global configuration mode and set hostname to R1",
              device: "Router1",
              commands: ["configure terminal", "hostname R1"],
              expectedResult: "Router prompt changes to R1(config)#",
              isCompleted: false,
              hints: [
                "Use 'configure terminal' to enter config mode",
                "Use 'hostname R1' to set the hostname",
                "The prompt will reflect the new hostname",
              ],
            },
            {
              id: "task1_3",
              description:
                "Configure console line settings for better user experience",
              device: "Router1",
              commands: [
                "line console 0",
                "logging synchronous",
                "exec-timeout 0 0",
                "exit",
              ],
              expectedResult:
                "Console logging is synchronized and timeout is disabled",
              isCompleted: false,
              hints: [
                "Access console line configuration with 'line console 0'",
                "Use 'logging synchronous' to prevent log messages from interrupting commands",
                "Set 'exec-timeout 0 0' to disable automatic logout",
              ],
            },
          ],
          verification: [
            {
              id: "verify1_1",
              description: "Verify hostname configuration",
              command: "show running-config | include hostname",
              expectedOutput: "hostname R1",
              device: "Router1",
              isCompleted: false,
            },
          ],
          hints: [
            "Remember to press Enter after each command",
            "Use Tab key for command completion",
            "Use '?' for help with command syntax",
          ],
        },
        {
          id: "step2",
          title: "Step 2: Configure Router Interfaces",
          type: "step",
          order: 3,
          estimatedTime: 25,
          content: [
            {
              id: "step2_intro",
              type: "text",
              content: `<h3>Interface Configuration</h3>
            <p>Now we'll configure the router interfaces with IP addresses. Router1 has two interfaces:</p>
            <ul>
              <li><strong>FastEthernet0/0</strong>: Connected to PC1's network (192.168.1.0/24)</li>
              <li><strong>FastEthernet0/1</strong>: Connected to Router2 (10.0.0.0/30)</li>
            </ul>
            
            <p>Let's configure each interface step by step.</p>`,
            },
            {
              id: "interface_config",
              type: "code",
              content: `interface FastEthernet0/0
 ip address 192.168.1.1 255.255.255.0
 no shutdown
 description LAN Interface - Connected to PC1
exit

interface FastEthernet0/1
 ip address 10.0.0.1 255.255.255.252
 no shutdown
 description WAN Interface - Connected to Router2
exit`,
              metadata: {
                device: "Router1",
                language: "cisco",
              },
            },
            {
              id: "no_shutdown_tip",
              type: "callout",
              content:
                "The 'no shutdown' command is crucial! Cisco interfaces are administratively down by default. Always remember to bring them up with 'no shutdown'.",
              metadata: { callout_type: "warning" },
            },
          ],
          tasks: [
            {
              id: "task2_1",
              description:
                "Configure FastEthernet0/0 interface for LAN connectivity",
              device: "Router1",
              commands: [
                "interface FastEthernet0/0",
                "ip address 192.168.1.1 255.255.255.0",
                "no shutdown",
                "description LAN Interface - Connected to PC1",
                "exit",
              ],
              expectedResult: "Interface is configured and brought up",
              isCompleted: false,
              hints: [
                "Enter interface configuration mode with 'interface FastEthernet0/0'",
                "Set IP address with 'ip address 192.168.1.1 255.255.255.0'",
                "Don't forget 'no shutdown' to activate the interface",
              ],
            },
            {
              id: "task2_2",
              description:
                "Configure FastEthernet0/1 interface for WAN connectivity",
              device: "Router1",
              commands: [
                "interface FastEthernet0/1",
                "ip address 10.0.0.1 255.255.255.252",
                "no shutdown",
                "description WAN Interface - Connected to Router2",
                "exit",
              ],
              expectedResult: "WAN interface is configured and operational",
              isCompleted: false,
              hints: [
                "Use /30 subnet (255.255.255.252) for point-to-point links",
                "This interface connects to Router2's FastEthernet0/1",
                "Add a description to document the interface purpose",
              ],
            },
            {
              id: "task2_3",
              description:
                "Repeat the same configuration on Router2 with appropriate IP addresses",
              device: "Router2",
              commands: [
                "enable",
                "configure terminal",
                "hostname R2",
                "interface FastEthernet0/0",
                "ip address 192.168.2.1 255.255.255.0",
                "no shutdown",
                "exit",
                "interface FastEthernet0/1",
                "ip address 10.0.0.2 255.255.255.252",
                "no shutdown",
                "exit",
              ],
              expectedResult: "Router2 interfaces are configured",
              isCompleted: false,
              hints: [
                "Router2's LAN interface should be 192.168.2.1/24",
                "Router2's WAN interface should be 10.0.0.2/30",
                "Follow the same steps as Router1 but with different IP addresses",
              ],
            },
          ],
          verification: [
            {
              id: "verify2_1",
              description: "Verify interface configuration on Router1",
              command: "show ip interface brief",
              expectedOutput: `Interface                  IP-Address      OK? Method Status                Protocol
FastEthernet0/0            192.168.1.1     YES manual up                    up      
FastEthernet0/1            10.0.0.1        YES manual up                    up`,
              device: "Router1",
              isCompleted: false,
            },
            {
              id: "verify2_2",
              description: "Test connectivity between routers",
              command: "ping 10.0.0.2",
              expectedOutput: `Type escape sequence to abort.
Sending 5, 100-byte ICMP Echos to 10.0.0.2, timeout is 2 seconds:
!!!!!
Success rate is 100 percent (5/5), round-trip min/avg/max = 1/2/4 ms`,
              device: "Router1",
              isCompleted: false,
            },
          ],
          hints: [
            "Use 'show ip interface brief' to see all interface statuses",
            "Both Status and Protocol should show 'up' for working interfaces",
            "If ping fails, check cable connections and interface configurations",
          ],
        },
        {
          id: "step3",
          title: "Step 3: Configure Static Routing",
          type: "step",
          order: 4,
          estimatedTime: 20,
          content: [
            {
              id: "step3_intro",
              type: "text",
              content: `<h3>Static Routing Configuration</h3>
            <p>Now that our interfaces are configured, we need to set up routing so that devices in different networks can communicate. We'll use static routes to tell each router how to reach the remote networks.</p>
            
            <p>Router1 needs to know how to reach the 192.168.2.0/24 network, and Router2 needs to know how to reach the 192.168.1.0/24 network.</p>`,
            },
            {
              id: "routing_concept",
              type: "callout",
              content:
                "Static routes manually define the path to reach specific networks. The format is: ip route [destination_network] [subnet_mask] [next_hop_ip]",
              metadata: { callout_type: "info" },
            },
            {
              id: "static_routes",
              type: "code",
              content: `! On Router1 - Route to reach 192.168.2.0/24 network
ip route 192.168.2.0 255.255.255.0 10.0.0.2

! On Router2 - Route to reach 192.168.1.0/24 network  
ip route 192.168.1.0 255.255.255.0 10.0.0.1`,
              metadata: {
                language: "cisco",
              },
            },
          ],
          tasks: [
            {
              id: "task3_1",
              description:
                "Configure static route on Router1 to reach Router2's LAN",
              device: "Router1",
              commands: ["ip route 192.168.2.0 255.255.255.0 10.0.0.2"],
              expectedResult: "Static route is added to routing table",
              isCompleted: false,
              hints: [
                "The destination network is 192.168.2.0/24",
                "The next hop is Router2's WAN interface (10.0.0.2)",
                "Make sure you're in global configuration mode",
              ],
            },
            {
              id: "task3_2",
              description:
                "Configure static route on Router2 to reach Router1's LAN",
              device: "Router2",
              commands: [
                "configure terminal",
                "ip route 192.168.1.0 255.255.255.0 10.0.0.1",
              ],
              expectedResult: "Return route is configured",
              isCompleted: false,
              hints: [
                "The destination network is 192.168.1.0/24",
                "The next hop is Router1's WAN interface (10.0.0.1)",
                "Both routers need routes for bidirectional communication",
              ],
            },
          ],
          verification: [
            {
              id: "verify3_1",
              description: "Verify routing table on Router1",
              command: "show ip route",
              expectedOutput: `Gateway of last resort is not set

     10.0.0.0/30 is subnetted, 1 subnets
C       10.0.0.0 is directly connected, FastEthernet0/1
     192.168.1.0/24 is directly connected, FastEthernet0/0
S    192.168.2.0/24 [1/0] via 10.0.0.2`,
              device: "Router1",
              isCompleted: false,
            },
            {
              id: "verify3_2",
              description: "Test end-to-end connectivity",
              command: "ping 192.168.2.1",
              expectedOutput: `Type escape sequence to abort.
Sending 5, 100-byte ICMP Echos to 192.168.2.1, timeout is 2 seconds:
!!!!!
Success rate is 100 percent (5/5)`,
              device: "Router1",
              isCompleted: false,
            },
          ],
          hints: [
            "Look for 'S' entries in the routing table - these are static routes",
            "Connected networks show as 'C' in the routing table",
            "If ping fails, verify both routers have the correct static routes",
          ],
        },
        {
          id: "verification",
          title: "Final Verification and Testing",
          type: "verification",
          order: 5,
          estimatedTime: 15,
          content: [
            {
              id: "final_intro",
              type: "text",
              content: `<h3>Comprehensive Network Testing</h3>
            <p>Now let's perform comprehensive testing to ensure our network is working correctly. We'll test connectivity from multiple points and verify our configuration.</p>`,
            },
            {
              id: "testing_commands",
              type: "code",
              content: `! Test connectivity from Router1 to all networks
ping 192.168.1.10  ! PC1
ping 10.0.0.2      ! Router2 WAN
ping 192.168.2.1   ! Router2 LAN
ping 192.168.2.10  ! PC2

! Use traceroute to see the path
traceroute 192.168.2.10

! Verify routing tables
show ip route
show ip interface brief`,
              metadata: {
                device: "Router1",
                language: "cisco",
              },
            },
          ],
          tasks: [
            {
              id: "task4_1",
              description:
                "Perform comprehensive connectivity testing from Router1",
              device: "Router1",
              commands: [
                "ping 192.168.1.10",
                "ping 10.0.0.2",
                "ping 192.168.2.1",
                "ping 192.168.2.10",
              ],
              expectedResult: "All pings should be successful",
              isCompleted: false,
              hints: [
                "Test local network first (192.168.1.10)",
                "Test direct connection to Router2 (10.0.0.2)",
                "Test Router2's LAN interface (192.168.2.1)",
                "Test end-to-end to PC2 (192.168.2.10)",
              ],
            },
            {
              id: "task4_2",
              description:
                "Use traceroute to verify the path to remote network",
              device: "Router1",
              commands: ["traceroute 192.168.2.10"],
              expectedResult: "Shows path through Router2",
              isCompleted: false,
              hints: [
                "Traceroute shows each hop in the path",
                "You should see Router2's WAN interface (10.0.0.2) as the first hop",
                "Then Router2's LAN interface (192.168.2.1) as the second hop",
              ],
            },
            {
              id: "task4_3",
              description: "Save the configuration to prevent loss on reboot",
              device: "Router1",
              commands: ["copy running-config startup-config"],
              expectedResult: "Configuration is saved to NVRAM",
              isCompleted: false,
              hints: [
                "Use 'copy running-config startup-config' to save",
                "You can also use the shortcut 'copy run start'",
                "Repeat this on Router2 as well",
              ],
            },
          ],
          verification: [
            {
              id: "verify4_1",
              description: "Verify complete routing table",
              command: "show ip route",
              expectedOutput: `Codes: C - connected, S - static
     10.0.0.0/30 is subnetted, 1 subnets
C       10.0.0.0 is directly connected, FastEthernet0/1
C    192.168.1.0/24 is directly connected, FastEthernet0/0
S    192.168.2.0/24 [1/0] via 10.0.0.2`,
              device: "Router1",
              isCompleted: false,
            },
            {
              id: "verify4_2",
              description: "Confirm configuration is saved",
              command: "show startup-config | include hostname",
              expectedOutput: "hostname R1",
              device: "Router1",
              isCompleted: false,
            },
          ],
          hints: [
            "All networks should be reachable from any point",
            "Save configurations on both routers",
            "Document your network for future reference",
          ],
        },
        {
          id: "summary",
          title: "Lab Summary and Next Steps",
          type: "summary",
          order: 6,
          estimatedTime: 10,
          content: [
            {
              id: "summary_intro",
              type: "text",
              content: `<h3>Congratulations! 🎉</h3>
            <p>You have successfully completed the GNS3 Basic Router Configuration Lab. Let's review what you accomplished:</p>
            
            <h4>What You Learned:</h4>
            <ul>
              <li>✅ Accessed router console and navigated Cisco CLI</li>
              <li>✅ Configured basic router settings (hostname, console)</li>
              <li>✅ Configured router interfaces with IP addresses</li>
              <li>✅ Implemented static routing between networks</li>
              <li>✅ Verified network connectivity and troubleshooting</li>
              <li>✅ Saved configurations for persistence</li>
            </ul>
            
            <h4>Key Commands You Mastered:</h4>
            <ul>
              <li><code>enable</code> - Enter privileged EXEC mode</li>
              <li><code>configure terminal</code> - Enter global configuration mode</li>
              <li><code>interface [name]</code> - Configure specific interface</li>
              <li><code>ip address [ip] [mask]</code> - Assign IP address to interface</li>
              <li><code>no shutdown</code> - Activate interface</li>
              <li><code>ip route [network] [mask] [next-hop]</code> - Configure static route</li>
              <li><code>show ip route</code> - Display routing table</li>
              <li><code>show ip interface brief</code> - Show interface status</li>
              <li><code>ping [ip]</code> - Test connectivity</li>
              <li><code>copy running-config startup-config</code> - Save configuration</li>
            </ul>`,
            },
            {
              id: "next_steps",
              type: "callout",
              content:
                "Ready for more? Try the Advanced Routing Lab to learn about dynamic routing protocols like OSPF and EIGRP, or explore the Network Security Lab to implement access control lists and firewall configurations.",
              metadata: { callout_type: "success" },
            },
            {
              id: "troubleshooting_tips",
              type: "text",
              content: `<h4>Common Troubleshooting Tips:</h4>
            <ul>
              <li><strong>Interface Down:</strong> Check 'no shutdown' command and cable connections</li>
              <li><strong>Can't Ping:</strong> Verify IP addresses, subnet masks, and routing tables</li>
              <li><strong>Routing Issues:</strong> Ensure static routes point to correct next-hop addresses</li>
              <li><strong>Configuration Lost:</strong> Always save with 'copy run start'</li>
            </ul>`,
            },
          ],
          tasks: [],
          verification: [],
          hints: [],
        },
      ],
    },
    resources: [
      {
        id: "res1",
        title: "Cisco IOS Command Reference",
        type: "documentation",
        url: "https://www.cisco.com/c/en/us/support/ios-nx-os-software/ios-15-0s/products-command-reference-list.html",
        description: "Complete reference for Cisco IOS commands",
      },
      {
        id: "res2",
        title: "GNS3 User Guide",
        type: "documentation",
        url: "https://docs.gns3.com/",
        description: "Official GNS3 documentation and tutorials",
      },
      {
        id: "res3",
        title: "Subnetting Cheat Sheet",
        type: "cheat_sheet",
        url: "/resources/subnetting-cheat-sheet.pdf",
        description: "Quick reference for subnet calculations",
      },
    ],
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-20"),
    thumbnail: "",
    variables: [],
    isPublic: true,
    authorId: "",
    usageCount: 0,
  },
  {
    id: "vlan-configuration",
    title: "VLAN Configuration and Management",
    description:
      "Configure VLANs, trunk ports, and inter-VLAN routing on Cisco switches with hands-on practice",
    category: "Switching",
    difficulty: "INTERMEDIATE",
    estimatedTime: 120,
    tags: ["vlan", "switching", "trunking", "inter-vlan", "stp"],
    thumbnail: "/templates/vlan-config.png",
    objectives: [
      "Create and configure VLANs on Cisco switches",
      "Configure trunk and access ports appropriately",
      "Implement inter-VLAN routing using a router-on-a-stick",
      "Verify VLAN operations and troubleshoot common issues",
      "Understand VLAN security best practices",
    ],
    prerequisites: [
      "Basic switch configuration knowledge",
      "Understanding of VLANs and their purpose",
      "Familiarity with Cisco IOS commands",
      "Knowledge of Ethernet frame structure",
    ],
    environment: {
      id: "lab_env_1",
      type: "GNS3",
      topology: {
        nodes: [
          {
            id: "sw1",
            name: "Switch1",
            type: "switch",
            x: 200,
            y: 150,
            icon: "switch",
            status: "stopped",
          },
          {
            id: "sw2",
            name: "Switch2",
            type: "switch",
            x: 500,
            y: 150,
            icon: "switch",
            status: "stopped",
          },
          {
            id: "r1",
            name: "Router1",
            type: "router",
            x: 350,
            y: 50,
            icon: "router",
            status: "stopped",
          },
          {
            id: "pc1",
            name: "PC1-Sales",
            type: "pc",
            x: 100,
            y: 250,
            icon: "pc",
            status: "stopped",
          },
          {
            id: "pc2",
            name: "PC2-Engineering",
            type: "pc",
            x: 300,
            y: 250,
            icon: "pc",
            status: "stopped",
          },
          {
            id: "pc3",
            name: "PC3-Sales",
            type: "pc",
            x: 600,
            y: 250,
            icon: "pc",
            status: "stopped",
          },
        ],
        links: [
          {
            id: "link1",
            source: "pc1",
            target: "sw1",
            sourcePort: "eth0",
            targetPort: "f0/1",
            status: "down",
          },
          {
            id: "link2",
            source: "pc2",
            target: "sw1",
            sourcePort: "eth0",
            targetPort: "f0/2",
            status: "down",
          },
          {
            id: "link3",
            source: "sw1",
            target: "sw2",
            sourcePort: "f0/24",
            targetPort: "f0/24",
            status: "down",
          },
          {
            id: "link4",
            source: "sw2",
            target: "pc3",
            sourcePort: "f0/1",
            targetPort: "eth0",
            status: "down",
          },
          {
            id: "link5",
            source: "sw1",
            target: "r1",
            sourcePort: "f0/23",
            targetPort: "g0/0",
            status: "down",
          },
        ],
        layout: {
          width: 800,
          height: 350,
        },
      },
      devices: [
        {
          id: "sw1",
          name: "Switch1",
          type: "Cisco 2960",
          credentials: {
            username: "admin",
            password: "cisco",
          },
          interfaces: [
            {
              name: "FastEthernet0/1",
              enabled: false,
              status: "down",
            },
            {
              name: "FastEthernet0/2",
              enabled: false,
              status: "down",
            },
            {
              name: "FastEthernet0/23",
              enabled: false,
              status: "down",
            },
            {
              name: "FastEthernet0/24",
              enabled: false,
              status: "down",
            },
          ],
        },
        {
          id: "sw2",
          name: "Switch2",
          type: "Cisco 2960",
          credentials: {
            username: "admin",
            password: "cisco",
          },
          interfaces: [
            {
              name: "FastEthernet0/1",
              enabled: false,
              status: "down",
            },
            {
              name: "FastEthernet0/24",
              enabled: false,
              status: "down",
            },
          ],
        },
        {
          id: "r1",
          name: "Router1",
          type: "router",
          applianceName: "Cisco 2901",
          credentials: {
            username: "admin",
            password: "cisco",
          },
          interfaces: [
            {
              name: "GigabitEthernet0/0",
              enabled: false,
              status: "down",
            },
          ],
        },
        {
          id: "pc1",
          name: "PC1-Sales",
          type: "pc",
          applianceName: "Virtual PC",
          ipAddress: "192.168.10.10",
          interfaces: [
            {
              name: "eth0",
              ipAddress: "192.168.10.10",
              subnet: "255.255.255.0",
              enabled: true,
              status: "down",
            },
          ],
        },
        {
          id: "pc2",
          name: "PC2-Engineering",
          type: "pc",
          applianceName: "Virtual PC",
          ipAddress: "192.168.20.10",
          interfaces: [
            {
              name: "eth0",
              ipAddress: "192.168.20.10",
              subnet: "255.255.255.0",
              enabled: true,
              status: "down",
            },
          ],
        },
        {
          id: "pc3",
          name: "PC3-Sales",
          type: "pc",
          applianceName: "Virtual PC",
          ipAddress: "192.168.10.20",
          interfaces: [
            {
              name: "eth0",
              ipAddress: "192.168.10.20",
              subnet: "255.255.255.0",
              enabled: true,
              status: "down",
            },
          ],
        },
      ],
    },
    guide: {
      id: "vlan-guide",
      sections: [
        {
          id: "vlan-intro",
          title: "Introduction to VLANs",
          type: "introduction",
          order: 1,
          estimatedTime: 20,
          content: [
            {
              id: "vlan-concept",
              type: "text",
              content:
                "Virtual Local Area Networks (VLANs) allow you to segment a physical network into multiple logical networks. This lab will teach you how to create VLANs, configure switch ports, and enable communication between VLANs using inter-VLAN routing.",
            },
            {
              id: "vlan-benefits",
              type: "callout",
              content:
                "VLANs provide improved security, better traffic management, simplified administration, and cost savings by reducing the need for physical network segmentation.",
              metadata: {
                callout_type: "info",
              },
            },
            {
              id: "lab-scenario",
              type: "text",
              content:
                "In this lab, we'll create two VLANs: VLAN 10 for Sales department and VLAN 20 for Engineering department. We'll configure switch ports as access and trunk ports, and set up inter-VLAN routing.",
            },
          ],
          tasks: [],
          verification: [],
          hints: [],
        },
        {
          id: "create-vlans",
          title: "Creating VLANs",
          type: "step",
          order: 2,
          estimatedTime: 25,
          content: [
            {
              id: "vlan-creation-intro",
              type: "text",
              content:
                "First, we'll create VLANs on both switches. VLANs are created in global configuration mode and should be created on all switches in the network.",
            },
            {
              id: "vlan-commands",
              type: "code",
              content: `Switch1> enable
Switch1# configure terminal
Switch1(config)# vlan 10
Switch1(config-vlan)# name Sales
Switch1(config-vlan)# exit
Switch1(config)# vlan 20
Switch1(config-vlan)# name Engineering
Switch1(config-vlan)# exit`,
              metadata: {
                language: "cisco",
                device: "Switch1",
              },
            },
            {
              id: "vlan-verification-intro",
              type: "text",
              content:
                "After creating VLANs, we can verify them using the show vlan command. This displays all VLANs, their names, status, and assigned ports.",
            },
          ],
          tasks: [
            {
              id: "task1",
              description: "Create VLAN 10 with name 'Sales' on Switch1",
              device: "Switch1",
              commands: [
                "enable",
                "configure terminal",
                "vlan 10",
                "name Sales",
                "exit",
              ],
              expectedResult: "VLAN 10 should be created with name Sales",
              isCompleted: false,
              hints: [
                "Use 'vlan 10' to create VLAN 10",
                "Use 'name Sales' to assign a descriptive name",
              ],
            },
            {
              id: "task2",
              description: "Create VLAN 20 with name 'Engineering' on Switch1",
              device: "Switch1",
              commands: ["vlan 20", "name Engineering", "exit"],
              expectedResult: "VLAN 20 should be created with name Engineering",
              isCompleted: false,
              hints: [
                "VLAN names help with network documentation",
                "Exit VLAN configuration mode when done",
              ],
            },
            {
              id: "task3",
              description: "Create the same VLANs on Switch2",
              device: "Switch2",
              commands: [
                "enable",
                "configure terminal",
                "vlan 10",
                "name Sales",
                "exit",
                "vlan 20",
                "name Engineering",
                "exit",
              ],
              expectedResult: "Both VLANs should exist on Switch2",
              isCompleted: false,
              hints: [
                "VLANs must be created on all switches",
                "Consistent naming is important",
              ],
            },
          ],
          verification: [
            {
              id: "verify1",
              description: "Verify VLANs are created on Switch1",
              command: "show vlan brief",
              expectedOutput: "10   Sales                         active",
              device: "Switch1",
              isCompleted: false,
            },
            {
              id: "verify2",
              description: "Verify VLANs are created on Switch2",
              command: "show vlan brief",
              expectedOutput: "20   Engineering                  active",
              device: "Switch2",
              isCompleted: false,
            },
          ],
          hints: [
            "VLANs are stored in vlan.dat file",
            "Use 'show vlan brief' for a summary view",
          ],
        },
        {
          id: "configure-access-ports",
          title: "Configuring Access Ports",
          type: "step",
          order: 3,
          estimatedTime: 30,
          content: [
            {
              id: "access-port-intro",
              type: "text",
              content:
                "Access ports connect end devices (like PCs) to a specific VLAN. Each access port belongs to only one VLAN and removes VLAN tags from frames before sending them to the connected device.",
            },
            {
              id: "access-port-commands",
              type: "code",
              content: `Switch1(config)# interface fastethernet 0/1
Switch1(config-if)# switchport mode access
Switch1(config-if)# switchport access vlan 10
Switch1(config-if)# description PC1-Sales
Switch1(config-if)# exit`,
              metadata: {
                language: "cisco",
                device: "Switch1",
              },
            },
            {
              id: "access-port-explanation",
              type: "text",
              content:
                "The 'switchport mode access' command configures the port as an access port, and 'switchport access vlan 10' assigns it to VLAN 10. The description helps with documentation.",
            },
          ],
          tasks: [
            {
              id: "task4",
              description:
                "Configure FastEthernet0/1 on Switch1 as access port for VLAN 10",
              device: "Switch1",
              commands: [
                "interface fastethernet 0/1",
                "switchport mode access",
                "switchport access vlan 10",
                "description PC1-Sales",
              ],
              expectedResult:
                "Port should be configured as access port in VLAN 10",
              isCompleted: false,
              hints: [
                "Access ports connect end devices to VLANs",
                "Use descriptive port descriptions",
              ],
            },
            {
              id: "task5",
              description:
                "Configure FastEthernet0/2 on Switch1 as access port for VLAN 20",
              device: "Switch1",
              commands: [
                "interface fastethernet 0/2",
                "switchport mode access",
                "switchport access vlan 20",
                "description PC2-Engineering",
              ],
              expectedResult:
                "Port should be configured as access port in VLAN 20",
              isCompleted: false,
              hints: [
                "Each access port belongs to one VLAN",
                "Port descriptions aid in troubleshooting",
              ],
            },
            {
              id: "task6",
              description:
                "Configure FastEthernet0/1 on Switch2 as access port for VLAN 10",
              device: "Switch2",
              commands: [
                "interface fastethernet 0/1",
                "switchport mode access",
                "switchport access vlan 10",
                "description PC3-Sales",
              ],
              expectedResult:
                "Port should be configured as access port in VLAN 10",
              isCompleted: false,
              hints: [
                "PC3 is also in the Sales department (VLAN 10)",
                "Consistent configuration across switches is important",
              ],
            },
          ],
          verification: [
            {
              id: "verify3",
              description: "Verify access port configuration on Switch1",
              command: "show vlan brief",
              expectedOutput:
                "10   Sales                         active    Fa0/1",
              device: "Switch1",
              isCompleted: false,
            },
            {
              id: "verify4",
              description: "Check interface switchport status",
              command: "show interfaces fastethernet 0/1 switchport",
              expectedOutput: "Administrative Mode: static access",
              device: "Switch1",
              isCompleted: false,
            },
          ],
          hints: [
            "Access ports are untagged ports",
            "Use 'show vlan brief' to see port assignments",
          ],
        },
        {
          id: "configure-trunk-ports",
          title: "Configuring Trunk Ports",
          type: "step",
          order: 4,
          estimatedTime: 25,
          content: [
            {
              id: "trunk-port-intro",
              type: "text",
              content:
                "Trunk ports carry traffic for multiple VLANs between switches. They use VLAN tagging (802.1Q) to identify which VLAN each frame belongs to.",
            },
            {
              id: "trunk-port-commands",
              type: "code",
              content: `Switch1(config)# interface fastethernet 0/24
Switch1(config-if)# switchport mode trunk
Switch1(config-if)# switchport trunk allowed vlan 10,20
Switch1(config-if)# description Trunk to Switch2
Switch1(config-if)# exit`,
              metadata: {
                language: "cisco",
                device: "Switch1",
              },
            },
            {
              id: "trunk-security",
              type: "callout",
              content:
                "For security, it's best practice to explicitly specify which VLANs are allowed on trunk ports rather than allowing all VLANs.",
              metadata: {
                callout_type: "tip",
              },
            },
          ],
          tasks: [
            {
              id: "task7",
              description:
                "Configure FastEthernet0/24 on Switch1 as trunk port",
              device: "Switch1",
              commands: [
                "interface fastethernet 0/24",
                "switchport mode trunk",
                "switchport trunk allowed vlan 10,20",
                "description Trunk to Switch2",
              ],
              expectedResult:
                "Port should be configured as trunk allowing VLANs 10 and 20",
              isCompleted: false,
              hints: [
                "Trunk ports connect switches together",
                "Specify allowed VLANs for security",
              ],
            },
            {
              id: "task8",
              description:
                "Configure FastEthernet0/24 on Switch2 as trunk port",
              device: "Switch2",
              commands: [
                "interface fastethernet 0/24",
                "switchport mode trunk",
                "switchport trunk allowed vlan 10,20",
                "description Trunk to Switch1",
              ],
              expectedResult: "Trunk should be configured on both ends",
              isCompleted: false,
              hints: [
                "Both ends of a trunk must be configured",
                "Use consistent VLAN allowlists",
              ],
            },
          ],
          verification: [
            {
              id: "verify5",
              description: "Verify trunk configuration",
              command: "show interfaces trunk",
              expectedOutput:
                "Fa0/24         802.1q         trunking      10,20",
              device: "Switch1",
              isCompleted: false,
            },
            {
              id: "verify6",
              description: "Check trunk status on Switch2",
              command: "show interfaces fastethernet 0/24 switchport",
              expectedOutput: "Administrative Mode: trunk",
              device: "Switch2",
              isCompleted: false,
            },
          ],
          hints: [
            "Trunk ports use 802.1Q tagging",
            "Both switches must agree on trunk configuration",
          ],
        },
        {
          id: "inter-vlan-routing",
          title: "Inter-VLAN Routing Configuration",
          type: "step",
          order: 5,
          estimatedTime: 30,
          content: [
            {
              id: "inter-vlan-intro",
              type: "text",
              content:
                "By default, VLANs cannot communicate with each other. Inter-VLAN routing using a router-on-a-stick configuration allows controlled communication between VLANs.",
            },
            {
              id: "subinterface-commands",
              type: "code",
              content: `Router1(config)# interface gigabitethernet 0/0
Router1(config-if)# no shutdown
Router1(config-if)# exit
Router1(config)# interface gigabitethernet 0/0.10
Router1(config-subif)# encapsulation dot1q 10
Router1(config-subif)# ip address 192.168.10.1 255.255.255.0
Router1(config-subif)# exit
Router1(config)# interface gigabitethernet 0/0.20
Router1(config-subif)# encapsulation dot1q 20
Router1(config-subif)# ip address 192.168.20.1 255.255.255.0`,
              metadata: {
                language: "cisco",
                device: "Router1",
              },
            },
            {
              id: "router-trunk-config",
              type: "text",
              content:
                "We also need to configure the switch port connected to the router as a trunk port to carry both VLANs.",
            },
          ],
          tasks: [
            {
              id: "task9",
              description:
                "Configure router subinterfaces for inter-VLAN routing",
              device: "Router1",
              commands: [
                "enable",
                "configure terminal",
                "interface gigabitethernet 0/0",
                "no shutdown",
                "exit",
                "interface gigabitethernet 0/0.10",
                "encapsulation dot1q 10",
                "ip address 192.168.10.1 255.255.255.0",
                "exit",
                "interface gigabitethernet 0/0.20",
                "encapsulation dot1q 20",
                "ip address 192.168.20.1 255.255.255.0",
              ],
              expectedResult:
                "Subinterfaces should be configured for both VLANs",
              isCompleted: false,
              hints: [
                "Subinterfaces enable router-on-a-stick",
                "Each VLAN needs its own subinterface",
              ],
            },
            {
              id: "task10",
              description: "Configure Switch1 port to router as trunk",
              device: "Switch1",
              commands: [
                "interface fastethernet 0/23",
                "switchport mode trunk",
                "switchport trunk allowed vlan 10,20",
                "description Trunk to Router1",
              ],
              expectedResult: "Port to router should be configured as trunk",
              isCompleted: false,
              hints: [
                "Router connection needs to be a trunk",
                "Allow both VLANs on the trunk",
              ],
            },
          ],
          verification: [
            {
              id: "verify7",
              description: "Verify router subinterfaces",
              command: "show ip interface brief",
              expectedOutput:
                "GigabitEthernet0/0.10   192.168.10.1    YES manual up                    up",
              device: "Router1",
              isCompleted: false,
            },
            {
              id: "verify8",
              description: "Test inter-VLAN connectivity",
              command: "ping 192.168.20.10",
              expectedOutput: "Success rate is 100 percent",
              device: "PC1-Sales",
              isCompleted: false,
            },
          ],
          hints: [
            "Router acts as default gateway for each VLAN",
            "Test connectivity between different VLANs",
          ],
        },
      ],
      currentSection: 0,
      completedSections: [],
    },
    resources: [
      {
        id: "vlan-commands",
        title: "VLAN Command Reference",
        type: "cheat_sheet",
        url: "/resources/vlan-commands.pdf",
        description: "Quick reference for VLAN configuration commands",
      },
      {
        id: "trunking-guide",
        title: "802.1Q Trunking Guide",
        type: "documentation",
        url: "/resources/trunking-guide.pdf",
        description:
          "Detailed explanation of VLAN trunking and 802.1Q protocol",
      },
      {
        id: "inter-vlan-routing",
        title: "Inter-VLAN Routing Methods",
        type: "reference",
        url: "/resources/inter-vlan-routing.pdf",
        description: "Comparison of different inter-VLAN routing methods",
      },
    ],
    variables: [
      {
        name: "sales_vlan_id",
        type: "number",
        defaultValue: "10",
        description: "VLAN ID for Sales department",
        required: true,
      },
      {
        name: "engineering_vlan_id",
        type: "number",
        defaultValue: "20",
        description: "VLAN ID for Engineering department",
        required: true,
      },
      {
        name: "sales_network",
        type: "ip",
        defaultValue: "192.168.10.0",
        description: "Network address for Sales VLAN",
        required: true,
      },
      {
        name: "engineering_network",
        type: "ip",
        defaultValue: "192.168.20.0",
        description: "Network address for Engineering VLAN",
        required: true,
      },
      {
        name: "enable_stp",
        type: "boolean",
        defaultValue: "true",
        description: "Enable Spanning Tree Protocol",
        required: false,
      },
    ],
    isPublic: true,
    authorId: "system",
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-20"),
    usageCount: 892,
  },
  {
    id: "ospf-routing",
    title: "OSPF Dynamic Routing Protocol",
    description:
      "Configure OSPF routing protocol for dynamic route advertisement and learn link-state routing concepts",
    category: "Routing Protocols",
    difficulty: "ADVANCED",
    estimatedTime: 150,
    tags: ["ospf", "dynamic-routing", "link-state", "areas", "lsa"],
    thumbnail: "/templates/ospf-routing.png",
    objectives: [
      "Configure OSPF routing protocol on multiple routers",
      "Understand OSPF areas and hierarchical design",
      "Implement OSPF authentication for security",
      "Analyze OSPF LSA types and database",
      "Troubleshoot OSPF adjacencies and routing issues",
    ],
    prerequisites: [
      "Solid understanding of static routing",
      "Knowledge of link-state routing concepts",
      "Familiarity with routing tables and metrics",
      "Understanding of network design principles",
    ],
    environment: {
      id: "lab_env_1",
      type: "GNS3",
      topology: {
        nodes: [
          {
            id: "r1",
            name: "Router1",
            type: "router",
            x: 150,
            y: 150,
            icon: "router",
            status: "stopped",
          },
          {
            id: "r2",
            name: "Router2",
            type: "router",
            x: 400,
            y: 100,
            icon: "router",
            status: "stopped",
          },
          {
            id: "r3",
            name: "Router3",
            type: "router",
            x: 400,
            y: 200,
            icon: "router",
            status: "stopped",
          },
          {
            id: "r4",
            name: "Router4",
            type: "router",
            x: 650,
            y: 150,
            icon: "router",
            status: "stopped",
          },
          {
            id: "pc1",
            name: "PC1",
            type: "pc",
            x: 50,
            y: 250,
            icon: "pc",
            status: "stopped",
          },
          {
            id: "pc2",
            name: "PC2",
            type: "pc",
            x: 750,
            y: 250,
            icon: "pc",
            status: "stopped",
          },
        ],
        links: [
          {
            id: "link1",
            source: "pc1",
            target: "r1",
            sourcePort: "eth0",
            targetPort: "g0/0",
            status: "down",
          },
          {
            id: "link2",
            source: "r1",
            target: "r2",
            sourcePort: "g0/1",
            targetPort: "g0/0",
            status: "down",
          },
          {
            id: "link3",
            source: "r1",
            target: "r3",
            sourcePort: "g0/2",
            targetPort: "g0/0",
            status: "down",
          },
          {
            id: "link4",
            source: "r2",
            target: "r4",
            sourcePort: "g0/1",
            targetPort: "g0/0",
            status: "down",
          },
          {
            id: "link5",
            source: "r3",
            target: "r4",
            sourcePort: "g0/1",
            targetPort: "g0/1",
            status: "down",
          },
          {
            id: "link6",
            source: "r4",
            target: "pc2",
            sourcePort: "g0/2",
            targetPort: "eth0",
            status: "down",
          },
        ],
        layout: {
          width: 900,
          height: 350,
        },
      },
      devices: [
        {
          id: "r1",
          name: "Router1",
          type: "router",
          applianceName: "Cisco 2901",
          ipAddress: "10.1.1.1",
          credentials: {
            username: "admin",
            password: "cisco",
          },
          interfaces: [
            {
              name: "GigabitEthernet0/0",
              ipAddress: "192.168.1.1",
              subnet: "255.255.255.0",
              enabled: false,
              status: "down",
            },
            {
              name: "GigabitEthernet0/1",
              ipAddress: "10.1.12.1",
              subnet: "255.255.255.252",
              enabled: false,
              status: "down",
            },
            {
              name: "GigabitEthernet0/2",
              ipAddress: "10.1.13.1",
              subnet: "255.255.255.252",
              enabled: false,
              status: "down",
            },
          ],
        },
        {
          id: "r2",
          name: "Router2",
          type: "router",
          applianceName: "Cisco 2901",
          ipAddress: "10.1.2.1",
          credentials: {
            username: "admin",
            password: "cisco",
          },
          interfaces: [
            {
              name: "GigabitEthernet0/0",
              ipAddress: "10.1.12.2",
              subnet: "255.255.255.252",
              enabled: false,
              status: "down",
            },
            {
              name: "GigabitEthernet0/1",
              ipAddress: "10.2.24.2",
              subnet: "255.255.255.252",
              enabled: false,
              status: "down",
            },
          ],
        },
        {
          id: "r3",
          name: "Router3",
          type: "router",
          applianceName: "Cisco 2901",
          ipAddress: "10.1.3.1",
          credentials: {
            username: "admin",
            password: "cisco",
          },
          interfaces: [
            {
              name: "GigabitEthernet0/0",
              ipAddress: "10.1.13.2",
              subnet: "255.255.255.252",
              enabled: false,
              status: "down",
            },
            {
              name: "GigabitEthernet0/1",
              ipAddress: "10.2.34.3",
              subnet: "255.255.255.252",
              enabled: false,
              status: "down",
            },
          ],
        },
        {
          id: "r4",
          name: "Router4",
          type: "router",
          applianceName: "Cisco 2901",
          ipAddress: "10.2.4.1",
          credentials: {
            username: "admin",
            password: "cisco",
          },
          interfaces: [
            {
              name: "GigabitEthernet0/0",
              ipAddress: "10.2.24.4",
              subnet: "255.255.255.252",
              enabled: false,
              status: "down",
            },
            {
              name: "GigabitEthernet0/1",
              ipAddress: "10.2.34.4",
              subnet: "255.255.255.252",
              enabled: false,
              status: "down",
            },
            {
              name: "GigabitEthernet0/2",
              ipAddress: "192.168.4.1",
              subnet: "255.255.255.0",
              enabled: false,
              status: "down",
            },
          ],
        },
        {
          id: "pc1",
          name: "PC1",
          type: "pc",
          applianceName: "Virtual PC",
          ipAddress: "192.168.1.10",
          interfaces: [
            {
              name: "eth0",
              ipAddress: "192.168.1.10",
              subnet: "255.255.255.0",
              enabled: true,
              status: "down",
            },
          ],
        },
        {
          id: "pc2",
          name: "PC2",
          type: "pc",
          applianceName: "Virtual PC",
          ipAddress: "192.168.4.10",
          interfaces: [
            {
              name: "eth0",
              ipAddress: "192.168.4.10",
              subnet: "255.255.255.0",
              enabled: true,
              status: "down",
            },
          ],
        },
      ],
    },
    guide: {
      id: "ospf-guide",
      sections: [
        {
          id: "ospf-intro",
          title: "Introduction to OSPF",
          type: "introduction",
          order: 1,
          estimatedTime: 25,
          content: [
            {
              id: "ospf-overview",
              type: "text",
              content:
                "Open Shortest Path First (OSPF) is a link-state routing protocol that uses Dijkstra's algorithm to calculate the shortest path to destinations. Unlike distance-vector protocols, OSPF maintains a complete topology database and converges quickly to network changes.",
            },
            {
              id: "ospf-features",
              type: "callout",
              content:
                "OSPF features include: fast convergence, loop-free routing, support for VLSM and CIDR, hierarchical design with areas, and authentication for security.",
              metadata: {
                callout_type: "info",
              },
            },
            {
              id: "lab-topology",
              type: "text",
              content:
                "Our lab topology consists of four routers in a partial mesh configuration. Router1 and Router4 have LAN connections, while Router2 and Router3 provide redundant paths. We'll configure Area 0 (backbone area) and Area 1.",
            },
            {
              id: "ospf-areas",
              type: "text",
              content:
                "OSPF uses areas to create a hierarchical network design. Area 0 is the backbone area, and all other areas must connect to it. This design reduces LSA flooding and improves scalability.",
            },
          ],
          tasks: [],
          verification: [],
          hints: [],
        },
        {
          id: "basic-ospf-config",
          title: "Basic OSPF Configuration",
          type: "step",
          order: 2,
          estimatedTime: 35,
          content: [
            {
              id: "ospf-process-intro",
              type: "text",
              content:
                "OSPF configuration begins with enabling the OSPF process and defining a router ID. The router ID uniquely identifies each router in the OSPF domain and should be configured manually for consistency.",
            },
            {
              id: "ospf-basic-commands",
              type: "code",
              content: `Router1(config)# router ospf 1
Router1(config-router)# router-id 1.1.1.1
Router1(config-router)# network 192.168.1.0 0.0.0.255 area 0
Router1(config-router)# network 10.1.12.0 0.0.0.3 area 0
Router1(config-router)# network 10.1.13.0 0.0.0.3 area 0`,
              metadata: {
                language: "cisco",
                device: "Router1",
              },
            },
            {
              id: "network-command-explanation",
              type: "text",
              content:
                "The network command specifies which interfaces participate in OSPF. The wildcard mask (inverse subnet mask) determines which IP addresses match. Area 0 is the backbone area that all other areas must connect to.",
            },
            {
              id: "wildcard-mask-tip",
              type: "callout",
              content:
                "Wildcard masks are the inverse of subnet masks. For /24 networks, use 0.0.0.255. For /30 point-to-point links, use 0.0.0.3.",
              metadata: {
                callout_type: "tip",
              },
            },
          ],
          tasks: [
            {
              id: "task1",
              description:
                "Configure OSPF process 1 on Router1 with router ID 1.1.1.1",
              device: "Router1",
              commands: [
                "enable",
                "configure terminal",
                "router ospf 1",
                "router-id 1.1.1.1",
              ],
              expectedResult:
                "OSPF process should be enabled with router ID 1.1.1.1",
              isCompleted: false,
              hints: [
                "Router ID should be unique for each router",
                "Use loopback-style addressing for router IDs",
              ],
            },
            {
              id: "task2",
              description: "Advertise Router1's networks in OSPF Area 0",
              device: "Router1",
              commands: [
                "network 192.168.1.0 0.0.0.255 area 0",
                "network 10.1.12.0 0.0.0.3 area 0",
                "network 10.1.13.0 0.0.0.3 area 0",
              ],
              expectedResult:
                "All Router1 networks should be advertised in Area 0",
              isCompleted: false,
              hints: [
                "Use wildcard masks, not subnet masks",
                "All backbone routers should be in Area 0",
              ],
            },
            {
              id: "task3",
              description: "Configure OSPF on Router2 with router ID 2.2.2.2",
              device: "Router2",
              commands: [
                "enable",
                "configure terminal",
                "router ospf 1",
                "router-id 2.2.2.2",
                "network 10.1.12.0 0.0.0.3 area 0",
                "network 10.2.24.0 0.0.0.3 area 0",
              ],
              expectedResult: "Router2 should be configured for OSPF",
              isCompleted: false,
              hints: [
                "Router2 connects Area 0 to Area 1",
                "Use consistent process numbers",
              ],
            },
            {
              id: "task4",
              description: "Configure OSPF on Router3 with router ID 3.3.3.3",
              device: "Router3",
              commands: [
                "enable",
                "configure terminal",
                "router ospf 1",
                "router-id 3.3.3.3",
                "network 10.1.13.0 0.0.0.3 area 0",
                "network 10.2.34.0 0.0.0.3 area 0",
              ],
              expectedResult: "Router3 should be configured for OSPF",
              isCompleted: false,
              hints: [
                "Router3 also connects Area 0 to Area 1",
                "Ensure all interfaces are included",
              ],
            },
          ],
          verification: [
            {
              id: "verify1",
              description: "Verify OSPF process is running",
              command: "show ip ospf",
              expectedOutput: 'Routing Process "ospf 1" with ID 1.1.1.1',
              device: "Router1",
              isCompleted: false,
            },
            {
              id: "verify2",
              description: "Check OSPF neighbors",
              command: "show ip ospf neighbor",
              expectedOutput:
                "2.2.2.2        1   FULL/  -        00:00:30    10.1.12.2       GigabitEthernet0/1",
              device: "Router1",
              isCompleted: false,
            },
          ],
          hints: [
            "OSPF neighbors must be in FULL state",
            "Use 'show ip ospf interface' to verify interface participation",
          ],
        },
        {
          id: "ospf-areas",
          title: "Configuring OSPF Areas",
          type: "step",
          order: 3,
          estimatedTime: 30,
          content: [
            {
              id: "areas-intro",
              type: "text",
              content:
                "OSPF areas provide hierarchical network design and reduce LSA flooding. We'll configure Router4's LAN in Area 1, making Router2 and Router3 Area Border Routers (ABRs).",
            },
            {
              id: "area-commands",
              type: "code",
              content: `Router4(config)# router ospf 1
Router4(config-router)# router-id 4.4.4.4
Router4(config-router)# network 10.2.24.0 0.0.0.3 area 0
Router4(config-router)# network 10.2.34.0 0.0.0.3 area 0
Router4(config-router)# network 192.168.4.0 0.0.0.255 area 1`,
              metadata: {
                language: "cisco",
                device: "Router4",
              },
            },
            {
              id: "abr-explanation",
              type: "text",
              content:
                "Area Border Routers (ABRs) connect multiple areas and summarize routes between them. Router2 and Router3 will become ABRs when we configure their Area 1 interfaces.",
            },
          ],
          tasks: [
            {
              id: "task5",
              description: "Configure Router4 with OSPF router ID 4.4.4.4",
              device: "Router4",
              commands: [
                "enable",
                "configure terminal",
                "router ospf 1",
                "router-id 4.4.4.4",
              ],
              expectedResult:
                "Router4 should have OSPF process with router ID 4.4.4.4",
              isCompleted: false,
              hints: [
                "Router4 will be in both Area 0 and Area 1",
                "Consistent router IDs help with troubleshooting",
              ],
            },
            {
              id: "task6",
              description: "Configure Router4's Area 0 networks",
              device: "Router4",
              commands: [
                "network 10.2.24.0 0.0.0.3 area 0",
                "network 10.2.34.0 0.0.0.3 area 0",
              ],
              expectedResult: "Router4's WAN interfaces should be in Area 0",
              isCompleted: false,
              hints: [
                "WAN links between routers typically stay in Area 0",
                "This connects Router4 to the backbone",
              ],
            },
            {
              id: "task7",
              description: "Configure Router4's LAN network in Area 1",
              device: "Router4",
              commands: ["network 192.168.4.0 0.0.0.255 area 1"],
              expectedResult: "Router4's LAN should be in Area 1",
              isCompleted: false,
              hints: [
                "LAN networks can be in non-backbone areas",
                "This makes Router4 an ABR",
              ],
            },
            {
              id: "task8",
              description: "Update Router2 to include Area 1 networks",
              device: "Router2",
              commands: ["router ospf 1", "network 10.2.24.0 0.0.0.3 area 0"],
              expectedResult: "Router2 should connect to Router4 in Area 0",
              isCompleted: false,
              hints: [
                "Router2 becomes an ABR",
                "Area 0 connections are crucial for inter-area routing",
              ],
            },
            {
              id: "task9",
              description: "Update Router3 to include Area 1 networks",
              device: "Router3",
              commands: ["router ospf 1", "network 10.2.34.0 0.0.0.3 area 0"],
              expectedResult: "Router3 should connect to Router4 in Area 0",
              isCompleted: false,
              hints: [
                "Router3 also becomes an ABR",
                "Multiple ABRs provide redundancy",
              ],
            },
          ],
          verification: [
            {
              id: "verify3",
              description: "Verify Router4 is an ABR",
              command: "show ip ospf",
              expectedOutput: "Area BACKBONE(0)",
              device: "Router4",
              isCompleted: false,
            },
            {
              id: "verify4",
              description: "Check inter-area routes",
              command: "show ip route ospf",
              expectedOutput: "O IA 192.168.4.0/24 [110/2] via 10.1.12.2",
              device: "Router1",
              isCompleted: false,
            },
          ],
          hints: [
            "ABRs maintain separate topology databases for each area",
            "Inter-area routes are marked as 'O IA'",
          ],
        },
        {
          id: "ospf-authentication",
          title: "OSPF Authentication",
          type: "step",
          order: 4,
          estimatedTime: 25,
          content: [
            {
              id: "auth-intro",
              type: "text",
              content:
                "OSPF authentication prevents unauthorized routers from joining the OSPF domain. We'll configure simple password authentication on all OSPF interfaces for security.",
            },
            {
              id: "auth-commands",
              type: "code",
              content: `Router1(config)# router ospf 1
Router1(config-router)# area 0 authentication
Router1(config-router)# exit
Router1(config)# interface gigabitethernet 0/1
Router1(config-if)# ip ospf authentication-key cisco123
Router1(config-if)# exit`,
              metadata: {
                language: "cisco",
                device: "Router1",
              },
            },
            {
              id: "auth-security",
              type: "callout",
              content:
                "For production networks, use MD5 authentication instead of simple passwords for better security.",
              metadata: {
                callout_type: "warning",
              },
            },
          ],
          tasks: [
            {
              id: "task10",
              description: "Enable authentication for Area 0 on all routers",
              device: "Router1",
              commands: ["router ospf 1", "area 0 authentication"],
              expectedResult: "Area 0 should require authentication",
              isCompleted: false,
              hints: [
                "Authentication must be enabled on all routers in the area",
                "Mismatched authentication breaks adjacencies",
              ],
            },
            {
              id: "task11",
              description:
                "Configure authentication keys on Router1 interfaces",
              device: "Router1",
              commands: [
                "interface gigabitethernet 0/1",
                "ip ospf authentication-key cisco123",
                "exit",
                "interface gigabitethernet 0/2",
                "ip ospf authentication-key cisco123",
              ],
              expectedResult:
                "Authentication keys should be configured on OSPF interfaces",
              isCompleted: false,
              hints: [
                "All neighbors must use the same authentication key",
                "Configure keys on all OSPF-enabled interfaces",
              ],
            },
          ],
          verification: [
            {
              id: "verify5",
              description: "Verify OSPF authentication is working",
              command: "show ip ospf neighbor",
              expectedOutput: "FULL/  -",
              device: "Router1",
              isCompleted: false,
            },
          ],
          hints: [
            "Authentication failures prevent neighbor relationships",
            "Use 'debug ip ospf adj' to troubleshoot authentication issues",
          ],
        },
        {
          id: "ospf-verification",
          title: "OSPF Verification and Troubleshooting",
          type: "verification",
          order: 5,
          estimatedTime: 35,
          content: [
            {
              id: "verification-intro",
              type: "text",
              content:
                "Proper OSPF verification involves checking neighbor relationships, LSA database, routing table, and end-to-end connectivity. We'll use various show commands to verify our configuration.",
            },
            {
              id: "verification-commands",
              type: "code",
              content: `Router1# show ip ospf neighbor detail
Router1# show ip ospf database
Router1# show ip route ospf
Router1# show ip ospf interface brief`,
              metadata: {
                language: "cisco",
                device: "Router1",
              },
            },
            {
              id: "lsa-types",
              type: "text",
              content:
                "OSPF uses different LSA types: Type 1 (Router LSA), Type 2 (Network LSA), Type 3 (Summary LSA), Type 4 (ASBR Summary), and Type 5 (External LSA). Understanding these helps with troubleshooting.",
            },
          ],
          tasks: [
            {
              id: "task12",
              description: "Verify all OSPF neighbors are in FULL state",
              device: "Router1",
              commands: ["show ip ospf neighbor"],
              expectedResult: "All neighbors should show FULL state",
              isCompleted: false,
              hints: [
                "FULL state indicates successful adjacency",
                "Check for authentication or area mismatches if not FULL",
              ],
            },
            {
              id: "task13",
              description: "Examine the OSPF database",
              device: "Router1",
              commands: ["show ip ospf database"],
              expectedResult: "Database should show LSAs from all routers",
              isCompleted: false,
              hints: [
                "Each router should have identical databases within an area",
                "Look for Type 1, 2, and 3 LSAs",
              ],
            },
            {
              id: "task14",
              description: "Test end-to-end connectivity",
              device: "PC1",
              commands: ["ping 192.168.4.10"],
              expectedResult: "Ping should be successful",
              isCompleted: false,
              hints: [
                "End-to-end connectivity verifies the entire OSPF configuration",
                "Use traceroute to see the path taken",
              ],
            },
          ],
          verification: [
            {
              id: "verify6",
              description: "Verify OSPF routes in routing table",
              command: "show ip route ospf",
              expectedOutput: "O    192.168.4.0/24 [110/3] via 10.1.12.2",
              device: "Router1",
              isCompleted: false,
            },
            {
              id: "verify7",
              description: "Check OSPF interface costs",
              command: "show ip ospf interface brief",
              expectedOutput:
                "Gi0/1    1.1.1.1         Area 0          1           P2P",
              device: "Router1",
              isCompleted: false,
            },
          ],
          hints: [
            "OSPF cost is based on interface bandwidth",
            "Lower cost paths are preferred",
            "Use 'ip ospf cost' to manually set interface costs",
          ],
        },
      ],
      currentSection: 0,
      completedSections: [],
    },
    resources: [
      {
        id: "ospf-commands",
        title: "OSPF Command Reference",
        type: "cheat_sheet",
        url: "/resources/ospf-commands.pdf",
        description:
          "Comprehensive list of OSPF configuration and verification commands",
      },
      {
        id: "ospf-lsa-types",
        title: "OSPF LSA Types Guide",
        type: "reference",
        url: "/resources/ospf-lsa-types.pdf",
        description:
          "Detailed explanation of OSPF Link State Advertisement types",
      },
      {
        id: "ospf-troubleshooting",
        title: "OSPF Troubleshooting Guide",
        type: "documentation",
        url: "/resources/ospf-troubleshooting.pdf",
        description: "Step-by-step troubleshooting procedures for OSPF issues",
      },
      {
        id: "dijkstra-algorithm",
        title: "Dijkstra's Algorithm Explained",
        type: "documentation",
        url: "/resources/dijkstra-algorithm.pdf",
        description: "Understanding how OSPF calculates shortest paths",
      },
    ],
    variables: [
      {
        name: "ospf_process_id",
        type: "number",
        defaultValue: "1",
        description: "OSPF process ID (locally significant)",
        required: true,
      },
      {
        name: "backbone_area",
        type: "number",
        defaultValue: "0",
        description: "OSPF backbone area number",
        required: true,
      },
      {
        name: "secondary_area",
        type: "number",
        defaultValue: "1",
        description: "OSPF secondary area number",
        required: true,
      },
      {
        name: "authentication_key",
        type: "string",
        defaultValue: "cisco123",
        description: "OSPF authentication password",
        required: true,
      },
      {
        name: "router1_id",
        type: "ip",
        defaultValue: "1.1.1.1",
        description: "Router 1 OSPF router ID",
        required: true,
      },
      {
        name: "enable_authentication",
        type: "boolean",
        defaultValue: "true",
        description: "Enable OSPF authentication",
        required: false,
      },
    ],
    isPublic: true,
    authorId: "system",
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-25"),
    usageCount: 634,
  },
];

export const templateCategories: LabTemplateCategory[] = [
  {
    id: "networking-fundamentals",
    name: "Networking Fundamentals",
    description:
      "Basic networking concepts, device configuration, and foundational skills",
    icon: "Network",
    templates: labTemplates.filter(
      (t) => t.category === "Networking Fundamentals",
    ),
  },
  {
    id: "switching",
    name: "Switching",
    description:
      "Layer 2 switching technologies, VLANs, spanning tree, and switch security",
    icon: "GitBranch",
    templates: labTemplates.filter((t) => t.category === "Switching"),
  },
  {
    id: "routing-protocols",
    name: "Routing Protocols",
    description:
      "Dynamic routing protocols including OSPF, EIGRP, BGP, and RIP",
    icon: "Route",
    templates: labTemplates.filter((t) => t.category === "Routing Protocols"),
  },
  {
    id: "security",
    name: "Security",
    description:
      "Network security implementations, ACLs, VPNs, and firewall configuration",
    icon: "Shield",
    templates: labTemplates.filter((t) => t.category === "Security"),
  },
  {
    id: "wan-technologies",
    name: "WAN Technologies",
    description: "Wide area network protocols, Frame Relay, PPP, and MPLS",
    icon: "Globe",
    templates: labTemplates.filter((t) => t.category === "WAN Technologies"),
  },
  {
    id: "wireless",
    name: "Wireless Networks",
    description: "Wireless access points, mobility, and wireless security",
    icon: "Wifi",
    templates: labTemplates.filter((t) => t.category === "Wireless"),
  },
];
