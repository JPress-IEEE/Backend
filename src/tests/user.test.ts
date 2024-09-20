import request from "supertest";
import express from "express";
import * as authServices from "../services/user.services";
import userRouter from "../routes/user.route";
import bcrypt from 'bcrypt';
import { generateRefreshToken, generateToken, verifyToken } from '../utils/jwt.utils';
import { sendEmail, generateEmailToken, verifyEmailToken } from '../utils/email.utils';
import { userSchema } from '../schemas/user.schema';
import { mock } from "node:test";

jest.mock('../schemas/user.schema', () => ({
    userSchema:{
        parse: jest.fn()
    }
}));

jest.mock('../services/user.services', () => ({
    createUser: jest.fn(),
    getUserByEmail: jest.fn(),
    getUserById: jest.fn()
}));

jest.mock('../utils/jwt.utils', () => ({
    generateRefreshToken: jest.fn(),
    generateToken: jest.fn(),
    verifyToken: jest.fn()
}));

jest.mock('../utils/email.utils', () => ({
    sendEmail: jest.fn(),
    generateEmailToken: jest.fn(),
    verifyEmailToken: jest.fn()
}));

jest.mock('bcrypt', () => ({
    hash: jest.fn(),
    compare: jest.fn()
}));

const app = express();
app.use(express.json());
app.use('/api/auth', userRouter);

describe('User Controller', () => {
    describe('POST /api/auth/register', () => {
        it('should return 201 if user is created successfully', async () => {
            const mockUser = {
                name: 'test',
                email: 'test@example.com',
                password: 'password',
                role: 'applicant',
                profilePic: ''
            };
            (userSchema.parse as jest.Mock).mockReturnValue(mockUser);  
            (authServices.getUserByEmail as jest.Mock).mockResolvedValue(null);
            (generateToken as jest.Mock).mockReturnValue('accessToken');
            (generateEmailToken as jest.Mock).mockReturnValue('emailToken');
            (sendEmail as jest.Mock).mockResolvedValue(undefined);
            (authServices.createUser as jest.Mock).mockResolvedValue({
                _id: 'userId',
                name: 'test',
                email: 'test@example.com',
                password: 'password',
                role: 'applicant',
                profilePic: '',
                isEmailVerified: true,
            });
            const res = await request(app)
                .post('/api/auth/signup')
                .send(mockUser);
            expect(res.status).toBe(201);
        });
        it('should return 400 if user already exists', async () => {
            const mockUser = {
                name: 'test',
                email: 'test@example.com',
                password: 'password',
                role: 'applicant',
                profilePic: ''
            };
            (userSchema.parse as jest.Mock).mockReturnValue(mockUser);
            (authServices.getUserByEmail as jest.Mock).mockResolvedValue(mockUser);
            const res = await request(app)
                .post('/api/auth/signup')
                .send(mockUser);
            expect(res.status).toBe(400);
        });
        it('should return 500 if an error occurs', async () => {
            const mockUser = {
                name: 'test',
                email: 'test@example.com',
                password: 'password',
                role: 'applicant',
                profilePic: ''
            };
            (userSchema.parse as jest.Mock).mockReturnValue(mockUser);
            (authServices.getUserByEmail as jest.Mock).mockRejectedValue(new Error('error'));
            const res = await request(app)
                .post('/api/auth/signup')
                .send(mockUser);
            expect(res.status).toBe(500);
        });
    });
    describe('GET /api/auth/confirm-email', () => {
        it('should return 200 if email is confirmed successfully', async () => {
            const mockUser = {
                _id: '1',
                name: 'test',
                email: 'test@example.com',
                password: 'password',
                role: 'applicant',
                profilePic: '',
                isEmailVerified: false,
                save: jest.fn().mockResolvedValue(true),
            };
        
            (verifyEmailToken as jest.Mock).mockReturnValue({ userId: '1' });
            (authServices.getUserById as jest.Mock).mockResolvedValue(mockUser);
        
            const res = await request(app)
                .get('/api/auth/confirm-email?token=token');
        
            expect(res.status).toBe(200);
            expect(mockUser.save).toHaveBeenCalled();
        });
        it('should return 400 if no token is provided', async () => {
            const res = await request(app)
                .get('/api/auth/confirm-email');
            expect(res.status).toBe(400);
        });        
    });
    describe('POST /api/auth/login', () => {
        it('should return 200 if user is logged in successfully', async () => {
            const mockUser = {
                _id: '1',
                name: 'test',
                email: 'test@example.com',
                password: 'password',
                role: 'applicant',
                profilePic: '',
                isEmailVerified: true,
                save: jest.fn().mockResolvedValue(true),
            };
            (authServices.getUserByEmail as jest.Mock).mockResolvedValue(mockUser);
            (bcrypt.compare as jest.Mock).mockResolvedValue(true);
            (generateToken as jest.Mock).mockReturnValue('accessToken');
            (generateRefreshToken as jest.Mock).mockReturnValue('refreshToken');
            const res = await request(app)
                .post('/api/auth/login')
                .send({ email: 'test@example.com', password: 'password' });
                expect(res.status).toBe(200);
        });
        it('should return 400 if email is not verified', async () => {
            const mockUser = {
                _id: '1',
                name: 'test',
                email: 'test@example.com',
                password: 'password',
                role: 'applicant',
                profilePic: '',
                isEmailVerified: true,
                save: jest.fn().mockResolvedValue(true),
            };
            (authServices.getUserByEmail as jest.Mock).mockResolvedValue(mockUser);
            (bcrypt.compare as jest.Mock).mockResolvedValue(true);
            (generateToken as jest.Mock).mockReturnValue('accessToken');
            (generateRefreshToken as jest.Mock).mockReturnValue('refreshToken');
            mockUser.isEmailVerified = false;
            const res = await request(app)
                .post('/api/auth/login')
                .send({ email: 'test2example.com', password: 'password' });
            expect(res.status).toBe(400);
        });
        it('should return 400 if email or password is invalid', async () => {
            const mockUser = {
                _id: '1',
                name: 'test',
                email: 'test@example.com',
                password: 'password',
                role: 'applicant',
                profilePic: '',
                isEmailVerified: true,
                save: jest.fn().mockResolvedValue(true),
            };
            (authServices.getUserByEmail as jest.Mock).mockResolvedValue(mockUser);
            (bcrypt.compare as jest.Mock).mockResolvedValue(false);
            (generateToken as jest.Mock).mockReturnValue('accessToken');
            (generateRefreshToken as jest.Mock).mockReturnValue('refreshToken');
            const res = await request(app)
                .post('/api/auth/login')
                .send({ email: 'test2example.com', password: 'password' });
            expect(res.status).toBe(400);
        });
        it('should return 500 if an error occurs', async () => {
            (authServices.getUserByEmail as jest.Mock).mockRejectedValue(new Error('error'));
            const res = await request(app)
                .post('/api/auth/login')
                .send({ email: 'test2example.com', password: 'password' });
            expect(res.status).toBe(500);
        });
    });
    describe('POST /api/auth/logout', () => {
        it('should return 200 if user is logged out successfully', async () => {
            const res = await request(app)
                .post('/api/auth/logout');
            expect(res.status).toBe(200);
        });
    });             
});