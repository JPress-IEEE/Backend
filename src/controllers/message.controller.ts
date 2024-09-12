import { Request, Response } from "express";

const createMessage = async (req: Request, res: Response): Promise<void> => {};

const getMessageForChat = async (req: Request, res: Response): Promise<void> => {};

const editMessage = async (req: Request, res: Response): Promise<void> => {};

const deleteMessage = async (req: Request, res: Response): Promise<void> => {};

const markMessageAsRead = async (req: Request, res: Response): Promise<void> => {};

export { createMessage, getMessageForChat, editMessage, deleteMessage, markMessageAsRead };
