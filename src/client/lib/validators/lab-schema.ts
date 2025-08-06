import { z } from "zod";

export const labSettingsSchema = z.object({
  labId: z.string().optional(),
  maxAttemptSubmission: z.number(),
  onForceExitUponTimeout: z.boolean(),
  disableInteractiveLab: z.boolean(),
  noLateSubmission: z.boolean(),
  visible: z.boolean(),
});

export const topologyLinkSchema = z.object({
  id: z.string(),
  topologyId: z.string().optional(), // Added topologyId as it's in the provided data
  source: z.string(),
  target: z.string(),
  sourcePort: z.string(),
  targetPort: z.string(),
  status: z.union([z.literal("up"), z.literal("down")]).nullish(),
});

export const topologyNoteSchema = z.object({
  id: z.string(),
  topologyId: z.string().optional(), // Added topologyId
  text: z.string(),
  x: z.number(),
  y: z.number(),
  width: z.number(),
  height: z.number(),
});

export const deviceInterfaceSchema = z.object({
  id: z.string(),
  topologyNodeId: z.string().optional(),
  name: z.string(),
  ipAddress: z.string().nullish(),
  subnet: z.string().nullish(),
  enabled: z.boolean().nullish(),
  status: z
    .union([z.literal("up"), z.literal("down"), z.literal("admin_down")])
    .nullish(),
});

export const sSHConnectionSchema = z.object({
  deviceName: z.string(),
  host: z.string(),
  port: z.number(),
  username: z.string(),
  password: z.string(),
});

export const labConnectionSchema = z.object({
  id: z.string(),
  from: z.string(),
  to: z.string(),
  fromPort: z.string(),
  toPort: z.string(),
});

export const labContentSchema = z.object({
  id: z.string(),
  sectionId: z.string().optional(),
  type: z.union([
    z.literal("text"),
    z.literal("code"),
    z.literal("image"),
    z.literal("video"),
    z.literal("callout"),
    z.literal("topology"),
    z.literal("terminal"),
  ]),
  content: z.string(),
  metadata: z
    .object({
      labContentId: z.string().optional(), // Added labContentId
      language: z.string().nullish(),
      device: z.string().nullish(),
      command: z.string().nullish(),
      expected_output: z.string().nullish(),
      callout_type: z
        .union([
          z.literal("info"),
          z.literal("warning"),
          z.literal("success"),
          z.literal("error"),
          z.literal("tip"),
        ])
        .nullish(),
    })
    .nullish(),
});

export const labTaskSchema = z.object({
  id: z.string(),
  sectionId: z.string().optional(),
  description: z.string(),
  device: z.string().optional(),
  commands: z.array(z.string()).optional(),
  expectedResult: z.string().nullish(),
  isCompleted: z.boolean(),
  hints: z.array(z.string()),
});

export const verificationStepSchema = z.object({
  id: z.string(),
  sectionId: z.string().optional(),
  description: z.string(),
  commands: z.array(z.string()),
  expectedOutput: z.array(z.string()),
  device: z.string(),
  isCompleted: z.boolean(),
  requiresScreenshot: z.boolean().optional(),
});

export const labResourceSchema = z.object({
  id: z.string(),
  labId: z.string().optional(),
  title: z.string(),
  type: z.union([
    z.literal("documentation"),
    z.literal("cheat_sheet"),
    z.literal("reference"),
    z.literal("download"),
  ]),
  url: z.string(),
  description: z.string(),
});

export const labProgressSchema = z.object({
  labId: z.string(),
  userId: z.string(),
  currentSection: z.number(),
  completedSections: z.array(z.number()),
  completedTasks: z.array(z.string()),
  completedVerifications: z.array(z.string()),
  startedAt: z.date(),
  status: z.union([
    z.literal("not_started"),
    z.literal("in_progress"),
    z.literal("completed"),
  ]),
});

export const topologyNodeSchema = z.object({
  id: z.string(),
  topologyId: z.string().optional(), // Added topologyId
  name: z.string(),
  type: z.union([
    z.literal("router"),
    z.literal("switch"),
    z.literal("pc"),
    z.literal("server"),
    z.literal("firewall"),
    z.literal("cloud"),
  ]),
  x: z.number(),
  y: z.number(),
  icon: z.string(),
  status: z
    .union([
      z.literal("running"),
      z.literal("stopped"),
      z.literal("starting"),
      z.literal("error"),
    ])
    .nullish(),
  applianceName: z.string().nullish(),
  credentials: z
    .object({
      username: z.string(),
      password: z.string(),
    })
    .nullish(),
  interfaces: z.array(deviceInterfaceSchema),
});

export const labSectionSchema = z.object({
  id: z.string(),
  guideId: z.string().optional(),
  title: z.string(),
  type: z.union([
    z.literal("introduction"),
    z.literal("step"),
    z.literal("verification"),
    z.literal("troubleshooting"),
    z.literal("summary"),
  ]),
  order: z.number(),
  estimatedTime: z.number(),
  content: z.array(labContentSchema),
  tasks: z.array(labTaskSchema),
  verifications: z.array(verificationStepSchema),
  hints: z.array(z.string()),
});

export const networkTopologySchema = z.object({
  environmentId: z.string().optional(),
  nodes: z.array(topologyNodeSchema),
  links: z.array(topologyLinkSchema),
  notes: z.array(topologyNoteSchema),
  layout: z.object({
    width: z.number(),
    height: z.number(),
  }),
});

export const labGuideSchema = z.object({
  labId: z.string().optional(),
  sections: z.array(labSectionSchema),
  currentSection: z.number(),
});

export const labEnvironmentSchema = z.object({
  labId: z.string().optional(),
  type: z.literal("GNS3"),
  topology: networkTopologySchema,
  startupConfig: z.string().optional(),
});

export const labSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  difficulty: z.union([
    z.literal("BEGINNER"),
    z.literal("INTERMEDIATE"),
    z.literal("ADVANCED"),
  ]),
  estimatedTime: z.number(),
  category: z.string(),
  tags: z.array(z.string()),
  objectives: z.array(z.string()),
  prerequisites: z.array(z.string()),
  environment: labEnvironmentSchema,
  guide: labGuideSchema,
  resources: z.array(labResourceSchema),
  settings: labSettingsSchema,
  createdBy: z.string().optional(),
  status: z.union([z.literal("DRAFT"), z.literal("PUBLISHED")]).optional(),
  createdAt: z.union([z.string(), z.number()]),
  updatedAt: z.union([z.string(), z.number()]).optional(), // Added updatedAt
});

export type Lab = z.infer<typeof labSchema>;
export type LabDifficulty = z.infer<typeof labSchema>["difficulty"];
export type LabContent = z.infer<typeof labContentSchema>;
export type LabTask = z.infer<typeof labTaskSchema>;
export type VerificationStep = z.infer<typeof verificationStepSchema>;
export type LabResource = z.infer<typeof labResourceSchema>;
export type TopologyNode = z.infer<typeof topologyNodeSchema>;
export type TopologyLink = z.infer<typeof topologyLinkSchema>;
export type TopologyNote = z.infer<typeof topologyNoteSchema>;
export type LabSection = z.infer<typeof labSectionSchema>;
