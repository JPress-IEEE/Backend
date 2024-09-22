import * as notificationController from '../controllers/notification.controller';   
import express from 'express';
import { authMiddleware } from '../middlewares/auth.middleware';
const notificationRouter = express.Router();

notificationRouter.post('/create',authMiddleware, notificationController.createNotification);
notificationRouter.get('/get',authMiddleware,notificationController.getNotification);
notificationRouter.put('/update',authMiddleware, notificationController.updateNotification);
notificationRouter.delete('/delete',authMiddleware, notificationController.deleteNotification);


export default notificationRouter;
