import * as notificationService from '../services/notification.services';
import { Request, Response } from 'express';
import { INotification } from '../models/notification.model';
import { validateNotificationCreate, validateNotificationDelete, validateNotificationGet, validateNotificationUpdate } from '../services/notification.services';

export const createNotification = async (req: Request, res: Response) => {};
export const getNotification = async (req: Request, res: Response) => {};
export const updateNotification = async (req: Request, res: Response) => {};
export const deleteNotification = async (req: Request, res: Response) => {};


