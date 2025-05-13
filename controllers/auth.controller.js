// controllers/auth.controller.js

const crypto = require('crypto');
const db = require('../database/sqlite3.database');
const uuidv4 = require('../utils/uuidv4');


// Specifically for the login route. views/auth/login
exports.getLogin = (req, res) => {
  res.render('auth/login', {user: req.user,});
};

exports.postLogin = (req, res, next) => {
  // Handled by passport.authenticate middleware
  // This function is just a placeholder for route definition
};

exports.postLogout = (req, res, next) => {
  req.logout(function(err) {
    if (err) return next(err);
    res.redirect('/auth/login');
  });
};

exports.getSignup = (req, res) => {
  res.render('auth/signup');
};

exports.postSignup = (req, res, next) => {
  const salt = crypto.randomBytes(16);
  const uuid = uuidv4();

  crypto.pbkdf2(req.body.password, salt, 310000, 32, 'sha256', (err, hashedPassword) => {
    if (err) return next(err);

    db.run(
      'INSERT INTO users (id, username, hashed_password, salt) VALUES (?, ?, ?, ?)',
      [uuid, req.body.username, hashedPassword, salt],
      (err) => {
        if (err) return next(err);

        const user = {
          id: uuid,
          username: req.body.username
        };

        req.login(user, (err) => {
          if (err) return next(err);
          res.redirect('/');
        });
      }
    );
  });
};

exports.getSession = (req, res) => {
  res.json({
    session: req.session,
  });
};