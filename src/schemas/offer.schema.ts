import { request } from 'axios';
import { z } from 'zod';

export const OfferSchema = z.object({
    requesterId: z.string(),
    applicantId: z.string(),
    status: z.string(),
    price: z.number(),
    feedbackId: z.string(),
    createdAt: z.date().optional(),
    updatedAt: z.date().optional(),
});