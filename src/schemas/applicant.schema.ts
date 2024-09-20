import {z} from 'zod';

export const ApplicantSchema = z.object({
    userId: z.string(),
    resume: z.string(),
    location: z.string(),
    summary: z.string(),
    jobName: z.string(),
    payoutAccountId: z.string().optional()
});