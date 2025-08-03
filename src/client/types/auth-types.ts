import { LabProgress, Progress } from "./progress";
import { Permission } from "./roles-permissions-types";
import { LabSubmission } from "./submission";

type User = {
  name: string | null;
  id: string;
  username: string;
  email: string;
  role: "administrator" | "instructor" | "student";
  bio?: string;
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
    progress: Progress[];
    labProgress: LabProgress[];
    submissions: LabSubmission[];
  };
}

export interface LoginFormValues {
  email: string;
  password: string;
}
