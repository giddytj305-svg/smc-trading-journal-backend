// ==================================================
// SMC Trading Journal — Validation Middleware
// ==================================================

import { Request, Response, NextFunction } from 'express';
import { AnyZodObject, ZodError } from 'zod';
import { ValidationError } from './errorHandler';

export const validateRequest = (schema: AnyZodObject) => {
  return async (req: Request, _res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });

      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errors = error.errors.map(
          (err) => `${err.path.join('.')} - ${err.message}`
        );
        next(new ValidationError('Validation failed', errors));
      } else {
        next(error);
      }
    }
  };
};
