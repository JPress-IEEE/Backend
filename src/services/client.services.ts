import Client,{IClient} from "../models/client.model";
import { ClientSchema } from "../schemas/client.schema";
import { APIFeatures } from "../utils/APIFeatures.utils";
import { User,IUser } from "../models/user.model";

export const createClient = async (client: IClient): Promise<IClient> => {

    try{
        const newClient = new Client(client);
        const result = await newClient.save();
        return result;
    }
    catch(err:any){
        throw err.message;
    }
};

export const getClientById = async (clientId: string): Promise<IClient | null> => {
    try{
        const result = await Client.findById(clientId);
        return result;
    }
    catch(err:any){
        throw err.message;
    }
};

export const getClients = async (queryString: string): Promise<IClient[]> => {
    try{
        const features = new APIFeatures(Client.find(), queryString)
        .filter()
        .sort()
        .limitFields()
        .paginate();
        const result = await features.query;
        return result;
    }
    catch(err:any){
        throw err.message;
    }
};

export const updateClient = async (clientId: string, client: IClient): Promise<IClient | null> => {
    try{
        const result = await Client.findByIdAndUpdate(clientId, client, {new: true});
        return result;
    }
    catch(err:any){
        throw err.message;
    }
};

export const deleteClient = async (clientId: string): Promise<IClient | null> => {
    try{
        const client = await Client.findByIdAndDelete(clientId);
        const user = await User.findByIdAndDelete(client?.userId as IUser["_id"]);
        return client;
    }
    catch(err:any){
        throw err.message;
    }
};

export const uploadClientImage = async (clientId: string, profilePic: string)=> {
    try {
        const userId = await Client.findById(clientId);
        const result = await User.findByIdAndUpdate(userId?.userId as IUser["_id"], { profilePic }, { new: true });
        return result;
    }
    catch (err: any) {
        throw err.message;
    }
};

export const getClientByUser = async(userId :string)=>{
    try{
        const result = await Client.find({userId});
        return result;
    }catch(err:any){
        throw err.message;
    }
}