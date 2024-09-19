import { Request, Response ,NextFunction } from 'express';
import * as clientServices from '../services/client.services';
import { IClient } from '../models/client.model';
import { ClientSchema } from '../schemas/client.schema';
import mongoose from 'mongoose';
import { ZodError } from 'zod';



export const createClient = async (req: Request, res: Response , next:NextFunction): Promise<void> => {
    try {
        const client: IClient = req.body;
        console.log (client);
        const validatedClient = await ClientSchema.parseAsync(client) as IClient;
        const result = await clientServices.createClient(validatedClient);
        res.status(201).json(result);
    } catch (err: any) {
        if(err instanceof ZodError){
            res.status(400).json({message: err.errors});
            return;
        }
       next(err);
    }
};

export const getClientById = async (req: Request, res: Response,next:NextFunction): Promise<void> => {
    try {
        const id = req.params.id as unknown as mongoose.Types.ObjectId;
        if (!id) {
            res.status(400).send({ error: 'Client id is required.' });
            return;
        }
        console.log(id);

        const userId = req.body.userId;
        console.log(userId);
        if (!userId) {
            res.status(400).send({ error: 'User id is required.' });
            return;
        }

        const clientId = await clientServices.getClientByUser(userId);
        console.log(clientId);
        if (!clientId) {
            res.status(404).json({ message: 'Client not found.' });
            return;
        }

        if ((clientId[0] as unknown as { _id: mongoose.Types.ObjectId })._id.toString() !== id.toString()) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }

        const result = await clientServices.getClientById(id.toString());
        res.status(200).json(result);
    } catch (err: any) {
        next(err);
    }
};


export const getClients = async (req: Request, res: Response,next:NextFunction): Promise<void> => {
    try {
        const queryString = req.query as unknown as string;
        const result = await clientServices.getClients(queryString);
        res.status(200).json(result);
    } catch (err: any) {
        next(err);
    }  
};

export const updateClient = async (req: Request, res: Response,next:NextFunction): Promise<void> => {
    try {
        const id = req.params.id as unknown as mongoose.Types.ObjectId;
        if(!id){
             res.status(400).send({error: 'Client id is required.'});
             return;
        }
        const clientId = await clientServices.getClientByUser(req.body.userId);
        if ((clientId[0] as unknown as { _id: mongoose.Types.ObjectId })._id.toString() !== id.toString()) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }
        const client: IClient = req.body;
        const validatedClient = await ClientSchema.parseAsync(client) as IClient;
        const result = await clientServices.updateClient(id.toString(), validatedClient);
        res.status(200).json(result);
    } catch (err: any) {
        next(err);
    }
};

export const deleteClient = async (req: Request, res: Response,next:NextFunction): Promise<void> => {
    try {
        const id = req.params.id as unknown as mongoose.Types.ObjectId;
        if(!id){
             res.status(400).send({error: 'Client id is required.'});
             return;
        }
        const clientId = await clientServices.getClientByUser(req.body.userId);
        if ((clientId[0] as unknown as { _id: mongoose.Types.ObjectId })._id.toString() !== id.toString()) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }
        const result = await clientServices.deleteClient(id.toString());
        res.status(200).json(result);
    } catch (err: any) {
        next(err);
    }
};

export const uploadImage = async (req: Request, res: Response,next:NextFunction): Promise<void> => {
    try {
        const id = req.params.id as unknown as mongoose.Types.ObjectId;
        console.log(id);
        
        if (!id) {
            res.status(400).send({ error: 'Client id is required.' });
            return;
        }

        const clientId = await clientServices.getClientByUser(req.body.userId);
        console.log(req.body.userId);
        
        if (!clientId || clientId.length === 0 || !clientId[0]._id) {
            res.status(404).json({ message: 'Client not found.' });
            return;
        }

        if ((clientId[0]._id as mongoose.Types.ObjectId).toString() !== id.toString()) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }

        if (!req.file) {
            res.status(400).send({ error: 'Profile picture is required.' });
            return;
        }

        const profilePic = req.file.filename as string;
        const result = await clientServices.uploadClientImage(id.toString(), profilePic);
        res.status(200).json(result);
        
    } catch (err: any) {
        next(err);
    }
};




