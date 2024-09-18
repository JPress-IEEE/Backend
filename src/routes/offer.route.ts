import * as offerController from '../controllers/offer.controller';
import { Router } from 'express';
import { authMiddleware, clientRoleoleMiddleware,applicantRoleMiddleware,adminRoleMiddleware } from '../middlewares/auth.middleware';

const offerRouter = Router();

offerRouter.post('/', authMiddleware, clientRoleoleMiddleware, offerController.createOffer);
offerRouter.get('/:offerId', authMiddleware,adminRoleMiddleware, offerController.getOfferById);
offerRouter.get('/applicant/:applicantId', authMiddleware,applicantRoleMiddleware, offerController.getOffersByApplicantId);
offerRouter.get('/request/:requestId', authMiddleware,clientRoleoleMiddleware, offerController.getOffersByRequestId);
offerRouter.get('/', authMiddleware,adminRoleMiddleware, offerController.getOffers);
offerRouter.put('/:offerId', authMiddleware, clientRoleoleMiddleware, offerController.updateOffer);
offerRouter.get('/request/:requestId/applicants', authMiddleware,clientRoleoleMiddleware, offerController.getApplicantsByRequestId);
offerRouter.delete('/:offerId', authMiddleware, clientRoleoleMiddleware, offerController.deleteOffer);
offerRouter.delete('/request/:requestId', authMiddleware, clientRoleoleMiddleware, offerController.deleteOfferByRequestId);
offerRouter.delete('/applicant/:applicantId', authMiddleware, applicantRoleMiddleware, offerController.deleteOfferByApplicantId);
offerRouter.put('/:offerId/select', authMiddleware, clientRoleoleMiddleware, offerController.selectOffer);

export default offerRouter;


