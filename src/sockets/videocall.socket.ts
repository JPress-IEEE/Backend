import { Server, Socket } from "socket.io";
import * as videocallService from "../services/videocall.services";

const handleVideoCallSockets = (io: Server) => {
  io.on("connection", (socket: Socket) => {
    console.log(`User connected for video call: ${socket.id}`);

    socket.on("joinVideoCall", (chatId: string) => {
      socket.join(chatId);
      console.log(`User ${socket.id} joined video call room: ${chatId}`);
    });

    socket.on("startCall", async (chatId: string) => {
      try {
        console.log(`User ${socket.id} is starting a video call for chat ${chatId}`);

        const call = await videocallService.startVideoCall(chatId);
        io.to(chatId).emit("callStarted: ", call);

        console.log(`Video call started for chat ${chatId}`);
      } catch (error: any) {
        console.error(`Error starting video call in chat ${chatId}: ${error.message}`);
        socket.emit("errorStartingCall", error.message);
      }
    });

    socket.on("endCall", async (chatId: string) => {
      try {
        console.log(`User ${socket.id} is ending a video call for chat ${chatId}`);

        const call = await videocallService.endVideoCall(chatId);
        io.to(chatId).emit("callEnded", call);

        console.log(`Video call ended for chat ${chatId}`);
      } catch (error: any) {
        console.error(`Error ending video call in chat ${chatId}: ${error.message}`);
        socket.emit("errorEndingCall", error.message);
      }
    });
  });
};

export { handleVideoCallSockets };
