const sqlite3 = require('sqlite3');
const mkdirp = require('mkdirp');
const crypto = require('crypto');
const uuidv4 = require('../utils/uuidv4');

mkdirp.sync('./var/db');

const db = new sqlite3.Database('./var/db/app.db');

db.serialize(function() {
  // create the database schema for the app
  db.run("CREATE TABLE IF NOT EXISTS users ( \
    id TEXT PRIMARY KEY, \
    username TEXT UNIQUE, \
    hashed_password BLOB, \
    salt BLOB \
  )");
  
  // create an initial user
  const salt = crypto.randomBytes(16); // generate per-user
  const hashedPassword = crypto.pbkdf2Sync('gns3netadmin', salt, 310000, 32, 'sha256');
  db.run('INSERT OR IGNORE INTO users (id, username, hashed_password, salt) VALUES (?, ?, ?, ?)', [
    uuidv4(),
    'gns3netadmin',
    hashedPassword,
    salt
  ]);

});

module.exports = db;