import { Types } from "mongoose";
import { RideModel } from "../models";

export async function fetchRideById(id:Types.ObjectId){
    return await RideModel.findById(id);
}

export async function createRide(ride:any){
    return await RideModel.create(ride);
}