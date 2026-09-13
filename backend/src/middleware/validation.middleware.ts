import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';

export function validateBody(schema: ZodSchema) {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const issues = error.issues || [];
        const errorMessages = issues.map((e) => ({
          field: e.path.join('.'),
          message: e.message,
        }));
        res.status(400).json({
          success: false,
          message: errorMessages[0]?.message || 'Invalid input data',
          errors: errorMessages,
        });
        return;
      }
      res.status(400).json({
        success: false,
        message: 'Invalid request data',
      });
    }
  };
}
