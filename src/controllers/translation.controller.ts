import axios from "axios";
import { Request, Response, NextFunction } from "express";

const modelURL = "http://localhost:5002/translate"; 

export const translate = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { text } = req.body;
    console.log(text);

    if (!text) {
      return res.status(400).json({ error: "Text is required" });
    }
    const response = await axios.post(modelURL, { text }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    res.status(200).json(response.data);
  } catch (error: any) {
    console.log(error.message);
    next(error);
  }
};
