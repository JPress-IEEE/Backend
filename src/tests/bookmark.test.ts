import request from "supertest";
import express, { NextFunction, Request, Response } from "express"
import * as bookmarkServices from '../services/bookmark.services';
import { authMiddleware } from "../middlewares/auth.middleware";
import { ZodError } from "zod";
import { BookmarkSchema } from "../schemas/bookmark.schema";
import bookmarkRouter from "../routes/bookmark.route";

jest.mock('../services/bookmark.services', () => ({
    createBookmark: jest.fn(),
    getBookmarkById: jest.fn(),
    getBookmarksByUserId: jest.fn(),
    deleteBookmark: jest.fn()
}));

jest.mock('../middlewares/auth.middleware', () => ({
    authMiddleware: jest.fn()
}));

jest.mock('../schemas/bookmark.schema', () => ({
    BookmarkSchema: {
        parse: jest.fn()
    }
}));

const app = express();
app.use(express.json());
app.use('/api/bookmark', bookmarkRouter);

describe('POST /api/bookmark', () => {
    it('should return 201 and the created bookmark', async () => {
        const mockBookmark = {
            userId: '1',
            offerId: '1'
        };
        (authMiddleware as jest.Mock).mockImplementation((req: Request, res: Response, next: NextFunction) => {
            req.body.userId = '1';
            next();
        });
        (BookmarkSchema.parse as jest.Mock).mockReturnValue(mockBookmark);
        (bookmarkServices.createBookmark as jest.Mock).mockResolvedValue(mockBookmark);

        const response = await request(app)
            .post('/api/bookmark')
            .send(mockBookmark);

        expect(response.status).toBe(201);
        expect(response.body).toEqual(mockBookmark);
    });

    it('should return 400 if the request body is invalid', async () => {
        (authMiddleware as jest.Mock).mockImplementation((req: Request, res: Response, next: NextFunction) => {
            req.body.userId = '1';
            next();
        });
        const mockBookmark = {
            userId: '1',
            offerId: '1'
        };
        (BookmarkSchema.parse as jest.Mock).mockImplementation(() => {
            throw new ZodError([]);
        });
    
        const response = await request(app)
            .post('/api/bookmark')
            .send(mockBookmark);
    
        expect(response.status).toBe(400);
    });
    
    it('should return 500 if an error occurs', async () => {
        (authMiddleware as jest.Mock).mockImplementation((req: Request, res: Response, next: NextFunction) => {
            req.body.userId = '1';
            next();
        });
        const mockBookmark = {
            userId: '1',
            offerId: '1'
        };
        (BookmarkSchema.parse as jest.Mock).mockReturnValue(mockBookmark);
        (bookmarkServices.createBookmark as jest.Mock).mockRejectedValue(new Error());

        const response = await request(app)
            .post('/api/bookmark')
            .send(mockBookmark);

        expect(response.status).toBe(500);
    });
});

describe('GET /api/bookmark/:id', () => {
    it('should return 200 and the bookmark', async () => {
        (authMiddleware as jest.Mock).mockImplementation((req: Request, res: Response, next: NextFunction) => {
            req.body.userId = '1';
            next();
        });
        const mockBookmark = {
            userId: '1',
            offerId: '1'
        };
        (bookmarkServices.getBookmarkById as jest.Mock).mockResolvedValue(mockBookmark);

        const response = await request(app)
            .get('/api/bookmark/1');

        expect(response.status).toBe(200);
        expect(response.body).toEqual(mockBookmark);
    });

    it('should return 404 if the bookmark is not found', async () => {
        (authMiddleware as jest.Mock).mockImplementation((req: Request, res: Response, next: NextFunction) => {
            req.body.userId = '1';
            next();
        });
        (bookmarkServices.getBookmarkById as jest.Mock).mockResolvedValue(null);

        const response = await request(app)
            .get('/api/bookmark/1');

        expect(response.status).toBe(404);
    });

    it('should return 500 if an error occurs', async () => {
        (authMiddleware as jest.Mock).mockImplementation((req: Request, res: Response, next: NextFunction) => {
            req.body.userId = '1';
            next();
        });
        (bookmarkServices.getBookmarkById as jest.Mock).mockRejectedValue(new Error());

        const response = await request(app)
            .get('/api/bookmark/1');

        expect(response.status).toBe(500);
    });
});

describe('GET /api/bookmark/user/:id', () => {
    it('should return 200 and the bookmarks', async () => {
        (authMiddleware as jest.Mock).mockImplementation((req: Request, res: Response, next: NextFunction) => {
            req.body.userId = '1';
            next();
        });
        const mockBookmark = {
            userId: '1',
            offerId: '1'
        };
        (bookmarkServices.getBookmarksByUserId as jest.Mock).mockResolvedValue([mockBookmark]);

        const response = await request(app)
            .get('/api/bookmark/user/1');

        expect(response.status).toBe(200);
        expect(response.body).toEqual([mockBookmark]);
    });

    it('should return 404 if the bookmarks are not found', async () => {
        (authMiddleware as jest.Mock).mockImplementation((req: Request, res: Response, next: NextFunction) => {
            req.body.userId = '1';
            next();
        });
        (bookmarkServices.getBookmarksByUserId as jest.Mock).mockResolvedValue(null);

        const response = await request(app)
            .get('/api/bookmark/user/1');

        expect(response.status).toBe(404);
    });

    it('should return 500 if an error occurs', async () => {
        (authMiddleware as jest.Mock).mockImplementation((req: Request, res: Response, next: NextFunction) => {
            req.body.userId = '1';
            next();
        });
        (bookmarkServices.getBookmarksByUserId as jest.Mock).mockRejectedValue(new Error());

        const response = await request(app)
            .get('/api/bookmark/user/1');

        expect(response.status).toBe(500);
    });
});

describe('DELETE /api/bookmark/:id', () => {
    it('should return 200 and the deleted bookmark', async () => {
        (authMiddleware as jest.Mock).mockImplementation((req: Request, res: Response, next: NextFunction) => {
            req.body.userId = '1';
            next();
        });
        const mockBookmark = {
            userId: '1',
            offerId: '1'
        };
        (bookmarkServices.deleteBookmark as jest.Mock).mockResolvedValue(mockBookmark);

        const response = await request(app)
            .delete('/api/bookmark/1');

        expect(response.status).toBe(200);
        expect(response.body).toEqual(mockBookmark);
    });

    it('should return 404 if the bookmark is not found', async () => {
        (authMiddleware as jest.Mock).mockImplementation((req: Request, res: Response, next: NextFunction) => {
            req.body.userId = '1';
            next();
        });
        (bookmarkServices.deleteBookmark as jest.Mock).mockResolvedValue(null);

        const response = await request(app)
            .delete('/api/bookmark/1');

        expect(response.status).toBe(404);
    });

    it('should return 500 if an error occurs', async () => {
        (authMiddleware as jest.Mock).mockImplementation((req: Request, res: Response, next: NextFunction) => {
            req.body.userId = '1';
            next();
        });
        (bookmarkServices.deleteBookmark as jest.Mock).mockRejectedValue(new Error());

        const response = await request(app)
            .delete('/api/bookmark/1');

        expect(response.status).toBe(500);
    });
});

describe('bookmark routes un authorized', () => {
    it('should return 401 if the user is not authorized to access the bookmarks', async () => {
        const mockBookmark = {
            userId: '1',
            offerId: '1'
        };
        (authMiddleware as jest.Mock).mockImplementation((req: Request, res: Response, next: NextFunction) => res.status(401).send('Unauthorized'));
        (BookmarkSchema.parse as jest.Mock).mockReturnValue(mockBookmark);
        (bookmarkServices.createBookmark as jest.Mock).mockResolvedValue(mockBookmark);

        const response = await request(app)
            .post('/api/bookmark')
            .send(mockBookmark);

        expect(response.status).toBe(401);
    });
    it('should return 401 if the user is not authorized to access the bookmarks', async () => {
        const mockBookmark = {
            userId: '1',
            offerId: '1'
        };
        (authMiddleware as jest.Mock).mockImplementation((req: Request, res: Response, next: NextFunction) => res.status(401).send('Unauthorized'));
        (BookmarkSchema.parse as jest.Mock).mockReturnValue(mockBookmark);
        (bookmarkServices.createBookmark as jest.Mock).mockResolvedValue(mockBookmark);

        const response = await request(app)
            .get('/api/bookmark/1');

        expect(response.status).toBe(401);
    });
    it('should return 401 if the user is not authorized to access the bookmarks', async () => {
        const mockBookmark = {
            userId: '1',
            offerId: '1'
        };
        (authMiddleware as jest.Mock).mockImplementation((req: Request, res: Response, next: NextFunction) => res.status(401).send('Unauthorized'));
        (BookmarkSchema.parse as jest.Mock).mockReturnValue(mockBookmark);
        (bookmarkServices.createBookmark as jest.Mock).mockResolvedValue(mockBookmark);

        const response = await request(app)
            .get('/api/bookmark/user/1');

        expect(response.status).toBe(401);
    });
    it('should return 401 if the user is not authorized to access the bookmarks', async () => {
        const mockBookmark = {
            userId: '1',
            offerId: '1'
        };
        (authMiddleware as jest.Mock).mockImplementation((req: Request, res: Response, next: NextFunction) => res.status(401).send('Unauthorized'));
        (BookmarkSchema.parse as jest.Mock).mockReturnValue(mockBookmark);
        (bookmarkServices.createBookmark as jest.Mock).mockResolvedValue(mockBookmark);

        const response = await request(app)
            .delete('/api/bookmark/1');

        expect(response.status).toBe(401);
    });

});


