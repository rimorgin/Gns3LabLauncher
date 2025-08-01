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
  environment: LabEnvironment;
  guide: LabGuide;
  resources: LabResource[];
  settings: LabSettings;
  createdBy?: string;
  status?: "DRAFT" | "PUBLISHED";
  createdAt: string | number | Date;
}

export interface LabSettings {
  labId?: string;
  maxAttemptSubmission: number;
  onForceExitUponTimeout: boolean;
  disableInteractiveLab: boolean;
  noLateSubmission: boolean;
  visible: boolean;
}

export interface LabEnvironment {
  labId: string;
  type: "GNS3";
  topology: NetworkTopology;
  startupConfig?: string;
}

export interface NetworkTopology {
  environmentId?: string;
  nodes: TopologyNode[];
  links: TopologyLink[];
  notes: TopologyNote[];
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
  applianceName?: string; // "Cisco 2901"
  credentials?: {
    username: string;
    password: string;
  };
  interfaces: DeviceInterface[];
}

export interface TopologyLink {
  id: string;
  source: string;
  target: string;
  sourcePort: string;
  targetPort: string;
  status?: "up" | "down";
}

export interface TopologyNote {
  id: string;
  text: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface DeviceInterface {
  id: string;
  topologyNodeId?: string;
  name: string;
  ipAddress?: string;
  subnet?: string;
  enabled?: boolean;
  status?: "up" | "down" | "admin_down";
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
  labId: string;
  sections: LabSection[];
  currentSection: number;
  completedSections: number[];
}

export interface LabSection {
  id: string;
  guideId?: string;
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
  verifications: VerificationStep[];
  hints: string[];
}

export interface LabContent {
  id: string;
  sectionId?: string;
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
  sectionId?: string;
  description: string;
  device?: string;
  commands?: string[];
  expectedResult?: string;
  isCompleted: boolean;
  hints: string[];
}

export interface VerificationStep {
  id: string;
  sectionId?: string;
  description: string;
  commands: string[];
  expectedOutput: string[];
  device: string;
  isCompleted: boolean;
  requiresScreenshot?: boolean;
}

export interface LabResource {
  id: string;
  labId?: string;
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
  status: "not_started" | "in_progress" | "completed";
}
