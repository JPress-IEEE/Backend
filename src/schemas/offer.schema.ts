import { request } from 'axios';
import { z } from 'zod';

export const OfferSchema = z.object({
    requestId: z.string(),
    applicantId: z.string(),
    status: z.string().optional(),
    price: z.number(),
    feedbackId: z.string().optional(),
    createdAt: z.date().optional(),
    updatedAt: z.date().optional(),
});