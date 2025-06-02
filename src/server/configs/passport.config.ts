import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as MicrosoftStrategy } from 'passport-microsoft'
import User from "@srvr/models/user.model.ts";
import bcrypt from 'bcrypt';
import { NextFunction } from 'express';
import { IUser } from "@clnt/lib/store/user-store.ts";

passport.serializeUser((user, done) => {
  //@ts-expect-error no user._id on interface IUser but it is present in the response
  done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id).select('username email role name classes is_online last_active_at');
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
  //console.log("🚀 ~ verify ~ email, password:", email, password)
  try {
    const user = await User.findOne({ email });
    if (!user) return done(null, false, { message: 'Credentials not found' });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return done(null, false, { message: 'Incorrect password.' });

    return done(null, user);
  } catch (err) {
    return done(err);
  }
}));

passport.use(new MicrosoftStrategy({
    // Standard OAuth2 options
    clientID: 'applicationidfrommicrosoft',
    clientSecret: 'applicationsecretfrommicrosoft',
    callbackURL: "/auth/microsoft/callback",
    scope: ['user.read'],

    // Microsoft specific options

    // [Optional] The tenant ID for the application. Defaults to 'common'. 
    // Used to construct the authorizationURL and tokenURL
    tenant: 'common',
    addUPNAsEmail: false,

    // [Optional] The Microsoft Graph API Entry Point, defaults to https://graph.microsoft.com. Configure this if you are using Azure China or other regional version.
    apiEntryPoint: 'https://graph.microsoft.com',
  },
  function(accessToken: string, refreshToken: string, profile: IUser, done: NextFunction) {
    /*User.findById(profile.id)
      return done(err, user);
    */
  }
));

export default passport;
