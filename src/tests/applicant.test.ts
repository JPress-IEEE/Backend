import request from "supertest";
import express, { NextFunction, Request } from "express";
import applicantRouter from "../routes/applicant.route";
import * as applicantServices from "../services/applicant.services";
import { ApplicantSchema } from "../schemas/applicant.schema";
import {resumeUpload} from "../utils/upload.utils";
import { userSchema } from "../schemas/user.schema";
import * as userServices from "../services/user.services";
import * as APIFeatures from "../utils/APIFeatures.utils";
import { authMiddleware,applicantRoleMiddleware,adminRoleMiddleware} from "../middlewares/auth.middleware";
import { updateData ,deleteData} from "../services/recommendation.services";
import { getEmailByApplicantId } from "../services/applicant.services";
import fs from 'fs';
import path from 'path';
import mongoose from "mongoose";


jest.mock("../services/applicant.services", () => ({
    getApplicants: jest.fn(),
    getApplicantById: jest.fn(),
    createApplicant: jest.fn(),
    updateApplicant: jest.fn(),
    deleteApplicant: jest.fn(),
    uploadResume: jest.fn(),
    uploadProfilePic: jest.fn(),
    searchApplicants: jest.fn(),
    filterApplicants: jest.fn(),
    getEmailByApplicantId: jest.fn(),
    getApplicantByUserId: jest.fn(),
}));

jest.mock("../middlewares/auth.middleware", () => ({
    authMiddleware: jest.fn(),
    applicantRoleMiddleware: jest.fn(),
    adminRoleMiddleware:jest.fn(),
}));

jest.mock("../services/user.services", () => ({
    createUser: jest.fn(),
    getUserById: jest.fn(),
    updateUser: jest.fn(),
    deleteUser: jest.fn(),
}));

jest.mock("../schemas/user.schema", () => ({
    userSchema: {
        parse: jest.fn(),
        parseAsync: jest.fn(),
    },
}));

jest.mock("../services/recommendation.services", () => ({   
    updateData: jest.fn(),
    deleteData: jest.fn(),
}));

jest.mock('../schemas/applicant.schema', () => ({
    ApplicantSchema: {
        omit: jest.fn(),
        parse: jest.fn(),
        parseAsync:jest.fn(),
    },
}));

const app = express();
app.use(express.json());
app.use("/api/applicant", applicantRouter);

describe("applicant routes", ()=>{
    describe("GET /api/applicant", ()=>{
        it("should return all applicants", async ()=>{
            const applicants = [
                {
                    _id: "1",
                    userId: "1",
                    resume: "resume",
                    location: "location",
                    summary: "description",
                    jobName: "jobName",
                },
            ];
            (authMiddleware as jest.Mock).mockImplementation((req, res, next) => next());  
            (adminRoleMiddleware as jest.Mock).mockImplementation((req, res, next) => next());
            (applicantServices.getApplicants as jest.Mock).mockResolvedValue(applicants);
            const response = await request(app).get("/api/applicant");
            expect(response.status).toBe(200);
            expect(response.body).toEqual(applicants);
        });
        it("should return 500 if getApplicants throws an error", async ()=>{
            (authMiddleware as jest.Mock).mockImplementation((req, res, next) => next());
            (adminRoleMiddleware as jest.Mock).mockImplementation((req, res, next) => next());
            (applicantServices.getApplicants as jest.Mock).mockRejectedValue(new Error());
            const response = await request(app).get("/api/applicant");
            expect(response.status).toBe(500);
        });
    });
    describe("GET /api/applicant/:id", ()=>{
        it("should return an applicant by id", async ()=>{
            const applicant = {
                _id: "1",
                userId: "1",
                resume: "resume",
                location: "location",
                summary: "description",
                jobName: "jobName",
            };
            (authMiddleware as jest.Mock).mockImplementation((req, res, next) => next());
            (applicantServices.getApplicantByUserId as jest.Mock).mockResolvedValue(applicant);  
            (applicantRoleMiddleware as jest.Mock).mockImplementation((req, res, next) => {
                req.body.userId = "1";
                next();
            });
            (applicantServices.getApplicantById as jest.Mock).mockResolvedValue(applicant);
            const response = await request(app).get("/api/applicant/1");
            expect(response.status).toBe(200);
            expect(response.body).toEqual(applicant);
        });
        it("should return 500 if getApplicantById throws an error", async ()=>{
            const applicant = {
                _id: "1",
                userId: "1",
                resume: "resume",
                location: "location",
                summary: "description",
                jobName: "jobName",
            };
            (applicantServices.getApplicantByUserId as jest.Mock).mockResolvedValue(applicant);  
            (authMiddleware as jest.Mock).mockImplementation((req, res, next) => next());
            (applicantRoleMiddleware as jest.Mock).mockImplementation((req, res, next) => {
                req.body.userId = "1";
                next();
            });
            (applicantServices.getApplicantById as jest.Mock).mockRejectedValue(new Error());
            const response = await request(app).get("/api/applicant/1");
            expect(response.status).toBe(500);
        });
    });
    describe("POST /api/applicant", ()=>{
        it("should create an applicant", async ()=>{
            const applicant = {
                _id: "1",
                userId: "1",
                resume: "resume",
                location: "location",
                summary: "description",
                jobName: "jobName",
            };
            (applicantServices.getApplicantByUserId as jest.Mock).mockResolvedValue(applicant); 
            (authMiddleware as jest.Mock).mockImplementation((req, res, next) => next());
            (applicantRoleMiddleware as jest.Mock).mockImplementation((req, res, next) => {
                req.body.userId = "1";
                next();
            });
            (applicantServices.createApplicant as jest.Mock).mockResolvedValue(applicant);
            (ApplicantSchema.parseAsync as jest.Mock).mockResolvedValue(applicant);
            const response = await request(app).post("/api/applicant").send(applicant);
            expect(response.status).toBe(201);
            expect(response.body).toEqual(applicant);
        });
        it("should return 500 if createApplicant throws an error", async ()=>{
            const applicant = {
                _id: "1",
                userId: "1",
                resume: "resume",
                location: "location",
                summary: "description",
                jobName: "jobName",
            };
            (applicantServices.getApplicantByUserId as jest.Mock).mockResolvedValue(applicant); 
            (authMiddleware as jest.Mock).mockImplementation((req, res, next) => next());
            (applicantRoleMiddleware as jest.Mock).mockImplementation((req, res, next) => {
                req.body.userId = "1";
                next();
            });
            (ApplicantSchema.parseAsync as jest.Mock).mockResolvedValue({} as any);
            (applicantServices.createApplicant as jest.Mock).mockRejectedValue(new Error());
            const response = await request(app).post("/api/applicant");
            expect(response.status).toBe(500);
        });
    });
    describe("PUT /api/applicant/:id", ()=>{
        it("should update an applicant", async ()=>{
            const applicant = {
                _id: "1",
                userId: "1",
                resume: "resume",
                location: "location",
                summary: "description",
                jobName: "jobName",
            };
            (applicantServices.getApplicantByUserId as jest.Mock).mockResolvedValue(applicant); 
            (authMiddleware as jest.Mock).mockImplementation((req, res, next) => next());
            (applicantRoleMiddleware as jest.Mock).mockImplementation((req, res, next) => {
                req.body.userId = "1";
                next();
            });
            (getEmailByApplicantId as jest.Mock).mockResolvedValue("email");
            (updateData as jest.Mock).mockResolvedValue(undefined);
            (applicantServices.updateApplicant as jest.Mock).mockResolvedValue(applicant);
            (ApplicantSchema.parse as jest.Mock).mockResolvedValue(applicant);
            const response = await request(app).put("/api/applicant/1").send(applicant);
            expect(response.status).toBe(200);
            expect(response.body).toEqual(applicant);
        });
        it("should return 500 if updateApplicant throws an error", async ()=>{
            (authMiddleware as jest.Mock).mockImplementation((req, res, next) => next());
            (applicantRoleMiddleware as jest.Mock).mockImplementation((req, res, next) => {
                req.body.userId = "1";
                next();
            });
            (getEmailByApplicantId as jest.Mock).mockResolvedValue("email");
            (updateData as jest.Mock).mockResolvedValue(undefined);
            (applicantServices.updateApplicant as jest.Mock).mockRejectedValue(new Error());
            const response = await request(app).put("/api/applicant/1");
            expect(response.status).toBe(500);
        });
    });
    describe("DELETE /api/applicant/:id", ()=>{
        it("should delete an applicant", async ()=>{
            const applicant = {
                _id: "1",
                userId: "1",
                resume: "resume",
                location: "location",
                summary: "description",
                jobName: "jobName",
            };
            (applicantServices.getApplicantByUserId as jest.Mock).mockResolvedValue(applicant); 
            (authMiddleware as jest.Mock).mockImplementation((req, res, next) => next());
            (applicantRoleMiddleware as jest.Mock).mockImplementation((req, res, next) => {
                req.body.userId = "1";
                next();
            });

            (applicantServices.deleteApplicant as jest.Mock).mockResolvedValue(applicant);
            (getEmailByApplicantId as jest.Mock).mockResolvedValue("email");
            (updateData as jest.Mock).mockResolvedValue(undefined);
            const response = await request(app).delete("/api/applicant/1");
            expect(response.status).toBe(200);
            expect(response.body).toEqual(applicant);
        });
        it("should return 500 if deleteApplicant throws an error", async ()=>{
            (authMiddleware as jest.Mock).mockImplementation((req, res, next) => next());
            (applicantRoleMiddleware as jest.Mock).mockImplementation((req, res, next) => {
                req.body.userId = "1";
                next();
            });
            (getEmailByApplicantId as jest.Mock).mockResolvedValue("email");
            (updateData as jest.Mock).mockResolvedValue(undefined);
            (applicantServices.deleteApplicant as jest.Mock).mockRejectedValue(new Error());
            const response = await request(app).delete("/api/applicant/1");
            expect(response.status).toBe(500);
        });
    });
    
    describe('uploadResume', () => {
        it("should upload a resume", async () => {
            const applicant = {
                _id: "66ec7fe7040a274645fcc7bb", 
                userId: "1",
                resume: "resume",
                location: "location",
                summary: "description",
                jobName: "jobName",
            };
        
            (applicantServices.getApplicantByUserId as jest.Mock).mockResolvedValue(applicant);
            (authMiddleware as jest.Mock).mockImplementation((req, res, next) => next());
            (applicantRoleMiddleware as jest.Mock).mockImplementation((req, res, next) => {
                req.body.userId = "1"; 
                next();
            });
            (applicantServices.uploadResume as jest.Mock).mockResolvedValue(applicant);
        
            const response = await request(app)
                .put(`/api/applicant/${applicant._id}/resume`)
                .attach('resume', Buffer.from('fake file content'), 'resume.pdf');
        
            expect(response.status).toBe(200);
            expect(response.body).toEqual(applicant);
        });
    });

    describe('uploadProfilePic', () => {
        it("should upload a profile picture", async () => {
            const applicant = {
                _id: "66ec7fe7040a274645fcc7bb", 
                userId: "1",
                resume: "resume",
                location: "location",
                summary: "description",
                jobName: "jobName",
            };
        
            (applicantServices.getApplicantByUserId as jest.Mock).mockResolvedValue(applicant);
            (authMiddleware as jest.Mock).mockImplementation((req, res, next) => next());
            (applicantRoleMiddleware as jest.Mock).mockImplementation((req, res, next) => {
                req.body.userId = "1"; 
                next();
            });
            (applicantServices.uploadProfilePic as jest.Mock).mockResolvedValue(applicant);
        
            const response = await request(app)
                .put(`/api/applicant/${applicant._id}/profile-pic`)
                .attach('profilePic', Buffer.from('fake file content'), 'profilePic.jpg');
        
            expect(response.status).toBe(200);
            expect(response.body).toEqual(applicant);
        });
    });
});
