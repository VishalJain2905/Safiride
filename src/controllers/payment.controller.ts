import { Request, Response } from "express";
import httpStatus from "http-status";
import { PaymentOrderModel } from "../models";
import { PaymentGatewayEnum } from "../models/paymentOrder.model";
import { StripeService } from "../service";

export async function pay(req: Request, res: Response) {
  const {
    payment_gateway,
    amount,
    access_key,
    access_secret,
    success_url,
    failure_url,
    invoice,
  } = req.body;
  const currency = req.body.currency.toUpperCase();
  try {
    switch (payment_gateway) {
      case PaymentGatewayEnum.Stripe:
        const stripeOrder = await StripeService.createSession(
          invoice.name,
          amount,
          currency,
          access_secret,
          success_url,
          failure_url
        );
        await PaymentOrderModel.create({
          invoice: invoice,
          payment_gateway: PaymentGatewayEnum.Stripe,
          orderId: stripeOrder.id,
          amount: stripeOrder.amount_total,
          currency: stripeOrder.currency,
          failure_url: failure_url,
          success_url: success_url,
          payment_url: stripeOrder.url,
        });

        // Serializing the data
        const serializedData = {
          id: stripeOrder.id,
          amount: stripeOrder.amount_total,
          currency: stripeOrder.currency,
          success_url: stripeOrder.success_url,
          failure_url: stripeOrder.cancel_url,
          payment_url: stripeOrder.url,
        };

        res.status(httpStatus.OK).send({
          status: httpStatus.OK,
          message: `Order created successfully for ${payment_gateway}`,
          data: serializedData,
        });
        break;
      case PaymentGatewayEnum.Razorpay:
        // const razorpayOrder = await RazorpayService.createOrder(
        //   amount,
        //   currency,
        //   access_key,
        //   access_secret
        // );
        // await PaymentOrderModel.create({
        //   invoice: invoice,
        //   payment_gateway: PaymentGatewayEnum.Razorpay,
        //   orderId: razorpayOrder.id,
        //   amount: razorpayOrder.amount,
        //   currency: razorpayOrder.currency,
        //   success_url: success_url,
        //   failure_url: failure_url,
        //   payment_url: "http://localhost:4000/payment/",
        // });
        // const serializedRazorpayData = {
        //   id: razorpayOrder.id,
        //   amount: razorpayOrder.amount,
        //   currency: razorpayOrder.currency,
        //   success_url: success_url,
        //   failure_url: failure_url,
        //   payment_url: "http://localhost:4000/payment/",
        // };
        // res.status(httpStatus.OK).send({
        //   status: httpStatus.OK,
        //   message: `Order created successfully for ${payment_gateway}`,
        //   data: serializedRazorpayData,
        // });
        break;
      default:
        res.status(httpStatus.NOT_ACCEPTABLE).send({
          status: httpStatus.NOT_ACCEPTABLE,
          message: "payment gateway not supported",
        });
    }
  } catch (error) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).send({
      message: (error as Error).message,
      status: httpStatus.INTERNAL_SERVER_ERROR,
    });
  }
}
