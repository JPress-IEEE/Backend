import Notification ,{INotification} from "../models/notification.model";
import { NotificationSchema } from "../schemas/notification.schema";

export const createNotification = async (notification: INotification) => {};
export const getNotification = async (userId: string) => {};
export const updateNotification = async (notification: INotification) => {};
export const deleteNotification = async (notificationId: string) => {};
export const validateNotification = (notification: any) => {};
export const validateNotificationId = (notificationId: string) => {};
export const validateNotificationUpdate = (notification: any) => {};
export const validateNotificationDelete = (notificationId: string) => {};
export const validateNotificationGet = (userId: string) => {};
export const validateNotificationCreate = (notification: any) => {};

