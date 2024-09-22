import express from 'express';
import * as requestController from '../controllers/request.controller';
import { authMiddleware , clientRoleoleMiddleware,adminRoleMiddleware} from '../middlewares/auth.middleware';

const requestRouter = express.Router();

/**
 * @swagger
 * tags:
 *   name: Requests
 *   description: API endpoints for managing client requests
 */

/**
 * @swagger
 * /api/request:
 *   post:
 *     summary: Create a new request (Client only)
 *     tags: [Requests]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - clientId
 *               - jobName
 *               - location
 *               - description
 *             properties:
 *               clientId:
 *                 type: string
 *                 description: The ID of the client making the request
 *               jobName:
 *                 type: string
 *                 description: The name of the job
 *               location:
 *                 type: string
 *                 description: The location where the service is required
 *               description:
 *                 type: string
 *                 description: Details about the requested service
 *     responses:
 *       201:
 *         description: The request was successfully created.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Request'
 *       400:
 *         description: Invalid input.
 *       401:
 *         description: Unauthorized.
 *       403:
 *         description: Forbidden. Requires Client role.
 *     x-roles:
 *       - Client
 */

/**
 * @swagger
 * /api/request/{id}:
 *   get:
 *     summary: Get a request by ID (Client)
 *     tags: [Requests]
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
 *         description: The requested request data.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Request'
 *       400:
 *         description: Invalid ID.
 *       401:
 *         description: Unauthorized.
 *       403:
 *         description: Forbidden. Requires Client or Admin role.
 *       404:
 *         description: Request not found.
 *     x-roles:
 *       - Client
 */

/**
 * @swagger
 * /api/request/{id}:
 *   patch:
 *     summary: Update a request by ID (Client only)
 *     tags: [Requests]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The request ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - clientId
 *               - jobName
 *               - location
 *               - description
 *             properties:
 *               clientId:
 *                 type: string
 *                 description: The ID of the client making the request
 *               jobName:
 *                 type: string
 *                 description: The name of the job
 *               location:
 *                 type: string
 *                 description: The location where the service is required
 *               description:
 *                 type: string
 *                 description: Details about the requested service
 *     responses:
 *       200:
 *         description: The updated request.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Request'
 *       400:
 *         description: Invalid input.
 *       401:
 *         description: Unauthorized.
 *       403:
 *         description: Forbidden. Requires Client role.
 *       404:
 *         description: Request not found.
 *     x-roles:
 *       - Client
 */

/**
 * @swagger
 * /api/request/{id}:
 *   delete:
 *     summary: Delete a request by ID (Client only)
 *     tags: [Requests]
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
 *       204:
 *         description: Request successfully deleted.
 *       400:
 *         description: Invalid ID.
 *       401:
 *         description: Unauthorized.
 *       403:
 *         description: Forbidden. Requires Client role.
 *       404:
 *         description: Request not found.
 *     x-roles:
 *       - Client
 */

/**
 * @swagger
 * /api/request/client/{clientId}:
 *   get:
 *     summary: Get requests by client ID (Client only)
 *     tags: [Requests]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: clientId
 *         schema:
 *           type: string
 *         required: true
 *         description: The client ID
 *     responses:
 *       200:
 *         description: A list of requests made by the client.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Request'
 *       400:
 *         description: Invalid client ID.
 *       401:
 *         description: Unauthorized.
 *       403:
 *         description: Forbidden. Requires Client role.
 *     x-roles:
 *       - Client
 */

/**
 * @swagger
 * /api/request:
 *   get:
 *     summary: Get all requests 
 *     tags: [Requests]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of all requests.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Request'
 *       401:
 *         description: Unauthorized.
 */

/**
 * @swagger
 * /api/request/client/{clientId}:
 *   delete:
 *     summary: Delete all requests by a client ID 
 *     tags: [Requests]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: clientId
 *         schema:
 *           type: string
 *         required: true
 *         description: The client ID
 *     responses:
 *       204:
 *         description: All requests by the client successfully deleted.
 *       400:
 *         description: Invalid client ID.
 *       401:
 *         description: Unauthorized.
 *       403:
 *         description: Forbidden. Requires the client role.
 *     x-roles:
 *       - Client
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Request:
 *       type: object
 *       required:
 *         - clientId
 *         - jobName
 *         - location
 *         - description
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated ID of the request
 *         clientId:
 *           type: string
 *           description: The ID of the client making the request
 *         jobName:
 *           type: string
 *           description: The name of the job
 *         location:
 *           type: string
 *           description: The location where the service is required
 *         description:
 *           type: string
 *           description: Details about the requested service
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The time the request was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: The time the request was last updated
 *       example:
 *         id: "60e76b9f9d2f8a2b5b8f845e"
 *         clientId: "60d6f9b2a68b9325e9b1c0c8"
 *         jobName: "Plumbing Repair"
 *         location: "123 Main St, Springfield"
 *         description: "Fix a leaky faucet in the kitchen"
 *         createdAt: "2023-09-20T15:03:23.000Z"
 *         updatedAt: "2023-09-20T15:03:23.000Z"
 */


requestRouter.post('/', authMiddleware,clientRoleoleMiddleware, requestController.createRequest);
requestRouter.get('/:id', authMiddleware,clientRoleoleMiddleware, requestController.getRequest);
requestRouter.patch('/:id', authMiddleware,clientRoleoleMiddleware, requestController.updateRequest);
requestRouter.delete('/:id', authMiddleware,clientRoleoleMiddleware, requestController.deleteRequest);
requestRouter.get('/client/:clientId', authMiddleware, clientRoleoleMiddleware, requestController.getRequestByClientId);
requestRouter.get('/', authMiddleware, requestController.getRequests);
requestRouter.delete('/client/:clientId', authMiddleware, clientRoleoleMiddleware, requestController.deleteRequestByClientId);

export default requestRouter;