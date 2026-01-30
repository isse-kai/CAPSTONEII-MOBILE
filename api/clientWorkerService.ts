// api/clientWorkersService.ts
import { apiRequest } from "./client";

export type VerifiedWorkerRow = {
  user_id: number;
  first_name: string | null;
  last_name: string | null;
  email: string | null;
  status: string | null;

  phone_number: string | null;
  birthdate: string | null;
  profile_image: string | null;
  barangay: string | null;
  street: string | null;

  service: any; // could be string or array depending on your DB
  service_description: string | null;
  service_years: number | null;
};

export async function listVerifiedWorkers(params?: { q?: string }) {
  const q = params?.q?.trim();
  const qs = q ? `?q=${encodeURIComponent(q)}` : "";
  return apiRequest(`/clients/workers${qs}`, { method: "GET" });
}

export async function getVerifiedWorkerById(id: number | string) {
  return apiRequest(`/clients/workers/${encodeURIComponent(String(id))}`, {
    method: "GET",
  });
}
