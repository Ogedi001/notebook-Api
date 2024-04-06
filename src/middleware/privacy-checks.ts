import { Request, NextFunction} from "express";
import { ForbiddenError } from "../errors/forbidden-error";
import { Privacy } from "@prisma/client";

export const isPrivate =(req: Request,
    next: NextFunction)=>{
const currentUser= req.currentUser
if(currentUser&&currentUser.privacy===Privacy.PRIVATE){
    next()
}else{
    throw new ForbiddenError("Access Forbidden: User's privacy is set to private")
}
}


export const isPublic =(req: Request,
    next: NextFunction)=>{
const currentUser= req.currentUser
if(currentUser&&currentUser.privacy===Privacy.PUBLIC){
    next()
}else{
    throw new ForbiddenError("Access Forbidden: User's privacy is set to public")
}
}
