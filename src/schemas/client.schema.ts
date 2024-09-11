import {z} from 'zod';

export const ClientSchema = z.object({
    userId: z.string(),
});