const passport = require("passport");
const LocalStrategy = require("passport-local");
const crypto = require("crypto");
const db = require("../database/sqlite3.database");

// Serialize the user (session)
passport.serializeUser((user, done) => {
  console.log(user)
  done(null, { id: user.id, username: user.username, role: user.role });

});

// Deserialize the user (from session)
passport.deserializeUser((user, done) => {
  done(null, user); // Or optionally, refetch from DB using user.id
});

// Define Local Strategy using SQLite
passport.use(new LocalStrategy(async function verify(username, password, done) {
  db.get("SELECT * FROM users WHERE username = ?", [username], function (err, row) {
    if (err) return done(err);
    if (!row) return done(null, false, { message: "Credentials not found" });

    crypto.pbkdf2(password, row.salt, 310000, 32, "sha256", function (err, hashedPassword) {
      if (err) return done(err);
      if (!crypto.timingSafeEqual(row.hashed_password, hashedPassword)) {
        return done(null, false, { message: "Incorrect username or password." });
      }

      // Fetch the role from users_roles table
      db.get("SELECT role_id FROM users_roles WHERE user_id = ?", [row.id], function (err, roleRow) {
        if (err) return done(err);
        if (!roleRow) return done(null, false, { message: "Role not found for user." });

        return done(null, { id: row.id, username: row.username, role: roleRow.role });
      });
    });
  });
}));

module.exports = passport;