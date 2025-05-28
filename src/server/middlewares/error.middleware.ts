import createError from 'http-errors';
import { Request, Response, NextFunction } from 'express';

// Catch 404 and forward to error handler
export const notFoundHandler = function (req: Request, res: Response, next: NextFunction) {
  next(createError(404, 'Page not found'));
};

export const errorHandler = function (err: any, req: Request, res: Response) {
  console.log(err)
  res.status(500).send({ 'error': err })
};

