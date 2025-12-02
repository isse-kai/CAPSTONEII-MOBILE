import * as clientService from '../services/clientservice'

export async function getClientByEmailController(email: string) {
  return await clientService.getClientByEmail(email)
}

export async function getClientByAuthUidController(auth_uid: string) {
  return await clientService.getClientByAuthUid(auth_uid)
}

export async function createClientProfileController(payload: {
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
  return await clientService.createClientProfile(payload)
}

export async function updateClientProfileController(auth_uid: string, updates: Record<string, any>) {
  return await clientService.updateClientProfile(auth_uid, updates)
}

export async function submitServiceRequestController(payload: {
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
  return await clientService.submitServiceRequest(payload)
}
