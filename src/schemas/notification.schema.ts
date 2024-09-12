import {z} from 'zod';

export const NotificationSchema = z.object({
    userId: z.string(),
    message: z.string(),
    status: z.string(),
    createdAt: z.date(),
    updatedAt: z.date()
});

export type Notification = z.infer<typeof NotificationSchema>;