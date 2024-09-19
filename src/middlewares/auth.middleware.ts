import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt.utils';
import { getUserById } from '../services/user.services';

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const accessToken = req.headers.authorization?.split(' ')[1];
        if (!accessToken) {
            return res.status(401).send({ message: 'Access token not found' });
        }
        const decoded = verifyToken(accessToken) as {
            [x: string]: any; userId: string
        };
        const userId: string = decoded.user.id as string;
        const user = await getUserById(userId);
        console.log(user);
        if (!user) {
            return res.status(401).send({ message: 'User not found' });
        }
        req.body.userId = userId;
        next();
    }
    catch (err) {
        next(err);
    }
};

export const clientRoleoleMiddleware = async (req: Request, res: Response, next: NextFunction) => { 
    try {
        const accessToken = req.headers.authorization?.split(' ')[1];
        if (!accessToken) {
            return res.status(401).send({ message: 'Access token not found' });
        }
        const decoded = verifyToken(accessToken) as {
            [x: string]: any; userId: string
        };
        const userId: string = decoded.user.id as string;
        const user = await getUserById(userId);
        if (!user) {
            return res.status(401).send({ message: 'User not found' });
        }
        if (user.role !== 'client') {
            return res.status(403).send({ message: 'Unauthorized' });
        }
        req.body.userId = userId;
        req.body.role = user.role;
        next();
    }
    catch (err) {
        next(err);
    }
};

export const applicantRoleMiddleware = async (req: Request, res: Response, next: NextFunction) => {

    try {
        const accessToken = req.headers.authorization?.split(' ')[1];
        if (!accessToken) {
            return res.status(401).send({ message: 'Access token not found' });
        }
        const decoded = verifyToken(accessToken) as {
            [x: string]: any; userId: string
        };
        const userId: string = decoded.user.id as string;
        console.log(userId);
        const user = await getUserById(userId);
        if (!user) {
            return res.status(401).send({ message: 'User not found' });
        }
        if (user.role !== 'applicant') {
            return res.status(403).send({ message: 'Unauthorized' });
        }
        req.body.userId = userId;
        req.body.role = user.role;
        next();
    }
    catch (err) {
        next(err);
    }
};

export const adminRoleMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const accessToken = req.headers.authorization?.split(' ')[1];
        if (!accessToken) {
            return res.status(401).send({ message: 'Access token not found' });
        }
        const decoded = verifyToken(accessToken) as {
            [x: string]: any; userId: string
        };
        const userId: string = decoded.user.id as string;
        const user = await getUserById(userId);
        if (!user) {
            return res.status(401).send({ message: 'User not found' });
        }
        if (user.role !== 'admin') {
            return res.status(403).send({ message: 'Unauthorized' });
        }
        req.body.userId = userId;
        req.body.role = user.role;
        next();
    }
    catch (err) {
        next(err);
    }
};

