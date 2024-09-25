import { Request,Response,NextFunction } from "express";

export async function signupMiddleware(req:Request,res:Response,next:NextFunction){
    req.body = {
        firstName:req.body.first_name,
        lastName:req.body.last_name,
        email:req.body.email,
        password:req.body.password,
        country:req.body.country, 
        countryCode:req.body.country_code,
        referalCode:req.body.referal_code,
        contryName:req.body.country_shortname,
        contact:req.body.contact_no,
        city:req.body.city
    }
    next();
}

export async function loginMiddleware(req:Request,res:Response,next:NextFunction){
    req.body = {
        email:req.body.username,
        password:req.body.password,
        deviceType:req.body.device_type,
        deviceToken:req.body.device_token,
        role:req.body.role_id,
        deviceName:req.body.device_name
    }
    next();
}

export async function changePasswordMiddleware(req:Request,res:Response,next:NextFunction){
    req.body = {
       oldPassword:req.body.oldPassword,
       newPassword:req.body.newPassword,
       verifyPassword:req.body.confirmPassword
    }
    next();
}

export async function forgetPasswordMiddleware(req:Request,res:Response,next:NextFunction){
    req.body = {
        email:req.body.email
    }
    next();
}

