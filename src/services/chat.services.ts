import Chat from "../models/chat.model";
import { chatSchema } from "../schemas/chat.schema";

const createChat = async (participant1_id: string, participant2_id: string) => {
  try {
    const validationChat = chatSchema.safeParse({ participant1_id, participant2_id });
    if (!validationChat.success) throw new Error(validationChat.error.issues[0].message || "Invalid chat data");

    const existingChat = await Chat.findOne({
      $or: [
        { participant1_id, participant2_id },
        { participant1_id: participant2_id, participant2_id: participant1_id },
      ],
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
  } catch (error: any) {
    throw new Error(error.message);
  }
};

const getChatById = async (chatId: string) => {
  try {
    const chat = await Chat.findById(chatId).populate("participant1_id").populate("participant2_id");
    if (!chat) throw new Error("Chat not found");
    return chat;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export { createChat, getChatById };
