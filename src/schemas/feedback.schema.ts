import {z} from 'zod';

export const FeedbackSchema = z.object({
  applicantId: z.string(),
    clientId: z.string(),
    rate: z.number(),
    comment: z.string(),
    createdAt: z.date().optional(),
    updatedAt: z.date().optional(),
});