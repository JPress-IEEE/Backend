/**
 * @swagger
 * tags:
 *   name: Notifications
 *   description: Notification management
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Notification:
 *       type: object
 *       required:
 *         - userId
 *         - message
 *         - status
 *       properties:
 *         id:
 *           type: string
 *           description: Auto-generated unique identifier for the notification
 *         userId:
 *           type: string
 *           description: ID of the user to whom the notification belongs
 *         message:
 *           type: string
 *           description: The notification message
 *         status:
 *           type: string
 *           description: The status of the notification (e.g., read, unread)
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The time when the notification was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: The last time when the notification was updated
 *       example:
 *         id: 614c1b6e451a2347f9c12b34
 *         userId: "614c1b6e451a2347f9c12a12"
 *         message: "You have a new message!"
 *         status: "unread"
 *         createdAt: 2024-09-22T10:00:00Z
 *         updatedAt: 2024-09-22T10:00:00Z
 */

/**
 * @swagger
 * /api/notifications/create:
 *   post:
 *     summary: Create a new notification
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - message
 *               - status
 *             properties:
 *               userId:
 *                 type: string
 *                 description: ID of the user receiving the notification
 *               message:
 *                 type: string
 *                 description: The notification message
 *               status:
 *                 type: string
 *                 description: The status of the notification
 *             example:
 *               userId: "614c1b6e451a2347f9c12a12"
 *               message: "You have a new message!"
 *               status: "unread"
 *     responses:
 *       201:
 *         description: Notification created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Notification'
 *       400:
 *         description: Bad request (Invalid input data)
 *       401:
 *         description: Unauthorized (Authentication required)
 */

/**
 * @swagger
 * /api/notifications/get:
 *   get:
 *     summary: Retrieve notifications for a specific user
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the user to retrieve notifications for
 *     responses:
 *       200:
 *         description: Successfully retrieved the notifications
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Notification'
 *       404:
 *         description: User not found
 *       401:
 *         description: Unauthorized (Authentication required)
 */

/**
 * @swagger
 * /api/notifications/update:
 *   put:
 *     summary: Update a notification status
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - notificationId
 *               - status
 *             properties:
 *               notificationId:
 *                 type: string
 *                 description: The ID of the notification to update
 *               status:
 *                 type: string
 *                 description: The new status of the notification
 *     responses:
 *       200:
 *         description: Notification updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Notification'
 *       404:
 *         description: Notification not found
 *       401:
 *         description: Unauthorized (Authentication required)
 */

/**
 * @swagger
 * /api/notifications/delete:
 *   delete:
 *     summary: Delete a notification
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - notificationId
 *             properties:
 *               notificationId:
 *                 type: string
 *                 description: The ID of the notification to delete
 *     responses:
 *       204:
 *         description: Successfully deleted the notification
 *       404:
 *         description: Notification not found
 *       401:
 *         description: Unauthorized (Authentication required)
 */

import * as notificationController from '../controllers/notification.controller';   
import express from 'express';
import { authMiddleware } from '../middlewares/auth.middleware';

const notificationRouter = express.Router();

notificationRouter.post('/create', authMiddleware, notificationController.createNotification);
notificationRouter.get('/get', authMiddleware, notificationController.getNotification);
notificationRouter.put('/update', authMiddleware, notificationController.updateNotification);
notificationRouter.delete('/delete', authMiddleware, notificationController.deleteNotification);

export default notificationRouter;
