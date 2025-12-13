import { Timestamp } from "react-native-reanimated/lib/typescript/commonTypes"

export type WorkerInformation = {
  worker_id?: string | null
  auth_uid: string | null
  email_address: string | null
  first_name: string | null
  last_name: string | null
  contact_number?: string | null
  street?: string | null
  barangay?: string | null
  additional_address?: string | null
  social_facebook?: string | null
  social_instagram?: string | null
  profile_picture_url?: string | null
  profile_picture_name?: string | null
  created_at?: Timestamp | null
  sex?: string | null
  updated_at?: string | null
  is_agreed_to_terms?: boolean | null
  agreed_at?: Timestamp | null
  address?: string | null
  date_of_birth?: string | null
  age?: string | null
}

export type OtherWorkerProfile = {
  auth_uid: string
  barangay: string
  street: string
  additional_address: string
  profile_picture_url?: string | null
}

export type WorkerRequest = {
  request_group_id?: string
  worker_id: string
  auth_uid: string
  email_address: string
  created_at?: string
  category?: string
  service_type: string
  service_task: string
  service_description: string
  preferred_date: string
  preferred_time: string
  is_urgent: boolean | string
  tools_provided?: string
  request_image_url?: string | null
  urgent?: string | null
}

export type WorkerCancelRequest = {
  reason_choice: string
  reason_other?: string | null
  request_group_id: string
  email_address: string
  worker_id: string
  created_at?: string
  canceled_at?: string
  auth_uid: string
}

export type WorkerServiceRates = {
  request_group_id?: string
  worker_id: string
  auth_uid: string
  email_address: string
  rate_type: "hour" | "job"
  rate_from?: number
  rate_to?: number
  rate_value: number
  created_at?: string
}

export type WorkerTermsAgreements = {
  request_group_id?: string
  worker_id: string
  auth_uid: string
  email_address: string
  consent_background_checks: boolean
  consent_data_privacy: boolean
  consent_terms_privacy: boolean
  created_at?: string
}
