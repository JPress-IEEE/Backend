import mongoose from 'mongoose';
import {  IRequest} from './request.model';
import Request from './request.model';

export interface IOffer extends mongoose.Document {
    requestId: mongoose.Schema.Types.ObjectId,
    applicantId: mongoose.Schema.Types.ObjectId,
    status: string,
    price: number,
    feedbackId: mongoose.Schema.Types.ObjectId,
    createdAt: Date,
    updatedAt: Date,
}

const OfferSchema = new mongoose.Schema({
    requestId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Request',
        required: true
    },
    applicantId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Applicant',
        required: true
    },
    status: {
        type: String,
        default: 'pending',
    },
    price: {
        type: Number,
        required: true
    },
    feedbackId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Feedback',
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

const Offer = mongoose.model<IOffer>('Offer', OfferSchema);
export default Offer;