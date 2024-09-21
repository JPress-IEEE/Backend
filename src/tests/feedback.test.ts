import request from "supertest";
import express from "express";
import * as feedbackService from "../services/feedback.services";   
import { authMiddleware,clientRoleoleMiddleware } from "../middlewares/auth.middleware";
import { FeedbackSchema } from "../schemas/feedback.schema";
import feedbackRouter from "../routes/feedback.route";
import { getUserByClient} from "../services/client.services";
import { get } from "axios";
import { ZodError } from "zod";

jest.mock("../services/client.services", () => ({
    getUserByClient: jest.fn(),
    }));

jest.mock("../services/feedback.services", () => ({
    createFeedback: jest.fn(),
    getFeedbackById: jest.fn(),
    getFeedbacksByApplicantId: jest.fn(),
    updateFeedback: jest.fn(),
    deleteFeedback: jest.fn(),
    }));
jest.mock("../middlewares/auth.middleware", () => ({
    authMiddleware: jest.fn(),
    clientRoleoleMiddleware: jest.fn(),
    }));
jest.mock("../schemas/feedback.schema", () => ({
    FeedbackSchema: {
        safeParse: jest.fn(),
        },
    }));

const app = express();
app.use(express.json());
app.use("/api/feedback", feedbackRouter);

describe("Feedback Router", () => {
    describe("GET /api/feedback/applicant/:id", () => {
        it("should call getFeedbacksByApplicantId", async () => {
            (feedbackService.getFeedbacksByApplicantId as jest.Mock).mockResolvedValueOnce([]);
            (authMiddleware as jest.Mock).mockImplementationOnce((req, res, next) => next());
            const response = await request(app).get("/api/feedback/applicant/1");
            expect(response.status).toBe(200);
            expect(feedbackService.getFeedbacksByApplicantId).toHaveBeenCalledWith("1");
            });
        });
    describe("GET /api/feedback/:id", () => {
        it("should call getFeedbackById", async () => {
            (feedbackService.getFeedbackById as jest.Mock).mockResolvedValueOnce({});
            (authMiddleware as jest.Mock).mockImplementationOnce((req, res, next) => next());
            const response = await request(app).get("/api/feedback/1");
            expect(response.status).toBe(200);
            expect(feedbackService.getFeedbackById).toHaveBeenCalledWith("1");
            });
        });
    describe("POST /api/feedback", () => {
        it("should call createFeedback", async () => {
            (feedbackService.createFeedback as jest.Mock).mockResolvedValueOnce({});
            (authMiddleware as jest.Mock).mockImplementationOnce((req, res, next) => next());
            (clientRoleoleMiddleware as jest.Mock).mockImplementationOnce((req, res, next) => next());
            (FeedbackSchema.safeParse as jest.Mock).mockReturnValueOnce({ success: true });
            const response = await request(app).post("/api/feedback").send({});
            expect(response.status).toBe(201);
            expect(feedbackService.createFeedback).toHaveBeenCalledWith(undefined, undefined, undefined, undefined, undefined);
            });
        });
    describe("PUT /api/feedback/:id", () => {
        it("should call updateFeedback", async () => {
            (feedbackService.getFeedbackById as jest.Mock).mockResolvedValueOnce({ clientId: "1" });
            (getUserByClient as jest.Mock).mockResolvedValueOnce("1");
            (feedbackService.updateFeedback as jest.Mock).mockResolvedValueOnce({});
            (authMiddleware as jest.Mock).mockImplementationOnce((req, res, next) => next());
            (clientRoleoleMiddleware as jest.Mock).mockImplementationOnce((req, res, next) => next());
            const response = await request(app).put("/api/feedback/1").send({ userId: "1" });
            expect(response.status).toBe(200);
            expect(feedbackService.updateFeedback).toHaveBeenCalledWith("1", undefined, undefined);
            });
        });
    describe("DELETE /api/feedback/:id", () => {
        it("should call deleteFeedback", async () => {
            (feedbackService.getFeedbackById as jest.Mock).mockResolvedValueOnce({ clientId: "1" });
            (getUserByClient as jest.Mock).mockResolvedValueOnce("1");
            (feedbackService.deleteFeedback as jest.Mock).mockResolvedValueOnce({});
            (authMiddleware as jest.Mock).mockImplementationOnce((req, res, next) => next());
            (clientRoleoleMiddleware as jest.Mock).mockImplementationOnce((req, res, next) => next());
            const response = await request(app).delete("/api/feedback/1").send({ userId: "1" });
            expect(response.status).toBe(204);
            expect(feedbackService.deleteFeedback).toHaveBeenCalledWith("1");
            });
        });
    });
describe("error cases", () => {
    it("should return 404 if feedback not found", async () => {
        (feedbackService.getFeedbackById as jest.Mock).mockRejectedValueOnce(new Error("Feedback not found"));
        (authMiddleware as jest.Mock).mockImplementationOnce((req, res, next) => next());
        const response = await request(app).get("/api/feedback/1");
        expect(response.status).toBe(404);
        expect(response.body).toEqual({ message: "Feedback not found" });
        });
    it("should return 404 if feedback not found", async () => {
        (feedbackService.getFeedbacksByApplicantId as jest.Mock).mockRejectedValueOnce(new Error("Feedback not found"));
        (authMiddleware as jest.Mock).mockImplementationOnce((req, res, next) => next());
        const response = await request(app).get("/api/feedback/applicant/1");
        expect(response.status).toBe(404);
        expect(response.body).toEqual({ message: "Feedback not found" });
        });
    it("should return 400 if error occurs", async () => {
        (feedbackService.createFeedback as jest.Mock).mockRejectedValueOnce(new Error("error"));
        (authMiddleware as jest.Mock).mockImplementationOnce((req, res, next) => next());
        (clientRoleoleMiddleware as jest.Mock).mockImplementationOnce((req, res, next) => next());
        (FeedbackSchema.safeParse as jest.Mock).mockReturnValueOnce({ success: true });
        const response = await request(app).post("/api/feedback").send({});
        expect(response.status).toBe(400);
        expect(response.body).toEqual({ message: "error" });
        });
    it("should return 400 if error occurs", async () => {
        (feedbackService.updateFeedback as jest.Mock).mockRejectedValueOnce(new Error("error"));
        (feedbackService.getFeedbackById as jest.Mock).mockResolvedValueOnce({ clientId: "1" });
        (getUserByClient as jest.Mock).mockResolvedValueOnce("1");
        (authMiddleware as jest.Mock).mockImplementationOnce((req, res, next) => next());
        (clientRoleoleMiddleware as jest.Mock).mockImplementationOnce((req, res, next) => next());
        const response = await request(app).put("/api/feedback/1").send({ userId: "1" });
        expect(response.status).toBe(400);
        expect(response.body).toEqual({ message: "error" });
        });
    it("should return 400 if error occurs", async () => {
        (feedbackService.deleteFeedback as jest.Mock).mockRejectedValueOnce(new Error("error"));
        (feedbackService.getFeedbackById as jest.Mock).mockResolvedValueOnce({ clientId: "1" });
        (getUserByClient as jest.Mock).mockResolvedValueOnce("1");
        (authMiddleware as jest.Mock).mockImplementationOnce((req, res, next) => next());
        (clientRoleoleMiddleware as jest.Mock).mockImplementationOnce((req, res, next) => next());
        const response = await request(app).delete("/api/feedback/1").send({ userId: "1" });
        expect(response.status).toBe(400);
        expect(response.body).toEqual({ message: "error" });
    });
});
describe("feedback routes when not authorized", () => {
    it("should return 401 if not authorized", async () => {
        (authMiddleware as jest.Mock).mockImplementationOnce((req, res, next) => {
            return res.status(401).json({ message: "Unauthorized" });
        });
        const response = await request(app).get("/api/feedback/1");
        expect(response.status).toBe(401);
        expect(response.body).toEqual({ message: "Unauthorized" });
    });

    it("should return 401 if not authorized", async () => {
        (authMiddleware as jest.Mock).mockImplementationOnce((req, res, next) => {
            return res.status(401).json({ message: "Unauthorized" });
        });
        const response = await request(app).post("/api/feedback").send({});
        expect(response.status).toBe(401);
        expect(response.body).toEqual({ message: "Unauthorized" });
    });

    it("should return 401 if not authorized", async () => {
        (authMiddleware as jest.Mock).mockImplementationOnce((req, res, next) => {
            return res.status(401).json({ message: "Unauthorized" });
        });
        const response = await request(app).put("/api/feedback/1").send({});
        expect(response.status).toBe(401);
        expect(response.body).toEqual({ message: "Unauthorized" });
    });

    it("should return 401 if not authorized", async () => {
        (authMiddleware as jest.Mock).mockImplementationOnce((req, res, next) => {
            return res.status(401).json({ message: "Unauthorized" });
        });
        const response = await request(app).delete("/api/feedback/1").send({});
        expect(response.status).toBe(401);
        expect(response.body).toEqual({ message: "Unauthorized" });
    });
});
