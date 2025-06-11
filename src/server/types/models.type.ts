import { Document, Types } from "mongoose";

/**
 * Represents a user in the system.
 *
 * @property {string} name - The full name of the user.
 * @property {string} email - The email address of the user (must be unique).
 * @property {string} username - The username chosen by the user (must be unique).
 * @property {string} password - The password of the user (should be hashed).
 * @property {"administrator" | "instructor" | "student"} role - The role of the user in the system.
 * @property {Types.ObjectId[]} [classes] - An array of ObjectIds referencing the classrooms the user is associated with.
 * @property {boolean} [is_online] - Indicates whether the user is currently online.
 * @property {Date | null} [last_active_at] - The timestamp when the user was last active.
 * @property {Date} [created_at] - The timestamp when the user account was created.
 */
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

/**
 * Represents an academic course.
 *
 * @property {string} coursecode - The unique code identifying the course (e.g., CS101).
 * @property {string} coursename - The full name of the course (e.g., Introduction to Computer Science).
 */
export interface ICourse extends Document {
  coursecode: string;
  coursename: string;
}

/**
 * Represents a classroom instance tied to a specific course.
 *
 * @property {Types.ObjectId} courseid - Reference to the course this classroom belongs to.
 * @property {string} classname - The name/section of the classroom (e.g., Section A - Fall 2025).
 * @property {string} instructor - The username or ID of the instructor managing this classroom.
 * @property {Types.ObjectId[]} students - An array of student user IDs enrolled in this classroom.
 * @property {"active" | "expired"} status - The current status of the classroom.
 */
export interface IClassroom extends Document {
  courseid: Types.ObjectId;
  classname: string;
  instructor: string;
  students: Types.ObjectId[];
  status: "active" | "expired";
}

/**
 * Represents a project assigned within one or more classrooms.
 *
 * @property {string} projectname - The name/title of the project.
 * @property {string} description - A detailed description of the project requirements and goals.
 * @property {Types.ObjectId[]} classroom - An array of classroom IDs where this project is visible or assigned.
 * @property {boolean} visible - Indicates whether the project is currently visible to students.
 */
export interface IProject extends Document {
  projectname: string;
  description: string;
  classroom: Types.ObjectId[];
  visible: boolean;
}