import { Router } from "express";
import { acceptCall, declineCall, endVideoCall, requestCall } from "../controllers/videocall.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();

router.post("/request",authMiddleware, requestCall);
router.post("/accept",authMiddleware, acceptCall);
router.post("/decline",authMiddleware, declineCall);
router.post("/end",authMiddleware, endVideoCall);

export default router;
