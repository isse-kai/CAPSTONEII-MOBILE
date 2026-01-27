import { useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

const BLUE = "#1E88E5";
const clamp = (v: number, min: number, max: number) =>
  Math.max(min, Math.min(max, v));

export default function RoleScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { width, height } = useWindowDimensions();

  const s = width / 375;

  // ✅ same bigger logo sizing as login
  const LOGO_W = clamp(180 * s, 160, 260);
  const LOGO_H = clamp(40 * s, 34, 60);

  // responsive layout
  const H_PAD = clamp(18 * s, 14, 24);
  const TITLE_SIZE = clamp(20 * s, 18, 26);
  const OPTION_MIN_H = clamp(64 * s, 58, 76);
  const BTN_H = clamp(46 * s, 44, 56);

  const RADIUS = clamp(10 * s, 8, 14);
  const CARD_RADIUS = clamp(18 * s, 14, 22);
  const CARD_PAD = clamp(18 * s, 14, 22);

  const isShort = height < 700;

  const [role, setRole] = useState<"client" | "worker" | "">("");
  const canContinue = useMemo(() => role !== "", [role]);

  const handleCreateAccount = () => {
    if (!role) return;

    if (role === "client") {
      router.push("/clientsignup/clientsignup");
      return;
    }
    router.push("/workersignup/workersignup");
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          paddingBottom: Math.max(insets.bottom, 16),
        }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.root}>
          {/* Top-left logo */}
          <View style={[styles.topBar, { paddingHorizontal: H_PAD }]}>
            <Image
              source={require("../../image/jdklogo.png")}
              style={{ width: LOGO_W, height: LOGO_H, resizeMode: "contain" }}
            />
          </View>

          {/* Center content */}
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
              {/* ✅ CARD WRAPPER */}
              <View
                style={[
                  styles.card,
                  {
                    borderRadius: CARD_RADIUS,
                    padding: CARD_PAD,
                  },
                ]}
              >
                {/* Title inside card */}
                <Text style={[styles.title, { fontSize: TITLE_SIZE }]}>
                  Join as a <Text style={styles.titleBlue}>Client</Text> or{" "}
                  <Text style={styles.titleBlue}>Worker</Text>
                </Text>

                {/* Option 1 */}
                <TouchableOpacity
                  activeOpacity={0.9}
                  style={[
                    styles.optionBox,
                    {
                      minHeight: OPTION_MIN_H,
                      borderRadius: RADIUS,
                      paddingHorizontal: clamp(14 * s, 12, 18),
                      paddingVertical: clamp(14 * s, 12, 18),
                      marginTop: clamp(16 * s, 12, 18),
                      marginBottom: clamp(12 * s, 10, 14),
                    },
                    role === "client" && styles.optionBoxActive,
                  ]}
                  onPress={() => setRole("client")}
                >
                  <View
                    style={[
                      styles.radioOuter,
                      {
                        width: clamp(18 * s, 16, 22),
                        height: clamp(18 * s, 16, 22),
                        borderRadius: clamp(9 * s, 8, 11),
                      },
                      role === "client" && styles.radioOuterActive,
                    ]}
                  >
                    {role === "client" ? (
                      <View
                        style={[
                          styles.radioInner,
                          {
                            width: clamp(9 * s, 8, 12),
                            height: clamp(9 * s, 8, 12),
                            borderRadius: clamp(5 * s, 4, 8),
                          },
                        ]}
                      />
                    ) : null}
                  </View>

                  <Text
                    style={[
                      styles.optionText,
                      { fontSize: clamp(13.5 * s, 13, 16) },
                    ]}
                  >
                    I&apos;m a client, hiring for a service
                  </Text>
                </TouchableOpacity>

                {/* Option 2 */}
                <TouchableOpacity
                  activeOpacity={0.9}
                  style={[
                    styles.optionBox,
                    {
                      minHeight: OPTION_MIN_H,
                      borderRadius: RADIUS,
                      paddingHorizontal: clamp(14 * s, 12, 18),
                      paddingVertical: clamp(14 * s, 12, 18),
                      marginBottom: clamp(12 * s, 10, 14),
                    },
                    role === "worker" && styles.optionBoxActive,
                  ]}
                  onPress={() => setRole("worker")}
                >
                  <View
                    style={[
                      styles.radioOuter,
                      {
                        width: clamp(18 * s, 16, 22),
                        height: clamp(18 * s, 16, 22),
                        borderRadius: clamp(9 * s, 8, 11),
                      },
                      role === "worker" && styles.radioOuterActive,
                    ]}
                  >
                    {role === "worker" ? (
                      <View
                        style={[
                          styles.radioInner,
                          {
                            width: clamp(9 * s, 8, 12),
                            height: clamp(9 * s, 8, 12),
                            borderRadius: clamp(5 * s, 4, 8),
                          },
                        ]}
                      />
                    ) : null}
                  </View>

                  <Text
                    style={[
                      styles.optionText,
                      { fontSize: clamp(13.5 * s, 13, 16) },
                    ]}
                  >
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
                    {
                      height: BTN_H,
                      borderRadius: BTN_H / 2,
                      marginTop: clamp(6 * s, 4, 10),
                    },
                    canContinue
                      ? styles.createBtnEnabled
                      : styles.createBtnDisabled,
                  ]}
                >
                  <Text
                    style={[
                      styles.createText,
                      { fontSize: clamp(14 * s, 13, 16) },
                      canContinue
                        ? styles.createTextEnabled
                        : styles.createTextDisabled,
                    ]}
                  >
                    Create Account
                  </Text>
                </TouchableOpacity>

                {/* Bottom link */}
                <View
                  style={[
                    styles.bottomRow,
                    { marginTop: clamp(14 * s, 12, 18) },
                  ]}
                >
                  <Text
                    style={[
                      styles.bottomText,
                      { fontSize: clamp(13 * s, 12, 15) },
                    ]}
                  >
                    Already have an account?
                  </Text>
                  <TouchableOpacity onPress={() => router.push("/login/login")}>
                    <Text
                      style={[
                        styles.bottomLink,
                        { fontSize: clamp(13 * s, 12, 15) },
                      ]}
                    >
                      Log In
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
              {/* ✅ END CARD */}
            </View>
          </View>

          <View style={{ height: clamp(24 * s, 16, 32) }} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#fff" },
  root: { flex: 1, backgroundColor: "#fff" },

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

  // ✅ CARD STYLE (same idea as login)
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

  optionBox: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#d7dee9",
    backgroundColor: "#fff",
    flexDirection: "row",
    alignItems: "center",
    columnGap: 12,
  },
  optionBoxActive: {
    borderColor: "#b7c6dd",
  },

  radioOuter: {
    borderWidth: 2,
    borderColor: "#cbd5e1",
    alignItems: "center",
    justifyContent: "center",
  },
  radioOuterActive: { borderColor: BLUE },
  radioInner: {
    backgroundColor: BLUE,
  },

  optionText: {
    flex: 1,
    color: "#111827",
    fontWeight: "600",
  },

  createBtn: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  createBtnDisabled: { backgroundColor: "#d1d5db" },
  createBtnEnabled: { backgroundColor: "#cfd6df" },

  createText: { fontWeight: "700" },
  createTextDisabled: { color: "#374151", opacity: 0.9 },
  createTextEnabled: { color: "#111827" },

  bottomRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    columnGap: 6,
    flexWrap: "wrap",
  },
  bottomText: { color: "#111827" },
  bottomLink: { color: BLUE, fontWeight: "700" },
});
