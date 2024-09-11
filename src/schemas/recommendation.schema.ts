import { request } from 'axios';
import {z} from 'zod';

export const RecommendationSchema = z.object({
    requesterId: z.string(),
    applicants: z.array(z.string()),
    createdAt: z.date().optional(),
    updatedAt: z.date().optional(),
});