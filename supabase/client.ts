import { supabase } from './db'

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
    .from('client_information')
    .select('*')
    .eq('auth_uid', auth_uid)
    .single()
  if (error) {
    console.warn('getClientByAuthUid error:', error.message)
    return null
  }
  return data
}

export async function createClientProfile(payload: {
  auth_uid: string
  first_name: string
  last_name: string
  email_address: string
  sex?: string
  contact_number?: string
  address?: string
  barangay?: string
  street?: string
  additional_address?: string
  facebook?: string
  instagram?: string
  linkedin?: string
  profile_picture_url?: string
}) {
  const { error } = await supabase.from('client_information').insert([payload])
  if (error) throw new Error('Failed to create client profile: ' + error.message)
}

export async function updateClientProfile(auth_uid: string, updates: Record<string, any>) {
  const { error } = await supabase
    .from('client_information')
    .update(updates)
    .eq('auth_uid', auth_uid)
  if (error) throw new Error('Failed to update client profile: ' + error.message)
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

export async function submitServiceRequest(payload: {
  client_id: string
  auth_uid: string
  first_name: string
  last_name: string
  email_address: string
  barangay: string
  address: string
  street: string
  additional_address?: string
  contact_number: string
  category: string
  service_type: string
  service_task: string
  description: string
  preferred_date: string
  preferred_time: string
  is_urgent: boolean | string
  tools_provided?: string
  rate_type?: string
  rate_from?: number
  rate_to?: number
  rate_value?: number
}) {
  const { error } = await supabase.from('service_requests').insert([payload])
  if (error) throw new Error('Failed to submit service request: ' + error.message)
}