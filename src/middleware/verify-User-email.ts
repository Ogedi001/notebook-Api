import { Request, NextFunction} from "express";
import { ForbiddenError } from "../errors/forbidden-error";

export const emailVerificationCheck = async (
  req: Request,
  next: NextFunction
) => {
  const currentUser = req.currentUser;
  if (currentUser && currentUser.isEmailVerified === true) {
    //await sendEmailVerificationLinkEmail({ id: currentUser.id, email: currentUser.email });
    next();
  }else{
    throw new ForbiddenError('Access Forbidden: Email not verified')
  }
};
