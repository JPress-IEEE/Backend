import express from 'express';
import http from "http";
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import expressRateLimit from 'express-rate-limit';
import { dbConnect, dbDisconnect } from './DBConfig/db.config';
import userRouter from './routes/user.route';
import passport from './utils/passport.utils';
import session from 'express-session';
import dotenv from 'dotenv';
import { Server } from 'socket.io';
dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });
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

const serverListen = server.listen(process.env.PORT ||3000, () => {
    console.log('Server is running on port 3000');
});

export { io }
export default serverListen;
