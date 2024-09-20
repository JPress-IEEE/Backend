import { Router } from "express";
import { acceptCall, declineCall, endVideoCall, requestCall } from "../controllers/videocall.controller";

const router = Router();

router.post("/request", requestCall);
router.post("/accept", acceptCall);
router.post("/decline", declineCall);
router.post("/end", endVideoCall);

export default router;
