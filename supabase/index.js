import cors from "cors";
import "dotenv/config";
import express from "express";

import { sendOtpEmail } from "./mailer.js";
import {
  canResend,
  makeOtp,
  savePending,
  updateResent,
  verifyOtp,
} from "./otpstore.js";
import { supabaseAdmin } from "./supabaseadmin.js";

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => res.send("OK - backend reachable"));

const normalizeEmail = (e) =>
  String(e || "")
    .trim()
    .toLowerCase();

app.post("/auth/start", async (req, res) => {
  const email = normalizeEmail(req.body.email);
  const first_name = String(req.body.first_name || "").trim();
  const last_name = String(req.body.last_name || "").trim();
  const sex = String(req.body.sex || "").trim();
  const password = String(req.body.password || "");

  if (!email || !first_name || !last_name || !sex || !password) {
    return res.status(400).json({ error: "Missing required fields." });
  }

  try {
    const otp = makeOtp();

    // store pending signup ONLY in memory
    savePending(email, otp, { email, first_name, last_name, sex, password });

    // send OTP to the SAME email user typed
    await sendOtpEmail(email, otp);

    return res.json({ ok: true, message: "OTP sent." });
  } catch (err) {
    console.log("SEND OTP ERROR:", err);
    return res.status(500).json({
      error: "Failed to send OTP.",
      detail: err?.message || String(err),
    });
  }
});

app.post("/auth/resend", async (req, res) => {
  const email = normalizeEmail(req.body.email);
  if (!email) return res.status(400).json({ error: "Email is required." });

  try {
    if (!canResend(email)) {
      return res.status(429).json({ error: "Please wait before resending." });
    }

    const otp = makeOtp();
    updateResent(email, otp);
    await sendOtpEmail(email, otp);

    return res.json({ ok: true, message: "OTP resent." });
  } catch (err) {
    console.log("RESEND OTP ERROR:", err);
    return res.status(500).json({
      error: "Failed to resend OTP.",
      detail: err?.message || String(err),
    });
  }
});

app.post("/auth/verify", async (req, res) => {
  const email = normalizeEmail(req.body.email);
  const token = String(req.body.token || "").trim();

  if (!email || !token)
    return res.status(400).json({ error: "Email and token required." });

  const check = verifyOtp(email, token);
  if (!check.ok) return res.status(400).json({ error: check.error });

  const { first_name, last_name, sex, password } = check.payload;

  try {
    // ONLY NOW create the Supabase user
    const { data, error } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { first_name, last_name, sex, role: "client" },
    });

    if (error) return res.status(400).json({ error: error.message });

    return res.json({
      ok: true,
      message: "Verified. Account created.",
      user: data.user,
    });
  } catch (err) {
    console.log("CREATE USER ERROR:", err);
    return res
      .status(500)
      .json({
        error: "Failed to create user.",
        detail: err?.message || String(err),
      });
  }
});

const PORT = process.env.PORT || 8081;
app.listen(PORT, "0.0.0.0", () =>
  console.log(`Running on http://0.0.0.0:${PORT}`),
);
