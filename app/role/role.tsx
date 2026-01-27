import { useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const BLUE = "#1E88E5";

export default function RoleScreen() {
  const router = useRouter();
  const [role, setRole] = useState<"client" | "worker" | "">("");

  const canContinue = useMemo(() => role !== "", [role]);

  const handleCreateAccount = () => {
    if (!role) return;

    if (role === "client") {
      router.push("./clientsignup/clientsignup");
      return;
    }

    // worker
    router.push("./workersignup/workersignup");
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.root}>
        {/* Top-left logo */}
        <View style={styles.topBar}>
          <Image
            // ✅ Adjust path if needed:
            source={require("../../image/jdklogo.png")}
            style={styles.logo}
          />
        </View>

        {/* Center content */}
        <View style={styles.centerWrap}>
          <View style={styles.formWrap}>
            <Text style={styles.title}>
              Join as a <Text style={styles.titleBlue}>Client</Text> or{" "}
              <Text style={styles.titleBlue}>Worker</Text>
            </Text>

            {/* Option 1 */}
            <TouchableOpacity
              activeOpacity={0.9}
              style={[
                styles.optionBox,
                role === "client" && styles.optionBoxActive,
              ]}
              onPress={() => setRole("client")}
            >
              <View
                style={[
                  styles.radioOuter,
                  role === "client" && styles.radioOuterActive,
                ]}
              >
                {role === "client" ? <View style={styles.radioInner} /> : null}
              </View>
              <Text style={styles.optionText}>
                I&apos;m a client, hiring for a service
              </Text>
            </TouchableOpacity>

            {/* Option 2 */}
            <TouchableOpacity
              activeOpacity={0.9}
              style={[
                styles.optionBox,
                role === "worker" && styles.optionBoxActive,
              ]}
              onPress={() => setRole("worker")}
            >
              <View
                style={[
                  styles.radioOuter,
                  role === "worker" && styles.radioOuterActive,
                ]}
              >
                {role === "worker" ? <View style={styles.radioInner} /> : null}
              </View>
              <Text style={styles.optionText}>
                I&apos;m a worker, looking for a service job
              </Text>
            </TouchableOpacity>

            {/* Create account button */}
            <TouchableOpacity
              activeOpacity={0.85}
              disabled={!canContinue}
              onPress={handleCreateAccount}
              style={[
                styles.createBtn,
                canContinue
                  ? styles.createBtnEnabled
                  : styles.createBtnDisabled,
              ]}
            >
              <Text
                style={[
                  styles.createText,
                  canContinue
                    ? styles.createTextEnabled
                    : styles.createTextDisabled,
                ]}
              >
                Create Account
              </Text>
            </TouchableOpacity>

            {/* Bottom link */}
            <View style={styles.bottomRow}>
              <Text style={styles.bottomText}>Already have an account?</Text>
              <TouchableOpacity onPress={() => router.push("./login/login")}>
                <Text style={styles.bottomLink}>Log In</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={{ height: 24 }} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#fff" },
  root: { flex: 1, backgroundColor: "#fff" },

  topBar: {
    paddingHorizontal: 18,
    paddingTop: 8,
    paddingBottom: 8,
    alignItems: "flex-start",
  },
  logo: {
    width: 150,
    height: 30,
    resizeMode: "contain",
  },

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
    textAlign: "center",
    marginBottom: 18,
  },
  titleBlue: { color: BLUE },

  optionBox: {
    width: "100%",
    minHeight: 64,
    borderWidth: 1,
    borderColor: "#d7dee9",
    borderRadius: 6,
    backgroundColor: "#fff",
    paddingHorizontal: 14,
    paddingVertical: 14,
    flexDirection: "row",
    alignItems: "center",
    columnGap: 12,
    marginBottom: 14,
  },
  optionBoxActive: {
    borderColor: "#b7c6dd",
  },

  radioOuter: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: "#cbd5e1",
    alignItems: "center",
    justifyContent: "center",
  },
  radioOuterActive: { borderColor: BLUE },
  radioInner: {
    width: 9,
    height: 9,
    borderRadius: 5,
    backgroundColor: BLUE,
  },

  optionText: {
    flex: 1,
    fontSize: 13.5,
    color: "#111827",
    fontWeight: "600",
  },

  createBtn: {
    width: "100%",
    height: 46,
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 6,
  },
  createBtnDisabled: { backgroundColor: "#d1d5db" },
  createBtnEnabled: { backgroundColor: "#cfd6df" },
  createText: { fontSize: 14, fontWeight: "700" },
  createTextDisabled: { color: "#374151", opacity: 0.9 },
  createTextEnabled: { color: "#111827" },

  bottomRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 14,
    columnGap: 6,
    flexWrap: "wrap",
  },
  bottomText: { fontSize: 13, color: "#111827" },
  bottomLink: { fontSize: 13, color: BLUE, fontWeight: "700" },
});
