import * as profileService from '../services/clientprofileservice'
import { ClientInformation } from '../types/client'

export async function getClientByEmailController(email: string) {
  return await profileService.getClientByEmail(email)
}

export async function getClientByAuthUidController(auth_uid: string) {
  return await profileService.getClientByAuthUid(auth_uid)
}

export async function createClientProfileController(payload: ClientInformation) {
  return await profileService.createClientProfile(payload)
}

export async function updateClientProfileController(auth_uid: string, updates: Partial<ClientInformation>) {
  return await profileService.updateClientProfile(auth_uid, updates)
}
