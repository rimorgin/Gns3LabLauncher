import bcrypt from 'bcrypt';
import User from '../models/user.model.js';

export const createUser = async (name, email, username, password, role) => {
  try {
    const capitalizedName = name.toLowerCase().split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    console.log(capitalizedName);
    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await User.create({
      name: capitalizedName,
      email,
      username,
      password: hashedPassword,
      role
    });
    return user;
  } catch (err) {
    throw err;
  }
};
