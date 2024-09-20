import * as recommendationController from '../controllers/recommendation.controller';
import { Router } from 'express';
import { adminRoleMiddleware,authMiddleware } from '../middlewares/auth.middleware';


const recommendationRouter = Router();
/**
 * @swagger
 * tags:
 *   name: Recommendations
 *   description: API for managing recommendations
 */

/**
 * @swagger
 * /api/recommendation/{id}:
 *   get:
 *     summary: Get recommendation by ID
 *     tags: [Recommendations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The recommendation ID
 *     responses:
 *       200:
 *         description: A single recommendation
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Recommendation'
 *       404:
 *         description: Recommendation not found
 *       403:
 *         description: Unauthorized access
 */

/**
 * @swagger
 * /api/recommendation/request/{id}:
 *   get:
 *     summary: Get recommendation by request ID
 *     tags: [Recommendations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The request ID
 *     responses:
 *       200:
 *         description: Recommendation for the request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Recommendation'
 *       404:
 *         description: Recommendation not found for this request
 *       403:
 *         description: Unauthorized access
 */

/**
 * @swagger
 * /api/recommendation/ai:
 *   post:
 *     summary: Get AI-based recommendation
 *     tags: [Recommendations]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               description:
 *                 type: string
 *                 description: The job description for AI-based recommendations
 *               requestId:
 *                 type: string
 *                 description: The ID of the request for which recommendations are being generated
 *             required:
 *               - description
 *     responses:
 *       200:
 *         description: AI-generated recommendations based on the description
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   name:
 *                     type: string
 *                   jobName:
 *                     type: string
 *                   location:
 *                     type: string
 *                   description:
 *                     type: string
 *                     description: Description provided by AI
 *       400:
 *         description: Description is required
 *       500:
 *         description: Server error or error fetching recommendations
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Recommendation:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         requestId:
 *           type: string
 *         applicants:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               applicantId:
 *                 type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */


recommendationRouter.get('/:id',authMiddleware, recommendationController.getRecommendationById);
recommendationRouter.get('/request/:id',authMiddleware, recommendationController.getRecommendationByRequestId);
recommendationRouter.post('/ai',authMiddleware, recommendationController.getAIRecommendation);
export default recommendationRouter;

