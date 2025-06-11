import { z } from "zod";

export const classroomFormSchema = z.object({
  courseid: z.string().min(2, "Course code is required"),
  classname: z.string().min(3, "Class name must be at least 3 characters"),
  instructor: z.string().optional(),
  status: z.enum(["active", "expired"]),
});

export type ClassroomFormData = z.infer<typeof classroomFormSchema>;
