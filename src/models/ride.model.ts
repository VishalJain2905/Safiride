import mongoose, { Schema, Document } from "mongoose";
import { Role, User } from "../models/user.model";

export enum RideType {
  OffApp = "off-app",
  Gift = "gift",
  Scheduled = "scheduled"
}

enum VehicleType {
  Electric = "electric",
}

export enum RideStatus {
  Scheduled = "scheduled",
  Pending = "pending",
  Completed = "completed",
  Cancelled = "cancelled",
  Ongoing = "ongoing"
}

export interface Ride extends Document {
  type: RideType;
  vehicle: VehicleType;
  user: mongoose.Types.ObjectId | User;
  startAt: Date;
  endAt: Date;
  status: RideStatus;
  updatedAt: Date;
  createdAt: Date;
  source: {
    type: string;
    coordinates: number[];
  };
  destination: {
    type: string;
    coordinates: number[];
  };
  cancellation?: {
    cancellationReason?: string;
    cancelledByRole?: Role;
    cancelledBy?: mongoose.Types.ObjectId;
  };
  distance?: {
    value: number;
    unit: string;
  };
  stops?: any[]; // Define stops structure
  ratingByUser?: number;
  ratingByCaptain?: number;
}

const rideSchema: Schema = new Schema(
  {
    type: {
      type: String,
      enum: RideType,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
    source: {
      type: {
        type: String,
        default: "Point",
      },
      coordinates: [Number],
    },
    destination: {
      type: {
        type: String,
        default: "Point",
      },
      coordinates: [Number],
    },
    vehicle: {
      type: String,
      enum: VehicleType,
    },
    captain: {
      type: mongoose.Schema.Types.ObjectId,
    },
    status: {
      type: String,
      enum: RideStatus,
    },
    startAt: {
      type: mongoose.Schema.Types.Date,
    },
    endAt: {
      type: mongoose.Schema.Types.Date,
    },
    cancellation: {
      cancellationReason: {
        type: String,
      },
      cancelledByRole: {
        type: String,
        enum: Role,
      },
      cancelledBy: {
        type: mongoose.Schema.Types.ObjectId,
      },
    },
    distance: {
      value: {
        type: Number,
      },
      unit: {
        type: String,
      },
    },
    stops: [], 
    ratingByUser: {
      type: Number,
    },
    rideStatus: {
      type: String,
      enum: RideStatus,
    },    
    ratingByCaptain: {
      type: Number,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<Ride>("Ride", rideSchema);
