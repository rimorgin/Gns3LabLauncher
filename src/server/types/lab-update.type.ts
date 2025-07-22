export interface LabUpdateData {
  id: string;
  title?: string;
  description?: string;
  difficulty?: string;
  estimatedTime?: number;
  category?: string;
  tags?: string[];
  objectives?: string[];
  prerequisites?: string[];
  status?: string;
  environment?: LabEnvironmentUpdate;
  guide?: LabGuideUpdate;
  resources?: LabResourceUpdate[];
}

export interface LabEnvironmentUpdate {
  type?: string;
  startupConfig?: string;
  topology?: NetworkTopologyUpdate;
  devices?: LabDeviceUpdate[];
}

export interface NetworkTopologyUpdate {
  width?: number;
  height?: number;
  notes?: TopologyNoteUpdate[];
  nodes?: TopologyNodeUpdate[];
  links?: TopologyLinkUpdate[];
}

export interface TopologyNoteUpdate {
  id?: string;
  text?: string;
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  _action?: "create" | "update" | "delete";
}

export interface TopologyNodeUpdate {
  id?: string;
  name?: string;
  type?: string;
  x?: number;
  y?: number;
  icon?: string;
  status?: string;
  _action?: "create" | "update" | "delete";
}

export interface TopologyLinkUpdate {
  id?: string;
  source?: string;
  target?: string;
  sourcePort?: string;
  targetPort?: string;
  status?: string;
  _action?: "create" | "update" | "delete";
}

export interface LabDeviceUpdate {
  id?: string;
  name?: string;
  type?: string;
  applianceName?: string;
  ipAddress?: string;
  interfaces?: DeviceInterfaceUpdate[];
  _action?: "create" | "update" | "delete";
}

export interface DeviceInterfaceUpdate {
  id?: string;
  name?: string;
  ipAddress?: string;
  subnet?: string;
  enabled?: boolean;
  status?: string;
  _action?: "create" | "update" | "delete";
}

export interface LabGuideUpdate {
  currentSection?: number;
  sections?: LabSectionUpdate[];
}

export interface LabSectionUpdate {
  id?: string;
  title?: string;
  type?: string;
  order?: number;
  estimatedTime?: number;
  content?: LabContentUpdate[];
  tasks?: LabTaskUpdate[];
  verifications?: VerificationStepUpdate[];
  hints?: string[];
  _action?: "create" | "update" | "delete";
}

export interface LabContentUpdate {
  id?: string;
  type?: string;
  content?: string;
  metadata?: LabContentMetadataUpdate;
  _action?: "create" | "update" | "delete";
}

export interface LabContentMetadataUpdate {
  language?: string;
  device?: string;
  command?: string;
  expected_output?: string;
  callout_type?: string;
}

export interface LabTaskUpdate {
  id?: string;
  description?: string;
  device?: string;
  isCompleted?: boolean;
  hints?: string[];
  _action?: "create" | "update" | "delete";
}

export interface VerificationStepUpdate {
  id?: string;
  description?: string;
  command?: string;
  expectedOutput?: string;
  device?: string;
  isCompleted?: boolean;
  _action?: "create" | "update" | "delete";
}

export interface LabResourceUpdate {
  id?: string;
  title?: string;
  type?: string;
  url?: string;
  description?: string;
  _action?: "create" | "update" | "delete";
}
