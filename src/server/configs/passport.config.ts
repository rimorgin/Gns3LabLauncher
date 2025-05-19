import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import User from '@srvr/models/user.model.js';
import bcrypt from 'bcrypt';

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
      name: user.name,
      classes: user?.classes,
      is_online: user?.is_online,
      last_active_at: user?.last_active_at
      
    };

    done(null, userIdentity); 
  } catch (err) {
    done(err);
  }
});

passport.use(new LocalStrategy(
{
  usernameField: "email",
  passwordField: 'password'
}, async function verify(email, password, done) {
  console.log("🚀 ~ verify ~ email, password:", email, password)
  try {
    const user = await User.findOne({ email }).lean();
    if (!user) return done(null, false, { message: 'Credentials not found' });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return done(null, false, { message: 'Incorrect password.' });

    return done(null, user);
  } catch (err) {
    return done(err);
  }
}));

export default passport;
