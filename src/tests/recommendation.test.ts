import request from "supertest";
import express from "express";
import {getAIRecommendation,storeAIRecommendationsForRequest,updateData,deleteData,getRecommendationById,getRecommendationByRequestId,storeData} from "../services/recommendation.services"
import recommendationRouter from "../routes/recommendation.route";
import { authMiddleware } from "../middlewares/auth.middleware";
import { RecommendationSchema } from "../schemas/recommendation.schema";


jest.mock("../middlewares/auth.middleware", () => ({
    authMiddleware: jest.fn(),
}));

jest.mock("../services/recommendation.services", () => ({
  getAIRecommendation: jest.fn(),
  storeAIRecommendationsForRequest:jest.fn(),
  updateData: jest.fn(),
  deleteData:jest.fn(),
  getRecommendationById:jest.fn(),
  getRecommendationByRequestId:jest.fn(),
  storeData:jest.fn(),
}));

jest.mock("../schemas/recommendation.schema", () => ({
    RecommendationSchema:{
        parseAsync :jest.fn(),
    }
}));

const app = express();
app.use(express.json());
app.use("/api/recommendation",recommendationRouter);
describe("recommendation route", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });
    describe("GET /api/recommendation", () => {
        it("should return 200 and call getRecommendationById", async () => {
            const recommendation = {
                _id: "1",
                requestId: "1",
                applicants: [],
            };
            (authMiddleware as jest.Mock).mockImplementation((req, res, next) => next());
            (getRecommendationById as jest.Mock).mockResolvedValue(recommendation);
            const response = await request(app).get("/api/recommendation/1");
            expect(response.status).toBe(200);
            expect(response.body).toEqual(recommendation);
        });
        it("should return 500 when getRecommendationById throws an error", async () => {
            (authMiddleware as jest.Mock).mockImplementation((req, res, next) => next());
            (getRecommendationById as jest.Mock).mockRejectedValue(new Error("error"));
            const response = await request(app).get("/api/recommendation/1");
            expect(response.status).toBe(500);
            expect(response.body).toEqual({ message: "error" });
        });
    });
    describe("GET /api/recommendation/request", () => {
        it("should return 200 and call getRecommendationByRequestId", async () => {
            const recommendation = {
                _id: "1",
                requestId: "1",
                applicants: [],
            };
            (authMiddleware as jest.Mock).mockImplementation((req, res, next) => next());
            (getRecommendationByRequestId as jest.Mock).mockResolvedValue(recommendation);
            const response = await request(app).get("/api/recommendation/request/1");
            expect(response.status).toBe(200);
            expect(response.body).toEqual(recommendation);
        });
        it("should return 500 when getRecommendationByRequestId throws an error", async () => {
            (authMiddleware as jest.Mock).mockImplementation((req, res, next) => next());
            (getRecommendationByRequestId as jest.Mock).mockRejectedValue(new Error("error"));
            const response = await request(app).get("/api/recommendation/request/1");
            expect(response.status).toBe(500);
            expect(response.body).toEqual({ message: "error" });
        });
    });
    describe("POST /api/recommendation/ai", () => {
        it("should return 200 and call getAIRecommendation", async () => {
            const recommendations = [
                {
                    _id: "1",
                    requestId: "1",
                    applicants: [],
                },
            ];
            (authMiddleware as jest.Mock).mockImplementation((req, res, next) => next());
            (getAIRecommendation as jest.Mock).mockResolvedValue(recommendations);
            const response = await request(app).post("/api/recommendation/ai").send({ description: "test" });
            expect(response.status).toBe(200);
            expect(response.body).toEqual(recommendations);
        });
        it("should return 500 when getAIRecommendation throws an error", async () => {
            (authMiddleware as jest.Mock).mockImplementation((req, res, next) => next());
            (getAIRecommendation as jest.Mock).mockRejectedValue(new Error("error"));
            const response = await request(app).post("/api/recommendation/ai").send({ description: "test" });
            expect(response.status).toBe(500);
            expect(response.body).toEqual({ message: "error" });
        });
    });
    describe("POST /api/recommendation/store", () => {
        it("should return 200 and call storeAIRecommendationsForRequest", async () => {
            const recommendation = {
                _id: "1",
                requestId: "1",
                applicants: [],
            };
            (authMiddleware as jest.Mock).mockImplementation((req, res, next) => next());
            (storeAIRecommendationsForRequest as jest.Mock).mockResolvedValue(recommendation);
            const response = await request(app).post("/api/recommendation/store/1").send({ description: "test" });
            expect(response.status).toBe(200);
            expect(response.body).toEqual(recommendation);
        });
        it("should return 500 when storeAIRecommendationsForRequest throws an error", async () => {
            (authMiddleware as jest.Mock).mockImplementation((req, res, next) => next());
            (storeAIRecommendationsForRequest as jest.Mock).mockRejectedValue(new Error("error"));
            const response = await request(app).post("/api/recommendation/store/1").send({ description: "test" });
            expect(response.status).toBe(500);
            expect(response.body).toEqual({ message: "error" });
        });
    });
});