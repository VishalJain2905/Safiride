import { Router } from "express";
import razorpayRoutes from "./razorpay.routes";
import authRoutes from "./auth.routes";
import userRoutes from "./user.routes";
import rideRoutes from "./ride.routes";
import stripeRoutes from "./stripe.routes";
import settingsRoutes from "./settings.routes";
import paymentRoutes from "./payment.routes";
import notificationRoutes from "./notification.routes";
import GenerateSignedUrlRoutes from "./generate.routes";
import ratingRoutes from "./ratings.routes";

const routes = Router();

routes.use("/auth", authRoutes);
routes.use("/user", userRoutes);
routes.use("/ride", rideRoutes);
routes.use("/razorpay", razorpayRoutes);
routes.use("/stripe", stripeRoutes);
routes.use("/settings", settingsRoutes); 
routes.use("/payment", paymentRoutes);
routes.use("/notification",notificationRoutes);
routes.use("/generateSignedUrl",GenerateSignedUrlRoutes);
routes.use("rating", ratingRoutes);

export default routes;
