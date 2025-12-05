import { supabase } from '../db'
import { ClientInformation, OtherClientProfile } from '../types/client'

export async function getClientByEmail(email: string) {
  const { data, error } = await supabase
    .from("user_client")
    .select("id, auth_uid, first_name, last_name, email_address, contact_number")
    .eq("email_address", email)
    .single()

  if (error) {
    console.warn("getClientByEmail error:", error.message)
    return null
  }
  return data
}

export async function getUserClientByAuthUid(auth_uid: string) {
  const { data, error } = await supabase
    .from('user_client')
    .select('id, first_name, last_name, email_address, contact_number, date_of_birth, social_facebook, social_instagram')
    .eq('auth_uid', auth_uid)
    .single()

  if (error) {
    console.warn('getUserClientByAuthUid error:', error.message)
    return null
  }
  return data
}

export async function getClientInformationByAuthUid(auth_uid: string) {
  const { data, error } = await supabase
    .from('client_information')
    .select('id, auth_uid, barangay, street, additional_address, profile_picture_url')
    .eq('auth_uid', auth_uid)
    .single()

  if (error) {
    console.warn('getClientInformationByAuthUid error:', error.message)
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
    .single()
  if (error) throw error
  return data
}

export async function saveClientProfile(auth_uid: string, payload: OtherClientProfile) {
  const { data, error } = await supabase
    .from("client_information")
    .update(payload)
    .eq("auth_uid", auth_uid)
    .select()

  if (error) throw error
  return data
}


export async function removeClientProfile(auth_uid: string, fields: (keyof ClientInformation)[]) {
  const updates: Partial<ClientInformation> = {}
  fields.forEach((f) => {
    updates[f] = null
  })

  const { data, error } = await supabase
    .from("user_client")
    .update(updates)
    .eq("auth_uid", auth_uid)
    .select()
    .single()

  if (error) throw error
  return data
}
