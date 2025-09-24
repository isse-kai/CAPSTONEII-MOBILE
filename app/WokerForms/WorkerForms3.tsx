import AsyncStorage from "@react-native-async-storage/async-storage";
import { Image, Pressable, ScrollView, Text, View } from "dripsy";
import * as ImagePicker from "expo-image-picker";
import { useRouter, type Href } from "expo-router";
import { ArrowLeft, Upload } from "lucide-react-native";
import { useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "worker_step3";
const NEXT_ROUTE = "/WorkerForms/WorkerForms4" as Href;
const BACK_ROUTE = "/WorkerForms/WorkerForms2" as Href;

const C = { bg: "#fff", text: "#0f172a", sub: "#475569", blue: "#1e86ff", border: "#d9e3f0", card: "#f8fafc" };

type DocKey =
  | "primaryFront" | "primaryBack" | "secondaryId"
  | "nbi" | "address" | "medical" | "certificates";

export default function WorkerForms3() {
  const router = useRouter();
  const [docs, setDocs] = useState<Record<DocKey, string | null>>({
    primaryFront: null, primaryBack: null, secondaryId: null,
    nbi: null, address: null, medical: null, certificates: null
  });

  // hydrate
  useEffect(() => {
    (async () => {
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      setDocs({ ...docs, ...JSON.parse(raw) });
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
      mediaTypes: ImagePicker.MediaTypeOptions.Images, allowsEditing: true, quality: 0.85
    });
    if (!res.canceled) setDocs((s) => ({ ...s, [k]: res.assets[0].uri }));
  };

  const canNext = useMemo(() => !!docs.primaryFront, [docs.primaryFront]);

  const onNext = async () => {
    if (!canNext) return;
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(docs));
    router.push(NEXT_ROUTE);
  };

  return (
    <View sx={{ flex: 1, bg: C.bg }}>
      <View sx={{ px: 14, pt: 8, pb: 10, borderBottomWidth: 1, borderBottomColor: C.border }}>
        <Pressable onPress={() => router.push(BACK_ROUTE)} sx={{ width: 44, height: 44, alignItems: "center", justifyContent: "center" }}>
          <ArrowLeft color={C.text} size={26} />
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 96 }}>
        <View sx={{ px: 16, pt: 12 }}>
          <Text sx={{ color: C.sub, fontSize: 12, mb: 6 }}>3 of 6 | Post a Worker Application</Text>
          <Text sx={{ color: C.text, fontSize: 24, fontWeight: "900", mb: 14 }}>Step 3: Required Documents</Text>

          {([
            { key: "primaryFront", label: "Primary ID (Front) *" },
            { key: "primaryBack", label: "Primary ID (Back)" },
            { key: "secondaryId", label: "Secondary ID" },
            { key: "nbi", label: "NBI/Police Clearance" },
            { key: "address", label: "Proof of Address" },
            { key: "medical", label: "Medical Certificate" },
            { key: "certificates", label: "Certificates" },
          ] as { key: DocKey; label: string }[]).map((d) => (
            <DocCard key={d.key} label={d.label} uri={(docs as any)[d.key]} onPick={() => pick(d.key)} />
          ))}
        </View>
      </ScrollView>

      <Bar>
        <Ghost onPress={() => router.push(BACK_ROUTE)} label="Back : Work Information" />
        <Primary onPress={onNext} disabled={!canNext} label="Next : Set Your Price Rate" />
      </Bar>
    </View>
  );
}

function DocCard({ label, uri, onPick }: { label: string; uri: string | null; onPick: () => void }) {
  return (
    <View sx={{ borderWidth: 1, borderColor: C.border, borderRadius: 12, p: 12, mb: 12, bg: "#fff" }}>
      <Text sx={{ color: C.text, fontWeight: "800", mb: 8 }}>{label}</Text>
      <Pressable onPress={onPick} sx={{ borderWidth: 1, borderColor: C.border, borderRadius: 10, bg: C.card, height: 140, alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
        {uri ? <Image source={{ uri }} sx={{ width: "100%", height: "100%" }} resizeMode="cover" /> : (
          <View sx={{ alignItems: "center" }}>
            <Upload color={C.sub} size={22} />
            <Text sx={{ color: C.sub, mt: 6 }}>Click to upload or drag and drop</Text>
          </View>
        )}
      </Pressable>
      <Text sx={{ color: C.sub, mt: 6, fontSize: 12 }}>PDF, JPG, or PNG (max: 5MB)</Text>
    </View>
  );
}
const Bar = ({ children }: any) => <View sx={{ position: "absolute", left: 0, right: 0, bottom: 0, bg: "#fff", borderTopWidth: 1, borderTopColor: C.border, px: 12, py: 12, flexDirection: "row", gap: 10 }}>{children}</View>;
const Primary = ({ onPress, label, disabled }: any) => <Pressable onPress={onPress} disabled={disabled} sx={{ flex: 1.2, py: 12, borderRadius: 12, alignItems: "center", bg: disabled ? "#a7c8ff" : C.blue }}><Text sx={{ color: "#fff", fontWeight: "800" }}>{label}</Text></Pressable>;
const Ghost = ({ onPress, label }: any) => <Pressable onPress={onPress} sx={{ flex: 1, py: 12, borderRadius: 12, alignItems: "center", borderWidth: 1, borderColor: C.border }}><Text sx={{ color: C.text, fontWeight: "800" }}>{label}</Text></Pressable>;
