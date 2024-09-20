import * as offerController from '../controllers/offer.controller';
import { Router } from 'express';
import { authMiddleware, clientRoleoleMiddleware,applicantRoleMiddleware,adminRoleMiddleware } from '../middlewares/auth.middleware';

const offerRouter = Router();
/**
 * @swagger
 * tags:
 *   name: Offers
 *   description: Offer management and retrieval
 */

/**
 * @swagger
 * /api/offer:
 *   post:
 *     summary: Create a new offer
 *     tags: [Offers]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               requestId:
 *                 type: string
 *                 description: The ID of the request related to the offer
 *               applicantId:
 *                 type: string
 *                 description: The ID of the applicant making the offer
 *               price:
 *                 type: number
 *                 description: The price proposed by the applicant
 *             required:
 *               - requestId
 *               - applicantId
 *               - price
 *     responses:
 *       201:
 *         description: Offer created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Offer'
 *       400:
 *         description: Validation error
 *       403:
 *         description: Unauthorized access
 */

/**
 * @swagger
 * /api/offer/{offerId}:
 *   get:
 *     summary: Get offer by ID
 *     tags: [Offers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: offerId
 *         schema:
 *           type: string
 *         required: true
 *         description: The offer ID
 *     responses:
 *       200:
 *         description: Offer details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Offer'
 *       404:
 *         description: Offer not found
 *       403:
 *         description: Unauthorized access
 */

/**
 * @swagger
 * /api/offer/applicant/{applicantId}:
 *   get:
 *     summary: Get offers by applicant ID
 *     tags: [Offers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: applicantId
 *         schema:
 *           type: string
 *         required: true
 *         description: The applicant ID
 *     responses:
 *       200:
 *         description: List of offers
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Offer'
 *       403:
 *         description: Unauthorized access
 */

/**
 * @swagger
 * /api/offer/request/{requestId}:
 *   get:
 *     summary: Get offers by request ID
 *     tags: [Offers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: requestId
 *         schema:
 *           type: string
 *         required: true
 *         description: The request ID
 *     responses:
 *       200:
 *         description: List of offers for the given request
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Offer'
 *       403:
 *         description: Unauthorized access
 */

/**
 * @swagger
 * /api/offer:
 *   get:
 *     summary: Get all offers (admin only)
 *     tags: [Offers]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all offers
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Offer'
 *       403:
 *         description: Unauthorized access
 */
/**
 * @swagger
 * /api/offer/{offerId}:
 *   put:
 *     summary: Update an offer by ID
 *     tags: [Offers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: offerId
 *         schema:
 *           type: string
 *         required: true
 *         description: The offer ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               requestId:
 *                 type: string
 *                 description: The ID of the request related to the offer
 *               applicantId:
 *                 type: string
 *                 description: The ID of the applicant making the offer
 *               price:
 *                 type: number
 *                 description: The price proposed by the applicant
 *             required:
 *               - requestId
 *               - applicantId
 *               - price
 *     responses:
 *       200:
 *         description: Offer updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Offer'
 *       404:
 *         description: Offer not found
 *       403:
 *         description: Unauthorized access
 */

/**
 * @swagger
 * /api/offer/{offerId}/select:
 *   put:
 *     summary: Select an offer by ID (client only)
 *     tags: [Offers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: offerId
 *         schema:
 *           type: string
 *         required: true
 *         description: The offer ID
 *     responses:
 *       200:
 *         description: Offer selected successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 requestId:
 *                   type: string
 *                 applicantId:
 *                   type: string
 *                 price:
 *                   type: number
 *                 status:
 *                   type: string
 *                   example: "selected"  
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *                 __v:
 *                   type: number
 *       404:
 *         description: Offer not found
 *       403:
 *         description: Unauthorized access
 */


/**
 * @swagger
 * /api/offer/request/{requestId}/applicants:
 *   get:
 *     summary: Get all applicants for a request ID
 *     tags: [Offers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: requestId
 *         schema:
 *           type: string
 *         required: true
 *         description: The request ID
 *     responses:
 *       200:
 *         description: List of applicants for the request
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     description: The unique ID for the offer.
 *                   requestId:
 *                     type: string
 *                     description: The ID of the request associated with the applicant.
 *                   applicantId:
 *                     type: object
 *                     properties:
 *                       userId:
 *                         type: object
 *                         properties:
 *                           name:
 *                             type: string
 *                             description: Name of the applicant.
 *                       location:
 *                         type: string
 *                         description: Location of the applicant.
 *                       summary:
 *                         type: string
 *                         description: A summary or description of the applicant’s skills and experience.
 *                       jobName:
 *                         type: string
 *                         description: The applicant's job title.
 *                   status:
 *                     type: string
 *                     description: The current status of the offer (e.g., pending, accepted).
 *                   price:
 *                     type: number
 *                     description: The price or offer amount from the applicant.
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                     description: When the offer was created.
 *                   updatedAt:
 *                     type: string
 *                     format: date-time
 *                     description: When the offer was last updated.
 *                   __v:
 *                     type: number
 *                     description: Version key.
 *       403:
 *         description: Unauthorized access
 */


/**
 * @swagger
 * /api/offer/{offerId}:
 *   delete:
 *     summary: Delete an offer by ID
 *     tags: [Offers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: offerId
 *         schema:
 *           type: string
 *         required: true
 *         description: The offer ID
 *     responses:
 *       204:
 *         description: Offer deleted successfully
 *       404:
 *         description: Offer not found
 *       403:
 *         description: Unauthorized access
 */

/**
 * @swagger
 * /api/offer/request/{requestId}:
 *   delete:
 *     summary: Delete offers by request ID
 *     tags: [Offers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: requestId
 *         schema:
 *           type: string
 *         required: true
 *         description: The request ID
 *     responses:
 *       204:
 *         description: Offers deleted successfully
 *       403:
 *         description: Unauthorized access
 */

/**
 * @swagger
 * /api/offer/applicant/{applicantId}:
 *   delete:
 *     summary: Delete offers by applicant ID
 *     tags: [Offers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: applicantId
 *         schema:
 *           type: string
 *         required: true
 *         description: The applicant ID
 *     responses:
 *       204:
 *         description: Offers deleted successfully
 *       403:
 *         description: Unauthorized access
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Offer:
 *       type: object
 *       required:
 *         - requestId
 *         - applicantId
 *         - price
 *       properties:
 *         requestId:
 *           type: string
 *           description: The ID of the request
 *         applicantId:
 *           type: string
 *           description: The ID of the applicant
 *         status:
 *           type: string
 *           description: Status of the offer
 *           default: pending
 *         price:
 *           type: number
 *           description: The price offered by the applicant
 *         feedbackId:
 *           type: string
 *           description: The feedback ID (optional)
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */


offerRouter.post('/', authMiddleware, applicantRoleMiddleware, offerController.createOffer);
offerRouter.get('/:offerId', authMiddleware,applicantRoleMiddleware, offerController.getOfferById);
offerRouter.get('/applicant/:applicantId', authMiddleware,applicantRoleMiddleware, offerController.getOffersByApplicantId);
offerRouter.get('/request/:requestId', authMiddleware,clientRoleoleMiddleware, offerController.getOffersByRequestId);
offerRouter.get('/', authMiddleware,adminRoleMiddleware, offerController.getOffers);
offerRouter.put('/:offerId', authMiddleware, applicantRoleMiddleware, offerController.updateOffer);
offerRouter.get('/request/:requestId/applicants', authMiddleware,clientRoleoleMiddleware, offerController.getApplicantsByRequestId);
offerRouter.delete('/:offerId', authMiddleware, applicantRoleMiddleware, offerController.deleteOffer);
offerRouter.delete('/request/:requestId', authMiddleware, applicantRoleMiddleware, offerController.deleteOfferByRequestId);
offerRouter.delete('/applicant/:applicantId', authMiddleware, applicantRoleMiddleware, offerController.deleteOfferByApplicantId);
offerRouter.put('/:offerId/select', authMiddleware, clientRoleoleMiddleware, offerController.selectOffer);

export default offerRouter;


