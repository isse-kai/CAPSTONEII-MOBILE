import "dotenv/config";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

export async function sendOtpEmail(to, otp) {
  await transporter.verify(); // throws if Gmail auth is wrong

  await transporter.sendMail({
    from: `JDK HOMECARE <${process.env.GMAIL_USER}>`,
    to,
    subject: "Your JDK HOMECARE Verification Code",
    text: `Your verification code is: ${otp}\n\nThis code expires in 5 minutes.`,
  });
}
