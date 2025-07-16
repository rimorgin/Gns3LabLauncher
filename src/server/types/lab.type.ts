export interface Lab {
  id: string;
  title: string;
  description: string;
  difficulty: "BEGINNER" | "INTERMEDIATE" | "ADVANCED";
  estimatedTime: number; // in minutes
  category: string;
  tags: string[];
  objectives: string[];
  prerequisites: string[];
  labEnvironment: LabEnvironment;
  guide: LabGuide;
  resources: LabResource[];
  createdAt: Date;
  updatedAt: Date;
}

export interface LabEnvironment {
  id: string;
  type: "GNS3" | "VIRTUAL_MACHINE" | "CONTAINER" | "SIMULATOR" | "CLOUD";
  topology: NetworkTopology;
  devices: LabDevice[];
  connections?: LabConnection[];
}

export interface NetworkTopology {
  nodes: TopologyNode[];
  links: TopologyLink[];
  layout: {
    width: number;
    height: number;
  };
}

export interface TopologyNode {
  id: string;
  name: string;
  type: "router" | "switch" | "pc" | "server" | "firewall" | "cloud";
  x: number;
  y: number;
  icon: string;
  status?: "running" | "stopped" | "starting" | "error";
}

export interface TopologyLink {
  id: string;
  source: string;
  target: string;
  sourcePort: string;
  targetPort: string;
  status?: "up" | "down";
}

export interface LabDevice {
  id: string;
  name: string;
  type: string;
  ipAddress?: string;
  credentials?: {
    username: string;
    password: string;
  };
  interfaces: DeviceInterface[];
}

export interface DeviceInterface {
  name: string;
  ipAddress?: string;
  subnet?: string;
  enabled?: boolean;
  status?: "up" | "down" | "admin-down";
}

export interface SSHConnection {
  deviceName: string;
  host: string;
  port: number;
  username: string;
  password: string;
}

export interface LabConnection {
  id: string;
  from: string;
  to: string;
  fromPort: string;
  toPort: string;
}

export interface LabGuide {
  id: string;
  sections: LabSection[];
  currentSection: number;
  completedSections: number[];
}

export interface LabSection {
  id: string;
  title: string;
  type:
    | "introduction"
    | "step"
    | "verification"
    | "troubleshooting"
    | "summary";
  order: number;
  estimatedTime: number;
  content: LabContent[];
  tasks: LabTask[];
  verification: VerificationStep[];
  hints: string[];
}

export interface LabContent {
  id: string;
  type:
    | "text"
    | "code"
    | "image"
    | "video"
    | "callout"
    | "topology"
    | "terminal";
  content: string;
  metadata?: {
    language?: string;
    device?: string;
    command?: string;
    expected_output?: string;
    callout_type?: "info" | "warning" | "success" | "error" | "tip";
  };
}

export interface LabTask {
  id: string;
  description: string;
  device?: string;
  commands?: string[];
  expectedResult?: string;
  isCompleted: boolean;
  hints: string[];
}

export interface VerificationStep {
  id: string;
  description: string;
  command: string;
  expectedOutput: string;
  device: string;
  isCompleted: boolean;
}

export interface LabResource {
  id: string;
  title: string;
  type: "documentation" | "cheat_sheet" | "reference" | "download";
  url: string;
  description: string;
}

export interface LabProgress {
  labId: string;
  userId: string;
  currentSection: number;
  completedSections: number[];
  completedTasks: string[];
  completedVerifications: string[];
  startedAt: Date;
  lastAccessedAt: Date;
  timeSpent: number; // in seconds
  status: "not_started" | "in_progress" | "completed";
}
