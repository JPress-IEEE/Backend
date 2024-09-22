import e, { Request, Response ,NextFunction} from 'express';
import * as bookmarkServices from '../services/bookmark.services';
import { IBookmark } from '../models/bookmark.model';
import {BookmarkSchema} from '../schemas/bookmark.schema';
import { ZodError } from 'zod';

export const createBookmark = async (req: Request, res: Response ,next:NextFunction): Promise<void> => {
    try {
        const bookmark= BookmarkSchema.parse(req.body) as unknown as IBookmark;
        if(bookmark.userId!==req.body.userId){
                res.status(401).send('Unauthorized');
                return;
        }
        const newBookmark = await bookmarkServices.createBookmark(bookmark);
        res.status(201).json(newBookmark);
    } catch (error:any) {
        if (error instanceof ZodError) {
            res.status(400).send(error.errors);
        }else{
       next(error);
        }
    }
};

export const getBookmarkById = async (req: Request, res: Response,next:NextFunction): Promise<void> => {
    try {
        const bookmarkId = req.params.id;
        const bookmark = await bookmarkServices.getBookmarkById(bookmarkId);
        if(!bookmark){
            res.status(404).send('Bookmark not found');
            return;
        }
        if(bookmark?.userId?.toString()!==req.body.userId){
                res.status(401).send('Unauthorized');
                return;
        }
        if (bookmark) {
            res.status(200).json(bookmark);
        } else {
            res.status(404).send('Bookmark not found');
        }
    } catch (error:any) {
        next(error);
    }
}

export const getBookmarksByUserId = async (req: Request, res: Response,next:NextFunction): Promise<void> => {
    try {
        const userId = req.params.id;
        if(userId!==req.body.userId){
                res.status(401).send('Unauthorized');
                return;
        }
        const bookmarks = await bookmarkServices.getBookmarksByUserId(userId);
        if (bookmarks) {
            res.status(200).json(bookmarks);
        } else {
            res.status(404).send('Bookmarks not found');
        }
    } catch (error:any) {
        next(error);
    }
}

export const deleteBookmark = async (req: Request, res: Response,next:NextFunction): Promise<void> => {
    try {
        const bookmarkId = req.params.id;
        const bookmark = await bookmarkServices.deleteBookmark(bookmarkId);
        if(!bookmark){
            res.status(404).send('Bookmark not found');
            return;
        }
        if(bookmark?.userId?.toString()!==req.body.userId){
                res.status(401).send('Unauthorized');
                return;
        }
        if (bookmark) {
            res.status(200).json(bookmark);
        } else {
            res.status(404).send('Bookmark not found');
        }
    } catch (error:any) {
        next(error);
    }
}

