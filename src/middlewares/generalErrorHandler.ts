import { Request, Response, NextFunction } from 'express';

export const ErrorHandler = (
    err: any,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    if (err.status) {
        return res.status(err.status).json({
            message: err.message,
            ...(err.details && { details: err.details }), 
        });
    }
    console.error('Unexpected error:', err); 
    return res.status(500).json({
        message: 'Internal server error',
    });
};
