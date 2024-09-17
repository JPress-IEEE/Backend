import { Server, Socket } from "socket.io";
import * as videocallService from "../services/videocall.services";

const handleVideoCallSockets = (io: Server) => {
  io.on("connection", (socket: Socket) => {
    socket.on("startCall", async (chatId: string) => {
      const call = await videocallService.startVideoCall(chatId);
      io.to(chatId).emit("callStarted: ", call);
    });

    socket.on("endCall", async (chatId: string) => {
      const call = await videocallService.endVideoCall(chatId);
      io.to(chatId).emit("callEnded", call);
    });
  });
};

export { handleVideoCallSockets };
