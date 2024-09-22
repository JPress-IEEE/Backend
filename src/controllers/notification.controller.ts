import { NextFunction, Request, Response } from "express";
import * as notificationService from "../services/notification.services";
import { NotificationSchema } from "../schemas/notification.schema";

export const createNotification = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId, message, status } = req.body;

    const validationResult = NotificationSchema.safeParse({
      userId,
      message,
      status,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    if (!validationResult.success) {
      return res.status(400).json({ message: validationResult.error.issues[0]?.message || "Invalid data" });
    }

    const notification = await notificationService.createNotification(userId, message, status);
    res.status(201).json(notification);
  } catch (error: any) {
    if (error instanceof Error) {
      return res.status(500).json({ message: error.message });
    }
    next(error);
  }
};
export const getNotification = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId } = req.query as { userId: string }; 

    const notifications = await notificationService.getNotification(userId);

    res.status(200).json(notifications);
  } catch (error: any) {
    if (error instanceof Error) {
      return res.status(500).json({ message: error.message });
    }
    next(error);
  }
};
export const updateNotification = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { notificationId } = req.body;
    const { status } = req.body;

    const notification = await notificationService.updateNotification(notificationId, status);

    if (!notification) return res.status(404).json({ message: "Notification not found" });

    res.status(200).json(notification);
  } catch (error: any) {
    if (error instanceof Error) {
      return res.status(500).json({ message: error.message });
    }
    next(error);
  }
};
export const deleteNotification = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { notificationId } = req.body;

    const deletedNotification = await notificationService.deleteNotification(notificationId);

    if (!deletedNotification) return res.status(404).json({ message: "Notification not found" });

    res.status(204).send();
  } catch (error: any) {
    if (error instanceof Error) {
      return res.status(500).json({ message: error.message });
    }
    next(error);
  }
};
