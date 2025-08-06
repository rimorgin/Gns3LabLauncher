import { z } from "zod";

export const classroomCreateSchema = z.object({
  classroomName: z
    .string()
    .min(3, "Classroom name must be at least 3 characters"),
  instructorId: z.string().min(2, "Classroom Instructor is required"),
  status: z.enum(["active", "expired", "archived", "locked"]),
  courseId: z.string().optional(),
  studentIds: z.array(z.string()).optional(),
  imageUrl: z.string().optional(),
});

export const classroomUpdateSchema = z.object({
  classroomName: z
    .string()
    .min(3, "Classroom name must be at least 3 characters")
    .optional(),
  instructorId: z
    .string()
    .min(2, "Classroom Instructor is required")
    .optional(),
  status: z.enum(["active", "expired", "archived", "locked"]).optional(),
  courseId: z.string().optional(),
  studentIds: z.array(z.string()).optional(),
  imageUrl: z.string().optional(),
});

export const ClassroomDbSchema = z.object({
  id: z.string(),
  classroomName: z.string(),
  status: z.enum(["active", "expired", "archived", "locked"]),
  course: z.object({
    id: z.string(),
    courseCode: z.string(),
    courseName: z.string().nullable().optional(),
  }),
  instructor: z.object({
    userId: z.string(),
    user: z.object({
      name: z.string(),
      email: z.string(),
      username: z.string(),
    }),
  }),
  students: z.array(
    z.object({
      userId: z.string(),
      user: z.object({
        name: z.string(),
        email: z.string(),
        username: z.string(),
      }),
    }),
  ),
  projects: z.array(
    z.object({
      id: z.string(),
      projectName: z.string(),
      projectDescription: z.string(),
      visible: z.boolean(),
      duration: z.date(),
    }),
  ),
  imageUrl: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type ClassroomDbData = z.infer<typeof ClassroomDbSchema>;
export type ClassroomFormData = z.infer<typeof classroomCreateSchema>;
