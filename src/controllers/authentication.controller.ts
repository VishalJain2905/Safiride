import { Request, Response } from "express";
import httpStatus from "http-status";
import { User } from "../models/user.model";
import { AuthenticationService,UserService } from "../service";
import ApiError from "../utils/apiError";


export async function login(req: Request, res: Response) {
  try {
    const { email, password, deviceType, deviceToken, deviceName, role } = req.body;

    if (!email || !password || !deviceType || !deviceToken || !deviceName || !role) {
      return res.status(httpStatus.BAD_REQUEST).send({
        statusCode: httpStatus.BAD_REQUEST,
        message: "Missing required fields",
      });
    }

    const user = await UserService.findUserByEmail(email);
    if (user) {
      const isPasswordValid = await AuthenticationService.comparePassword(password, user.password);
      if (isPasswordValid) {
        // Ensure the device object matches the Device interface
        user.device = {
          deviceName,
          deviceToken,
          deviceType, // Ensure this property is correctly named in Device interface
        };
        await user.save();

        res.status(httpStatus.OK).send({
          statusCode: httpStatus.OK,
          message: "User logged in successfully",
          data: {
            user,
            token: AuthenticationService.generateToken(user.toObject()),
          },
        });
      } else {
        res.status(httpStatus.BAD_REQUEST).send({
          statusCode: httpStatus.BAD_REQUEST,
          message: "Password doesn't match",
        });
      }
    } else {
      res.status(httpStatus.BAD_REQUEST).send({
        statusCode: httpStatus.BAD_REQUEST,
        message: "User doesn't exist",
      });
    }
  } catch (error) {
    console.error("Login error:", error);
    res.status(httpStatus.INTERNAL_SERVER_ERROR).send({
      statusCode: httpStatus.INTERNAL_SERVER_ERROR,
      message: "Internal server error",
    });
  }
}

export async function signup(req: Request, res: Response) {
    if (await UserService.findUserByEmail(req.body.email)) {
      throw new ApiError(httpStatus.BAD_REQUEST,"User with this email already exists");
    } else {
      const user = {
        ...req.body,
        password: AuthenticationService.hashPassword(req.body.password),
      };
      const createdUser = await UserService.createUser(user as User);
      res.status(httpStatus.OK).send({
        statusCode: httpStatus.OK,
        message: "User created successfully",
        data: {
          user: createdUser,
          token: AuthenticationService.generateToken(createdUser.toObject()),
        },
      });
    }
}

export async function sendOTP(req: Request, res: Response){
  try {
    const {email,phone,type} = req.body;
    const otp = AuthenticationService.genrateOTP();

      if(type==="email"){
        const user:User|null  = await UserService.findUserByEmail(email);
        if(user){
          await AuthenticationService.sendOTPOnEmail(otp,user.email);
          await UserService.updateUserById(user._id,{otp:{value:otp,createdAt:Date.now()}});
          res.status(httpStatus.OK).send({
            statusCode: httpStatus.OK,
            message: "OTP sent successfully",
            data: {
              user,
              token: AuthenticationService.generateToken(user.toObject()),
            },
          });
        } else {
            res.status(httpStatus.BAD_REQUEST).send({
              statusCode: httpStatus.BAD_REQUEST,
              message: "User doesn't Exists",
            });
          
        }
      }
      else if(type==="phone"){
        const user:User|null = await UserService.findUserByPhone(phone.countryCode,phone.number);
        if(user){
          await AuthenticationService.sendOTPOnPhone(otp,user.phone.number);
          await UserService.updateUserById(user._id,{otp:{value:otp,createdAt:Date.now()}});
          res.status(httpStatus.OK).send({
            statusCode: httpStatus.OK,
            message: "OTP sent successfully",
            data: {
              user,
              token: AuthenticationService.generateToken(user.toObject()),
            },
          });
        } else {
            res.status(httpStatus.BAD_REQUEST).send({
              statusCode: httpStatus.BAD_REQUEST,
              message: "User doesn't Exists",
            });
          
        }
      }else{
        res.status(httpStatus.BAD_REQUEST).send({
          statusCode: httpStatus.BAD_REQUEST,
          message: "Type not defined",
        });
      }    
    
  } catch (error) {
    console.log(error);
    res.status(httpStatus.INTERNAL_SERVER_ERROR).send({
      statusCode: httpStatus.INTERNAL_SERVER_ERROR,
      message: error,
    });
  }
}

export async function verifyOTP(req: Request, res: Response){
  try {
    const {email,phone,type} = req.body;
    if(type==="email"){
      const user: User | null = await UserService.findUserByEmail(email);
      if (user) {
        if (req.body.otp===user.otp.value) {
          res.status(httpStatus.OK).send({
            statusCode: httpStatus.OK,
            message: "OTP verified",
            data: {
              user,
              token: AuthenticationService.generateToken(user.toObject()),
            },
          });
        } else {
          res.status(httpStatus.BAD_REQUEST).send({
            statusCode: httpStatus.BAD_REQUEST,
            message: "OTP doesn't matched",
          });
        }
      }
      else {
        res.status(httpStatus.BAD_REQUEST).send({
          statusCode: httpStatus.BAD_REQUEST,
          message: "User doesn't Exists",
        });
      }
    }else if(type==="phone"){
      const user: User | null = await UserService.findUserByPhone(phone.countryCode,phone.number);
      if (user) {
        if (req.body.otp===user.otp.value) {
          res.status(httpStatus.OK).send({
            statusCode: httpStatus.OK,
            message: "OTP verified",
            data: {
              user,
              token: AuthenticationService.generateToken(user.toObject()),
            },
          });
        } else {
          res.status(httpStatus.BAD_REQUEST).send({
            statusCode: httpStatus.BAD_REQUEST,
            message: "OTP doesn't matched",
          });
        }
      }
      else {
        res.status(httpStatus.BAD_REQUEST).send({
          statusCode: httpStatus.BAD_REQUEST,
          message: "User doesn't Exists",
        });
      }
    }else{
      res.status(httpStatus.BAD_REQUEST).send({
        statusCode: httpStatus.BAD_REQUEST,
        message: "Type not found",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(httpStatus.INTERNAL_SERVER_ERROR).send({
      statusCode: httpStatus.INTERNAL_SERVER_ERROR,
      message: error,
    });
  }
}

export async function resendOTP(req: Request, res: Response) {
  try {
    const { email, phone, type } = req.body;
    const otp = AuthenticationService.genrateOTP();

    // Step 1: Resend OTP via email
    if (type === "email") {
      const user: User | null = await UserService.findUserByEmail(email);
      if (user) {
        // Resend OTP via email
        await AuthenticationService.sendOTPOnEmail(otp, user.email);
        // Update the OTP and timestamp
        await UserService.updateUserById(user._id, { otp: { value: otp, createdAt: Date.now() } });
        res.status(httpStatus.OK).send({
          statusCode: httpStatus.OK,
          message: "OTP resent successfully",
          data: {
            user,
            token: AuthenticationService.generateToken(user.toObject()),
          },
        });
      } else {
        res.status(httpStatus.BAD_REQUEST).send({
          statusCode: httpStatus.BAD_REQUEST,
          message: "User doesn't exist",
        });
      }
    }

    // Step 2: Resend OTP via phone
    else if (type === "phone") {
      const user: User | null = await UserService.findUserByPhone(phone.countryCode, phone.number);
      if (user) {
        // Resend OTP via phone
        await AuthenticationService.sendOTPOnPhone(otp, user.phone.number);
        // Update the OTP and timestamp
        await UserService.updateUserById(user._id, { otp: { value: otp, createdAt: Date.now() } });
        res.status(httpStatus.OK).send({
          statusCode: httpStatus.OK,
          message: "OTP resent successfully",
          data: {
            user,
            token: AuthenticationService.generateToken(user.toObject()),
          },
        });
      } else {
        res.status(httpStatus.BAD_REQUEST).send({
          statusCode: httpStatus.BAD_REQUEST,
          message: "User doesn't exist",
        });
      }
    }

    // Step 3: Handle invalid type
    else {
      res.status(httpStatus.BAD_REQUEST).send({
        statusCode: httpStatus.BAD_REQUEST,
        message: "Type not defined",
      });
    }

  } catch (error:any) {
    console.log(error);
    res.status(httpStatus.INTERNAL_SERVER_ERROR).send({
      statusCode: httpStatus.INTERNAL_SERVER_ERROR,
      message: "An error occurred while resending OTP",
      error: error.message,
    });
  }
}

export async function forgetPassword(req: Request, res: Response){
  try {
    const user: User | null = await UserService.findUserByPhone(req.body.countryCode,req.body.phone);
    if (user) {
      if (req.body.otp===user.otp.value) {
        res.status(httpStatus.OK).send({
          statusCode: httpStatus.OK,
          message: "User login successfully",
          data: {
            user,
            token: AuthenticationService.generateToken(user.toObject()),
          },
        });
      } else {
        res.status(httpStatus.BAD_REQUEST).send({
          statusCode: httpStatus.BAD_REQUEST,
          message: "OTP doesn't matched",
        });
      }
    } else {
      res.status(httpStatus.BAD_REQUEST).send({
        statusCode: httpStatus.BAD_REQUEST,
        message: "User doesn't Exists",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(httpStatus.INTERNAL_SERVER_ERROR).send({
      statusCode: httpStatus.INTERNAL_SERVER_ERROR,
      message: error,
    });
  }
}

export async function resetPassword(req: Request, res: Response){
  try {
    const user: User | null = await UserService.findUserByPhone(req.body.countryCode,req.body.phone);
    if (user) {
      if (req.body.otp===user.otp.value) {
        res.status(httpStatus.OK).send({
          statusCode: httpStatus.OK,
          message: "User login successfully",
          data: {
            user,
            token: AuthenticationService.generateToken(user.toObject()),
          },
        });
      } else {
        res.status(httpStatus.BAD_REQUEST).send({
          statusCode: httpStatus.BAD_REQUEST,
          message: "OTP doesn't matched",
        });
      }
    } else {
      res.status(httpStatus.BAD_REQUEST).send({
        statusCode: httpStatus.BAD_REQUEST,
        message: "User doesn't Exists",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(httpStatus.INTERNAL_SERVER_ERROR).send({
      statusCode: httpStatus.INTERNAL_SERVER_ERROR,
      message: error,
    });
  }
}

export async function changePassword(req: Request, res: Response){
  try {
    const user: User | null = await UserService.findUserByPhone(req.body.countryCode,req.body.phone);
    if (user) {
      if (req.body.otp===user.otp.value) {
        res.status(httpStatus.OK).send({
          statusCode: httpStatus.OK,
          message: "User login successfully",
          data: {
            user,
            token: AuthenticationService.generateToken(user.toObject()),
          },
        });
      } else {
        res.status(httpStatus.BAD_REQUEST).send({
          statusCode: httpStatus.BAD_REQUEST,
          message: "OTP doesn't matched",
        });
      }
    } else {
      res.status(httpStatus.BAD_REQUEST).send({
        statusCode: httpStatus.BAD_REQUEST,
        message: "User doesn't Exists",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(httpStatus.INTERNAL_SERVER_ERROR).send({
      statusCode: httpStatus.INTERNAL_SERVER_ERROR,
      message: error,
    });
  }
}

