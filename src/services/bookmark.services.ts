import Bookmark,{IBookmark}  from "../models/bookmark.model";
import { BookmarkSchema } from "../schemas/bookmark.schema";


export const createBookmark = async (bookmark: IBookmark): Promise<IBookmark> => {
    try {
        const newBookmark = new Bookmark(bookmark);
        const result = await newBookmark.save();
        return result;
    } catch (error:any) {
        throw new Error(error);
    }
};

export const getBookmarkById = async (bookmarkId: string): Promise<IBookmark | null> => {
    try {
        const bookmark = await Bookmark.findById(bookmarkId);
        return bookmark;
    } catch (error:any) {
        throw new Error(error);
    }
};

export const deleteBookmark = async (bookmarkId: string): Promise<IBookmark | null> => {
    try {
        const bookmark = await Bookmark.findByIdAndDelete(bookmarkId);
        return bookmark;
    }
    catch (error:any) {
        throw new Error(error);
    }
};

export const getBookmarksByUserId = async (userId: string): Promise<IBookmark[]> => {
    try {
        const bookmarks = await Bookmark.find({userId});
        return bookmarks;
    } catch (error:any) {
        throw new Error(error);
    }
};