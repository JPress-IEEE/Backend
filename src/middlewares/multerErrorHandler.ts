import { Request, Response, NextFunction } from 'express';
import multer from 'multer';

export const multerErrorHandler = (err:any, req:Request, res:Response, next:NextFunction) => {
    if (err instanceof multer.MulterError) {
        switch (err.code) {
            case 'LIMIT_FILE_SIZE':
                return res.status(400).json({
                    error: 'File is too large. Max file size allowed is 5MB for profile pictures and 10MB for resumes.',
                });
            case 'LIMIT_UNEXPECTED_FILE':
                return res.status(400).json({
                    error: 'Unexpected field. Check the form data for incorrect file fields.',
                });
            default:
                return res.status(400).json({
                    error: `Multer error: ${err.message}`,
                });
        }
    } else if (err) {
        return res.status(400).json({
            error: err.message || 'An unknown error occurred during file upload.',
        });
    }
    next(err);
};