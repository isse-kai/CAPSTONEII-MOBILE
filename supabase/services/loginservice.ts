import { supabase } from '../db'
import { getClientByEmail } from './clientprofileservice'
import { getWorkerByEmail } from './workerprofileservice'

export async function loginUser(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) throw new Error(error.message)

  const token = data.session?.access_token
  let profile = await getClientByEmail(email)
  let role: 'client' | 'worker' = 'client'

  if (!profile) {
    profile = await getWorkerByEmail(email)
    role = 'worker'
  }

  if (!profile) throw new Error('User not found in profile table')
  return { token, role, profile }
}

export async function requestPasswordReset(email: string) {
  const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: 'app://auth/callback',
  })
  if (error) throw new Error(error.message)
  return data
}

export async function updatePassword(newPassword: string) {
  const { data, error } = await supabase.auth.updateUser({ password: newPassword })
  if (error) throw new Error(error.message)
  return data.user
}

export async function getCurrentUser() {
  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) throw new Error('User not authenticated')
  return data.user
}

export async function logoutUser() {
  const { error } = await supabase.auth.signOut()
  if (error) throw new Error('Logout failed')
}

export async function getSession() {
  const { data, error } = await supabase.auth.getSession()
  if (error) throw new Error('Failed to get session')
  return data.session
}

export async function updateUserMetadata(updates: Record<string, any>) {
  const { data, error } = await supabase.auth.updateUser({ data: updates })
  if (error) throw new Error('Failed to update user metadata')
  return data.user
}
