import express from 'express';
import http from "http";
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import expressRateLimit from 'express-rate-limit';
import { dbConnect, dbDisconnect } from './DBConfig/db.config';
import userRouter from './routes/user.route';
import applicantRouter from './routes/applicant.route';
import clientRouter from './routes/client.route';
import requestRouter from './routes/request.route';
import passport from './utils/passport.utils';
import session from 'express-session';
import { zodErrorHandler } from './middlewares/zodErrorHandler';
import { multerErrorHandler } from './middlewares/multerErrorHandler';
import { ErrorHandler } from './middlewares/generalErrorHandler';
import dotenv from 'dotenv';
import { Server } from 'socket.io';
import { swaggerUi,swaggerDocs } from './swagger';
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

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
app.use('/api/auth', userRouter);
app.use('/api/applicant', applicantRouter);
app.use('/api/client', clientRouter);
app.use('/api/request', requestRouter);

app.use(zodErrorHandler);
app.use(multerErrorHandler);
app.use(ErrorHandler);


const serverListen = server.listen(process.env.PORT ||3000, () => {
    console.log('Server is running on port 3000');
});

export { io }
export default serverListen;