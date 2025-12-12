import { supabase } from '../db'
import { ClientRequest, ClientServiceRates, ClientTermsAgreements } from '../types/client'

export async function saveClientRequest(payload: ClientRequest) {
  const { data, error } = await supabase
    .from('client_service_request_details')
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

export async function ClientServiceRate(payload: ClientServiceRates ) {
  const { data, error } = await supabase
    .from('client_service_rate')
    .insert([payload])
    .select()
  if (error) throw error
  return data
}

export async function ClientServiceRateGetByClientId(clientId: string) {
  const { data, error } = await supabase
    .from("client_service_rate")
    .select("*")
    .eq("client_id", clientId)
    .single()

  if (error) throw error
  return data
}

export async function ClientTermsAgreement(payload: ClientTermsAgreements) {
  const { data, error } = await supabase
    .from('client_agreements')
    .insert([payload])
    .select()
  if (error) throw error
  return data
}