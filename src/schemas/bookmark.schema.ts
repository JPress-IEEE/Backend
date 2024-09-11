import {z} from 'zod';

export const BookmarkSchema = z.object({
    userId: z.string(),
    offerId: z.string(),
    createdAt: z.date().optional(),
});
