// supabase/services/workerinformationservice.ts
import { supabase } from "../db"

/* ──────────────────────────────────────────────
 * STEP 1: Personal Information
 * Table: worker_information
 * ──────────────────────────────────────────────*/

export interface WorkerInformationPayload {
  first_name: string
  last_name: string
  // used in the UI, but NOT sent as "birthdate" column to the DB
  birthdate: string | null
  age: number | null
  contact_number: string
  email_address: string
  barangay: string | null
  street: string | null
  profile_picture_url: string | null
}

export async function getWorkerInformationByAuthUid(authUid: string) {
  const { data, error } = await supabase
    .from("worker_information")
    .select("*")
    .eq("auth_uid", authUid)
    .maybeSingle()

  if (error) {
    console.error("getWorkerInformationByAuthUid error:", error)
    throw error
  }

  return data
}

export async function saveWorkerInformation(
  authUid: string,
  payload: WorkerInformationPayload,
) {
  // Build the data object that matches your actual table columns.
  // NOTE: birthdate is NOT sent because the table does not have that column.
  const baseData: any = {
    auth_uid: authUid,
    first_name: payload.first_name,
    last_name: payload.last_name,
    age: payload.age,
    contact_number: payload.contact_number,
    email_address: payload.email_address,
    barangay: payload.barangay,
    street: payload.street,
    profile_picture_url: payload.profile_picture_url,
  }

  // 1) Check if there is already a row for this auth_uid
  const { data: existing, error: fetchError } = await supabase
    .from("worker_information")
    .select("id")
    .eq("auth_uid", authUid)
    .maybeSingle()

  if (fetchError) {
    console.error("saveWorkerInformation fetch existing error:", fetchError)
    throw fetchError
  }

  // 2) If exists -> UPDATE; otherwise -> INSERT
  if (existing?.id) {
    const { data, error } = await supabase
      .from("worker_information")
      .update(baseData)
      .eq("id", existing.id)
      .select()
      .maybeSingle()

    if (error) {
      console.error("saveWorkerInformation update error:", error)
      throw error
    }

    return data
  } else {
    const { data, error } = await supabase
      .from("worker_information")
      .insert(baseData)
      .select()
      .maybeSingle()

    if (error) {
      console.error("saveWorkerInformation insert error:", error)
      throw error
    }

    return data
  }
}

/* ──────────────────────────────────────────────
 * STEP 2: Work Information
 * Table: worker_work_information  (adjust name if needed)
 * ──────────────────────────────────────────────*/

export interface WorkerWorkInformationPayload {
  service_carpenter: boolean
  service_electrician: boolean
  service_plumber: boolean
  service_carwasher: boolean
  service_laundry: boolean
  description: string
  years_experience: number | null
  has_own_tools: boolean | null
}

export async function getWorkerWorkInformationByAuthUid(authUid: string) {
  const { data, error } = await supabase
    .from("worker_work_information")
    .select("*")
    .eq("auth_uid", authUid)
    .maybeSingle()

  if (error) {
    console.error("getWorkerWorkInformationByAuthUid error:", error)
    throw error
  }

  return data
}

export async function saveWorkerWorkInformation(
  authUid: string,
  payload: WorkerWorkInformationPayload,
) {
  const baseData: any = {
    auth_uid: authUid,
    service_carpenter: payload.service_carpenter,
    service_electrician: payload.service_electrician,
    service_plumber: payload.service_plumber,
    service_carwasher: payload.service_carwasher,
    service_laundry: payload.service_laundry,
    description: payload.description,
    years_experience: payload.years_experience,
    has_own_tools: payload.has_own_tools,
  }

  const { data: existing, error: fetchError } = await supabase
    .from("worker_work_information")
    .select("id")
    .eq("auth_uid", authUid)
    .maybeSingle()

  if (fetchError) {
    console.error("saveWorkerWorkInformation fetch existing error:", fetchError)
    throw fetchError
  }

  if (existing?.id) {
    const { data, error } = await supabase
      .from("worker_work_information")
      .update(baseData)
      .eq("id", existing.id)
      .select()
      .maybeSingle()

    if (error) {
      console.error("saveWorkerWorkInformation update error:", error)
      throw error
    }

    return data
  } else {
    const { data, error } = await supabase
      .from("worker_work_information")
      .insert(baseData)
      .select()
      .maybeSingle()

    if (error) {
      console.error("saveWorkerWorkInformation insert error:", error)
      throw error
    }

    return data
  }
}
