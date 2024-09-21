import request from "supertest";
import express from "express";
import chatRouter from "../routes/chat.route";
import * as chatService from "../services/chat.services";
import * as messageService from "../services/message.services";
import { chatSchema } from "../schemas/chat.schema";
import { ErrorHandler } from "../middlewares/generalErrorHandler";

jest.mock("../services/chat.services", () => ({
  createChat: jest.fn(),
  getChatById: jest.fn(),
}));

jest.mock("../services/message.services", () => ({
  getMessageForChat: jest.fn(),
}));

jest.mock("../schemas/chat.schema", () => ({
  chatSchema: {
    safeParse: jest.fn(),
  },
}));

const app = express();
app.use(express.json());
app.use("/api/chats/", chatRouter);
app.use(ErrorHandler);

describe("Chat Routes", () => {
  describe("POST /api/chats/chat", () => {
    it("should create a chat when valid input is provided", async () => {
      const mockChat = { _id: "123", participant1_id: "user1", participant2_id: "user2" };
      (chatSchema.safeParse as jest.Mock).mockReturnValue({ success: true, data: mockChat });
      (chatService.createChat as jest.Mock).mockResolvedValue(mockChat);

      const res = await request(app).post("/api/chats/chat").send({ participant1_id: "user1", participant2_id: "user2" });

      expect(res.status).toBe(201);
      expect(res.body).toEqual(mockChat);
    });

    it("should handle validation errors with specific messages", async () => {
      (chatSchema.safeParse as jest.Mock).mockReturnValue({
        success: false,
        error: { issues: [{ message: "Participant 1 is required" }] },
      });

      const res = await request(app).post("/api/chats/chat").send({ participant1_id: "", participant2_id: "" });

      expect(res.status).toBe(400);
      expect(res.body).toEqual({ message: "Participant 1 is required" });
    });

    it("should handle service errors gracefully", async () => {
      (chatSchema.safeParse as jest.Mock).mockReturnValue({ success: true });
      (chatService.createChat as jest.Mock).mockRejectedValue(new Error("Internal server error"));

      const res = await request(app).post("/api/chats/chat").send({ participant1_id: "user1", participant2_id: "user2" });

      expect(chatService.createChat)
      expect(res.status).toBe(500);
      expect(res.body).toEqual({ message: "Internal server error" });
    });
  });

  describe("GET /api/chats/chat/:chatId/messages", () => {
    it("should get messages for a valid chat ID", async () => {
      const mockMessages = [{ _id: "msg1", chat_id: "123", content: "Hello" }];
      (chatService.getChatById as jest.Mock).mockResolvedValue(true);
      (messageService.getMessageForChat as jest.Mock).mockResolvedValue(mockMessages);

      const res = await request(app).get("/api/chats/chat/123/messages");

      expect(res.status).toBe(200);
      expect(res.body).toEqual(mockMessages);
    });

    it("should return 404 if chat is not found", async () => {
      (chatService.getChatById as jest.Mock).mockResolvedValue(null);

      const res = await request(app).get("/api/chats/chat/123/messages");

      expect(res.status).toBe(404);
      expect(res.body).toEqual({ message: "Chat not found" });
    });

    it("should handle service errors gracefully", async () => {
      (chatService.getChatById as jest.Mock).mockRejectedValue(new Error("Internal server error"));

      const res = await request(app).get("/api/chats/chat/123/messages");

      expect(res.status).toBe(500);
      expect(res.body).toEqual({ message: "Internal server error" });
    });
  });
});
