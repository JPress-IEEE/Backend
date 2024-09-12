import mongoose, { Schema } from "mongoose";
import { IChat } from "./chat.model";
import { IUser } from "./user.model";

export interface IMessage extends mongoose.Document {
  chat_id: IChat["_id"];
  sender_id: IUser["_id"];
  content: string;
  isRead: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const messageSchema = new Schema<IMessage>({
  chat_id: {
    type: Schema.Types.ObjectId,
    ref: "Chat",
    required: true,
  },
  sender_id: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  isRead: {
    type: Boolean,
    default: false,
  },
});

export const Message = mongoose.model<IMessage>("Message", messageSchema);
