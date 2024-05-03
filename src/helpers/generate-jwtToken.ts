import "dotenv/config"
import jwt from "jsonwebtoken";
import { Request } from "express";
import { Privacy } from "@prisma/client";

export interface Userpayload {
  id: string;
  email: string;
  firstname: string;
  lastname: string;
  isEmailVerified: boolean;
  role:{
    name:string,
    roleId:string
  }
}



type ExpireIn = string | undefined 

const secret = process.env.JWT_SECRET || ''
const expiresIn: ExpireIn= process.env.JWT_EXPIRES_IN;

export const generateJWT = (payload:Userpayload)=>{
    const userJWT = jwt.sign(payload,secret!,{expiresIn})
    return userJWT
}

export const verifyJwtToken = (token:string)=>{
return jwt.verify(token,secret) as jwt.JwtPayload
}