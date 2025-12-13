import { supabase } from '../db'
import { OtherWorkerProfile, WorkerInformation } from '../types/worker'

// Get worker by email
export async function getWorkerByEmail(email: string) {
  const { data, error } = await supabase
    .from("user_worker")
    .select("id, auth_uid, first_name, last_name, email_address, contact_number")
    .eq("email_address", email)
    .single()

  if (error) {
    console.warn("getWorkerByEmail error:", error.message)
    return null
  }
  return data
}

// Get worker by auth_uid
export async function getUserWorkerByAuthUid(auth_uid: string) {
  const { data, error } = await supabase
    .from("user_worker")
    .select("id, first_name, last_name, email_address, contact_number, date_of_birth, social_facebook, social_instagram")
    .eq("auth_uid", auth_uid)
    .single()

  if (error) {
    console.warn("getUserWorkerByAuthUid error:", error.message)
    return null
  }
  return data
}

// Get worker information by auth_uid
export async function getWorkerInformationByAuthUid(auth_uid: string) {
  const { data, error } = await supabase
    .from("worker_information")
    .select("id, auth_uid, barangay, street, additional_address, profile_picture_url")
    .eq("auth_uid", auth_uid)
    .single()

  if (error) {
    console.warn("getWorkerInformationByAuthUid error:", error.message)
    return null
  }
  return data
}

// Create worker profile
export async function createWorkerProfile(payload: WorkerInformation) {
  const { data, error } = await supabase
    .from("user_worker")
    .insert([payload])
    .select()
  if (error) throw error
  return data
}

// Update worker profile
export async function updateWorkerProfile(auth_uid: string, updates: Partial<WorkerInformation>) {
  const { data, error } = await supabase
    .from("user_worker")
    .update(updates)
    .eq("auth_uid", auth_uid)
    .select()
    .single()
  if (error) throw error
  return data
}

// Save worker profile (worker_information table)
export async function saveWorkerProfile(auth_uid: string, payload: OtherWorkerProfile) {
  const { data, error } = await supabase
    .from("worker_information")
    .update(payload)
    .eq("auth_uid", auth_uid)
    .select()

  if (error) throw error
  return data
}

// Remove worker profile fields
export async function removeWorkerProfile(auth_uid: string, fields: (keyof WorkerInformation)[]) {
  const updates: Partial<WorkerInformation> = {}
  fields.forEach((f) => {
    updates[f] = null
  })

  const { data, error } = await supabase
    .from("user_worker")
    .update(updates)
    .eq("auth_uid", auth_uid)
    .select()
    .single()

  if (error) throw error
  return data
}
