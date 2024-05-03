import { NextFunction, Request, Response } from "express";

import { ForbiddenError } from "../errors";
import { RoleName } from "@prisma/client";

export const isAdmin = (req: Request, _: Response, next: NextFunction) => {
  if (req.currentUser?.role.name === RoleName.ADMIN) {
    next();
  } else {
    throw new ForbiddenError("Acess Forbidden: Admin only");
  }
};

export const isUser = (req: Request, _: Response, next: NextFunction) => {
  if (
    req.currentUser?.role.name === RoleName.ADMIN ||
    req.currentUser?.role.name === RoleName.USER
  ) {
    next();
  } else {
    throw new ForbiddenError("Acess Forbidden: Users only");
  }
};
