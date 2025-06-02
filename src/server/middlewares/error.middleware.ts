// error.middleware
import { NextFunction, Request, Response } from 'express';

export const notFoundHandler = function (
  req: Request,
  res: Response,
  next: NextFunction
) {
  const error = new Error("Not Found");
  res.status(404).json({ error: error.message });
};

export const errorHandler = function (
  err: Error,
  req: Request,
  res: Response,
) {
  console.error(err);
  res.status(500).json({ error: err.message });
};
