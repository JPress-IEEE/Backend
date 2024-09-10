import mongoose from 'mongoose';
import { IRequest } from './request.model';
import Request from './request.model';

export interface IRecommendation extends mongoose.Document {
    requestId: mongoose.Schema.Types.ObjectId,
    applicants: { applicantId: mongoose.Schema.Types.ObjectId }[],
    createdAt: Date,
    updatedAt: Date,
}

const RecommendationSchema = new mongoose.Schema({
    requestId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Request',
        required: true
    },
    applicants: [
        {
            applicantId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Applicant',
                required: true
            }
        }
    ],
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

RecommendationSchema.pre('save', function (next) {
    this.updatedAt = new Date();
    next();
});

const Recommendation = mongoose.model<IRecommendation>('Recommendation', RecommendationSchema);
export default Recommendation;
