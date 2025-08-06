import { z } from "zod";

// Base schemas for role-specific data
const instructorDataSchema = z.object({
  expertise: z.array(z.string()).optional(),
  classroomIds: z.array(z.string()).default([]).optional(),
});

const studentDataSchema = z.object({
  classroomIds: z.array(z.string()).default([]).optional(),
  groupIds: z.array(z.string()).default([]).optional(),
});

// Base user schema with role-based validation
const baseUserSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  username: z.string().min(3, "Username must be at least 3 characters"),
  role: z.enum(["instructor", "student"]),
});

// Create mode: password is required + role-based data validation
export const userCreateSchema = z.discriminatedUnion("role", [
  baseUserSchema.extend({
    role: z.literal("instructor"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    instructor: instructorDataSchema.optional(),
  }),
  baseUserSchema.extend({
    role: z.literal("student"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    student: studentDataSchema.optional(),
  }),
]);

// Edit mode: all fields optional but validated when provided
export const userUpdateSchema = z.object({
  name: z.string().min(1, "Name is required").optional(),
  email: z.string().email("Invalid email address").optional(),
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .optional(),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .optional(),
  role: z.enum(["instructor", "student"]).optional(),
  instructor: instructorDataSchema.partial().optional(),
  student: studentDataSchema.partial().optional(),
});

export const userDeleteSchema = z.array(z.string());

// Database schema with proper role-based structure

const courseSchema = z.object({
  id: z.string(),
  courseCode: z.string(),
  courseName: z.string(),
});

const classroomSchema = z.object({
  id: z.string(),
  classroomName: z.string(),
  course: courseSchema,
});

const userGroupSchema = z.object({
  id: z.string(),
  groupName: z.string(),
});

const instructorDbDataSchema = z.object({
  isOnline: z.string(),
  lastActiveAt: z.date(),
  expertise: z.array(z.string()),
  classrooms: z.array(classroomSchema).default([]),
});

const studentDbDataSchema = z.object({
  isOnline: z.string(),
  lastActiveAt: z.date(),
  classrooms: z.array(classroomSchema).default([]),
  userGroups: z.array(userGroupSchema).default([]),
});

// used for returned user data from the database — uses full object shapes like
export const userDbSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string(),
  username: z.string(),
  role: z.enum(["student", "instructor"]),
  instructor: instructorDbDataSchema,
  student: studentDbDataSchema,
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const userBulkCreateSchema = z.object({
  users: z.array(userCreateSchema),
});

export type UserBulkCreateData = z.infer<typeof userBulkCreateSchema>;

// Shared types
export type UserCreateData = z.infer<typeof userCreateSchema>;
export type UserEditData = z.infer<typeof userUpdateSchema>;
export type UserDeleteData = z.infer<typeof userDeleteSchema>;
export type UserDbData = z.infer<typeof userDbSchema>;

// Helper type guards for TypeScript
export const isInstructorUser = (
  user: UserDbData,
): user is Extract<UserDbData, { role: "instructor" }> => {
  return user.role === "instructor";
};

export const isStudentUser = (
  user: UserDbData,
): user is Extract<UserDbData, { role: "student" }> => {
  return user.role === "student";
};
