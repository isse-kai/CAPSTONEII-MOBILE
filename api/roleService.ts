import { apiRequest } from './client';

// Returns { role: 'worker' | 'client' | null }
export async function getRoleByAuthUid(authUid: string) {
  // Expect your Laravel API to expose something like: GET /role?auth_uid=...
  return apiRequest(`/role?auth_uid=${encodeURIComponent(authUid)}`, { method: 'GET' });
}
