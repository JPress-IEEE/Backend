import request from "supertest";
import express from "express";
import * as clientServices from "../services/client.services";
import { authMiddleware ,clientRoleoleMiddleware,adminRoleMiddleware} from "../middlewares/auth.middleware";
import clientRouter from "../routes/client.route";
import { ClientSchema } from "../schemas/client.schema";
import c from "config";
import { ZodError } from "zod";

jest.mock("../middlewares/auth.middleware", () => ({
    authMiddleware: jest.fn(),
    applicantRoleMiddleware: jest.fn(),
    clientRoleoleMiddleware: jest.fn(),
    adminRoleMiddleware: jest.fn(),
}));

jest.mock("../services/client.services", () => ({
    createClient: jest.fn(),
    getClientById: jest.fn(),
    getClients: jest.fn(),
    updateClient: jest.fn(),
    deleteClient: jest.fn(),
    uploadClientImage: jest.fn(),
}));

jest.mock("../schemas/client.schema", () => ({
    ClientSchema: {
        parseAsync: jest.fn(),
    },
}));

const app = express();
app.use(express.json());
app.use("/api/client", clientRouter);

describe("client route", () => {
    describe("POST /api/client", () => {
        it("should create a new client", async () => {
            const client = {
                userId: "userId",
                _id: "clientId",
            };
            (ClientSchema.parseAsync as jest.Mock).mockResolvedValue(client);
            (clientServices.createClient as jest.Mock).mockResolvedValue(client);
            (authMiddleware as jest.Mock).mockImplementation((req, res, next) => next());
            (clientRoleoleMiddleware as jest.Mock).mockImplementation((req, res, next) => {
                req.body.userId = "userId";
                next();
            });
            const res = await request(app)
                .post("/api/client")
                .send(client);
            expect(res.status).toBe(201);
            expect(res.body).toEqual(client);
        });
        it("should return 400 if client validation fails", async () => {
            const client = {
                userId: "userId",
                _id: "clientId",
            };
            const zodError = new ZodError([]);
            (authMiddleware as jest.Mock).mockImplementation((req, res, next) => next());
            (clientRoleoleMiddleware as jest.Mock).mockImplementation((req, res, next) => {
                req.body.userId = "userId";
                next();
            });
            (ClientSchema.parseAsync as jest.Mock).mockRejectedValue(zodError);
            const res = await request(app)
                .post("/api/client")
                .send(client);
            expect(res.status).toBe(400);
            expect(res.body).toEqual({ message: zodError.message });
        });
        it("should return 400 if client service throws an error", async () => {
            const client = {
                userId: "userId",
                _id: "clientId",
            };
            const error = new Error("error");
            (authMiddleware as jest.Mock).mockImplementation((req, res, next) => next());
            (clientRoleoleMiddleware as jest.Mock).mockImplementation((req, res, next) => {
                req.body.userId = "userId";
                next();
            });
            (ClientSchema.parseAsync as jest.Mock).mockResolvedValue(client);
            (clientServices.createClient as jest.Mock).mockRejectedValue(error);
            const res = await request(app)
                .post("/api/client")
                .send(client);
            expect(res.status).toBe(400);
            expect(res.body).toEqual({ message: error.message });
        });
        it("should return 401 if user is not a client", async () => {
            const client = {
                userId: "userId",
                _id: "clientId",
            };
            (authMiddleware as jest.Mock).mockImplementation((req, res, next) => next());
            (clientRoleoleMiddleware as jest.Mock).mockImplementation((req, res, next) => {
                res.status(401).send({ message: "Unauthorized" });
            });
            const res = await request(app)
                .post("/api/client")
                .send(client);
            expect(res.status).toBe(401);
            expect(res.body).toEqual({ message: "Unauthorized" });
        });
    });
    describe("GET /api/client/:id", () => {
        it("should get a client by id", async () => {
            const client = {
                userId: "1",
                _id: "1",
            };
            (clientServices.getClientById as jest.Mock).mockResolvedValue(client);
            (clientRoleoleMiddleware as jest.Mock).mockImplementation((req, res, next) => {
                req.body.userId = "1";
                next();
            });
            (authMiddleware as jest.Mock).mockImplementation((req, res, next) => next());
            const res = await request(app)
            .get(`/api/client/1`)

            expect(res.status).toBe(200);
            expect(res.body).toEqual(client);
        });
        it("should return 400 if client service throws an error", async () => {
            const client = {
                userId: "1",
                _id: "clientId",
            };
            const error = new Error("error");
            (authMiddleware as jest.Mock).mockImplementation((req, res, next) => next());
            (clientRoleoleMiddleware as jest.Mock).mockImplementation((req, res, next) => {
                req.body.userId = "1";
                next();
            });
            (clientServices.getClientById as jest.Mock).mockRejectedValue(error);
            const res = await request(app)
                .get("/api/client/1")
            expect(res.status).toBe(400);
            expect(res.body).toEqual({ message: error.message });
        });
    });
    describe("GET /api/client", () => {
        it("should get all clients", async () => {
            const clients = [
                {
                    userId: "1",
                    _id: "1",
                },
                {
                    userId: "2",
                    _id: "2",
                },
            ];
            (clientServices.getClients as jest.Mock).mockResolvedValue(clients);
            (adminRoleMiddleware as jest.Mock).mockImplementation((req, res, next) => next());
            (authMiddleware as jest.Mock).mockImplementation((req, res, next) => next());
            const res = await request(app)
                .get("/api/client");
            expect(res.status).toBe(200);
            expect(res.body).toEqual(clients);
        });
        it("should return 400 if client service throws an error", async () => {
            const error = new Error("error");
            (adminRoleMiddleware as jest.Mock).mockImplementation((req, res, next) => next());
            (authMiddleware as jest.Mock).mockImplementation((req, res, next) => next());
            (clientServices.getClients as jest.Mock).mockRejectedValue(error);
            const res = await request(app)
                .get("/api/client");
            expect(res.status).toBe(400);
            expect(res.body).toEqual({ message: error.message });
        });
    });
    describe("PUT /api/client/:id", () => {
        it("should update a client", async () => {
            const client = {
                userId: "1",
                _id: "1",
            };
            (ClientSchema.parseAsync as jest.Mock).mockResolvedValue(client);
            (clientServices.updateClient as jest.Mock).mockResolvedValue(client);
            (clientRoleoleMiddleware as jest.Mock).mockImplementation((req, res, next) => {
                req.body.userId = "1";
                next();
            });
            (authMiddleware as jest.Mock).mockImplementation((req, res, next) => next());
            const res = await request(app)
                .put("/api/client/1")
                .send(client);
            expect(res.status).toBe(200);
            expect(res.body).toEqual(client);
        });
        it("should return 400 if client validation fails", async () => {
            const client = {
                userId: "1",
                _id: "1",
            };
            const zodError = new ZodError([]);
            (authMiddleware as jest.Mock).mockImplementation((req, res, next) => next());
            (clientRoleoleMiddleware as jest.Mock).mockImplementation((req, res, next) => {
                req.body.userId = "1";
                next();
            });
            (ClientSchema.parseAsync as jest.Mock).mockRejectedValue(zodError);
            const res = await request(app)
                .put("/api/client/1")
                .send(client);
            expect(res.status).toBe(400);
            expect(res.body).toEqual({ message: zodError.message });
        });
        it("should return 400 if client service throws an error", async () => {
            const client = {
                userId: "1",
                _id: "1",
            };
            const error = new Error("error");
            (authMiddleware as jest.Mock).mockImplementation((req, res, next) => next());
            (clientRoleoleMiddleware as jest.Mock).mockImplementation((req, res, next) => {
                req.body.userId = "1";
                next();
            });
            (ClientSchema.parseAsync as jest.Mock).mockResolvedValue(client);
            (clientServices.updateClient as jest.Mock).mockRejectedValue(error);
            const res = await request(app)
                .put("/api/client/1")
                .send(client);
            expect(res.status).toBe(400);
            expect(res.body).toEqual({ message: error.message });
        });
        it("should return 401 if user is not a client", async () => {
            const client = {
                userId: "1",
                _id: "1",
            };
            (authMiddleware as jest.Mock).mockImplementation((req, res, next) => next());
            (clientRoleoleMiddleware as jest.Mock).mockImplementation((req, res, next) => {
                res.status(401).send({ message: "Unauthorized" });
            });
            const res = await request(app)
                .put("/api/client/1")
                .send(client);
            expect(res.status).toBe(401);
            expect(res.body).toEqual({ message: "Unauthorized" });
        });
    });
    describe("DELETE /api/client/:id", () => {
        it("should delete a client", async () => {
            const client = {
                userId: "1",
                _id: "1",
            };
            (clientServices.deleteClient as jest.Mock).mockResolvedValue(client);
            (clientRoleoleMiddleware as jest.Mock).mockImplementation((req, res, next) => {
                req.body.userId = "1";
                next();
            });
            (authMiddleware as jest.Mock).mockImplementation((req, res, next) => next());
            const res = await request(app)
                .delete("/api/client/1");
            expect(res.status).toBe(200);
            expect(res.body).toEqual(client);
        });
        it("should return 400 if client service throws an error", async () => {
            const error = new Error("error");
            (authMiddleware as jest.Mock).mockImplementation((req, res, next) => next());
            (clientRoleoleMiddleware as jest.Mock).mockImplementation((req, res, next) => {
                req.body.userId = "1";
                next();
            });
            (clientServices.deleteClient as jest.Mock).mockRejectedValue(error);
            const res = await request(app)
                .delete("/api/client/1");
            expect(res.status).toBe(400);
            expect(res.body).toEqual({ message: error.message });
        });
    });
    describe("POST /api/client/:id/profile-pic", () => {
        it("should upload a client image", async () => {
            const client = {
                userId: "1",
                _id: "1",
            };
            (clientServices.uploadClientImage as jest.Mock).mockResolvedValue(client);
            (clientRoleoleMiddleware as jest.Mock).mockImplementation((req, res, next) => {
                req.body.userId = "1";
                next();
            });
            (authMiddleware as jest.Mock).mockImplementation((req, res, next) => next());
            const res = await request(app)
                .post("/api/client/1/profile-pic");
            expect(res.status).toBe(200);
            expect(res.body).toEqual(client);
        });
        it("should return 400 if client service throws an error", async () => {
            const error = new Error("error");
            (authMiddleware as jest.Mock).mockImplementation((req, res, next) => next());
            (clientRoleoleMiddleware as jest.Mock).mockImplementation((req, res, next) => {
                req.body.userId = "1";
                next();
            });
            (clientServices.uploadClientImage as jest.Mock).mockRejectedValue(error);
            const res = await request(app)
                .post("/api/client/1/profile-pic");
            expect(res.status).toBe(400);
            expect(res.body).toEqual({ message: error.message });
        });
    });
});