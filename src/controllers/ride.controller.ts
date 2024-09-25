import { Request, Response } from "express";
import mongoose, { Types } from "mongoose";
import Ride from "../models/ride.model";
import ApiError from "../utils/apiError";
import httpStatus from "http-status";
import { RideStatus, RideType } from "../models/ride.model";
import User, { Role } from "../models/user.model";
import { HttpRequest } from "aws-sdk";

export async function initiateRide(req: Request, res: Response) {
  const userId: Types.ObjectId = new Types.ObjectId(res.get("userId"));
  const { type, vehicle, source, destination, user } = req.body;
  
  const ride: any = {
    type: type,
    vehicle: vehicle,
    user: {
      _id: user.id,
      phone: {}
    },
    status: type == RideType.Scheduled ? RideStatus.Scheduled : RideStatus.Pending,
    source: {
      type: "Point",
      coordinates: [source.latitude, source.longitude]
    },
    destination: {
      type: "Point",
      coordinates: [destination.latitude, destination.longitude]
    },
  };

  res.status(httpStatus.OK).send({
    message: "Ride initiated successfully",
    status: httpStatus.OK,
    data: ride
  });
}

export async function scheduleRide(req: Request, res: Response) {
  const userId = res.get("userId");
  const { vehicle, source, destination, scheduledTime } = req.body;

  try {
    if (!scheduledTime) {
      return res.status(httpStatus.BAD_REQUEST).send({
        message: "Scheduled time is required",
        status: httpStatus.BAD_REQUEST,
      });
    }

    const ride: any = {
      type: RideType.Scheduled,
      vehicle: vehicle,
      user: userId,
      status: RideStatus.Scheduled,
      startAt: new Date(scheduledTime),
      source: {
        type: "Point",
        coordinates: [source.latitude, source.longitude],
      },
      destination: {
        type: "Point",
        coordinates: [destination.latitude, destination.longitude],
      },
    };

    const newRide = new Ride(ride);
    await newRide.save();

    res.status(httpStatus.CREATED).send({
      message: "Ride scheduled successfully",
      status: httpStatus.CREATED,
      data: newRide,
    });
  } catch (error: any) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).send({
      message: "An error occurred while scheduling the ride",
      status: httpStatus.INTERNAL_SERVER_ERROR,
      error: error.message,
    });
  }
}

export async function getScheduledRides(req: Request, res: Response) {
  const userId = res.get("userId");
  const role = res.get("role");

  try {
    const filter: any = {
      status: RideStatus.Scheduled,
    };

    if (role === 'user') {
      filter.user = userId;
    } else if (role === 'captain') {
      filter.captain = userId;
    }

    const rides = await Ride.find(filter).populate("user").populate("captain");

    if (rides.length === 0) {
      return res.status(httpStatus.NOT_FOUND).json({
        statusCode: httpStatus.NOT_FOUND,
        message: "No scheduled rides found",
      });
    }

    return res.status(httpStatus.OK).json({
      statusCode: httpStatus.OK,
      message: "Scheduled rides fetched successfully",
      data: rides,
    });
  } catch (error: any) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      message: "An unexpected error occurred",
      status: httpStatus.INTERNAL_SERVER_ERROR,
      error: error.message,
    });
  }
}

export async function changeStatus(req: Request, res: Response) {
  const { rideId } = req.params;
  const { status } = req.body;

  try {
    const ride = await Ride.findById(rideId);
    if (!ride) {
      throw new ApiError(httpStatus.NOT_FOUND, "Ride not found");
    }

    ride.status = status;
    await ride.save();

    res.status(httpStatus.OK).send({
      message: "Ride status updated successfully",
      status: httpStatus.OK,
      data: ride
    });
  } catch (error) {
    if (error instanceof ApiError) {
      res.status(error.statusCode).send({
        message: error.message,
        status: error.statusCode
      });
    } else {
      res.status(httpStatus.INTERNAL_SERVER_ERROR).send({
        message: "An unexpected error occurred",
        status: httpStatus.INTERNAL_SERVER_ERROR
      });
    }
  }
}

export async function fetchRideById(req: Request, res: Response) {
  const { rideId } = req.params;

  try {
    const ride = await Ride.findById(rideId).populate("user");
    if (!ride) {
      throw new ApiError(httpStatus.NOT_FOUND, "Ride not found");
    }

    res.status(httpStatus.OK).send({
      message: "Ride fetched successfully",
      status: httpStatus.OK,
      data: ride
    });
  } catch (error) {
   res.status(httpStatus.INTERNAL_SERVER_ERROR).send({
        message: "An unexpected error occurred",
        status: httpStatus.INTERNAL_SERVER_ERROR
      });
    
  }
}

export async function getAllRides(req: Request, res: Response) {
  try {
    const userId = res.get("userId");
    const role = res.get("role");

    const filter: any = {};

    if (role === 'user') {
      filter.user = userId;
    } else if (role === 'captain') {
      filter.captain = userId;
    }

    const rides = await Ride.find(filter);
    if (rides.length === 0) {
      return res.status(httpStatus.NOT_FOUND).json({
        statusCode: httpStatus.NOT_FOUND,
        message: "No rides found",
      });
    }

    return res.status(httpStatus.OK).json({
      statusCode: httpStatus.OK,
      message: "Rides fetched successfully",
      data: rides,
    });
  } catch (error:any) {
    console.error("Error fetching rides:", error); 
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      message: "An unexpected error occurred",
      status: httpStatus.INTERNAL_SERVER_ERROR,
      error: error.message,  
    });
  }
}

export async function fetchCurrentRide(req: Request, res: Response) {
  const userId = res.get("userId");
  try {
    const matchBody:any = {
        status: { $in: [RideStatus.Ongoing, RideStatus.Scheduled, RideStatus.Pending] }
    };

    if(res.get("role")==Role.User){
        matchBody["user"] = userId
    }else{
        matchBody["captain"] = userId
    }

    const ride = await Ride.findOne(matchBody);
    
    if (!ride) {
      throw new ApiError(httpStatus.NOT_FOUND, "No current ride found");
    }
    
    res.status(httpStatus.OK).send({
      message: "Current ride fetched successfully",
      status: httpStatus.OK,
      data: ride
    });
  } catch (error) {
    
      res.status(httpStatus.INTERNAL_SERVER_ERROR).send({
        message: "An unexpected error occurred ",
        status: httpStatus.INTERNAL_SERVER_ERROR
      });
  }
}

export async function getRideByIdOrStatus(req: Request, res: Response) {
  try {
    const { id } = req.params; // ID is in params
    const { status } = req.query; // Status is in query

    // Create a dynamic filter object based on the incoming request
    const filter: any = {};

    // If ID is provided, validate and add to the filter
    if (id) {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(httpStatus.BAD_REQUEST).send({
          statusCode: httpStatus.BAD_REQUEST,
          message: "Invalid ride ID format",
        });
      }
      filter._id = id;
    }

    // If status is provided, add to the filter
    if (status) {
      filter.status = status;
    }

    // Find the rides based on the filter (ID, status, or both)
    const rides = await Ride.find(filter).select("_id status");

    if (rides.length === 0) {
      return res.status(httpStatus.NOT_FOUND).send({
        statusCode: httpStatus.NOT_FOUND,
        message: "No rides found for the provided criteria",
      });
    }

    res.status(httpStatus.OK).send({
      statusCode: httpStatus.OK,
      message: "Rides fetched successfully",
      data: rides,
    });
  } catch (error:any) {
    console.error(error);
    res.status(httpStatus.INTERNAL_SERVER_ERROR).send({
      statusCode: httpStatus.INTERNAL_SERVER_ERROR,
      message: "An error occurred while fetching the ride",
      error: error.message,
    });
  }
}

export async function acceptRide(req: Request, res: Response) {
  const { rideId } =req.params;
  const userId = res.get("userId");
  
  try{
    const ride = await Ride.findById(rideId);

    if(!ride){
      return res.status(httpStatus.NOT_FOUND).json({
        statusCode: httpStatus.NOT_FOUND,
        message: "Ride Not Found",
      });
    }

    if (ride.status !== RideStatus.Pending && ride.status !== RideStatus.Scheduled){
      return res.status(httpStatus.BAD_REQUEST).json({
        statusCode: httpStatus.BAD_REQUEST,
        message: "Ride Cannot be accepted,  It's already in progress or completed",
      });
    }
    ride.status =RideStatus.Ongoing;
    ride.save();

    res.status(httpStatus.OK).json({
      statusCode: httpStatus.OK,
      message:"Ride accepted Successfully",
      data: ride,
    });
  } catch(error:any) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      statusCode: httpStatus.INTERNAL_SERVER_ERROR,
      message: "An error occurred while accepting ride",
      error: error.message,
    });
  }
}

export async function cancelRide(req: Request, res: Response) {
  const { rideId } = req.params;
  const { cancellationReason } = req.body;
  const userId = res.get("userId");
  const role = res.get("role");

  try {
    const ride = await Ride.findById(rideId);
    if (!ride) {
      return res.status(httpStatus.NOT_FOUND).json({
        statusCode: httpStatus.NOT_FOUND,
        message: "Ride not found",
      });
    }

    // Convert userId to ObjectId
    const userObjectId = userId ? new mongoose.Types.ObjectId(userId) : undefined;

    if (!userObjectId) {
      return res.status(httpStatus.BAD_REQUEST).json({
        statusCode: httpStatus.BAD_REQUEST,
        message: "Invalid user ID",
      });
    }

    // Ensure the ride can be cancelled
    if (ride.status === RideStatus.Completed || ride.status === RideStatus.Cancelled) {
      return res.status(httpStatus.BAD_REQUEST).json({
        statusCode: httpStatus.BAD_REQUEST,
        message: "Ride cannot be cancelled",
      });
    }

    // Update ride status to "Cancelled" and log the cancellation details
    ride.status = RideStatus.Cancelled;
    ride.cancellation = {
      cancellationReason: cancellationReason || "No reason provided",
      cancelledByRole: role === Role.User ? Role.User : Role.Captain,
      cancelledBy: userObjectId,
    };
    
    await ride.save();

    res.status(httpStatus.OK).json({
      statusCode: httpStatus.OK,
      message: "Ride cancelled successfully",
      data: ride,
    });
  } catch (error: any) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      statusCode: httpStatus.INTERNAL_SERVER_ERROR,
      message: "An error occurred while cancelling the ride",
      error: error.message,
    });
  }
}

export async function updateRideStops(req: Request, res: Response) {
  const { rideId } = req.params;
  const { stops } = req.body;

  try {
    // Validate the rideId
    if (!mongoose.Types.ObjectId.isValid(rideId)) {
      return res.status(httpStatus.BAD_REQUEST).send({
        status: httpStatus.BAD_REQUEST,
        message: "Invalid ride ID format",
      });
    }

    // Fetch the ride by ID
    const ride = await Ride.findById(rideId);
    if (!ride) {
      return res.status(httpStatus.NOT_FOUND).send({
        status: httpStatus.NOT_FOUND,
        message: "Ride not found",
      });
    }

    // Update ride stops
    if (stops && Array.isArray(stops) && stops.length > 0) {
      ride.stops = stops.map((stop: any) => ({
        type: "Point",
        coordinates: [stop.latitude, stop.longitude],
      }));
    } else {
      return res.status(httpStatus.BAD_REQUEST).send({
        status: httpStatus.BAD_REQUEST,
        message: "Stops must be an array of valid coordinates",
      });
    }

    await ride.save();

    res.status(httpStatus.OK).send({
      message: "Ride stops updated successfully",
      status: httpStatus.OK,
      data: ride,
    });
  } catch (error: any) {
    console.error("Error updating ride stops:", error);
    res.status(httpStatus.INTERNAL_SERVER_ERROR).send({
      message: "An unexpected error occurred while updating ride stops",
      status: httpStatus.INTERNAL_SERVER_ERROR,
      error: error.message,
    });
  }
}

export async function getRideHistory(req: Request, res: Response) {
  const userId = res.get("userId");
  const role = res.get("role");

  try {
    const filter: any = {
      status: { $in: [RideStatus.Completed, RideStatus.Cancelled] }, // Fetch completed or canceled rides
    };

    if (role === 'user') {
      filter.user = userId;
    } else if (role === 'captain') {
      filter.captain = userId;
    }

    const rides = await Ride.find(filter)
      .populate("user")
      .populate("captain");

    if (rides.length === 0) {
      return res.status(httpStatus.NOT_FOUND).json({
        statusCode: httpStatus.NOT_FOUND,
        message: "No ride history found",
      });
    }

    return res.status(httpStatus.OK).json({
      statusCode: httpStatus.OK,
      message: "Ride history fetched successfully",
      data: rides,
    });
  } catch (error: any) {
    console.error("Error fetching ride history:", error);
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      message: "An unexpected error occurred",
      status: httpStatus.INTERNAL_SERVER_ERROR,
      error: error.message,
    });
  }
}




