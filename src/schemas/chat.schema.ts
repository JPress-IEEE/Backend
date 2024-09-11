import { z } from "zod";

const chatSchema = z.object({
  participant1_id: z.string().min(1, "Participant 1 is required"),
  participant2_id: z.string().min(1, "Participant 2 is required"),
});

export { chatSchema };
export type ChatSchemaType = z.infer<typeof chatSchema>;
