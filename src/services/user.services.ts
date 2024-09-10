import { verifyToken, generateToken, generateRefreshToken } from '../utils/jwt.utils'
import { User } from '../models/user.model';
import { IUser } from '../models/user.model';
import { userSchema } from '../schemas/user.schema';
import bcrypt from 'bcrypt';


export const createUser = async (user: IUser) => {
    try {
        let { email, name, password, role, profilePic } = user;
        let newUser = new User({ email, name, password, role, profilePic });

        const salt = await bcrypt.genSalt(10);
        newUser.password = await bcrypt.hash(newUser.password, salt);

        const userId: string = (newUser._id) as string;
        const refreshToken = generateRefreshToken(userId);
        newUser.refreshToken = refreshToken;
        await newUser.save();
        return newUser;
    }
    catch (err: any) {
        throw new Error(err.message);
    }
};

export const getUserById = async (id: string) => {
    try {
        return await User.findById(id);
    }
    catch (err: any) {
        throw new Error(err.message);
    }
}

export const getUserByEmail = async (email: string) => {
    try {
        return await User.findOne({ email: email });
    }
    catch (err: any) {
        throw new Error(err.message);
    }
}

export const deleteUser = async (id: string) => {
    try {
        return await User.findByIdAndDelete({ _id: id });
    } catch (err: any) {
        throw new Error(err.message);
    }
}

export const updateUser = async (id: string, params: Partial<IUser>): Promise<IUser> => {
    try {
        const user = await User.findByIdAndUpdate(id, params, { new: true, runValidators: true });

        if (!user) {
            throw new Error('User not found');
        }
        return user;
    } catch (err: any) {
        throw new Error(err.message || 'Error updating user');
    }
};
