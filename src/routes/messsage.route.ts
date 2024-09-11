import { Router } from "express";
import {
  createMessage,
  deleteMessage,
  editMessage,
  getMessageForChat,
  markMessageAsRead,
} from "../controllers/message.controller";

const router = Router();

router.post("/messages", createMessage);

router.get("/messages/:chatId", getMessageForChat);

router.put("/messages/:messageId", editMessage);

router.delete("/messages/:messageId", deleteMessage);

router.put("/messages/read/:messageId", markMessageAsRead);

export default router;
