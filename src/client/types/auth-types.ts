import { Permission } from "./roles-permissions-types";

type User = {
  name: string | null;
  id: string;
  username: string;
  email: string;
  role: "administrator" | "instructor" | "student";
  createdAt: Date;
  updatedAt: Date;
};

type Classroom = {
  id: string;
  classroomName: string;
  instructorId: string;
  status: "active" | "expired" | "archived" | "locked";
  courseId?: string | undefined;
};

type Groups = {
  id: string;
  groupName: string;
  classroomId: string;
};

export interface IUser extends User {
  permissions: Permission[];
  student: {
    classrooms?: Classroom[];
    userGroups?: Groups[];
    lastActiveAt?: Date;
    isOnline?: boolean;
  };
}

export interface LoginFormValues {
  email: string;
  password: string;
}
