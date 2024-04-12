import { Router } from "express";
import { forgotPasswordController, loginUserController, logOutController, registerUserController, resendEmailVerificationLink, resetPasswordController, userUpdatePasswordController, verifyEmailController } from "../controller/auth-user-controller";
import { currentUserMiddleware, emailVerificationCheck } from "../middleware";
const router =  Router()

router.route("/signup-user").post(registerUserController)
router
  .route("/verify-email/:userId/:token").post(verifyEmailController)
  
router
.route("/resend-email-verification").post(resendEmailVerificationLink)

router
  .route("/login-user").post(loginUserController)

  

  router
  .route("/forgot-password")
  .post(forgotPasswordController)

router
.route("/reset-password/:resetToken")
.post(resetPasswordController);

router.use(currentUserMiddleware,emailVerificationCheck)

router.route("/signout").get(logOutController)

router
    .route("/update-password")
    .put(userUpdatePasswordController)
export { router as authUserRoute };