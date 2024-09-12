import swaggerJsDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const swaggerOptions: swaggerJsDoc.Options = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            title: 'JPress',
            version: '1.0.0',
        },
        servers: [
            {
                url: 'http://localhost:3000',
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
            },
            schemas: {
                User: {
                    type: 'object',
                    properties: {
                        _id: { type: 'string' },
                        name: { type: 'string' },
                        email: { type: 'string' },
                        isEmailVerified: { type: 'boolean' },
                        password: { type: 'string' },
                        profilePic: { type: 'string' },
                        role: { type: 'string' },
                        googleId: { type: 'string' },
                        linkedInId: { type: 'string' },
                        facebookId: { type: 'string' },
                        refreshToken: { type: 'string' },
                        createdAt: { type: 'string', format: 'date-time' },
                        updatedAt: { type: 'string', format: 'date-time' }
                    },
                },
                Client: {
                    type: 'object',
                    properties: {
                        _id: { type: 'string' },
                        userId: { type: 'string' },
                    },
                },
                Applicant: {
                    type: 'object',
                    properties: {
                        _id: { type: 'string' },
                        userId: { type: 'string' },
                        location: { type: 'string' },
                        summary: { type: 'string' },
                        jobName: { type: 'string' },
                        resume: { type: 'string'},
                        payoutAccountId: { type: 'string' },
                    },
                },
                Request: {
                    type: 'object',
                    properties: {
                        _id: { type: 'string' },
                        clientId: { type: 'string' },
                        jobName: { type: 'string' },
                        location: { type: 'string' },
                        description: { type: 'string' },
                        createdAt: { type: 'string', format: 'date-time' },
                        updatedAt: { type: 'string', format: 'date-time' },
                    },
                },
                Offer: {
                    type: 'object',
                    properties: {
                        _id: { type: 'string' },
                        requestId: { type: 'string' },
                        applicantId: { type: 'string' },
                        feedbackId: { type: 'string' },
                        price: { type: 'number' },
                        status: { type: 'string' },
                        createdAt: { type: 'string', format: 'date-time' },
                        updatedAt: { type: 'string', format: 'date-time' },
                    },
                },
                Feedback: {
                    type: 'object',
                    properties: {
                        _id: { type: 'string' },
                        applicantId: { type: 'string' },
                        clientId: { type: 'string' },
                        rate: { type: 'number' },
                        comment: { type: 'string' },
                        createdAt: { type: 'string', format: 'date-time' },
                        updatedAt: { type: 'string', format: 'date-time' },
                    },
                },
                Chat: {
                    type: 'object',
                    properties: {
                        _id: { type: 'string' },
                        participant1Id: { type: 'string' },
                        participant2Id: { type: 'string' },
                        createdAt: { type: 'string', format: 'date-time' },
                        updatedAt: { type: 'string', format: 'date-time' },
                    },
                },
                Message: {
                    type: 'object',
                    properties: {
                        _id: { type: 'string' },
                        chatId: { type: 'string' },
                        senderId: { type: 'string' },
                        content: { type: 'string' },
                        timestamp: { type: 'string', format: 'date-time' },
                        isRead: { type: 'boolean' },
                    },
                },
                VideoCall: {
                    type: 'object',
                    properties: {
                        _id: { type: 'string' },
                        chatId: { type: 'string' },
                        callerId: { type: 'string' },
                        startTime: { type: 'string', format: 'date-time' },
                        endTime: { type: 'string', format: 'date-time' },
                        callStatus: { type: 'string' },
                    },
                },
                Notification: {
                    type: 'object',
                    properties: {
                        _id: { type: 'string' },
                        userId: { type: 'string' },
                        message: { type: 'string' },
                        status: { type: 'string' },
                        createdAt: { type: 'string', format: 'date-time' },
                        updatedAt: { type: 'string', format: 'date-time' },
                    },
                },
                Bookmark: {
                    type: 'object',
                    properties: {
                        userId: { type: 'string' },
                        offerId: { type: 'string' },
                        createdAt: { type: 'string', format: 'date-time' },
                    },
                },
                Recommendation: {
                    type: 'object',
                    properties: {
                        _id: { type: 'string' },
                        requestId: { type: 'string' },
                        applicantS:{
                            type: 'array',
                            items: {
                                type: 'string'
                            }
                        },
                        createdAt: { type: 'string', format: 'date-time' },
                        updatedAt: { type: 'string', format: 'date-time' },
                    },
                },
            },
        },
    },
    apis: ['./src/routes/*.ts'],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

export { swaggerDocs, swaggerUi };
