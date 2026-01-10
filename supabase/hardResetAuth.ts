// supabase/hardResetAuth.ts
import AsyncStorage from "@react-native-async-storage/async-storage";

export async function hardResetSupabaseAuth() {
  const keys = await AsyncStorage.getAllKeys();

  // Supabase commonly uses keys like: sb-<projectref>-auth-token
  const supabaseKeys = keys.filter(
    (k) => k.startsWith("sb-") && k.includes("-auth-token")
  );

  if (supabaseKeys.length > 0) {
    await AsyncStorage.multiRemove(supabaseKeys);
  }
}
