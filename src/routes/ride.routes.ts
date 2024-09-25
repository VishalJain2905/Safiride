import { Router } from "express";
import { RideController } from "../controllers";
import { jwtverify } from "../middlewares";
import { catchAsync } from "../utils/catchAsync";

const router = Router();

router.use(jwtverify);

router.post("/initiate",catchAsync(RideController.initiateRide));

router.get("/current", catchAsync(RideController.fetchCurrentRide));

router.patch("/status/:rideId", catchAsync(RideController.changeStatus));

router.get("/getAllRides", catchAsync(RideController.getAllRides));

router.get("fetchRideById/:rideId", catchAsync(RideController.fetchRideById));

router.patch('/accept/:rideId', catchAsync(RideController.acceptRide));

router.patch('/cancel/:rideId', catchAsync(RideController.cancelRide));

router.get("/getRidesByIdAndStatus", catchAsync(RideController.getRideByIdOrStatus));

router.post("/schedule", catchAsync(RideController.scheduleRide));

router.get("/getScheduleRide", catchAsync(RideController.getScheduledRides));

router.put("/rideStops/:rideId", catchAsync(RideController.updateRideStops));

router.get("/getRideHistory", catchAsync(RideController.getRideHistory));

export default router;
