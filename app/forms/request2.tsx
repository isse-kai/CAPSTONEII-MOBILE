import AsyncStorage from "@react-native-async-storage/async-storage";
import DateTimePicker, { type DateTimePickerEvent } from "@react-native-community/datetimepicker";
import { Image, Pressable, ScrollView, Text, TextInput, View } from "dripsy";
import * as ImagePicker from "expo-image-picker";
import { useRouter, type Href } from "expo-router";
import { ArrowLeft, Calendar, ChevronDown, Clock, Image as ImageIcon, Upload, X } from "lucide-react-native";
import { useEffect, useMemo, useState } from "react";
import { Alert, Dimensions, Modal, Platform } from "react-native";

const { width } = Dimensions.get("window");
const LOGO = require("../../assets/jdklogo.png");

const C = {
  bg: "#ffffff",
  text: "#0f172a",
  sub: "#475569",
  blue: "#1e86ff",
  blueDark: "#0c62c9",
  border: "#d9e3f0",
  fieldBg: "#f8fafc",
  placeholder: "#93a3b5",
};

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

  // select modals
  const [openType, setOpenType] = useState(false);
  const [openTask, setOpenTask] = useState(false);

  // ----- HYDRATE FROM STORAGE ON MOUNT -----
  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (!raw) return;
        const v = JSON.parse(raw);
        setServiceType(v.serviceType ?? null);
        setServiceTask(v.serviceTask ?? null);
        setDate(v.date ? new Date(v.date) : null);
        setTime(v.time ? new Date(v.time) : null);
        setToolsProvided(typeof v.toolsProvided === "boolean" ? v.toolsProvided : null);
        setUrgent(typeof v.urgent === "boolean" ? v.urgent : null);
        setDesc(v.desc ?? "");
        setPhoto(v.photo ?? null);
      } catch {}
    })();
  }, []);

  // ----- AUTO-SAVE DRAFT (DEBOUNCED) -----
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
    }, 400);
    return () => clearTimeout(id);
  }, [serviceType, serviceTask, date, time, toolsProvided, urgent, desc, photo]);

  const tasksForType = useMemo(() => (serviceType ? TASKS[serviceType] || [] : []), [serviceType]);

  // --- validation & "Next" gating ---
  const errors = useMemo(
    () => ({
      serviceType: !serviceType,
      serviceTask: !serviceTask,
      date: !date,
      time: !time,
      toolsProvided: toolsProvided === null,
      urgent: urgent === null,
      desc: desc.trim().length < 3, // a bit more forgiving
    }),
    [serviceType, serviceTask, date, time, toolsProvided, urgent, desc]
  );

  const canNext = useMemo(() => Object.values(errors).every((v) => !v), [errors]);

  // Date/Time handlers
  const handleDateChange = (_ev: DateTimePickerEvent, selected?: Date) => {
    setShowDate(false);
    if (selected) setDate(selected);
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
      quality: 0.85,
      aspect: [4, 3],
      allowsEditing: true,
    });
    if (!res.canceled) setPhoto(res.assets[0].uri);
  };

  const onNext = async () => {
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
      {/* Header: Back (left) + big centered logo */}
      <View
        sx={{
          px: 12,
          pt: 6,
          pb: 10,
          borderBottomWidth: 1,
          borderBottomColor: "#eef2f7",
          position: "relative",
        }}
      >
        <View sx={{ position: "absolute", left: 0, right: 0, top: 4, alignItems: "center" }} pointerEvents="none">
          <Image source={LOGO} sx={{ width: Math.min(width * 0.78, 340), height: 66 }} resizeMode="contain" />
        </View>

        <Pressable onPress={() => router.back()} sx={{ width: 40, height: 40, alignItems: "center", justifyContent: "center" }}>
          <ArrowLeft color={C.text} size={26} strokeWidth={2.4} />
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 96 }} showsVerticalScrollIndicator={false}>
        <View sx={{ px: 14, pt: 12 }}>
          <Text sx={{ color: C.sub, fontSize: 12, mb: 6 }}>2 of 4 | Post a Service Request</Text>
          <Text sx={{ color: C.text, fontSize: 24, fontWeight: "900", mb: 14 }}>Step 2: Describe Your Request</Text>

          <Text sx={{ color: C.text, fontSize: 18, fontWeight: "800" }}>Service Request Details</Text>
          <Text sx={{ color: C.sub, mt: 4, mb: 12 }}>Please fill in the service request details to proceed.</Text>

          {/* Service Type / Task */}
          <Row>
            <Col>
              <Label>Service Type</Label>
              <SelectBox value={serviceType || "Select Service Type"} onPress={() => setOpenType(true)} />
            </Col>
            <Col>
              <Label>Service Task</Label>
              <SelectBox
                value={serviceTask || "Select Service Task"}
                disabled={!serviceType}
                onPress={() => serviceType && setOpenTask(true)}
              />
            </Col>
          </Row>

          {/* Date / Time */}
          <Row>
            <Col>
              <Label>Preferred Date</Label>
              <Pressable onPress={() => setShowDate(true)} sx={fieldBox}>
                <Text sx={{ color: date ? C.text : C.placeholder }}>{date ? formatDate(date) : "dd/mm/yyyy"}</Text>
                <Calendar color={C.sub} size={18} />
              </Pressable>
            </Col>
            <Col>
              <Label>Preferred Time</Label>
              <Pressable onPress={() => setShowTime(true)} sx={fieldBox}>
                <Text sx={{ color: time ? C.text : C.placeholder }}>{time ? formatTime(time) : "--:-- --"}</Text>
                <Clock color={C.sub} size={18} />
              </Pressable>
            </Col>
          </Row>

          {/* Yes/No selects */}
          <Row>
            <Col>
              <Label>Tools Provided?</Label>
              <Segment2 value={toolsProvided} onChange={setToolsProvided} />
            </Col>
            <Col>
              <Label>Is the Request Urgent?</Label>
              <Segment2 value={urgent} onChange={setUrgent} />
            </Col>
          </Row>

          {/* Description */}
          <View sx={{ mt: 12 }}>
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
                borderColor: C.border,
                borderRadius: 10,
                px: 12,
                py: 12,
                minHeight: 110,
                color: C.text,
                textAlignVertical: "top",
              }}
            />
          </View>

          {/* Upload Image */}
          <View sx={{ mt: 22 }}>
            <Text sx={{ color: C.text, fontSize: 18, fontWeight: "800" }}>Upload Image</Text>
            <Text sx={{ color: C.sub, mt: 4, mb: 12 }}>
              Upload an image to help describe the service request or what you need done.
            </Text>

            <Pressable
              onPress={pickImage}
              sx={{
                borderWidth: 1,
                borderColor: C.border,
                borderRadius: 10,
                bg: "#fff",
                px: 12,
                py: 10,
                alignSelf: "stretch",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                mb: 12,
              }}
            >
              <Text sx={{ color: C.text, fontWeight: "700" }}>Choose Image</Text>
              <Upload color={C.sub} size={18} />
            </Pressable>

            <View
              sx={{
                height: 200,
                borderRadius: 12,
                borderWidth: 1,
                borderColor: C.border,
                bg: "#e9edf3",
                alignItems: "center",
                justifyContent: "center",
                overflow: "hidden",
              }}
            >
              {photo ? (
                <Image source={{ uri: photo }} sx={{ width: "100%", height: "100%" }} resizeMode="cover" />
              ) : (
                <View sx={{ alignItems: "center" }}>
                  <ImageIcon color="#9aa9bc" size={28} />
                  <Text sx={{ color: "#9aa9bc", mt: 6 }}>No Image Selected</Text>
                </View>
              )}
            </View>
          </View>

          {/* What's missing (if any) */}
          <MissingHint errors={errors} />
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
          borderTopColor: "#eef2f7",
          p: 12,
          flexDirection: "row",
          gap: 10,
        }}
      >
        <Pressable
          onPress={() => router.back()}
          sx={{
            flex: 1,
            borderWidth: 1,
            borderColor: C.border,
            borderRadius: 12,
            alignItems: "center",
            justifyContent: "center",
            py: 12,
          }}
        >
          <Text sx={{ color: C.text, fontWeight: "800" }}>Back : Step 1</Text>
        </Pressable>

        <Pressable
          disabled={!canNext}
          onPress={onNext}
          sx={{
            flex: 1.3,
            borderRadius: 12,
            alignItems: "center",
            justifyContent: "center",
            py: 12,
            bg: !canNext ? "#a7c8ff" : C.blue,
          }}
        >
          <Text sx={{ color: "#fff", fontWeight: "800" }}>Next : Service Rate</Text>
        </Pressable>
      </View>

      {/* TYPE SELECT MODAL */}
      <PickerModal
        title="Select Service Type"
        open={openType}
        onClose={() => setOpenType(false)}
        items={SERVICE_TYPES}
        onPick={(val) => {
          setServiceType(val);
          setServiceTask(null);
          setOpenType(false);
        }}
      />

      {/* TASK SELECT MODAL */}
      <PickerModal
        title="Select Service Task"
        open={openTask}
        onClose={() => setOpenTask(false)}
        items={tasksForType}
        onPick={(val) => {
          setServiceTask(val);
          setOpenTask(false);
        }}
      />

      {/* DATE / TIME PICKERS */}
      {showDate && (
        <DateTimePicker
          value={date ?? new Date()}
          mode="date"
          display={Platform.OS === "ios" ? "spinner" : "default"}
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

const Row = ({ children }: any) => <View sx={{ flexDirection: "row", gap: 10, mb: 12 }}>{children}</View>;
const Col = ({ children }: any) => <View sx={{ flex: 1 }}>{children}</View>;
const Label = ({ children }: any) => <Text sx={{ color: C.text, fontWeight: "700", mb: 6 }}>{children}</Text>;

const fieldBox = {
  bg: C.fieldBg,
  borderWidth: 1,
  borderColor: C.border,
  borderRadius: 10,
  px: 12,
  py: 12,
  flexDirection: "row" as const,
  alignItems: "center" as const,
  justifyContent: "space-between" as const,
};

function SelectBox({
  value,
  onPress,
  disabled,
}: {
  value: string;
  onPress?: () => void;
  disabled?: boolean;
}) {
  return (
    <Pressable disabled={disabled} onPress={onPress} sx={{ ...fieldBox, opacity: disabled ? 0.6 : 1 }}>
      <Text sx={{ color: value.startsWith("Select") ? C.placeholder : C.text }}>{value}</Text>
      <ChevronDown color={C.sub} size={18} />
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
              py: 10,
              alignItems: "center",
              borderWidth: 1,
              borderColor: active ? C.blue : C.border,
              bg: active ? "#eaf4ff" : C.fieldBg,
              ...(i === 0
                ? { borderTopLeftRadius: 10, borderBottomLeftRadius: 10 }
                : { borderTopRightRadius: 10, borderBottomRightRadius: 10 }),
            }}
          >
            <Text sx={{ color: active ? C.blue : C.text, fontWeight: "700" }}>{o.label}</Text>
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
}: {
  title: string;
  open: boolean;
  onClose: () => void;
  items: string[];
  onPick: (val: string) => void;
}) {
  return (
    <Modal visible={open} animationType="slide" transparent onRequestClose={onClose}>
      <Pressable onPress={onClose} sx={{ flex: 1, bg: "rgba(0,0,0,0.25)" }}>
        <View
          sx={{
            mt: "auto",
            bg: "#fff",
            borderTopLeftRadius: 16,
            borderTopRightRadius: 16,
            maxHeight: "70%",
            p: 14,
          }}
        >
          <View sx={{ flexDirection: "row", alignItems: "center", mb: 10 }}>
            <Text sx={{ color: C.text, fontWeight: "800", fontSize: 16, flex: 1 }}>{title}</Text>
            <Pressable onPress={onClose}>
              <X color={C.sub} size={20} />
            </Pressable>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            {items.map((it) => (
              <Pressable
                key={it}
                onPress={() => onPick(it)}
                sx={{ py: 12, borderBottomWidth: 1, borderBottomColor: "#eef2f7" }}
              >
                <Text sx={{ color: C.text }}>{it}</Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>
      </Pressable>
    </Modal>
  );
}

function MissingHint({ errors }: { errors: Record<string, boolean> }) {
  const missing: string[] = [];
  if (errors.serviceType) missing.push("Service Type");
  if (errors.serviceTask) missing.push("Service Task");
  if (errors.date) missing.push("Preferred Date");
  if (errors.time) missing.push("Preferred Time");
  if (errors.toolsProvided) missing.push("Tools Provided");
  if (errors.urgent) missing.push("Urgent");
  if (errors.desc) missing.push("Description");
  if (missing.length === 0) return null;
  return <Text sx={{ color: C.sub, fontSize: 12, mt: 10 }}>Missing: {missing.join(", ")}</Text>;
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
