import { User, Token, RoleName, Role } from "@prisma/client";
import { prisma } from "../client";
import crypto from "crypto";
import { OwnedNotebook, SharedNotebook, UserRole } from "../interface";

export type UserAccount = Partial<
  Pick<User, "resetPasswordExpires" | "resetPasswordToken" | "middlename">
> &
  Pick<User, "firstname" | "lastname" | "email" | "password">;

export type UserData = Partial<Pick<User, "password">> &
  Omit<User, "password">;

  export type ReturnedUser ={
    role:UserRole
  }& UserData

export type ReturnedUserData = {
  ownedNotebooks: OwnedNotebook[];
  sharedNotebooks: SharedNotebook[]
} & UserData

export type UserSettings = Pick<User, "firstname" | "lastname" | "middlename">;


export const createRole= async (roleName:RoleName):Promise<Role>=>{
  const existingRole = await prisma.role.findFirst({ where: { roleName: roleName } });
  
  if (!existingRole) {
    return prisma.role.create({ data: { roleName: roleName } });
  }
  return existingRole;
}

export const createUser = async (data: UserAccount, role:Role): Promise<UserData> => {
  const user: UserData = await prisma.user.create({
    data: { ...data, 
      role:{connect:{ id: role.id }}
    },
  });
  delete user.password;

  return user;
};

export const findUser = async (email: string):Promise<ReturnedUser|null> => {
  return await prisma.user.findUnique({ where: { email },
  include:{
    role:{
    select:{
      id:true,
      roleName:true
    }
    }
  } });
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

export const findUserByIdService = async (userId: string):Promise<ReturnedUserData|null>=> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      ownedNotebooks: {
        select: {
          id: true,
          title: true,
          content: true,
          privacy: true,
          tags: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
      sharedNotebooks: {
        select: {
          id: true,
          title: true,
          content: true,
          privacy: true,
          ownerId: true,
          tags: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
    },
  });
  return user
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
    data: { isEmailVerified: true },
  });
};
