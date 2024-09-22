import { NextFunction, Request, Response } from "express";
import * as chatService from "../services/chat.services";
import * as messageService from "../services/message.services";
import { chatSchema } from "../schemas/chat.schema";

const createChat = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validationResult = chatSchema.safeParse(req.body);
    if (!validationResult.success) return res.status(400).json({ message: validationResult.error.issues[0].message });

    const { participant1_id, participant2_id } = validationResult.data;
    const chat = await chatService.createChat(participant1_id, participant2_id);
    res.status(201).json(chat);
  } catch (error: any) {
    next(error);
  }
};

const getChatMessages = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { chatId } = req.params;
    const chat = await chatService.getChatById(chatId);
    if (!chat) return res.status(404).json({ message: "Chat not found" });

    const messages = await messageService.getMessageForChat(chatId);
    if (messages.length === 0) return res.status(200).json([]);

    res.status(200).json(messages);
  } catch (error: any) {
    next(error);
  }
};

export { createChat, getChatMessages };
