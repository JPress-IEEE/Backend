import {profilePicUpload} from "../utils/upload.utils";
import {createUserController,loginController,logoutController,refreshTokenController,confirmEmail,passport_Auth} from '../controllers/user.controller';
import express from 'express';
import passport from 'passport';


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