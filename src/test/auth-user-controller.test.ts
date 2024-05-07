import { RoleName, Token, User } from "@prisma/client";
import * as authUserService from "../service/auth-user-service";
import { Request, Response ,NextFunction} from "express";
import { StatusCodes } from "http-status-codes";
import {
  forgotPasswordController,
  loginUserController,
  logOutController,
  registerUserController,
  resendEmailVerificationLink,
  resetPasswordController,
  userUpdatePasswordController,
  verifyEmailController,
} from "../controller/auth-user-controller";
import { BadRequestError } from "../errors";
import { blacklistJWTtoken, generateJWT, Password, sendResetPasswordEmail } from "../helpers";
import jwt from "jsonwebtoken";

jest.mock("../service/auth-user-service.ts");
jest.mock('../helpers/generate-jwtToken.ts')
jest.mock("../helpers/hashedPassword.ts");
jest.mock("../helpers/email.ts", () => ({
  sendEmailVerificationLinkEmail: jest.fn(),
  sendResetPasswordEmail:jest.fn()
}));
jest.mock("../utils/redis.ts", () => ({
  redisClient: jest.fn(),
}));
jest.mock('../helpers/redis-blacklist-jwtToken.ts')

const createMockUser = async () => {
  const hashedPassword = await Password.toHash("uyiop");
  return {
    id: "userIdw43",
    email: "ogedi@gmail.com",
    firstname: "favour",
    lastname: "uchi",
    middlename: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    password: hashedPassword,
    isEmailVerified: true,
    resetPasswordExpires: null,
    resetPasswordToken: null,
    roleId:'123abc',
    role:{
      roleId:'123abc',
      roleName:RoleName.USER
    }
  };
};




const mockTokenData: Token = {
  id: "yyyya",
  token: "rtyuio",
  expiresAt: "45tfg",
  createdAt: new Date(),
  updatedAt: new Date(),
  userId: "userIdw43",
};


describe("User-Auth Controller", () => {
  afterEach(() => {
    jest.clearAllMocks(); // Clear mock function calls after each test
  });

  describe("registerUserController", () => {
   
    it("should create a new user successfully", async () => {
      const mockUser = await createMockUser();
      const data: authUserService.UserAccount = {
        firstname: "firstname",
        lastname: "lastname",
        email: "email",
        password: "password",
      };
      const req = {
        body: { ...data, comfirmPassword: "password" },
      } as Request;

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      (authUserService.createUser as jest.Mock).mockResolvedValueOnce(mockUser);

      await registerUserController(req, res);

      expect(res.status).toHaveBeenCalledWith(StatusCodes.CREATED);
      expect(res.json).toHaveBeenCalledWith({
        data: mockUser,
        message: "success",
      });
    });

    it("should throw BadRequestError when passwords do not match", async () => {
      const mockUser = await createMockUser();
      const data: authUserService.UserAccount = {
        firstname: "firstname",
        lastname: "lastname",
        email: "email",
        password: "password",
      };
      const req = {
        body: { ...data, confirmPassword: "differentpassword" },
      } as Request;

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      await expect(registerUserController(req, res)).rejects.toThrow(
        BadRequestError
      );

      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
    });

    it("it should verify the user email", async () => {
      const mockUser = await createMockUser();
      const req = {
        params: { userId: "userIdw43", token: "yyyya" },
      } as unknown as Request;
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      (authUserService.findUserByIdService as jest.Mock).mockResolvedValueOnce(
        mockUser
      );

      (authUserService.findTokenService as jest.Mock).mockResolvedValueOnce(
        mockTokenData
      );
      (
        authUserService.verifyUserEmailService as jest.Mock
      ).mockResolvedValueOnce(mockUser);

      await verifyEmailController(req, res);

      expect(authUserService.findUserByIdService).toHaveBeenCalledWith("userIdw43");
      expect(authUserService.findTokenService).toHaveBeenCalledWith("yyyya");
      expect(res.status).toHaveBeenCalledWith(StatusCodes.OK);
      expect(res.json).toHaveBeenCalledWith({
        data: {
          message: "Email verification successful",
        },
        message: "success",
      });
    });
  });

  it("it should resend email verification link ", async () => {
    const mockUser = await createMockUser();
    const req = {
      body: { email: "ogedi@gmail.com" },
    } as unknown as Request;
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;
    (authUserService.findUser as jest.Mock).mockResolvedValueOnce(mockUser);

    await resendEmailVerificationLink(req, res);

    expect(authUserService.findUser).toHaveBeenCalledWith("ogedi@gmail.com");
    expect(res.status).toHaveBeenCalledWith(StatusCodes.OK);
    expect(res.json).toHaveBeenCalledWith({
      data: {
        message: "Email verification link resent",
      },
      message: "success",
    });
  });

  it("it should log In the user ", async () => {
    const mockUser = await createMockUser();

    const req = {
      body: { email: "ogedi@gmail.com", password: "uyiop" },
    } as unknown as Request;
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;
    (authUserService.findUser as jest.Mock).mockResolvedValueOnce(mockUser);

    (Password.comparePassword as jest.Mock).mockResolvedValueOnce(true);
    (generateJWT as jest.Mock).mockReturnValueOnce("fakeJwtToken");
    await loginUserController(req, res);

    expect(generateJWT).toHaveBeenCalledWith({
      id: "userIdw43",
      email: "ogedi@gmail.com",
      firstname: "favour",
      lastname: "uchi",
      isEmailVerified: true,
      role:{
        roleId:mockUser.roleId,
        name:mockUser.role.roleName
      }
    });

    expect(authUserService.findUser).toHaveBeenCalledWith("ogedi@gmail.com");
    expect(Password.comparePassword).toHaveBeenCalledWith(
      "uyiop",
      mockUser.password
    );
    expect(res.status).toHaveBeenCalledWith(StatusCodes.OK);
    expect(res.json).toHaveBeenCalledWith({
      data: {
        user: { ...mockUser, password: undefined },
        token: expect.any(String),// "fakeJwtToken"
      },
      message: "success",
    });
  });


  it("should log out the user and return success response", async () => {
    const req = {
      headers: {
        authorization: "Bearer fakeToken",
      },
    } as Request;

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    
    await logOutController(req, res);

    expect(blacklistJWTtoken).toHaveBeenCalledWith("fakeToken");
    
    expect(res.status).toHaveBeenCalledWith(StatusCodes.OK);
    expect(res.json).toHaveBeenCalledWith({
      data: {
        message: "Logged out successfully",
      },
      message: "success",
    });
  });

  it("should update password and return success response", async () => {
    const mockUser = await createMockUser();
    const req = {
      currentUser: {
        email: "ogedi@gmail.com",
      },
      body: {
        oldPassword: "password",
        newPassword: "newPassword",
      },
      headers: {
        authorization: "Bearer fakeToken",
      },
    } as unknown as Request;

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    (authUserService.findUser as jest.Mock).mockResolvedValueOnce(mockUser);
    (Password.comparePassword as jest.Mock).mockResolvedValueOnce(true);
     (generateJWT as jest.Mock).mockReturnValueOnce("fakeJwtToken");
    (authUserService.updatePassword as jest.Mock).mockResolvedValueOnce(mockUser);


    await userUpdatePasswordController(req, res);

    expect(blacklistJWTtoken).toHaveBeenCalledWith("fakeToken")

    expect(authUserService.findUser).toHaveBeenCalledWith("ogedi@gmail.com");
    expect(Password.comparePassword).toHaveBeenCalledWith(
      "password",
      mockUser.password
    );
    expect(authUserService.updatePassword).toHaveBeenCalledWith("ogedi@gmail.com", "newPassword");
    expect(blacklistJWTtoken).toHaveBeenCalledWith("fakeToken");
    expect(generateJWT).toHaveBeenCalledWith({
      id: "userIdw43",
      email: "ogedi@gmail.com",
      firstname: "favour",
      lastname: "uchi",
      isEmailVerified: true,
      role:{
        roleId:mockUser.roleId,
        name:mockUser.role.roleName
      }
    });

expect(res.status).toHaveBeenCalledWith(StatusCodes.CREATED);
    expect(res.json).toHaveBeenCalledWith({
    data: {
      message: "password updated",
      token: "fakeJwtToken"//expect.any(String),
    },
    message: "success",
  });
  })

  it("forgotPassword controller should send pasword reset email", async () => {
    const mockUser = await createMockUser();
    const req = {
      body: {
        email:"ogedi@gmail.com"
      }
    } as unknown as Request;

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;
    const next = jest.fn();
   
    (authUserService.findUser as jest.Mock).mockResolvedValueOnce(mockUser);
    await forgotPasswordController(req,res,next)
    expect(authUserService.findUser).toHaveBeenCalledWith("ogedi@gmail.com");
    expect(res.json).toHaveBeenCalledWith({
      data: {
        message: "password reset email sent",
      },
      message: "success",
    });
  })

  it("should reset the user's password", async () => {
    const resetToken = "resetToken123";
    const newPassword = "newPassword123";
    const comfirmPassword = "newPassword123";
    const mockUser = await createMockUser();

    const req = {
      params: { resetToken },
      body: { password: newPassword, comfirmPassword },
    } as unknown as Request
  
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response

(authUserService.findUserByResetPasswordToken as jest.Mock).mockResolvedValueOnce(mockUser)

//jest.spyOn when you want to test a function that calls other functions or methods.
//e.g await updatePassword(user.email, password);
//We spy on the updatePassword function from the authUserService module
const updatePasswordMock = jest.spyOn(authUserService, 'updatePassword');
  updatePasswordMock.mockResolvedValueOnce(mockUser);
  //We spy on the getUserResetPasswordTokenService function from the authUserService module
const getUserResetPasswordTokenServiceMock =jest.spyOn(authUserService, 'getUserResetPasswordTokenService').mockResolvedValueOnce('token'||null);

await resetPasswordController(req,res)

expect(authUserService.findUserByResetPasswordToken).toHaveBeenCalledWith(resetToken)
  expect(updatePasswordMock).toHaveBeenCalledWith(mockUser.email, newPassword);
  expect(getUserResetPasswordTokenServiceMock).toHaveBeenCalledWith(mockUser.email, true);
  expect(res.status).toHaveBeenCalledWith(StatusCodes.CREATED);
  expect(res.json).toHaveBeenCalledWith({
    data: {
      message: "password reset sucessfully",
    },
    message: "success",
  });
  })

});
