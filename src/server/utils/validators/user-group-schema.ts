import { z } from "zod";

export const userGroupCreateSchema = z
  .object({
    classroomId: z.string(),
    groupName: z.string().optional(),
    studentIds: z.array(z.string().optional()),
    limit: z.number().default(5).optional(),
    imageUrl: z.string().optional(),
  })
  .refine(
    (data) => {
      const limit = data.limit ?? 5;
      const count = data.studentIds.filter(Boolean).length;
      return count <= limit;
    },
    {
      path: ["studentIds"], // attach error to the studentIds field
      message: "Number of students cannot exceed the group limit.",
    },
  );

export const userGroupUpdateSchema = z
  .object({
    classroomId: z.string().optional(),
    groupName: z.string().optional(),
    studentIds: z.array(z.string()).optional(),
    limit: z.number().optional(),
    imageUrl: z.string().optional(),
  })
  .refine(
    (data) => {
      // Only run this check if both `limit` and `studentIds` are provided
      if (data.limit !== undefined && data.studentIds !== undefined) {
        return data.studentIds.length <= data.limit;
      }
      return true;
    },
    {
      path: ["studentIds"],
      message: "Number of students cannot exceed the group limit.",
    },
  );

// Define the types based on your UserGroupData structure
const userGroupUserDbSchema = z.object({
  id: z.string(),
  name: z.string().nullable().optional(),
  username: z.string(),
  email: z.string(),
});

const userGroupStudentDbSchema = z.object({
  userId: z.string(),
  user: userGroupUserDbSchema,
});

const userGroupCourseDbSchema = z.object({
  courseCode: z.string(),
  courseName: z.string(),
});

const userGroupClassroomDbSchema = z.object({
  id: z.string(),
  classroomName: z.string(),
  course: userGroupCourseDbSchema.optional(),
});

export const userGroupDbSchema = z.object({
  id: z.string(),
  groupName: z.string(),
  classrooms: userGroupClassroomDbSchema.optional(),
  imageUrl: z.string(),
  student: userGroupStudentDbSchema.array().optional(),
  limit: z.number(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type UserGroupDbData = z.infer<typeof userGroupDbSchema>;
export type UserGroupFormData = z.infer<typeof userGroupCreateSchema>;
