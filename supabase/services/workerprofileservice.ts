// supabase/services/workerprofileservice.ts
import { supabase } from '../db'

/**
 * Used during login: find worker row by email.
 */
export async function getWorkerByEmail(email: string) {
  const { data, error } = await supabase
    .from('user_worker') // change this if your worker table name is different
    .select('*')         // gets all columns, including age / DOB if present
    .eq('email_address', email) // change to .eq('email', email) if your column is named "email"
    .single()

  if (error) {
    console.warn('getWorkerByEmail error:', error.message)
    return null
  }

  return data
}

/**
 * Used by the worker settings screen to autofill the form:
 * get worker profile by auth_uid (Supabase user id).
 */
export async function getUserWorkerByAuthUid(auth_uid: string) {
  const { data, error } = await supabase
    .from('user_worker') // change this if needed
    .select('*')         // gets all columns, including age / DOB if present
    .eq('auth_uid', auth_uid)
    .single()

  if (error) {
    console.warn('getUserWorkerByAuthUid error:', error.message)
    return null
  }

  return data
}

/**
 * Used by the worker settings screen when saving changes.
 * Pass only the fields you want to update in `updates`.
 */
export async function updateWorkerProfile(
  auth_uid: string,
  updates: Record<string, any>
) {
  const { data, error } = await supabase
    .from('user_worker') // change this if needed
    .update(updates)
    .eq('auth_uid', auth_uid)
    .select()
    .single()

  if (error) {
    console.error('updateWorkerProfile error:', error.message)
    throw error
  }

  return data
}
