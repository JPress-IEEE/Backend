import { Router } from "express";
import {
  createMessage,
  deleteMessage,
  editMessage,
  getMessageForChat,
  markMessageAsRead,
} from "../controllers/message.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
const router = Router();

router.post("/messages",authMiddleware, createMessage);

router.get("/messages/:chatId",authMiddleware, getMessageForChat);

router.put("/messages/:messageId",authMiddleware, editMessage);

router.delete("/messages/:messageId",authMiddleware, deleteMessage);

router.put("/messages/read/:messageId",authMiddleware, markMessageAsRead);

export default router;
