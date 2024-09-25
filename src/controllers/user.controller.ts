import {Request,Response} from "express";
import { UserService } from "../service";
import { Types } from "mongoose";
import httpStatus from "http-status";

export async function fetchUser(req:Request,res:Response){
    try {
        const userId = res.get("userId");
        const user = await UserService.findUserById(new Types.ObjectId(userId));
        res.status(httpStatus.OK).send({
            statusCode: httpStatus.OK,
            message: "User fetched successfully",
            data: user
          });
    } catch (error) {
        console.log(error);
        res.status(httpStatus.INTERNAL_SERVER_ERROR).send({
        statusCode: httpStatus.INTERNAL_SERVER_ERROR,
        message: error,
        });
    }
}

export async function updateUser(req:Request,res:Response){
    try {
        const userId = res.get("userId");
        const user = await UserService.updateUserById(new Types.ObjectId(userId),req.body);
        res.status(httpStatus.OK).send({
            statusCode: httpStatus.OK,
            message: "User updated successfully",
            data: user
          });
    } catch (error) {
        console.log(error);
        res.status(httpStatus.INTERNAL_SERVER_ERROR).send({
        statusCode: httpStatus.INTERNAL_SERVER_ERROR,
        message: error,
        });
    }
}

export async function getAddress(req: Request, res: Response) {
    try {
        const userId = res.get("userId");
       if (!userId) {
        return res.status(httpStatus.BAD_REQUEST).send({
          statusCode: httpStatus.BAD_REQUEST,
          message: "User ID is required",
        });
      }
      const user = await UserService.findUserById(new Types.ObjectId(userId));
      if (!user || !user.address) {
        return res.status(httpStatus.NOT_FOUND).send({
          statusCode: httpStatus.NOT_FOUND,
          message: "User or address not found",
        });
      }
  
      res.status(httpStatus.OK).send({
        statusCode: httpStatus.OK,
        message: "User address fetched successfully",
        data: user.address, // Send only the address field in the response
      });
    } catch (error) {
      console.log(error);
      res.status(httpStatus.INTERNAL_SERVER_ERROR).send({
        statusCode: httpStatus.INTERNAL_SERVER_ERROR,
        message: "Error fetching user address",
        error: error,
      });
    }
}

export async function postAddress(req: Request, res: Response) {
    try {
        const userId = res.get("userId");

      const { lane1, lane2, city, state, location, pincode } = req.body;

      // Update the user address
      const user = await UserService.findUserById(new Types.ObjectId(userId));
        

        if (!user) {
            return res.status(httpStatus.NOT_FOUND).send({
                statusCode: httpStatus.NOT_FOUND,
                message: "User not found",
            });
        }

        user.address = {
            lane1,
            lane2,
            city,
            state,
            location,
            pincode,
          };

        await user.save();

        res.status(httpStatus.OK).send({
            statusCode: httpStatus.OK,
            message: "Address updated successfully",
            data: user.address,
        });
    } catch (error) {
        console.error(error);
        res.status(httpStatus.INTERNAL_SERVER_ERROR).send({
            statusCode: httpStatus.INTERNAL_SERVER_ERROR,
            message: "Internal server error",
        });
    }
}

export async function startDuty(req: Request, res: Response) {
    try {
      const userId = res.get("userId");
      const { isOnDuty } = req.body;
      const user = await UserService.findUserById(new Types.ObjectId(userId));
      if (!user) {
        return res.status(404).send({
          message: "User not found",
        });
      }
  
      user.isOnDuty = isOnDuty;
  
      await user.save();
  
      res.status(200).send({
        message: "isOnDuty status updated successfully",
        data: user.isOnDuty,
      });
    } catch (error) {
      console.error(error);
      res.status(500).send({
        message: "Internal server error",
      });
    }
}


