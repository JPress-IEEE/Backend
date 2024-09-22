import request from "supertest";
import express from "express";
import videocallRouter from "../routes/videocall.route";
import * as videocallService from "../services/videocall.services";
import { videoCallSchema } from "../schemas/videocall.schema";
import { ErrorHandler } from "../middlewares/generalErrorHandler";

jest.mock("../services/videocall.services", () => ({
  requestVideoCall: jest.fn(),
  acceptVideoCall: jest.fn(),
  declineVideoCall: jest.fn(),
  endVideoCall: jest.fn(),
}));

jest.mock("../schemas/videocall.schema", () => ({
  videoCallSchema: {
    safeParse: jest.fn(),
  },
}));

jest.mock("../middlewares/auth.middleware", () => ({
  authMiddleware: (req: express.Request, res: express.Response, next: express.NextFunction) => {
    req.user = { id: "mockUserId" };
    next();
  },
}));

const app = express();
app.use(express.json());
app.use("/api/videocall", videocallRouter);
app.use(ErrorHandler);

describe("VideoCall Routes", () => {
  describe("POST /api/videocall/request", () => {
    it("should request a video call successfully", async () => {
      const mockCall = {
        _id: "call1",
        chat_id: "chat1",
        sender_id: "user1",
        receiver_id: "user2",
        callStatus: "pending",
      };
      (videoCallSchema.safeParse as jest.Mock).mockReturnValue({ success: true });
      (videocallService.requestVideoCall as jest.Mock).mockResolvedValue(mockCall);

      const res = await request(app)
        .post("/api/videocall/request")
        .send({ chatId: "chat1", senderId: "user1", receiverId: "user2" });

      expect(res.status).toBe(201);
      expect(res.body).toEqual(mockCall);
    });

    it("should return 400 for invalid input", async () => {
      (videoCallSchema.safeParse as jest.Mock).mockReturnValue({
        success: false,
        error: { issues: [{ message: "Chat ID, sender ID, and receiver ID are required" }] },
      });

      const res = await request(app).post("/api/videocall/request").send({});

      expect(res.status).toBe(400);
      expect(res.body).toEqual({ message: "Chat ID, sender ID, and receiver ID are required" });
    });

    it("should handle service errors gracefully", async () => {
      (videoCallSchema.safeParse as jest.Mock).mockReturnValue({ success: true });
      (videocallService.requestVideoCall as jest.Mock).mockRejectedValue(new Error("Internal server error"));

      const res = await request(app)
        .post("/api/videocall/request")
        .send({ chatId: "chat1", senderId: "user1", receiverId: "user2" });

      expect(videocallService.requestVideoCall).toHaveBeenCalledWith("chat1", "user1", "user2");
      expect(res.status).toBe(500);
      expect(res.body).toEqual({ message: "Internal server error" });
    });
  });

  describe("POST /api/videocall/accept", () => {
    it("should accept a video call successfully", async () => {
      const mockCall = {
        _id: "call1",
        chat_id: "chat1",
        sender_id: "user1",
        receiver_id: "user2",
        callStatus: "active",
      };
      (videocallService.acceptVideoCall as jest.Mock).mockResolvedValue(mockCall);

      const res = await request(app)
        .post("/api/videocall/accept")
        .send({ chatId: "chat1", senderId: "user1", receiverId: "user2" });

      expect(res.status).toBe(200);
      expect(res.body).toEqual(mockCall);
    });

    it("should return 404 if pending video call is not found", async () => {
      (videocallService.acceptVideoCall as jest.Mock).mockResolvedValue(null);

      const res = await request(app)
        .post("/api/videocall/accept")
        .send({ chatId: "chat1", senderId: "user1", receiverId: "user2" });

      expect(res.status).toBe(404);
      expect(res.body).toEqual({ message: "Pending video call not found" });
    });

    it("should handle service errors gracefully", async () => {
      (videocallService.acceptVideoCall as jest.Mock).mockRejectedValue(new Error("Internal server error"));

      const res = await request(app)
        .post("/api/videocall/accept")
        .send({ chatId: "chat1", senderId: "user1", receiverId: "user2" });

      expect(res.status).toBe(500);
      expect(res.body).toEqual({ message: "Internal server error" });
    });
  });

  describe("POST /api/videocall/decline", () => {
    it("should decline a video call successfully", async () => {
      const mockCall = {
        _id: "call1",
        chat_id: "chat1",
        sender_id: "user1",
        receiver_id: "user2",
        callStatus: "missed",
      };
      (videocallService.declineVideoCall as jest.Mock).mockResolvedValue(mockCall);

      const res = await request(app)
        .post("/api/videocall/decline")
        .send({ chatId: "chat1", senderId: "user1", receiverId: "user2" });

      expect(res.status).toBe(200);
      expect(res.body).toEqual(mockCall);
    });

    it("should return 404 if pending video call is not found", async () => {
      (videocallService.declineVideoCall as jest.Mock).mockResolvedValue(null);

      const res = await request(app)
        .post("/api/videocall/decline")
        .send({ chatId: "chat1", senderId: "user1", receiverId: "user2" });

      expect(res.status).toBe(404);
      expect(res.body).toEqual({ message: "Pending video call not found" });
    });

    it("should handle service errors gracefully", async () => {
      (videocallService.declineVideoCall as jest.Mock).mockRejectedValue(new Error("Internal server error"));

      const res = await request(app)
        .post("/api/videocall/decline")
        .send({ chatId: "chat1", senderId: "user1", receiverId: "user2" });

      expect(res.status).toBe(500);
      expect(res.body).toEqual({ message: "Internal server error" });
    });
  });

  describe("POST /api/videocall/end", () => {
    it("should end a video call successfully", async () => {
      const mockCall = {
        _id: "call1",
        chat_id: "chat1",
        sender_id: "user1",
        receiver_id: "user2",
        callStatus: "ended",
      };
      (videocallService.endVideoCall as jest.Mock).mockResolvedValue(mockCall);

      const res = await request(app).post("/api/videocall/end").send({ chatId: "chat1", senderId: "user1", receiverId: "user2" });

      expect(res.status).toBe(200);
      expect(res.body).toEqual(mockCall);
    });

    it("should return 404 if active video call is not found", async () => {
      (videocallService.endVideoCall as jest.Mock).mockResolvedValue(null);

      const res = await request(app).post("/api/videocall/end").send({ chatId: "chat1", senderId: "user1", receiverId: "user2" });

      expect(res.status).toBe(404);
      expect(res.body).toEqual({ message: "Active video call not found" });
    });

    it("should handle service errors gracefully", async () => {
      (videocallService.endVideoCall as jest.Mock).mockRejectedValue(new Error("Internal server error"));

      const res = await request(app).post("/api/videocall/end").send({ chatId: "chat1", senderId: "user1", receiverId: "user2" });

      expect(res.status).toBe(500);
      expect(res.body).toEqual({ message: "Internal server error" });
    });
  });
});
