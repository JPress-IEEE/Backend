import express from 'express';
import * as requestController from '../controllers/request.controller';
import { authMiddleware , clientRoleoleMiddleware,adminRoleMiddleware} from '../middlewares/auth.middleware';

const requestRouter = express.Router();

requestRouter.post('/', authMiddleware,clientRoleoleMiddleware, requestController.createRequest);
requestRouter.get('/:id', authMiddleware,clientRoleoleMiddleware, requestController.getRequest);
requestRouter.patch('/:id', authMiddleware,clientRoleoleMiddleware, requestController.updateRequest);
requestRouter.delete('/:id', authMiddleware,clientRoleoleMiddleware, requestController.deleteRequest);
requestRouter.get('/client/:clientId', authMiddleware, clientRoleoleMiddleware, requestController.getRequestByClientId);
requestRouter.get('/', authMiddleware, requestController.getRequests);
requestRouter.delete('/client/:clientId', authMiddleware, clientRoleoleMiddleware, requestController.deleteRequestByClientId);

export default requestRouter;