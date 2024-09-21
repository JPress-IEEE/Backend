import { Request, Response } from "express";
import * as chatService from "../services/chat.services";
import * as messageService from "../services/message.services";

const createChat = async (req: Request, res: Response) => {
  try {
    const { participant1_id, participant2_id } = req.body;
    const chat = await chatService.createChat(participant1_id, participant2_id);
    res.status(201).json(chat);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

const getChatMessages = async (req: Request, res: Response) => {
  try {
    const { chatId } = req.params;
    const chat = await chatService.getChatById(chatId);
    if (!chat) return res.status(404).json({ message: "Chat not found" });

    const messages = await messageService.getMessageForChat(chatId);
    if (messages.length === 0) return res.status(200).json([]);

    res.status(200).json(messages);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export { createChat, getChatMessages };
