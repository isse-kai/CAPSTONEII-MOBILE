import AsyncStorage from "@react-native-async-storage/async-storage";
import { Pressable, ScrollView, Text, TextInput, View } from "dripsy";
import { useRouter, type Href } from "expo-router";
import { ArrowLeft, Minus, Plus } from "lucide-react-native";
import { useEffect, useMemo, useState } from "react";
import { Dimensions, Platform } from "react-native";

/* ---------- Dimensions / Theme (matches your Step 4 vibe) ---------- */
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
const STORAGE_KEY = "worker_step2";
const NEXT_ROUTE = "/WokerForms/WorkerForms3" as Href;
const BACK_ROUTE = "/WokerForms/WorkerForms1" as Href; // ensure this matches your Step 1 path

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
  const canNext = useMemo(
    () => anyType && Number(years || 0) >= 0 && ownTools !== null && desc.trim().length > 0,
    [anyType, years, ownTools, desc]
  );

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
          <Text sx={{ color: C.text, fontWeight: "900", fontSize: 18 }}>Step 2 of 6</Text>
          <Text sx={{ color: C.sub, ml: 12, fontSize: 14 }}>Describe Your Work</Text>
        </View>
        <View sx={{ flexDirection: "row", columnGap: 12 }}>
          {[1, 1, 0, 0, 0, 0].map((f, i) => (
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
            {/* Type of Service */}
            <Text sx={{ color: C.text, fontWeight: "900", fontSize: 20, mb: 8 }}>Type of Service</Text>
            <Text sx={{ color: C.sub, mb: GAP }}>
              Choose at least one category that best matches your work.
            </Text>

            {/* checkboxes (roomier rows) */}
            <View sx={{ mb: GAP }}>
              {(["Carpenter","Electrician","Plumber","Laundry","Carwasher"] as ServiceKey[]).map((k) => {
                const active = types[k];
                return (
                  <Pressable
                    key={k}
                    onPress={() => toggleType(k)}
                    sx={{
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "space-between",
                      bg: active ? C.chip : "#fff",
                      borderWidth: 1,
                      borderColor: active ? C.blue : C.border,
                      px: 14,
                      py: 12,
                      borderRadius: 14,
                      mb: 10,
                    }}
                  >
                    <Text sx={{ color: C.text, fontWeight: "800" }}>{k}</Text>
                    <View
                      sx={{
                        width: 22,
                        height: 22,
                        borderRadius: 6,
                        borderWidth: 2,
                        borderColor: active ? C.blue : C.border,
                        alignItems: "center",
                        justifyContent: "center",
                        bg: active ? C.blue : "#fff",
                      }}
                    >
                      {active ? <View sx={{ width: 10, height: 10, borderRadius: 2, bg: "#fff" }} /> : null}
                    </View>
                  </Pressable>
                );
              })}
            </View>

            {/* Service Details */}
            <Text sx={{ color: C.text, fontWeight: "900", fontSize: 18, mb: 8 }}>Service Details</Text>
            <Text sx={{ color: C.sub, mb: 10 }}>List specific tasks or specialties (e.g., “Install lighting”, “Tile repair”).</Text>

            {tasks.map((t, i) => (
              <View key={i} sx={{ flexDirection: "row", alignItems: "center", mb: 10, columnGap: 10 }}>
                <TextInput
                  value={t}
                  onChangeText={(v) => setTask(i, v)}
                  placeholder="Enter a task / specialty"
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
                {tasks.length > 1 ? (
                  <Pressable
                    onPress={() => removeTask(i)}
                    sx={{
                      px: 12,
                      py: 12,
                      borderRadius: 14,
                      bg: "#fee2e2",
                      borderWidth: 1,
                      borderColor: "#fecaca",
                    }}
                  >
                    <Minus color="#b91c1c" size={18} />
                  </Pressable>
                ) : null}
              </View>
            ))}

            <Pressable
              onPress={addTask}
              sx={{
                alignSelf: "flex-start",
                flexDirection: "row",
                alignItems: "center",
                columnGap: 8,
                mb: GAP,
                px: 10,
                py: 8,
                borderRadius: 999,
                bg: C.chip,
                borderWidth: 1,
                borderColor: C.border,
              }}
            >
              <Plus color={C.blue} size={18} />
              <Text sx={{ color: C.blue, fontWeight: "900" }}>Add Another Task</Text>
            </Pressable>

            {/* Description */}
            <Text sx={{ color: C.text, fontWeight: "900", fontSize: 18, mb: 8 }}>Service Description</Text>
            <Text sx={{ color: C.sub, mb: 8 }}>
              Describe your typical work, scope, or specialties. Be concise and professional.
            </Text>
            <TextInput
              value={desc}
              onChangeText={setDesc}
              placeholder="Tell clients what you do best…"
              placeholderTextColor={C.placeholder}
              multiline
              sx={{
                bg: C.field,
                borderWidth: 1,
                borderColor: C.border,
                borderRadius: 16,
                px: 14,
                py: 14,
                minHeight: 130,
                color: C.text,
                fontSize: 15,
              }}
            />

            {/* Years & Tools */}
            <Text sx={{ color: C.text, fontWeight: "900", fontSize: 18, mt: GAP, mb: 8 }}>
              Experience & Tools
            </Text>

            <Text sx={{ color: C.sub, mb: 6 }}>Years of Experience</Text>
            <TextInput
              value={years}
              onChangeText={setYears}
              placeholder="e.g., 5"
              keyboardType="number-pad"
              placeholderTextColor={C.placeholder}
              sx={{
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

            <Text sx={{ color: C.sub, mt: GAP, mb: 8 }}>Do you have your own tools or equipment?</Text>
            <View sx={{ flexDirection: "row", columnGap: 12 }}>
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
                      flex: 1,
                      py: 14,
                      alignItems: "center",
                      borderWidth: 2,
                      borderColor: active ? C.blue : C.border,
                      bg: active ? C.chip : C.field,
                      borderRadius: 14,
                    }}
                  >
                    <Text sx={{ color: active ? C.blue : C.text, fontWeight: "900" }}>{o.label}</Text>
                  </Pressable>
                );
              })}
            </View>
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
        <Ghost onPress={() => router.push(BACK_ROUTE)} label="Back : Personal Information" />
        <Primary onPress={onNext} disabled={!canNext} label="Next : Required Documents" />
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
