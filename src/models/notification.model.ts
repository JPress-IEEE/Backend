import mongoose from 'mongoose';
export interface INotification extends mongoose.Document {
    userId: string;
    message: string;
    status: string;
    createdAt: Date;
    updatedAt: Date;
}

const notificationSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    message: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true
    }
}, { timestamps: true });

const Notification = mongoose.model<INotification>('Notification', notificationSchema);
export default Notification;