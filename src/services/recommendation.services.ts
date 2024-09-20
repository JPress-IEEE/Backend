import Recommendation, { IRecommendation } from "../models/recommendation.model";
import { RecommendationSchema } from "../schemas/recommendation.schema";
import { getUserByEmail } from './user.services';
import { getApplicantByUserId } from './applicant.services';
import axios from "axios";
import Request from "../models/request.model";
import Applicant from "../models/applicant.model";
import { json } from "stream/consumers";

const apiUrl = 'http://localhost:5000';

export const getAIRecommendation = async (requestId :string,description: string) => {
  try {
    const response = await axios.post(`${apiUrl}/get_recommendation`, { description }) as any;

    const { emails, descriptions } = response.data;
    console.log(response.data);
    if (Array.isArray(emails) && Array.isArray(descriptions)) {
      const users = await Promise.all(emails.map((email: string) => getUserByEmail(email)));
      const validUsers = users.filter((user: any) => {
        if (!user) {
          console.warn(`User not found for email: ${emails}`);
          return false;
        }
        return true;
      });
      const userIds = validUsers.map((user: any) => user._id);
      const applicants = await Promise.all(userIds.map((userId: string) => getApplicantByUserId(userId)));
      const db_applicants = applicants.map((applicant: any) => {
        return {
          applicantId: applicant._id,
        };
      });
      const db_recommendation= {
        requestId: requestId ,
        applicants: db_applicants,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      await createRecommendation(db_recommendation as unknown as IRecommendation);  
      const recommendations = validUsers.map((user: any, index: number) => {
        return {
          name: user.name,
          jobName: applicants[index]?.jobName ?? 'Unknown job',
          location: applicants[index]?.location ?? 'Unknown location',
          description: descriptions[index] ?? 'No description available',
        };
      });

      return recommendations;
    } else {
      console.error('Unexpected response format from Flask API:', response.data);
      throw new Error('Unexpected data structure from Flask API.');
    }
  } catch (error) {
    console.error('Error calling Flask API:', error);
    throw new Error('Error fetching recommendations');
  }
};

export const storeData = async (email: string, description: string) => {
  try {
    const data = {
      "email": email,
      "description": description,
    };
    const jsonData = JSON.stringify(data);
    const response = await axios.post(`${apiUrl}/store`, jsonData, {
      headers: {
        'Content-Type': 'application/json', 
      },
    });
  } catch (error: any) {
    console.error('Error storing data in Flask API:', error.message);
    throw new Error('Failed to store data');
  }
};

export const updateData = async (email: string, description: string) => {
  try {
    const data = {
      "email": email,
      "description": description,
    };
    const response = await axios.post(`${apiUrl}/update`, data, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    console.log(response.data);
  } catch (error: any) {
    console.error('Error updating data in Flask API:', error.message);
    throw new Error('Failed to update data');
  }
};


export const deleteData = async (email: string) => {
  try {
    const data = {
      email,
    };
    const response = await axios.post(`${apiUrl}/delete`, data);
    return response.data;
  } catch (error: any) {
    console.error('Error deleting data in Flask API:', error.message);
    throw new Error('Failed to delete data');
  }
};

export const createRecommendation = async (recommendation: IRecommendation): Promise<IRecommendation> => {
  try {
    const newRecommendation = new Recommendation(recommendation);
    return await newRecommendation.save();
  } catch (error: any) {
    return error.message;
  }

};

export const getRecommendationById = async (recommendationId: string): Promise<IRecommendation | null> => {
  try {
    return await Recommendation.findById(recommendationId);
  }
  catch (error: any) {
    return error.message;
  }
};

export const getRecommendationByRequestId = async (requestId: string): Promise<IRecommendation | null> => {
  try {
    return await Recommendation.findOne({ requestId: requestId });
  }
  catch (error: any) {
    return error.message;
  }
};