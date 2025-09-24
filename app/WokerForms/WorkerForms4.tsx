import AsyncStorage from "@react-native-async-storage/async-storage";
import { Pressable, ScrollView, Text, TextInput, View } from "dripsy";
import { useRouter, type Href } from "expo-router";
import { ArrowLeft } from "lucide-react-native";
import { useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "worker_step4";
const NEXT_ROUTE = "/WorkerForms/WorkerForms5" as Href;
const BACK_ROUTE = "/WorkerForms/WorkerForms3" as Href;

const C = { bg: "#fff", text: "#0f172a", sub: "#475569", blue: "#1e86ff", border: "#d9e3f0", field: "#f8fafc", placeholder: "#93a3b5" };

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
      <View sx={{ px: 14, pt: 8, pb: 10, borderBottomWidth: 1, borderBottomColor: C.border }}>
        <Pressable onPress={() => router.push(BACK_ROUTE)} sx={{ width: 44, height: 44, alignItems: "center", justifyContent: "center" }}>
          <ArrowLeft color={C.text} size={26} />
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 96 }}>
        <View sx={{ px: 16, pt: 12 }}>
          <Text sx={{ color: C.sub, fontSize: 12, mb: 6 }}>4 of 6 | Post a Worker Application</Text>
          <Text sx={{ color: C.text, fontSize: 24, fontWeight: "900", mb: 14 }}>Step 5: Set Your Price Rate</Text>

          <Text sx={{ color: C.text, fontSize: 18, fontWeight: "800", mb: 10 }}>Service Price Rate</Text>
          <Text sx={{ color: C.sub, mb: 12 }}>Please choose the service rate type and enter the price.</Text>

          <View sx={{ flexDirection: "row", gap: 10, mb: 12 }}>
            {[
              { k: "hour", label: "By the hour" },
              { k: "job", label: "By the job" },
            ].map((o) => {
              const active = rateType === o.k;
              return (
                <Pressable
                  key={o.k}
                  onPress={() => setRateType(o.k as any)}
                  sx={{
                    flex: 1, borderWidth: 1, borderColor: active ? C.blue : C.border,
                    bg: active ? "#eaf4ff" : C.field, borderRadius: 12, py: 14, alignItems: "center",
                  }}
                >
                  <Text sx={{ color: active ? C.blue : C.text, fontWeight: "800" }}>{o.label}</Text>
                </Pressable>
              );
            })}
          </View>

          {rateType === "hour" ? (
            <>
              <Text sx={{ color: C.text, fontWeight: "800", mb: 6 }}>Enter the Rate (Per Hour)</Text>
              <View sx={{ flexDirection: "row", gap: 10 }}>
                <TextInput
                  value={from}
                  onChangeText={setFrom}
                  placeholder="₱ From"
                  keyboardType="numeric"
                  placeholderTextColor={C.placeholder}
                  sx={{ flex: 1, bg: C.field, borderWidth: 1, borderColor: C.border, borderRadius: 10, px: 12, py: 12, color: C.text }}
                />
                <TextInput
                  value={to}
                  onChangeText={setTo}
                  placeholder="₱ To"
                  keyboardType="numeric"
                  placeholderTextColor={C.placeholder}
                  sx={{ flex: 1, bg: C.field, borderWidth: 1, borderColor: C.border, borderRadius: 10, px: 12, py: 12, color: C.text }}
                />
              </View>
              <Text sx={{ color: C.sub, mt: 8 }}>This is the average rate for similar home services.</Text>
            </>
          ) : (
            <>
              <Text sx={{ color: C.text, fontWeight: "800", mb: 6 }}>Enter the Rate</Text>
              <TextInput
                value={job}
                onChangeText={setJob}
                placeholder="₱"
                keyboardType="numeric"
                placeholderTextColor={C.placeholder}
                sx={{ bg: C.field, borderWidth: 1, borderColor: C.border, borderRadius: 10, px: 12, py: 12, color: C.text }}
              />
              <Text sx={{ color: C.sub, mt: 8 }}>
                Set a fixed price for the service request. You can still negotiate based on scope.
              </Text>
            </>
          )}
        </View>
      </ScrollView>

      <Bar>
        <Ghost onPress={() => router.push(BACK_ROUTE)} label="Back : Required Documents" />
        <Primary onPress={onNext} disabled={!canNext} label="Next : Terms & Agreements" />
      </Bar>
    </View>
  );
}

const Bar = ({ children }: any) => <View sx={{ position: "absolute", left: 0, right: 0, bottom: 0, bg: "#fff", borderTopWidth: 1, borderTopColor: C.border, px: 12, py: 12, flexDirection: "row", gap: 10 }}>{children}</View>;
const Primary = ({ onPress, label, disabled }: any) => <Pressable onPress={onPress} disabled={disabled} sx={{ flex: 1.2, py: 12, borderRadius: 12, alignItems: "center", bg: disabled ? "#a7c8ff" : C.blue }}><Text sx={{ color: "#fff", fontWeight: "800" }}>{label}</Text></Pressable>;
const Ghost = ({ onPress, label }: any) => <Pressable onPress={onPress} sx={{ flex: 1, py: 12, borderRadius: 12, alignItems: "center", borderWidth: 1, borderColor: C.border }}><Text sx={{ color: C.text, fontWeight: "800" }}>{label}</Text></Pressable>;
