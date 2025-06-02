import bcrypt from 'bcrypt';
import User from '@srvr/models/user.model.ts';
import { IUser } from '@srvr/types/usermodel.type.ts';

/**
 * Creates a new user with the provided details, capitalizes the name, and hashes the password.
 *
 * @param {IUser} props - The user properties used to create the new user.
 * @param {string} props.name - The full name of the user (will be capitalized).
 * @param {string} props.email - The email address of the user.
 * @param {string} props.username - The username chosen by the user.
 * @param {string} props.password - The raw password which will be hashed before saving.
 * @param {RoleName} props.role - The role assigned to the user (e.g., 'admin', 'student').
 *
 * @returns {Promise<typeof User>} A promise that resolves to the newly created user instance.
 *
 * @throws {Error} If hashing the password or saving the user fails.
 */
export const createUser = async (props: IUser) => {
    const capitalizedName = props.name.toLowerCase().split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    console.log(capitalizedName);
    const hashedPassword = await bcrypt.hash(props.password, 12);
    const user = await User.create({
      name: capitalizedName,
      email: props.email,
      username: props.username,
      password: hashedPassword,
      role: props.role
    });
    return user;
};
