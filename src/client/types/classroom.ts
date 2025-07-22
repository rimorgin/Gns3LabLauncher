import type { Project } from "./project"; // Assuming Project is defined in another file

export interface Classroom {
  id: string;
  classroomName: string;
  status: ClassroomStatusEnum;
  courseId: string | null;
  instructorId: string | null;
  imageUrl: string | null;
  createdAt: Date;
  updatedAt: Date;
  course?: Course;
  instructor?: Instructor;
  studentGroups: UserGroups[];
  projects: Project[];
  students: Student[];
  progress: ClassroomProgress[];
  _count: {
    students: number;
  };
}

export enum ClassroomStatusEnum {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  ARCHIVED = "ARCHIVED",
}

export interface Course {
  id: string;
  courseCode: string;
  courseName: string;
  description: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Instructor {
  userId: string;
  isOnline: Date | null;
  lastActiveAt: Date | null;
  user: {
    name: string;
    username: string;
    email: string;
    role: "administrator" | "instructor" | "student";
    createdAt: Date;
    updatedAt: Date;
    profileImage: string | null;
  };
}

export interface Student {
  userId: string;
  isOnline: Date | null;
  lastActiveAt: Date | null;
  user: {
    name: string;
    username: string;
    email: string;
    role: "administrator" | "instructor" | "student";
    createdAt: Date;
    updatedAt: Date;
    profileImage: string | null;
  };
}

export interface UserGroups {
  id: string;
  groupName: string;
  description: string | null;
  createdAt: Date;
  limit: number;
  student: Student[];
}

export interface ClassroomProgress {
  studentId: string;
  projectId: string;
  completedSteps: number;
  totalSteps: number;
  status: "NOT_STARTED" | "IN_PROGRESS" | "COMPLETED";
  lastAccessedAt: Date;
  student: Student;
  project: Project;
}
