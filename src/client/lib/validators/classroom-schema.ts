import { z } from "zod";

export const classroomFormSchema = z.object({
  classroomName: z.string().min(3, "Classroom name must be at least 3 characters"),
  instructorId: z.string(),
  status: z.enum(["active", "expired"]),
  courseId: z.string().optional(),
  studentIds: z.array(z.string()).optional(),
  projectIds: z.array(z.string()).optional()
});

export type ClassroomFormData = z.infer<typeof classroomFormSchema>;
