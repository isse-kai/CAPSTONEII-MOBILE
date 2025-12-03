import { supabase } from '../db'
import { ClientRequest } from '../types/client'

export async function saveClientRequest(payload: ClientRequest) {
  const { data, error } = await supabase
    .from('client_requests')
    .insert([payload])
    .select()
  if (error) throw error
  return data
}

export async function submitServiceRequest(payload: ClientRequest) {
  const { data, error } = await supabase
    .from('service_requests')
    .insert([payload])
    .select()
  if (error) throw error
  return data
}

export async function ClientCancelRequest(payload: ClientRequest) {
  const { data, error } = await supabase
    .from('client_cancel_request')
    .insert([payload])
    .select()
  if (error) throw error
  return data
}

export async function ClientServiceRate(payload: ClientRequest) {
  const { data, error } = await supabase
    .from('client_service_rate')
    .insert([payload])
    .select()
  if (error) throw error
  return data
}