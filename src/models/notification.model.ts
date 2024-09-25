import mongoose, { Schema, Document } from "mongoose";
import { Ride } from "./ride.model"; // Assuming rideSchema is defined in ride.model.ts
import { User } from "./user.model"; // Assuming userSchema is defined in user.model.ts

export enum NotificationType {
  RideStatusUpdate = "ride_status_update",
  NewMessage = "new_message",
  RideCancellation = "ride_cancellation",
  Promotion = "promotion",
  General = "general"
}

export enum NotificationStatus {
  Unread = "unread",
  Read = "read"
}

export interface Notification extends Document {
  type: NotificationType;
  recipient: mongoose.Types.ObjectId | User;
  sender?: mongoose.Types.ObjectId | User;
  ride?: mongoose.Types.ObjectId | Ride;
  content: string;
  status: NotificationStatus;
  createdAt: Date;
  updatedAt: Date;
}

const notificationSchema: Schema = new Schema(
  {
    type: {
      type: String,
      enum: NotificationType,
      required: true,
    },
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    ride: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Ride",
    },
    content: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: NotificationStatus,
      default: NotificationStatus.Unread,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<Notification>("Notification", notificationSchema);
