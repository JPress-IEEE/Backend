import { NextFunction, Request, Response } from "express";
import * as notificationService from "../services/notification.services";

export const createNotification = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId, message, status } = req.body;
    const notification = await notificationService.createNotification(userId, message, status);
    res.status(201).json(notification);
  } catch (error: any) {
    // res.status(400).json({ message: error.message });
    next(error);
  }
};
export const getNotification = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId } = req.params;
    const notification = await notificationService.getNotification(userId);
    res.status(200).json(notification);
  } catch (error: any) {
    // res.status(404).json({ message: error.message });
    next(error);
  }
};
export const updateNotification = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { notificationId } = req.params;
    const { status } = req.body;
    const notification = await notificationService.updateNotification(notificationId, status);
    res.status(200).json(notification);
  } catch (error: any) {
    // res.status(400).json({ message: error.message });
    next(error);
  }
};
export const deleteNotification = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { notificationId } = req.params;
    await notificationService.deleteNotification(notificationId);
    res.status(204).send();
  } catch (error: any) {
    // res.status(400).json({ message: error.message });
    next(error);
  }
};
