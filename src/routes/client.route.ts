import * as clientController from '../controllers/client.controller';
import { createClient,getClientById,updateClient,deleteClient,getClients } from '../controllers/client.controller';
import { Router } from 'express';
import { adminRoleMiddleware, authMiddleware,clientRoleoleMiddleware } from '../middlewares/auth.middleware';
import   {profilePicUpload } from '../utils/upload.utils';
import { uploadImage } from '../controllers/client.controller';

const clientRouter = Router();
/**
 * @swagger
 * tags:
 *   name: Clients
 *   description: Client management endpoints
 */

/**
 * @swagger
 * /api/client:
 *   post:
 *     summary: Create a new client
 *     tags: [Clients]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *                 example: "64f0c2e53f4931abdc73f1e2"
 *     responses:
 *       201:
 *         description: Successfully created a new client
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Client'
 *       400:
 *         description: Bad request (validation errors)
 *       401:
 *         description: Unauthorized (client role required)
 */

/**
 * @swagger
 * /api/client/{id}:
 *   get:
 *     summary: Get a client by ID
 *     tags: [Clients]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Client ID
 *     responses:
 *       200:
 *         description: Successfully fetched the client details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Client'
 *       400:
 *         description: Invalid ID supplied
 *       404:
 *         description: Client not found
 */

/**
 * @swagger
 * /api/client/{id}:
 *   put:
 *     summary: Update a client by ID
 *     tags: [Clients]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Client ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *                 example: "64f0c2e53f4931abdc73f1e2"
 *     responses:
 *       200:
 *         description: Successfully updated the client
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Client'
 *       400:
 *         description: Bad request (validation errors)
 *       401:
 *         description: Unauthorized (client role required)
 */

/**
 * @swagger
 * /api/client/{id}:
 *   delete:
 *     summary: Delete a client by ID
 *     tags: [Clients]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Client ID
 *     responses:
 *       200:
 *         description: Successfully deleted the client
 *       400:
 *         description: Invalid ID supplied
 *       404:
 *         description: Client not found
 */

/**
 * @swagger
 * /api/client:
 *   get:
 *     summary: Get a list of clients
 *     tags: [Clients]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved list of clients
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Client'
 *       401:
 *         description: Unauthorized (admin role required)
 */
/**
 * @swagger
 * /api/client/{id}/profile-pic:
 *   post:
 *     summary: Upload a profile picture for a client
 *     tags: [Clients]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Client ID
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               profilePic:
 *                 type: string
 *                 format: binary
 *                 description: The profile picture file to upload
 *     responses:
 *       200:
 *         description: Successfully uploaded the profile picture
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   description: User ID
 *                   example: "64f0c2e53f4931abdc73f1e2"
 *                 profilePic:
 *                   type: string
 *                   description: File name of the uploaded profile picture
 *                   example: "profile-pic-123.png"
 *       400:
 *         description: Invalid request (e.g., missing client ID or profile picture)
 *       401:
 *         description: Unauthorized (client role required)
 *       404:
 *         description: Client not found
 */


/**
 * @swagger
 * components:
 *   schemas:
 *     Client:
 *       type: object
 *       required:
 *         - userId
 *       properties:
 *         _id:
 *           type: string
 *           description: Client ID
 *           example: "64f0c2e53f4931abdc73f1e2"
 *         userId:
 *           type: string
 *           description: User ID associated with the client
 *           example: "64f0c2e53f4931abdc73f1e2"
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */



clientRouter.post('/', authMiddleware, clientRoleoleMiddleware, createClient);
clientRouter.get('/:id', authMiddleware,clientRoleoleMiddleware, getClientById);
clientRouter.put('/:id', authMiddleware, clientRoleoleMiddleware,updateClient);
clientRouter.delete('/:id', authMiddleware, clientRoleoleMiddleware, deleteClient);
clientRouter.get('/', authMiddleware,adminRoleMiddleware, getClients);
clientRouter.post('/:id/profile-pic',profilePicUpload.single('profilePic'), authMiddleware, clientRoleoleMiddleware,uploadImage);
export default clientRouter;
