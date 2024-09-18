import { Request, Response ,NextFunction} from 'express';
import { IRequest } from '../models/request.model';
import * as requestService from '../services/request.services';
import { RequestSchema } from '../schemas/request.schema';
import { ZodError } from 'zod';
import { getClientIdFromRequestId } from '../services/request.services';

export const createRequest = async (req: Request, res: Response, next:NextFunction) => {
    try {
        const request = req.body as IRequest;
        const validatedRequest = await RequestSchema.parseAsync(request) as unknown as IRequest;
        const newRequest = await requestService.createRequest(validatedRequest);
        res.status(201).json(newRequest);
    } catch (err:any) {
        if (err instanceof ZodError) {
            res.status(400).json(err.errors);
            return;
        }else{
            next(err);
        }
    }
};

export const getRequest = async (req: Request, res: Response, next:NextFunction) => {
    try {
        const id = req.body.userId;
        const clientId = await getClientIdFromRequestId(req.params.id);
        if (id !== clientId) {
            res.status(403).send({ message: 'Unauthorized' });
            return;
        }
        const request = await requestService.getRequestById(req.params.id);
        res.status(200).json(request);
    } catch (err:any) {
        next(err);
    }
};

export const updateRequest = async (req: Request, res: Response, next:NextFunction) => {
    try {
        const id = req.body.userId;
        const clientId = await getClientIdFromRequestId(req.params.id);
        if (id !== clientId) {
            res.status(403).send({ message: 'Unauthorized' });
            return;
        }
        const request = req.body as IRequest;
        const validatedRequest = await RequestSchema.parseAsync(request) as unknown as IRequest;    
        const updatedRequest = await requestService.updateRequest(req.params.id, validatedRequest);
        res.status(200).json(updatedRequest);
    } catch (err:any) {
        if (err instanceof ZodError) {
            res.status(400).json(err.errors);
            return;
        }else{
            next(err);
        }
    }
};

export const deleteRequest = async (req: Request, res: Response, next:NextFunction) => {
    try {
        const id = req.body.userId;
        const clientId = await getClientIdFromRequestId(req.params.id);
        if (id !== clientId) {
            res.status(403).send({ message: 'Unauthorized' });
            return;
        }
        await requestService.deleteRequest(req.params.id);
        res.status(204).end();
    } catch (err:any) {
        next(err);
    }
};

export const getRequestByClientId = async (req: Request, res: Response, next:NextFunction) => {
    try {
        const id = req.body.userId;
        if (id !== req.params.clientId) {
            res.status(403).send({ message: 'Unauthorized' });
            return;
        }
        const requests = await requestService.getRequestsByClientId(req.params.clientId);
        res.status(200).json(requests);
    } catch (err:any) {
        next(err);
    }
};

export const getRequests = async (req: Request, res: Response, next:NextFunction) => {
    try {
        const requests = await requestService.getRequests(JSON.stringify(req.query));
        res.status(200).json(requests);
    } catch (err:any) {
        next(err);
    }
};

export const deleteRequestByClientId = async (req: Request, res: Response, next:NextFunction) => {
    try {
        const id = req.body.userId;
        if (id !== req.params.clientId) {
            res.status(403).send({ message: 'Unauthorized' });
            return;
        }
        await requestService.deleteRequestByClientId(req.params.clientId);
        res.status(204).end();
    } catch (err:any) {
        next(err);
    }
};



