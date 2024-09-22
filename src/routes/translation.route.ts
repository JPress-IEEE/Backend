import express from 'express';
import { translate } from '../controllers/translation.controller';

const translationRouter = express.Router();
/**
 * @swagger
 * tags:
 *   name: Translation
 *   description: Translation related endpoints
 */

/**
 * @swagger
 * /api/translation/translate:
 *   post:
 *     summary: Translate text
 *     description: Translates the provided text to English.
 *     tags: [Translation]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               text:
 *                 type: string
 *                 description: The text to be translated.
 *             required:
 *               - text
 *     responses:
 *       200:
 *         description: Translated text
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 Translated text:
 *                   type: string
 *       400:
 *         description: Bad request, text is required
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message
 */


translationRouter.post('/translate', translate);

export default translationRouter;