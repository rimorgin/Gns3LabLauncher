// controllers/auth.controller.js
const { createUser } = require('../utils/db-helpers')

// Specifically for the login route. views/auth/login
exports.getLogin = (req, res) => {
  res.render('auth/login');
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
  const { name, email, username, password, role } = req.body
  try {
    const user = await createUser(name, email, username, password, role);

    req.login(user, (err) => {
      if (err) return next(err);
      const { password, ...userWithoutPassword } = user
      res.render('/');
    })
  } catch (error) {
    return next(error);
  }
};

exports.getSession = (req, res) => {
  const sessionData = { ...req.session };
  if (sessionData.passport?.user) {
    delete sessionData.passport.user.password;
  }
  res.json({
    session: sessionData,
  });
};