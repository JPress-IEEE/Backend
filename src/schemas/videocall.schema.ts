import { z } from "zod";

const videoCallSchema = z.object({
  chat_id: z.string().min(1, "Chat ID is required"),
  called: z.boolean().default(false),
  startTime: z.date().optional(),
  endTime: z.date().optional(),
  callStatus: z.enum(["pending", "active", "ended", "missed"]).default("pending"),
});

export { videoCallSchema };

export type VideoCallSchemaType = z.infer<typeof videoCallSchema>;
