import AsyncStorage from "@react-native-async-storage/async-storage";
import { apiRequest } from "./client";

export async function login(payload: unknown) {
  const data = await apiRequest("/auth/login", {
    method: "POST",
    body: JSON.stringify(payload),
  });

  // Expect: { token: "...", user: {...} }
  if (data?.token) await AsyncStorage.setItem("token", data.token);

  return data; // return {token,user}
}

export async function getUser() {
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
  return apiRequest("/auth/update", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
