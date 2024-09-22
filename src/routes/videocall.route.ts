/**
 * @swagger
 * tags:
 *   name: Video Calls
 *   description: Video call management
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     VideoCall:
 *       type: object
 *       required:
 *         - chat_id
 *         - sender_id
 *         - receiver_id
 *         - callStatus
 *       properties:
 *         id:
 *           type: string
 *           description: Auto-generated unique identifier for the video call
 *         chat_id:
 *           type: string
 *           description: ID of the chat associated with the video call
 *         sender_id:
 *           type: string
 *           description: ID of the user initiating the video call
 *         receiver_id:
 *           type: string
 *           description: ID of the user receiving the video call
 *         startTime:
 *           type: string
 *           format: date-time
 *           description: The time when the video call started
 *         endTime:
 *           type: string
 *           format: date-time
 *           description: The time when the video call ended
 *         callStatus:
 *           type: string
 *           enum: [pending, active, ended, missed]
 *           description: The current status of the video call
 *       example:
 *         id: 614c1b6e451a2347f9c12b34
 *         chat_id: "614c1b6e451a2347f9c12a12"
 *         sender_id: "614c1b6e451a2347f9c12a13"
 *         receiver_id: "614c1b6e451a2347f9c12a14"
 *         startTime: 2024-09-22T10:00:00Z
 *         endTime: null
 *         callStatus: "pending"
 */

/**
 * @swagger
 * /api/video-calls/request:
 *   post:
 *     summary: Request a video call
 *     tags: [Video Calls]
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
 *               - receiverId
 *             properties:
 *               chatId:
 *                 type: string
 *                 description: The ID of the chat for the video call
 *               senderId:
 *                 type: string
 *                 description: The ID of the user requesting the call
 *               receiverId:
 *                 type: string
 *                 description: The ID of the user to receive the call
 *             example:
 *               chatId: "614c1b6e451a2347f9c12a12"
 *               senderId: "614c1b6e451a2347f9c12a13"
 *               receiverId: "614c1b6e451a2347f9c12a14"
 *     responses:
 *       201:
 *         description: Video call requested successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/VideoCall'
 *       400:
 *         description: Bad request (Missing required fields)
 *       401:
 *         description: Unauthorized (Authentication required)
 */

/**
 * @swagger
 * /api/video-calls/accept:
 *   post:
 *     summary: Accept a video call
 *     tags: [Video Calls]
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
 *               - receiverId
 *             properties:
 *               chatId:
 *                 type: string
 *                 description: The ID of the chat for the video call
 *               senderId:
 *                 type: string
 *                 description: The ID of the user who initiated the call
 *               receiverId:
 *                 type: string
 *                 description: The ID of the user accepting the call
 *     responses:
 *       200:
 *         description: Video call accepted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/VideoCall'
 *       400:
 *         description: Bad request (Missing required fields)
 *       401:
 *         description: Unauthorized (Authentication required)
 */

/**
 * @swagger
 * /api/video-calls/decline:
 *   post:
 *     summary: Decline a video call
 *     tags: [Video Calls]
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
 *               - receiverId
 *             properties:
 *               chatId:
 *                 type: string
 *                 description: The ID of the chat for the video call
 *               senderId:
 *                 type: string
 *                 description: The ID of the user who initiated the call
 *               receiverId:
 *                 type: string
 *                 description: The ID of the user declining the call
 *     responses:
 *       200:
 *         description: Video call declined successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/VideoCall'
 *       400:
 *         description: Bad request (Missing required fields)
 *       401:
 *         description: Unauthorized (Authentication required)
 */

/**
 * @swagger
 * /api/video-calls/end:
 *   post:
 *     summary: End a video call
 *     tags: [Video Calls]
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
 *               - receiverId
 *             properties:
 *               chatId:
 *                 type: string
 *                 description: The ID of the chat for the video call
 *               senderId:
 *                 type: string
 *                 description: The ID of the user who initiated the call
 *               receiverId:
 *                 type: string
 *                 description: The ID of the user ending the call
 *     responses:
 *       200:
 *         description: Video call ended successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/VideoCall'
 *       400:
 *         description: Bad request (Missing required fields)
 *       401:
 *         description: Unauthorized (Authentication required)
 */

import { Router } from "express";
import { acceptCall, declineCall, endVideoCall, requestCall } from "../controllers/videocall.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();

router.post("/request", authMiddleware, requestCall);
router.post("/accept", authMiddleware, acceptCall);
router.post("/decline", authMiddleware, declineCall);
router.post("/end", authMiddleware, endVideoCall);

export default router;
