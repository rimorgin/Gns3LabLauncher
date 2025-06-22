import { z } from "zod";

export const courseFormSchema = z.object({
  courseCode: z
    .string()
    .min(3, "Course code must be at least 3 characters")
    .max(20, "Course code must be under 20 characters"),
  courseName: z.string().min(2, "Course name is required"),
  classroomIds: z.array(z.string()).optional()
});

export type CourseFormData = z.infer<typeof courseFormSchema>;
