import { supabase } from './client'

export async function getClientByEmail(email: string) {
  const { data, error } = await supabase
    .from('user_client')
    .select('*')
    .eq('email_address', email)
    .single()
  if (error) return null
  return data
}

export async function getWorkerByEmail(email: string) {
  const { data, error } = await supabase
    .from('user_worker')
    .select('*')
    .eq('email_address', email)
    .single()
  if (error) return null
  return data
}
