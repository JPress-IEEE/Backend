import { Router } from "express";
import { createChat } from "../controllers/chat.controller";
import { getChatMessages } from "../controllers/chat.controller";

const router = Router();

router.post("/chat", createChat);
router.get("/chat/:chatId/messages", getChatMessages);

export default router;
