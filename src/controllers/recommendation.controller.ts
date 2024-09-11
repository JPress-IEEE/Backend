import { Request, Response } from 'express';
import * as recommendationServices from '../services/recommendation.services';
import { IRecommendation } from '../models/recommendation.model';
import {RecommendationSchema} from '../schemas/recommendation.schema';
import axios from 'axios';

/*
export const getAIRecommendation = async (req: Request, res: Response): Promise<void> => {
};

export const createRecommendation = async (req: Request, res: Response): Promise<void> => {
};

export const getRecommendationById = async (req: Request, res: Response): Promise<void> => {
    
}

export const getRecommendationByUserId = async (req: Request, res: Response): Promise<void> => {
    
}

export const upadateRecommendation = async (req: Request, res: Response): Promise<void> => {
}

export const deleteRecommendation = async (req: Request, res: Response): Promise<void> => {
}

export const deleteRecommendationByUserId = async (req: Request, res: Response): Promise<void> => {
}

export const getRecommendations = async (req: Request, res: Response): Promise<void> => {
}
*/