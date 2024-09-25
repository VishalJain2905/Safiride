import { Router } from "express";
import { NotificationController } from "../controllers";
import { jwtverify } from "../middlewares";

const router = Router();

router.get('/getNotification',jwtverify,NotificationController.getNotifications);

export default router;
