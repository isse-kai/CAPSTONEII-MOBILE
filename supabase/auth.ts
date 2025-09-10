import { supabase } from './client'
import { getClientByEmail, getWorkerByEmail } from './db'

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
