// app/forms/request2.tsx
import AsyncStorage from "@react-native-async-storage/async-storage";
import DateTimePicker, { type DateTimePickerEvent } from "@react-native-community/datetimepicker";
import { Image, Pressable, ScrollView, Text, TextInput, View } from "dripsy";
import * as ImagePicker from "expo-image-picker";
import { useRouter, type Href } from "expo-router";
import {
  ArrowLeft,
  Calendar,
  ChevronDown,
  Clock,
  Image as ImageIcon,
  Upload,
  X,
  XCircle,
} from "lucide-react-native";
import { useEffect, useMemo, useState } from "react";
import { Alert, Dimensions, Modal, Platform } from "react-native";

const { width } = Dimensions.get("window");
const LOGO = require("../../assets/jdklogo.png");

const C = {
  bg: "#f7f9fc",
  text: "#0f172a",
  sub: "#64748b",
  blue: "#1e86ff",
  blueDark: "#0c62c9",
  border: "#e6eef7",
  fieldBg: "#fff",
  placeholder: "#93a3b5",
  card: "#ffffff",
  track: "#e9f0fb",
  bad: "#ef4444",
  chip: "#eaf4ff",
};

// global spacing knobs
const PAD = 20;      // page/card horizontal padding
const GAP = 16;      // between fields
const BTN_PY = 16;   // button vertical padding

const STORAGE_KEY = "request_step2";
const NEXT_ROUTE = "/forms/request3" as Href;

const SERVICE_TYPES = ["Plumbing", "Electrical", "Cleaning", "Laundry", "Mechanic", "Carpentry"];

const TASKS: Record<string, string[]> = {
  Plumbing: ["Leak repair", "Install faucet", "Clog removal", "Pipe replacement"],
  Electrical: ["Outlet install", "Light fixture", "Wiring check", "Breaker issue"],
  Cleaning: ["Deep clean", "Post-construction", "Move-in/out", "Window cleaning"],
  Laundry: ["Wash & fold", "Ironing", "Dry cleaning drop-off"],
  Mechanic: ["Engine check", "Oil change", "Battery issue"],
  Carpentry: ["Door repair", "Shelves install", "Furniture fix"],
};

// start-of-today (midnight) helper to clamp min selectable date
const TODAY = (() => {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
})();

export default function DescribeRequest() {
  const router = useRouter();

  // form state
  const [serviceType, setServiceType] = useState<string | null>(null);
  const [serviceTask, setServiceTask] = useState<string | null>(null);
  const [date, setDate] = useState<Date | null>(null);
  const [time, setTime] = useState<Date | null>(null);
  const [toolsProvided, setToolsProvided] = useState<null | boolean>(null);
  const [urgent, setUrgent] = useState<null | boolean>(null);
  const [desc, setDesc] = useState("");
  const [photo, setPhoto] = useState<string | null>(null);

  // pickers visibility
  const [showDate, setShowDate] = useState(false);
  const [showTime, setShowTime] = useState(false);

  // searchable select modals
  const [openType, setOpenType] = useState(false);
  const [openTask, setOpenTask] = useState(false);

  // searchable queries inside modals
  const [qType, setQType] = useState("");
  const [qTask, setQTask] = useState("");

  // submitted flag to show errors only after attempting next
  const [submitted, setSubmitted] = useState(false);

  // hydrate from storage
  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (!raw) return;
        const v = JSON.parse(raw);

        setServiceType(v.serviceType ?? null);
        setServiceTask(v.serviceTask ?? null);

        // clamp any persisted past date to today
        const savedDate = v.date ? new Date(v.date) : null;
        if (savedDate) {
          const saved0 = new Date(savedDate);
          saved0.setHours(0, 0, 0, 0);
          setDate(saved0 < TODAY ? TODAY : savedDate);
        } else {
          setDate(null);
        }

        setTime(v.time ? new Date(v.time) : null);
        setToolsProvided(typeof v.toolsProvided === "boolean" ? v.toolsProvided : null);
        setUrgent(typeof v.urgent === "boolean" ? v.urgent : null);
        setDesc(v.desc ?? "");
        setPhoto(v.photo ?? null);
      } catch {}
    })();
  }, []);

  // auto-save draft (debounced)
  useEffect(() => {
    const id = setTimeout(() => {
      const payload = {
        serviceType,
        serviceTask,
        date: date ? date.toISOString() : null,
        time: time ? time.toISOString() : null,
        toolsProvided,
        urgent,
        desc,
        photo,
      };
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(payload)).catch(() => {});
    }, 350);
    return () => clearTimeout(id);
  }, [serviceType, serviceTask, date, time, toolsProvided, urgent, desc, photo]);

  const filteredTasks = useMemo(() => {
    const base = serviceType ? TASKS[serviceType] || [] : [];
    if (!qTask.trim()) return base;
    const q = qTask.toLowerCase();
    return base.filter((t) => t.toLowerCase().includes(q));
  }, [serviceType, qTask]);

  const filteredTypes = useMemo(() => {
    if (!qType.trim()) return SERVICE_TYPES;
    const q = qType.toLowerCase();
    return SERVICE_TYPES.filter((t) => t.toLowerCase().includes(q));
  }, [qType]);

  // validation & gating
  const errors = useMemo(
    () => ({
      serviceType: !serviceType,
      serviceTask: !serviceTask,
      date: !date,
      time: !time,
      toolsProvided: toolsProvided === null,
      urgent: urgent === null,
      desc: desc.trim().length < 3,
    }),
    [serviceType, serviceTask, date, time, toolsProvided, urgent, desc]
  );

  const canNext = useMemo(() => Object.values(errors).every((v) => !v), [errors]);

  // Date/Time handlers
  const handleDateChange = (_ev: DateTimePickerEvent, selected?: Date) => {
    setShowDate(false);
    if (!selected) return;
    const picked = new Date(selected);
    picked.setHours(0, 0, 0, 0);

    if (picked < TODAY) {
      Alert.alert("Unavailable", "Please choose today or a future date.");
      setDate(TODAY); // optionally snap to today
      return;
    }
    setDate(selected);
  };

  const handleTimeChange = (_ev: DateTimePickerEvent, selected?: Date) => {
    setShowTime(false);
    if (selected) setTime(selected);
  };

  // Image picker
  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") return;
    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.9,
      aspect: [4, 3],
      allowsEditing: true,
    });
    if (!res.canceled) setPhoto(res.assets[0].uri);
  };

  const onRemovePhoto = () => setPhoto(null);

  const onNext = async () => {
    setSubmitted(true);
    if (!canNext) {
      Alert.alert("Incomplete", "Please complete all required fields to continue.");
      return;
    }
    const payload = {
      serviceType,
      serviceTask,
      date: date?.toISOString(),
      time: time?.toISOString(),
      toolsProvided,
      urgent,
      desc: desc.trim(),
      photo,
    };
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    router.push(NEXT_ROUTE);
  };

  return (
    <View sx={{ flex: 1, bg: C.bg }}>
      {/* Header */}
      <View
        sx={{
          px: PAD,
          pt: 12,
          pb: 16,
          borderBottomWidth: 1,
          borderBottomColor: C.border,
          position: "relative",
          bg: "#fff",
        }}
      >
        <View sx={{ position: "absolute", left: 0, right: 0, top: 10, alignItems: "center" }} pointerEvents="none">
          <Image source={LOGO} sx={{ width: Math.min(width * 0.7, 300), height: 56 }} resizeMode="contain" />
        </View>
        <Pressable onPress={() => router.back()} sx={{ width: 48, height: 48, alignItems: "center", justifyContent: "center" }}>
          <ArrowLeft color={C.text} size={28} strokeWidth={2.4} />
        </Pressable>
      </View>

      {/* STEP STATUS BAR (2/4) */}
      <View sx={{ px: PAD, pt: 16, pb: 14, bg: "#fff" }}>
        <View sx={{ flexDirection: "row", alignItems: "center", mb: 14 }}>
          <Text sx={{ color: C.text, fontWeight: "900", fontSize: 18 }}>Step 2 of 4</Text>
          <Text sx={{ color: C.sub, ml: 12, fontSize: 14 }}>Describe Your Request</Text>
        </View>

        <View sx={{ flexDirection: "row", columnGap: 12 }}>
          {[1, 2, 3, 4].map((i) => (
            <View
              key={i}
              sx={{
                flex: 1,
                height: 10,
                borderRadius: 999,
                bg: i <= 2 ? C.blue : C.track,
              }}
            />
          ))}
        </View>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 140 }} showsVerticalScrollIndicator={false}>
        <View sx={{ px: PAD, pt: 18 }}>
          {/* CARD: Service Request Details */}
          <Card title="Service Request Details" subtitle="Tell us what you need and when.">
            {/* Service Type / Task */}
            <Row>
              <Col>
                <Label>Service Type</Label>
                <SelectBox
                  value={serviceType || "Select Service Type"}
                  onPress={() => {
                    setQType("");
                    setOpenType(true);
                  }}
                  danger={submitted && errors.serviceType}
                />
                {submitted && errors.serviceType ? <Hint text="Please choose a service type." /> : null}
              </Col>
              <Col>
                <Label>Service Task</Label>
                <SelectBox
                  value={serviceTask || "Select Service Task"}
                  disabled={!serviceType}
                  onPress={() => {
                    if (!serviceType) return;
                    setQTask("");
                    setOpenTask(true);
                  }}
                  danger={submitted && errors.serviceTask}
                />
                {submitted && errors.serviceTask ? <Hint text="Please choose a specific task." /> : null}
              </Col>
            </Row>

            {/* Date / Time */}
            <Row>
              <Col>
                <Label>Preferred Date</Label>
                <Pressable onPress={() => setShowDate(true)} sx={{ ...fieldBox, borderColor: submitted && errors.date ? C.bad : C.border }}>
                  <Text sx={{ color: date ? C.text : C.placeholder, fontSize: 16 }}>{date ? formatDate(date) : "dd/mm/yyyy"}</Text>
                  <Calendar color={submitted && errors.date ? C.bad : C.sub} size={20} />
                </Pressable>
                {submitted && errors.date ? <Hint text="Select a date." /> : null}
              </Col>
              <Col>
                <Label>Preferred Time</Label>
                <Pressable onPress={() => setShowTime(true)} sx={{ ...fieldBox, borderColor: submitted && errors.time ? C.bad : C.border }}>
                  <Text sx={{ color: time ? C.text : C.placeholder, fontSize: 16 }}>{time ? formatTime(time) : "--:-- --"}</Text>
                  <Clock color={submitted && errors.time ? C.bad : C.sub} size={20} />
                </Pressable>
                {submitted && errors.time ? <Hint text="Select a time." /> : null}
              </Col>
            </Row>

            {/* Yes/No selects */}
            <Row>
              <Col>
                <Label>Tools Provided?</Label>
                <Segment2 value={toolsProvided} onChange={setToolsProvided} />
                {submitted && errors.toolsProvided ? <Hint text="Pick Yes or No." /> : null}
              </Col>
              <Col>
                <Label>Is the Request Urgent?</Label>
                <Segment2 value={urgent} onChange={setUrgent} />
                {submitted && errors.urgent ? <Hint text="Pick Yes or No." /> : null}
              </Col>
            </Row>

            {/* Description */}
            <View sx={{ mt: GAP }}>
              <Label>Service Description</Label>
              <TextInput
                placeholder="Describe the service you need"
                placeholderTextColor={C.placeholder}
                multiline
                value={desc}
                onChangeText={setDesc}
                sx={{
                  bg: C.fieldBg,
                  borderWidth: 1,
                  borderColor: submitted && errors.desc ? C.bad : C.border,
                  borderRadius: 20,
                  px: 16,
                  py: 16,
                  minHeight: 140,
                  color: C.text,
                  fontSize: 16,
                  textAlignVertical: "top",
                }}
              />
              <Text sx={{ color: C.sub, fontSize: 12, mt: 8 }}>{desc.trim().length}/500</Text>
              {submitted && errors.desc ? <Hint text="Add a short description (at least a few words)." /> : null}
            </View>
          </Card>

          {/* CARD: Upload Image */}
          <Card title="Upload Image" subtitle="Optional: Add a photo to clarify your request.">
            <Pressable
              onPress={pickImage}
              sx={{
                borderWidth: 1,
                borderColor: C.border,
                borderRadius: 20,
                bg: "#fff",
                px: 16,
                py: 14,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                mb: GAP,
              }}
            >
              <Text sx={{ color: C.text, fontWeight: "900", fontSize: 16 }}>Choose Image</Text>
              <Upload color={C.sub} size={20} />
            </Pressable>

            <View
              sx={{
                height: 240,
                borderRadius: 20,
                borderWidth: 1,
                borderColor: C.border,
                bg: "#eef3f9",
                alignItems: "center",
                justifyContent: "center",
                overflow: "hidden",
                position: "relative",
              }}
            >
              {photo ? (
                <>
                  <Image source={{ uri: photo }} sx={{ width: "100%", height: "100%" }} resizeMode="cover" />
                  <Pressable
                    onPress={onRemovePhoto}
                    sx={{
                      position: "absolute",
                      top: 10,
                      right: 10,
                      bg: "#ffffffee",
                      borderRadius: 999,
                      px: 10,
                      py: 8,
                      borderWidth: 1,
                      borderColor: C.border,
                    }}
                  >
                    <View sx={{ flexDirection: "row", alignItems: "center" }}>
                      <XCircle color={C.text} size={18} />
                      <Text sx={{ color: C.text, ml: 8, fontWeight: "800" }}>Remove</Text>
                    </View>
                  </Pressable>
                </>
              ) : (
                <View sx={{ alignItems: "center" }}>
                  <ImageIcon color="#9aa9bc" size={30} />
                  <Text sx={{ color: "#9aa9bc", mt: 8, fontSize: 14 }}>No Image Selected</Text>
                </View>
              )}
            </View>
          </Card>

          <MissingHint errors={errors} submitted={submitted} />
        </View>
      </ScrollView>

      {/* Sticky bottom actions */}
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
        <Pressable
          onPress={() => router.back()}
          sx={{
            flex: 1,
            borderWidth: 1,
            borderColor: C.border,
            borderRadius: 18,
            alignItems: "center",
            justifyContent: "center",
            py: BTN_PY,
            bg: "#fff",
          }}
        >
          <Text sx={{ color: C.text, fontWeight: "900", fontSize: 16 }}>Back : Step 1</Text>
        </Pressable>

        <Pressable
          onPress={onNext}
          sx={{
            flex: 1.25,
            borderRadius: 18,
            alignItems: "center",
            justifyContent: "center",
            py: BTN_PY,
            bg: canNext ? C.blue : "#a7c8ff",
          }}
        >
          <Text sx={{ color: "#fff", fontWeight: "900", fontSize: 16 }}>Next : Service Rate</Text>
        </Pressable>
      </View>

      {/* TYPE SELECT MODAL */}
      <PickerModal
        title="Select Service Type"
        open={openType}
        onClose={() => setOpenType(false)}
        items={filteredTypes}
        query={qType}
        setQuery={setQType}
        onPick={(val) => {
          setServiceType(val);
          setServiceTask(null);
          setOpenType(false);
        }}
        placeholder="Search type…"
      />

      {/* TASK SELECT MODAL */}
      <PickerModal
        title="Select Service Task"
        open={openTask}
        onClose={() => setOpenTask(false)}
        items={filteredTasks}
        query={qTask}
        setQuery={setQTask}
        onPick={(val) => {
          setServiceTask(val);
          setOpenTask(false);
        }}
        placeholder="Search task…"
      />

      {/* DATE / TIME PICKERS */}
      {showDate && (
        <DateTimePicker
          value={date ?? TODAY}
          mode="date"
          display={Platform.OS === "ios" ? "spinner" : "default"}
          minimumDate={TODAY}
          onChange={handleDateChange}
        />
      )}
      {showTime && (
        <DateTimePicker
          value={time ?? new Date()}
          mode="time"
          is24Hour={false}
          display={Platform.OS === "ios" ? "spinner" : "default"}
          onChange={handleTimeChange}
        />
      )}
    </View>
  );
}

/* ---------- helpers & tiny components ---------- */

function Card({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <View
      sx={{
        bg: C.card,
        borderWidth: 1,
        borderColor: C.border,
        borderRadius: 24,
        px: PAD,
        py: 18,
        mb: 22,
        shadowColor: "#000",
        shadowOpacity: Platform.OS === "android" ? 0 : 0.06,
        shadowRadius: 14,
        shadowOffset: { width: 0, height: 6 },
        elevation: 1,
      }}
    >
      <Text sx={{ color: C.text, fontWeight: "900", fontSize: 20 }}>{title}</Text>
      {subtitle ? <Text sx={{ color: C.sub, mt: 6, mb: 14, lineHeight: 20 }}>{subtitle}</Text> : null}
      {children}
    </View>
  );
}

const Row = ({ children }: any) => (
  <View sx={{ flexDirection: "row", flexWrap: "wrap", columnGap: GAP, rowGap: GAP, mb: GAP }}>
    {children}
  </View>
);

// 2-up that gracefully wraps; each item aims for ~48% width
const Col = ({ children }: any) => <View sx={{ flex: 1, minWidth: "48%" }}>{children}</View>;

const Label = ({ children }: any) => (
  <Text sx={{ color: C.text, fontWeight: "800", mb: 10, fontSize: 14 }}>{children}</Text>
);
const Hint = ({ text }: { text: string }) => <Text sx={{ color: C.bad, fontSize: 12, mt: 6 }}>{text}</Text>;

const fieldBox = {
  bg: C.fieldBg,
  borderWidth: 1,
  borderColor: C.border,
  borderRadius: 20,
  px: 16,
  py: 16,
  flexDirection: "row" as const,
  alignItems: "center" as const,
  justifyContent: "space-between" as const,
};

function SelectBox({
  value,
  onPress,
  disabled,
  danger,
}: {
  value: string;
  onPress?: () => void;
  disabled?: boolean;
  danger?: boolean;
}) {
  return (
    <Pressable
      disabled={disabled}
      onPress={onPress}
      sx={{
        ...fieldBox,
        opacity: disabled ? 0.55 : 1,
        borderColor: danger ? C.bad : C.border,
      }}
    >
      <Text sx={{ color: value.startsWith("Select") ? C.placeholder : C.text, fontWeight: "700", fontSize: 16 }}>
        {value}
      </Text>
      <ChevronDown color={danger ? C.bad : C.sub} size={20} />
    </Pressable>
  );
}

function Segment2({
  value,
  onChange,
}: {
  value: boolean | null;
  onChange: (v: boolean) => void;
}) {
  return (
    <View sx={{ flexDirection: "row" }}>
      {[
        { label: "Yes", val: true },
        { label: "No", val: false },
      ].map((o, i) => {
        const active = value === o.val;
        return (
          <Pressable
            key={o.label}
            onPress={() => onChange(o.val)}
            sx={{
              flex: 1,
              py: 14,
              alignItems: "center",
              borderWidth: 1,
              borderColor: active ? C.blue : C.border,
              bg: active ? C.chip : C.fieldBg,
              ...(i === 0
                ? { borderTopLeftRadius: 20, borderBottomLeftRadius: 20 }
                : { borderTopRightRadius: 20, borderBottomRightRadius: 20 }),
            }}
          >
            <Text sx={{ color: active ? C.blue : C.text, fontWeight: "800", fontSize: 16 }}>{o.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

function PickerModal({
  title,
  open,
  onClose,
  items,
  onPick,
  query,
  setQuery,
  placeholder,
}: {
  title: string;
  open: boolean;
  onClose: () => void;
  items: string[];
  onPick: (val: string) => void;
  query: string;
  setQuery: (q: string) => void;
  placeholder: string;
}) {
  return (
    <Modal visible={open} animationType="slide" transparent onRequestClose={onClose}>
      <Pressable onPress={onClose} sx={{ flex: 1, bg: "rgba(0,0,0,0.25)" }}>
        <View
          sx={{
            mt: "auto",
            bg: "#fff",
            borderTopLeftRadius: 26,
            borderTopRightRadius: 26,
            maxHeight: "74%",
            p: 18,
          }}
        >
          <View sx={{ flexDirection: "row", alignItems: "center", mb: 14 }}>
            <Text sx={{ color: C.text, fontWeight: "900", fontSize: 18, flex: 1 }}>{title}</Text>
            <Pressable onPress={onClose}>
              <X color={C.sub} size={22} />
            </Pressable>
          </View>

          {/* Search inside modal */}
          <View
            sx={{
              borderWidth: 1,
              borderColor: C.border,
              borderRadius: 999,
              px: 16,
              height: 44,
              mb: 14,
              bg: "#fff",
              justifyContent: "center",
            }}
          >
            <TextInput
              value={query}
              onChangeText={setQuery}
              placeholder={placeholder}
              placeholderTextColor={C.placeholder}
              sx={{ color: C.text, fontSize: 16 }}
            />
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            {items.length === 0 ? <Text sx={{ color: C.sub, py: 14 }}>No results…</Text> : null}
            {items.map((it) => (
              <Pressable
                key={it}
                onPress={() => onPick(it)}
                sx={{
                  py: 14,
                  borderBottomWidth: 1,
                  borderBottomColor: C.border,
                }}
              >
                <Text sx={{ color: C.text, fontSize: 16 }}>{it}</Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>
      </Pressable>
    </Modal>
  );
}

function MissingHint({ errors, submitted }: { errors: Record<string, boolean>; submitted: boolean }) {
  if (!submitted) return null;
  const missing: string[] = [];
  if (errors.serviceType) missing.push("Service Type");
  if (errors.serviceTask) missing.push("Service Task");
  if (errors.date) missing.push("Preferred Date");
  if (errors.time) missing.push("Preferred Time");
  if (errors.toolsProvided) missing.push("Tools Provided");
  if (errors.urgent) missing.push("Urgent");
  if (errors.desc) missing.push("Description");
  if (missing.length === 0) return null;
  return <Text sx={{ color: C.sub, fontSize: 12, mt: 8 }}>Missing: {missing.join(", ")}</Text>;
}

function formatDate(d: Date) {
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yy = d.getFullYear();
  return `${dd}/${mm}/${yy}`;
}
function formatTime(d: Date) {
  let h = d.getHours();
  const m = String(d.getMinutes()).padStart(2, "0");
  const am = h < 12 ? "AM" : "PM";
  h = h % 12 || 12;
  return `${h}:${m} ${am}`;
}
