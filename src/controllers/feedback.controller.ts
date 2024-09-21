import { Request, Response } from "express";
import * as feedbackService from "../services/feedback.services";

export const createFeedback = async (req: Request, res: Response) => {
  try {
    const { applicantId, clientId, rate, comment } = req.body;
    const feedback = await feedbackService.createFeedback(applicantId, clientId, rate, comment);
    res.status(201).json(feedback);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const getFeedbackById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const feedback = await feedbackService.getFeedbackById(id);
    res.status(200).json(feedback);
  } catch (error: any) {
    res.status(404).json({ message: error.message });
  }
};

export const getFeedbacks = async (req: Request, res: Response) => {
  try {
    const feedbacks = await feedbackService.getFeedbacks();
    res.status(200).json(feedbacks);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const updateFeedback = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { rate, comment } = req.body;
    const feedback = await feedbackService.updateFeedback(id, rate, comment);
    res.status(200).json(feedback);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteFeedback = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await feedbackService.deleteFeedback(id);
    res.status(204).send();
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};
