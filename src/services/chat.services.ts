import Chat from "../models/chat.model";
import { chatSchema } from "../schemas/chat.schema";

const createChat = async (participant1_id: string, participant2_id: string) => {
  const validationChat = chatSchema.safeParse({ participant1_id, participant2_id });
  if (!validationChat.success) throw new Error(validationChat.error.message);

  const existingChat = await Chat.findOne({
    participant1_id,
    participant2_id,
  });

  if (existingChat) {
    return existingChat;
  }
  const newChat = new Chat({
    participant1_id,
    participant2_id,
  });

  await newChat.save();
  return newChat;
};

const getChatById = async (chatId: string) => {
  const chat = await Chat.findById(chatId).populate("participant1_id").populate("participant2_id");
  if (!chat) throw new Error("Chat not found");
  return chat;
};

export { createChat, getChatById };
