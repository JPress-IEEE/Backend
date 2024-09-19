import { Request, Response } from 'express';
import * as clientServices from '../services/client.services';
import { IClient } from '../models/client.model';
import { ClientSchema } from '../schemas/client.schema';



export const createClient = async (req: Request, res: Response): Promise<void> => {
    try {
        const client: IClient = req.body;
        const validatedClient = await ClientSchema.parseAsync(client) as IClient;
        const result = await clientServices.createClient(validatedClient);
        res.status(201).json(result);
    } catch (err: any) {
        res.status(400).json({ message: err.message });
    }
};

export const getClientById = async (req: Request, res: Response): Promise<void> => {
    try {
        const id = req.body.userId;
        const clientId = req.params.id;
        if (clientId !== id) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }
        const result = await clientServices.getClientById(clientId);
        res.status(200).json(result);
    } catch (err: any) {
        res.status(400).json({ message: err.message });
    }
    
};

export const getClients = async (req: Request, res: Response): Promise<void> => {
    try {
        const queryString = req.query as unknown as string;
        const result = await clientServices.getClients(queryString);
        res.status(200).json(result);
    } catch (err: any) {
        res.status(400).json({ message: err.message });
    }  
};

export const updateClient = async (req: Request, res: Response): Promise<void> => {
    try {
        const id = req.body.userId;
        const clientId = req.params.id;
        if(clientId !== id){
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }
        const client: IClient = req.body;
        const validatedClient = await ClientSchema.parseAsync(client) as IClient;
        const result = await clientServices.updateClient(clientId, validatedClient);
        res.status(200).json(result);
    } catch (err: any) {
        res.status(400).json({ message: err.message });
    }
};

export const deleteClient = async (req: Request, res: Response): Promise<void> => {
    try {
        const id = req.body.userId;
        const clientId = req.params.id;
        if(clientId !== id){
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }   
        const result = await clientServices.deleteClient(clientId);
        res.status(200).json(result);
    } catch (err: any) {
        res.status(400).json({ message: err.message });
    }
};

export  const uploadImage = async (req: Request, res: Response): Promise<void> => {
    try {
        const id = req.body.userId;
        const clientId = req.params.id;
        if(clientId !== id){
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }
        const client: IClient = req.body;
        const result = await clientServices.uploadClientImage(clientId, clientId);
        res.status(200).json(result);
    } catch (err: any) {
        res.status(400).json({ message: err.message });
    }
};



