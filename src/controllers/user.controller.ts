import { Request, Response } from 'express';
import { createUser, getUserByEmail, getUserById, updateUser } from '../services/user.services';
import { IUser } from '../models/user.model';
import { userSchema } from '../schemas/user.schema';
import { generateRefreshToken, generateToken, verifyToken } from '../utils/jwt.utils';
import { sendEmail, generateEmailToken, verifyEmailToken } from '../utils/email.utils';
import bcrypt from 'bcrypt';
import config from "config";

export const createUserController = async (req: Request, res: Response) => {
    try {
        const validatedData = userSchema.parse(req.body);
        const userExists = await getUserByEmail(validatedData.email);
        if (userExists) {
            return res.status(400).send({ message: 'User already exists' });
        }
        const user = {
            name: validatedData.name,
            email: validatedData.email,
            password: validatedData.password,
            role: validatedData.role,
            profilePic: validatedData.profilePic || ''
        };
        const newUser = await createUser(user as IUser);
        const userId: string = (newUser._id).toString() as string;
        const refreshToken = newUser.refreshToken;

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'strict',
        });
        const accessToken = generateToken(userId);
        const emailToken = generateEmailToken(userId);
        const url = `http://localhost:3000/auth/confirm-email?token=${emailToken}`;
        const emailText = `Click this link to confirm your email: ${url}`;
        await sendEmail(validatedData.email, 'Confirm Email', emailText);

        return res.status(201).send({ message: 'User created successfully', accessToken });
    } catch (err: any) {
        return res.status(500).send({ message: err.message });
    }
};

export const confirmEmail = async (req: Request, res: Response) => {
    const token = req.query.token;
    if (!token) {
        return res.status(400).json({ msg: 'No token provided' });
    }
    try {
        const decoded = verifyEmailToken(token as string) as any;
        if (!decoded) {
            return res.status(400).json({ msg: 'Invalid token' });
        }
        const userId = decoded.userId;
        const user = await getUserById(userId);
        console.log('user', user);
        if (!user) {
            return res.status(400).json({ msg: 'Invalid token' });
        }
        user.isEmailVerified = true;
        await user.save();
        res.json({ msg: 'Email confirmed successfully' });
    } catch (err: any) {
        res.status(500).json({ msg: 'Server error' });
    }
};

export const loginController = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        const user = await getUserByEmail(email);
        if (!user) {
            return res.status(400).send({ message: 'Invalid email or password' });
        }
        const isEmailVerified = user.isEmailVerified;
        if (!isEmailVerified) {
            return res.status(400).send({ message: 'Email not verified' });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).send({ message: 'Invalid email or password' });
        }
        const userId = (user._id).toString() as string;
        const accessToken = generateToken(userId);
        const refreshToken = generateRefreshToken(userId);
        user.refreshToken = refreshToken;
        await user.save();

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'strict',
        });
        return res.status(200).send({ message: 'Login successful', accessToken });
    } catch (err: any) {
        return res.status(500).send({ message: err.message });
    }
};

export const logoutController = async (req: Request, res: Response) => {
    res.clearCookie('refreshToken');
    return res.status(200).send({ message: 'Logged out successfully' });
};

export const refreshTokenController = async (req: Request, res: Response) => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
        return res.status(400).send({ message: 'No refresh token provided' });
    }
    try {
        const decoded = verifyToken(refreshToken) as any;
        if (!decoded) {
            return res.status(400).send({ message: 'Invalid refresh token' });
        }
        const userId = decoded.userId;
        const user = await getUserById(userId);
        if (!user) {
            return res.status(400).send({ message: 'User not found' });
        }
        const accessToken = generateToken(userId);
        return res.status(200).send({ message: 'Access token generated successfully', accessToken });
    } catch (err: any) {
        return res.status(500).send({ message: err.message });
    }
};

export const passport_Auth = async (req: Request, res: Response) => {
    let user: IUser = req.user as IUser;
    const accessToken = generateToken(user._id.toString());
    const refreshToken = generateRefreshToken(user._id.toString());
    await updateUser(user._id.toString(), { refreshToken });

    res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
    });

    res.status(200).json({ accessToken });
}