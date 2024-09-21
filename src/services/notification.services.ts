import Notification, { INotification } from "../models/notification.model";
import { NotificationSchema } from "../schemas/notification.schema";

export const createNotification = async (userId: string, message: string, status: string) => {
  const validationNotification = NotificationSchema.safeParse({
    userId,
    message,
    status,
    createdAt: new Date(),
    updatedAt: new Date(),
  });
  if (!validationNotification.success) throw new Error(validationNotification.error.issues[0]?.message || "Invalid data");

  const notification = new Notification({
    userId,
    message,
    status,
  });

  await notification.save();
  return notification;
};
export const getNotification = async (userId: string) => {
  const notifications = await Notification.find({ userId }).sort({ createdAt: "desc" });
  return notifications;
};
export const updateNotification = async (notificationId: string, status: string) => {
  const notification = await Notification.findByIdAndUpdate(notificationId, { status }, { new: true });
  if (!notification) throw new Error("Notification not found");

  return notification;
};
export const deleteNotification = async (notificationId: string) => {
  const notification = await Notification.findByIdAndDelete(notificationId);
  if (!notification) throw new Error("Notification not found");

  return notification;
};
// export const validateNotification = (notification: any) => {};
// export const validateNotificationId = (notificationId: string) => {};
// export const validateNotificationUpdate = (notification: any) => {};
// export const validateNotificationDelete = (notificationId: string) => {};
// export const validateNotificationGet = (userId: string) => {};
// export const validateNotificationCreate = (notification: any) => {};
