// supabase/services/workerinformationservice.ts
import AsyncStorage from "@react-native-async-storage/async-storage"
import { supabase } from "../db"

/* Small helpers for storage keys */
const keyWorkInfo = (uid: string) => `worker:${uid}:work_info`
const keyDocs = (uid: string) => `worker:${uid}:required_docs`
const keyRate = (uid: string) => `worker:${uid}:rate`
const keyAgreements = (uid: string) => `worker:${uid}:agreements`

/* ──────────────────────────────────────────────
 * STEP 1: Personal Information
 * Table: worker_information  (REAL Supabase)
 * ──────────────────────────────────────────────*/

export interface WorkerInformationPayload {
  first_name: string
  last_name: string
  birthdate: string | null // UI only, not stored as column
  age: number | null
  contact_number: string
  email_address: string
  barangay: string | null
  street: string | null
  profile_picture_url: string | null
}

/**
 * FIX: do NOT use .single() / .maybeSingle()
 * We explicitly order and limit(1) to avoid PGRST116 even
 * if there are multiple rows for the same auth_uid.
 */
export async function getWorkerInformationByAuthUid(authUid: string) {
  const { data, error } = await supabase
    .from("worker_information")
    .select("*")
    .eq("auth_uid", authUid)
    // if you don't have created_at, change this order to "id"
    .order("created_at", { ascending: false })
    .limit(1)

  if (error) {
    console.error("getWorkerInformationByAuthUid error:", error)
    throw error
  }

  return data && data.length > 0 ? data[0] : null
}

export async function saveWorkerInformation(
  authUid: string,
  payload: WorkerInformationPayload,
) {
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

  // FIX: no maybeSingle here either – same pattern: order + limit(1)
  const { data: existingRows, error: fetchError } = await supabase
    .from("worker_information")
    .select("id")
    .eq("auth_uid", authUid)
    .order("created_at", { ascending: false })
    .limit(1)

  if (fetchError) {
    console.error("saveWorkerInformation fetch existing error:", fetchError)
    throw fetchError
  }

  const existing = existingRows && existingRows.length > 0 ? existingRows[0] : null

  if (existing?.id) {
    const { data, error } = await supabase
      .from("worker_information")
      .update(baseData)
      .eq("id", existing.id)
      .select()
      .limit(1)

    if (error) {
      console.error("saveWorkerInformation update error:", error)
      throw error
    }

    return data && data.length > 0 ? data[0] : null
  } else {
    const { data, error } = await supabase
      .from("worker_information")
      .insert(baseData)
      .select()
      .limit(1)

    if (error) {
      console.error("saveWorkerInformation insert error:", error)
      throw error
    }

    return data && data.length > 0 ? data[0] : null
  }
}

/* ──────────────────────────────────────────────
 * STEP 2: Work Information (AsyncStorage only)
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
  try {
    const raw = await AsyncStorage.getItem(keyWorkInfo(authUid))
    if (!raw) return null
    return JSON.parse(raw) as WorkerWorkInformationPayload
  } catch (error) {
    console.error(
      "getWorkerWorkInformationByAuthUid (AsyncStorage) error:",
      error,
    )
    return null
  }
}

export async function saveWorkerWorkInformation(
  authUid: string,
  payload: WorkerWorkInformationPayload,
) {
  try {
    await AsyncStorage.setItem(keyWorkInfo(authUid), JSON.stringify(payload))
  } catch (error) {
    console.error("saveWorkerWorkInformation (AsyncStorage) error:", error)
  }

  return {
    auth_uid: authUid,
    ...payload,
  }
}

/* ──────────────────────────────────────────────
 * STEP 3: Required Documents (AsyncStorage only)
 * ──────────────────────────────────────────────*/

export interface WorkerRequiredDocumentsPayload {
  primary_id_front_url: string | null
  primary_id_back_url: string | null
  secondary_id_url: string | null
  nbi_clearance_url: string | null
  proof_of_address_url: string | null
  medical_certificate_url: string | null
  certificates_url: string | null
}

export async function getWorkerRequiredDocumentsByAuthUid(authUid: string) {
  try {
    const raw = await AsyncStorage.getItem(keyDocs(authUid))
    if (!raw) return null
    return JSON.parse(raw) as WorkerRequiredDocumentsPayload
  } catch (error) {
    console.error(
      "getWorkerRequiredDocumentsByAuthUid (AsyncStorage) error:",
      error,
    )
    return null
  }
}

export async function saveWorkerRequiredDocuments(
  authUid: string,
  payload: WorkerRequiredDocumentsPayload,
) {
  try {
    await AsyncStorage.setItem(keyDocs(authUid), JSON.stringify(payload))
  } catch (error) {
    console.error("saveWorkerRequiredDocuments (AsyncStorage) error:", error)
  }

  return {
    auth_uid: authUid,
    ...payload,
  }
}

/* ──────────────────────────────────────────────
 * STEP 4: Service Rate (AsyncStorage only)
 * ──────────────────────────────────────────────*/

export type WorkerRateType = "hourly" | "job"

export interface WorkerRatePayload {
  rate_type: WorkerRateType
  hourly_min_rate: number | null
  hourly_max_rate: number | null
  job_rate: number | null
}

export async function getWorkerRateByAuthUid(authUid: string) {
  try {
    const raw = await AsyncStorage.getItem(keyRate(authUid))
    if (!raw) return null
    return JSON.parse(raw) as WorkerRatePayload
  } catch (error) {
    console.error("getWorkerRateByAuthUid (AsyncStorage) error:", error)
    return null
  }
}

export async function saveWorkerRate(
  authUid: string,
  payload: WorkerRatePayload,
) {
  try {
    await AsyncStorage.setItem(keyRate(authUid), JSON.stringify(payload))
  } catch (error) {
    console.error("saveWorkerRate (AsyncStorage) error:", error)
  }

  return {
    auth_uid: authUid,
    ...payload,
  }
}

/* ──────────────────────────────────────────────
 * STEP 5: Terms & Agreements (AsyncStorage only)
 * ──────────────────────────────────────────────*/

export interface WorkerAgreementsPayload {
  consent_background_check: boolean
  agree_terms_privacy: boolean
  consent_data_privacy: boolean
}

export async function getWorkerAgreementsByAuthUid(authUid: string) {
  try {
    const raw = await AsyncStorage.getItem(keyAgreements(authUid))
    if (!raw) return null
    return JSON.parse(raw) as WorkerAgreementsPayload
  } catch (error) {
    console.error(
      "getWorkerAgreementsByAuthUid (AsyncStorage) error:",
      error,
    )
    return null
  }
}

export async function saveWorkerAgreements(
  authUid: string,
  payload: WorkerAgreementsPayload,
) {
  try {
    await AsyncStorage.setItem(keyAgreements(authUid), JSON.stringify(payload))
  } catch (error) {
    console.error("saveWorkerAgreements (AsyncStorage) error:", error)
  }

  return {
    auth_uid: authUid,
    ...payload,
  }
}
