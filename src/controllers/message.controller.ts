import { NextFunction, Request, Response } from "express";
import * as messageService from "../services/message.services";
import { messageSchema } from "../schemas/message.schema";

const createMessage = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { chatId, senderId, content } = req.body;

    const validationMessage = messageSchema.safeParse({ chat_id: chatId, sender_id: senderId, content });
    if (!validationMessage.success) return res.status(400).json({ message: validationMessage.error.issues[0].message });

    const message = await messageService.createMessage(chatId, senderId, content);
    res.status(201).json(message);
  } catch (error: any) {
    next(error);
  }
};

const getMessageForChat = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { chatId } = req.params;
    const message = await messageService.getMessageForChat(chatId);
    res.status(200).json(message);
  } catch (error: any) {
    next(error);
  }
};

const editMessage = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { messageId } = req.params;
    const { newContent } = req.body;
    const message = await messageService.editMessage(messageId, newContent);
    if (!message) return res.status(404).json({ message: "Message not found" });
    res.status(200).json(message);
  } catch (error: any) {
    next(error);
  }
};

const deleteMessage = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { messageId } = req.params;
    const message = await messageService.deleteMessage(messageId);
    if (!message) return res.status(404).json({ message: "Message not found" });
    res.status(204).json({ message: `${messageId} message is removed` });
  } catch (error: any) {
    next(error);
  }
};

const markMessageAsRead = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { messageId } = req.params;
    const message = await messageService.markMessageAsRead(messageId);
    if (!message) return res.status(404).json({ message: "Message not found" });
    res.status(200).json(message);
  } catch (error: any) {
    next(error);
  }
};

export { createMessage, getMessageForChat, editMessage, deleteMessage, markMessageAsRead };
