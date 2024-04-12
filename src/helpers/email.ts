import 'dotenv/config'
import { mailTransport } from "../utils";
import crypto from "crypto";
import fs from "fs";
import path from "path";
import ejs from "ejs";
import { createUserTokenService, getUserResetPasswordTokenService } from "../service/auth-user-service";

export const sendEmailVerificationLinkEmail = async (data: {
  userId: string;
  email: string;
  username: string;
}) => {
  const templatePath = path.join(__dirname, "../../emails/sign-up.ejs");
  const template = fs.readFileSync(templatePath, "utf-8");
  const token = crypto.randomBytes(16).toString("hex");
  await createUserTokenService(data.userId, token);
  const verificationURL = `${process.env.FRONTEND_BASE_URL}/login/${data.userId}/${token}`;
  const ejsData = {
    username: data.username,
    verificationURL,
  };
  const htmlContent = ejs.render(template, ejsData);
console.log(htmlContent)
  const mailOptions = {
    from: process.env.SMTP_SENDER,
    to: data.email,
    subject: "Welome on board ✔",
    html: htmlContent,
  };
  try {
    await mailTransport.sendMail(mailOptions);
  } catch (error) {}
};




export const sendResetPasswordEmail = async (data: {
    email: string;
  }) => {
    const templatePath = path.join(__dirname, "../../emails/password-reset.ejs");
    const template = fs.readFileSync(templatePath, "utf-8");
    const resetToken = await getUserResetPasswordTokenService(data.email, false);
    const resetURL = `${process.env.FRONTEND_BASE_URL}/passwordreset/${resetToken}`;
    const ejsData = {
        resetURL
      };
   
    const htmlContent = ejs.render(template, ejsData);

  
    const mailOptions = {
      from: process.env.SMTP_SENDER,
      to: data.email,
      subject: "Password Reset Notification",
      html: htmlContent,
    };
  
    try {
        await mailTransport.sendMail(mailOptions);
    } catch (error) {
      await getUserResetPasswordTokenService(data.email, true);
    }
  };
  