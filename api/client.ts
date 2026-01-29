import AsyncStorage from "@react-native-async-storage/async-storage";

const BASE_URL = process.env.EXPO_PUBLIC_API_URL; // http://192.168.1.50:8000

if (!BASE_URL) {
  throw new Error("Missing EXPO_PUBLIC_API_URL in env");
}

export async function apiRequest(path: string, options: RequestInit = {}) {
  const token = await AsyncStorage.getItem("token");

  const res = await fetch(`${BASE_URL}/api${path}`, {
    ...options,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  });

  const text = await res.text();
  let data: any = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = text;
  }

  if (!res.ok) {
    const msg =
      data?.message ||
      data?.error ||
      (typeof data === "string" ? data : "Request failed");
    throw new Error(msg);
  }

  return data;
}
