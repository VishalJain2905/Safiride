import { Router } from "express";
import razorpayRoutes from "./razorpay.routes";
import authRoutes from "./auth.routes";

const routes = Router();

routes.use("/auth", authRoutes);
routes.use("/razorpay", razorpayRoutes);

export default routes;
