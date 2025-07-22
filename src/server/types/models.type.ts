import {
  ClassroomStatusEnum,
  ProjectTagsEnum,
  UserRolesEnum,
} from "@prisma/client";

/**
 * Represents a base user profile in the system.
 *
 * @property {string} name - The full name of the user.
 * @property {string} email - The email address of the user (must be unique).
 * @property {string} username - The username chosen by the user (must be unique).
 * @property {string} password - The password of the user (should be hashed).
 * @property {"administrator" | "instructor" | "student"} role - The role of the user in the system.
 */

// Input base (includes password)
export interface IUserBaseInput {
  name: string;
  email: string;
  username: string;
  password: string;
  role: UserRolesEnum;
}

// Output base (no password)
export interface IUserBaseOutput {
  name?: string | null;
  email: string;
  username: string;
  role: UserRolesEnum;
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

// ✅ Input types
export type AdministratorUserInput = IUserBaseInput & {
  role: "administrator";
};

export type InstructorUserInput = IUserBaseInput & {
  role: "instructor";
  instructor: {
    expertise: string[];
    classroomIds: string[];
  };
};

export type StudentUserInput = IUserBaseInput & {
  role: "student";
  student: {
    groupIds: string[];
    classroomIds: string[];
  };
};

export type IUserWithRoleInput =
  | AdministratorUserInput
  | InstructorUserInput
  | StudentUserInput;

export type IUserWithRoleOutput = IUserBaseOutput & {
  student?: {
    userId: string;
    groupIds?: string[];
    classroomIds?: string[];
    isOnline?: boolean;
    lastActiveAt?: Date | null;
  } | null;
  instructor?: {
    userId: string;
    expertise?: string[];
    classroomIds?: string[];
    isOnline?: boolean;
    lastActiveAt?: Date | null;
  } | null;
  administrator?: {
    userId: string;
    isOnline?: boolean;
    lastActiveAt?: Date | null;
  } | null;
};

export interface IStudentUser {
  userId: string;
  isOnline: boolean;
  lastActiveAt: Date;
  classrooms: [];
  userGroups: [];
}

export interface IUserGroup {
  groupName: string;
  classroomId: string;
  limit: number;
  studentIds: string[];
  imageUrl: string | null;
}

/**
 * Represents an academic course.
 *
 * @property {string} courseCode - The unique code identifying the course (e.g., CS101).
 * @property {string} courseName - The full name of the course (e.g., Introduction to Computer Science).
 */
export interface ICourse {
  courseCode: string;
  courseName: string | null;
  classroomIds?: string[];
  imageUrl: string | null;
}

/**
 * Represents a classroom instance tied to a specific course.
 *
 * @property {string} courseId - Reference to the course this classroom belongs to.
 * @property {string} classroomName - The name/section of the classroom (e.g., Section A - Fall 2025).
 * @property {string} instructorId - The ID of the instructor managing this classroom.
 * @property {string[]} studentsIds - An array of student user IDs enrolled in this classroom.
 * @property {string[]} projectIds - An array of project IDs assigned in this classroom.
 * @property {"active" | "expired" | "archived" | "locked"} status - The current status of the classroom.
 */
export interface IClassroom {
  classroomName: string;
  status: ClassroomStatusEnum;
  imageUrl: string | null; // Always included
  courseId: string;
  instructorId?: string | null;
  projectIds?: string[];
  studentIds?: string[];
}

/**
 * Represents a project assigned within one or more classrooms.
 *
 * @property {string} projectname - The name/title of the project.
 * @property {string} description - A detailed description of the project requirements and goals.
 * @property {string[]} classroomId - An array of classroom IDs where this project is visible or assigned.
 * @property {boolean} visible - Indicates whether the project is currently visible to students.
 * @property {boolean} byGroupSubmissions - Indicates whether the project is by group or individual.
 * @property {Date} duration - indicates when will the project expire
 * @property {string} imageUrl - indicates url path on the frontend side
 * @property {Enum<"networking" | "cyberscurity">} enum of networking or cybersecurity
 */
export interface IProject {
  projectName: string;
  projectDescription?: string | null;
  visible?: boolean | null;
  imageUrl: string | null; // Always included
  duration?: Date | null;
  byGroupSubmissions?: boolean | null;
  tags: ProjectTagsEnum | null; // Change this line to allow string or null
  classroomIds?: string[] | null;
  labId?: string | null;
}

export interface IStudentProgress {
  projectId: string;
  classroomId: string;
  studentId: string;
  groupId?: never; // Enforces exclusion
  percentComplete: number;
  status: string;
}

export interface IGroupProgress {
  projectId: string;
  classroomId: string;
  studentId?: never; // Enforces exclusion
  groupId: string;
  percentComplete: number;
  status: string;
}

export type IProgress = IStudentProgress | IGroupProgress;
