import { z } from "zod";

export const courseFormSchema = z.object({
  coursecode: z
    .string()
    .min(3, "Course code must be at least 3 characters")
    .max(20, "Course code must be under 20 characters"),
  coursename: z.string().min(2, "Course name is required"),
});

export type CourseFormData = z.infer<typeof courseFormSchema>;
