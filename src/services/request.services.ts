import Request, { IRequest } from "../models/request.model";
import { RequestSchema } from "../schemas/request.schema";
import { APIFeatures } from "../utils/APIFeatures.utils";


export const createRequest = async (request: IRequest): Promise<IRequest> => {
    try {
        const newRequest = new Request(request);
        const result = await newRequest.save();
        return result;
    }
    catch (err: any) {
        throw err;
    }
};

export const getRequestById = async (requestId: string): Promise<IRequest | null> => {
    try {
        const result = await Request.findById(requestId);
        return result;
    }
    catch (err: any) {
        throw err;
    }
};

export const getRequests = async (query: any): Promise<IRequest[]> => {
    try {
        const features = new APIFeatures(Request.find(), query)
            .filter()
            .sort()
            .limitFields()
            .paginate();
        const result = await features.query;
        return result;
    } catch (err: any) {
        throw err;
    }
};


export const updateRequest = async (requestId: string, request: IRequest): Promise<IRequest | null> => {
    try {
        const result = await Request.findByIdAndUpdate(requestId, request, { new: true });
        return result;
    }
    catch (err: any) {
        throw err;
    }
};

export const deleteRequest = async (requestId: string): Promise<IRequest | null> => {
    try {
        const result = await Request.findByIdAndDelete(requestId);
        return result;
    }
    catch (err: any) {
        throw err;
    }

};

export const deleteRequestByClientId = async (clientId: string): Promise<IRequest | null> => {
    try {
        const result = await Request.findOneAndDelete({ clientId: clientId });
        return result;
    }
    catch (err: any) {
        throw err;
    }
};

export const getRequestsByClientId = async (clientId: string): Promise<IRequest[]> => {
    try {
        const result = await Request.find({ clientId: clientId });
        return result;
    }
    catch (err: any) {
        throw err;
    }
};

export const getClientIdFromRequestId = async (requestId: string): Promise<string> => {
    try {
        const result = await Request.findById(requestId);
        return result?.clientId as unknown as string;
    }
    catch (err: any) {
        throw err;
    }
};

