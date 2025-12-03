import * as profileService from '../services/clientprofileservice'
import { ClientProfile } from '../types/client'

export async function getClientByEmailController(email: string) {
  return await profileService.getClientByEmail(email)
}

export async function getClientByAuthUidController(auth_uid: string) {
  return await profileService.getClientByAuthUid(auth_uid)
}

export async function createClientProfileController(payload: ClientProfile) {
  return await profileService.createClientProfile(payload)
}

export async function updateClientProfileController(auth_uid: string, updates: Partial<ClientProfile>) {
  return await profileService.updateClientProfile(auth_uid, updates)
}
