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



export async function getClientPreview(client_id: string) {
  // Fetch from user_client
  const { data: userClient, error: userErr } = await supabase
    .from("user_client")
    .select("first_name, last_name, contact_number, email_address")
    .eq("client_id", client_id)
    .single()

  if (userErr) throw userErr

  // Fetch from client_information
  const { data: clientInfo, error: infoErr } = await supabase
    .from("client_information")
    .select("brgy, additional_address, street, profile_picture")
    .eq("client_id", client_id)
    .single()

  if (infoErr) throw infoErr

  // Fetch service request details
  const { data: serviceDetails, error: detailsErr } = await supabase
    .from("client_service_request_details")
    .select("service_type, service_task, preferred_date, preferred_time, urgent, tools_provided, description, request_image")
    .eq("client_id", client_id)
    .single()

  if (detailsErr) throw detailsErr

  // Fetch service rate
  const { data: serviceRate, error: rateErr } = await supabase
    .from("client_service_rate")
    .select("rate_from, rate_to, rate_value")
    .eq("client_id", client_id)
    .single()

  if (rateErr) throw rateErr

  return {
    ...userClient,
    ...clientInfo,
    ...serviceDetails,
    ...serviceRate,
  }
}