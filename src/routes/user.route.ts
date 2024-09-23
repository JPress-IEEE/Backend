import {profilePicUpload} from "../utils/upload.utils";
import {createUserController,loginController,logoutController,refreshTokenController,confirmEmail,passport_Auth} from '../controllers/user.controller';
import express from 'express';
import passport from 'passport';
/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: User authentication and authorization
 * 
 * /api/auth/signup:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *               - role
 *             properties:
 *               profilePic:
 *                 type: string
 *                 format: binary
 *               name:
 *                 type: string
 *                 example: John Doe
 *               email:
 *                 type: string
 *                 example: john.doe@example.com
 *               password:
 *                 type: string
 *                 example: StrongPassword123
 *               role:
 *                 type: string
 *                 example: applicant
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User created successfully
 *                 accessToken:
 *                   type: string
 *                   example: SomeAccessToken123
 *                 refreshToken:
 *                   type: string
 *                   example: SomeRefreshToken123
 *                 userId:
 *                   type: string
 *                   example: 66ece1812a157969f61eb8f9
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User already exists
 * /api/auth/login:
 *   post:
 *     summary: Log in a user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: john.doe@example.com
 *               password:
 *                 type: string
 *                 example: StrongPassword123
 *     responses:
 *       200:
 *         description: User logged in successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Login successful
 *                 accessToken:
 *                   type: string
 *                   example: SomeAccessToken123
 *       400:
 *         description: Invalid email or password
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Invalid email or password
 * 
 * /api/auth/logout:
 *   post:
 *     summary: Log out a user
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Logout successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Logged out successfully
 * 
 * /api/auth/refresh-token:
 *   post:
 *     summary: Refresh the access token using a valid refresh token
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Access token refreshed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accessToken:
 *                   type: string
 *                   example: SomeAccessToken123
 *       400:
 *         description: No or invalid refresh token provided
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Invalid refresh token
 * 
 * /api/auth/confirm-email:
 *   get:
 *     summary: Confirm user email
 *     tags: [Auth]
 *     parameters:
 *       - in: query
 *         name: token
 *         schema:
 *           type: string
 *         required: true
 *         description: Email confirmation token
 *     responses:
 *       200:
 *         description: Email confirmed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Email confirmed successfully
 *       400:
 *         description: Invalid or missing token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Invalid token
 */


const userRouter = express.Router();

userRouter.post('/signup',profilePicUpload.single('profilePic'),createUserController);
userRouter.post('/login',loginController);
userRouter.post('/logout',logoutController);
userRouter.post('/refresh-token',refreshTokenController);
userRouter.get('/confirm-email',confirmEmail);
userRouter.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
userRouter.get('/google/callback', passport.authenticate('google', { failureRedirect: '/login' }),passport_Auth);
userRouter.get('/facebook', passport.authenticate('facebook', { scope: ['email'] }));
userRouter.get('/facebook/callback', passport.authenticate('facebook', { failureRedirect: '/login' }),passport_Auth);
userRouter.get('/linkedin', passport.authenticate('linkedin', { scope: ['r_emailaddress', 'r_liteprofile'] }));
userRouter.get('/linkedin/callback', passport.authenticate('linkedin', { failureRedirect: '/login' }),passport_Auth);

export default userRouter;