import { Router } from "express";
import { createChat } from "../controllers/chat.controller";
import { getChatMessages } from "../controllers/chat.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();

router.post("/chat",authMiddleware, createChat);
router.get("/chat/:chatId/messages",authMiddleware, getChatMessages);

export default router;
