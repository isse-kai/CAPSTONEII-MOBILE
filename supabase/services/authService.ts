import { supabase } from "../supabase";

// signup
export async function signUpWorker(
  email: string,
  password: string,
  extra: any,
) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: extra },
  });
  if (error) throw error;
  return data;
}

// ✅ verify OTP for signup MUST be type: 'signup'
export async function verifyEmailOtp(email: string, token: string) {
  const { data, error } = await supabase.auth.verifyOtp({
    email,
    token,
    type: "signup",
  });
  if (error) throw error;
  return data;
}

// resend signup OTP
export async function resendSignupOtp(email: string) {
  const { data, error } = await supabase.auth.resend({
    type: "signup",
    email,
  });
  if (error) throw error;
  return data;
}
