import { Server, Socket } from "socket.io";
import * as messageService from "../services/message.services";
import Chat from "../models/chat.model";
import Message from "../models/message.model";

const handleChatSockets = (io: Server) => {
  io.on("connection", (socket: Socket) => {
    console.log("User connected: ", socket.id);

    socket.on("joinChat", async (chatId: string, userId: string, callback?: (response: any) => void) => {
      try {
        const chat = await Chat.findById(chatId);
        if (!chat) return callback?.({ status: "error", message: "Chat not found" });

        const isParticipant = [String(chat.participant1_id), String(chat.participant2_id)].includes(userId);
        if (!isParticipant) return callback?.({ status: "error", message: "You are not a participant of this chat" });

        socket.join(chatId);
        console.log(`User ${socket.id} joined chat room: ${chatId}`);

        callback?.({ status: "success", message: `Joined chat room ${socket.id}` });
      } catch (error: any) {
        console.error(`Error joining chat ${chatId}:`, error.message);
        callback?.({ status: "error", message: "Internal server error" });
      }
    });

    socket.on("sendMessage", async (chatId: string, senderId: string, content: string, callback?: (response: any) => void) => {
      try {
        console.log(`User ${socket.id} is sending message to chat ${chatId}`);

        const message = await messageService.createMessage(chatId, senderId, content);
        io.to(chatId).emit("receiveMessage", message);
        console.log(`Message sent successfully to chat ${chatId}: `, message);

        callback?.({ status: "success", message });
      } catch (error: any) {
        console.error(`Error sending message in chat ${chatId}: `, error.message);
        socket.emit("errorMessage", error.message);
      }
    });

    socket.on("markMessageAsRead", async (messageId: string, callback?: (response: any) => void) => {
      try {
        const message = await Message.findByIdAndUpdate(messageId, { isRead: true }, { new: true });

        if (!message) {
          if (callback) callback({ status: "error", message: "Message not found" });
          return;
        }

        io.to(String(message.chat_id)).emit("messageRead", { messageId, isRead: true });

        if (callback) callback({ status: "success", message: `Message ${messageId} marked as read` });
      } catch (error: any) {
        console.error(`Error marking message ${messageId} as read:`, error.message);
        if (callback) callback({ status: "error", message: "Internal server error" });
      }
    });

    socket.on("disconnect", () => {
      console.log("User disconnected", socket.id);
    });
  });
};

export { handleChatSockets };
