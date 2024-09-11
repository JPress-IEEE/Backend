import { create } from 'axios';
import {z} from 'zod';

export const RequestSchema = z.object({
    clientId: z.string(),
    jobName: z.string(),
    location: z.string(),
    description: z.string().min(150),
    createdAt: z.date().optional(),
    updatedAt: z.date().optional(),
});