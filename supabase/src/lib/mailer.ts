import "dotenv/config";
import nodemailer from "nodemailer";

function envBool(v: string | undefined) {
  return String(v || "").toLowerCase() === "true";
}

export async function sendOtpEmail(toEmail: string, code: string) {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT || 587);
  const secure = envBool(process.env.SMTP_SECURE); // true for 465, false for 587
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const from = process.env.SMTP_FROM || user;

  if (!host) throw new Error("SMTP_HOST missing in supabase/.env");
  if (!user) throw new Error("SMTP_USER missing in supabase/.env");
  if (!pass) throw new Error("SMTP_PASS missing in supabase/.env");
  if (!from) throw new Error("SMTP_FROM missing in supabase/.env");

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure,
    auth: { user, pass }, // ✅ required
  });

  // optional but gives clearer errors
  await transporter.verify();

  await transporter.sendMail({
    from,
    to: toEmail,
    subject: "Your OTP Code",
    text: `Your OTP code is: ${code}\n\nThis code will expire soon.`,
    html: `
      <div style="font-family: Arial, sans-serif;">
        <h2>Your OTP Code</h2>
        <p>Use this code to verify your account:</p>
        <div style="font-size: 28px; font-weight: bold; letter-spacing: 4px;">${code}</div>
        <p style="margin-top: 16px;">This code will expire soon.</p>
      </div>
    `,
  });
}
