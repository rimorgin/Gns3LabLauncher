import type { LabGuide, LabResource, LabEnvironment } from "./lab";

export interface LabTemplate {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: "BEGINNER" | "INTERMEDIATE" | "ADVANCED";
  estimatedTime: number;
  tags: string[];
  thumbnail: string;
  objectives: string[];
  prerequisites: string[];
  environment: LabEnvironment;
  guide: LabGuide; // Use the same type from lab.ts
  resources: LabResource[]; // Use the same type from lab.ts
  variables: TemplateVariable[];
  isPublic: boolean;
  authorId: string;
  createdAt: Date;
  updatedAt: Date;
  usageCount: number;
}

export interface TemplateVariable {
  name: string;
  type: "string" | "number" | "ip" | "subnet" | "boolean";
  defaultValue: string;
  description: string;
  required: boolean;
}

export interface LabTemplateCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  templates: LabTemplate[];
}

// Template creation helper - converts template to actual lab
export interface LabFromTemplate {
  templateId: string;
  customizations: {
    name?: string;
    description?: string;
    variables: Record<string, string>;
  };
}
