import { NextFunction, Request, Response } from "express";
import * as videoCallService from "../services/videocall.services";

const requestCall = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { chatId, senderId, receiverId } = req.body;

    if (!chatId || !senderId || !receiverId) {
      res.status(400).json({ message: "Chat ID, sender ID, and receiver ID are required" });
    }

    const call = await videoCallService.requestVideoCall(chatId, senderId, receiverId);
    res.status(201).json(call);
  } catch (error: any) {
    next(error)
  }
};

const acceptCall = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { chatId, senderId, receiverId } = req.body;

    if (!chatId || !senderId || !receiverId) {
      res.status(400).json({ message: "Chat ID, sender ID, and receiver ID are required" });
    }

    const call = await videoCallService.acceptVideoCall(chatId, senderId, receiverId);
    if (!call) return res.status(404).json({ message: "Pending video call not found" });

    res.status(200).json(call);
  } catch (error: any) {
    if (error.message === "Pending video call not found") {
      return res.status(404).json({ message: error.message });
    }
    next(error)
  }
};

const declineCall = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { chatId, senderId, receiverId } = req.body;

    if (!chatId || !senderId || !receiverId) {
      res.status(400).json({ message: "Chat ID, sender ID, and receiver ID are required" });
    }

    const call = await videoCallService.declineVideoCall(chatId, senderId, receiverId);
    if (!call) return res.status(404).json({ message: "Pending video call not found" });

    res.status(200).json(call);
  } catch (error: any) {
    if (error.message === "Pending video call not found") {
      return res.status(404).json({ message: error.message });
    }
    next(error)
  }
};

const endVideoCall = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { chatId, senderId, receiverId } = req.body;

    if (!chatId || !senderId || !receiverId) {
      res.status(400).json({ message: "Chat ID, sender ID, and receiver ID are required" });
    }

    const call = await videoCallService.endVideoCall(chatId, senderId, receiverId);
    if (!call) return res.status(404).json({ message: "Active video call not found" });

    res.status(200).json(call);
  } catch (error: any) {
    if (error.message === "Active video call not found") {
      return res.status(404).json({ message: error.message });
    }
    next(error)
  }
};

export { requestCall, acceptCall, declineCall, endVideoCall };
