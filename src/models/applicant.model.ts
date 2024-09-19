import mongoose from 'mongoose';
import { User, IUser } from './user.model';
import {  IOffer } from './offer.model';


export interface IApplicant extends mongoose.Document {
    userId: IUser['_id'],
    resume: string,
    location: string,
    summary: string,
    jobName: string,
    payoutAccountId: string,
}

const ApplicantSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    resume: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    summary: {
        type: String,
        required: true
    },
    jobName: {
        type: String,
        required: true
    },
    payoutAccountId: {
        type: String,
        required: false
    }
});

const Applicant = mongoose.model<IApplicant>('Applicant', ApplicantSchema);
export default Applicant;