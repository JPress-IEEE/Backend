import request from "supertest";
import express from "express";
import notificationRouter from "../routes/notification.route";
import * as notificationService from "../services/notification.services";
import { NotificationSchema } from "../schemas/notification.schema";
import { ErrorHandler } from "../middlewares/generalErrorHandler";

jest.mock("../services/notification.services", () => ({
  createNotification: jest.fn(),
  getNotification: jest.fn(),
  updateNotification: jest.fn(),
  deleteNotification: jest.fn(),
}));

jest.mock("../schemas/notification.schema", () => ({
  NotificationSchema: {
    safeParse: jest.fn(),
  },
}));

const app = express();
app.use(express.json());
app.use("/api/notifications", notificationRouter);
app.use(ErrorHandler);

describe("Notification Routes", () => {
  describe("POST /api/notifications/create", () => {
    it("should create a notification", async () => {
      const mockNotification = { _id: "notif1", userId: "user1", message: "New message", status: "unread" };
      (NotificationSchema.safeParse as jest.Mock).mockReturnValue({ success: true });
      (notificationService.createNotification as jest.Mock).mockResolvedValue(mockNotification);

      const res = await request(app).post("/api/notifications/create").send({
        userId: "user1",
        message: "New message",
        status: "unread",
      });

      expect(res.status).toBe(201);
      expect(res.body).toEqual(mockNotification);
    });

    it("should return 400 for invalid input", async () => {
      (NotificationSchema.safeParse as jest.Mock).mockReturnValue({
        success: false,
        error: { issues: [{ message: "Invalid data" }] },
      });

      const res = await request(app).post("/api/notifications/create").send({});

      expect(res.status).toBe(400);
      expect(res.body).toEqual({ message: "Invalid data" });
    });

    it("should handle service errors gracefully", async () => {
      (NotificationSchema.safeParse as jest.Mock).mockReturnValue({ success: true });
      (notificationService.createNotification as jest.Mock).mockRejectedValue(new Error("Internal server error"));

      const res = await request(app).post("/api/notifications/create").send({
        userId: "user1",
        message: "New message",
        status: "unread",
      });

      expect(notificationService.createNotification).toHaveBeenCalledWith("user1", "New message", "unread");
      expect(res.status).toBe(500);
      expect(res.body).toEqual({ message: "Internal server error" });
    });
  });

  describe("GET /api/notifications/get", () => {
    it("should get notifications for a user", async () => {
      const mockNotifications = [{ _id: "notif1", userId: "user1", message: "New message", status: "unread" }];
      (notificationService.getNotification as jest.Mock).mockResolvedValue(mockNotifications);

      const res = await request(app).get("/api/notifications/get").query({ userId: "user1" });

      expect(res.status).toBe(200);
      expect(res.body).toEqual(mockNotifications);
    });

    it("should return an empty array if no notifications are found", async () => {
      (notificationService.getNotification as jest.Mock).mockResolvedValue([]);

      const res = await request(app).get("/api/notifications/get").query({ userId: "user1" });

      expect(res.status).toBe(200);
      expect(res.body).toEqual([]);
    });

    it("should handle service errors gracefully", async () => {
      (notificationService.getNotification as jest.Mock).mockRejectedValue(new Error("Internal server error"));

      const res = await request(app).get("/api/notifications/get").query({ userId: "user1" });

      expect(res.status).toBe(500);
      expect(res.body).toEqual({ message: "Internal server error" });
    });
  });

  describe("PUT /api/notifications/update", () => {
    it("should update a notification's status", async () => {
      const mockNotification = { _id: "notif1", status: "read" };
      (notificationService.updateNotification as jest.Mock).mockResolvedValue(mockNotification);

      const res = await request(app).put("/api/notifications/update").send({ notificationId: "notif1", status: "read" });

      expect(res.status).toBe(200);
      expect(res.body).toEqual(mockNotification);
    });

    it("should return 404 if notification is not found", async () => {
      (notificationService.updateNotification as jest.Mock).mockResolvedValue(null);

      const res = await request(app).put("/api/notifications/update").send({ notificationId: "notif1", status: "read" });

      expect(res.status).toBe(404);
      expect(res.body).toEqual({ message: "Notification not found" });
    });

    it("should handle service errors gracefully", async () => {
      (notificationService.updateNotification as jest.Mock).mockRejectedValue(new Error("Internal server error"));

      const res = await request(app).put("/api/notifications/update").send({ notificationId: "notif1", status: "read" });

      expect(res.status).toBe(500);
      expect(res.body).toEqual({ message: "Internal server error" });
    });
  });

  describe("DELETE /api/notifications/delete", () => {
    it("should delete a notification", async () => {
      (notificationService.deleteNotification as jest.Mock).mockResolvedValue(true);

      const res = await request(app).delete("/api/notifications/delete").send({ notificationId: "notif1" });

      expect(res.status).toBe(204);
    });

    it("should return 404 if notification is not found", async () => {
      (notificationService.deleteNotification as jest.Mock).mockResolvedValue(null);

      const res = await request(app).delete("/api/notifications/delete").send({ notificationId: "notif1" });

      expect(res.status).toBe(404);
      expect(res.body).toEqual({ message: "Notification not found" });
    });

    it("should handle service errors gracefully", async () => {
      (notificationService.deleteNotification as jest.Mock).mockRejectedValue(new Error("Internal server error"));

      const res = await request(app).delete("/api/notifications/delete").send({ notificationId: "notif1" });

      expect(res.status).toBe(500);
      expect(res.body).toEqual({ message: "Internal server error" });
    });
  });
});
