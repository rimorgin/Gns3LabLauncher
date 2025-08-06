import { z } from "zod";

export const courseCreateSchema = z.object({
  courseCode: z
    .string()
    .min(3, "Course code must be at least 3 characters")
    .max(20, "Course code must be under 20 characters"),
  courseName: z.string().min(2, "Course name is required"),
  classroomIds: z.array(z.string()).optional(),
  imageUrl: z.string().optional(),
});

export const courseUpdateSchema = courseCreateSchema.partial();

export const courseDbSchema = z.object({
  id: z.string(),
  courseCode: z.string(),
  courseName: z.string(),
  classrooms: z.array(
    z.object({
      id: z.string(),
      classroomName: z.string(),
      status: z.string(),
    }),
  ),
  imageUrl: z.string().optional(),
});

export type CourseFormData = z.infer<typeof courseCreateSchema>;
export type CourseDbData = z.infer<typeof courseDbSchema>;
