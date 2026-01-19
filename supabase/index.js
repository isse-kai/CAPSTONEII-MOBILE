import cors from "cors";
import "dotenv/config";
import express from "express";
import { supabaseAdmin } from "./supabaseadmin";

const app = express();
app.use(cors());
app.use(express.json());

// ✅ test route for Expo phone browser
app.get("/", (req, res) => res.send("OK - backend reachable"));

// ✅ Send OTP to email (creates user if new)
app.post("/auth/start", async (req, res) => {
  const { email, first_name, last_name, sex } = req.body;

  if (!email || !first_name || !last_name || !sex) {
    return res.status(400).json({ error: "Missing required fields." });
  }

  const { error } = await supabaseAdmin.auth.signInWithOtp({
    email,
    options: {
      shouldCreateUser: true,
      data: { first_name, last_name, sex },
    },
  });

  if (error) return res.status(400).json({ error: error.message });
  return res.json({ ok: true, message: "OTP sent to email." });
});

// ✅ Verify OTP and return session
app.post("/auth/verify", async (req, res) => {
  const { email, token } = req.body;

  if (!email || !token) {
    return res.status(400).json({ error: "Email and token are required." });
  }

  const { data, error } = await supabaseAdmin.auth.verifyOtp({
    email,
    token,
    type: "email",
  });

  if (error) return res.status(400).json({ error: error.message });

  return res.json({
    ok: true,
    session: data.session,
    user: data.user,
  });
});

// ✅ Resend OTP
app.post("/auth/resend", async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: "Email is required." });

  const { error } = await supabaseAdmin.auth.signInWithOtp({ email });
  if (error) return res.status(400).json({ error: error.message });

  return res.json({ ok: true, message: "OTP resent." });
});

// ✅ IMPORTANT: listen on 0.0.0.0 so Expo phone can reach it
const PORT = process.env.PORT || 8081;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Backend running on http://0.0.0.0:${PORT}`);
});
