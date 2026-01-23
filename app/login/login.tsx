import { useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { supabase } from "../../supabase/supabase"; // ✅ adjust if your path is different

const BLUE = "#1E88E5";

export default function LoginScreen() {
  const router = useRouter();
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

      // 1) Sign in using Supabase Auth
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

      // 2) Check if user exists in user_worker
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

      // 3) Check if user exists in user_client
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
        router.replace("/clientpage/clientpage"); //clientpage
        return;
      }

      // 4) Not found in either
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
        <View style={styles.topBar}>
          <Image
            source={require("../../image/jdklogo.png")}
            style={styles.logo}
          />
        </View>

        <View style={styles.centerWrap}>
          <View style={styles.formWrap}>
            <Text style={styles.title}>
              Log in to <Text style={styles.titleBlue}>JDK HOMECARE</Text>
            </Text>

            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder="Email Address"
              placeholderTextColor="#9aa4b2"
              keyboardType="email-address"
              autoCapitalize="none"
              style={styles.input}
            />

            <TextInput
              value={password}
              onChangeText={setPassword}
              placeholder="Password"
              placeholderTextColor="#9aa4b2"
              secureTextEntry
              style={styles.input}
            />

            <TouchableOpacity
              onPress={handleLogin}
              activeOpacity={0.85}
              disabled={!canLogin || isLoading}
              style={[
                styles.loginBtn,
                canLogin && !isLoading
                  ? styles.loginBtnEnabled
                  : styles.loginBtnDisabled,
              ]}
            >
              <Text
                style={[
                  styles.loginText,
                  canLogin && !isLoading
                    ? styles.loginTextEnabled
                    : styles.loginTextDisabled,
                ]}
              >
                {isLoading ? "Logging in..." : "Log In"}
              </Text>
            </TouchableOpacity>

            <View style={styles.signupRow}>
              <Text style={styles.signupText}>Don't have an account?</Text>
              <TouchableOpacity onPress={() => router.push("/role/role")}>
                <Text style={styles.signupLink}>Sign Up</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={styles.bottomSpace} />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#ffffff" },
  root: { flex: 1, backgroundColor: "#ffffff" },

  topBar: {
    paddingHorizontal: 18,
    paddingTop: 8,
    paddingBottom: 8,
    alignItems: "flex-start",
  },
  logo: { width: 150, height: 30, resizeMode: "contain" },

  centerWrap: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 18,
  },

  formWrap: {
    width: "100%",
    maxWidth: 420,
    alignSelf: "center",
    alignItems: "center",
  },

  title: {
    fontSize: 20,
    fontWeight: "800",
    color: "#111827",
    marginBottom: 18,
    textAlign: "center",
  },
  titleBlue: { color: BLUE },

  input: {
    width: "100%",
    height: 52,
    borderWidth: 1,
    borderColor: "#d7dee9",
    borderRadius: 6,
    paddingHorizontal: 14,
    fontSize: 14,
    color: "#111827",
    backgroundColor: "#ffffff",
    marginBottom: 14,
  },

  loginBtn: {
    width: "100%",
    height: 46,
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 6,
  },
  loginBtnDisabled: { backgroundColor: "#d1d5db" },
  loginBtnEnabled: { backgroundColor: "#cfd6df" },

  loginText: { fontSize: 14, fontWeight: "700" },
  loginTextDisabled: { color: "#374151", opacity: 0.9 },
  loginTextEnabled: { color: "#111827" },

  signupRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 14,
    columnGap: 6,
  },
  signupText: { color: "#111827", fontSize: 13 },
  signupLink: { color: BLUE, fontSize: 13, fontWeight: "700" },

  bottomSpace: { height: 24 },
});
