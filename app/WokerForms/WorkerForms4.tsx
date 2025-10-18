import AsyncStorage from "@react-native-async-storage/async-storage";
import { Pressable, ScrollView, Text, TextInput, View } from "dripsy";
import { useRouter, type Href } from "expo-router";
import { ArrowLeft } from "lucide-react-native";
import { useEffect, useMemo, useState } from "react";
import { Dimensions, Platform } from "react-native";

/* ---------- Dimensions / Theme (match other steps) ---------- */
const { width } = Dimensions.get("window");
const C = {
  bg: "#f7f9fc",
  text: "#0f172a",
  sub: "#64748b",
  blue: "#1e86ff",
  blueDark: "#0c62c9",
  border: "#e6eef7",
  chip: "#eaf4ff",
  card: "#fff",
  field: "#f8fafc",
  placeholder: "#93a3b5",
  track: "#e9f0fb",
};
const PAD = 20;
const GAP = 16;
const BTN_PY = 16;

/* ---------- Storage / Routes ---------- */
const STORAGE_KEY = "worker_step4";
const NEXT_ROUTE = "/WokerForms/WorkerForms5" as Href;
const BACK_ROUTE = "/WokerForms/WorkerForms3" as Href;

export default function WorkerForms4() {
  const router = useRouter();

  const [rateType, setRateType] = useState<"hour" | "job" | null>("hour");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [job, setJob] = useState("");

  // hydrate
  useEffect(() => {
    (async () => {
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const v = JSON.parse(raw);
      setRateType(v.rateType ?? "hour");
      setFrom(v.from ?? "");
      setTo(v.to ?? "");
      setJob(v.job ?? "");
    })();
  }, []);

  // autosave
  useEffect(() => {
    const id = setTimeout(() => {
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify({ rateType, from, to, job })).catch(() => {});
    }, 300);
    return () => clearTimeout(id);
  }, [rateType, from, to, job]);

  const canNext = useMemo(() => {
    if (rateType === "hour") return !!from || !!to;
    if (rateType === "job") return !!job;
    return false;
  }, [rateType, from, to, job]);

  const onNext = async () => {
    if (!canNext) return;
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify({ rateType, from, to, job }));
    router.push(NEXT_ROUTE);
  };

  return (
    <View sx={{ flex: 1, bg: C.bg }}>
      {/* Header (roomy) */}
      <View
        sx={{
          px: PAD,
          pt: 12,
          pb: 16,
          borderBottomWidth: 1,
          borderBottomColor: C.border,
          bg: C.card,
        }}
      >
        <Pressable onPress={() => router.push(BACK_ROUTE)} sx={{ width: 48, height: 48, alignItems: "center", justifyContent: "center" }}>
          <ArrowLeft color={C.text} size={28} strokeWidth={2.4} />
        </Pressable>
      </View>

      {/* Step bar */}
      <View sx={{ px: PAD, pt: 18, pb: 14, bg: C.card }}>
        <View sx={{ flexDirection: "row", alignItems: "center", mb: 14 }}>
          <Text sx={{ color: C.text, fontWeight: "900", fontSize: 18 }}>Step 4 of 6</Text>
          <Text sx={{ color: C.sub, ml: 12, fontSize: 14 }}>Set Your Price Rate</Text>
        </View>
        <View sx={{ flexDirection: "row", columnGap: 12 }}>
          {[1, 1, 1, 1, 0, 0].map((f, i) => (
            <View
              key={i}
              sx={{
                flex: 1,
                height: 10,
                borderRadius: 999,
                bg: f ? C.blue : C.track,
                borderWidth: 1,
                borderColor: C.border,
              }}
            />
          ))}
        </View>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 160 }} showsVerticalScrollIndicator={false}>
        <View sx={{ px: PAD, pt: 18 }}>
          {/* Card wrapper */}
          <View
            sx={{
              bg: C.card,
              borderWidth: 1,
              borderColor: C.border,
              borderRadius: 24,
              px: PAD,
              py: 18,
              mb: 24,
              shadowColor: "#000",
              shadowOpacity: Platform.OS === "android" ? 0 : 0.06,
              shadowRadius: 14,
              shadowOffset: { width: 0, height: 6 },
              elevation: 1,
            }}
          >
            {/* Title */}
            <Text sx={{ color: C.text, fontWeight: "900", fontSize: 20, mb: 8 }}>
              Service Price Rate
            </Text>
            <Text sx={{ color: C.sub, mb: GAP }}>
              Choose how you charge and enter your target rate.
            </Text>

            {/* Toggle: hour vs job */}
            <View sx={{ flexDirection: "row", columnGap: 12, mb: GAP }}>
              {[
                { k: "hour", label: "By the hour" },
                { k: "job", label: "By the job" },
              ].map((o) => {
                const active = rateType === (o.k as "hour" | "job");
                return (
                  <Pressable
                    key={o.k}
                    onPress={() => setRateType(o.k as any)}
                    sx={{
                      flex: 1,
                      borderWidth: 2,
                      borderColor: active ? C.blue : C.border,
                      bg: active ? C.chip : C.field,
                      borderRadius: 14,
                      py: 14,
                      alignItems: "center",
                    }}
                  >
                    <Text sx={{ color: active ? C.blue : C.text, fontWeight: "900" }}>{o.label}</Text>
                  </Pressable>
                );
              })}
            </View>

            {/* Rate inputs */}
            {rateType === "hour" ? (
              <>
                <Text sx={{ color: C.text, fontWeight: "900", mb: 6 }}>Enter the Rate (Per Hour)</Text>
                <View sx={{ flexDirection: "row", columnGap: 12 }}>
                  <Field
                    value={from}
                    onChangeText={setFrom}
                    placeholder="₱ From"
                    keyboardType="numeric"
                  />
                  <Field
                    value={to}
                    onChangeText={setTo}
                    placeholder="₱ To"
                    keyboardType="numeric"
                  />
                </View>
                <Text sx={{ color: C.sub, mt: 8 }}>
                  Tip: You can provide a range while you get started.
                </Text>
              </>
            ) : (
              <>
                <Text sx={{ color: C.text, fontWeight: "900", mb: 6 }}>Enter the Rate</Text>
                <Field
                  value={job}
                  onChangeText={setJob}
                  placeholder="₱"
                  keyboardType="numeric"
                />
                <Text sx={{ color: C.sub, mt: 8 }}>
                  Fixed price for the job. You can still negotiate based on scope.
                </Text>
              </>
            )}
          </View>
        </View>
      </ScrollView>

      {/* Sticky Actions (roomy) */}
      <View
        sx={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          bg: "#fff",
          borderTopWidth: 1,
          borderTopColor: C.border,
          p: 14,
          flexDirection: "row",
          columnGap: 12,
        }}
      >
        <Ghost onPress={() => router.push(BACK_ROUTE)} label="Back : Required Documents" />
        <Primary onPress={onNext} disabled={!canNext} label="Next : Terms & Agreements" />
      </View>
    </View>
  );
}

/* ---------- Reusable field ---------- */
function Field(props: any) {
  return (
    <TextInput
      {...props}
      placeholderTextColor={C.placeholder}
      sx={{
        flex: 1,
        bg: C.field,
        borderWidth: 1,
        borderColor: C.border,
        borderRadius: 14,
        px: 14,
        py: 14,
        color: C.text,
        fontSize: 15,
      }}
    />
  );
}

/* ---------- Buttons ---------- */
const Primary = ({ onPress, label, disabled }: any) => (
  <Pressable
    onPress={onPress}
    disabled={disabled}
    sx={{
      flex: 1.25,
      py: BTN_PY,
      borderRadius: 18,
      alignItems: "center",
      bg: disabled ? "#a7c8ff" : C.blue,
    }}
  >
    <Text sx={{ color: "#fff", fontWeight: "900", fontSize: 16 }}>{label}</Text>
  </Pressable>
);
const Ghost = ({ onPress, label }: any) => (
  <Pressable
    onPress={onPress}
    sx={{
      flex: 1,
      py: BTN_PY,
      borderRadius: 18,
      alignItems: "center",
      borderWidth: 1,
      borderColor: C.border,
      bg: "#fff",
    }}
  >
    <Text sx={{ color: C.text, fontWeight: "900", fontSize: 16 }}>{label}</Text>
  </Pressable>
);
