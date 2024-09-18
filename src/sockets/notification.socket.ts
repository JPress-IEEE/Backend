import { Server, Socket } from "socket.io";
import * as notificationService from "../services/notification.services";

const handleNotificationSocket = (io: Server) => {
  io.on("connection", (socket: Socket) => {
    console.log(`User connected for notification ${socket.id}`);

    socket.on("joinNotifications", (userId: string) => {
      socket.join(userId);
      console.log(`User ${socket.id} joined notification room ${userId}`);
    });

    socket.on("newNotification", async (userId: string, message: string, status: string) => {
      try {
        console.log(`New notification for user ${userId}: ${message} (${status})`);

        const notification = await notificationService.createNotification(userId, message, status);
        io.to(userId).emit("receiveNotification", notification);

        console.log(`Notification sent to user ${userId}`);
      } catch (error: any) {
        console.error(`Error sending notification to user ${userId}: ${error.message}`);
        socket.emit("errorNotification", { message: error.message });
      }
    });

    socket.on("disconnect", () => {
      console.log("User disconnected from notifications", socket.id);
    });
  });
};

export { handleNotificationSocket };
