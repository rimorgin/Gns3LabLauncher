import { Permission } from "./roles-permissions-types";

type User = {
  name: string | null;
  id: string;
  username: string;
  email: string;
  password: string;
  role: "administrator" | "instructor" | "student";
  createdAt: Date;
  updatedAt: Date;
};

export interface IUser extends User {
  permissions: Permission[];
}

export interface LoginFormValues {
  email: string;
  password: string;
}
