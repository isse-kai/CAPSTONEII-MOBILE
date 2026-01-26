// import AsyncStorage from "@react-native-async-storage/async-storage";

// const ACCESS = "sb_access_token";
// const REFRESH = "sb_refresh_token";
// const USER = "sb_user";

// export type StoredUser = {
//   id?: string;
//   email?: string;
//   user_metadata?: {
//     first_name?: string;
//     last_name?: string;
//     sex?: string;
//     role?: string;
//     [k: string]: any;
//   };
//   [k: string]: any;
// };

// export type SaveSessionInput = {
//   access_token?: string | null;
//   refresh_token?: string | null;
//   user?: StoredUser | null;
// };

// /**
//  * ✅ Save tokens + user (use this after /auth/login or /auth/refresh or /auth/me)
//  */
// export async function saveSession(input: SaveSessionInput) {
//   const ops: [string, string][] = [];

//   if (input.access_token) ops.push([ACCESS, String(input.access_token)]);
//   if (input.refresh_token) ops.push([REFRESH, String(input.refresh_token)]);

//   if (typeof input.user !== "undefined") {
//     if (input.user) ops.push([USER, JSON.stringify(input.user)]);
//     else await AsyncStorage.removeItem(USER);
//   }

//   if (ops.length) await AsyncStorage.multiSet(ops);
// }

// /**
//  * ✅ Backward-compatible helper if you still call saveSession(access, refresh)
//  */
// export async function saveSessionLegacy(access?: string, refresh?: string) {
//   const ops: [string, string][] = [];
//   if (access) ops.push([ACCESS, access]);
//   if (refresh) ops.push([REFRESH, refresh]);
//   if (ops.length) await AsyncStorage.multiSet(ops);
// }

// export async function getAccessToken() {
//   return AsyncStorage.getItem(ACCESS);
// }

// export async function getRefreshToken() {
//   return AsyncStorage.getItem(REFRESH);
// }

// export async function getStoredUser(): Promise<StoredUser | null> {
//   const raw = await AsyncStorage.getItem(USER);
//   if (!raw) return null;
//   try {
//     return JSON.parse(raw) as StoredUser;
//   } catch {
//     return null;
//   }
// }

// export async function clearSession() {
//   await AsyncStorage.multiRemove([ACCESS, REFRESH, USER]);
// }
