import { Router } from "express";
import { UserController } from "../controllers";
import { jwtverify } from "../middlewares";

const router = Router();

router.get("/fetchUser",jwtverify,UserController.fetchUser);

router.post("/updateUser/:userId",jwtverify,UserController.updateUser);

router.get("/address",jwtverify,UserController.getAddress);

router.post("/getAddress",jwtverify,UserController.postAddress);

router.post("/startDuty",jwtverify,UserController.startDuty);

export default router;
