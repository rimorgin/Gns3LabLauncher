// routes/auth.routes.js

const express = require('express');
const passport = require('../configs/passport.config');

const {
  getLogin,
  postLogout,
  getSignup,
  postSignup,
  getSession
} = require('../controllers/auth.controller');

const { redirectIfAuthenticated } = require('../middlewares/auth.middleware');

const router = express.Router();

router.get('/auth/login', getLogin);
router.get('/auth/signup', getSignup);


router.post('/api/v1/login/password',
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/auth/login',
    failureMessage: true,
  }),
);

router.post('/api/v1/logout', postLogout);

router.post('/api/v1/signup', postSignup);

router.get('/session', getSession);

module.exports = router;