import Applicant, { IApplicant } from "../models/applicant.model";
import { ApplicantSchema } from "../schemas/applicant.schema";
import { APIFeatures } from "../utils/APIFeatures.utils";
import { User, IUser } from "../models/user.model";
import { deleteUser } from "./user.services";
import { FilterQuery } from "mongoose";
import { storeData } from "./recommendation.services";


export const createApplicant = async (applicant: IApplicant): Promise<IApplicant> => {
    try {
        const newApplicant = new Applicant(applicant);
        let result = await newApplicant.save();
        const id = result._id as string;
        const email = await getEmailByApplicantId(id) as string;
        const description = result.summary;
        await storeData(email, description);
        return result = await Applicant.populate(result, { path: 'userId', select: '-payoutAccountId -_id' });
    }
    catch (err: any) {
        throw err.message;
    }
};

export const getApplicantById = async (applicantId: string): Promise<IApplicant | null> => {
    try {
        let result = await Applicant.findById(applicantId);
        return result = await Applicant.populate(result, { path: 'userId', select: '-payoutAccountId -_id' });
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
        let result = await Applicant.findByIdAndUpdate(applicantId, applicant, { new: true });
        return result = await Applicant.populate(result, { path: 'userId', select: '-payoutAccountId -_id' });
    }
    catch (err: any) {
        throw err.message;
    }

};

export const deleteApplicant = async (applicantId: string): Promise<IApplicant | null> => {
    try {
        let applicant = await Applicant.findByIdAndDelete(applicantId);
        if (!applicant) {
            throw new Error('Applicant not found');
        }
        await deleteUser(applicant.userId as string);
        return applicant = await Applicant.populate(applicant, { path: 'userId', select: '-payoutAccountId -_id' });
    }
    catch (err: any) {
        console.log("Error deleting applicant:", err.message);
        throw new Error(err.message);
    }
};

export const uploadResume = async (applicantId: string, resume: string) => {
    try {
        let result = await Applicant.findByIdAndUpdate(applicantId, { resume }, { new: true });
        return {
            _id: result?._id,
            resume: result?.resume!
        }
    }
    catch (err: any) {
        throw err.message;
    }
};

export const uploadProfilePic = async (applicantId: string, profilePic: string) => {
    try {
        const applicant = await Applicant.findById(applicantId);
        if (!applicant) {
            throw new Error('Applicant not found.');
        }
        let updatedUser = await User.findByIdAndUpdate(
            applicant.userId as IUser["_id"],
            { profilePic },
            { new: true }
        );
        if (!updatedUser) {
            throw new Error('User not found or update failed.');
        }
        return {
            _id: updatedUser?._id,
            profilePic: updatedUser?.profilePic!
        }

    } catch (err: any) {
        console.error(err);
        throw new Error(err.message || 'An error occurred while uploading the profile picture.');
    }
};


export const getApplicantByUserId = async (userId: string): Promise<IApplicant | null> => {
    try {
        let result = await Applicant.findOne({ userId });
        return result = await Applicant.populate(result, { path: 'userId', select: '-payoutAccountId -_id' });
    }
    catch (err: any) {
        throw err.message;
    }
};

export const getApplicantByJobName = async (jobName: string): Promise<IApplicant[]> => {
    try {
        let result = await Applicant.find({ jobName });
        return result = await Applicant.populate(result, { path: 'userId', select: '-payoutAccountId -_id' });
    }
    catch (err: any) {
        throw err.message;
    }
};

export const getApplicantByLocation = async (location: string): Promise<IApplicant[]> => {
    try {
        let result = await Applicant.find({ location });
        return result = await Applicant.populate(result, { path: 'userId', select: '-payoutAccountId -_id' });
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

export const getEmailByApplicantId = async (applicantId: string): Promise<string | null> => {
    try {
        const applicant = await Applicant.findById(applicantId);
        if (!applicant) {
            throw new Error('Applicant not found');
        }
        const user = await User.findById(applicant.userId);
        if (!user) {
            throw new Error('User not found');
        }
        return user.email;
    }
    catch (err: any) {
        throw err.message;
    }
};

export const getUserIdByApplicantId = async (applicantId: string) => {
    try {
        const applicant = await Applicant.findById(applicantId);
        if (!applicant) {
            throw new Error('Applicant not found');
        }
        return applicant.userId;
    }
    catch (err: any) {
        throw err.message;
    }
};