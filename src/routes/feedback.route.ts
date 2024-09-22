import * as feedbackController from '../controllers/feedback.controller';
import { Router } from 'express';
import { authMiddleware,clientRoleoleMiddleware,applicantRoleMiddleware } from '../middlewares/auth.middleware';


const feedbackRouter = Router();
/**
 * @swagger
 * components:
 *   schemas:
 *     Feedback:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: The unique identifier for feedback.
 *         applicantId:
 *           type: string
 *           description: The ID of the applicant receiving the feedback.
 *         clientId:
 *           type: string
 *           description: The ID of the client providing the feedback.
 *         offerId:
 *           type: string
 *           description: The ID of the offer for which the feedback is being given.
 *         rate:
 *           type: number
 *           description: The rating given by the client.
 *         comment:
 *           type: string
 *           description: The feedback comment.
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Date when the feedback was created.
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Date when the feedback was last updated.
 */

/**
 * @swagger
 * /api/feedback/applicant/{id}:
 *   get:
 *     summary: Get all feedbacks for a specific applicant
 *     tags: [Feedback]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the applicant
 *     responses:
 *       200:
 *         description: A list of feedbacks for the specified applicant
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Feedback'
 *       404:
 *         description: Feedback not found
 */

/**
 * @swagger
 * /api/feedback/{id}:
 *   get:
 *     summary: Get feedback by ID
 *     tags: [Feedback]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the feedback
 *     responses:
 *       200:
 *         description: Feedback found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Feedback'
 *       404:
 *         description: Feedback not found
 */

/**
 * @swagger
 * /api/feedback:
 *   post:
 *     summary: Create new feedback
 *     tags: [Feedback]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               applicantId:
 *                 type: string
 *                 description: ID of the applicant
 *               clientId:
 *                 type: string
 *                 description: ID of the client
 *               offerId:
 *                 type: string
 *                 description: ID of the offer
 *               rate:
 *                 type: number
 *                 description: Rating given by the client
 *               comment:
 *                 type: string
 *                 description: Comment for the feedback
 *     responses:
 *       201:
 *         description: Feedback created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Feedback'
 *       400:
 *         description: Bad request
 */

/**
 * @swagger
 * /api/feedback/{id}:
 *   put:
 *     summary: Update feedback by ID
 *     tags: [Feedback]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the feedback to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               rate:
 *                 type: number
 *                 description: Updated rating
 *               comment:
 *                 type: string
 *                 description: Updated comment
 *     responses:
 *       200:
 *         description: Feedback updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Feedback'
 *       400:
 *         description: Bad request
 *       404:
 *         description: Feedback not found
 */

/**
 * @swagger
 * /api/feedback/{id}:
 *   delete:
 *     summary: Delete feedback by ID
 *     tags: [Feedback]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the feedback to delete
 *     responses:
 *       204:
 *         description: Feedback deleted successfully
 *       400:
 *         description: Bad request
 *       404:
 *         description: Feedback not found
 */

feedbackRouter.get('/applicant/:id',authMiddleware, feedbackController.getFeedbacksByApplicantId);
feedbackRouter.get('/:id',authMiddleware, feedbackController.getFeedbackById);
feedbackRouter.post('/',authMiddleware,clientRoleoleMiddleware, feedbackController.createFeedback);
feedbackRouter.put('/:id',authMiddleware,clientRoleoleMiddleware, feedbackController.updateFeedback);
feedbackRouter.delete('/:id',authMiddleware,clientRoleoleMiddleware, feedbackController.deleteFeedback);

export default feedbackRouter;
