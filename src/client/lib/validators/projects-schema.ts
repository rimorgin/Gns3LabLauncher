import { z } from "zod";

export const projectFormSchema = z.object({
  projectName: z.string().min(2, "Project name is required"),
  projectDescription: z.string().optional(), // Can be empty or omitted
  visible: z.boolean(),
  classroomIds: z.array(z.string()),
  tags: z.enum(["networking", "cybersecurity"]).describe("Tags is required"),
  duration: z.date().nullable().optional(),
  imageUrl: z.string().optional(),
  labId: z.string().optional(),
  byGroupSubmissions: z.boolean().optional(),
});

export const projectDbSchema = z.object({
  id: z.string(),
  projectName: z.string(),
  projectDescription: z.string().optional(),
  tags: z.string().optional(),
  imageUrl: z.string().optional(),
  progress: z.number().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
  visible: z.boolean(),
  duration: z.string().nullable(),
  labId: z.string().optional(),
  byGroupSubmissions: z.boolean().optional(),
  classrooms: z.array(
    z.object({
      id: z.string(),
      classroomName: z.string(),
      status: z.string(),
      course: z.object({
        courseCode: z.string(),
        courseName: z.string(),
      }),
    }),
  ),
  submissions: z
    .array(
      z.object({
        id: z.string(),
        student: z.array(
          z.object({
            id: z.string(),
            name: z.string(),
          }),
        ),
        group: z.array(
          z.object({
            id: z.string(),
            groupName: z.string(),
          }),
        ),
        grade: z.number().optional(),
        feedback: z.string().optional(),
        files: z.array(z.string()).optional(),
      }),
    )
    .optional(),
});

export type ProjectDbData = z.infer<typeof projectDbSchema>;
export type ProjectFormData = z.infer<typeof projectFormSchema>;
