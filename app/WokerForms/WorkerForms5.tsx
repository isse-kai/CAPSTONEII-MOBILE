import AsyncStorage from "@react-native-async-storage/async-storage";
import { Pressable, ScrollView, Text, View } from "dripsy";
import { useRouter, type Href } from "expo-router";
import { ArrowLeft } from "lucide-react-native";
import { useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "worker_step5";
const NEXT_ROUTE = "/WorkerForms/WorkerPreview" as Href;
const BACK_ROUTE = "/WorkerForms/WorkerForms4" as Href;

const C = { bg: "#fff", text: "#0f172a", sub: "#475569", blue: "#1e86ff", border: "#d9e3f0" };

export default function WorkerForms5() {
  const router = useRouter();
  const [a1, setA1] = useState(false);
  const [a2, setA2] = useState(false);
  const [a3, setA3] = useState(false);

  useEffect(() => {
    (async () => {
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const v = JSON.parse(raw);
      setA1(!!v.a1); setA2(!!v.a2); setA3(!!v.a3);
    })();
  }, []);

  useEffect(() => {
    const id = setTimeout(() => {
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify({ a1, a2, a3 })).catch(() => {});
    }, 250);
    return () => clearTimeout(id);
  }, [a1,a2,a3]);

  const canNext = useMemo(() => a1 && a2 && a3, [a1,a2,a3]);

  const onNext = async () => {
    if (!canNext) return;
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify({ a1, a2, a3 }));
    router.push(NEXT_ROUTE);
  };

  const Check = ({ checked, onPress }: any) => (
    <Pressable onPress={onPress} sx={{ width: 22, height: 22, borderRadius: 4, borderWidth: 1, borderColor: C.border, alignItems: "center", justifyContent: "center", mr: 10, bg: checked ? C.blue : "#fff" }}>
      {checked ? <View sx={{ width: 12, height: 12, bg: "#fff", borderRadius: 2 }} /> : null}
    </Pressable>
  );

  return (
    <View sx={{ flex: 1, bg: C.bg }}>
      <View sx={{ px: 14, pt: 8, pb: 10, borderBottomWidth: 1, borderBottomColor: C.border }}>
        <Pressable onPress={() => router.push(BACK_ROUTE)} sx={{ width: 44, height: 44, alignItems: "center", justifyContent: "center" }}>
          <ArrowLeft color={C.text} size={26} />
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 96 }}>
        <View sx={{ px: 16, pt: 12 }}>
          <Text sx={{ color: C.sub, fontSize: 12, mb: 6 }}>5 of 6 | Post a Worker Application</Text>
          <Text sx={{ color: C.text, fontSize: 24, fontWeight: "900", mb: 14 }}>Step 4: Terms & Agreements</Text>

          <Text sx={{ color: C.text, fontSize: 18, fontWeight: "800", mb: 14 }}>Agreements</Text>

          <View sx={{ flexDirection: "row", mb: 14 }}>
            <Check checked={a1} onPress={() => setA1((v) => !v)} />
            <View sx={{ flex: 1 }}>
              <Text sx={{ color: C.text }}>
                I consent to background checks and verify my documents.{" "}
                <Text sx={{ color: C.sub, fontSize: 12, display: "flex" }}>
                  JD HOMECARE may verify the authenticity of your submitted documents.
                </Text>
              </Text>
            </View>
          </View>

          <View sx={{ flexDirection: "row", mb: 14 }}>
            <Check checked={a2} onPress={() => setA2((v) => !v)} />
            <View sx={{ flex: 1 }}>
              <Text sx={{ color: C.text }}>
                I agree to JD HOMECARE's Terms of Service and Privacy Policy.
              </Text>
              <Text sx={{ color: C.blue, mt: 4 }}>View Terms of Service and Privacy Policy</Text>
            </View>
          </View>

          <View sx={{ flexDirection: "row", mb: 14 }}>
            <Check checked={a3} onPress={() => setA3((v) => !v)} />
            <View sx={{ flex: 1 }}>
              <Text sx={{ color: C.text }}>
                I consent to the collection and processing of my personal data in accordance with the Data Privacy Act (RA 10173).
              </Text>
              <Text sx={{ color: C.sub, mt: 4, fontSize: 12 }}>
                Your data will be protected and processed in compliance with Philippine law.
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>

      <Bar>
        <Ghost onPress={() => router.push(BACK_ROUTE)} label="Back : Set Your Price Rate" />
        <Primary onPress={onNext} disabled={!canNext} label="Next : Review Application" />
      </Bar>
    </View>
  );
}

const Bar = ({ children }: any) => <View sx={{ position: "absolute", left: 0, right: 0, bottom: 0, bg: "#fff", borderTopWidth: 1, borderTopColor: C.border, px: 12, py: 12, flexDirection: "row", gap: 10 }}>{children}</View>;
const Primary = ({ onPress, label, disabled }: any) => <Pressable onPress={onPress} disabled={disabled} sx={{ flex: 1.2, py: 12, borderRadius: 12, alignItems: "center", bg: disabled ? "#a7c8ff" : C.blue }}><Text sx={{ color: "#fff", fontWeight: "800" }}>{label}</Text></Pressable>;
const Ghost = ({ onPress, label }: any) => <Pressable onPress={onPress} sx={{ flex: 1, py: 12, borderRadius: 12, alignItems: "center", borderWidth: 1, borderColor: C.border }}><Text sx={{ color: C.text, fontWeight: "800" }}>{label}</Text></Pressable>;
