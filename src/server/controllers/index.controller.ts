import { Request, Response, NextFunction } from 'express';

export const getIndex = (req: Request, res: Response, next: NextFunction): void => {
  console.log(req.user);
  res.render('main/dashboard', {
    user: req.user,
    //csrfToken: req.csrfToken(),
  });
};

export const getUsers = (req: Request, res: Response, next: NextFunction): void => {
  console.log(req.user);
  res.render('main/users', {
    user: req.user,
    //csrfToken: req.csrfToken(),
  });
};
