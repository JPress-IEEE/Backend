import { z } from "zod";

const messageSchema = z.object({
  chat_id: z.string().min(1, "Chat ID is required"),
  sender_id: z.string().min(1, "Sender ID is required"),
  content: z.string().min(1, "Content cannot be empty"),
  isRead: z.boolean().default(false),
});

export { messageSchema };

export type MessageSchemaType = z.infer<typeof messageSchema>;
