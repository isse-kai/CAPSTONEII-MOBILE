// api/worksService.ts
import AsyncStorage from "@react-native-async-storage/async-storage";

const BASE_URL = process.env.EXPO_PUBLIC_API_URL;
if (!BASE_URL) throw new Error("Missing EXPO_PUBLIC_API_URL in your .env");

type ApiErrorShape =
  | { message?: string; error?: string; errors?: Record<string, string[]> }
  | string
  | null;

async function parseJsonSafe(res: Response) {
  const text = await res.text();
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

async function authHeaders(extra?: Record<string, string>) {
  const token = await AsyncStorage.getItem("token");
  return {
    Accept: "application/json",
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(extra ?? {}),
  };
}

function toErrorMessage(payload: ApiErrorShape): string {
  if (!payload) return "Request failed.";
  if (typeof payload === "string") return payload;

  if (payload.message) return payload.message;
  if (payload.error) return payload.error;

  if (payload.errors && typeof payload.errors === "object") {
    const firstKey = Object.keys(payload.errors)[0];
    const firstMsg = firstKey ? payload.errors[firstKey]?.[0] : null;
    if (firstMsg) return firstMsg;
  }

  return "Request failed.";
}

/** =========================
 *  Types (match your schema)
 *  ========================= */
export type WorkerHomeUser = {
  id: number;
  first_name?: string;
  last_name?: string;
  email?: string;
  role?: string;
  status?: string;

  barangay?: string;
  street?: string;
  phone_number?: string;
  birthdate?: string;
  image?: string;

  worker_service?: string; // JSON string or null
  worker_service_description?: string;
  worker_service_years?: number;
  worker_service_equipments?: string;
};

export type WorkerHomeResponse = { user: WorkerHomeUser | null };

export type WorkRequest = {
  id: number;
  user_id?: number;

  service?: string;
  title?: string;

  service_task?: string;
  service_description?: string;
  service_equipments?: string;
  service_image?: string;

  urgency?: string;
  preferred_date?: string;   // date string
  preferred_time?: string;   // time string
  workers_needed?: number;

  price?: number | null;
  units?: number | null;
  total_price?: number | null;

  price_display?: string;        // computed by API
  total_price_display?: string;  // computed by API

  payment_method?: string | null;
  submit_image?: string | null;
  status?: string;
  created_at?: string;

  posted_first_name?: string;
  posted_last_name?: string;
  posted_name?: string;
  posted_email?: string;

  posted_phone_number?: string;
  posted_barangay?: string;
  posted_street?: string;
  posted_image?: string;
};

export async function getWorkerHome(): Promise<WorkerHomeResponse> {
  const res = await fetch(`${BASE_URL}/api/worker/home`, {
    method: "GET",
    headers: await authHeaders(),
  });

  const payload = await parseJsonSafe(res);
  if (!res.ok) throw new Error(toErrorMessage(payload));

  return (payload ?? { user: null }) as WorkerHomeResponse;
}

export async function getWorkRequests(params?: { status?: string; q?: string }) {
  const qs = new URLSearchParams();
  if (params?.status) qs.set("status", params.status);
  if (params?.q) qs.set("q", params.q);

  const url = qs.toString()
    ? `${BASE_URL}/api/work-requests?${qs.toString()}`
    : `${BASE_URL}/api/work-requests`;

  const res = await fetch(url, {
    method: "GET",
    headers: await authHeaders(),
  });

  const payload = await parseJsonSafe(res);
  if (!res.ok) throw new Error(toErrorMessage(payload));

  // controller returns { jobs: [] }
  return (payload ?? { jobs: [] }) as { jobs: WorkRequest[] };
}

export async function getWorkRequestById(workRequestId: number | string) {
  const res = await fetch(`${BASE_URL}/api/work-requests/${workRequestId}`, {
    method: "GET",
    headers: await authHeaders(),
  });

  const payload = await parseJsonSafe(res);
  if (!res.ok) throw new Error(toErrorMessage(payload));

  // controller returns { job: {...} }
  return (payload ?? { job: null }) as { job: WorkRequest | null };
}
