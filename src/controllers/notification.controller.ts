import httpStatus from 'http-status';
import Ride from '../models/notification.model';
import { NotificationService } from '../service/notification.service';
import { Request, Response } from 'express';
import { Types } from 'mongoose';

export async function getNotifications(req:Request,res:Response){
    try {
        const userId = res.get("userId");
        const notifications = await NotificationService.getNotificationsByUser(new Types.ObjectId(userId));
        res.status(httpStatus.OK).send({
            statusCode: httpStatus.OK,
            message: "User fetched successfully",
            data: notifications,
          });
    } catch (error) {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).send({
        statusCode: httpStatus.INTERNAL_SERVER_ERROR,
        message: error,
        });
    }
}