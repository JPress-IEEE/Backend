import Applicant, { IApplicant } from "../models/applicant.model";
import { ApplicantSchema } from "../schemas/applicant.schema";
import { APIFeatures } from "../utils/APIFeatures.utils";
import { User, IUser } from "../models/user.model";
import { deleteUser } from "./user.services";
import { FilterQuery } from "mongoose";


export const createApplicant = async (applicant: IApplicant): Promise<IApplicant> => {
    try {
        const newApplicant = new Applicant(applicant);
        const result = await newApplicant.save();
        return result;
    }
    catch (err: any) {
        throw err.message;
    }
};

export const getApplicantById = async (applicantId: string): Promise<IApplicant | null> => {
    try {
        const result = await Applicant.findById(applicantId);
        return result;
    }
    catch (err: any) {
        throw err.message;
    }

};

export const getApplicants = async (queryString: string): Promise<IApplicant[]> => {
    try {
        const features = new APIFeatures(Applicant.find(), queryString)
            .filter()
            .sort()
            .limitFields()
            .paginate();
        let result = await features.query;
        result = await Applicant.populate(result, { path: 'userId', select: '-payoutAccountId -_id' });
        return result;
    }
    catch (err: any) {
        throw err.message;
    }
};

export const updateApplicant = async (applicantId: string, applicant: IApplicant): Promise<IApplicant | null> => {
    try {
        const result = await Applicant.findByIdAndUpdate(applicantId, applicant, { new: true });
        return result;
    }
    catch (err: any) {
        throw err.message;
    }

};

export const deleteApplicant = async (applicantId: string): Promise<IApplicant | null> => {
    try {
        const applicant = await Applicant.findByIdAndDelete(applicantId);
        if (!applicant) {
            throw new Error('Applicant not found');
        }
        await deleteUser(applicant.userId as string);
        return applicant;
    }
    catch (err: any) {
        console.log("Error deleting applicant:", err.message);
        throw new Error(err.message);
    }
};

export const uploadResume = async (applicantId: string, resume: string): Promise<IApplicant | null> => {
    try {
        const result = await Applicant.findByIdAndUpdate(applicantId, { resume }, { new: true });
        return result;
    }
    catch (err: any) {
        throw err.message;
    }
};

export const uploadProfilePic = async (applicantId: string, profilePic: string): Promise<IUser | null> => {
    try {
        const userId = await Applicant.findById(applicantId);
        const result = await User.findByIdAndUpdate(userId?.userId as IUser["_id"], { profilePic }, { new: true });
        return result;
    }
    catch (err: any) {
        throw err.message;
    }
};

export const getApplicantByUserId = async (userId: string): Promise<IApplicant | null> => {
    try {
        const result = await Applicant.findOne({ userId });
        return result;
    }
    catch (err: any) {
        throw err.message;
    }
};

export const getApplicantByJobName = async (jobName: string): Promise<IApplicant[]> => {
    try {
        const result = await Applicant.find({ jobName });
        return result;
    }
    catch (err: any) {
        throw err.message;
    }
};

export const getApplicantByLocation = async (location: string): Promise<IApplicant[]> => {
    try {
        const result = await Applicant.find({ location });
        return result;
    }
    catch (err: any) {
        throw err.message;
    }
};

export const getApplicantByPayoutAccountId = async (payoutAccountId: string): Promise<IApplicant | null> => {

    try {
        const result = await Applicant.findOne({ payoutAccountId });
        return result;
    }
    catch (err: any) {
        throw err.message;
    }
}
