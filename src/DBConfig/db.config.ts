import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const dbConnect = async() =>{
    try {
        await mongoose.connect(process.env.MONGO_URI ||'', {
        });
        console.log('Database connected');
    } catch (error) {
        console.log(error);
        console.log('Database connection failed');
    }
}
const dbDisconnect = async() =>{
    try {
        await mongoose.disconnect();
        console.log('Database disconnected');
    } catch (error) {
        console.log('Database disconnection failed');
    }
}
export {dbConnect, dbDisconnect};
