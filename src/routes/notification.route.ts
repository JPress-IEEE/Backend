import * as notificationController from '../controllers/notification.controller';   
import express from 'express';

const notificationRouter = express.Router();

notificationRouter.post('/create', notificationController.createNotification);
notificationRouter.get('/get', notificationController.getNotification);
notificationRouter.put('/update', notificationController.updateNotification);
notificationRouter.delete('/delete', notificationController.deleteNotification);


export default notificationRouter;
