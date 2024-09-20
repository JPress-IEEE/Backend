import { Request, Response, NextFunction } from 'express';
import * as applicantServices from '../services/applicant.services';
import { IApplicant } from '../models/applicant.model';
import { ApplicantSchema } from '../schemas/applicant.schema';
import { userSchema } from '../schemas/user.schema';
import { storeData, updateData, deleteData } from '../services/recommendation.services';
import { getApplicantById, getEmailByApplicantId } from '../services/applicant.services';
import mongoose, { mongo } from 'mongoose';


export const getApplicants = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const queryStr = req.query as unknown as string;
        const applicants = await applicantServices.getApplicants(queryStr);
        res.status(200).send(applicants);
    } catch (error) {
        next(error);
    }
};

export const getApplicant = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = req.params.id;
        if (!id) {
            return res.status(400).send({ error: 'Applicant id is required.' });
        }
        const applicant = await getApplicantById(id) as any;
        if (applicant?.userId.toString() !== req.body.userId) {
            res.status(401).send({ error: 'Unauthorized' });
        }
        res.status(200).send(applicant);

    } catch (error: any) {
        console.log("Error in controller:", error.message);
        next(error);
    }
}

export const createApplicant = async (req: Request, res: Response , next:NextFunction) => {
    try {
        const resume = req.file?.filename as unknown as string;
        const applicant ={
            userId: req.body.userId,
            resume: resume,
            location: req.body.location,
            summary: req.body.summary,
            jobName: req.body.jobName,
        }
        console.log("Applicant:", applicant);

        const result = await ApplicantSchema.parseAsync(applicant) as IApplicant;
        if(!result){
            return res.status(400).send({error: 'Applicant is required.'});
        }
        const newApplicant = await applicantServices.createApplicant(result);
        res.status(201).send(newApplicant);
    } catch (error:any) {
        console.log("Error in controller:", error.message);
        next(error);
    }
};


export const updateApplicant = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = req.params.id;

        if (!id) {
            return res.status(400).send({ error: 'Applicant id is required.' });
        }
        const applicantId = await applicantServices.getApplicantByUserId(req.body.userId) as any;
        if (applicantId?.userId.toString() !== req.body.userId) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        };
        const applicant = {
            userId: req.body.userId,
            location: req.body.location,
            summary: req.body.summary,
            jobName: req.body.jobName,
            resume: req.file?.filename as unknown as string,
        }
        const result = await ApplicantSchema.parseAsync(applicant) as IApplicant;
        const updatedApplicant = await applicantServices.updateApplicant(id.toString(), result);
        const email = await getEmailByApplicantId(id.toString());
        if (updatedApplicant && email) {
            await updateData(email, updatedApplicant.summary);
        }
        res.status(200).send(updatedApplicant);
    } catch (error: any) {
        console.log("Error in controller:", error.message);
        next(error);
    }
};

export const deleteApplicant = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = req.params.id;

        if (!id) {
            return res.status(400).send({ error: 'Applicant id is required.' });
        }
        const applicantId = await applicantServices.getApplicantByUserId(req.body.userId) as any;
        if(applicantId?.userId.toString() !== req.body.userId) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }
        const email = await getEmailByApplicantId(id.toString());
        if (email) {
            await deleteData(email);
        } else {
            return res.status(400).json({ error: 'Email is required to delete data.' });
        }
        const deletedApplicant = await applicantServices.deleteApplicant(id.toString());
        if (!deletedApplicant) {
            return res.status(404).json({ error: 'Applicant not found.' });
        }
        console.log("Deleted Applicant:", deletedApplicant);
        res.status(200).json(deletedApplicant);
    } catch (error: any) {
        console.log("Error in controller:", error.message);
        next(error);
    }
};


export const uploadResume = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = req.params.id as unknown as mongoose.Types.ObjectId;

        if (!id) {
            return res.status(400).send({ error: 'Applicant id is required.' });
        }
        console.log("User id:", req.body.userId);
        const applicantId = await applicantServices.getApplicantByUserId(req.body.userId);
        if ((applicantId as { _id: mongoose.Types.ObjectId })._id.toString() !== id.toString()) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }
        if (!req.file) {
            return res.status(400).send({ error: 'Resume is required.' });
        }
        const resume = req.file.filename as unknown as string;
        const updatedApplicant = await applicantServices.uploadResume(id.toString(), resume);
        res.status(200).send(updatedApplicant);
    } catch (error) {
        next(error);
    }
};

export const uploadProfilePic = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = req.params.id as unknown as mongoose.Types.ObjectId;

        if (!id) {
            return res.status(400).send({ error: 'Applicant id is required.' });
        }
        const applicantId = await applicantServices.getApplicantByUserId(req.body.userId);
        if ((applicantId as { _id: mongoose.Types.ObjectId })._id.toString() !== id.toString()) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }
        if (!req.file) {
            return res.status(400).send({ error: 'Profile picture is required.' });
        }
        const profilePic = req.file.filename as unknown as string;
        const updatedApplicant = await applicantServices.uploadProfilePic(id.toString(), profilePic);

        res.status(200).send(updatedApplicant);
    } catch (error: any) {
        console.log(error.message);
        next(error);
    }
};

export const getApplicantByUserId = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.params.userId;
        if (!userId) {
            return res.status(400).send({ error: 'User id is required.' });
        }
        const applicant = await applicantServices.getApplicantByUserId(userId);
        res.status(200).send(applicant);
    } catch (error) {
        next(error);
    }
};

export const getApplicantByJobName = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const jobName = req.params.jobName;
        if (!jobName) {
            return res.status(400).send({ error: 'Job name is required.' });
        }
        const applicants = await applicantServices.getApplicantByJobName(jobName);
        res.status(200).send(applicants);
    } catch (error) {
        next(error);
    }
};

export const getApplicantByLocation = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const location = req.params.location;
        if (!location) {
            return res.status(400).send({ error: 'Location is required.' });
        }
        const applicants = await applicantServices.getApplicantByLocation(location);
        res.status(200).send(applicants);
    } catch (error) {
        next(error);
    }
};

export const getApplicantByPayoutAccountId = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const payoutAccountId = req.params.payoutAccountId;
        if (!payoutAccountId) {
            return res.status(400).send({ error: 'Payout account id is required.' });
        }
        const applicants = await applicantServices.getApplicantByPayoutAccountId(payoutAccountId);
        res.status(200).send(applicants);
    } catch (error) {
        next(error);
    }
};



