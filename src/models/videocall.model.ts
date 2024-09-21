import mongoose, { Schema } from "mongoose";
import { IChat } from "./chat.model";

export interface IVideoCall extends mongoose.Document {
  chat_id: IChat["_id"];
  called: boolean;
  startTime?: Date;
  endTime: Date;
  callStatus: "pending" | "active" | "ended" | "missed";
}

const videoCallSchema = new Schema<IVideoCall>({
  chat_id: {
    type: Schema.Types.ObjectId,
    ref: "Chat",
    required: true,
  },
  called: {
    type: Boolean,
    default: false,
  },
  startTime: {
    type: Date,
    default: null,
  },
  endTime: {
    type: Date,
    default: null,
  },
  callStatus: {
    type: String,
    enum: ["pending", "active", "ended", "missed"],
    default: "pending",
  },
});

const VideoCall = mongoose.model<IVideoCall>("VideoCall", videoCallSchema)
export default VideoCall;