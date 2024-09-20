import * as applicantController from '../controllers/applicant.controller';
import { Router } from 'express';
import   { resumeUpload, profilePicUpload } from '../utils/upload.utils';
import { authMiddleware, applicantRoleMiddleware ,adminRoleMiddleware} from '../middlewares/auth.middleware';
import { getApplicants,getApplicant,createApplicant,updateApplicant,deleteApplicant,uploadResume,uploadProfilePic } from '../controllers/applicant.controller';

const applicantRouter = Router();
/**
 * @swagger
 * tags:
 *   name: Applicants
 *   description: API for managing applicants
 */

/**
 * @swagger
 * /api/applicant:
 *   get:
 *     summary: Get all applicants
 *     tags: [Applicants]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved all applicants.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ApplicantResponse'
 *       401:
 *         description: Unauthorized, admin role required.
 *     x-roles: Admin
 */
applicantRouter.get('/', authMiddleware, adminRoleMiddleware, getApplicants);

/**
 * @swagger
 * /api/applicant/{id}:
 *   get:
 *     summary: Get an applicant by ID
 *     tags: [Applicants]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Applicant ID
 *     responses:
 *       200:
 *         description: Successfully retrieved the applicant.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApplicantResponse'
 *       401:
 *         description: Unauthorized, applicant role required.
 *       404:
 *         description: Applicant not found.
 *     x-roles: Applicant
 */
applicantRouter.get('/:id', authMiddleware, applicantRoleMiddleware, getApplicant);

/**
 * @swagger
 * /api/applicant:
 *   post:
 *     summary: Create a new applicant
 *     tags: [Applicants]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               resume:
 *                 type: string
 *                 format: binary
 *               location:
 *                 type: string
 *               summary:
 *                 type: string
 *               jobName:
 *                 type: string
 *     responses:
 *       201:
 *         description: Successfully created a new applicant.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApplicantResponse'
 *       400:
 *         description: Bad request, applicant data is invalid.
 *       401:
 *         description: Unauthorized, applicant role required.
 *     x-roles: Applicant
 */
applicantRouter.post('/', resumeUpload.single('resume'), authMiddleware, applicantRoleMiddleware, createApplicant);

/**
 * @swagger
 * /api/applicant/{id}:
 *   put:
 *     summary: Update an applicant by ID
 *     tags: [Applicants]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Applicant ID
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               resume:
 *                 type: string
 *                 format: binary
 *               location:
 *                 type: string
 *               summary:
 *                 type: string
 *               jobName:
 *                 type: string
 *     responses:
 *       200:
 *         description: Successfully updated the applicant.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApplicantResponse'
 *       400:
 *         description: Bad request, applicant data is invalid.
 *       401:
 *         description: Unauthorized, applicant role required.
 *       404:
 *         description: Applicant not found.
 *     x-roles: Applicant
 */
applicantRouter.put('/:id', resumeUpload.single('resume'), authMiddleware, applicantRoleMiddleware, updateApplicant);

/**
 * @swagger
 * /api/applicant/{id}:
 *   delete:
 *     summary: Delete an applicant by ID
 *     tags: [Applicants]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Applicant ID
 *     responses:
 *       200:
 *         description: Successfully deleted the applicant.
 *       401:
 *         description: Unauthorized, applicant role required.
 *       404:
 *         description: Applicant not found.
 *     x-roles: Applicant
 */
applicantRouter.delete('/:id', authMiddleware, applicantRoleMiddleware, deleteApplicant);
/**
 * @swagger
 * /api/applicant/{id}/resume:
 *   put:
 *     summary: Upload resume for an applicant
 *     tags: [Applicants]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Applicant ID
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               resume:
 *                 type: string
 *                 format: binary
 *                 description: Resume file to upload
 *     responses:
 *       200:
 *         description: Successfully uploaded the resume.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   description: ID of the applicant
 *                   example: "66ece1812a157969f61eb8f9"
 *                 resume:
 *                   type: string
 *                   description: Filename of the uploaded resume
 *                   example: "resume-1726854089121.pdf"
 *       400:
 *         description: Bad request, resume file is invalid.
 *       401:
 *         description: Unauthorized, applicant role required.
 *     x-roles: Applicant
 */

applicantRouter.put('/:id/resume', resumeUpload.single('resume'), authMiddleware, applicantRoleMiddleware, uploadResume);
/**
 * @swagger
 * /api/applicant/{id}/profile-pic:
 *   put:
 *     summary: Upload profile picture for an applicant
 *     tags: [Applicants]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Applicant ID
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               profilePic:
 *                 type: string
 *                 format: binary
 *                 description: Profile picture file to upload
 *     responses:
 *       200:
 *         description: Successfully uploaded the profile picture.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   description: ID of the applicant
 *                   example: "66ece1812a157969f61eb8f9"
 *                 profilePic:
 *                   type: string
 *                   description: Filename of the uploaded profile picture
 *                   example: "profile-pic-1726854089121.jpg"
 *       400:
 *         description: Bad request, profile picture file is invalid.
 *       401:
 *         description: Unauthorized, applicant role required.
 *     x-roles: Applicant
 */

applicantRouter.put('/:id/profile-pic', profilePicUpload.single('profilePic'), authMiddleware, applicantRoleMiddleware, uploadProfilePic);

/**
 * @swagger
 * components:
 *   schemas:
 *     ApplicantResponse:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         userId:
 *           type: string
 *         location:
 *           type: string
 *         summary:
 *           type: string
 *         jobName:
 *           type: string
 *         resume:
 *           type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */

export default applicantRouter;


