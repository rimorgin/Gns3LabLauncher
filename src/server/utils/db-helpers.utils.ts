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
 * Updates an existing user with the provided details.
 *
 * @param {string} id - The ID of the user to update.
 * @param {Partial<IUser>} updates - The updates to apply to the user.
 * @returns {Promise<IUser | null>} A promise that resolves to the updated user instance, or null if not found.
 */
export const updateUser = async (
  id: string,
  updates: Partial<IUser>
): Promise<IUser | null> => {
  if (updates.password) {
    updates.password = await bcrypt.hash(updates.password, 12);
  }
  const updatedUser = await User.findByIdAndUpdate(id, updates, {
    new: true,
  });
  return updatedUser;
};

/**
 * Deletes a user by their ID.
 *
 * @param {string} id - The ID of the user to delete.
 * @returns {Promise<IUser | null>} A promise that resolves to the deleted user instance, or null if not found.
 */
export const deleteUser = async (id: string): Promise<IUser | null> => {
  const deletedUser = await User.findByIdAndDelete(id);
  return deletedUser;
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
 * Updates an existing course with the provided details.
 *
 * @param {string} id - The ID of the course to update.
 * @param {Partial<ICourse>} updates - The updates to apply to the course.
 * @returns {Promise<ICourse | null>} A promise that resolves to the updated course instance, or null if not found.
 */
export const updateCourse = async (
  id: string,
  updates: Partial<ICourse>
): Promise<ICourse | null> => {
  const updatedCourse = await Course.findByIdAndUpdate(id, updates, {
    new: true,
  });
  return updatedCourse;
};
/**
 * Deletes a course by its ID.
 *
 * @param {string} id - The ID of the course to delete.
 * @returns {Promise<ICourse | null>} A promise that resolves to the deleted course instance, or null if not found.
 */
export const deleteCourse = async (id: string): Promise<ICourse | null> => {
  const deletedCourse = await Course.findByIdAndDelete(id);
  return deletedCourse;
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
 * Updates an existing classroom with the provided details.
 *
 * @param {string} id - The ID of the classroom to update.
 * @param {Partial<IClassroom>} updates - The updates to apply to the classroom.
 * @returns {Promise<IClassroom | null>} A promise that resolves to the updated classroom instance, or null if not found.
 */
export const updateClassroom = async (
  id: string,
  updates: Partial<IClassroom>
): Promise<IClassroom | null> => {
  const updatedClassroom = await Classroom.findByIdAndUpdate(id, updates, {
    new: true,
  });
  return updatedClassroom;
};
/**
 * Deletes a classroom by its ID.
 *
 * @param {string} id - The ID of the classroom to delete.
 * @returns {Promise<IClassroom | null>} A promise that resolves to the deleted classroom instance, or null if not found.
 */
export const deleteClassroom = async (
  id: string
): Promise<IClassroom | null> => {
  const deletedClassroom = await Classroom.findByIdAndDelete(id);
  return deletedClassroom;
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

/**
 * Updates an existing project with the provided details.
 *
 * @param {string} id - The ID of the project to update.
 * @param {Partial<IProject>} updates - The updates to apply to the project.
 * @returns {Promise<IProject | null>} A promise that resolves to the updated project instance, or null if not found.
 */
export const updateProject = async (
  id: string,
  updates: Partial<IProject>
): Promise<IProject | null> => {
  const updatedProject = await Projects.findByIdAndUpdate(id, updates, {
    new: true,
  });
  return updatedProject;
};
/**
 * Deletes a project by its ID.
 *
 * @param {string} id - The ID of the project to delete.
 * @returns {Promise<IProject | null>} A promise that resolves to the deleted project instance, or null if not found.
 */
export const deleteProject = async (id: string): Promise<IProject | null> => {
  const deletedProject = await Projects.findByIdAndDelete(id);
  return deletedProject;
};