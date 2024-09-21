import request from "supertest";
import express from "express";
import messageRouter from "../routes/messsage.route";
import * as messageService from "../services/message.services";
import { messageSchema } from "../schemas/message.schema";
import { ErrorHandler } from "../middlewares/generalErrorHandler";

jest.mock("../services/message.services", () => ({
  createMessage: jest.fn(),
  getMessageForChat: jest.fn(),
  editMessage: jest.fn(),
  deleteMessage: jest.fn(),
  markMessageAsRead: jest.fn(),
}));

jest.mock("../schemas/message.schema", () => ({
  messageSchema: {
    safeParse: jest.fn(),
  },
}));

const app = express();
app.use(express.json());
app.use("/api/messages", messageRouter);
app.use(ErrorHandler);

beforeEach(() => {
  jest.clearAllMocks();
});

describe("Message Routes", () => {
  describe("POST /api/messages/messages", () => {
    it("should create a message successfully", async () => {
      const mockMessage = { _id: "msg1", chat_id: "123", sender_id: "user1", content: "Hello" };
      (messageSchema.safeParse as jest.Mock).mockReturnValue({ success: true, data: mockMessage });
      (messageService.createMessage as jest.Mock).mockResolvedValue(mockMessage);

      const res = await request(app).post("/api/messages/messages").send({ chatId: "123", senderId: "user1", content: "Hello" });

      expect(res.status).toBe(201);
      expect(res.body).toEqual(mockMessage);
    });

    it("should return 400 if content is empty", async () => {
      (messageSchema.safeParse as jest.Mock).mockReturnValue({
        success: false,
        error: { issues: [{ message: "Content cannot be empty" }] },
      });

      const res = await request(app).post("/api/messages/messages").send({ chatId: "123", senderId: "user1", content: "" });

      expect(res.status).toBe(400);
      expect(res.body).toEqual({ message: "Content cannot be empty" });
    });

    it("should handle errors when creating a message", async () => {
      (messageSchema.safeParse as jest.Mock).mockReturnValue({ success: true });
      (messageService.createMessage as jest.Mock).mockRejectedValue(new Error("Internal server error"));

      const res = await request(app).post("/api/messages/messages").send({ chatId: "123", senderId: "user1", content: "Hello" });

      expect(messageService.createMessage).toHaveBeenCalledWith("123", "user1", "Hello");
      expect(res.status).toBe(500);
      expect(res.body).toEqual({ message: "Internal server error" });
    });
  });

  describe("PUT /api/messages/messages/:messageId", () => {
    it("should edit a message successfully", async () => {
      const mockMessage = { _id: "msg1", content: "Updated content" };
      (messageService.editMessage as jest.Mock).mockResolvedValue(mockMessage);

      const res = await request(app).put("/api/messages/messages/msg1").send({ newContent: "Updated content" });

      expect(res.status).toBe(200);
      expect(res.body).toEqual(mockMessage);
    });

    it("should return 404 if message is not found", async () => {
      (messageService.editMessage as jest.Mock).mockResolvedValue(null);

      const res = await request(app).put("/api/messages/messages/msg1").send({ newContent: "Updated content" });

      expect(res.status).toBe(404);
      expect(res.body).toEqual({ message: "Message not found" });
    });

    it("should handle service errors while editing a message", async () => {
      (messageService.editMessage as jest.Mock).mockRejectedValue(new Error("Internal server error"));

      const res = await request(app).put("/api/messages/messages/msg1").send({ newContent: "Updated content" });

      expect(res.status).toBe(500);
      expect(res.body).toEqual({ message: "Internal server error" });
    });
  });

  describe("DELETE /api/messages/:messageId", () => {
    it("should delete a message successfully", async () => {
      (messageService.deleteMessage as jest.Mock).mockResolvedValue(true);

      const res = await request(app).delete("/api/messages/messages/msg1");

      expect(res.status).toBe(204);
    });

    it("should return 404 if message is not found", async () => {
      (messageService.deleteMessage as jest.Mock).mockResolvedValue(null);

      const res = await request(app).delete("/api/messages/messages/msg1");

      expect(res.status).toBe(404);
      expect(res.body).toEqual({ message: "Message not found" });
    });

    it("should handle errors while deleting a message", async () => {
      (messageService.deleteMessage as jest.Mock).mockRejectedValue(new Error("Internal server error"));

      const res = await request(app).delete("/api/messages/messages/msg1");

      expect(res.status).toBe(500);
      expect(res.body).toEqual({ message: "Internal server error" });
    });
  });

  describe("PUT /api/messages/read/:messageId", () => {
    it("should mark a message as read successfully", async () => {
      const mockMessage = { _id: "msg1", isRead: true };
      (messageService.markMessageAsRead as jest.Mock).mockResolvedValue(mockMessage);

      const res = await request(app).put("/api/messages/messages/read/msg1");

      expect(res.status).toBe(200);
      expect(res.body).toEqual(mockMessage);
    });

    it("should return 404 if message to be marked as read is not found", async () => {
      (messageService.markMessageAsRead as jest.Mock).mockResolvedValue(null);

      const res = await request(app).put("/api/messages/messages/read/msg1");

      expect(res.status).toBe(404);
      expect(res.body).toEqual({ message: "Message not found" });
    });

    it("should handle errors while marking a message as read", async () => {
      (messageService.markMessageAsRead as jest.Mock).mockRejectedValue(new Error("Internal server error"));

      const res = await request(app).put("/api/messages/messages/read/msg1");

      expect(res.status).toBe(500);
      expect(res.body).toEqual({ message: "Internal server error" });
    });
  });
});
