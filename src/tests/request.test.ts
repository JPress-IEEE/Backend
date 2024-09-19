import request from "supertest";
import express from "express";
import requestRouter from "../routes/request.route";
import * as requestService from "../services/request.services";
import { authMiddleware, applicantRoleMiddleware, clientRoleoleMiddleware } from "../middlewares/auth.middleware";
import { RequestSchema } from "../schemas/request.schema";
import c from "config";
import { getClientIdFromRequestId } from "../services/request.services";
import { ZodError } from "zod";

jest.mock("../services/request.services", () => ({
    createRequest: jest.fn(),
    getRequestById: jest.fn(),
    getRequests: jest.fn(),
    updateRequest: jest.fn(),
    deleteRequest: jest.fn(),
    getRequestsByClientId: jest.fn(),
    deleteRequestByClientId: jest.fn(),
    getClientIdFromRequestId: jest.fn(),
}));

jest.mock("../middlewares/auth.middleware", () => ({
    authMiddleware: jest.fn(),
    applicantRoleMiddleware: jest.fn(),
    clientRoleoleMiddleware: jest.fn(),
}));

jest.mock("../schemas/request.schema", () => ({
    RequestSchema: {
        parseAsync: jest.fn(),
    },
}));

const app = express();
app.use(express.json());
app.use('/api/request', requestRouter);

describe("Request Router", () => {
    describe("POST /api/request", () => {
        it.concurrent("should call createRequest controller", async () => {
            const mockRequest = {
                _id: "123",
                clientId: "123",
                jobName: "Software Developer",
                description: "Full stack developer",
                location: "Lagos",
            };
            (RequestSchema.parseAsync as jest.Mock).mockResolvedValue(mockRequest);
            (requestService.createRequest as jest.Mock).mockResolvedValue(mockRequest);
            (authMiddleware as jest.Mock).mockImplementation((req, res, next) => next());
            (clientRoleoleMiddleware as jest.Mock).mockImplementation((req, res, next) => next());
            const res = await request(app)
                .post("/api/request")
                .send(mockRequest);
            expect(res.status).toBe(201);
            expect(res.body).toEqual(mockRequest);

        });
    });

    describe("GET /api/request/:id", () => {
        it.concurrent("should call getRequest controller", async () => {
            const mockRequest = {
                _id: "123",
                clientId: "123",
                jobName: "Software Developer",
                description: "Full stack developer",
                location: "Lagos",
            };
            (requestService.getRequestById as jest.Mock).mockResolvedValue(mockRequest);
            (authMiddleware as jest.Mock).mockImplementation((req, res, next) => next());
            (clientRoleoleMiddleware as jest.Mock).mockImplementation((req, res, next) => {
                req.body.userId = "123";
                next();
            });
            (getClientIdFromRequestId as jest.Mock).mockResolvedValue("123");
            
            const res = await request(app)
                .get("/api/request/123");
            expect(res.status).toBe(200);
            expect(res.body).toEqual(mockRequest);
        });
    });
    describe("PATCH /api/request/:id", () => {
        it.concurrent("should call updateRequest controller", async () => {
            const mockRequest = {
                _id: "123",
                clientId: "123",
                jobName: "Software Developer",
                description: "Full stack developer",
                location: "Lagos",
            };
            (RequestSchema.parseAsync as jest.Mock).mockResolvedValue(mockRequest);
            (requestService.updateRequest as jest.Mock).mockResolvedValue(mockRequest);
            (getClientIdFromRequestId as jest.Mock).mockResolvedValue("123");
            (authMiddleware as jest.Mock).mockImplementation((req, res, next) => next());
            (clientRoleoleMiddleware as jest.Mock).mockImplementation((req, res, next) =>{
                req.body.userId = "123";
                next();
            });
            const res = await request(app)
                .patch("/api/request/123")
                .send(mockRequest);
            expect(res.status).toBe(200);
            expect(res.body).toEqual(mockRequest);
        });
    });
    describe("DELETE /api/request/:id", () => {
        it.concurrent("should call deleteRequest controller", async () => {
            (requestService.deleteRequest as jest.Mock).mockResolvedValue(null);
            (getClientIdFromRequestId as jest.Mock).mockResolvedValue("123");
            (authMiddleware as jest.Mock).mockImplementation((req, res, next) => next());
            (clientRoleoleMiddleware as jest.Mock).mockImplementation((req, res, next) =>{
                req.body.userId = "123";
                next();
            });
            const res = await request(app)
                .delete("/api/request/123");
            expect(res.status).toBe(204);
        });
    });
    describe("GET /api/request/client/:clientId", () => {
        it.concurrent("should call getRequestByClientId controller", async () => {
            const mockRequest = {
                _id: "123",
                clientId: "123",
                jobName: "Software Developer",
                description: "Full stack developer",
                location: "Lagos",
            };
            (requestService.getRequestsByClientId as jest.Mock).mockResolvedValue([mockRequest]);
            (authMiddleware as jest.Mock).mockImplementation((req, res, next) => next());
            (clientRoleoleMiddleware as jest.Mock).mockImplementation((req, res, next) =>{
                req.body.userId = "123";
                next();
            });
            const res = await request(app)
                .get("/api/request/client/123");
            expect(res.status).toBe(200);
            expect(res.body).toEqual([mockRequest]);
        });
    });
    describe("GET /api/request", () => {
        it.concurrent("should call getRequests controller", async () => {
            const mockRequest = {
                _id: "123",
                clientId: "123",
                jobName: "Software Developer",
                description: "Full stack developer",
                location: "Lagos",
            };
            (requestService.getRequests as jest.Mock).mockResolvedValue([mockRequest]);
            (authMiddleware as jest.Mock).mockImplementation((req, res, next) => next());
            const res = await request(app)
                .get("/api/request");
            expect(res.status).toBe(200);
            expect(res.body).toEqual([mockRequest]);
        });
    });
    describe("DELETE /api/request/client/:clientId", () => {
        it.concurrent("should call deleteRequestByClientId controller", async () => {
            (requestService.deleteRequestByClientId as jest.Mock).mockResolvedValue(null);
            (authMiddleware as jest.Mock).mockImplementation((req, res, next) => next());
            (clientRoleoleMiddleware as jest.Mock).mockImplementation((req, res, next) =>{
                req.body.userId = "123";
                next();
            });
            const res = await request(app)
                .delete("/api/request/client/123");
            expect(res.status).toBe(204);
        });
    });
    describe("Error Handling", () => {
        it.concurrent("should return 400 if validation fails", async () => {
            const mockRequest = {
                _id: "123",
                clientId: "123",
                jobName: "Software Developer",
                description: "Full stack developer",
                location: "Lagos",
            };
            const zodError = new ZodError([]);
            (RequestSchema.parseAsync as jest.Mock).mockRejectedValue(zodError);
            (authMiddleware as jest.Mock).mockImplementation((req, res, next) => next());
            (clientRoleoleMiddleware as jest.Mock).mockImplementation((req, res, next) =>{
                req.body.userId = "123";
                next();
            });
            const res = await request(app)
                .post("/api/request")
                .send(mockRequest);
            expect(res.status).toBe(400);
        });
        it.concurrent("should return 500 if an error occurs", async () => {
            const mockRequest = {
                _id: "123",
                clientId: "123",
                jobName: "Software Developer",
                description: "Full stack developer",
                location: "Lagos",
            };
            (RequestSchema.parseAsync as jest.Mock).mockResolvedValue(mockRequest);
            (requestService.createRequest as jest.Mock).mockRejectedValue(new Error("Internal Server Error"));
            (authMiddleware as jest.Mock).mockImplementation((req, res, next) => next());
            (clientRoleoleMiddleware as jest.Mock).mockImplementation((req, res, next) => next());
            const res = await request(app)
                .post("/api/request")
                .send(mockRequest);
            expect(res.status).toBe(500);
        });
        it.concurrent("should return 400 if validation fails", async () => {
            const mockRequest = {
                _id: "123",
                clientId: "123",
                jobName: "Software Developer",
                description: "Full stack developer",
                location: "Lagos",
            };
            const zodError = new ZodError([]);
            (RequestSchema.parseAsync as jest.Mock).mockRejectedValue(zodError);
            (getClientIdFromRequestId as jest.Mock).mockResolvedValue("123");   
            (authMiddleware as jest.Mock).mockImplementation((req, res, next) => next());
            (clientRoleoleMiddleware as jest.Mock).mockImplementation((req, res, next) => {
                req.body.userId = "123";
                next();
            });
            const res = await request(app)
                .patch("/api/request/123")
                .send(mockRequest);
            expect(res.status).toBe(400);
        });
        it.concurrent("should return 500 if an error occurs", async () => {
            const mockRequest = {
                _id: "123",
                clientId: "123",
                jobName: "Software Developer",
                description: "Full stack developer",
                location: "Lagos",
            };
            (RequestSchema.parseAsync as jest.Mock).mockResolvedValue(mockRequest);
            (getClientIdFromRequestId as jest.Mock).mockResolvedValue("123");
            (requestService.updateRequest as jest.Mock).mockRejectedValue(new Error("Internal Server Error"));
            (authMiddleware as jest.Mock).mockImplementation((req, res, next) => next());
            (clientRoleoleMiddleware as jest.Mock).mockImplementation((req, res, next) => {
                req.body.userId = "123";
                next();
            });
            const res = await request(app)
                .patch("/api/request/123")
                .send(mockRequest);
            expect(res.status).toBe(500);
        });
        it.concurrent("should return 500 if an error occurs", async () => {
            (requestService.deleteRequest as jest.Mock).mockRejectedValue(new Error("Internal Server Error"));
            (authMiddleware as jest.Mock).mockImplementation((req, res, next) => next());
            (getClientIdFromRequestId as jest.Mock).mockResolvedValue("123");
            (clientRoleoleMiddleware as jest.Mock).mockImplementation((req, res, next) => {
                req.body.userId = "123";
                next();
            });
            const res = await request(app)
                .delete("/api/request/123");
            expect(res.status).toBe(500);
        });
        it.concurrent("should return 500 if an error occurs", async () => {
            (requestService.deleteRequestByClientId as jest.Mock).mockRejectedValue(new Error("Internal Server Error"));
            (authMiddleware as jest.Mock).mockImplementation((req, res, next) => next());
            (clientRoleoleMiddleware as jest.Mock).mockImplementation((req, res, next) => {
                req.body.userId = "123";
                next();
            });
            const res = await request(app)
                .delete("/api/request/client/123");
            expect(res.status).toBe(500);
        });
        it.concurrent("should return 500 if an error occurs", async () => {
            (requestService.getRequests as jest.Mock).mockRejectedValue(new Error("Internal Server Error"));
            (authMiddleware as jest.Mock).mockImplementation((req, res, next) => next());
            const res = await request(app)
                .get("/api/request");
            expect(res.status).toBe(500);
        });
        it.concurrent("should return 500 if an error occurs", async () => {
            (requestService.getRequestsByClientId as jest.Mock).mockRejectedValue(new Error("Internal Server Error"));
            (authMiddleware as jest.Mock).mockImplementation((req, res, next) => next());
            (clientRoleoleMiddleware as jest.Mock).mockImplementation((req, res, next) =>{
                req.body.userId = "123";
                next();
            });
            const res = await request(app)
                .get("/api/request/client/123");
            expect(res.status).toBe(500);
        });
        it.concurrent("should return 500 if an error occurs", async () => {
            (requestService.getRequestById as jest.Mock).mockRejectedValue(new Error("Internal Server Error"));
            (authMiddleware as jest.Mock).mockImplementation((req, res, next) => next());
            (getClientIdFromRequestId as jest.Mock).mockResolvedValue("123");
            (clientRoleoleMiddleware as jest.Mock).mockImplementation((req, res, next) => {
                req.body.userId = "123";
                next();
            });
            const res = await request(app)
                .get("/api/request/123");
            expect(res.status).toBe(500);
        });
    });
    describe("Auth Middleware", () => {
        it.concurrent("should return 401 if user is not authenticated", async () => {
            const mockRequest = {
                _id: "123",
                clientId: "123",
                jobName: "Software Developer",
                description: "Full stack developer",
                location: "Lagos",
            };
            (RequestSchema.parseAsync as jest.Mock).mockResolvedValue(mockRequest);
            (authMiddleware as jest.Mock).mockImplementation((req, res, next) => res.status(401).end());
            (clientRoleoleMiddleware as jest.Mock).mockImplementation((req, res, next) => next());
            const res = await request(app)
                .post("/api/request");
            expect(res.status).toBe(401);
        });
        it.concurrent("should return 403 if user is not a client", async () => {
            const mockRequest = {
                _id: "123",
                clientId: "123",
                jobName: "Software Developer",
                description: "Full stack developer",
                location: "Lagos",
            };
            (RequestSchema.parseAsync as jest.Mock).mockResolvedValue(mockRequest);
            (authMiddleware as jest.Mock).mockImplementation((req, res, next) => next());
            (clientRoleoleMiddleware as jest.Mock).mockImplementation((req, res, next) => res.status(403).end());
            (requestService.createRequest as jest.Mock).mockResolvedValue(mockRequest);


            const res = await request(app)
                .post("/api/request");
            expect(res.status).toBe(403);
        });
        it.concurrent("should return 401 if user is not authenticated", async () => {
            const mockRequest = {
                _id: "123",
                clientId: "123",
                jobName: "Software Developer",
                description: "Full stack developer",
                location: "Lagos",
            };
            (RequestSchema.parseAsync as jest.Mock).mockResolvedValue(mockRequest);
            (getClientIdFromRequestId as jest.Mock).mockResolvedValue("123");
            (authMiddleware as jest.Mock).mockImplementation((req, res, next) => res.status(401).end());
            (clientRoleoleMiddleware as jest.Mock).mockImplementation((req, res, next) => {
                req.body.userId = "123";
                next();
            });
            const res = await request(app)
                .get("/api/request/123");
            expect(res.status).toBe(401);
        });
        it.concurrent("should return 403 if user is not a client", async () => {
            const mockRequest = {
                _id: "123",
                clientId: "123",
                jobName: "Software Developer",
                description: "Full stack developer",
                location: "Lagos",
            };
            (RequestSchema.parseAsync as jest.Mock).mockResolvedValue(mockRequest);
            (authMiddleware as jest.Mock).mockImplementation((req, res, next) => next());
            (clientRoleoleMiddleware as jest.Mock).mockImplementation((req, res, next) => res.status(403).end());
            (requestService.getRequestById as jest.Mock).mockResolvedValue(mockRequest);
            const res = await request(app)
                .get("/api/request/123");
            expect(res.status).toBe(403);
        });
        it.concurrent("should return 401 if user is not authenticated", async () => {
            const mockRequest = {
                _id: "123",
                clientId: "123",
                jobName: "Software Developer",
                description: "Full stack developer",
                location: "Lagos",
            };
            (RequestSchema.parseAsync as jest.Mock).mockResolvedValue(mockRequest);
            (authMiddleware as jest.Mock).mockImplementation((req, res, next) => res.status(401).end());
            (clientRoleoleMiddleware as jest.Mock).mockImplementation((req, res, next) => next());
            const res = await request(app)
                .patch("/api/request/123")
                .send(mockRequest);
            expect(res.status).toBe(401);
        });
        it("should return 403 if user is not a client", async () => {
            const mockRequest = {
                _id: "123",
                clientId: "123",
                jobName: "Software Developer",
                description: "Full stack developer",
                location: "Lagos",
            };
            (RequestSchema.parseAsync as jest.Mock).mockResolvedValue(mockRequest);
            (authMiddleware as jest.Mock).mockImplementation((req, res, next) => next());
            (clientRoleoleMiddleware as jest.Mock).mockImplementation((req, res, next) => res.status(403).end());
            (requestService.updateRequest as jest.Mock).mockResolvedValue(mockRequest);
            const res = await request(app)
                .patch("/api/request/123")
                .send(mockRequest);
            expect(res.status).toBe(403);
        });
        it("should return 401 if user is not authenticated", async () => {
            const mockRequest = {
                _id: "123",
                clientId: "123",
                jobName: "Software Developer",
                description: "Full stack developer",
                location: "Lagos",
            };
            (RequestSchema.parseAsync as jest.Mock).mockResolvedValue(mockRequest);
            (authMiddleware as jest.Mock).mockImplementation((req, res, next) => res.status(401).end());
            (clientRoleoleMiddleware as jest.Mock).mockImplementation((req, res, next) => next());
            const res = await request(app)
                .delete("/api/request/123");
            expect(res.status).toBe(401);
        });
        it("should return 403 if user is not a client", async () => {
            const mockRequest = {
                _id: "123",
                clientId: "123",
                jobName: "Software Developer",
                description: "Full stack developer",
                location: "Lagos",
            };
            (RequestSchema.parseAsync as jest.Mock).mockResolvedValue(mockRequest);
            (authMiddleware as jest.Mock).mockImplementation((req, res, next) => next());
            (clientRoleoleMiddleware as jest.Mock).mockImplementation((req, res, next) => res.status(403).end());
            (requestService.deleteRequest as jest.Mock).mockResolvedValue(null);
            const res = await request(app)
                .delete("/api/request/123");
            expect(res.status).toBe(403);
        });
        it("should return 401 if user is not authenticated", async () => {
            (authMiddleware as jest.Mock).mockImplementation((req, res, next) => res.status(401).end());
            (clientRoleoleMiddleware as jest.Mock).mockImplementation((req, res, next) => next());
            const res = await request(app)
                .get("/api/request/client/123");
            expect(res.status).toBe(401);
        });
        it("should return 403 if user is not a client", async () => {
            (authMiddleware as jest.Mock).mockImplementation((req, res, next) => next());
            (clientRoleoleMiddleware as jest.Mock).mockImplementation((req, res, next) => res.status(403).end());
            (requestService.getRequestsByClientId as jest.Mock).mockResolvedValue([]);
            const res = await request(app)
                .get("/api/request/client/123");
            expect(res.status).toBe(403);
        });
    });


});