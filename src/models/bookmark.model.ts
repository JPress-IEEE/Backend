import mongoose from 'mongoose';

export interface IBookmark extends mongoose.Document {
    userId: mongoose.Schema.Types.ObjectId; 
    offerId: mongoose.Schema.Types.ObjectId; 
    createdAt: Date;
}

const BookmarkSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', 
        required: true
    },
    offerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Offer', 
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

BookmarkSchema.index({ userId: 1, offerId: 1 }, { unique: true });

const Bookmark = mongoose.model<IBookmark>('Bookmark', BookmarkSchema);
export default Bookmark;
