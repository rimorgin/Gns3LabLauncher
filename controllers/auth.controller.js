// controllers/auth.controller.js
const { createUser } = require('../utils/db-helpers');


// Specifically for the login route. views/auth/login
exports.getLogin = (req, res) => {
  res.render('auth/login', {user: req.user, role: req.role});
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

exports.postSignup = async (req, res, next) => {
  try {
    const user = await createUser(req.body.username, req.body.password, req.body.role);

    req.login(user, (err) => {
      if (err) return next(err);
      res.redirect('/');
    })
  } catch (error) {
    return next(error);
  }
};

exports.getSession = (req, res) => {
  res.json({
    session: req.session,
  });
};