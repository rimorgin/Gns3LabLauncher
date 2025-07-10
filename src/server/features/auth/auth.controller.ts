import { Request, Response, NextFunction, RequestHandler } from "express";
import passport from "@srvr/configs/passport.config.ts";
import { IUserBaseInput } from "@srvr/types/models.type.ts";
import { redisClient } from "@srvr/database/redis.database.ts";
import { createUser } from "@srvr/features/users/users.service.ts";
import prisma from "@srvr/utils/db/prisma.ts";
import { getRolePermissions } from "@srvr/utils/db/helpers.ts";
import roles from "@srvr/configs/roles.config.ts";
import {
  APP_RESPONSE_MESSAGE,
  HTTP_RESPONSE_CODE,
  HttpStatusCode,
} from "@srvr/configs/constants.config.ts";
import { logger } from "@srvr/middlewares/logger.middleware.ts";

/**
 * Checks whether the current session is valid (user is authenticated).
 *
 * @param {Request} req - Express request object containing session data.
 * @param {Response} res - Express response object to send session status.
 *
 * @returns {void} Sends:
 *  - 200 OK if authenticated
 *  - 401 Unauthorized if not authenticated
 */
export const checkSession = (req: Request, res: Response): void => {
  if (!req.isAuthenticated?.()) {
    res.status(HttpStatusCode.UNAUTHORIZED).json({ session: false });
    return;
  }

  res.status(200).json({ session: true });
};

/**
 * Fetches the permissions associated with the currently authenticated user's role.
 *
 * @function getUserPermissions
 *
 * @param {Request} req - Express request object containing authenticated user data.
 * @param {Response} res - Express response object to send permission data or error messages.
 *
 * @returns {void} Sends:
 *  - 200 JSON with list of permissions if successful
 *  - 401 Unauthorized if user is not authenticated or has no role
 *  - 403 Forbidden if role is unrecognized or has no permissions
 */
export const getUserPermissions = (req: Request, res: Response): void => {
  const userRole = req.user?.role;

  if (!userRole) {
    res
      .status(HttpStatusCode.UNAUTHORIZED)
      .json({ message: "Unauthorized or role missing" });
    return;
  }

  const permissions = getRolePermissions(roles, userRole);
  if (!permissions.length) {
    res
      .status(403)
      .json({ message: "Role not recognized or has no permissions" });
    return;
  }

  res.json({ permissions });
};

/**
 * Fetches the currently authenticated user from the database using their session ID.
 *
 * @param {Request} req - Express request object containing session data.
 * @param {Response} res - Express response object to send back the user data or error message.
 *
 * @returns {Promise<void>} Sends:
 *  - 200 with user and session expiry if found
 *  - 401 if not logged in
 *  - 404 if user is not found in the database
 */
export const getMe = async (req: Request, res: Response): Promise<void> => {
  const userSessionId = req.session?.passport?.user;
  const user = await prisma.user.findUnique({
    where: { id: userSessionId },
    include: {
      student: {
        include: {
          classrooms: true,
          userGroups: true,
        },
      },
    },
    omit: { password: true },
  });
  if (!user) {
    res
      .status(HTTP_RESPONSE_CODE.NOT_FOUND)
      .json({ message: APP_RESPONSE_MESSAGE.user.userDoesntExist });
    return;
  }

  res.json({ user });
};

/**
 * Authenticates a user using local passport strategy (email/password).
 *
 * @param {Request} req - Express request object with login credentials.
 * @param {Response} res - Express response object to respond with success or error.
 * @param {NextFunction} next - Express next middleware function to handle errors.
 *
 * @returns {void} Sends:
 *  - 200 JSON on successful login
 *  - 401 JSON if authentication fails
 *  - Passes error to `next()` if something goes wrong
 */
export const postLoginLocal = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  passport.authenticate(
    "local",
    (
      err: Error | null,
      user: IUserBaseInput | false,
      info: { message?: string } = {},
    ) => {
      const start = Date.now();
      if (err) return next(err);
      if (!user) {
        return res
          .status(HttpStatusCode.UNAUTHORIZED)
          .json({ type: "error", message: info.message || "Unauthorized" });
      }

      req.login(user, async (loginErr) => {
        if (loginErr) return next(loginErr);

        const duration = Date.now() - start;
        logger.info(`Request completed with status ${res.statusCode}`, {
          context: user.username,
          message: `User ${user.username} logged in`,
          stack: {
            userAgent: req.headers["user-agent"],
          },
          statusCode: res.statusCode,
          durationMs: duration,
          ip: req.ip?.replace("::ffff:", ""),
        });

        res.json({
          user: req.session.passport?.user, // This will be serialized user
          session: true,
          message: APP_RESPONSE_MESSAGE.user.userLoggedIn,
        });
      });
    },
  )(req, res, next);
};

/**
 * Middleware that initiates Microsoft OAuth authentication flow.
 *
 * @returns {RequestHandler} Passport authenticate middleware configured for Microsoft OAuth.
 */
export const postLoginMicrosoft = (): RequestHandler => {
  return passport.authenticate("microsoft", {
    prompt: "select_account",
  });
};

/**
 * Middleware that handles Microsoft OAuth callback after successful authentication.
 *
 * @returns {RequestHandler} Passport authenticate middleware with success/failure redirects.
 */
export const postLoginMicrosoftCallback = (): RequestHandler => {
  return passport.authenticate(
    "microsoft",
    { failureRedirect: "/signin" },
    function (_: Request, res: Response) {
      // Successful authentication, redirect home.
      res.redirect("/");
    },
  );
};

/**
 * Logs out the current user by destroying session and removing active session from Redis.
 *
 * @param {Request} req - Express request object with session data.
 * @param {Response} res - Express response object to respond with success message.
 * @param {NextFunction} next - Express next middleware function to handle errors.
 *
 * @returns {void} Sends:
 *  - 200 JSON on successful logout
 *  - Passes error to `next()` if something goes wrong
 */
export const postLogout = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const userSessionId = req.session?.passport?.user;
  const userRole = req.user?.role;

  req.logout(function (err: Error | null) {
    if (err) return next(err);
    req.session.destroy(async () => {
      if (userSessionId)
        await redisClient.del(`gns3labuser:session:${userSessionId}`);
      //console.log("req.logout session destroyed");
      if (userRole === "instructor") {
        await prisma.instructor.update({
          where: { userId: userSessionId },
          data: {
            isOnline: false,
          },
        });
      } else if (userRole === "student") {
        await prisma.student.update({
          where: { userId: userSessionId },
          data: {
            isOnline: false,
          },
        });
      }

      console.log("🚀 ~ req.logout ~ userId:", userSessionId);
      console.log("🚀 ~ req.session.destroy ~ userRole:", userRole);
      res.json({
        message: APP_RESPONSE_MESSAGE.user.userLoggedOut,
      });
    });
  });
};

/**
 * Handles user registration by creating a new user and logging them in automatically.
 *
 * @param {Request} req - Express request object with user data in body.
 * @param {Response} res - Express response object to redirect or send error.
 * @param {NextFunction} next - Express next middleware function to handle errors.
 *
 * @returns {Promise<void>}:
 *  - Redirects to home on success
 *  - Passes error to `next()` on failure
 */
export const postSignup = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const user = await createUser(req.body);
    req.login(user, (err: Error) => {
      if (err) return next(err);
      res.redirect("/");
    });
  } catch (error) {
    return next(error);
  }
};
