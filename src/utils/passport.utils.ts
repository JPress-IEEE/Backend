
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as FacebookStrategy } from 'passport-facebook';
import { Strategy as LinkedinStrategy } from 'passport-linkedin-oauth2';
import { getUserByEmail, createUser } from '../services/user.services';
import { IUser, User } from '../models/user.model';
import { generateRefreshToken } from './jwt.utils';

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID!,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    callbackURL: 'http://localhost:3000/auth/google/callback'
},
    async (accessToken, refreshToken, profile, done) => {
        try {
            const email = profile.emails?.[0].value;
            const google_id = profile.id;

            if (!email) {
                return done(new Error('No email found'), null!);
            }
            let user = await User.findOne({ google_id });

            if (!user) {
                user = await User.findOne({ email });
                const refreshToken = generateRefreshToken(user?._id);
                if (user) {
                    user.google_id = google_id;
                    user.refreshToken = refreshToken ;
                    await user.save();
                } else {
                    const newUser = {
                        name: profile.displayName,
                        email: email,
                        google_id: google_id,
                        password: '',
                        role: 'user',
                        profilePic: profile.photos?.[0].value || '',
                        isEmailVerified: true,
                        refreshToken: refreshToken
                    } as IUser;
                    user = await createUser(newUser);
                    user.refreshToken = refreshToken;
                    await user.save();
                }
            }

            done(null, user);
        } catch (err) {
            done(err, null!);
        }
    }));

passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_APP_ID!,
    clientSecret: process.env.FACEBOOK_APP_SECRET!,
    callbackURL: 'http://localhost:3000/auth/facebook/callback',
    profileFields: ['id', 'emails', 'name', 'photos']
},
    async (accessToken, refreshToken, profile, done) => {
        try {
            const email = profile.emails?.[0].value;
            const facebook_id = profile.id;

            if (!email) {
                return done(new Error('No email found'), null!);
            }
            let user = await User.findOne({ facebook_id });

            if (!user) {
                user = await User.findOne({ email });
                const refreshToken = generateRefreshToken(user?._id);
                if (user) {
                    user.facebook_id = facebook_id;
                    user.refreshToken = refreshToken;
                    await user.save();
                } else {
                    const newUser = {
                        name: profile.displayName,
                        email: email,
                        facebook_id: facebook_id,
                        password: '',
                        role: 'user',
                        profilePic: profile.photos?.[0].value || '',
                        isEmailVerified: true,
                        refreshToken: refreshToken
                    } as IUser;
                    user = await createUser(newUser);
                    user.refreshToken = refreshToken;
                    await user.save();
                }
            }

            done(null, user);
        } catch (err) {
            done(err, null!);
        }
    }));

passport.use(new LinkedinStrategy({
    clientID: process.env.LINKEDIN_CLIENT_ID!,
    clientSecret: process.env.LINKEDIN_CLIENT_SECRET!,
    callbackURL: 'http://localhost:3000/auth/linkedin/callback',
    scope: ['r_emailaddress', 'r_liteprofile']
},
    async (accessToken, refreshToken, profile, done) => {
        try {
            const email = profile.emails?.[0].value;
            const linkedin_id = profile.id;

            if (!email) {
                return done(new Error('No email found'), null!);
            }
            let user = await User.findOne({ linkedin_id });

            if (!user) {
                user = await User.findOne({ email });
                const refreshToken = generateRefreshToken(user?._id);
                if (user) {
                    user.linkedin_id = linkedin_id;
                    user.refreshToken = refreshToken;
                    await user.save();
                } else {
                    const newUser = {
                        name: profile.displayName,
                        email: email,
                        linkedin_id: linkedin_id,
                        password: '',
                        role: 'user',
                        profilePic: profile.photos?.[0].value || '',
                        isEmailVerified: true,
                        refreshToken: refreshToken
                    } as IUser;
                    user = await createUser(newUser);
                    user.refreshToken = refreshToken;
                    await user.save();
                }
            }

            done(null, user);
        } catch (err) {
            done(err, null!);
        }
    }));


passport.serializeUser((user, done) => {
    done(null, (user as IUser).id);
});

passport.deserializeUser((id, done) => {
    User.findById(id)
        .then((user: IUser | null) => {
            if (user) {
                done(null, user);
            } else {
                done(new Error('User not found'));
            }
        })
        .catch((err: any) => {
            done(err);
        });
});

export default passport;