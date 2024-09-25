import { Types } from "mongoose";
import { UserModel } from "../models";
import { User } from "../models/user.model";

/**
 * @description This function is used to find a user by Id
 * @param {Types.ObjectId} id
 * @author Keshav suman
 * @returns {Promise<User|null>}
 */

export async function findUserById(id: Types.ObjectId): Promise<User | null> {
  return await UserModel.findById(id);
}

/**
 * @description This function is used to find a user by email
 * @param {String} email
 * @author Keshav suman
 * @returns {Promise<User|null>}
 */

export async function findUserByEmail(email: string): Promise<User | null> {
    return await UserModel.findOne({ email });
  }
  
  /**
   * @description This function is used to find a user by email
   * @param {String} countryCode
   * @param {String} phone
   * @author Keshav suman
   * @returns {Promise<User|null>}
   */
  
  export async function findUserByPhone(countryCode:string,phone: number): Promise<User | null> {
    return await UserModel.findOne({ "phone":{
      countryCode:countryCode,
      number:phone
    } });
  }
  
  /**
   * @description this function creates a user in database
   * @param {User} user
   * @author Keshav suman
   * @returns {Promise<User>}
   */
  
  export async function createUser(user:any): Promise<User> {
    return await UserModel.create(user);
  }

/**
 * @description This function is used to generate random OTP
 * @param {Types.ObjectId} userId
 * @param {any} updateBody
 * @author Keshav suman
 * @returns {String}
 */
export async function updateUserById(userId:Types.ObjectId,updateBody:any): Promise<User|null> {
    return await UserModel.findByIdAndUpdate(userId,updateBody);
}