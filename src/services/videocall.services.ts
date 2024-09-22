import VideoCall from "../models/videocall.model";
import { videoCallSchema } from "../schemas/videocall.schema";

const requestVideoCall = async (chatId: string, senderId: string, receiverId: string) => {
  const validationVideoCall = videoCallSchema.safeParse({ chat_id: chatId });
  if (!validationVideoCall.success) throw new Error(validationVideoCall.error.issues[0]?.message);

  const videoCall = new VideoCall({
    chat_id: chatId,
    sender_id: senderId,
    receiver_id: receiverId,
    callStatus: "pending",
  });

  await videoCall.save();
  return videoCall;
};

const acceptVideoCall = async (chatId: string, senderId: string, receiverId: string) => {
  const validationVideoCall = videoCallSchema.safeParse({ chat_id: chatId });
  if (!validationVideoCall.success) throw new Error(validationVideoCall.error.issues[0]?.message);

  const videoCall = await VideoCall.findOneAndUpdate(
    { chat_id: chatId, sender_id: senderId, receiver_id: receiverId, callStatus: "pending" },
    { callStatus: "active", startTime: new Date() },
    { new: true }
  );

  if (!videoCall) throw new Error("Pending video call not found");
  return videoCall;
};

const declineVideoCall = async (chatId: string, senderId: string, receiverId: string) => {
  const validationVideoCall = videoCallSchema.safeParse({ chat_id: chatId });
  if (!validationVideoCall.success) throw new Error(validationVideoCall.error.issues[0]?.message);

  const videoCall = await VideoCall.findOneAndUpdate(
    { chat_id: chatId, sender_id: senderId, receiver_id: receiverId, callStatus: "pending" },
    { callStatus: "missed" },
    { new: true }
  );

  if (!videoCall) throw new Error("Pending video call not found");
  return videoCall;
};

const endVideoCall = async (chatId: string, senderId: string, receiverId: string) => {
  const validationVideoCall = videoCallSchema.safeParse({ chat_id: chatId });
  if (!validationVideoCall.success) throw new Error(validationVideoCall.error.issues[0]?.message);

  const videoCall = await VideoCall.findOneAndUpdate(
    { chat_id: chatId, sender_id: senderId, receiver_id: receiverId, callStatus: "active" },
    { callStatus: "ended", endTime: new Date() },
    { new: true }
  );

  if (!videoCall) throw new Error("Active video call not found");
  return videoCall;
};

export { requestVideoCall, acceptVideoCall, declineVideoCall, endVideoCall };
