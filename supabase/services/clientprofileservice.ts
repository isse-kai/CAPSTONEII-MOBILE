import { supabase } from '../db'
import { ClientInformation } from '../types/client'

export async function getClientByEmail(email: string) {
  const { data, error } = await supabase
    .from('user_client')
    .select('*')
    .eq('email_address', email)
    .single()
  if (error) return null
  return data
}

export async function getClientByAuthUid(auth_uid: string) {
  const { data, error } = await supabase
    .from('user_client')
    .select('id, first_name, last_name, email_address, contact_number, date_of_birth, social_facebook, social_instagram')
    .eq('auth_uid', auth_uid)
    .single()
  if (error) {
    console.warn('getClientByAuthUid error:', error.message)
    return null
  }
  return data
}

export async function createClientProfile(payload: ClientInformation) {
  const { data, error } = await supabase
    .from('user_client')
    .insert([payload])
    .select()
  if (error) throw error
  return data
}

export async function updateClientProfile(auth_uid: string, updates: Partial<ClientInformation>) {
  const { data, error } = await supabase
    .from('user_client')
    .update(updates)
    .eq('auth_uid', auth_uid)
    .select()
  if (error) throw error
  return data
}
