import { Document, Types } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  username: string;
  password: string;
  role: "administrator" | "instructor" | "student";
  classes?: Types.ObjectId[];
  is_online?: boolean;
  last_active_at?: Date | null;
  created_at?: Date;
}
