import {z} from 'zod';

export const FeedbackSchema = z.object({
  applicantId: z.string(),
    clientId: z.string(),
    rate: z.number().min(1).max(5),
    comment: z.string().min(1),
    createdAt: z.date().optional(),
    updatedAt: z.date().optional(),
});
