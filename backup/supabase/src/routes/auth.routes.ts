// import { Router } from "express";
// import { sendOtpEmail } from "../lib/mailer";
// import {
//   clearDraft,
//   createOtp,
//   getDraft,
//   normalizeEmail,
//   resendOtp,
//   saveDraft,
//   verifyOtp,
// } from "../lib/otp";
// import { supabaseAdmin } from "../lib/supabaseadmin";
// import { supabasePublic } from "../lib/supabasepublic";

// export const authRouter = Router();

// /**
//  * Helper: stringify unknown error objects safely
//  */
// function errToMessage(err: any) {
//   if (!err) return "Unknown error.";
//   if (typeof err === "string") return err;
//   if (err?.message) return String(err.message);
//   try {
//     return JSON.stringify(err);
//   } catch {
//     return String(err);
//   }
// }

// /**
//  * Helper: check if email exists (supabase-js has no getUserByEmail)
//  * NOTE: listUsers is paginated. This scans up to maxPages.
//  */
// async function findUserIdByEmail(email: string): Promise<string | null> {
//   const perPage = 200;
//   const maxPages = 50;
//   const target = (email || "").toLowerCase();

//   for (let page = 1; page <= maxPages; page++) {
//     const { data, error } = await supabaseAdmin.auth.admin.listUsers({
//       page,
//       perPage,
//     });
//     if (error) throw new Error(error.message);

//     const users = data?.users || [];
//     const hit = users.find((u) => (u.email || "").toLowerCase() === target);
//     if (hit?.id) return hit.id;

//     if (users.length < perPage) break;
//   }
//   return null;
// }

// /**
//  * POST /auth/start
//  * body: { email, first_name, last_name, sex, password }
//  * - saves draft (so verify can be {email, token} only)
//  * - creates otp and sends email
//  */
// authRouter.post("/start", async (req, res) => {
//   try {
//     const { email, first_name, last_name, sex, password } = req.body || {};
//     const emailNorm = normalizeEmail(email);

//     if (!emailNorm || !first_name || !last_name || !sex || !password) {
//       return res.status(400).json({ detail: "Missing required fields." });
//     }

//     // Check existing
//     const existingId = await findUserIdByEmail(emailNorm);
//     if (existingId) {
//       return res.status(409).json({ detail: "Email already registered." });
//     }

//     // Save draft
//     saveDraft(emailNorm, {
//       first_name: String(first_name).trim(),
//       last_name: String(last_name).trim(),
//       sex: String(sex),
//       password: String(password),
//     });

//     // Create OTP + send email
//     const code = await createOtp(emailNorm);
//     await sendOtpEmail(emailNorm, code);

//     return res.json({ ok: true });
//   } catch (err: any) {
//     console.error("AUTH/START ERROR:", err);
//     return res.status(500).json({
//       detail: errToMessage(err),
//     });
//   }
// });

// /**
//  * POST /auth/resend
//  * body: { email }
//  */
// authRouter.post("/resend", async (req, res) => {
//   try {
//     const { email } = req.body || {};
//     const emailNorm = normalizeEmail(email);

//     if (!emailNorm) return res.status(400).json({ detail: "Email required." });

//     const out = await resendOtp(emailNorm);
//     if (!out.ok) return res.status(429).json({ detail: out.reason });

//     await sendOtpEmail(emailNorm, out.code);

//     return res.json({ ok: true });
//   } catch (err: any) {
//     console.error("AUTH/RESEND ERROR:", err);
//     return res.status(500).json({
//       detail: errToMessage(err),
//     });
//   }
// });

// /**
//  * POST /auth/verify
//  * body: { email, token }
//  * - verifies otp
//  * - creates user via admin.createUser using saved draft
//  */
// authRouter.post("/verify", async (req, res) => {
//   try {
//     const { email, token } = req.body || {};
//     const emailNorm = normalizeEmail(email);
//     const cleanToken = String(token || "")
//       .replace(/\D/g, "")
//       .slice(0, 6);

//     if (!emailNorm || cleanToken.length !== 6) {
//       return res.status(400).json({ detail: "Invalid email or code." });
//     }

//     const checked = await verifyOtp(emailNorm, cleanToken);
//     if (!checked.ok) return res.status(400).json({ detail: checked.reason });

//     // If user already exists, return ok
//     const existingId = await findUserIdByEmail(emailNorm);
//     if (existingId) return res.json({ ok: true, user_id: existingId });

//     // Must have draft
//     const draft = getDraft(emailNorm);
//     if (!draft) {
//       return res
//         .status(400)
//         .json({ detail: "Signup session expired. Please Sign Up again." });
//     }

//     const { data, error } = await supabaseAdmin.auth.admin.createUser({
//       email: emailNorm,
//       password: draft.password,
//       email_confirm: true,
//       user_metadata: {
//         first_name: draft.first_name,
//         last_name: draft.last_name,
//         sex: draft.sex,
//         role: "client",
//       },
//     });

//     if (error) return res.status(400).json({ detail: error.message });

//     clearDraft(emailNorm);

//     return res.json({ ok: true, user_id: data.user?.id });
//   } catch (err: any) {
//     console.error("AUTH/VERIFY ERROR:", err);
//     return res.status(500).json({
//       detail: errToMessage(err),
//     });
//   }
// });

// /**
//  * POST /auth/login
//  * body: { email, password }
//  * - uses public client signInWithPassword
//  * - returns tokens to app
//  */
// authRouter.post("/login", async (req, res) => {
//   try {
//     const { email, password } = req.body || {};
//     const emailNorm = normalizeEmail(email);
//     const pw = String(password || "");

//     if (!emailNorm || !pw) {
//       return res.status(400).json({ detail: "Email and password required." });
//     }

//     const { data, error } = await supabasePublic.auth.signInWithPassword({
//       email: emailNorm,
//       password: pw,
//     });

//     if (error) return res.status(401).json({ detail: error.message });

//     return res.json({
//       ok: true,
//       access_token: data.session?.access_token,
//       refresh_token: data.session?.refresh_token,
//       user: data.user,
//     });
//   } catch (err: any) {
//     console.error("AUTH/LOGIN ERROR:", err);
//     return res.status(500).json({
//       detail: errToMessage(err),
//     });
//   }
// });

// /**
//  * GET /auth/me
//  * header: Authorization: Bearer <access_token>
//  * - returns current user + metadata
//  */
// authRouter.get("/me", async (req, res) => {
//   try {
//     const auth = String(req.headers.authorization || "");
//     const token = auth.startsWith("Bearer ") ? auth.slice(7) : "";

//     if (!token) return res.status(401).json({ detail: "Missing token." });

//     const { data, error } = await supabasePublic.auth.getUser(token);
//     if (error) return res.status(401).json({ detail: error.message });

//     const u = data.user;

//     return res.json({
//       ok: true,
//       user: {
//         id: u?.id,
//         email: u?.email,
//         user_metadata: u?.user_metadata || {},
//       },
//     });
//   } catch (err: any) {
//     console.error("AUTH/ME ERROR:", err);
//     return res.status(500).json({ detail: errToMessage(err) });
//   }
// });

// /**
//  * POST /auth/logout
//  * - optional endpoint (client still clears tokens)
//  */
// authRouter.post("/logout", async (_req, res) => {
//   return res.json({ ok: true });
// });
