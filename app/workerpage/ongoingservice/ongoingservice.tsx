// ongoingservice.tsx
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router"; // ✅ for navigation
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Alert,
  Animated,
  Easing,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const BLUE = "#1E88E5";
const BORDER = "#E6EEF8";
const TEXT = "#0F172A";
const MUTED = "#64748B";
const BG = "#F7FAFF";
const SOFT = "#EAF3FF";

type StepData = { uri: string | null; desc: string };
type StepsState = Record<number, StepData>;

const STEP_TITLES = ["Before", "Ongoing", "Near done", "Completed"];

// ✅ logo (adjust path if needed)
const JDK_LOGO = require("../../../image/jdklogo.png");

function clampText(s: string, max = 18) {
  const t = (s || "").trim();
  if (!t) return "";
  return t.length > max ? t.slice(0, max - 1) + "…" : t;
}

export default function OngoingService() {
  const router = useRouter(); // ✅

  const totalSteps = 4;
  const [step, setStep] = useState(1);
  const [steps, setSteps] = useState<StepsState>({
    1: { uri: null, desc: "" },
    2: { uri: null, desc: "" },
    3: { uri: null, desc: "" },
    4: { uri: null, desc: "" },
  });

  const current = steps[step];
  const canNext = step < totalSteps;
  const title = useMemo(() => STEP_TITLES[step - 1] ?? `Step ${step}`, [step]);

  function setCurrent(patch: Partial<StepData>) {
    setSteps((prev) => ({ ...prev, [step]: { ...prev[step], ...patch } }));
  }

  async function ensureGalleryPermission() {
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) {
      Alert.alert("Permission needed", "Allow photo access to upload images.");
      return false;
    }
    return true;
  }

  async function ensureCameraPermission() {
    const perm = await ImagePicker.requestCameraPermissionsAsync();
    if (!perm.granted) {
      Alert.alert("Permission needed", "Allow camera access to take photos.");
      return false;
    }
    return true;
  }

  async function pickFromGallery() {
    const ok = await ensureGalleryPermission();
    if (!ok) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.8,
    });

    if (result.canceled) return;
    const uri = result.assets?.[0]?.uri;
    if (!uri) return;
    setCurrent({ uri });
  }

  async function takePhoto() {
    const ok = await ensureCameraPermission();
    if (!ok) return;

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 0.8,
    });

    if (result.canceled) return;
    const uri = result.assets?.[0]?.uri;
    if (!uri) return;
    setCurrent({ uri });
  }

  function validateStepBeforeNext(): boolean {
    if (!current.uri) {
      Alert.alert("Upload required", "Please upload a photo for this step.");
      return false;
    }
    if (!current.desc.trim()) {
      Alert.alert(
        "Description required",
        "Add a short description for the photo.",
      );
      return false;
    }
    return true;
  }

  function goNext() {
    if (!validateStepBeforeNext()) return;
    if (step < totalSteps) setStep((s) => s + 1);
  }

  function finish() {
    if (!validateStepBeforeNext()) return;
    Alert.alert("Done", "Service progress completed.");
  }

  // ✅ Top-left button goes to workerpage.tsx
  function goToWorkerPage() {
    // Adjust this path to where your workerpage.tsx is in expo-router
    // Example: app/workerpage/workerpage.tsx => "/workerpage/workerpage"
    router.push("./workerpage/workerpage");
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.wrap}>
        {/* Top Bar */}
        <View style={styles.topBar}>
          <TouchableOpacity onPress={goToWorkerPage} style={styles.topBtn}>
            <Text style={styles.topBtnText}>← Back</Text>
          </TouchableOpacity>

          <Text style={styles.topTitle}>Ongoing Service</Text>

          <View style={{ width: 60 }} />
        </View>

        {/* Progress */}
        <View style={styles.progressCard}>
          <View style={styles.logoRow}>
            <Image source={JDK_LOGO} style={styles.logo} resizeMode="contain" />
          </View>

          <StepProgress
            step={step}
            totalSteps={totalSteps}
            stepsState={steps}
          />

          <Text style={styles.stepLabel}>
            {title} • {step}/{totalSteps}
          </Text>
        </View>

        {/* Current Step Content */}
        <View style={styles.card}>
          <View style={styles.photoBox}>
            {current.uri ? (
              <Image source={{ uri: current.uri }} style={styles.photo} />
            ) : (
              <View style={styles.photoEmpty}>
                <Text style={styles.photoEmptyText}>No photo</Text>
              </View>
            )}
          </View>

          <View style={styles.actionRow}>
            <TouchableOpacity
              style={styles.actionBtn}
              onPress={pickFromGallery}
            >
              <Text style={styles.actionText}>Gallery</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionBtn} onPress={takePhoto}>
              <Text style={styles.actionText}>Camera</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.inputLabel}>Description</Text>
          <TextInput
            value={current.desc}
            onChangeText={(t) => setCurrent({ desc: t })}
            placeholder="e.g., Installed new faucet"
            placeholderTextColor="#94A3B8"
            style={styles.input}
            maxLength={120}
          />
          <Text style={styles.counter}>{current.desc.trim().length}/120</Text>

          <View style={styles.footerRow}>
            {canNext ? (
              <TouchableOpacity onPress={goNext} style={styles.primaryBtn}>
                <Text style={styles.primaryText}>Next</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity onPress={finish} style={styles.primaryBtn}>
                <Text style={styles.primaryText}>Finish</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Bottom Summary */}
        <View style={styles.bottomCard}>
          <Text style={styles.bottomTitle}>Steps</Text>

          {[1, 2, 3, 4].map((s) => {
            const d = steps[s];
            const ok = !!d.uri && !!d.desc.trim();

            return (
              <View key={s} style={styles.stepRow}>
                <View style={styles.thumb}>
                  {d.uri ? (
                    <Image source={{ uri: d.uri }} style={styles.thumbImg} />
                  ) : (
                    <View style={styles.thumbEmpty}>
                      <Text style={styles.thumbEmptyText}>{s}</Text>
                    </View>
                  )}
                </View>

                <View style={{ flex: 1 }}>
                  <Text style={styles.stepRowTitle}>
                    Step {s} • {STEP_TITLES[s - 1]}
                  </Text>
                  <Text style={styles.stepRowDesc}>
                    {d.desc.trim() ? d.desc.trim() : "No description"}
                  </Text>
                </View>

                <Text
                  style={[styles.badge, ok ? styles.badgeOk : styles.badgeNo]}
                >
                  {ok ? "Ready" : "Missing"}
                </Text>
              </View>
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

/* ---------------- Progress Bar ---------------- */

function StepProgress({
  step,
  totalSteps,
  stepsState,
}: {
  step: number;
  totalSteps: number;
  stepsState: StepsState;
}) {
  const [width, setWidth] = useState(0);
  const slideX = useRef(new Animated.Value(0)).current;
  const prog = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!width) return;

    const segment = width / totalSteps;
    const targetX = (step - 1) * segment;
    const targetP = totalSteps === 1 ? 1 : (step - 1) / (totalSteps - 1);

    Animated.parallel([
      Animated.timing(slideX, {
        toValue: targetX,
        duration: 220,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(prog, {
        toValue: targetP,
        duration: 220,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: false,
      }),
    ]).start();
  }, [step, width, totalSteps, slideX, prog]);

  const segment = width ? width / totalSteps : 0;
  const lineLeftRightPad = 18;
  const lineWidth = Math.max(0, width - lineLeftRightPad * 2);
  const activeLineW = prog.interpolate({
    inputRange: [0, 1],
    outputRange: [0, lineWidth],
  });

  return (
    <View
      style={styles.progressWrap}
      onLayout={(e) => setWidth(e.nativeEvent.layout.width)}
    >
      <View
        style={[
          styles.baseLine,
          { left: lineLeftRightPad, right: lineLeftRightPad },
        ]}
      />
      <Animated.View
        style={[
          styles.activeLine,
          { left: lineLeftRightPad, width: activeLineW },
        ]}
      />

      {width > 0 ? (
        <Animated.View
          pointerEvents="none"
          style={[
            styles.activeSegment,
            { width: segment, transform: [{ translateX: slideX }] },
          ]}
        />
      ) : null}

      {Array.from({ length: totalSteps }, (_, i) => i + 1).map((s) => {
        const data = stepsState[s];
        const isActive = s === step;
        const isDone = s < step;

        const showImg = !!data.uri;
        const desc = data.desc.trim();
        const sub = desc ? clampText(desc, 16) : STEP_TITLES[s - 1];

        return (
          <View key={s} style={styles.stepCell}>
            <View
              style={[
                styles.dot,
                isDone || isActive ? styles.dotActive : styles.dotIdle,
              ]}
            >
              {showImg ? (
                <Image source={{ uri: data.uri! }} style={styles.dotImg} />
              ) : (
                <Text
                  style={[
                    styles.dotText,
                    isDone || isActive
                      ? styles.dotTextActive
                      : styles.dotTextIdle,
                  ]}
                >
                  {s}
                </Text>
              )}
            </View>

            <Text
              numberOfLines={1}
              style={[
                styles.stepSub,
                isDone || isActive ? styles.stepSubActive : styles.stepSubIdle,
              ]}
            >
              {sub}
            </Text>
          </View>
        );
      })}
    </View>
  );
}

/* ---------------- Styles ---------------- */

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: BG },
  wrap: { padding: 14, paddingBottom: 28 },

  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  topBtn: { width: 60 },
  topBtnText: { color: BLUE, fontWeight: "800" },
  topTitle: { color: TEXT, fontWeight: "900", fontSize: 16 },

  progressCard: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 14,
    padding: 10,
    marginBottom: 10,
  },
  logoRow: { alignItems: "center", marginBottom: 8 },
  logo: { width: 92, height: 28 },
  stepLabel: { marginTop: 8, color: MUTED, fontSize: 12, fontWeight: "700" },

  progressWrap: {
    position: "relative",
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingVertical: 6,
    paddingHorizontal: 2,
  },
  baseLine: {
    position: "absolute",
    top: 22,
    height: 3,
    borderRadius: 999,
    backgroundColor: "#CFE3FB",
  },
  activeLine: {
    position: "absolute",
    top: 22,
    height: 3,
    borderRadius: 999,
    backgroundColor: BLUE,
  },
  activeSegment: {
    position: "absolute",
    top: 0,
    bottom: 0,
    borderRadius: 12,
    backgroundColor: SOFT,
  },

  stepCell: { flex: 1, alignItems: "center", paddingHorizontal: 2 },

  dot: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    overflow: "hidden",
    backgroundColor: "#FFFFFF",
  },
  dotActive: { borderColor: BLUE },
  dotIdle: { borderColor: "#D7E3F3" },
  dotImg: { width: "100%", height: "100%" },
  dotText: { fontWeight: "900", fontSize: 12 },
  dotTextActive: { color: BLUE },
  dotTextIdle: { color: "#475569" },
  stepSub: { marginTop: 6, fontSize: 11, fontWeight: "800" },
  stepSubActive: { color: TEXT },
  stepSubIdle: { color: MUTED },

  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: BORDER,
    padding: 12,
  },
  photoBox: { width: "100%", marginBottom: 10 },
  photo: {
    width: "100%",
    height: 160,
    borderRadius: 12,
    backgroundColor: "#EEF2FF",
  },
  photoEmpty: {
    width: "100%",
    height: 160,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#D7E3F3",
    backgroundColor: "#FAFCFF",
    alignItems: "center",
    justifyContent: "center",
  },
  photoEmptyText: { color: MUTED, fontWeight: "800" },

  actionRow: { flexDirection: "row", gap: 10, marginBottom: 10 },
  actionBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#D7E3F3",
    alignItems: "center",
    backgroundColor: "#FAFCFF",
  },
  actionText: { color: TEXT, fontWeight: "900", fontSize: 12.5 },

  inputLabel: {
    color: MUTED,
    fontWeight: "800",
    fontSize: 12,
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: "#D7E3F3",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: TEXT,
    backgroundColor: "#FFFFFF",
  },
  counter: { marginTop: 6, color: "#94A3B8", fontSize: 11, fontWeight: "700" },

  footerRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 12,
  },
  primaryBtn: {
    paddingVertical: 11,
    paddingHorizontal: 18,
    borderRadius: 12,
    backgroundColor: BLUE,
    minWidth: 110,
    alignItems: "center",
  },
  primaryText: { color: "#FFFFFF", fontWeight: "900" },

  bottomCard: {
    marginTop: 10,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 14,
    padding: 12,
  },
  bottomTitle: { color: TEXT, fontWeight: "900", marginBottom: 10 },

  stepRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: "#F1F5FB",
  },
  thumb: { width: 48, height: 48, borderRadius: 10, overflow: "hidden" },
  thumbImg: { width: "100%", height: "100%" },
  thumbEmpty: {
    width: "100%",
    height: "100%",
    borderWidth: 1,
    borderColor: "#D7E3F3",
    backgroundColor: "#FAFCFF",
    alignItems: "center",
    justifyContent: "center",
  },
  thumbEmptyText: { fontWeight: "900", color: MUTED },

  stepRowTitle: { color: TEXT, fontWeight: "900", fontSize: 12.5 },
  stepRowDesc: { color: MUTED, fontWeight: "700", fontSize: 12, marginTop: 2 },

  badge: { fontWeight: "900", fontSize: 11 },
  badgeOk: { color: "#16A34A" },
  badgeNo: { color: "#EF4444" },

  disabledText: { color: "#94A3B8" },
  disabled: { opacity: 0.5 },
});
