import { supabase } from './client'
import { getClientByEmail, getWorkerByEmail } from './db'

// User Login
export async function loginUser(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) throw new Error(error.message)

  const token = data.session?.access_token
  const userId = data.user?.id

  // Check profile tables
  let profile = await getClientByEmail(email)
  let role = 'client'

  if (!profile) {
    profile = await getWorkerByEmail(email)
    role = 'worker'
  }

  if (!profile) throw new Error('User not found in profile table')

  return {
    token,
    role,
    profile,
  }
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

  return data
}
