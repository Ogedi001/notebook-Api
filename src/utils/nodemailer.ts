import nodemailer from 'nodemailer'
import 'dotenv/config'

const config={
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: true,
    auth: {
      user: process.env.SMTP_USERNAME,
      pass: process.env.SMTP_PASSWORD,
    },
}
export const mailTransport = nodemailer.createTransport(config)