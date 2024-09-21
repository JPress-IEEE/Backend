import mongoose, { Schema } from "mongoose";
import { IUser } from "./user.model";

export interface IChat extends mongoose.Document {
  participant1_id: IUser["_id"];
  participant2_id: IUser["_id"];
  createdAt: Date;
  updatedAt: Date;
}

const chatSchema = new Schema<IChat>(
  {
    participant1_id: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    participant2_id: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

const Chat = mongoose.model<IChat>("Chat", chatSchema);
export default Chat;
