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
export async function loginUser(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) throw new Error(error.message)

  const token = data.session?.access_token

  // Check profile tables
  let profile = await getClientByEmail(email)
  let role = 'client'

  if (!profile) {
    profile = await getWorkerByEmail(email)
    role = 'worker'
  }

  if (!profile) throw new Error('User not found in profile table')

  return { token, role, profile }
}

// Client Signup
export async function signupClient({
  email,
  password,
  first_name,
  last_name,
  sex,
  is_email_opt_in,
}: {
  email: string
  password: string
  first_name: string
  last_name: string
  sex: string
  is_email_opt_in: boolean
}) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
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

  const otp = Math.floor(100000 + Math.random() * 900000).toString()
  console.log(`OTP for ${email}: ${otp}`)

  return { data, otp }
}

// Worker Signup
export async function signupWorker({
  email,
  password,
  first_name,
  last_name,
  sex,
  is_email_opt_in,
}: {
  email: string
  password: string
  first_name: string
  last_name: string
  sex: string
  is_email_opt_in: boolean
}) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        role: 'worker',
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

