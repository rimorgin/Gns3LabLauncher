import { createUser } from "@srvr/utils/db-helpers.utils.ts";
import { Request, Response, NextFunction, RequestHandler } from "express";
import passport from "@srvr/configs/passport.config.ts";
import { IUser } from "@srvr/types/usermodel.type.ts";
import User from "@srvr/models/user.model.ts";
import { redisClient } from "@srvr/database/redis.database.ts";

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
export const getUser = async (req: Request, res: Response): Promise<void> => {
  const userSessionId = req.session?.passport?.user;
  if (!userSessionId) {
    res.status(401).json({ message: "You are not logged in" });
    return;
  }

  const user = await User.findById(userSessionId);
  if (!user) {
    res.status(404).json({ message: "User not found" });
    return;
  }

  res.json({ user, expiresAt: req.session?.cookie.maxAge });
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
  passport.authenticate("local", async (err: any, user: IUser, info: any) => {
    if (err) return next(err);
    if (!user) {
      return res
        .status(401)
        .json({ type: "error", message: info?.message || "Unauthorized" });
    }

    req.login(user, async (err) => {
      if (err) return next(err);

      req.session.loginTime = new Date();
      res.json({
        toast: true,
        type: "success",
        message: "Login successful",
        user: user,
        expiresAt: req.session.cookie.maxAge,
      });
    });
  })(req, res, next);
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
  console.log("🚀 ~ req.logout ~ userId:", userSessionId);

  req.logout(function (err: Error | null) {
    if (err) return next(err);
    req.session.destroy(async () => {
      if (userSessionId)
        await redisClient.del(`gns3labuser:active_session:${userSessionId}`);
      console.log("req.logout session destroyed");
      res.json({
        toast: true,
        type: "success",
        message: "Logout successful",
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
    req.login(user, (err: any) => {
      if (err) return next(err);
      res.redirect("/");
    });
  } catch (error) {
    return next(error);
  }
};

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
    res.status(401).json({ session: "invalid" });
    return;
  }
  res.sendStatus(200);
};
