// supabase/services/loginservice.ts
import { supabase } from "../db";
import { getClientByEmail } from "./clientprofileservice";
import { getWorkerByEmail } from "./workerprofileservice";

export type UserRole = "client" | "worker";

export async function loginUser(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw new Error(error.message);

  const session = data.session;

  // IMPORTANT: never proceed if refresh_token is missing
  // This prevents “broken sessions” from being persisted and later causing refresh-token crashes.
  if (!session?.access_token || !session?.refresh_token) {
    await supabase.auth.signOut();
    throw new Error("Login failed: session is incomplete. Please try again.");
  }

  const token = session.access_token;

  let role: UserRole = "client";
  let profile = await getClientByEmail(email);

  if (!profile) {
    profile = await getWorkerByEmail(email);
    role = "worker";
  }

  if (!profile) {
    // optional: sign out to avoid keeping a session for a user with no profile row
    await supabase.auth.signOut();
    throw new Error("User not found in profile table.");
  }

  return { token, role, profile };
}

export async function requestPasswordReset(email: string) {
  const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: "app://auth/callback",
  });
  if (error) throw new Error(error.message);
  return data;
}

export async function updatePassword(newPassword: string) {
  const { data, error } = await supabase.auth.updateUser({ password: newPassword });
  if (error) throw new Error(error.message);
  return data.user;
}

// Prefer getSession() over getUser() in RN to avoid network calls that can trigger refresh flows
export async function getCurrentUser() {
  const { data, error } = await supabase.auth.getSession();
  if (error) throw new Error(error.message);
  if (!data.session?.user) throw new Error("User not authenticated");
  return data.session.user;
}

export async function logoutUser() {
  const { error } = await supabase.auth.signOut();
  if (error) throw new Error(error.message);
}

export async function getSession() {
  const { data, error } = await supabase.auth.getSession();
  if (error) throw new Error(error.message);
  return data.session;
}

export async function updateUserMetadata(updates: Record<string, any>) {
  const { data, error } = await supabase.auth.updateUser({ data: updates });
  if (error) throw new Error(error.message);
  return data.user;
}
