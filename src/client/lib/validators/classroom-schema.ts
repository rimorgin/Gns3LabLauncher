import { z } from "zod";

export const classroomFormSchema = z.object({
  courseId: z.string().min(2, "Course code is required"),
  classroomName: z.string().min(3, "Classroom name must be at least 3 characters"),
  instructorId: z.string().optional(),
  status: z.enum(["active", "expired"]),
  studentIds: z.array(z.string()).optional(),
  projectIds: z.array(z.string()).optional()
});

export type ClassroomFormData = z.infer<typeof classroomFormSchema>;
