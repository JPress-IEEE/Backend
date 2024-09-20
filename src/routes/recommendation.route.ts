import * as recommendationController from '../controllers/recommendation.controller';
import { Router } from 'express';
import { adminRoleMiddleware,authMiddleware } from '../middlewares/auth.middleware';


const recommendationRouter = Router();

recommendationRouter.get('/:id',authMiddleware, recommendationController.getRecommendationById);
recommendationRouter.get('/request/:id',authMiddleware, recommendationController.getRecommendationByRequestId);
recommendationRouter.post('/ai',authMiddleware, recommendationController.getAIRecommendation);
export default recommendationRouter;

