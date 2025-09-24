import AsyncStorage from "@react-native-async-storage/async-storage";
import { Pressable, ScrollView, Text, TextInput, View } from "dripsy";
import { useRouter, type Href } from "expo-router";
import { ArrowLeft, Minus, Plus } from "lucide-react-native";
import { useEffect, useMemo, useState } from "react";
import { Dimensions } from "react-native";

const { width } = Dimensions.get("window");
const STORAGE_KEY = "worker_step2";
const NEXT_ROUTE = "/WokerForms/WorkerForms3" as Href;
const BACK_ROUTE = "/WorkerForms/WorkerForms1" as Href;

const C = { bg: "#fff", text: "#0f172a", sub: "#475569", blue: "#1e86ff", border: "#d9e3f0", field: "#f8fafc", placeholder: "#93a3b5" };

type ServiceKey = "Carpenter" | "Electrician" | "Plumber" | "Laundry" | "Carwasher";

export default function WorkerForms2() {
  const router = useRouter();

  const [types, setTypes] = useState<Record<ServiceKey, boolean>>({
    Carpenter: false, Electrician: false, Plumber: false, Laundry: false, Carwasher: false
  });
  const [tasks, setTasks] = useState<string[]>([""]);
  const [desc, setDesc] = useState("");
  const [years, setYears] = useState<string>("");
  const [ownTools, setOwnTools] = useState<null | boolean>(null);

  // hydrate
  useEffect(() => {
    (async () => {
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const v = JSON.parse(raw);
      setTypes(v.types ?? types);
      setTasks(v.tasks ?? [""]);
      setDesc(v.desc ?? "");
      setYears(v.years ?? "");
      setOwnTools(typeof v.ownTools === "boolean" ? v.ownTools : null);
    })();
  }, []);

  // autosave
  useEffect(() => {
    const id = setTimeout(() => {
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify({ types, tasks, desc, years, ownTools })).catch(() => {});
    }, 350);
    return () => clearTimeout(id);
  }, [types, tasks, desc, years, ownTools]);

  const anyType = useMemo(() => Object.values(types).some(Boolean), [types]);
  const canNext = useMemo(() => anyType && Number(years || 0) >= 0 && ownTools !== null && desc.trim().length > 0, [anyType, years, ownTools, desc]);

  const toggleType = (k: ServiceKey) => setTypes((s) => ({ ...s, [k]: !s[k] }));

  const setTask = (i: number, val: string) => {
    setTasks((arr) => {
      const next = [...arr];
      next[i] = val;
      return next;
    });
  };
  const addTask = () => setTasks((arr) => [...arr, ""]);
  const removeTask = (i: number) => setTasks((arr) => arr.filter((_, idx) => idx !== i));

  const onNext = async () => {
    if (!canNext) return;
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify({ types, tasks, desc, years, ownTools }));
    router.push(NEXT_ROUTE);
  };

  return (
    <View sx={{ flex: 1, bg: C.bg }}>
      {/* Header */}
      <View sx={{ px: 14, pt: 8, pb: 10, borderBottomWidth: 1, borderBottomColor: C.border }}>
        <Pressable onPress={() => router.push(BACK_ROUTE)} sx={{ width: 44, height: 44, alignItems: "center", justifyContent: "center" }}>
          <ArrowLeft color={C.text} size={26} />
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 96 }}>
        <View sx={{ px: 16, pt: 12 }}>
          <Text sx={{ color: C.sub, fontSize: 12, mb: 6 }}>2 of 6 | Post a Worker Application</Text>
          <Text sx={{ color: C.text, fontSize: 24, fontWeight: "900", mb: 14 }}>Step 2: Describe Your Work</Text>

          <Text sx={{ color: C.text, fontSize: 18, fontWeight: "800", mb: 10 }}>Type of Service</Text>

          {/* checkboxes */}
          {(["Carpenter","Electrician","Plumber","Laundry","Carwasher"] as ServiceKey[]).map((k) => (
            <Pressable key={k} onPress={() => toggleType(k)} sx={{ flexDirection: "row", alignItems: "center", mb: 8 }}>
              <View sx={{
                width: 20, height: 20, borderRadius: 4, borderWidth: 1, borderColor: C.border, alignItems: "center", justifyContent: "center",
                bg: types[k] ? C.blue : "#fff"
              }}>
                {types[k] && <View sx={{ width: 10, height: 10, borderRadius: 2, bg: "#fff" }} />}
              </View>
              <Text sx={{ color: C.text, ml: 10 }}>{k}</Text>
            </Pressable>
          ))}

          <Text sx={{ color: C.text, fontSize: 16, fontWeight: "800", mt: 16, mb: 8 }}>Service Details</Text>
          {tasks.map((t, i) => (
            <View key={i} sx={{ flexDirection: "row", alignItems: "center", mb: 8, gap: 8 }}>
              <TextInput
                value={t}
                onChangeText={(v) => setTask(i, v)}
                placeholder="Enter a task / specialty"
                placeholderTextColor={C.placeholder}
                sx={{ flex: 1, bg: C.field, borderWidth: 1, borderColor: C.border, borderRadius: 10, px: 12, py: 10, color: C.text }}
              />
              {tasks.length > 1 ? (
                <Pressable onPress={() => removeTask(i)} sx={{ px: 10, py: 10, borderRadius: 10, bg: "#fee2e2" }}>
                  <Minus color="#b91c1c" size={18} />
                </Pressable>
              ) : null}
            </View>
          ))}
          <Pressable onPress={addTask} sx={{ alignSelf: "flex-start", flexDirection: "row", alignItems: "center", gap: 6, mb: 10 }}>
            <Plus color={C.blue} size={18} />
            <Text sx={{ color: C.blue, fontWeight: "800" }}>Add Another Task</Text>
          </Pressable>

          <Text sx={{ color: C.text, fontSize: 18, fontWeight: "800", mt: 8 }}>Service Description</Text>
          <TextInput
            value={desc}
            onChangeText={setDesc}
            placeholder="Describe your work"
            placeholderTextColor={C.placeholder}
            multiline
            sx={{ bg: C.field, borderWidth: 1, borderColor: C.border, borderRadius: 10, px: 12, py: 12, minHeight: 110, color: C.text, mt: 8 }}
          />

          {/* years + tools */}
          <Text sx={{ color: C.text, fontSize: 16, fontWeight: "800", mt: 16, mb: 8 }}>Years of Experience</Text>
          <TextInput
            value={years}
            onChangeText={setYears}
            placeholder="e.g. 5"
            keyboardType="number-pad"
            placeholderTextColor={C.placeholder}
            sx={{ bg: C.field, borderWidth: 1, borderColor: C.border, borderRadius: 10, px: 12, py: 12, color: C.text }}
          />

          <Text sx={{ color: C.text, fontSize: 16, fontWeight: "800", mt: 16, mb: 8 }}>Do you have your own tools or equipment?</Text>
          <View sx={{ flexDirection: "row" }}>
            {[
              { label: "Yes", val: true },
              { label: "No", val: false },
            ].map((o, i) => {
              const active = ownTools === o.val;
              return (
                <Pressable
                  key={o.label}
                  onPress={() => setOwnTools(o.val)}
                  sx={{
                    flex: 1, py: 10, alignItems: "center", borderWidth: 1, borderColor: active ? C.blue : C.border,
                    bg: active ? "#eaf4ff" : C.field,
                    ...(i === 0 ? { borderTopLeftRadius: 10, borderBottomLeftRadius: 10 } : { borderTopRightRadius: 10, borderBottomRightRadius: 10 }),
                  }}
                >
                  <Text sx={{ color: active ? C.blue : C.text, fontWeight: "700" }}>{o.label}</Text>
                </Pressable>
              );
            })}
          </View>
        </View>
      </ScrollView>

      <View sx={{ position: "absolute", left: 0, right: 0, bottom: 0, bg: "#fff", borderTopWidth: 1, borderTopColor: C.border, px: 12, py: 12, flexDirection: "row", gap: 10 }}>
        <Ghost onPress={() => router.push(BACK_ROUTE)} label="Back : Personal Information" />
        <Primary onPress={onNext} disabled={!canNext} label="Next : Required Documents" />
      </View>
    </View>
  );
}

const Primary = ({ onPress, label, disabled }: any) => (
  <Pressable onPress={onPress} disabled={disabled} sx={{ flex: 1.2, py: 12, borderRadius: 12, alignItems: "center", bg: disabled ? "#a7c8ff" : C.blue }}>
    <Text sx={{ color: "#fff", fontWeight: "800" }}>{label}</Text>
  </Pressable>
);
const Ghost = ({ onPress, label }: any) => (
  <Pressable onPress={onPress} sx={{ flex: 1, py: 12, borderRadius: 12, alignItems: "center", borderWidth: 1, borderColor: C.border }}>
    <Text sx={{ color: C.text, fontWeight: "800" }}>{label}</Text>
  </Pressable>
);
