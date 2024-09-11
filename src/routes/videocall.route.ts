import { Router } from "express";
import { endVideoCall } from "../controllers/videocall.controller";
import { startVideoCall } from "../controllers/videocall.controller";

const router = Router();

router.post("/videocall/start", startVideoCall);
router.put("/videocall/end/:callId", endVideoCall);

export default router;
