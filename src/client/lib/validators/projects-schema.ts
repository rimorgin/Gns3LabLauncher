import { z } from "zod";

export const projectFormSchema = z.object({
  projectName: z.string().min(2, "Project name is required"),
  projectDescription: z.string().optional(), // Can be empty or omitted
  visible: z.boolean(),
  classroom: z.array(z.string()).optional(), // Can be empty or omitted
  classroomIds: z.array(z.string()).optional(),
  tags: z.enum(["networking", "cybersecurity"]).describe("Tags is required"),
  duration: z.date().optional(),
  imageUrl: z.string().optional(),
});

export type ProjectFormData = z.infer<typeof projectFormSchema>;
