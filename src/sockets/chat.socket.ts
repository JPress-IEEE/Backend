import { Server, Socket } from "socket.io";
import * as messageService from "../services/message.services";

const handleChatSockets = (io: Server) => {
  io.on("connection", (socket: Socket) => {
    console.log("User connected: ", socket.id);

    socket.on("joinChat", (chatId: string) => {
      socket.join(chatId);
      console.log(`user ${socket.id} joined chat room: ${chatId}`);
    });

    socket.on("sendMessage", async (chatId: string, senderId: string, content: string, callback) => {
      try {
        console.log(`User ${socket.id} is sending message to chat ${chatId}`);

        const message = await messageService.createMessage(chatId, senderId, content);
        io.to(chatId).emit("receiveMessage", message);
        console.log(`Message sent successfully to chat ${chatId}: `, message);

        callback({ status: "success", message });
      } catch (error: any) {
        console.error(`Error sending message in chat ${chatId}: `, error.message);
        socket.emit("errorMessage", error.message);
      }
    });

    socket.on("disconnect", () => {
      console.log("User disconnected", socket.id);
    });
  });
};

export { handleChatSockets };
