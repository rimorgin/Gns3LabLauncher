// routes/auth.routes.js

const express = require('express');
const passport = require('../strategies/local-strategy');

const {
  getLogin,
  postLogin,
  postLogout,
  getSignup,
  postSignup,
  getSession
} = require('../controllers/auth.controller');

const { redirectIfAuthenticated } = require('../middlewares/auth.middleware');

const router = express.Router();

router.get('/auth/login', redirectIfAuthenticated, getLogin);
router.get('/auth/signup', redirectIfAuthenticated, getSignup);

router.post('/api/v1/login/password',
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/auth/login',
    failureMessage: true,
    successMessage: 'successfully logged in',
    successFlash: true,
    failureFlash: true
  }),
  postLogin // optional placeholder
);

router.post('/api/v1/logout', postLogout);

router.post('/api/v1/signup', postSignup);

router.get('/session', getSession);

module.exports = router;