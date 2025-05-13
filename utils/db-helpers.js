const crypto = require('crypto');
const db = require('../database/sqlite3.database');
const uuidv4 = require('../utils/uuidv4');


const createUser = async(username, password, role) => {
  const salt = crypto.randomBytes(16);
  const uuid = uuidv4();

  crypto.pbkdf2(password, salt, 310000, 32, 'sha256', async (err, hashedPassword) => {
    if (err) return next(err);

    try {
      await db.runAsync('INSERT INTO users_roles (user_id, role_id) VALUES (?, ?)', [uuid, role]);
      await db.runAsync(
        'INSERT INTO users (id, username, hashed_password, salt) VALUES (?, ?, ?, ?)',
        [uuid, username, hashedPassword, salt]
      );

      const user = {
        id: uuid,
        username: username,
        role: role
      };

      return user
    } catch (dbError) {
      return next(dbError);
    }
  })
}

module.exports = { 
  createUser 
}
