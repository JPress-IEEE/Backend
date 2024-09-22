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
import recommendationRouter from './routes/recommendation.route';
import offerRouter from './routes/offer.route';
import feedbackRouter from './routes/feedback.route';
import bookmarkRouter from './routes/bookmark.route';
import translationRouter from './routes/translation.route';
import passport from './utils/passport.utils';
import session from 'express-session';
import { zodErrorHandler } from './middlewares/zodErrorHandler';
import { multerErrorHandler } from './middlewares/multerErrorHandler';
import { ErrorHandler } from './middlewares/generalErrorHandler';
import dotenv from 'dotenv';
import { Server } from 'socket.io';
import { swaggerUi,swaggerDocs } from './swagger';

import chatRouter from "./routes/chat.route"
import messageRouter from "./routes/messsage.route"
import videoCallRouter from "./routes/videocall.route"
import notificationRouter from "./routes/notification.route"

import { handleChatSockets } from "./sockets/chat.socket"
import { handleVideoCallSockets } from "./sockets/videocall.socket"
import { handleNotificationSocket } from "./sockets/notification.socket"
dotenv.config();
import cors from 'cors';

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });
dbConnect();

app.use(cors({
    origin: 'http://localhost:5173', 
    credentials: true 
}));


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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
app.use('/api/offer', offerRouter);
app.use('/api/recommendation', recommendationRouter);
app.use('/api/feedback', feedbackRouter);
app.use('/api/bookmark', bookmarkRouter);
app.use('/api/translation', translationRouter);

app.use("/api/chats", chatRouter)
app.use("/api/messages", messageRouter)
app.use("/api/video-calls", videoCallRouter)
app.use("/api/notifications", notificationRouter)

app.use(zodErrorHandler);
app.use(multerErrorHandler);
app.use(ErrorHandler);

handleChatSockets(io)
handleVideoCallSockets(io)
handleNotificationSocket(io)

io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);
});

const serverListen = server.listen(process.env.PORT ||3000, () => {
    console.log('Server is running on port', process.env.PORT);
});

export { io }
export default serverListen;