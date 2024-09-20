import { Request, Response,NextFunction } from 'express';
import * as offerServices from '../services/offer.services';
import { IOffer } from '../models/offer.model';
import {OfferSchema} from '../schemas/offer.schema';
import { ZodError } from 'zod';
import * as requsetServices from '../services/request.services';
import {getUserIdByApplicantId} from '../services/applicant.services';
import { getUserByClient} from '../services/client.services';
import c from 'config';


export const createOffer = async (req: Request, res: Response,next:NextFunction) => {
    try{
        const offer = req.body as IOffer;
        let validatedOffer = await OfferSchema.parseAsync(offer) as unknown as IOffer;
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
        const userId = req.body.userId;
        console.log(req.params.applicantId);
        const id =await getUserIdByApplicantId(req.params.applicantId);
        console.log(id);
        console.log(userId);
        if(userId !== (id?.toString())){    
            res.status(403).send({message:'Unauthorized'});
            return;
        };
        const applicantId = req.params.applicantId;
        const result = await offerServices.getOffersByApplicantId(applicantId);
        res.status(200).send(result);
    }
    catch(err:any){
        next(err);
    }
};

export const getOffersByRequestId = async (req: Request, res: Response,next:NextFunction) => {
    try{
        const userId = req.body.userId;
        const clientId = await requsetServices.getClientIdFromRequestId(req.params.requestId);
        const id= await getUserByClient(clientId);
        if(userId !== (id?.toString())){
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
        const userId = req.body.userId;
        const requestClientId =await  requsetServices.getClientIdFromRequestId(requestId);
        const clientId = await getUserByClient(requestClientId);
        if(userId !== (clientId?.toString())){
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
        const offer = req.body as IOffer;
        const validatedOffer = await OfferSchema.parseAsync(offer) as unknown as IOffer;
        const result = await offerServices.updateOffer(offerId,validatedOffer);
        if(!result){
            res.status(404).send({message:'Offer not found'});
            return;
        }
        const userId = await getUserIdByApplicantId(result.applicantId.toString());
        if(id !== userId?.toString()){
            res.status(403).send({message:'Unauthorized'});
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
        const userId = await getUserByClient(clientId);
        if(id !== userId?.toString()){
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
        const applicantId = req.params.userId;
        const userId = req.body.userId;
        const id = await getUserIdByApplicantId(userId);  
        if(userId !== (id?.toString())){
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
        const userId = req.body.userId;
        const clientId = await requsetServices.getClientIdFromRequestId(req.params.requestId);
        const id = await getUserByClient(clientId);
        if(userId !== (id?.toString())){
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


