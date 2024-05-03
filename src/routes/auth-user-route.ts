import { Router } from "express";
import { forgotPasswordController, getAllUsersQuerySearch, getUserByIdSController, loginUserController, logOutController, registerUserController, resendEmailVerificationLink, resetPasswordController, userUpdatePasswordController, verifyEmailController } from "../controller";
import { currentUserMiddleware, emailVerificationCheck, isAdmin, validateRequestMiddleware } from "../middleware";
import { emailVerificationSchema, forgotPasswordSchema, loginSchema, registerUserSchema, resendEmailVerificationSchema, resetPasswordSchema, userByIdSchema } from "../schema/auth-user-route";
const router =  Router()

router.route("/signup-user").post(registerUserSchema(),validateRequestMiddleware,registerUserController)
router
  .route("/verify-email/:userId/:token").post(emailVerificationSchema(),validateRequestMiddleware,verifyEmailController)
  
router
.route("/resend-email-verification").post(resendEmailVerificationSchema(),validateRequestMiddleware,resendEmailVerificationLink)

router
  .route("/login-user").post(loginSchema(),validateRequestMiddleware,loginUserController)

  

  router
  .route("/forgot-password")
  .post(forgotPasswordSchema(),validateRequestMiddleware,forgotPasswordController)

router
.route("/reset-password/:resetToken")
.post(resetPasswordSchema(),validateRequestMiddleware,resetPasswordController);

router.use(currentUserMiddleware,emailVerificationCheck)

router.route("/signout").get(logOutController)

router
    .route("/update-password")
    .put(userUpdatePasswordController)

router
    .route("/user/:userId")
    .get(userByIdSchema(),validateRequestMiddleware,getUserByIdSController)

    router
    .route("/users")
    .get(isAdmin,getAllUsersQuerySearch)


export { router as authUserRoute };