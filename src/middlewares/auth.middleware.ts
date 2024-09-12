import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt.utils';

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {};

export const clientRoleoleMiddleware = async (req: Request, res: Response, next: NextFunction) => {};

export const applicantRoleMiddleware = async (req: Request, res: Response, next: NextFunction) => {};
