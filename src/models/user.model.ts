import mongoose from 'mongoose';

export interface IUser extends mongoose.Document {
    google_id?: string,
    linkedin_id?: string,
    facebook_id?: string,
    name: string;
    email: string;
    password: string;
    role: string;
    profilePic: string;
    isEmailVerified: boolean;
    refreshToken: string;
    createdAt: Date;
    updatedAt: Date;
}

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true
    },
    profilePic: {
        type: String,
        default: ''
    },
    isEmailVerified: {
        type: Boolean,
        default: false
    },
    refreshToken: {
        type: String,
        default: ''
    },
    google_id: {
        type: String,
        unique: true,
        sparse: true
    },
    linkedin_id: {
        type: String,
        unique: true,
        sparse: true
    },
    facebok_id: {
        type: String,
        unique: true,
        sparse: true
    }
}, { timestamps: true });
export const User = mongoose.model<IUser>('User', userSchema);