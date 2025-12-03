import { Timestamp } from "react-native-reanimated/lib/typescript/commonTypes"

export type ClientInformation = {
  client_id?: string
  auth_uid: string
  email_address: string
  first_name: string
  last_name: string
  contact_number?: string | null
  street?: string | null
  barangay?: string | null
  additional_address?: string | null
  social_facebook?: string | null
  social_instagram?: string | null
  profile_picture_url?: string | null
  profile_picture_name?: string | null
  created_at?: Timestamp
  sex?: string | null
  updated_at?: string
  is_agreed_to_terms?: boolean
  agreed_at?: Timestamp
  address?: string
  date_of_birth?: string | null
  age?: string
}

export type ClientRequest = {
  request_group_id?: string
  client_id: string
  auth_uid: string
  email_address: string
  first_name: string
  last_name: string
  contact_number: string
  street: string
  barangay: string
  additional_address?: string | null
  profile_picture_url?: string | null
  profile_picture_name?: string | null
  created_at?: string
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
}

export type ClientCancelRequest = {
  reason_choice: string
  reason_other?: string | null
  request_group_id: string
  email_address: string
  client_id: string
  created_at?: string
  canceled_at?: string
  auth_uid: string
}

export type ClientServiceRate = {
  request_group_id?: string
  client_id: string
  auth_uid: string
  email_address: string
  rate_type: string
  rate_from?: number
  rate_to?: number
  rate_value: number
  created_at?: string
}