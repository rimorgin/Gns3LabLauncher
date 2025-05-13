const sqlite3 = require('sqlite3').verbose();
const mkdirp = require('mkdirp');
const crypto = require('crypto');
const uuidv4 = require('../utils/uuidv4');
const fs = require('fs');
const path = require('path');

// visualize the database
const { SqliteGuiNode } = require("sqlite-gui-node");
// Create DB directory if not exists
mkdirp.sync('./var/db');

// Load roles from JSON
const rolesData = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../configs/roles.config.json'), 'utf8'));

const db = new sqlite3.Database('./var/db/app.db');

// use the GUI to visualize the database
SqliteGuiNode(db).catch((err) => {
  console.error("Error starting the GUI:", err);
});

db.serialize(() => {

  // ----------------------
  // Tables Setup
  // ----------------------

  db.run("CREATE TABLE IF NOT EXISTS users ( \
    id TEXT PRIMARY KEY, \
    username TEXT UNIQUE, \
    hashed_password BLOB, \
    salt BLOB \
  )");

  db.run("CREATE TABLE IF NOT EXISTS roles ( \
    id INTEGER PRIMARY KEY AUTOINCREMENT, \
    name TEXT UNIQUE NOT NULL \
  )");

  db.run("CREATE TABLE IF NOT EXISTS permissions ( \
    id INTEGER PRIMARY KEY AUTOINCREMENT, \
    name TEXT UNIQUE NOT NULL \
  )");

  db.run("CREATE TABLE IF NOT EXISTS roles_permissions ( \
    role_id INTEGER NOT NULL, \
    permission_id INTEGER NOT NULL, \
    FOREIGN KEY(role_id) REFERENCES roles(id), \
    FOREIGN KEY(permission_id) REFERENCES permissions(id), \
    PRIMARY KEY (role_id, permission_id) \
  )");

  db.run("CREATE TABLE IF NOT EXISTS users_roles ( \
    user_id TEXT NOT NULL, \
    role_id INTEGER NOT NULL, \
    FOREIGN KEY(user_id) REFERENCES users(id), \
    FOREIGN KEY(role_id) REFERENCES roles(id), \
    PRIMARY KEY (user_id, role_id) \
  )");

  // ----------------------
  // Seed Roles
  // ----------------------
  const insertRole = db.prepare("INSERT OR IGNORE INTO roles (name) VALUES (?)");
  rolesData.roles.forEach(role => {
    insertRole.run([role.name]);
  });
  insertRole.finalize();

  // ----------------------
  // Seed Permissions
  // ----------------------
  const allPermissions = rolesData.roles.flatMap(r => r.permissions);
  const uniquePermissions = [...new Set(allPermissions)];

  const insertPermission = db.prepare("INSERT OR IGNORE INTO permissions (name) VALUES (?)");
  uniquePermissions.forEach(perm => {
    insertPermission.run([perm]);
  });
  insertPermission.finalize();

  // ----------------------
  // Map Roles to Permissions
  // ----------------------
  db.all("SELECT name, id FROM roles", [], (err, rolesRows) => {
    db.all("SELECT name, id FROM permissions", [], (err, permsRows) => {
      const insertRolePerm = db.prepare("INSERT OR IGNORE INTO roles_permissions (role_id, permission_id) VALUES (?, ?)");

      rolesData.roles.forEach(role => {
        const roleRow = rolesRows.find(r => r.name === role.name);
        if (!roleRow) return;

        role.permissions.forEach(permName => {
          const permRow = permsRows.find(p => p.name === permName);
          if (!permRow) return;

          insertRolePerm.run([roleRow.id, permRow.id]);
        });
      });

      insertRolePerm.finalize();
    });
  });

  // ----------------------
  // Create Default User
  // ----------------------
  const defaultUser = {
    username: 'gns3netadmin',
    password: 'gns3netadmin'
  };

  db.get("SELECT * FROM users WHERE username = ?", [defaultUser.username], (err, row) => {
    if (!row) {
      const salt = crypto.randomBytes(16);
      const hashedPassword = crypto.pbkdf2Sync(defaultUser.password, salt, 310000, 32, 'sha256');
      const userId = uuidv4();

      db.run(
        "INSERT INTO users (id, username, hashed_password, salt) VALUES (?, ?, ?, ?)",
        [userId, defaultUser.username, hashedPassword, salt]
      );
  
      db.run("INSERT INTO users_roles (user_id, role_id) VALUES (?, ?)", [userId, 1]);
    }
  });
});

module.exports = db;