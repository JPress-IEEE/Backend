import * as clientController from '../controllers/client.controller';
import { Router } from 'express';
import { adminRoleMiddleware, authMiddleware,clientRoleoleMiddleware } from '../middlewares/auth.middleware';
import   {profilePicUpload } from '../utils/upload.utils';
import { uploadImage } from '../controllers/client.controller';

const clientRouter = Router();

clientRouter.post('/', authMiddleware, clientRoleoleMiddleware, clientController.createClient);
clientRouter.get('/:id', authMiddleware,clientRoleoleMiddleware, clientController.getClientById);
clientRouter.put('/:id', authMiddleware, clientRoleoleMiddleware, clientController.updateClient);
clientRouter.delete('/:id', authMiddleware, clientRoleoleMiddleware, clientController.deleteClient);
clientRouter.get('/', authMiddleware,adminRoleMiddleware, clientController.getClients);
clientRouter.post('/:id/profile-pic', authMiddleware, clientRoleoleMiddleware, profilePicUpload.single('profilePic'),uploadImage);
export default clientRouter;
