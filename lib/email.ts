// filepath: c:\Users\HP\admin\lib\email.ts
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER, // SMTP username
    pass: process.env.SMTP_PASS, // SMTP password
  },
});

export async function sendEmail(to: string, subject: string, text: string, html?: string) {
  await transporter.sendMail({
    from: `"Stores" <${process.env.SMTP_USER}>`, // sender address
    to, // list of receivers
    subject, // Subject line
    text, // plain text body
    html, // html body (optional)
  });
}