import { UserModel } from "../models";
import { User } from "../models/user.model";
import jsonwebtoken from "jsonwebtoken";
import bcrypt from "bcryptjs";
import otpGenerator from "otp-generator";


/**
 * @description this function is used to hash password
 * @param {String} password
 * @author Keshav suman
 * @returns {String}
 */
export function hashPassword(password: string): string {
  return bcrypt.hashSync(password);
}

/**
 * @description this function is used to compare password
 * @param {String} password
 * @param {String} hashpassword
 * @author Keshav suman
 * @returns {Boolean}
 */
export function comparePassword(
  password: string,
  hashpassword: string
): boolean {
  return bcrypt.compareSync(password, hashpassword);
}

/**
 * @description This function is used to generate authenticaton token
 * @param {User} user
 * @author Keshav suman
 * @returns {String}
 */
export function generateToken(user: User): string {
  return jsonwebtoken.sign(user, process.env.JWT_Token!);
}

/**
 * @description This function is used to generate authenticaton token
 * @param {String} otp
 * @param {Number} phone
 * @author Keshav suman
 * @returns {Promise<Boolean>}
 */
export async function sendOTPOnPhone(otp:string,phone:number): Promise<boolean> {
  return false;
}

/**
 * @description This function is used to generate authenticaton token
 * @param {String} otp
 * @param {String} email
 * @author Keshav suman
 * @returns {Promise<Boolean>}
 */
export async function sendOTPOnEmail(otp:string,email:string): Promise<boolean> {
  return false;
}

/**
 * @description This function is used to generate random OTP
 * @author Keshav suman
 * @returns {String}
 */
export function genrateOTP(): string {
  if(process.env.NODE_ENV=="development"){
    return "123456";
  }
  return otpGenerator.generate(6, { upperCaseAlphabets: false, specialChars: false });;
}





