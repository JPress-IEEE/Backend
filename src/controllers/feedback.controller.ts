import { Request, Response } from "express";
import * as feedbackService from "../services/feedback.services";
import { Schema } from "mongoose";
import { getUserByClient} from "../services/client.services";


export const createFeedback = async (req: Request, res: Response) => {
  try {
    const { applicantId, clientId,offerId, rate, comment } = req.body;
    const feedback = await feedbackService.createFeedback(applicantId, clientId,offerId, rate, comment);
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

export const getFeedbacksByApplicantId = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const feedbacks = await feedbackService.getFeedbacksByApplicantId(id);
    res.status(200).json(feedbacks);
  } catch (error: any) {
    res.status(404).json({ message: error.message });
  }
};

export const updateFeedback = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.body.userId;
    const oldFeedback = await feedbackService.getFeedbackById(id);  
    const clientId = oldFeedback.clientId?.toString();
    const clientUser= await getUserByClient(clientId);
    if(clientUser?.toString() !== userId){
      throw new Error("Unauthorized");
    }
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
    const userId = req.body.userId;
    const feedback = await feedbackService.getFeedbackById(id);
    const clientId = feedback.clientId?.toString();
    const clientUser= await getUserByClient(clientId);
    if(clientUser?.toString() !== userId){
      throw new Error("Unauthorized");
    }
    await feedbackService.deleteFeedback(id);
    res.status(204).send();
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};
