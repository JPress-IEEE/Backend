import Feedback, { IFeedback } from "../models/feedback.model";
import { FeedbackSchema } from "../schemas/feedback.schema";

export const createFeedback = async (applicantId: string, clientId: string, rate: number, comment: string) => {
  const validationFeedback = FeedbackSchema.safeParse({
    applicantId,
    clientId,
    rate,
    comment,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  if (!validationFeedback.success) throw new Error(validationFeedback.error.message);

  const feedback = new Feedback({
    applicantId,
    clientId,
    rate,
    comment,
  });

  await feedback.save();
  return feedback;
};

export const getFeedbackById = async (feedbackId: string) => {
  const feedback = await Feedback.findById(feedbackId);
  if (!feedback) throw new Error("Feedback not found");
  return feedback;
};

export const getFeedbacks = async () => {
  const feedbacks = await Feedback.find().sort({ createdAt: "desc" });
  return feedbacks;
};

export const updateFeedback = async (feedbackId: string, rate: number, comment: string) => {
  const feedback = await Feedback.findByIdAndUpdate(feedbackId, { rate, comment, updatedAt: new Date() }, { new: true });
  if (!feedback) throw new Error("Feedback not found");
  return feedback;
};

export const deleteFeedback = async (feedbackId: string) => {
  const feedback = await Feedback.findByIdAndDelete(feedbackId);
  if (!feedback) throw new Error("Feedback not found");
  return feedback;
};
