import VideoCall from "../models/videocall.model";
import { videoCallSchema } from "../schemas/videocall.schema";

const startVideoCall = async (chatId: string) => {
  const validationVideoCall = videoCallSchema.safeParse({ chat_id: chatId });
  if (!validationVideoCall.success) throw new Error(validationVideoCall.error.message);

  const videoCall = new VideoCall({
    chat_id: chatId,
    called: true,
    startTime: new Date(),
    callStatus: "active",
  });

  await videoCall.save();
  return videoCall;
};

const endVideoCall = async (chatId: string) => {
  const videocall = await VideoCall.findByIdAndUpdate(
    { chat_id: chatId, callStatus: "active" },
    { callStatus: "ended", endTime: new Date() },
    { new: true }
  );

  if (!videocall) throw new Error("Active video call not found");
  return videocall;
};

export { startVideoCall, endVideoCall };
