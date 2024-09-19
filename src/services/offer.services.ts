import Applicant, { IApplicant } from '../models/applicant.model';
import Offer , {IOffer} from '../models/offer.model';
import { OfferSchema } from '../schemas/offer.schema';
import { APIFeatures } from '../utils/APIFeatures.utils';

export const createOffer = async (offer: IOffer): Promise<IOffer> => {
    try{
        const newOffer = new Offer(offer);
        const result = await newOffer.save();
        return result;
    }
    catch(err:any){
        throw err;
    }
};

export const getOfferById = async (offerId: string): Promise<IOffer | null> => {
    try{
        const result = await Offer.findById(offerId);
        return result;
    }
    catch(err:any){
        throw err;
    }
};

export const getOffersByApplicantId = async (applicantId: string): Promise<IOffer[]> => {
    try{
        const result = await Offer.find({applicantId:applicantId});
        return result;
    }
    catch(err:any){
        throw err;
    }
};
export const getOffersByRequestId = async (requestId: string): Promise<IOffer[]> => {
    try{
        const result = await Offer.find({requestId:requestId});
        return result;
    }
    catch(err:any){
        throw err;
    }
};

export const getOffers = async(queryString: string): Promise<APIFeatures<IOffer>> => {  
    try{
        const features = new APIFeatures<IOffer>(Offer.find(),queryString)
        .filter()
        .sort()
        .limitFields()
        .paginate();
        await features.query;
        return features;
    }
    catch(err:any){
        throw err;
    }
}

export const getApplicantsByRequestId = async (requestId: string) => {
    try {
        const offers = await Offer.find({ requestId })
            .populate({
                path: 'applicantId',
                model: Applicant, 
                populate: {
                    path: 'userId', 
                    select: 'name -_id',
                },
                select: 'location summary jobName -_id',
            })
            .exec();

        return offers;
    } catch (error: any) {
        throw new Error(`Error fetching applicants for request ${requestId}: ${error.message}`);
    }
};

export const selectOffer = async (offerId: string): Promise<IOffer | null> => {
    try{
        const result = await Offer.findByIdAndUpdate(offerId,{status:"selected"});
        return result;
    }
    catch(err:any){
        throw err;
    }
};

export const updateOffer = async (offerId: string, offer: IOffer): Promise<IOffer | null> => {
    try{
        const result = await Offer.findByIdAndUpdate(offerId,offer);
        return result;
    }
    catch(err:any){
        throw err;
    }
     
};

export const deleteOffer = async (offerId: string): Promise<IOffer | null> => {
    try{
        const result = await Offer.findByIdAndDelete(offerId);
        return result;
    }
    catch(err:any){
        throw err;
    }
     
};

export const deleteOfferByApplicantId = async (userId: string): Promise<IOffer | null> => {
    try{
        const result = await Offer.findOneAndDelete({applicantId:userId});
        return result;
    }
    catch(err:any){
        throw err;
    }     
};

export const deleteOfferByRequestId = async (requestId: string): Promise<IOffer | null> => {
    try{
        const result = await Offer.findOneAndDelete({requestId:requestId});
        return result;
    }
    catch(err:any){
        throw err;
    }
};

export const getRequestIdFromOfferId = async (offerId: string): Promise<string> => {
    try{
        const result = await Offer.findById(offerId);
        return result?.requestId as unknown as string;
    }
    catch(err:any){
        throw err;
    }
};