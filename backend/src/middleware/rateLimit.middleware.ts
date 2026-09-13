import { Request, Response, NextFunction } from 'express';

interface RateLimitStore {
  [key: string]: {
    count: number;
    resetTime: number;
  };
}

export function createRateLimiter(windowMs: number, maxRequests: number, message: string) {
  const store: RateLimitStore = {};

  return (req: Request, res: Response, next: NextFunction): void => {
    const ip = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || 'unknown';
    const now = Date.now();

    if (!store[ip] || now > store[ip].resetTime) {
      store[ip] = {
        count: 1,
        resetTime: now + windowMs,
      };
      next();
      return;
    }

    store[ip].count += 1;
    if (store[ip].count > maxRequests) {
      res.status(429).json({
        success: false,
        message,
      });
      return;
    }

    next();
  };
}

export const contactRateLimiter = createRateLimiter(
  15 * 60 * 1000, // 15 minutes
  5, // max 5 submissions per 15 minutes
  'Too many contact inquiries sent from this address. Please wait a few minutes before submitting again.'
);

export const authRateLimiter = createRateLimiter(
  15 * 60 * 1000, // 15 minutes
  10, // max 10 attempts
  'Too many authentication attempts. Please try again later.'
);
