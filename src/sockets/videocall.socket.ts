import { Server, Socket } from "socket.io";
import * as videocallService from "../services/videocall.services";

const handleVideoCallSockets = (io: Server) => {
  io.on("connection", (socket: Socket) => {
    console.log(`User connected for video call: ${socket.id}`);

    socket.on("joinVideoCall", (chatId: string) => {
      socket.join(chatId);
      console.log(`User ${socket.id} joined video call room: ${chatId}`);
    });

    socket.on("requestCall", async (chatId: string, senderId: string, receiverId: string, callback?: (response: any) => void) => {
      try {
        console.log(`User ${senderId} is requesting a video call with user ${receiverId}`);

        const call = await videocallService.requestVideoCall(chatId, senderId, receiverId);

        io.to(receiverId).emit("incomingCall", {
          call,
          from: senderId,
          message: `User ${senderId} is requesting a video call. Accept or decline?`,
          callId: call._id,
        });

        callback?.({ status: "pending", call });
      } catch (error: any) {
        console.error(`Error requesting video call: ${error.message}`);
        callback?.({ status: "error", message: error.message });
      }
    });

    socket.on("acceptCall", async (chatId: string, receiverId: string, senderId: string, callback?: (response: any) => void) => {
      try {
        console.log(`User ${receiverId} accepted the video call from ${senderId}`);

        const call = await videocallService.acceptVideoCall(chatId, senderId, receiverId);

        io.to(chatId).emit("callAccepted", { call, message: `Video call started between ${senderId} and ${receiverId}` });

        callback?.({ status: "active", call });
      } catch (error: any) {
        console.error(`Error accepting video call: ${error.message}`);
        callback?.({ status: "error", message: error.message });
      }
    });

    socket.on("declineCall", async (chatId: string, receiverId: string, senderId: string, callback?: (response: any) => void) => {
      try {
        console.log(`User ${receiverId} declined the video call from ${senderId}`);

        const call = await videocallService.declineVideoCall(chatId, senderId, receiverId);

        io.to(chatId).emit("callDeclined", { call, message: `Video call declined by ${receiverId}` });

        callback?.({ status: "missed", call });
      } catch (error: any) {
        console.error(`Error declining video call: ${error.message}`);
        callback?.({ status: "error", message: error.message });
      }
    });
    socket.on("endCall", async (chatId: string, senderId: string, receiverId: string, callback?: (response: any) => void) => {
      try {
        console.log(`User ${senderId} is ending the video call with user ${receiverId}`);

        const call = await videocallService.endVideoCall(chatId, senderId, receiverId);

        io.to(chatId).emit("callEnded", { call, message: `Video call ended between ${senderId} and ${receiverId}` });

        callback?.({ status: "ended", call });
      } catch (error: any) {
        console.error(`Error ending video call: ${error.message}`);
        callback?.({ status: "error", message: error.message });
      }
    });

    socket.on("disconnect", () => {
      console.log("User disconnected from video call", socket.id);
    });
  });
};

export { handleVideoCallSockets };
