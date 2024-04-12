import { Request,Response, NextFunction, RequestHandler} from "express";
import { ForbiddenError } from "../errors/forbidden-error";
import { sendEmailVerificationLinkEmail } from "../helpers";



export const emailVerificationCheck: RequestHandler  = async (
  req: Request,
  _:Response,
  next: NextFunction
) => {
  const user = req.currentUser;
  if (user && user.isEmailVerified === true) {
    await sendEmailVerificationLinkEmail({ userId: user.id, email: user.email, username:`${user.firstname} ${user.lastname}` });
    next();
  }else{
    throw new ForbiddenError('Access Forbidden: Email not verified')
  }
};
