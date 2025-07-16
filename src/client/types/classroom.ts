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
  courseName: string;
  description: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Instructor {
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  profileImage: string | null;
}

export interface Student {
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  profileImage: string | null;
  enrolledAt: Date;
}

export interface UserGroups {
  id: string;
  groupName: string;
  description: string | null;
  createdAt: Date;
  students: Student[];
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
