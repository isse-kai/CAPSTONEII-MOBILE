import crypto from "crypto";

const store = new Map();
const sha = (s) => crypto.createHash("sha256").update(s).digest("hex");

export const makeOtp = () =>
  String(Math.floor(100000 + Math.random() * 900000));

export function savePending(email, otp, payload) {
  store.set(email.toLowerCase(), {
    otpHash: sha(otp),
    expiresAt: Date.now() + 5 * 60 * 1000,
    triesLeft: 5,
    lastSentAt: Date.now(),
    payload,
  });
}

export function canResend(email) {
  const e = store.get(email.toLowerCase());
  if (!e) return true;
  return Date.now() - e.lastSentAt > 30 * 1000;
}

export function updateResent(email, otp) {
  const e = store.get(email.toLowerCase());
  if (!e) return;
  e.otpHash = sha(otp);
  e.expiresAt = Date.now() + 5 * 60 * 1000;
  e.lastSentAt = Date.now();
  e.triesLeft = 5;
  store.set(email.toLowerCase(), e);
}

export function verifyOtp(email, otp) {
  const e = store.get(email.toLowerCase());
  if (!e)
    return { ok: false, error: "No pending signup. Please sign up again." };

  if (Date.now() > e.expiresAt) {
    store.delete(email.toLowerCase());
    return { ok: false, error: "OTP expired. Please sign up again." };
  }

  if (e.triesLeft <= 0) {
    store.delete(email.toLowerCase());
    return { ok: false, error: "Too many attempts. Please sign up again." };
  }

  if (sha(otp) !== e.otpHash) {
    e.triesLeft -= 1;
    store.set(email.toLowerCase(), e);
    return { ok: false, error: "Invalid OTP code." };
  }

  store.delete(email.toLowerCase());
  return { ok: true, payload: e.payload };
}
