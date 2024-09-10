import mongoose from 'mongoose';

export interface IRequest extends mongoose.Document {
    clientId: mongoose.Schema.Types.ObjectId,
    jobName: string,
    location: string,
    description: string,
    createdAt: Date,
    updatedAt: Date,
}

const RequestSchema = new mongoose.Schema({
    clientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Client',
        required: true
    },
    jobName: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    description: {
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

const Request = mongoose.model<IRequest>('Request', RequestSchema);
export default Request;