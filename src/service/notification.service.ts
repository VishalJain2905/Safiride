import { Request, Response } from "express";
import Notification from "../models/notification.model"; // Adjust the path as needed
import { Types } from "mongoose";

export class NotificationService {
  static getNotificationsByUser(userId: Types.ObjectId) {
      throw new Error('Method not implemented.');
  }
  async getNotificationsByUser(userId: Types.ObjectId): Promise<any[]> {
    try {
      const notifications = await Notification.find({ recipient: userId })
        .populate("sender", "firstName lastName")
        .populate("ride", "type status")
        .exec();
        
      return notifications.map(notification => ({
        type: notification.type,
        recipient: notification.recipient.toString(),
        sender: notification.sender ? notification.sender.toString() : undefined,
        ride: notification.ride ? notification.ride.toString() : undefined,
        content: notification.content,
        status: notification.status,
        createdAt: notification.createdAt,
        updatedAt: notification.updatedAt,
      }));
    } catch (error) {
      throw new Error("Failed to fetch notifications");
    }
  }
}
