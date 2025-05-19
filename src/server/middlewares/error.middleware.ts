import createError from 'http-errors';
import { Request, Response, NextFunction } from 'express';
import path from 'path'

// Catch 404 and forward to error handler
export const notFoundHandler = function (req: Request, res: Response, next: NextFunction) {
  next(createError(404, 'Page not found'));
};

export const errorHandler = function (err: any, req: Request, res: Response, next: NextFunction) {
  const status = err.status || 500;
  const message = err.message || 'Internal Server Error';

  const isApiRequest = req.originalUrl.startsWith('/') || req.headers.accept?.includes('application/json');

  if (isApiRequest) {
    res.status(status).json({
      success: false,
      error: message,
      ...(req.app.get('env') === 'development' && { stack: err.stack }),
    });
  } else {
    res.status(status);
    res.sendFile(path.join(process.cwd(), 'public', 'index.html')); // fallback to React app
  }
};

