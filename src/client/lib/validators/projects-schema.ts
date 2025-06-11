import { z } from "zod";

export const projectFormSchema = z.object({
  projectname: z.string().min(2, "Project name is required"),
  description: z.string().optional(), // Can be empty or omitted
  visible: z.boolean(),
  classroom: z.array(z.string()).optional(), // Can be empty or omitted
});

export type ProjectFormData = z.infer<typeof projectFormSchema>;
