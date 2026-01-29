import { apiRequest } from './client';

export async function getClientProfileByUserId(userId: string) {
  return apiRequest(`/clients/profile?user_id=${encodeURIComponent(userId)}`, { method: 'GET' });
}

export async function updateClientProfile(id: number, payload: unknown) {
  return apiRequest(`/clients/profile/${id}`, { method: 'POST', body: JSON.stringify(payload) });
}

export async function updateClientProfileByUserId(userId: string, payload: unknown) {
  return apiRequest(`/clients/profile?user_id=${encodeURIComponent(userId)}`, { method: 'POST', body: JSON.stringify(payload) });
}

