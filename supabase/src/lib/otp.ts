import bcrypt from "bcryptjs";
import crypto from "crypto";
import "dotenv/config";

type OtpRow = {
  email: string;
  otpHash: string;
  expiresAt: number;
  attempts: number;
  resendCount: number;
  consumed: boolean;
  createdAt: number;
};

type SignupDraft = {
  first_name: string;
  last_name: string;
  sex: string;
  password: string;
  createdAt: number;
};

const store = new Map<string, OtpRow>(); // key=email
const drafts = new Map<string, SignupDraft>(); // key=email

const OTP_EXPIRES_MINUTES = Number(process.env.OTP_EXPIRES_MINUTES || 10);
const OTP_MAX_ATTEMPTS = Number(process.env.OTP_MAX_ATTEMPTS || 6);
const OTP_MAX_RESENDS = Number(process.env.OTP_MAX_RESENDS || 5);

// Optional cleanup window for drafts (so password is not kept too long)
const DRAFT_EXPIRES_MINUTES = Number(process.env.DRAFT_EXPIRES_MINUTES || 30);

export function normalizeEmail(email: string) {
  return (email || "").trim().toLowerCase();
}

function generateOtp() {
  return String(crypto.randomInt(0, 1_000_000)).padStart(6, "0");
}

/** ---------------- Signup Draft helpers ---------------- **/

export function saveDraft(
  emailRaw: string,
  data: {
    first_name: string;
    last_name: string;
    sex: string;
    password: string;
  },
) {
  const email = normalizeEmail(emailRaw);
  drafts.set(email, {
    first_name: String(data.first_name || "").trim(),
    last_name: String(data.last_name || "").trim(),
    sex: String(data.sex || ""),
    password: String(data.password || ""),
    createdAt: Date.now(),
  });
}

export function getDraft(emailRaw: string) {
  const email = normalizeEmail(emailRaw);
  const d = drafts.get(email);
  if (!d) return null;

  // expire drafts automatically
  const expiresAt = d.createdAt + DRAFT_EXPIRES_MINUTES * 60_000;
  if (Date.now() > expiresAt) {
    drafts.delete(email);
    return null;
  }

  return d;
}

export function clearDraft(emailRaw: string) {
  const email = normalizeEmail(emailRaw);
  drafts.delete(email);
}

/** ---------------- OTP helpers ---------------- **/

export async function createOtp(emailRaw: string) {
  const email = normalizeEmail(emailRaw);
  const code = generateOtp();
  const otpHash = await bcrypt.hash(code, 10);

  const now = Date.now();
  store.set(email, {
    email,
    otpHash,
    expiresAt: now + OTP_EXPIRES_MINUTES * 60_000,
    attempts: 0,
    resendCount: 0,
    consumed: false,
    createdAt: now,
  });

  return code;
}

export async function resendOtp(emailRaw: string) {
  const email = normalizeEmail(emailRaw);
  const row = store.get(email);

  if (row && !row.consumed && row.expiresAt > Date.now()) {
    if (row.resendCount >= OTP_MAX_RESENDS) {
      return { ok: false as const, reason: "Resend limit reached. Try later." };
    }
    // consume existing and create a new one
    row.consumed = true;
    store.set(email, row);
  }

  const code = await createOtp(email);
  const newRow = store.get(email)!;
  newRow.resendCount = (row?.resendCount || 0) + 1;
  store.set(email, newRow);

  return { ok: true as const, code };
}

export async function verifyOtp(emailRaw: string, tokenRaw: string) {
  const email = normalizeEmail(emailRaw);
  const token = String(tokenRaw || "")
    .replace(/\D/g, "")
    .slice(0, 6);

  const row = store.get(email);
  if (!row || row.consumed || row.expiresAt <= Date.now()) {
    return { ok: false as const, reason: "No active OTP. Please resend." };
  }

  if (row.attempts >= OTP_MAX_ATTEMPTS) {
    return {
      ok: false as const,
      reason: "Too many attempts. Please resend OTP.",
    };
  }

  row.attempts += 1;
  store.set(email, row);

  const match = await bcrypt.compare(token, row.otpHash);
  if (!match) return { ok: false as const, reason: "Invalid code." };

  row.consumed = true;
  store.set(email, row);

  return { ok: true as const };
}
