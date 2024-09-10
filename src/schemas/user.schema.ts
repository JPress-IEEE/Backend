import {z} from 'zod';

export const userSchema = z.object({
    name: z.string().min(3).max(255),
    email: z.string().email(),
    password: z.string().min(6),
    role: z.string().min(3).max(255),
    profilePic: z.string().optional(),
    isEmailVerified: z.boolean().default(false),
    refreshToken: z.string().optional(),
    createdAt: z.date().optional(),
    updatedAt: z.date().optional(),
    google_id:z.string().optional(),
    facebok_id:z.string().optional(),
    linkedin_id:z.string().optional(),
});