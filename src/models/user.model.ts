import mongoose, { Schema, Document, Types } from "mongoose";

export enum Role {
  Captain = "captain",
  User = "user",
}



export interface User extends Document {
  ratings: any;
  isOnDuty: any;
  address: any;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  isProfileCompleted: boolean;
  isEmailVerified: boolean;
  phone: Phone;
  otp: OTP;
  role: Role;
  averageRating: number;
  totalRating: number;
  updatedAt: Date;
  createdAt: Date;
  device: Device;
}

interface Phone {
  countryCode: string;
  number: number;
}

interface OTP {
  value: string;
  type: string;
  createdAt: Date;
}


  interface Device {
    deviceName: string;
    deviceToken: string;
    deviceType: string;
    deviceId?: string; 
  }

  interface Location {
    type: "Point";
    coordinates: [number, number];
  }
  
  interface Address {
    lane1: string;
    lane2: string;
    city: string;
    state: string;
    location: Location;
    pincode: string;
  }
  
  


const phoneSchema = new Schema<Phone>({
  countryCode: {
    type: String,
    trim: true,
  },
  number: {
    type: Number,
  },
});

const otpSchema = new Schema<OTP>({
  value: {
    type: String,
  },
  type: {
    type: String,
  },
  createdAt: {
    type: Date,
  },
});

const deviceSchema = new Schema<Device>({
  deviceName: {
    type: String,
  },
  deviceToken: {
    type: String,
  },
  deviceType: {
    type: String,
  },
});

interface Rating {
  rating: number;
  comment: string;
  ratedBy: Types.ObjectId;
  role: string; 
}

const ratingSchema = new Schema<Rating>({
  rating: { type: Number, required: true },
  comment: { type: String },
  ratedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, 
  role: { type: String, enum: [Role.Captain, Role.User], required: true }, 
});

const locationSchema = new Schema<Location>({
  type: {
    type: String,
    enum: ["Point"],
    required: true,
    default: "Point",
  },
  coordinates: {
    type: [Number],
    required: true,
    default: [0, 0], // Default coordinates (longitude, latitude)
  },
});

const addressSchema = new Schema<Address>({
  lane1: {
    type: String,
    trim: true,
    required: true,
  },
  lane2: {
    type: String,
    trim: true,
  },
  city: {
    type: String,
    trim: true,
    required: true,
  },
  state: {
    type: String,
    trim: true,
    required: true,
  },
  location: locationSchema, 
  pincode: {
    type: String,
    trim: true,
    required: true,
  },
});

const userSchema: Schema = new Schema(
  {
    firstName: {
      type: String,
    },
    lastName: {
      type: String,
    },
    email: {
      type: String,
    },
    password: {
      type: String,
    },
    isProfileCompleted: {
      type: Boolean,
      default: false,
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    isPhoneVerified: {
      type: Boolean,
      default: false,
    },
    location: locationSchema,

    address: addressSchema,

    country: {
      type: String,
      trim: true,
    },
    city: {
      type: String,
      trim: true,
    },
    phone: phoneSchema,
    referralCode: {
      type: String,
    },
    role: {
      type: String,
      enum: Object.values(Role),
      trim: true,
    },
    averageRating: {
      type: Number,
    },
    totalRating: {
      type: Number,
    },
    otp: otpSchema,
    device: deviceSchema,
    isOnDuty:{
      type: Boolean,
      default:false,
    },
    ratings: [ratingSchema],
     },
  {
    timestamps: true,
  }
);

export default mongoose.model<User>("User", userSchema);
