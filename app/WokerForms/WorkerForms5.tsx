import AsyncStorage from "@react-native-async-storage/async-storage";
import { Pressable, ScrollView, Text, View } from "dripsy";
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
const STORAGE_KEY = "worker_step5";
const NEXT_ROUTE = "/WokerForms/WorkerPreview" as Href;
const BACK_ROUTE = "/WokerForms/WorkerForms4" as Href;

export default function WorkerForms5() {
  const router = useRouter();

  const [a1, setA1] = useState(false);
  const [a2, setA2] = useState(false);
  const [a3, setA3] = useState(false);

  // hydrate
  useEffect(() => {
    (async () => {
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const v = JSON.parse(raw);
      setA1(!!v.a1); setA2(!!v.a2); setA3(!!v.a3);
    })();
  }, []);

  // autosave
  useEffect(() => {
    const id = setTimeout(() => {
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify({ a1, a2, a3 })).catch(() => {});
    }, 250);
    return () => clearTimeout(id);
  }, [a1, a2, a3]);

  const canNext = useMemo(() => a1 && a2 && a3, [a1, a2, a3]);

  const onNext = async () => {
    if (!canNext) return;
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify({ a1, a2, a3 }));
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
          <Text sx={{ color: C.text, fontWeight: "900", fontSize: 18 }}>Step 5 of 6</Text>
          <Text sx={{ color: C.sub, ml: 12, fontSize: 14 }}>Terms & Agreements</Text>
        </View>
        <View sx={{ flexDirection: "row", columnGap: 12 }}>
          {[1, 1, 1, 1, 1, 0].map((f, i) => (
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
            <Text sx={{ color: C.text, fontWeight: "900", fontSize: 20, mb: 8 }}>
              Agreements
            </Text>
            <Text sx={{ color: C.sub, mb: GAP }}>
              Please read carefully and confirm all items to continue.
            </Text>

            <CheckRow
              checked={a1}
              onToggle={() => setA1((v) => !v)}
              title="I consent to background checks and verify my documents."
              sub="JD HOMECARE may verify the authenticity of your submitted documents."
            />

            <CheckRow
              checked={a2}
              onToggle={() => setA2((v) => !v)}
              title="I agree to JD HOMECARE's Terms of Service and Privacy Policy."
              link="View Terms of Service and Privacy Policy"
              onLink={() => {/* open a webview/sheet if you have one */}}
            />

            <CheckRow
              checked={a3}
              onToggle={() => setA3((v) => !v)}
              title="I consent to the collection and processing of my personal data in accordance with the Data Privacy Act (RA 10173)."
              sub="Your data will be protected and processed in compliance with Philippine law."
            />
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
        <Ghost onPress={() => router.push(BACK_ROUTE)} label="Back : Set Your Price Rate" />
        <Primary onPress={onNext} disabled={!canNext} label="Next : Review Application" />
      </View>
    </View>
  );
}

/* ---------- Bits ---------- */
function CheckRow({
  checked,
  onToggle,
  title,
  sub,
  link,
  onLink,
}: {
  checked: boolean;
  onToggle: () => void;
  title: string;
  sub?: string;
  link?: string;
  onLink?: () => void;
}) {
  return (
    <View
      sx={{
        flexDirection: "row",
        alignItems: "flex-start",
        columnGap: 12,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: C.border,
      }}
    >
      <Pressable
        onPress={onToggle}
        sx={{
          width: 24,
          height: 24,
          borderRadius: 6,
          borderWidth: 2,
          borderColor: checked ? C.blue : C.border,
          alignItems: "center",
          justifyContent: "center",
          bg: checked ? C.blue : "#fff",
          mt: 2,
        }}
      >
        {checked ? <View sx={{ width: 12, height: 12, borderRadius: 3, bg: "#fff" }} /> : null}
      </Pressable>

      <View sx={{ flex: 1 }}>
        <Pressable onPress={onToggle}>
          <Text sx={{ color: C.text, fontWeight: "800" }}>{title}</Text>
        </Pressable>
        {sub ? <Text sx={{ color: C.sub, mt: 6, lineHeight: 20 }}>{sub}</Text> : null}
        {link ? (
          <Pressable onPress={onLink} sx={{ mt: 8 }}>
            <Text sx={{ color: C.blue, fontWeight: "900" }}>{link}</Text>
          </Pressable>
        ) : null}
      </View>
    </View>
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
