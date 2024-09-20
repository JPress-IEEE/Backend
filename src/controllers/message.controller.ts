import { NextFunction, Request, Response } from "express";
import * as messageService from "../services/message.services";

const createMessage = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { chatId, senderId, content } = req.body;
    const message = await messageService.createMessage(chatId, senderId, content);
    res.status(201).json(message);
  } catch (error: any) {
    // res.status(400).json({ message: error.message });
    next(error);
  }
};

const getMessageForChat = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { chatId } = req.params;
    const message = await messageService.getMessageForChat(chatId);
    res.status(200).json(message);
  } catch (error: any) {
    // res.status(404).json({ message: error.message });
    next(error);
  }
};

const editMessage = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { messageId } = req.params;
    const { newContent } = req.body;
    const message = await messageService.editMessage(messageId, newContent);
    res.status(200).json(message);
  } catch (error: any) {
    // res.status(400).json({ message: error.message });
    next(error);
  }
};

const deleteMessage = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { messageId } = req.params;
    await messageService.deleteMessage(messageId);
    res.status(204).json({ message: `${messageId} message is removed` });
  } catch (error: any) {
    // res.status(400).json({ message: error.message });
    next(error);
  }
};

const markMessageAsRead = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { messageId } = req.params;
    const message = await messageService.markMessageAsRead(messageId);
    res.status(200).json(message);
  } catch (error: any) {
    // res.status(400).json({ message: error.message });
    next(error);
  }
};

export { createMessage, getMessageForChat, editMessage, deleteMessage, markMessageAsRead };
