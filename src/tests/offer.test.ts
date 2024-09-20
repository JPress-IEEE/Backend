import request from "supertest";
import express from "express";
import * as offerServices from "../services/offer.services";
import { OfferSchema } from "../schemas/offer.schema";
import { adminRoleMiddleware, authMiddleware,clientRoleoleMiddleware,applicantRoleMiddleware} from "../middlewares/auth.middleware";
import { ZodError } from "zod";
import offerRouter from "../routes/offer.route";
import { get } from "axios";
import * as requestServices from "../services/request.services";
import {getUserIdByApplicantId} from '../services/applicant.services';
import { getUserByClient} from '../services/client.services';

jest.mock("../middlewares/auth.middleware", () => ({
    authMiddleware: jest.fn(),
    applicantRoleMiddleware: jest.fn(),
    clientRoleoleMiddleware: jest.fn(),
    adminRoleMiddleware: jest.fn(),
}));

jest.mock("../services/request.services", () => ({
    getClientIdFromRequestId: jest.fn(),
}));

jest.mock("../services/offer.services", () => ({
    getOffers: jest.fn(),
    getOfferById: jest.fn(),
    createOffer: jest.fn(),
    updateOffer: jest.fn(),
    deleteOffer: jest.fn(),
    deleteOfferByRequestId: jest.fn(),
    getOffersByApplicantId: jest.fn(),
    deleteOfferByApplicantId: jest.fn(),
    getOffersByRequestId: jest.fn(),
    getApplicantsByRequestId: jest.fn(),
    selectOffer: jest.fn(),
    getRequestIdFromOfferId: jest.fn(),
}));

jest.mock("../schemas/offer.schema", () => ({
    OfferSchema:{
        parse: jest.fn(),
        parseAsync: jest.fn(),
    }
}));

jest.mock("../services/applicant.services", () => ({
    getUserIdByApplicantId: jest.fn(),
}));

jest.mock("../services/client.services", () => ({
    getUserByClient: jest.fn(),
}));

const app = express();
app.use(express.json());
app.use("/api/offer", offerRouter);

describe("Offer routes", () => {
    describe("GET /api/offer", () => {
        test("should return all offers", async () => {
            const offers = [{}, {}];
            (authMiddleware as jest.Mock).mockImplementation((req, res, next) => next());
            (adminRoleMiddleware as jest.Mock).mockImplementation((req, res, next) => next());
            (offerServices.getOffers as jest.Mock).mockResolvedValue(offers);
            const response = await request(app).get("/api/offer");
        });
    });
    describe("GET /api/offer/:offerId", () => {
        test("should return an offer by id", async () => {
            const offer = {};
            (authMiddleware as jest.Mock).mockImplementation((req, res, next) => next());
            (applicantRoleMiddleware as jest.Mock).mockImplementation((req, res, next) => next());
            (offerServices.getOfferById as jest.Mock).mockResolvedValue(offer);
            const response = await request(app).get("/api/offer/1");
        });
    });
    describe("POST /api/offer", () => {
        test("should create an offer", async () => {
            const offer = {};
            (authMiddleware as jest.Mock).mockImplementation((req, res, next) => next());
            (applicantRoleMiddleware as jest.Mock).mockImplementation((req, res, next) => next());
            (OfferSchema.parseAsync as jest.Mock).mockResolvedValue(offer);
            (offerServices.createOffer as jest.Mock).mockResolvedValue(offer);
            const response = await request(app).post("/api/offer").send(offer);
        });
    });
    describe("PUT /api/offer/:offerId", () => {
        test("should update an offer", async () => {
            const offer = {};
            (getUserIdByApplicantId as jest.Mock).mockResolvedValue("1");
            (authMiddleware as jest.Mock).mockImplementation((req, res, next) => next());
            (applicantRoleMiddleware as jest.Mock).mockImplementation((req, res, next) => next());
            (offerServices.updateOffer as jest.Mock).mockResolvedValue(offer);
            const response = await request(app).put("/api/offer/1").send(offer);
        });
    });
    describe("DELETE /api/offer/:offerId", () => {
        test("should delete an offer", async () => {
            (offerServices.getRequestIdFromOfferId as jest.Mock).mockResolvedValue("1");
            (requestServices.getClientIdFromRequestId as jest.Mock).mockResolvedValue("1");   
            (getUserByClient as jest.Mock).mockResolvedValue("1");
            (authMiddleware as jest.Mock).mockImplementation((req, res, next) => next());
            (applicantRoleMiddleware as jest.Mock).mockImplementation((req, res, next) => next());
            (offerServices.deleteOffer as jest.Mock).mockResolvedValue({});
            const response = await request(app).delete("/api/offer/1");
        });
    });
    describe("DELETE /api/offer/request/:requestId", () => {
        test("should delete an offer by request id", async () => {
            (offerServices.getRequestIdFromOfferId as jest.Mock).mockResolvedValue("1");
            (requestServices.getClientIdFromRequestId as jest.Mock).mockResolvedValue("1");   
            (getUserByClient as jest.Mock).mockResolvedValue("1");
            (authMiddleware as jest.Mock).mockImplementation((req, res, next) => next());
            (applicantRoleMiddleware as jest.Mock).mockImplementation((req, res, next) => next());
            (offerServices.deleteOfferByRequestId as jest.Mock).mockResolvedValue({});
            const response = await request(app).delete("/api/offer/request/1");
        });
    });
    describe("DELETE /api/offer/applicant/:applicantId", () => {
        test("should delete an offer by applicant id", async () => {
            (authMiddleware as jest.Mock).mockImplementation((req, res, next) => next());
            (applicantRoleMiddleware as jest.Mock).mockImplementation((req, res, next) => next());
            (offerServices.deleteOfferByApplicantId as jest.Mock).mockResolvedValue({});
            const response = await request(app).delete("/api/offer/applicant/1");
        });
    });
    describe("GET /api/offer/request/:requestId", () => {
        test("should return offers by request id", async () => {
            (authMiddleware as jest.Mock).mockImplementation((req, res, next) => next());
            (clientRoleoleMiddleware as jest.Mock).mockImplementation((req, res, next) => next());
            (offerServices.getOffersByRequestId as jest.Mock).mockResolvedValue({});
            const response = await request(app).get("/api/offer/request/1");
        });
    });
    describe("GET /api/offer/request/:requestId/applicants", () => {
        test("should return applicants by request id", async () => {
            (authMiddleware as jest.Mock).mockImplementation((req, res, next) => next());
            (clientRoleoleMiddleware as jest.Mock).mockImplementation((req, res, next) => next());
            (offerServices.getApplicantsByRequestId as jest.Mock).mockResolvedValue({});
            const response = await request(app).get("/api/offer/request/1/applicants");
        });
    });
    describe("PUT /api/offer/:offerId/select", () => {
        test("should select an offer", async () => {
            (authMiddleware as jest.Mock).mockImplementation((req, res, next) => next());
            (clientRoleoleMiddleware as jest.Mock).mockImplementation((req, res, next) => next());
            (offerServices.selectOffer as jest.Mock).mockResolvedValue({});
            const response = await request(app).put("/api/offer/1/select");
        });
    });
});

describe("Offer routes errors", () => {
    describe("GET /api/offer", () => {
        test("should return 500 if getOffers throws an error", async () => {
            (authMiddleware as jest.Mock).mockImplementation((req, res, next) => next());
            (adminRoleMiddleware as jest.Mock).mockImplementation((req, res, next) => next());
            (offerServices.getOffers as jest.Mock).mockRejectedValue(new Error());
            const response = await request(app).get("/api/offer");
            expect(response.status).toBe(500);
        });
    });
    describe("GET /api/offer/:offerId", () => {
        test("should return 500 if getOfferById throws an error", async () => {
            (authMiddleware as jest.Mock).mockImplementation((req, res, next) => next());
            (applicantRoleMiddleware as jest.Mock).mockImplementation((req, res, next) => next());
            (offerServices.getOfferById as jest.Mock).mockRejectedValue(new Error());
            const response = await request(app).get("/api/offer/1");
            expect(response.status).toBe(500);
        });
    });
    describe("POST /api/offer", () => {
        test("should return 500 if createOffer throws an error", async () => {
            (authMiddleware as jest.Mock).mockImplementation((req, res, next) => next());
            (applicantRoleMiddleware as jest.Mock).mockImplementation((req, res, next) => next());
            (OfferSchema.parseAsync as jest.Mock).mockResolvedValue({});
            (offerServices.createOffer as jest.Mock).mockRejectedValue(new Error());
            const response = await request(app).post("/api/offer");
            expect(response.status).toBe(500);
        });
        test("should return 400 if schema validation fails", async () => {
            (authMiddleware as jest.Mock).mockImplementation((req, res, next) => next());
            (applicantRoleMiddleware as jest.Mock).mockImplementation((req, res, next) => next());
            (OfferSchema.parseAsync as jest.Mock).mockRejectedValue(new ZodError([]));
            const response = await request(app).post("/api/offer");
            expect(response.status).toBe(400);
        });
    });
    describe("PUT /api/offer/:offerId", () => {
        test("should return 500 if updateOffer throws an error", async () => {
            (getUserIdByApplicantId as jest.Mock).mockResolvedValue("1");
            (authMiddleware as jest.Mock).mockImplementation((req, res, next) => next());
            (applicantRoleMiddleware as jest.Mock).mockImplementation((req, res, next) => next());
            (offerServices.updateOffer as jest.Mock).mockRejectedValue(new Error());
            const response = await request(app).put("/api/offer/1");
            expect(response.status).toBe(500);
        });
    });
    describe("DELETE /api/offer/applicant/:applicantId", () => {
        test("should return 500 if deleteOfferByApplicantId throws an error", async () => {
            (authMiddleware as jest.Mock).mockImplementation((req, res, next) => next());
            (applicantRoleMiddleware as jest.Mock).mockImplementation((req, res, next) => next());
            (offerServices.deleteOfferByApplicantId as jest.Mock).mockRejectedValue(new Error());
            const response = await request(app).delete("/api/offer/applicant/1");
            expect(response.status).toBe(500);
        });
    });
    describe("GET /api/offer/request/:requestId", () => {
        test("should return 500 if getOffersByRequestId throws an error", async () => {
            (authMiddleware as jest.Mock).mockImplementation((req, res, next) => next());
            (clientRoleoleMiddleware as jest.Mock).mockImplementation((req, res, next) => next());
            (offerServices.getOffersByRequestId as jest.Mock).mockRejectedValue(new Error());
            const response = await request(app).get("/api/offer/request/1");
            expect(response.status).toBe(500);
        });
    });
    describe("GET /api/offer/request/:requestId/applicants", () => {
        test("should return 500 if getApplicantsByRequestId throws an error", async () => {
            (authMiddleware as jest.Mock).mockImplementation((req, res, next) => next());
            (clientRoleoleMiddleware as jest.Mock).mockImplementation((req, res, next) => next());
            (offerServices.getApplicantsByRequestId as jest.Mock).mockRejectedValue(new Error());
            const response = await request(app).get("/api/offer/request/1/applicants");
            expect(response.status).toBe(500);
        });
    });
    describe("PUT /api/offer/:offerId/select", () => {
        test("should return 500 if selectOffer throws an error", async () => {
            (authMiddleware as jest.Mock).mockImplementation((req, res, next) => next());
            (clientRoleoleMiddleware as jest.Mock).mockImplementation((req, res, next) => next());
            (offerServices.selectOffer as jest.Mock).mockRejectedValue(new Error());
            const response = await request(app).put("/api/offer/1/select");
            expect(response.status).toBe(500);
        });
    });
});

describe("Offer authorization", () => { 
    describe("GET /api/offer", () => {
        test("should return 401 if no access token is provided", async () => {
            (authMiddleware as jest.Mock).mockImplementation((req, res, next) => res.status(401).send());
            (adminRoleMiddleware as jest.Mock).mockImplementation((req, res, next) => next());
            const response = await request(app).get("/api/offer");
            expect(response.status).toBe(401);
        });
    });
    describe("GET /api/offer/:offerId", () => {
        test("should return 401 if no access token is provided", async () => {
            (authMiddleware as jest.Mock).mockImplementation((req, res, next) => res.status(401).send());
            (applicantRoleMiddleware as jest.Mock).mockImplementation((req, res, next) => next());
            const response = await request(app).get("/api/offer/1");
            expect(response.status).toBe(401);
        });
    });
    describe("POST /api/offer", () => {
        test("should return 401 if no access token is provided", async () => {
            (authMiddleware as jest.Mock).mockImplementation((req, res, next) => res.status(401).send());
            (applicantRoleMiddleware as jest.Mock).mockImplementation((req, res, next) => next());
            const response = await request(app).post("/api/offer");
            expect(response.status).toBe(401);
        });
    });
    describe("PUT /api/offer/:offerId", () => {
        test("should return 401 if no access token is provided", async () => {
            (getUserIdByApplicantId as jest.Mock).mockResolvedValue("1");
            (authMiddleware as jest.Mock).mockImplementation((req, res, next) => res.status(401).send());
            (applicantRoleMiddleware as jest.Mock).mockImplementation((req, res, next) => next());
            (offerServices.updateOffer as jest.Mock).mockResolvedValue({});
            const response = await request(app).put("/api/offer/1");
            expect(response.status).toBe(401);
        });
    });
    describe("DELETE /api/offer/:offerId", () => {
        test("should return 401 if no access token is provided", async () => {
            (offerServices.getRequestIdFromOfferId as jest.Mock).mockResolvedValue("1");
            (requestServices.getClientIdFromRequestId as jest.Mock).mockResolvedValue("1");
            (getUserByClient as jest.Mock).mockResolvedValue("1");
            (authMiddleware as jest.Mock).mockImplementation((req, res, next) => res.status(401).send());
            (applicantRoleMiddleware as jest.Mock).mockImplementation((req, res, next) => next());
            const response = await request(app).delete("/api/offer/1");
            expect(response.status).toBe(401);
        });
    });
    describe("DELETE /api/offer/request/:requestId", () => {
        test("should return 401 if no access token is provided", async () => {
            (offerServices.getRequestIdFromOfferId as jest.Mock).mockResolvedValue("1");
            (requestServices.getClientIdFromRequestId as jest.Mock).mockResolvedValue("1");
            (getUserByClient as jest.Mock).mockResolvedValue("1");
            (authMiddleware as jest.Mock).mockImplementation((req, res, next) => res.status(401).send());
            (applicantRoleMiddleware as jest.Mock).mockImplementation((req, res, next) => next());
            const response = await request(app).delete("/api/offer/request/1");
            expect(response.status).toBe(401);
        });
    });
    describe("DELETE /api/offer/applicant/:applicantId", () => {
        test("should return 401 if no access token is provided", async () => {
            (authMiddleware as jest.Mock).mockImplementation((req, res, next) => res.status(401).send());
            (applicantRoleMiddleware as jest.Mock).mockImplementation((req, res, next) => next());
            const response = await request(app).delete("/api/offer/applicant/1");
            expect(response.status).toBe(401);
        });
    });
    describe("GET /api/offer/request/:requestId", () => {
        test("should return 401 if no access token is provided", async () => {
            (authMiddleware as jest.Mock).mockImplementation((req, res, next) => res.status(401).send());
            (clientRoleoleMiddleware as jest.Mock).mockImplementation((req, res, next) => next());
            (offerServices.getOffersByRequestId as jest.Mock).mockResolvedValue({});
            const response = await request(app).get("/api/offer/request/1");
            expect(response.status).toBe(401);
        });
    });
    describe("GET /api/offer/request/:requestId/applicants", () => {
        test("should return 401 if no access token is provided", async () => {
            (authMiddleware as jest.Mock).mockImplementation((req, res, next) => res.status(401).send());
            (clientRoleoleMiddleware as jest.Mock).mockImplementation((req, res, next) => next());
            const response = await request(app).get("/api/offer/request/1/applicants");
            expect(response.status).toBe(401);
        });
    });
    describe("PUT /api/offer/:offerId/select", () => {
        test("should return 401 if no access token is provided", async () => {
            (authMiddleware as jest.Mock).mockImplementation((req, res, next) => res.status(401).send());
            (clientRoleoleMiddleware as jest.Mock).mockImplementation((req, res, next) => next());
            const response = await request(app).put("/api/offer/1/select");
            expect(response.status).toBe(401);
        });
    });
    describe("GET /api/offer", () => {
        test("should return 401 if user is not an admin", async () => {
            (authMiddleware as jest.Mock).mockImplementation((req, res, next) => next());
            (adminRoleMiddleware as jest.Mock).mockImplementation((req, res, next) => res.status(403).send());
            const response = await request(app).get("/api/offer");
            expect(response.status).toBe(403);
        });
    });
    describe("GET /api/offer/:offerId", () => {
        test("should return 401 if user is not an applicant", async () => {
            (authMiddleware as jest.Mock).mockImplementation((req, res, next) => next());
            (applicantRoleMiddleware as jest.Mock).mockImplementation((req, res, next) => res.status(403).send());
            const response = await request(app).get("/api/offer/1");
            expect(response.status).toBe(403);
        });
    });
    describe("POST /api/offer", () => {
        test("should return 401 if user is not an applicant", async () => {
            (authMiddleware as jest.Mock).mockImplementation((req, res, next) => next());
            (applicantRoleMiddleware as jest.Mock).mockImplementation((req, res, next) => res.status(403).send());
            const response = await request(app).post("/api/offer");
            expect(response.status).toBe(403);
        });
    });
    describe("PUT /api/offer/:offerId", () => {
        test("should return 401 if user is not an applicant", async () => {
            (getUserIdByApplicantId as jest.Mock).mockResolvedValue("1");
            (authMiddleware as jest.Mock).mockImplementation((req, res, next) => next());
            (applicantRoleMiddleware as jest.Mock).mockImplementation((req, res, next) => res.status(403).send());
            const response = await request(app).put("/api/offer/1");
            expect(response.status).toBe(403);
        });
    });
    describe("DELETE /api/offer/:offerId", () => {
        test("should return 401 if user is not an applicant", async () => {
            (offerServices.getRequestIdFromOfferId as jest.Mock).mockResolvedValue("1");
            (requestServices.getClientIdFromRequestId as jest.Mock).mockResolvedValue("1");
            (getUserByClient as jest.Mock).mockResolvedValue("1");
            (authMiddleware as jest.Mock).mockImplementation((req, res, next) => next());
            (applicantRoleMiddleware as jest.Mock).mockImplementation((req, res, next) => res.status(403).send());
            const response = await request(app).delete("/api/offer/1");
            expect(response.status).toBe(403);
        });
    });
    describe("DELETE /api/offer/request/:requestId", () => {
        test("should return 401 if user is not an applicant", async () => {
            (offerServices.getRequestIdFromOfferId as jest.Mock).mockResolvedValue("1");
            (requestServices.getClientIdFromRequestId as jest.Mock).mockResolvedValue("1");
            (getUserByClient as jest.Mock).mockResolvedValue("1");
            (authMiddleware as jest.Mock).mockImplementation((req, res, next) => next());
            (applicantRoleMiddleware as jest.Mock).mockImplementation((req, res, next) => res.status(403).send());
            const response = await request(app).delete("/api/offer/request/1");
            expect(response.status).toBe(403);
        });
    });
    describe("DELETE /api/offer/applicant/:applicantId", () => {
        test("should return 401 if user is not an applicant", async () => {
            (authMiddleware as jest.Mock).mockImplementation((req, res, next) => next());
            (applicantRoleMiddleware as jest.Mock).mockImplementation((req, res, next) => res.status(403).send());
            const response = await request(app).delete("/api/offer/applicant/1");
            expect(response.status).toBe(403);
        });
    });
    describe("GET /api/offer/request/:requestId", () => {
        test("should return 401 if user is not a client", async () => {
            (authMiddleware as jest.Mock).mockImplementation((req, res, next) => next());
            (clientRoleoleMiddleware as jest.Mock).mockImplementation((req, res, next) => res.status(403).send());
            const response = await request(app).get("/api/offer/request/1");
            expect(response.status).toBe(403);
        });
    });
    describe("GET /api/offer/request/:requestId/applicants", () => {
        test("should return 401 if user is not a client", async () => {
            (authMiddleware as jest.Mock).mockImplementation((req, res, next) => next());
            (clientRoleoleMiddleware as jest.Mock).mockImplementation((req, res, next) => res.status(403).send());
            const response = await request(app).get("/api/offer/request/1/applicants");
            expect(response.status).toBe(403);
        });
    });
    describe("PUT /api/offer/:offerId/select", () => {
        test("should return 401 if user is not a client", async () => {
            (authMiddleware as jest.Mock).mockImplementation((req, res, next) => next());
            (clientRoleoleMiddleware as jest.Mock).mockImplementation((req, res, next) => res.status(403).send());
            const response = await request(app).put("/api/offer/1/select");
            expect(response.status).toBe(403);
        });
    });
});

   