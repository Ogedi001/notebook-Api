/// <reference path="../typings/index.d.ts" />
import { Request, Response, NextFunction, RequestHandler } from "express";
import { checkBlacklist, Userpayload, verifyJwtToken } from "../helpers";
import { StatusCodes } from "http-status-codes";
import logger from "../Logger";
import { BadRequestError } from "../errors";

const AUTH_HEADER_PREFIX = "Bearer";
let token: any;
export const currentUserMiddleware: RequestHandler  = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith(AUTH_HEADER_PREFIX)) {
    token = authHeader.split(" ")[1];
  }
  if (!token) {
    res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ message: "User Not Logged In" });
    return;
  }

  const isBlacklisted = await checkBlacklist(token);
  if (isBlacklisted) throw new BadRequestError("Invalid Token");

  try {
    const payload = verifyJwtToken(token) as Userpayload;
    req.currentUser = payload;
    next();
  } catch (error) {
    logger.info("Token Verification Error: ", error);
    res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ message: "User Not Logged In" });
  }
  //next();
};
