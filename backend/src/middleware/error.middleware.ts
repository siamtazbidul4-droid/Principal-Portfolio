import { Request, Response, NextFunction } from 'express';

export function errorHandler(err: any, req: Request, res: Response, next: NextFunction): void {
  console.error('[Unhandled Error]', err);

  const statusCode = err.statusCode || 500;
  const message = statusCode === 500
    ? 'An unexpected error occurred while processing your request.'
    : err.message || 'Operation failed.';

  res.status(statusCode).json({
    success: false,
    message,
  });
}

export function notFoundHandler(req: Request, res: Response): void {
  res.status(404).json({
    success: false,
    message: `Resource not found: ${req.method} ${req.originalUrl}`,
  });
}
