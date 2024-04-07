import {
    User,
    Token,
} from "@prisma/client";
import { prisma } from "../client";
import crypto from "crypto";
  
export type UserAccount = Partial<Pick<User,'resetPasswordExpires'|'resetPasswordToken'|'middlename'>> & Pick<
    User,
    'firstname'|'lastname'|'email'|'password'
  >;

export type ReturnedUser = Partial<Pick<User,'password'>> &
  Omit<User, "password">;

export type UserSettings = Pick<
  User,
  "firstname" | "lastname" |'middlename'
>;

export const createUser = async (data: UserAccount):Promise<ReturnedUser> => {
    const user: ReturnedUser = await prisma.user.create({
        data: { ...data },
    });
    delete user.password;

    return user;
};

export const findUser = async (
    email: string
  ): Promise<ReturnedUser | null> => {
    return await prisma.user.findUnique({ where: { email } });
};

export const getUserResetPasswordTokenService = async (
    email: string,
    nullify: boolean
  ): Promise<string | null> => {
    if (nullify) {
      await prisma.user.update({
        where: { email },
        data: {
          resetPasswordToken: null,
          resetPasswordExpires: null,
        },
      });
  
      return null;
    }
  
    // set to expire in 10 mins
    const currentDate = String(Date.now() + 10 * 60 * 1000);
    const resetToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");
  
    await prisma.user.update({
      where: { email },
      data: {
        resetPasswordToken: hashedToken,
        resetPasswordExpires: currentDate,
      },
    });
  
    return resetToken;
};

export const findUserByResetPasswordToken = async (
    resetToken: string
  ): Promise<User | null> => {
    const resetPasswordToken = crypto
      .createHash("sha256")
      .update(resetToken.trim())
      .digest("hex");
  
    const user = await prisma.user.findUnique({
      where: { resetPasswordToken },
    });
  
    if (!user) return null;
  
    if (user.resetPasswordExpires && +user.resetPasswordExpires < Date.now())
      return null;
  
    return user;
};

export const findUserByIdService = async (
    userId: string
  ): Promise<ReturnedUser | null> => {
    return await prisma.user.findUnique({ 
      where: { id: userId }
    });
};

export const updatePassword = async (email: string, password: string) => {
    const user = await prisma.user.update({
      where: { email },
      data: { password },
    });
    return user;
};


export const createUserTokenService = async (
    userId: string,
    token: string
  ): Promise<Token> => {
    // Token set to expire in one hour
    const currentDate = String(Date.now() + 60 * 60 * 1000);
    return await prisma.token.create({
      data: {
        User: { connect: { id: userId } },
        token,
        expiresAt: currentDate,
      },
    });
};

export const findTokenService = async (
    token: string
  ): Promise<Token | null> => {
    const tokenData = await prisma.token.findUnique({ where: { token } });
  
    if (!tokenData) return null;
  
    if (+tokenData.expiresAt < Date.now()) return null;
  
    return tokenData;
};

export const verifyUserEmailService = async (id: string): Promise<User> => {
    return await prisma.user.update({
      where: { id },
      data: { isEmailVerified: true},
    });
};
