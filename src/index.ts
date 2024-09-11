import express from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import expressRateLimit from 'express-rate-limit';
import { dbConnect, dbDisconnect } from './DBConfig/db.config';
import userRouter from './routes/user.route';
import passport from './utils/passport.utils';
import session from 'express-session';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
dbConnect();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(session({
    secret: process.env.SESSION_SECRET!,
    resave: false,
    saveUninitialized: false
}));

app.use(expressRateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100
}));

app.use(passport.initialize());
app.use(passport.session());

app.use('/api/auth', userRouter);

const server = app.listen(process.env.PORT ||3000, () => {
    console.log('Server is running on port 3000');
});

export default server;
