/**
 * @swagger
 * tags:
 *   name: Chats
 *   description: Chat management
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Chat:
 *       type: object
 *       required:
 *         - participant1_id
 *         - participant2_id
 *       properties:
 *         id:
 *           type: string
 *           description: Auto-generated unique identifier for the chat
 *         participant1_id:
 *           type: string
 *           description: ID of the first chat participant (User ID)
 *         participant2_id:
 *           type: string
 *           description: ID of the second chat participant (User ID)
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The time when the chat was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: The last time when the chat was updated
 *       example:
 *         id: 615c1b6e451a2347f9c12a34
 *         participant1_id: 615c1b6e451a2347f9c12a12
 *         participant2_id: 615c1b6e451a2347f9c12a13
 *         createdAt: 2024-09-22T10:00:00Z
 *         updatedAt: 2024-09-22T10:00:00Z
 */

/**
 * @swagger
 * /api/chats/chat:
 *   post:
 *     summary: Create a new chat between two users
 *     tags: [Chats]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - participant1_id
 *               - participant2_id
 *             properties:
 *               participant1_id:
 *                 type: string
 *                 description: ID of the first participant (User ID)
 *               participant2_id:
 *                 type: string
 *                 description: ID of the second participant (User ID)
 *             example:
 *               participant1_id: "615c1b6e451a2347f9c12a12"
 *               participant2_id: "615c1b6e451a2347f9c12a13"
 *     responses:
 *       201:
 *         description: Chat created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Chat'
 *       400:
 *         description: Bad request (Invalid input data)
 *       401:
 *         description: Unauthorized (Authentication required)
 */

/**
 * @swagger
 * /api/chats/chat/{chatId}/messages:
 *   get:
 *     summary: Retrieve all messages for a specific chat
 *     tags: [Chats]
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
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     description: The chat message content
 *                   sender:
 *                     type: string
 *                     description: The ID of the message sender
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                     description: Time when the message was created
 *                 example:
 *                   message: "Hello, how are you?"
 *                   sender: "615c1b6e451a2347f9c12a12"
 *                   createdAt: "2024-09-22T11:00:00Z"
 *       404:
 *         description: Chat not found
 *       401:
 *         description: Unauthorized (Authentication required)
 */

import { Router } from "express";
import { createChat, getChatMessages } from "../controllers/chat.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();

router.post("/chat", authMiddleware, createChat);
router.get("/chat/:chatId/messages", authMiddleware, getChatMessages);

export default router;
