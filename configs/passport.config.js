const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('../models/user.model');
const bcrypt = require('bcrypt');

passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id).select('username email role name');
    if (!user) return done(null, false);
    
    const userIdentity= {
      _id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      name: user.name
    };

    done(null, userIdentity); 
  } catch (err) {
    done(err);
  }
});
passport.use(new LocalStrategy(async function verify(username, password, done) {
  try {
    const user = await User.findOne({ username }).lean();
    if (!user) return done(null, false, { message: 'Credentials not found' });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return done(null, false, { message: 'Incorrect password.' });

    return done(null, user);
  } catch (err) {
    return done(err);
  }
}));

module.exports = passport;
