/**
 * @swagger
 * tags:
 *   name: Messages
 *   description: Message management
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Message:
 *       type: object
 *       required:
 *         - chat_id
 *         - sender_id
 *         - content
 *       properties:
 *         id:
 *           type: string
 *           description: Auto-generated unique identifier for the message
 *         chat_id:
 *           type: string
 *           description: ID of the chat the message belongs to
 *         sender_id:
 *           type: string
 *           description: ID of the sender (User ID)
 *         content:
 *           type: string
 *           description: The content of the message
 *         isRead:
 *           type: boolean
 *           description: Message read status
 *           default: false
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The time when the message was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: The last time when the message was updated
 *       example:
 *         id: 614c1b6e451a2347f9c12b34
 *         chat_id: 614c1b6e451a2347f9c12a34
 *         sender_id: 614c1b6e451a2347f9c12a12
 *         content: "Hello, how are you?"
 *         isRead: false
 *         createdAt: 2024-09-22T10:00:00Z
 *         updatedAt: 2024-09-22T10:00:00Z
 */

/**
 * @swagger
 * /api/messages:
 *   post:
 *     summary: Create a new message in a chat
 *     tags: [Messages]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - chatId
 *               - senderId
 *               - content
 *             properties:
 *               chatId:
 *                 type: string
 *                 description: ID of the chat
 *               senderId:
 *                 type: string
 *                 description: ID of the message sender (User ID)
 *               content:
 *                 type: string
 *                 description: The message content
 *             example:
 *               chatId: "614c1b6e451a2347f9c12a34"
 *               senderId: "614c1b6e451a2347f9c12a12"
 *               content: "Hello, how are you?"
 *     responses:
 *       201:
 *         description: Message created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Message'
 *       400:
 *         description: Bad request (Invalid input data)
 *       401:
 *         description: Unauthorized (Authentication required)
 */

/**
 * @swagger
 * /api/messages/{chatId}:
 *   get:
 *     summary: Retrieve all messages for a specific chat
 *     tags: [Messages]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: chatId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the chat to retrieve messages for
 *     responses:
 *       200:
 *         description: Successfully retrieved the messages
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Message'
 *       404:
 *         description: Chat not found
 *       401:
 *         description: Unauthorized (Authentication required)
 */

/**
 * @swagger
 * /api/messages/{messageId}:
 *   put:
 *     summary: Edit a message
 *     tags: [Messages]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: messageId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the message to edit
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - newContent
 *             properties:
 *               newContent:
 *                 type: string
 *                 description: The updated content of the message
 *     responses:
 *       200:
 *         description: Message updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Message'
 *       404:
 *         description: Message not found
 *       401:
 *         description: Unauthorized (Authentication required)
 */

/**
 * @swagger
 * /api/messages/{messageId}:
 *   delete:
 *     summary: Delete a message
 *     tags: [Messages]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: messageId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the message to delete
 *     responses:
 *       204:
 *         description: Successfully deleted the message
 *       404:
 *         description: Message not found
 *       401:
 *         description: Unauthorized (Authentication required)
 */

/**
 * @swagger
 * /api/messages/read/{messageId}:
 *   put:
 *     summary: Mark a message as read
 *     tags: [Messages]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: messageId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the message to mark as read
 *     responses:
 *       200:
 *         description: Message marked as read
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Message'
 *       404:
 *         description: Message not found
 *       401:
 *         description: Unauthorized (Authentication required)
 */

import { Router } from "express";
import {
  createMessage,
  deleteMessage,
  editMessage,
  getMessageForChat,
  markMessageAsRead,
} from "../controllers/message.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();

router.post("/", authMiddleware, createMessage);
router.get("/:chatId", authMiddleware, getMessageForChat);
router.put("/:messageId", authMiddleware, editMessage);
router.delete("/:messageId", authMiddleware, deleteMessage);
router.put("/read/:messageId", authMiddleware, markMessageAsRead);

export default router;
