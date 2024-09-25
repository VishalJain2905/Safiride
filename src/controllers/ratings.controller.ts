import { Request, Response } from "express";
import User from "../models/user.model";
import httpStatus from "http-status";
import mongoose from "mongoose";

export async function fetchRatings(req: Request, res: Response) {
  const { userId } = req.params;

  try {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(httpStatus.BAD_REQUEST).send({
        status: httpStatus.BAD_REQUEST,
        message: "Invalid user ID format",
      });
    }

    const user = await User.findById(userId).select("ratings averageRating totalRating");

    if (!user) {
      return res.status(httpStatus.NOT_FOUND).send({
        status: httpStatus.NOT_FOUND,
        message: "User not found",
      });
    }

    return res.status(httpStatus.OK).send({
      message: "Ratings fetched successfully",
      status: httpStatus.OK,
      data: {
        averageRating: user.averageRating,
        totalRating: user.totalRating,
        ratings: user.ratings,
      },
    });
  } catch (error: any) {
    console.error("Error fetching ratings:", error);
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).send({
      message: "An unexpected error occurred",
      status: httpStatus.INTERNAL_SERVER_ERROR,
      error: error.message,
    });
  }
}

export async function rateDriverById(req: Request, res: Response) {
  const { driverId } = req.params;
  const { rating, comment } = req.body;
  const userId = res.get("userId");

  try {
    if (!mongoose.Types.ObjectId.isValid(driverId)) {
      return res.status(httpStatus.BAD_REQUEST).send({
        status: httpStatus.BAD_REQUEST,
        message: "Invalid driver ID format",
      });
    }

    const driver = await User.findById(driverId);
    if (!driver || driver.role !== "captain") {
      return res.status(httpStatus.NOT_FOUND).send({
        status: httpStatus.NOT_FOUND,
        message: "Driver not found",
      });
    }

    // Add rating to the driver
    const newRating = {
      rating,
      comment,
      ratedBy: userId,
      role: "user",
    };
    driver.ratings.push(newRating);

    // Calculate the new average rating
    driver.totalRating += 1;
    driver.averageRating = parseFloat(
        (driver.ratings.reduce((sum: number, r: { rating: number }) => sum + r.rating, 0) / driver.totalRating).toFixed(2)
    );
      

    await driver.save();

    res.status(httpStatus.OK).send({
      message: "Driver rated successfully",
      status: httpStatus.OK,
      data: newRating,
    });
  } catch (error: any) {
    console.error("Error rating driver:", error);
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).send({
      message: "An unexpected error occurred",
      status: httpStatus.INTERNAL_SERVER_ERROR,
      error: error.message,
    });
  }
}

export async function rateUserById(req: Request, res: Response) {
  const { userId } = req.params;
  const { rating, comment } = req.body;
  const driverId = res.get("userId");

  try {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(httpStatus.BAD_REQUEST).send({
        status: httpStatus.BAD_REQUEST,
        message: "Invalid user ID format",
      });
    }

    const user = await User.findById(userId);
    if (!user || user.role !== "user") {
      return res.status(httpStatus.NOT_FOUND).send({
        status: httpStatus.NOT_FOUND,
        message: "User not found",
      });
    }

    // Add rating to the user
    const newRating = {
      rating,
      comment,
      ratedBy: driverId,
      role: "captain",
    };
    user.ratings.push(newRating);

    // Calculate the new average rating
    user.totalRating += 1;
    user.averageRating = parseFloat(
        (user.ratings.reduce((sum: number, r: { rating: number }) => sum + r.rating, 0) / user.totalRating).toFixed(2)
      );
      

    await user.save();

    res.status(httpStatus.OK).send({
      message: "User rated successfully",
      status: httpStatus.OK,
      data: newRating,
    });
  } catch (error: any) {
    console.error("Error rating user:", error);
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).send({
      message: "An unexpected error occurred",
      status: httpStatus.INTERNAL_SERVER_ERROR,
      error: error.message,
    });
  }
}
