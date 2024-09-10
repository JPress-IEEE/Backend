import mongoose from 'mongoose';
import { User, IUser } from './user.model';


export interface IClient extends mongoose.Document {
    userId: IUser['_id'];
}


const clientSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
});

const Client = mongoose.model<IClient>('Client', clientSchema);

export default Client;