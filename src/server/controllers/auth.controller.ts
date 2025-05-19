// controllers/auth.controller.js
import { createUser } from '@srvr/utils/db-helpers.js';
import { Request, Response, NextFunction } from 'express';
import passport from '@srvr/configs/passport.config.js';
import { IUser } from '@srvr/types/usermodel.auth.js';

export const getUser = (req: Request, res: Response) => {
  if (!req.user) return res.status(401).json({ type: "error", message: "Unauthorized" });
  return res.json(req.user);
};

export const postLogin = (req: Request, res: Response, next: NextFunction) => {
  passport.authenticate('local', (err: any, user: IUser, info: any) => {
    if (err) return next(err);
    if (!user) {
      return res.status(401).json({ type: 'error', message: info?.message || 'Unauthorized' });
    }

    req.login(user, (err) => {
      if (err) return next(err);
      console.log('success login')
      res.json({
        toast: true,
        type: 'success',
        message: 'Login successful',
        user: user
      });
    });
  })(req, res, next);
};


export const postLogout = (req: { logout: (arg0: (err: Error | null) => any) => void; }, res: { redirect: (arg0: string) => void; }, next: (arg0: Error) => any) => {
  req.logout(function(err: Error | null) {
    if (err) return next(err);
    res.redirect('/auth/login');
  });
};


export const postSignup = async (req: { body: { name: any; email: any; username: any; password: any; role: any; }; login: (arg0: any, arg1: (err: any) => any) => void; }, res: { redirect: (arg0: string) => void; }, next: (arg0: unknown) => any) => {
  const { name, email, username, password, role } = req.body
  try {
    const user = await createUser(name, email, username, password, role);

    req.login(user, (err: any) => {
      if (err) return next(err);
      const { password, ...userWithoutPassword } = user
      res.redirect('/');
    })
  } catch (error) {
    return next(error);
  }
};

interface SessionData {
  passport?: {
    user: string | Record<string, any>;
  }
}

export const getSession = (req: Request, res: Response) => {
  const userSession= req.session?.passport?.user;

  if (!userSession) {
    return res.status(401).json({ message: "You are not logged in" });
  }

  return res.json({
    session: userSession,
  });
};
