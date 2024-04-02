import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";
import { RequestValidatorError} from "../errors";
import { error } from "console";

export const validateRequestMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new RequestValidatorError(errors.array());
  }
  next();
};
