import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import { Pressable, Text } from "dripsy";
import { useFonts } from "expo-font";
import { useRouter } from "expo-router";
import { MotiImage, MotiView } from "moti";
import React, { useCallback, useEffect, useState } from "react";
import { Dimensions, ImageBackground, ScrollView, View } from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

import {
  clearSession,
  getAccessToken,
  getRefreshToken,
  getStoredUser,
  saveSession,
} from "../../../supabase/src/lib/authstorage";

import Header from "../clientnavbar/header";
import ClientNavbar from "../clientnavbar/navbar";

const { width, height } = Dimensions.get("window");

type MeResponse = {
  ok: boolean;
  user: {
    id?: string;
    email?: string;
    user_metadata?: {
      first_name?: string;
      last_name?: string;
      sex?: string;
      role?: string;
    };
  };
};

type RefreshResponse = {
  ok: boolean;
  access_token?: string;
  refresh_token?: string;
  user?: any;
  detail?: string;
};

export default function ClientProfile() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const API_URL = process.env.EXPO_PUBLIC_API_URL;

  const [fullName, setFullName] = useState("Full Name");
  const [email, setEmail] = useState("user@email.com");
  const [loadingMe, setLoadingMe] = useState(true);

  const [fontsLoaded] = useFonts({
    "Poppins-Regular": require("../../../assets/fonts/Poppins/Poppins-Regular.ttf"),
    "Poppins-Bold": require("../../../assets/fonts/Poppins/Poppins-Bold.ttf"),
    "Poppins-ExtraBold": require("../../../assets/fonts/Poppins/Poppins-ExtraBold.ttf"),
  });

  // ✅ helper: set UI from user object (either storage or backend)
  const applyUser = useCallback((user: any) => {
    const meta = user?.user_metadata || {};
    const name = `${meta.first_name || ""} ${meta.last_name || ""}`.trim();

    setFullName(name || "Full Name");
    setEmail(user?.email || "user@email.com");
  }, []);

  // ✅ helper: call /auth/me with a token
  const fetchMe = useCallback(
    async (token: string) => {
      if (!API_URL) return false;

      const { data } = await axios.get<MeResponse>(`${API_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (data?.ok && data?.user) {
        applyUser(data.user);

        // ✅ keep local storage updated so even offline it shows correct info
        await saveSession({
          access_token: token,
          refresh_token: (await getRefreshToken()) || undefined,
          user: data.user,
        });

        return true;
      }

      return false;
    },
    [API_URL, applyUser],
  );

  // ✅ helper: refresh token when access token expired
  const tryRefresh = useCallback(async () => {
    if (!API_URL) return null;

    const refresh_token = await getRefreshToken();
    if (!refresh_token) return null;

    const { data } = await axios.post<RefreshResponse>(
      `${API_URL}/auth/refresh`,
      { refresh_token },
    );

    if (!data?.ok || !data?.access_token) return null;

    await saveSession({
      access_token: data.access_token,
      refresh_token: data.refresh_token || refresh_token,
      user: data.user || (await getStoredUser()) || undefined,
    });

    return data.access_token;
  }, [API_URL]);

  useEffect(() => {
    let alive = true;

    const load = async () => {
      try {
        if (!alive) return;
        setLoadingMe(true);

        // 1) Show immediately from local storage (works right after signup/login)
        const storedUser = await getStoredUser();
        if (alive && storedUser) applyUser(storedUser);

        // 2) If no backend URL, just keep local display
        if (!API_URL) {
          if (alive) setLoadingMe(false);
          return;
        }

        // 3) Try /me using access token
        const token = await getAccessToken();
        if (token) {
          try {
            const ok = await fetchMe(token);
            if (ok) {
              if (alive) setLoadingMe(false);
              return;
            }
          } catch {
            // continue to refresh
          }
        }

        // 4) If token invalid/expired, try refresh
        const newToken = await tryRefresh();
        if (newToken) {
          try {
            await fetchMe(newToken);
            if (alive) setLoadingMe(false);
            return;
          } catch {
            // fallthrough to logout
          }
        }

        // 5) If all fails, logout
        await clearSession();
        if (alive) router.replace("../../login/login");
      } catch {
        await clearSession();
        if (alive) router.replace("../../login/login");
      } finally {
        if (alive) setLoadingMe(false);
      }
    };

    load();

    return () => {
      alive = false;
    };
  }, [API_URL, router, applyUser, fetchMe, tryRefresh]);

  const handleLogout = useCallback(async () => {
    try {
      if (API_URL) {
        // optional endpoint
        await axios.post(`${API_URL}/auth/logout`);
      }
    } catch {}
    await clearSession();
    router.replace("../../login/login");
  }, [API_URL, router]);

  if (!fontsLoaded) return null;

  return (
    <ImageBackground
      source={require("../../../assets/login.jpg")}
      style={{ flex: 1, height }}
      resizeMode="cover"
    >
      <SafeAreaView
        style={{
          flex: 1,
          paddingBottom: insets.bottom,
          backgroundColor: "rgba(249, 250, 251, 0.9)",
        }}
      >
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            paddingHorizontal: 18,
            paddingBottom: 100,
          }}
          showsVerticalScrollIndicator={false}
        >
          <MotiView
            from={{ opacity: 0, translateY: 20 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: "timing", duration: 500 }}
            style={{ flex: 1 }}
          >
            <Header />

            {/* User Account */}
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginBottom: height * 0.03,
              }}
            >
              <MotiImage
                from={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", delay: 200 }}
                source={require("../../../assets/profile-icon.png")}
                style={{
                  width: width * 0.15,
                  height: width * 0.15,
                  borderRadius: (width * 0.15) / 2,
                  marginRight: width * 0.04,
                }}
              />

              <View style={{ flexDirection: "column", flex: 1 }}>
                <Text
                  sx={{
                    fontSize: width * 0.055,
                    fontFamily: "Poppins-ExtraBold",
                    color: "#000",
                    mb: 4,
                  }}
                >
                  {loadingMe ? "Loading..." : fullName}
                </Text>

                <Text
                  sx={{
                    fontSize: width * 0.04,
                    fontFamily: "Poppins-Regular",
                    color: "#555",
                  }}
                >
                  {loadingMe ? "..." : email}
                </Text>
              </View>
            </View>

            {/* Buttons */}
            <Pressable
              onPress={() => router.push("./profiles/settings")}
              sx={{
                flexDirection: "row",
                alignItems: "center",
                bg: "#ffffffcc",
                borderRadius: 10,
                px: width * 0.04,
                py: height * 0.02,
                mb: 12,
              }}
            >
              <Ionicons
                name="settings-outline"
                size={22}
                color="#333"
                style={{ marginRight: 12 }}
              />
              <Text
                sx={{
                  fontSize: width * 0.04,
                  fontFamily: "Poppins-Bold",
                  color: "#000",
                  lineHeight: 22,
                }}
              >
                Account Settings
              </Text>
            </Pressable>

            <Pressable
              onPress={handleLogout}
              sx={{
                flexDirection: "row",
                alignItems: "center",
                bg: "#ffffffcc",
                borderRadius: 10,
                px: width * 0.04,
                py: height * 0.02,
              }}
            >
              <Ionicons
                name="log-out-outline"
                size={22}
                color="#333"
                style={{ marginRight: 12 }}
              />
              <Text
                sx={{
                  fontSize: width * 0.04,
                  fontFamily: "Poppins-Bold",
                  color: "#000",
                  lineHeight: 22,
                }}
              >
                Logout
              </Text>
            </Pressable>
          </MotiView>
        </ScrollView>

        <ClientNavbar />
      </SafeAreaView>
    </ImageBackground>
  );
}
