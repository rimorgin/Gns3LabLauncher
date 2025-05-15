const bcrypt = require('bcrypt');
const User = require('../models/user.model')


const createUser = async (name, email, username, password, role) => {
  try {
    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await User.create({
      name,
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

module.exports = { 
  createUser 
}
