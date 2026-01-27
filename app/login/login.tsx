import { useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { supabase } from "../../supabase/supabase";

const BLUE = "#1E88E5";
const clamp = (v: number, min: number, max: number) =>
  Math.max(min, Math.min(max, v));

export default function LoginScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { width, height } = useWindowDimensions();

  const s = width / 375;

  const H_PAD = clamp(18 * s, 14, 24);
  const INPUT_H = clamp(52 * s, 48, 58);
  const BTN_H = clamp(46 * s, 44, 56);

  const LOGO_W = clamp(180 * s, 160, 260); // ⬆️ wider
  const LOGO_H = clamp(40 * s, 34, 60); // ⬆️ taller

  const CARD_RADIUS = clamp(18 * s, 14, 22);
  const CARD_PAD = clamp(18 * s, 14, 22);

  const TITLE_SIZE = clamp(20 * s, 18, 26);

  const isShort = height < 700;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const canLogin = useMemo(() => {
    return email.trim().length > 0 && password.trim().length > 0;
  }, [email, password]);

  const handleLogin = async () => {
    if (!canLogin || isLoading) return;

    try {
      setIsLoading(true);
      const cleanEmail = email.trim().toLowerCase();

      const { data, error } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password,
      });

      if (error) {
        Alert.alert("Login failed", error.message);
        return;
      }

      const authUid = data.user?.id;
      if (!authUid) {
        Alert.alert("Login failed", "No user session found.");
        return;
      }

      const workerRes = await supabase
        .from("user_worker")
        .select("id")
        .eq("auth_uid", authUid)
        .maybeSingle();

      if (workerRes.error) {
        Alert.alert("Error", workerRes.error.message);
        return;
      }
      if (workerRes.data) {
        router.replace("/workerpage/workerpage");
        return;
      }

      const clientRes = await supabase
        .from("user_client")
        .select("id")
        .eq("auth_uid", authUid)
        .maybeSingle();

      if (clientRes.error) {
        Alert.alert("Error", clientRes.error.message);
        return;
      }
      if (clientRes.data) {
        router.replace("/clientpage/clientpage");
        return;
      }

      Alert.alert(
        "Account role not found",
        "Your account is not registered as Worker or Client.",
      );
    } catch (e: any) {
      Alert.alert("Login error", e?.message ?? "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={styles.root}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            paddingBottom: Math.max(insets.bottom, 16),
          }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* TOP BAR */}
          <View style={[styles.topBar, { paddingHorizontal: H_PAD }]}>
            <Image
              source={require("../../image/jdklogo.png")}
              style={{ width: LOGO_W, height: LOGO_H, resizeMode: "contain" }}
            />
          </View>

          {/* CENTER */}
          <View
            style={[
              styles.centerWrap,
              {
                paddingHorizontal: H_PAD,
                justifyContent: isShort ? "flex-start" : "center",
                paddingTop: isShort ? 12 : 0,
              },
            ]}
          >
            <View
              style={[styles.formWrap, { maxWidth: clamp(440 * s, 360, 560) }]}
            >
              {/* ✅ CARD */}
              <View
                style={[
                  styles.card,
                  {
                    borderRadius: CARD_RADIUS,
                    padding: CARD_PAD,
                  },
                ]}
              >
                {/* ✅ Title now inside the card */}
                <Text style={[styles.title, { fontSize: TITLE_SIZE }]}>
                  Log in to <Text style={styles.titleBlue}>JDK HOMECARE</Text>
                </Text>

                <TextInput
                  value={email}
                  onChangeText={setEmail}
                  placeholder="Email Address"
                  placeholderTextColor="#9aa4b2"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  style={[
                    styles.input,
                    {
                      height: INPUT_H,
                      borderRadius: clamp(8 * s, 8, 12),
                      paddingHorizontal: clamp(14 * s, 12, 18),
                      fontSize: clamp(14 * s, 13, 16),
                      marginTop: clamp(16 * s, 12, 18),
                      marginBottom: clamp(12 * s, 10, 14),
                    },
                  ]}
                />

                <TextInput
                  value={password}
                  onChangeText={setPassword}
                  placeholder="Password"
                  placeholderTextColor="#9aa4b2"
                  secureTextEntry
                  autoCapitalize="none"
                  style={[
                    styles.input,
                    {
                      height: INPUT_H,
                      borderRadius: clamp(8 * s, 8, 12),
                      paddingHorizontal: clamp(14 * s, 12, 18),
                      fontSize: clamp(14 * s, 13, 16),
                      marginBottom: clamp(10 * s, 10, 14),
                    },
                  ]}
                />

                <TouchableOpacity
                  onPress={handleLogin}
                  activeOpacity={0.85}
                  disabled={!canLogin || isLoading}
                  style={[
                    styles.loginBtn,
                    {
                      height: BTN_H,
                      borderRadius: BTN_H / 2,
                      marginTop: clamp(6 * s, 4, 10),
                    },
                    canLogin && !isLoading
                      ? styles.loginBtnEnabled
                      : styles.loginBtnDisabled,
                  ]}
                >
                  <Text
                    style={[
                      styles.loginText,
                      { fontSize: clamp(14 * s, 13, 16) },
                      canLogin && !isLoading
                        ? styles.loginTextEnabled
                        : styles.loginTextDisabled,
                    ]}
                  >
                    {isLoading ? "Logging in..." : "Log In"}
                  </Text>
                </TouchableOpacity>

                <View
                  style={[
                    styles.signupRow,
                    { marginTop: clamp(14 * s, 12, 18) },
                  ]}
                >
                  <Text
                    style={[
                      styles.signupText,
                      { fontSize: clamp(13 * s, 12, 15) },
                    ]}
                  >
                    Don&apos;t have an account?
                  </Text>
                  <TouchableOpacity onPress={() => router.push("/role/role")}>
                    <Text
                      style={[
                        styles.signupLink,
                        { fontSize: clamp(13 * s, 12, 15) },
                      ]}
                    >
                      Sign Up
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
              {/* ✅ END CARD */}
            </View>
          </View>

          <View style={{ height: clamp(24 * s, 16, 32) }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#ffffff" },
  root: { flex: 1, backgroundColor: "#ffffff" },

  topBar: {
    paddingTop: 14,
    paddingBottom: 14,
    alignItems: "flex-start",
  },

  centerWrap: {
    flex: 1,
  },

  formWrap: {
    width: "100%",
    alignSelf: "center",
  },

  // ✅ CARD
  card: {
    width: "100%",
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#eef2f7",
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
  },

  title: {
    fontWeight: "800",
    color: "#111827",
    textAlign: "center",
  },
  titleBlue: { color: BLUE },

  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#d7dee9",
    color: "#111827",
    backgroundColor: "#ffffff",
  },

  loginBtn: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  loginBtnDisabled: { backgroundColor: "#d1d5db" },
  loginBtnEnabled: { backgroundColor: "#cfd6df" },

  loginText: { fontWeight: "700" },
  loginTextDisabled: { color: "#374151", opacity: 0.9 },
  loginTextEnabled: { color: "#111827" },

  signupRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    columnGap: 6,
  },
  signupText: { color: "#111827" },
  signupLink: { color: BLUE, fontWeight: "700" },
});
