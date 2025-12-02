import { supabase } from '../db'

export async function signupClient(payload: {
  email_address: string
  first_name: string
  last_name: string
  sex: string
  is_email_opt_in: boolean
}) {
  const { data, error } = await supabase.auth.signInWithOtp({
    email: payload.email_address,
    options: {
      shouldCreateUser: true,
      emailRedirectTo: 'app://auth/callback',
      data: { role: 'client', ...payload },
    },
  })
  if (error) throw new Error(error.message)
  return data
}

export async function signupWorker(payload: {
  email_address: string
  password: string
  first_name: string
  last_name: string
  sex: string
  is_email_opt_in: boolean
}) {
  const { data, error } = await supabase.auth.signUp({
    email: payload.email_address,
    password: payload.password,
    options: { data: { role: 'worker', ...payload } },
  })
  if (error) throw new Error(error.message)
  return data
}

export async function verifyEmailOtp(email: string, otpCode: string) {
  const { data, error } = await supabase.auth.verifyOtp({
    email: email,
    token: otpCode,
    type: 'email',
  })
  if (error) throw new Error(error.message)
  return data
}

export async function resendSignupOtpEmail(email: string) {
  const { data, error } = await supabase.auth.signInWithOtp({
    email,
    options: { shouldCreateUser: false },
  })
  if (error) throw new Error(error.message)
  return data
}

export async function resendSignupEmail(email: string) {
  const { error } = await supabase.auth.resend({ type: 'signup', email })
  if (error) throw new Error(error.message)
  return true
}
