import { Request, Response } from "express";
import * as videoCallService from "../services/videocall.services";

const startVideoCall = async (req: Request, res: Response) => {
  try {
    const { chatId } = req.body;
    const call = await videoCallService.startVideoCall(chatId);
    res.status(201).json(call);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

const endVideoCall = async (req: Request, res: Response) => {
  try {
    const { chatId } = req.params;
    const call = await videoCallService.endVideoCall(chatId);
    res.status(200).json(call);
  } catch (error: any) {
    res.status(404).json({ message: error.message });
  }
};

export { startVideoCall, endVideoCall };
