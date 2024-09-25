import { Router } from "express";
import { AuthenticationController } from "../controllers";
import * as authenticationMiddleware from "../middlewares/requestMapping/auth.mapping"
const router = Router();

router.post("/signup",authenticationMiddleware.signupMiddleware, AuthenticationController.signup);
router.post("/login", AuthenticationController.login);
router.post("/sendOTP", AuthenticationController.sendOTP);
router.post("/verifyOTP", AuthenticationController.verifyOTP);
router.post("/resendOtp",AuthenticationController.resendOTP);
router.post("/forgetPassword", AuthenticationController.forgetPassword);
router.post("/resetPassword", AuthenticationController.resetPassword);
router.post("/changePassword", AuthenticationController.changePassword);

export default router;
