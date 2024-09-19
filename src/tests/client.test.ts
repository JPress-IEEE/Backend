import request from "supertest";
import express from "express";
import * as clientServices from "../services/client.services";
import { authMiddleware, clientRoleoleMiddleware, adminRoleMiddleware } from "../middlewares/auth.middleware";
import clientRouter from "../routes/client.route";
import { ClientSchema } from "../schemas/client.schema";
import { ZodError } from "zod";

jest.mock("../services/client.services", () => ({
    createClient: jest.fn(),
    getClientById: jest.fn(),
    getClients: jest.fn(),
    updateClient: jest.fn(),
    deleteClient: jest.fn(),
    getClientByUser: jest.fn(),
    uploadClientImage: jest.fn(),
    }));

jest.mock("../middlewares/auth.middleware", () => ({
    authMiddleware: jest.fn(),
    clientRoleoleMiddleware: jest.fn(),
    adminRoleMiddleware: jest.fn(),
    }));

jest.mock("../schemas/client.schema", () => ({
    ClientSchema: {
        parseAsync: jest.fn(),
    },
    }));

const app = express();
app.use(express.json());
app.use("/api/client", clientRouter);

describe("Client Router", () => {
    describe("POST /client", () => {
        it("should return 201 and the created client", async () => {
            const client = {
                _id: "1",
                userId: "1",
            };
            (authMiddleware as jest.Mock).mockImplementation((req, res, next) => next());
            (clientRoleoleMiddleware as jest.Mock).mockImplementation((req, res, next) => next());
            (ClientSchema.parseAsync as jest.Mock).mockResolvedValue(client);
            (clientServices.createClient as jest.Mock).mockResolvedValue(client);

            const response = await request(app)
                .post("/api/client")
                .send(client);
            expect(response.status).toBe(201);
        });
        it("should return 400 if the client is invalid", async () => {
            const client = {
                _id: "1",
                userId: "1",
            };
            (authMiddleware as jest.Mock).mockImplementation((req, res, next) => next());
            (clientRoleoleMiddleware as jest.Mock).mockImplementation((req, res, next) => next());
            (ClientSchema.parseAsync as jest.Mock).mockRejectedValue(new ZodError([]));
            (clientServices.createClient as jest.Mock).mockResolvedValue(client);

            const response = await request(app)
                .post("/api/client")
                .send(client);
            expect(response.status).toBe(400);
        });
    });
    describe("GET /client/:id", () => {
        it("should return 200 and the client", async () => {
            const client = {
                _id: "1",
                userId: "1",
            };
            (authMiddleware as jest.Mock).mockImplementation((req, res, next) => next());
            (clientRoleoleMiddleware as jest.Mock).mockImplementation((req, res, next) => next());
            (clientServices.getClientByUser as jest.Mock).mockResolvedValue([client]);
            (clientServices.getClientById as jest.Mock).mockResolvedValue(client);

            const response = await request(app)
                .get("/api/client/1")
                .send({ userId: "1" });
            expect(response.status).toBe(200);
        });
        it("should return 401 if the user is unauthorized", async () => {
            const client = {
                _id: "2",
                userId: "1",
            };
            (authMiddleware as jest.Mock).mockImplementation((req, res, next) => next());
            (clientRoleoleMiddleware as jest.Mock).mockImplementation((req, res, next) => {
                req.body.userId = "1";
                next();
            });
            (clientServices.getClientByUser as jest.Mock).mockResolvedValue([client]);
            (clientServices.getClientById as jest.Mock).mockResolvedValue(client);

            const response = await request(app)
                .get("/api/client/1")
                .send({ userId: "1" });
            expect(response.status).toBe(401);
        });
        it("should return 404 if the client is not found", async () => {
            (authMiddleware as jest.Mock).mockImplementation((req, res, next) => next());
            (clientRoleoleMiddleware as jest.Mock).mockImplementation((req, res, next) => {
                req.body.userId = "1";
                next();
            });
            (clientServices.getClientByUser as jest.Mock).mockImplementation(() => null);
            (clientServices.getClientById as jest.Mock).mockResolvedValue(null);

            const response = await request(app)
                .get("/api/client/1")
                .send({ userId: "1" });
            expect(response.status).toBe(404);
        });
    });
    describe("GET /client", () => {
        it("should return 200 and the clients", async () => {
            const clients = [
                {
                    _id: "1",
                    userId: "1",
                },
                {
                    _id: "2",
                    userId: "2",
                },
            ];
            (authMiddleware as jest.Mock).mockImplementation((req, res, next) => next());
            (adminRoleMiddleware as jest.Mock).mockImplementation((req, res, next) => next());
            (clientServices.getClients as jest.Mock).mockResolvedValue(clients);

            const response = await request(app)
                .get("/api/client");
            expect(response.status).toBe(200);
        });
    });
    describe("PUT /client/:id", () => {
        it("should return 200 and the updated client", async () => {
            const client = {
                _id: "1",
                userId: "1",
            };
            (authMiddleware as jest.Mock).mockImplementation((req, res, next) => next());
            (clientRoleoleMiddleware as jest.Mock).mockImplementation((req, res, next) => {
                req.body.userId = "1";
                next();
            });
            (clientServices.getClientByUser as jest.Mock).mockResolvedValue([client]);
            (clientServices.updateClient as jest.Mock).mockResolvedValue(client);

            const response = await request(app)
                .put("/api/client/1")
                .send({ userId: "1" });
            expect(response.status).toBe(200);
        });
        it("should return 401 if the user is unauthorized", async () => {
            const client = {
                _id: "2",
                userId: "1",
            };
            (authMiddleware as jest.Mock).mockImplementation((req, res, next) => next());
            (clientRoleoleMiddleware as jest.Mock).mockImplementation((req, res, next) => {
                req.body.userId = "1";
                next();
            });
            (clientServices.getClientByUser as jest.Mock).mockResolvedValue([client]);
            (clientServices.updateClient as jest.Mock).mockResolvedValue(client);

            const response = await request(app)
                .put("/api/client/1")
                .send({ userId: "1" });
            expect(response.status).toBe(401);
        });
    });
    describe("DELETE /client/:id", () => {
        it("should return 200 and the deleted client", async () => {
            const client = {
                _id: "1",
                userId: "1",
            };
            (authMiddleware as jest.Mock).mockImplementation((req, res, next) => next());
            (clientRoleoleMiddleware as jest.Mock).mockImplementation((req, res, next) => {
                req.body.userId = "1";
                next();
            });
            (clientServices.getClientByUser as jest.Mock).mockResolvedValue([client]);
            (clientServices.deleteClient as jest.Mock).mockResolvedValue(client);

            const response = await request(app)
                .delete("/api/client/1")
                .send({ userId: "1" });
            expect(response.status).toBe(200);
        });
        it("should return 401 if the user is unauthorized", async () => {
            const client = {
                _id: "2",
                userId: "1",
            };
            (authMiddleware as jest.Mock).mockImplementation((req, res, next) => next());
            (clientRoleoleMiddleware as jest.Mock).mockImplementation((req, res, next) => {
                req.body.userId = "1";
                next();
            });
            (clientServices.getClientByUser as jest.Mock).mockResolvedValue([client]);
            (clientServices.deleteClient as jest.Mock).mockResolvedValue(client);

            const response = await request(app)
                .delete("/api/client/1")
                .send({ userId: "1" });
            expect(response.status).toBe(401);
        });
    });
    describe("POST /client/:id/profile-pic", () => {
        it("should return 200 and the updated user", async () => {
            const client = {
                _id: "1",
                userId: "1",
            };
            (authMiddleware as jest.Mock).mockImplementation((req, res, next) => next());
            (clientRoleoleMiddleware as jest.Mock).mockImplementation((req, res, next) => {
                req.body.userId = "1";
                next();
            });
            (clientServices.getClientByUser as jest.Mock).mockResolvedValue([client]);
            (clientServices.uploadClientImage as jest.Mock).mockResolvedValue(client);

            const response = await request(app)
                .post("/api/client/1/profile-pic")
                .attach('profilePic', Buffer.from('fake file content'), 'profilePic.jpg');
            expect(response.status).toBe(200);
        });
    });
});
