// supabase/controllers/workerprofilecontroller.ts
import * as workerProfileService from '../services/workerprofileservice'

/**
 * Controller: get worker profile by email.
 * This is a thin wrapper around the service for use in screens/hooks.
 */
export async function handleGetWorkerByEmail(email: string) {
  return await workerProfileService.getWorkerByEmail(email)
}

/**
 * If later you add more worker profile service functions
 * (create, update, remove, etc.), you can expose them here, e.g.:
 *
 * export async function handleCreateWorkerProfile(payload: WorkerInformation) {
 *   return await workerProfileService.createWorkerProfile(payload)
 * }
 *
 * export async function handleUpdateWorkerProfile(auth_uid: string, updates: Partial<WorkerInformation>) {
 *   return await workerProfileService.updateWorkerProfile(auth_uid, updates)
 * }
 */
