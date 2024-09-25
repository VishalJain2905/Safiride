import { Request, Response } from "express";
import httpStatus from "http-status";
import mongoose from "mongoose";
import { RazorpayOrderModel, UserModel } from "../models";

export async function createOrder(req: Request, res: Response) {
  try {
    // const { amount, currency } = req.body;
    // const order = await RazorpayService.createOrder(
    //   // new mongoose.Types.ObjectId(res.get("userId")),
    //   amount,
    //   currency,
    // );
    // await RazorpayOrderModel.create({ ...order, orderId: order.id });
    // res.status(httpStatus.CREATED).send({
    //   message: "Order created successfully",
    //   data: { ...order, paymentURL: "" },
    //   status: httpStatus.CREATED,
    // });
  } catch (error) {
    console.log(error);
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .send({ status: httpStatus.INTERNAL_SERVER_ERROR, error });
  }
}

export async function saveRazorpayCredentials(req: Request, res: Response) {
  // try {
  //   const { keyId, keySecret } = req.body;
  //   const userId = res.get("userId");
  //   const data = await RazorpayService.saveClientCredentials(
  //     new mongoose.Types.ObjectId(userId),
  //     keyId,
  //     keySecret
  //   );
  //   res.status(httpStatus.OK).send({
  //     status: httpStatus.OK,
  //     message: "Razorpay credentials saved successfully",
  //     data: data,
  //   });
  // } catch (error) {
  //   console.log(error);
  //   res.status(httpStatus.INTERNAL_SERVER_ERROR).send(error);
  // }
}

export async function pay(req: Request, res: Response) {
  try {
    const { orderId } = req.params;
    const order = await RazorpayOrderModel.findOne({
      orderId: orderId,
    });
    const user = await UserModel.findById(
      new mongoose.Types.ObjectId(res.get("userId"))
    );
    res.render("razorpay_payment", {
      orderId: order?.orderId,
      razorpay_key_id: "rzp_test_GuMhJXL2MIpzKm",
      amount: order?.amount,
      currency: order?.currency,
      name: `keshav suman`,
      description: "asdgasd",
      logo_image: "",
    });
  } catch (error) {
    console.log(error);
    res.status(httpStatus.INTERNAL_SERVER_ERROR).send(error);
  }
}
