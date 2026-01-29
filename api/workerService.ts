import { apiRequest } from './client';

export async function getWorkerProfileByUserId(userId: string) {
  return apiRequest(`/workers/profile?user_id=${encodeURIComponent(userId)}`, { method: 'GET' });
}

export async function createOrUpdateWorkerProfile(payload: unknown) {
  return apiRequest('/workers/profile', { method: 'POST', body: JSON.stringify(payload) });
}

export async function updateWorkerProfile(id: number, payload: unknown) {
  return apiRequest(`/workers/profile/${id}`, { method: 'POST', body: JSON.stringify(payload) });
}
