import * as bookmarkController from '../controllers/bookmark.controller';
import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth.middleware';

const bookmarkRouter = Router();
/**
 * @swagger
 * tags:
 *   name: Bookmarks
 *   description: Bookmark management for offers
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Bookmark:
 *       type: object
 *       required:
 *         - userId
 *         - offerId
 *       properties:
 *         _id:
 *           type: string
 *           description: Unique ID of the bookmark
 *         userId:
 *           type: string
 *           description: ID of the user creating the bookmark
 *         offerId:
 *           type: string
 *           description: ID of the offer being bookmarked
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Timestamp of when the bookmark was created
 */

/**
 * @swagger
 * /api/bookmark:
 *   post:
 *     summary: Create a new bookmark
 *     tags: [Bookmarks]
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
 *               - offerId
 *             properties:
 *               userId:
 *                 type: string
 *                 description: ID of the user creating the bookmark
 *               offerId:
 *                 type: string
 *                 description: ID of the offer to bookmark
 *     responses:
 *       201:
 *         description: Bookmark successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Bookmark'
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/bookmark/{id}:
 *   get:
 *     summary: Get bookmark by ID
 *     tags: [Bookmarks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The bookmark ID
 *     responses:
 *       200:
 *         description: Bookmark found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Bookmark'
 *       404:
 *         description: Bookmark not found
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/bookmark/user/{id}:
 *   get:
 *     summary: Get bookmarks by user ID
 *     tags: [Bookmarks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The user ID
 *     responses:
 *       200:
 *         description: List of bookmarks for the user
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Bookmark'
 *       404:
 *         description: Bookmarks not found
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/bookmark/{id}:
 *   delete:
 *     summary: Delete bookmark by ID
 *     tags: [Bookmarks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The bookmark ID
 *     responses:
 *       200:
 *         description: Bookmark successfully deleted
 *       404:
 *         description: Bookmark not found
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */


bookmarkRouter.post('/', authMiddleware, bookmarkController.createBookmark);
bookmarkRouter.get('/:id', authMiddleware, bookmarkController.getBookmarkById);
bookmarkRouter.get('/user/:id', authMiddleware, bookmarkController.getBookmarksByUserId);
bookmarkRouter.delete('/:id', authMiddleware, bookmarkController.deleteBookmark);

export default bookmarkRouter;

