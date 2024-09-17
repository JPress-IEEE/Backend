import { Server, Socket } from "socket.io";
import * as messageService from "../services/message.services";

const handleChatSockets = (io: Server) => {
  io.on("connection", (socket: Socket) => {
    console.log("User connected: ", socket.id);

    socket.on("joinChat", (chatId: string) => {
      socket.join(chatId);
    });

    socket.on("sendMessage", async (chatId: string, senderId: string, content: string) => {
      try {
        const message = await messageService.createMessage(chatId, senderId, content);
        io.to(chatId).emit("receiveMessage", message);
      } catch (error: any) {
        socket.emit("errorMessage", error.message);
      }
    });

    socket.on("disconnect", () => {
      console.log("User disconnected", socket.id);
    });
  });
};

export { handleChatSockets };
