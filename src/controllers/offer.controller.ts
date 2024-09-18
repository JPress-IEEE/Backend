import { Request, Response,NextFunction } from 'express';
import * as offerServices from '../services/offer.services';
import { IOffer } from '../models/offer.model';
import {OfferSchema} from '../schemas/offer.schema';
import { ZodError } from 'zod';
import * as requsetServices from '../services/request.services';


export const createOffer = async (req: Request, res: Response,next:NextFunction) => {
    try{
        const offer = req.body as IOffer;
        const validatedOffer = await OfferSchema.parseAsync(offer) as unknown as IOffer;
        const result = await offerServices.createOffer(validatedOffer);
        res.status(201).send(result);
    }
    catch(err:any){
        if(err instanceof ZodError){
            res.status(400).send(err.errors);
            return;
        }
        next(err);
    }
};

export const getOfferById = async (req: Request, res: Response,next:NextFunction) => {
    try{
        const offerId = req.params.offerId;
        const result = await offerServices.getOfferById(offerId);
        if(!result){
            res.status(404).send({message:'Offer not found'});
            return;
        }
        res.status(200).send(result);
    }
    catch(err:any){
        next(err);
    }
};

export const getOffersByApplicantId = async (req: Request, res: Response,next:NextFunction) => {
    try{
        const id = req.body.userId;
        const applicantId = req.params.applicantId;
        if(id !== applicantId){
            res.status(403).send({message:'Unauthorized'});
            return;
        }
        const result = await offerServices.getOffersByApplicantId(applicantId);
        res.status(200).send(result);
    }
    catch(err:any){
        next(err);
    }
};

export const getOffersByRequestId = async (req: Request, res: Response,next:NextFunction) => {
    try{
        const clientId = req.body.userId;
        const requestClientId =await  requsetServices.getClientIdFromRequestId(req.params.requestId);
        if(clientId !== requestClientId){
            res.status(403).send({message:'Unauthorized'});
            return;
        }
        const requestId = req.params.requestId;
        const result = await offerServices.getOffersByRequestId(requestId);
        res.status(200).send(result);
    }
    catch(err:any){
        next(err);
    }
};

export const getOffers = async (req: Request, res: Response,next:NextFunction) => {
    try{
        const queryString = req.query as unknown as string;
        const result = await offerServices.getOffers(queryString);
        res.status(200).send(result);
    }
    catch(err:any){
        next(err);
    }
};

export const getApplicantsByRequestId = async (req: Request, res: Response,next:NextFunction) => {
    try{
        const requestId = req.params.requestId;
        const clientId = req.body.userId;
        const requestClientId =await  requsetServices.getClientIdFromRequestId(requestId);
        if(clientId !== requestClientId){
            res.status(403).send({message:'Unauthorized'});
            return;
        }
        const result = await offerServices.getApplicantsByRequestId(requestId);
        res.status(200).send(result);
    }
    catch(err:any){
        next(err);
    }
};

export const updateOffer = async (req: Request, res: Response,next:NextFunction) => {
    try{
        const offerId = req.params.offerId;
        const id = req.body.userId;
        const requestId = await offerServices.getRequestIdFromOfferId(offerId);
        const clientId = await requsetServices.getClientIdFromRequestId(requestId);
        if(id !== clientId){
            res.status(403).send({message:'Unauthorized'});
            return;
        }
        const offer = req.body as IOffer;
        const validatedOffer = await OfferSchema.parseAsync(offer) as unknown as IOffer;
        const result = await offerServices.updateOffer(offerId,validatedOffer);
        if(!result){
            res.status(404).send({message:'Offer not found'});
            return;
        }
        res.status(200).send(result);
    }
    catch(err:any){
        if(err instanceof ZodError){
            res.status(400).send(err.errors);
            return;
        }
        next(err);
    }
};

export const deleteOffer = async (req: Request, res: Response,next:NextFunction) => {
    try{
        const id = req.body.userId;
        const requestId = await offerServices.getRequestIdFromOfferId(req.params.offerId);
        const clientId = await requsetServices.getClientIdFromRequestId(requestId);
        if(id !== clientId){
            res.status(403).send({message:'Unauthorized'});
            return;
        }
        const offerId = req.params.offerId;
        const result = await offerServices.deleteOffer(offerId);
        if(!result){
            res.status(404).send({message:'Offer not found'});
            return;
        }
        res.status(204).send();
    }
    catch(err:any){
        next(err);
    }
};

export const selectOffer = async (req: Request, res: Response,next:NextFunction) => {
    try{
        const offerId = req.params.offerId;
        const result = await offerServices.selectOffer(offerId);
        if(!result){
            res.status(404).send({message:'Offer not found'});
            return;
        }
        res.status(200).send(result);
    }
    catch(err:any){
        next(err);
    }
};

export const deleteOfferByApplicantId = async (req: Request, res: Response,next:NextFunction) => {
    try{
        const userId = req.params.userId;
        const applicantId = req.body.userId;
        if(userId !== applicantId){
            res.status(403).send({message:'Unauthorized'});
            return;
        }
        const result = await offerServices.deleteOfferByApplicantId(userId);
        if(!result){
            res.status(404).send({message:'Offer not found'});
            return;
        }
        res.status(204).send();
    }
    catch(err:any){
        next(err);
    }
};

export const deleteOfferByRequestId = async (req: Request, res: Response,next:NextFunction) => {
    try{
        const clientId = req.body.userId;
        const requestClientId = await requsetServices.getClientIdFromRequestId(req.params.requestId);
        if(clientId !== requestClientId){
            res.status(403).send({message:'Unauthorized'});
            return;
        }
        const requestId = req.params.requestId;
        const result = await offerServices.deleteOfferByRequestId(requestId);
        if(!result){
            res.status(404).send({message:'Offer not found'});
            return;
        }
        res.status(204).send();
    }
    catch(err:any){
        next(err);
    }
};


