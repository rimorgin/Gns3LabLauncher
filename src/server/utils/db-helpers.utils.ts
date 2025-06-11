import bcrypt from "bcrypt";
import User from "@srvr/models/user.model.ts";
import Course from "@srvr/models/course.model.ts";
import Classroom from "@srvr/models/classroom.model.ts";
import Projects from "@srvr/models/projects.model.ts";
import { IClassroom, ICourse, IProject, IUser } from "@srvr/types/models.type.ts";
import { HydratedDocument } from "mongoose";

/**
 * Creates a new user with the provided details, capitalizes the name, and hashes the password.
 *
 * @function createUser
 *
 * @param {IUser} props - The user properties used to create the new user.
 * @param {string} props.name - The full name of the user (will be capitalized).
 * @param {string} props.email - The email address of the user.
 * @param {string} props.username - The username chosen by the user.
 * @param {string} props.password - The raw password which will be hashed before saving.
 * @param {RoleName} props.role - The role assigned to the user (e.g., 'admin', 'student').
 * @param {ObjectId} [props.classes] - Optional class ID assigned to the user.
 *
 * @returns {Promise<IUser>} A promise that resolves to the newly created user instance.
 *
 * @throws {Error} If hashing the password or saving the user fails.
 */
export const createUser = async (props: IUser): Promise<IUser> => {
  const capitalizedName = props.name
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
  console.log(capitalizedName);
  const hashedPassword = await bcrypt.hash(props.password, 12);
  const user = await User.create({
    name: capitalizedName,
    email: props.email,
    username: props.username,
    password: hashedPassword,
    role: props.role,
    classes: props.classes,
  });
  return user;
};

/**
 * Creates a new course with the provided course code and name.
 *
 * @function createCourse
 *
 * @param {ICourse} props - The course properties used to create the new course.
 * @param {string} props.coursecode - The unique identifier code for the course.
 * @param {string} props.coursename - The full name of the course.
 *
 * @returns {Promise<ICourse>} A promise that resolves to the newly created course instance.
 *
 * @throws {Error} If creating the course fails.
 */
export const createCourse = async (props: ICourse): Promise<ICourse> => {
  const course = await Course.create({
    coursecode: props.coursecode,
    coursename: props.coursename,
  });
  return course;
};

/**
 * Creates a new classroom associated with a specific course.
 *
 * @function createClassroom
 *
 * @param {IClassroom} props - The classroom properties used to create the new classroom.
 * @param {ObjectId} props.courseid - The ID of the course this classroom belongs to.
 * @param {string} props.classname - The name/identifier of the classroom.
 * @param {string} props.instructor - The instructor assigned to the classroom.
 * @param {string} props.status - The current status of the classroom (e.g., active, inactive).
 *
 * @returns {Promise<IClassroom>} A promise that resolves to the newly created classroom instance.
 *
 * @throws {Error} If creating the classroom fails.
 */
export const createClassroom = async (
  props: IClassroom
): Promise<IClassroom> => {
  const classroom = await Classroom.create({
    courseid: props.courseid,
    classname: props.classname,
    instructor: props.instructor,
    status: props.status,
  });
  return classroom;
};

/**
 * Creates a new project linked to a specific classroom.
 *
 * @function createProject
 *
 * @param {IProject} props - The project properties used to create the new project.
 * @param {string} props.projectname - The name of the project.
 * @param {string} props.description - A brief description of the project.
 * @param {ObjectId} props.classroom - The ID of the classroom this project is associated with.
 * @param {boolean} props.visible - Whether the project should be visible to students.
 *
 * @returns {Promise<IProjects>} A promise that resolves to the newly created project instance.
 *
 * @throws {Error} If creating the project fails.
 */
export const createProject = async (
  props: IProject
): Promise<IProject> => {
  const project = await Projects.create({
    projectname: props.projectname,
    description: props.description,
    classroom: props.classroom,
    visible: props.visible,
  });
  return project;
};