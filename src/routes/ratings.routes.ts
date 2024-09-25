import { Router } from "express";
import { RatingsController } from "../controllers";
import { jwtverify } from "../middlewares";
import { catchAsync } from "../utils/catchAsync";

const router = Router();

router.get("/fetchRatings/:userId", catchAsync(RatingsController.fetchRatings));

router.post("/ratings/:driverId", catchAsync(RatingsController.rateDriverById));

router.post("/ratings/:userId", catchAsync(RatingsController.rateUserById));

export default router;
