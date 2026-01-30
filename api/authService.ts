// api/authService.ts
import AsyncStorage from "@react-native-async-storage/async-storage";
import { apiRequest } from "./client";

export async function login(payload: unknown) {
  const data = await apiRequest("/auth/login", {
    method: "POST",
    body: JSON.stringify(payload),
  });

  // Expect: { token: "...", user: {...} }
  // Persist token from common response fields so different backends work
  const tokenValue =
    data?.token ||
    data?.access_token ||
    data?.accessToken ||
    data?.session?.access_token ||
    data?.data?.token ||
    null;

  if (tokenValue) {
    try {
      await AsyncStorage.setItem("token", String(tokenValue));
      console.log("[authService] stored token");
    } catch (e) {
      console.warn("[authService] failed to store token", e);
    }
  }

  return data; // return {token,user}
}

export async function getUser() {
  // ✅ must exist in Laravel: GET /api/auth/user (auth:sanctum)
  return apiRequest("/auth/user", { method: "GET" });
}

export async function logout() {
  // call API to revoke token (optional but recommended)
  try {
    await apiRequest("/auth/logout", { method: "POST" });
  } finally {
    await AsyncStorage.removeItem("token");
  }
}

export async function updateUser(payload: unknown) {
  // ✅ must exist in Laravel: PUT /api/auth/user (auth:sanctum)
  return apiRequest("/auth/user", {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}
