// controllers/auth.controller.js
import { createUser } from '@srvr/utils/db-helpers.js';
import { Request, Response, NextFunction } from 'express';
import passport from '@srvr/configs/passport.config.js';
import { IUser } from '@srvr/types/usermodel.auth.js';
import User from '@srvr/models/user.model.js';

export const getUser = async (req: Request, res: Response) => {
  const userSessionId = req.session?.passport?.user;
  if (!userSessionId) {
    return res.status(401).json({ message: "You are not logged in" });
  }
  const user = await User.findOne({ userSessionId })
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  return res.json({ user });
};

export const postLogin = (req: Request, res: Response, next: NextFunction) => {
  passport.authenticate('local', (err: any, user: IUser, info: any) => {
    if (err) return next(err);
    if (!user) {
      return res.status(401).json({ type: 'error', message: info?.message || 'Unauthorized' });
    }

    req.login(user, (err) => {
      if (err) return next(err);
      //console.log('success login')
      res.json({
        toast: true,
        type: 'success',
        message: 'Login successful',
        user: user
      });
    });
  })(req, res, next);
};


export const postLogout = (req: Request, res: Response, next: NextFunction) => {
  req.logout(function(err: Error | null) {
    if (err) return next(err);
    res.json({
      toast: true,
      type: 'success',
      message: 'Logout successful'
    });
  });
};


export const postSignup = async (req: Request, res: Response, next: NextFunction) => {
  const { name, email, username, password, role } = req.body
  try {
    const user = await createUser(name, email, username, password, role);

    req.login(user, (err: any) => {
      if (err) return next(err);
      res.redirect('/');
    })
  } catch (error) {
    return next(error);
  }
};

