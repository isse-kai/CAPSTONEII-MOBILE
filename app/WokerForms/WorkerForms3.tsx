import AsyncStorage from "@react-native-async-storage/async-storage";
import { Image, Pressable, ScrollView, Text, View } from "dripsy";
import * as ImagePicker from "expo-image-picker";
import { useRouter, type Href } from "expo-router";
import { ArrowLeft, Upload, X } from "lucide-react-native";
import { useEffect, useMemo, useState } from "react";
import { Dimensions, Modal, Platform } from "react-native";

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
const STORAGE_KEY = "worker_step3";
const NEXT_ROUTE = "/WokerForms/WorkerForms4" as Href;
const BACK_ROUTE = "/WokerForms/WorkerForms2" as Href;

/* ---------- Types ---------- */
type DocKey =
  | "primaryFront"
  | "primaryBack"
  | "secondaryId"
  | "nbi"
  | "address"
  | "medical"
  | "certificates";

/* ---------- Screen ---------- */
export default function WorkerForms3() {
  const router = useRouter();

  const [docs, setDocs] = useState<Record<DocKey, string | null>>({
    primaryFront: null,
    primaryBack: null,
    secondaryId: null,
    nbi: null,
    address: null,
    medical: null,
    certificates: null,
  });

  // Lightbox
  const [previewUri, setPreviewUri] = useState<string | null>(null);

  // hydrate
  useEffect(() => {
    (async () => {
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      setDocs((s) => ({ ...s, ...JSON.parse(raw) }));
    })();
  }, []);

  // autosave
  useEffect(() => {
    const id = setTimeout(() => {
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(docs)).catch(() => {});
    }, 350);
    return () => clearTimeout(id);
  }, [docs]);

  const pick = async (k: DocKey) => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") return;
    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.85,
    });
    if (!res.canceled) setDocs((s) => ({ ...s, [k]: res.assets[0].uri }));
  };

  const clearDoc = (k: DocKey) => setDocs((s) => ({ ...s, [k]: null }));

  const canNext = useMemo(() => !!docs.primaryFront, [docs.primaryFront]);

  const onNext = async () => {
    if (!canNext) return;
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(docs));
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
        <Pressable
          onPress={() => router.push(BACK_ROUTE)}
          sx={{ width: 48, height: 48, alignItems: "center", justifyContent: "center" }}
        >
          <ArrowLeft color={C.text} size={28} strokeWidth={2.4} />
        </Pressable>
      </View>

      {/* Step bar */}
      <View sx={{ px: PAD, pt: 18, pb: 14, bg: C.card }}>
        <View sx={{ flexDirection: "row", alignItems: "center", mb: 14 }}>
          <Text sx={{ color: C.text, fontWeight: "900", fontSize: 18 }}>Step 3 of 6</Text>
          <Text sx={{ color: C.sub, ml: 12, fontSize: 14 }}>Required Documents</Text>
        </View>
        <View sx={{ flexDirection: "row", columnGap: 12 }}>
          {[1, 1, 1, 0, 0, 0].map((f, i) => (
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
            <Text sx={{ color: C.text, fontWeight: "900", fontSize: 20, mb: 6 }}>
              Upload Your Documents
            </Text>
            <Text sx={{ color: C.sub, mb: GAP }}>
              Clear photos are best. Primary ID (front) is required to continue.
            </Text>

            {(
              [
                { key: "primaryFront", label: "Primary ID (Front) *" },
                { key: "primaryBack", label: "Primary ID (Back)" },
                { key: "secondaryId", label: "Secondary ID" },
                { key: "nbi", label: "NBI/Police Clearance" },
                { key: "address", label: "Proof of Address" },
                { key: "medical", label: "Medical Certificate" },
                { key: "certificates", label: "Certificates" },
              ] as { key: DocKey; label: string }[]
            ).map((d) => (
              <DocCard
                key={d.key}
                label={d.label}
                uri={docs[d.key]}
                onPick={() => pick(d.key)}
                onClear={() => clearDoc(d.key)}
                onOpen={(u) => setPreviewUri(u)}
              />
            ))}
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
        <Ghost onPress={() => router.push(BACK_ROUTE)} label="Back : Work Information" />
        <Primary onPress={onNext} disabled={!canNext} label="Next : Set Your Price Rate" />
      </View>

      {/* Lightbox */}
      <Modal
        visible={!!previewUri}
        animationType="fade"
        transparent
        onRequestClose={() => setPreviewUri(null)}
      >
        <Pressable
          onPress={() => setPreviewUri(null)}
          sx={{
            flex: 1,
            bg: "rgba(0,0,0,0.96)",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {previewUri ? (
            <Image source={{ uri: previewUri }} sx={{ width: "100%", height: "100%" }} resizeMode="contain" />
          ) : null}
          <Pressable
            onPress={() => setPreviewUri(null)}
            sx={{
              position: "absolute",
              top: 22,
              right: 22,
              bg: "rgba(0,0,0,0.5)",
              borderRadius: 999,
              p: 8,
            }}
          >
            <X color="#fff" size={26} />
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

/* ---------- Bits ---------- */
function DocCard({
  label,
  uri,
  onPick,
  onClear,
  onOpen,
}: {
  label: string;
  uri: string | null;
  onPick: () => void;
  onClear: () => void;
  onOpen: (u: string) => void;
}) {
  return (
    <View
      sx={{
        borderWidth: 1,
        borderColor: C.border,
        borderRadius: 18,
        p: 14,
        mb: 14,
        bg: "#fff",
      }}
    >
      <Text sx={{ color: C.text, fontWeight: "900", mb: 10 }}>{label}</Text>

      <Pressable
        onPress={uri ? () => onOpen(uri) : onPick}
        sx={{
          borderWidth: 1,
          borderColor: C.border,
          borderRadius: 16,
          bg: C.field,
          height: 160,
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
        }}
      >
        {uri ? (
          <Image source={{ uri }} sx={{ width: "100%", height: "100%" }} resizeMode="cover" />
        ) : (
          <View sx={{ alignItems: "center" }}>
            <Upload color={C.sub} size={22} />
            <Text sx={{ color: C.sub, mt: 6 }}>Tap to upload</Text>
          </View>
        )}
      </Pressable>

      <View sx={{ flexDirection: "row", columnGap: 10, mt: 10 }}>
        <Pressable
          onPress={onPick}
          sx={{
            flex: 1,
            borderWidth: 1,
            borderColor: C.border,
            borderRadius: 12,
            alignItems: "center",
            justifyContent: "center",
            py: 12,
            bg: "#fff",
          }}
        >
          <Text sx={{ color: C.text, fontWeight: "900" }}>{uri ? "Replace" : "Upload"}</Text>
        </Pressable>
        {uri ? (
          <Pressable
            onPress={onClear}
            sx={{
              width: 100,
              borderWidth: 1,
              borderColor: "#fecaca",
              borderRadius: 12,
              alignItems: "center",
              justifyContent: "center",
              py: 12,
              bg: "#fee2e2",
            }}
          >
            <Text sx={{ color: "#b91c1c", fontWeight: "900" }}>Remove</Text>
          </Pressable>
        ) : null}
      </View>

      <Text sx={{ color: C.sub, mt: 8, fontSize: 12 }}>
        JPG or PNG (max ~5MB). Tip: crop to the ID edges for clarity.
      </Text>
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
