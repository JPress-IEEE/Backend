import { Request, Response } from 'express';
import * as recommendationServices from '../services/recommendation.services';
import { IRecommendation } from '../models/recommendation.model';

export const getRecommendationById = async (req: Request, res: Response): Promise<void> => {
    try {
        const recommendationId = req.params.id;
        const recommendation = await recommendationServices.getRecommendationById(recommendationId);

        if (!recommendation) {
            res.status(404).json({ message: 'Recommendation not found' });
            return;
        }

        res.status(200).json(recommendation);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
}

export const getRecommendationByRequestId = async (req: Request, res: Response): Promise<void> => {
    try {
        const requestId = req.params.id;
        const recommendation = await recommendationServices.getRecommendationByRequestId(requestId);

        if (!recommendation) {
            res.status(404).json({ message: 'Recommendation not found for this request' });
            return;
        }

        res.status(200).json(recommendation);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
}

export const getAIRecommendation = async (req: Request, res: Response): Promise<void> => {
    try {
        const description = req.body.description;

        if (!description) {
            res.status(400).json({ message: 'Description is required' });
            return;
        }

        const recommendations = await recommendationServices.getAIRecommendation(description);
        res.status(200).json(recommendations);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
}

export const storeAIRecommendationsForRequest = async (req: Request, res: Response): Promise<void> => {
    try {
        const requestId = req.params.id;
        const description = req.body.description;

        if (!description) {
            res.status(400).json({ message: 'Description is required' });
            return;
        }

        const recommendation = await recommendationServices.storeAIRecommendationsForRequest(requestId, description);
        res.status(200).json(recommendation);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
}

export const createRecommendation = async (req: Request, res: Response): Promise<void> => {
    try {
        const recommendation: IRecommendation = req.body;

        if (!recommendation) {
            res.status(400).json({ message: 'Recommendation data is required' });
            return;
        }

        const newRecommendation = await recommendationServices.createRecommendation(recommendation);
        res.status(201).json(newRecommendation);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
}
