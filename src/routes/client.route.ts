import * as clientController from '../controllers/client.controller';
import { createClient,getClientById,updateClient,deleteClient,getClients } from '../controllers/client.controller';
import { Router } from 'express';
import { adminRoleMiddleware, authMiddleware,clientRoleoleMiddleware } from '../middlewares/auth.middleware';
import   {profilePicUpload } from '../utils/upload.utils';
import { uploadImage } from '../controllers/client.controller';

const clientRouter = Router();

clientRouter.post('/', authMiddleware, clientRoleoleMiddleware, createClient);
clientRouter.get('/:id', authMiddleware,clientRoleoleMiddleware, getClientById);
clientRouter.put('/:id', authMiddleware, clientRoleoleMiddleware,updateClient);
clientRouter.delete('/:id', authMiddleware, clientRoleoleMiddleware, deleteClient);
clientRouter.get('/', authMiddleware,adminRoleMiddleware, getClients);
clientRouter.post('/:id/profile-pic',profilePicUpload.single('profilePic'), authMiddleware, clientRoleoleMiddleware,uploadImage);
export default clientRouter;
