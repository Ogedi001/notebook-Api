import { body, param } from "express-validator";

export const userByIdSchema = () => {
  return [param("userId").notEmpty().withMessage("userId param is required")];
};

export const registerUserSchema = () => {
  return [
    body("firstname").notEmpty().withMessage("Please provide your first name"),
    body("lastname").notEmpty().withMessage("Please provide your last name"),
    body("email").isEmail().withMessage("Please provide a valid email"),
    body("password")
      .notEmpty()
      .trim()
      .isLength({ min: 6, max: 25 })
      .withMessage("Password must be between 6 to 25 characters"),
      body("comfirmPassword")
      .notEmpty()
      .trim()
      .isLength({ min: 6, max: 25 })
      .withMessage("confirmPassword must be between 6 to 25 characters"),
  ];
};

export const emailVerificationSchema = () => {
    return [
      body("userId").notEmpty().withMessage("Please provide an Id"),
      body("token").notEmpty().withMessage("Please provide a token"),
    ];
};

export const resendEmailVerificationSchema = () => {
    return [body("email").isEmail().withMessage("Please provide an email")];
};

export const loginSchema = () => {
    return [
      body("email").isEmail().withMessage("Please provide an email"),
      body("password").notEmpty().withMessage("Please provide a password"),
    ];
};

export const userUpdatePasswordSchema = () => {
    return [
      body("oldPassword")
        .notEmpty()
        .withMessage("Please provide oldPassword"),
      body("newPassword")
        .notEmpty()
        .withMessage("Please provide newPassword"),
    ];
};

export const forgotPasswordSchema = () => {
    return [body("email").isEmail().withMessage("Please provide an email")];
};

export const resetPasswordSchema = () => {
    return [
      body("password")
        .notEmpty()
        .withMessage("Invalid password")
        .trim()
        .isLength({ min: 5, max: 25 })
        .withMessage("Password must be between 5 to 25 characters"),
    ];
};
