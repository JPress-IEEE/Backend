import Recommendation, {IRecommendation} from "../models/recommendation.model";
import { RecommendationSchema } from "../schemas/recommendation.schema";
import {getUserByEmail} from './user.services';
import {getApplicantByUserId } from './applicant.services';
import axios from "axios";
import Request from "../models/request.model";
import Applicant from "../models/applicant.model";

const apiUrl = 'http://localhost:5000';

export const getAIRecommendation = async (description:string)=> {
  try {
    const response = await axios.post(`${apiUrl}/get_recommendation`, { description }) as any;
    const userEmails = response.data.map((data:any) => data.email);
    const users = await Promise.all(userEmails.map((email:string) => getUserByEmail(email)));
    const userIds = users.map((user:any) => user._id);
    const applicants = await Promise.all(userIds.map((userId:string) => getApplicantByUserId(userId)));
    const recommendations = response.data.map((data:any, index:number) => {
      return {
        name: users[index].name,
        jobName: applicants[index]?.jobName ?? 'Unknown job',
        location: applicants[index]?.location ?? 'Unknown location',
        description: data.description,
      };
    });
    return recommendations;
  } catch (error) {
    console.error('Error calling Flask API:', error);
  }
}

export const storeAIRecommendationsForRequest = async (requestId: string, description: string) => {
    try {
      const aiRecommendations = await getAIRecommendation(description);
      const request = await Request.findById(requestId);
      if (!request) {
        throw new Error('Request not found');
      }
      const applicants = await Promise.all(aiRecommendations.map(async (recommendation: any) => {
        const applicant = await Applicant.findOne({ userId: recommendation.userId });
        if (!applicant) {
          throw new Error(`Applicant not found for userId: ${recommendation.userId}`);
        }
        return { applicantId: applicant._id };
      }));
      let recommendation = await Recommendation.findOne({ requestId });
  
      if (recommendation) {
        recommendation.applicants = applicants;
        recommendation.updatedAt = new Date();
        await recommendation.save();
      } else {
        recommendation = new Recommendation({
          requestId,
          applicants,
        });
        await recommendation.save();
      }
      return recommendation;
    } catch (error) {
      console.error('Error storing AI recommendations:', error);
      throw new Error('Failed to store AI recommendations');
    }
  };

export const storeData = async (email:string, description:string) => {
    try {
      const data = {
        email,
        description,
      };
      const response = await axios.post(`${apiUrl}/store`, data);
      return response.data; 
    } catch (error:any) {
      console.error('Error storing data in Flask API:', error.message);
      throw new Error('Failed to store data');
    }
  };

  export const updateData = async (email:string, description:string) => {
    try {
      const data = {
        email,
        description,
      };
      const response = await axios.post(`${apiUrl}/update`, data);
      return response.data; 
    } catch (error:any) {
      console.error('Error updating data in Flask API:', error.message);
      throw new Error('Failed to update data');
    }
  };

  export const deleteData = async (email:string) => {
    try {
      const data = {
        email,
      };
      const response = await axios.post(`${apiUrl}/delete`, data);
      return response.data; 
    } catch (error:any) {
      console.error('Error deleting data in Flask API:', error.message);
      throw new Error('Failed to delete data');
    }
  };

export const createRecommendation = async (recommendation: IRecommendation): Promise<IRecommendation> => {
    try {
        const newRecommendation = new Recommendation(recommendation);
        return await newRecommendation.save();
    } catch (error:any) {
        return error.message;
    }
    
};

export const getRecommendationById = async (recommendationId: string): Promise<IRecommendation | null> => {
    try {
        return await Recommendation.findById(recommendationId);
    }
    catch (error:any) {
        return error.message;
    }
};

export const getRecommendationByRequestId = async (requestId: string): Promise<IRecommendation | null> => {
    try {
        return await Recommendation.findOne({requestId: requestId});
    }
    catch (error:any) {
        return error.message;
    }
};