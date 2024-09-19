import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';

export const zodErrorHandler = (
    err: any,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    if (err instanceof ZodError) {
        return res.status(400).json({
            message: 'Validation failed',
            errors: err.errors.map((error) => ({
                path: error.path.join('.'),
                message: error.message,
            })),
        });
    }
    next(err);
};
