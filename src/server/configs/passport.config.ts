import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as MicrosoftStrategy } from "passport-microsoft";
import bcrypt from "bcrypt";
import { NextFunction } from "express";
import prisma from "@srvr/utils/db/prisma.ts";
import { IUserWithRoleOutput } from "@srvr/types/models.type.ts";
import { APP_RESPONSE_MESSAGE } from "./constants.config.ts";

passport.serializeUser((user, done) => {
  console.log("🚀 ~ passport.serializeUser ~ user:", user);
  //@ts-expect-error no user.id on interface IUserBase but it is present in the response
  done(null, user.id);
});

passport.deserializeUser(async (id: string, done) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id },
      omit: { password: true },
    });
    console.log("🚀 ~ passport.deserializeUser ~ user:", user);
    //console.log("🚀 ~ passport.deserializeUser ~ user:", user)

    if (!user) return done(null, null);
    done(null, user);
  } catch (err) {
    done(err);
  }
});

passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    async function verify(email, password, done) {
      //console.log("🚀 ~ verify ~ email, password:", email, password)
      try {
        const user = await prisma.user.findUnique({ where: { email: email } });
        if (!user)
          return done(null, false, {
            message: APP_RESPONSE_MESSAGE.user.invalidCredentials,
          });
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch)
          return done(null, false, {
            message: APP_RESPONSE_MESSAGE.user.invalidCredentials,
          });

        //console.log(user)
        return done(null, user);
      } catch (err) {
        return done(err);
      }
    },
  ),
);

passport.use(
  new MicrosoftStrategy(
    {
      // Standard OAuth2 options
      clientID: "applicationidfrommicrosoft",
      clientSecret: "applicationsecretfrommicrosoft",
      callbackURL: "/auth/microsoft/callback",
      scope: ["user.read"],

      // Microsoft specific options

      // [Optional] The tenant ID for the application. Defaults to 'common'.
      // Used to construct the authorizationURL and tokenURL
      tenant: "common",
      addUPNAsEmail: false,

      // [Optional] The Microsoft Graph API Entry Point, defaults to https://graph.microsoft.com. Configure this if you are using Azure China or other regional version.
      apiEntryPoint: "https://graph.microsoft.com",
    },
    function (
      accessToken: string,
      refreshToken: string,
      profile: IUserWithRoleOutput,
      done: NextFunction,
    ) {
      /*User.findById(profile.id)
      return done(err, user);
    */
    },
  ),
);

export default passport;
