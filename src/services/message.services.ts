import Message from "../models/message.model";
import { messageSchema } from "../schemas/message.schema";

const createMessage = async (chatId: string, senderId: string, content: string) => {
  const validationMessage = messageSchema.safeParse({ chat_id: chatId, sender_id: senderId, content });
  if (!validationMessage.success) throw new Error(validationMessage.error.issues[0]?.message || "Validation error");

  const message = new Message({
    chat_id: chatId,
    sender_id: senderId,
    content,
  });

  await message.save();
  return message;
};

const getMessageForChat = async (chatId: string) => {
  const messages = await Message.find({ chat_id: chatId }).populate("sender_id", "name").sort({ createdAt: "asc" });
  return messages;
};

const editMessage = async (messageId: string, newContent: string) => {
  const message = await Message.findByIdAndUpdate(messageId, { content: newContent }, { new: true });
  if (!message) throw new Error("Message not found");
  return message;
};

const deleteMessage = async (messageId: string) => {
  const message = await Message.findByIdAndDelete(messageId);
  if (!message) throw new Error("Message not found");

  return message;
};

const markMessageAsRead = async (messageId: string) => {
  const message = await Message.findByIdAndUpdate(messageId, { isRead: true }, { new: true });
  if (!message) throw new Error("Message not found");
  return message;
};

export { createMessage, getMessageForChat, editMessage, deleteMessage, markMessageAsRead };
