import { Router } from "express";
import { GenerateSignedUrlController } from "../controllers";
import { jwtverify } from "../middlewares";

const router = Router();

router.get('/generateSignedUrl/:fileName',jwtverify,GenerateSignedUrlController.generatesignedurl);

export default router;
