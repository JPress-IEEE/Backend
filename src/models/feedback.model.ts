import mongoose from 'mongoose';
import { off } from 'process';
export interface IFeedback extends mongoose.Document {
    applicantId: mongoose.Schema.Types.ObjectId,
    clientId: mongoose.Schema.Types.ObjectId,
    offerId: mongoose.Schema.Types.ObjectId,
    rate: number,
    comment: string,
    createdAt: Date,
    updatedAt: Date,
}

const FeedbackSchema = new mongoose.Schema({
    applicantId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Applicant',
        required: true
    },
    clientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Client',
        required: true
    },
    offerId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Offer',
        required: true
    },
    rate: {
        type: Number,
        required: true
    },
    comment: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

const Feedback = mongoose.model<IFeedback>('Feedback', FeedbackSchema);
export default Feedback;