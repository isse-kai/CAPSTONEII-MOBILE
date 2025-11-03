// lib/auth.ts
import { supabase } from "./supabase";

/** ========== Types ========== */
export type Sex = "Male" | "Female" | null;
export type Role = "worker" | "client" | null;

export interface SignUpWorkerParams {
  email: string;
  password: string;
  first: string;
  last: string;
  sex: Sex;
}

export interface SignUpClientParams {
  email: string;
  password: string;
  first: string;
  last: string;
  sex: Sex;
}

/** ========== Helpers ========== */
function normError(e: any): Error {
  if (!e) return new Error("Unknown error");
  if (typeof e === "string") return new Error(e);
  if (e?.message) return new Error(e.message);
  try {
    return new Error(JSON.stringify(e));
  } catch {
    return new Error(String(e));
  }
}

/** Detect role by checking which table contains the user row (version-safe, no maybeSingle) */
export async function detectRoleByUid(uid: string): Promise<Role> {
  const wRes = await supabase
    .from("user_worker")
    .select("auth_uid")
    .eq("auth_uid", uid)
    .limit(1);

  if (!wRes.error && (wRes.data ?? []).length > 0) return "worker";

  const cRes = await supabase
    .from("user_client")
    .select("auth_uid")
    .eq("auth_uid", uid)
    .limit(1);

  if (!cRes.error && (cRes.data ?? []).length > 0) return "client";

  return null;
}

/** Session / user helpers */
export async function getSession() {
  const { data, error } = await supabase.auth.getSession();
  if (error) throw normError(error);
  return data.session ?? null;
}

export async function getCurrentUser() {
  const { data, error } = await supabase.auth.getUser();
  if (error) throw normError(error);
  return data.user ?? null;
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw normError(error);
}

/** ========== Email/Password flows ========== */

/** Worker signup: creates auth user, then upserts into public.user_worker */
export async function signUpWorker(params: SignUpWorkerParams) {
  console.log("[auth] signUpWorker()");
  const { email, password, first, last, sex } = params;

  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error) throw normError(error);

  const uid = data.user?.id;
  if (!uid) throw new Error("Missing user id after sign up.");

  const { error: upErr } = await supabase.from("user_worker").upsert({
    auth_uid: uid,
    first_name: first || null,
    last_name: last || null,
    sex: sex || null,
    email_address: email || null,
  });
  if (upErr) throw normError(upErr);

  return uid;
}

/** Client signup: creates auth user, then upserts into public.user_client */
export async function signUpClient(params: SignUpClientParams) {
  console.log("[auth] signUpClient()");
  const { email, password, first, last, sex } = params;

  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error) throw normError(error);

  const uid = data.user?.id;
  if (!uid) throw new Error("Missing user id after sign up.");

  const { error: upErr } = await supabase.from("user_client").upsert({
    auth_uid: uid,
    first_name: first || null,
    last_name: last || null,
    sex: sex || null,
    email_address: email || null,
  });
  if (upErr) throw normError(upErr);

  return uid;
}

/** Login and report role (worker/client) */
export async function signInWithEmail(email: string, password: string): Promise<{
  user: Awaited<ReturnType<typeof getCurrentUser>>;
  role: Role;
}> {
  console.log("[auth] signInWithEmail()");
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw normError(error);

  const user = data.user ?? null;
  let role: Role = null;
  if (user?.id) role = await detectRoleByUid(user.id);

  return { user, role };
}
