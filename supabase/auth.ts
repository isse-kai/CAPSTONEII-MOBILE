import { getClientByEmail, getWorkerByEmail } from './client'
import { supabase } from './db'

// Notifications
export async function getNotificationsForCurrentUser() {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user) throw new Error('User not authenticated')

  const { data, error } = await supabase
    .from('notifications')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (error) throw new Error('Failed to fetch user notifications')
  return data
}

// User Login
export async function loginUser(email_address: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: email_address,
    password,
  })
  if (error) throw new Error(error.message)

  const token = data.session?.access_token

  // Check profile tables
  let profile = await getClientByEmail(email_address)
  let role = 'client'

  if (!profile) {
    profile = await getWorkerByEmail(email_address)
    role = 'worker'
  }

  if (!profile) throw new Error('User not found in profile table')

  return { token, role, profile }
}

export async function signupClient({
  email_address,
  first_name,
  last_name,
  sex,
  is_email_opt_in,
}: {
  email_address: string
  first_name: string
  last_name: string
  sex: string
  is_email_opt_in: boolean
}) {
  const { data, error } = await supabase.auth.signInWithOtp({
    email: email_address,
    options: {
      shouldCreateUser: true,
      emailRedirectTo: 'app://auth/callback',
      data: {
        role: 'client',
        first_name,
        last_name,
        sex,
        is_email_opt_in,
      },
    },
  })
  if (error) throw new Error(error.message)
  return data
}

// Verify OTP
export async function verifyEmailOtp(email_address: string, otpCode: string) {
  const { data, error } = await supabase.auth.verifyOtp({
    email: "jdkhomecareservice@gmail.com",
    token: otpCode,
    type: 'email',
  })
  if (error) throw new Error(error.message)
  return data
}

// Resend OTP email
export async function resendSignupOtpEmail(email_address: string) {
  const { data, error } = await supabase.auth.signInWithOtp({
    email: "jdkhomecareservice@gmail.com",
    options: { shouldCreateUser: false },
  })
  if (error) throw new Error(error.message)
  return data
}

// Save client request
export async function saveClientRequest({
  first_name,
  last_name,
  email_address,
  phone,
  barangay,
  street,
  additional_address,
  profile_picture_url,
  profile_picture_name,
}: {
  first_name: string
  last_name: string
  email_address: string
  phone: string
  barangay: string
  street: string
  additional_address: string
  profile_picture_url: string | null
  profile_picture_name?: string | null
}) {
  const { data: { user }, error: userError } = await supabase.auth.getUser()
  if (userError || !user) throw new Error("User not authenticated")

  const { error } = await supabase.from("client_requests").insert([
    {
      user_id: user.id,
      first_name,
      last_name,
      email_address,
      phone,
      barangay,
      street,
      additional_address,
      profile_picture_url,
      profile_picture_name,
    },
  ])

  if (error) throw new Error("Failed to save client request: " + error.message)
  return true
}

// Request password reset email
export async function requestPasswordReset(email_address: string) {
  const { data, error } = await supabase.auth.resetPasswordForEmail(
    email_address,
    {
      redirectTo: 'app://auth/callback',
    }
  )
  if (error) throw new Error(error.message)
  return data
}

// Update password after reset
export async function updatePassword(newPassword: string) {
  const { data, error } = await supabase.auth.updateUser({
    password: newPassword,
  })
  if (error) throw new Error(error.message)
  return data.user
}

// Verification Email
export async function resendSignupEmail(email_address: string) {
  const { error } = await supabase.auth.resend({
    type: 'signup',
    email: email_address,
  })
  if (error) throw new Error(error.message)
  return true
}

// Get current user
export async function getCurrentUser() {
  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) throw new Error('User not authenticated')
  return data.user
}

// Logout
export async function logoutUser() {
  const { error } = await supabase.auth.signOut()
  if (error) throw new Error('Logout failed')
}

// Get session
export async function getSession() {
  const { data, error } = await supabase.auth.getSession()
  if (error) throw new Error('Failed to get session')
  return data.session
}

// Update metadata
export async function updateUserMetadata(updates: Record<string, any>) {
  const { data, error } = await supabase.auth.updateUser({ data: updates })
  if (error) throw new Error('Failed to update user metadata')
  return data.user
}

export { supabase }

