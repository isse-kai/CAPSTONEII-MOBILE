// app/forms/requestpreview.tsx  (Step 4: Review & Submit)
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Image, Pressable, ScrollView, Text, View } from "dripsy";
import { useRouter, type Href } from "expo-router";
import {
    ArrowLeft,
    Banknote,
    Calendar,
    CheckCircle2,
    ChevronRight,
    Clock,
    Image as ImageIcon,
    Info,
    Mail,
    MapPin,
    Pencil,
    Phone,
    Wrench,
} from "lucide-react-native";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import { Dimensions, Modal, Platform } from "react-native";

const { width } = Dimensions.get("window");
const LOGO = require("../../../assets/jdklogo.png");

/* ---------- Theme ---------- */
const C = {
  bg: "#f7f9fc",
  text: "#0f172a",
  sub: "#64748b",
  blue: "#1e86ff",
  blueDark: "#0c62c9",
  border: "#e6eef7",
  chip: "#eaf4ff",
  card: "#fff",
  muted: "#64748b",
  track: "#e9f0fb",
  good: "#16a34a",
};

const PAD = 20;
const GAP = 16;
const BTN_PY = 16;

/* ---------- Storage Keys & Routes ---------- */
const STEP1_KEY = "request_step1";
const STEP2_KEY = "request_step2";
const STEP3_KEY = "request_step3";
const MERGED_KEY = "request_full";
const CONFIRM_ROUTE = "../home" as Href;

// // Edit shortcuts
// const EDIT_STEP1 = "./clientforms/request" as Href;
// const EDIT_STEP2 = "./clientforms/request2" as Href;
// const EDIT_STEP3 = "./clientforms/request3" as Href;

/* ---------- Types ---------- */
type Step1 = {
  first?: string;
  last?: string;
  phone?: string;
  email?: string;
  brgy?: string | null;
  street?: string;
  addr?: string;
  photo?: string | null;
};
type Step2 = {
  serviceType?: string | null;
  serviceTask?: string | null;
  date?: string | null;
  time?: string | null;
  toolsProvided?: boolean | null;
  urgent?: boolean | null;
  desc?: string;
  photo?: string | null;
};
type Step3 = {
  rateType?: "hour" | "job" | null;
  hourFrom?: string;
  hourTo?: string;
  jobFixed?: string;
};

/* ---------- Screen ---------- */
export default function ReviewSubmit() {
  const router = useRouter();
  const [p1, setP1] = useState<Step1 | null>(null);
  const [p2, setP2] = useState<Step2 | null>(null);
  const [p3, setP3] = useState<Step3 | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  
  // Centralized edit routes
  const EDIT_ROUTES: Record<number, Href> = {
    1: "./clientforms/request" as Href,
    2: "./clientforms/request2" as Href,
    3: "./clientforms/request3" as Href,
  };

  // Dynamic shortcut function
  function editStep(step: number) {
    const route = EDIT_ROUTES[step];
    if (route) {
      router.push(route);
    } else {
      console.warn("Unknown step:", step);
    }
  }

  useEffect(() => {
    (async () => {
      try {
        const [s1, s2, s3] = await Promise.all([
          AsyncStorage.getItem(STEP1_KEY),
          AsyncStorage.getItem(STEP2_KEY),
          AsyncStorage.getItem(STEP3_KEY),
        ]);
        if (s1) setP1(JSON.parse(s1));
        if (s2) setP2(JSON.parse(s2));
        if (s3) setP3(JSON.parse(s3));
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const addressLine = useMemo(() => {
    const street = p1?.street?.trim();
    const brgy = p1?.brgy?.toString().trim();
    if (street && brgy) return `${street}, ${brgy}`;
    return street || brgy || "—";
  }, [p1]);

  const scheduleLine = useMemo(() => formatSchedule(p2?.date, p2?.time), [p2?.date, p2?.time]);

  const rateLine = useMemo(() => {
    if (!p3?.rateType) return "—";
    if (p3.rateType === "hour") {
      const f = money(p3.hourFrom);
      const t = money(p3.hourTo);
      if (f && t) return `₱${f} – ₱${t} / hr`;
      if (f) return `₱${f} / hr`;
      if (t) return `Up to ₱${t} / hr`;
      return "—";
    }
    const j = money(p3.jobFixed);
    return j ? `₱${j}` : "—";
  }, [p3]);

  const rateTypeText = useMemo(() => {
    if (p3?.rateType === "hour") return "By the Hour";
    if (p3?.rateType === "job") return "By the Job";
    return "—";
  }, [p3]);

  const onConfirm = async () => {
    const merged = { step1: p1, step2: p2, step3: p3, createdAt: new Date().toISOString() };
    await AsyncStorage.setItem(MERGED_KEY, JSON.stringify(merged));
    setSubmitted(true);
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

      {/* STEP STATUS BAR (4/4) */}
      <View sx={{ px: PAD, pt: 16, pb: 14, bg: "#fff" }}>
        <View sx={{ flexDirection: "row", alignItems: "center", mb: 14 }}>
          <Text sx={{ color: C.text, fontWeight: "900", fontSize: 18 }}>Step 4 of 4</Text>
          <Text sx={{ color: C.sub, ml: 12, fontSize: 14 }}>Review & Submit</Text>
        </View>
        <View sx={{ flexDirection: "row", columnGap: 12 }}>
          {[1, 2, 3, 4].map((i) => (
            <View key={i} sx={{ flex: 1, height: 10, borderRadius: 999, bg: C.blue }} />
          ))}
        </View>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 140 }} showsVerticalScrollIndicator={false}>
        <View sx={{ px: PAD, pt: 18 }}>
          {/* Overview Banner */}
          <InfoBanner text="Review each section carefully. Tap the pencil to make changes instantly." />

          {/* Personal Information */}
            <Card
                title="Personal Information"
                actionLabel="Edit"
                onAction={() => editStep(1)}
                loading={loading}
            >
            <View sx={{ flexDirection: "row", alignItems: "center", mb: GAP }}>
              <Avatar uri={p1?.photo} />
              <View sx={{ ml: 12, flex: 1 }}>
                <Text sx={{ color: C.text, fontWeight: "900", fontSize: 16 }}>
                  {fullName(p1?.first, p1?.last) || "—"}
                </Text>
                <Text sx={{ color: C.sub }}>{addressLine}</Text>
              </View>
            </View>

            <List>
              <Row icon={<Phone color={C.sub} size={18} />} label="Phone" value={p1?.phone || "—"} />
              <Row icon={<Mail color={C.sub} size={18} />} label="Email" value={p1?.email || "—"} />
              <Row icon={<MapPin color={C.sub} size={18} />} label="Full Address" value={`${addressLine}${p1?.addr ? ` • ${p1.addr}` : ""}`} />
            </List>
          </Card>

          {/* Request Details */}
            <Card
                title="Service Request Details"
                actionLabel="Edit"
                onAction={() => editStep(2)}
                loading={loading}
            >
            <List>
              <Row icon={<Wrench color={C.sub} size={18} />} label="Service" value={serviceLine(p2?.serviceType, p2?.serviceTask)} highlight />
              <Row icon={<Calendar color={C.sub} size={18} />} label="Preferred Date" value={p2?.date ? isoDate(p2.date) : "—"} />
              <Row icon={<Clock color={C.sub} size={18} />} label="Preferred Time" value={p2?.time ? isoTime(p2.time) : "—"} />
              <Row icon={<Info color={C.sub} size={18} />} label="Tools Provided" value={yn(p2?.toolsProvided)} />
              <Row icon={<Info color={C.sub} size={18} />} label="Urgent" value={yn(p2?.urgent)} />
            </List>

            {p2?.desc ? (
              <View sx={{ mt: GAP }}>
                <Text sx={{ color: C.sub, fontSize: 12, mb: 6 }}>Notes</Text>
                <Text
                  sx={{
                    color: C.text,
                    lineHeight: 22,
                    bg: "#f8fafc",
                    borderWidth: 1,
                    borderColor: C.border,
                    borderRadius: 14,
                    px: 14,
                    py: 12,
                  }}
                >
                  {p2.desc}
                </Text>
              </View>
            ) : null}

            {/* Attachment preview */}
            <View sx={{ mt: GAP }}>
              <Text sx={{ color: C.sub, fontSize: 12, mb: 6 }}>Attachment</Text>
              <Attachment uri={p2?.photo} />
            </View>
          </Card>

          {/* Rate */}
            <Card
                title="Service Rate"
                actionLabel="Edit"
                onAction={() => editStep(3)}
                loading={loading}
            >
            <List>
              <Row icon={<Banknote color={C.sub} size={18} />} label="Rate Type" value={rateTypeText} />
              <Row icon={<Banknote color={C.sub} size={18} />} label="Quoted Rate" value={rateLine} highlight />
              <Row
                icon={<Info color={C.sub} size={18} />}
                label="Reminder"
                value="Final amount can be agreed with the provider after job review."
              />
            </List>
          </Card>

          {/* Final Check */}
          <ReadyCard ok={isReady(p1, p2, p3)} schedule={scheduleLine} />
        </View>
      </ScrollView>

      {/* Sticky Actions */}
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
          <Text sx={{ color: C.text, fontWeight: "900", fontSize: 16 }}>Back : Step 3</Text>
        </Pressable>

        <Pressable
          onPress={onConfirm}
          sx={{
            flex: 1.25,
            borderRadius: 18,
            alignItems: "center",
            justifyContent: "center",
            py: BTN_PY,
            bg: C.blue,
          }}
        >
          <Text sx={{ color: "#fff", fontWeight: "900", fontSize: 16 }}>Confirm & Submit</Text>
        </Pressable>
      </View>

      {/* Success Modal */}
      <Modal visible={submitted} animationType="fade" transparent onRequestClose={() => setSubmitted(false)}>
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.35)",
            alignItems: "center",
            justifyContent: "center",
            padding: 16,
          }}
        >
          <View
            style={{
              width: "88%",
              backgroundColor: "#fff",
              borderRadius: 20,
              borderWidth: 2,
              borderColor: C.blue,
              paddingVertical: 22,
              paddingHorizontal: 18,
              alignItems: "center",
            }}
          >
            <View
              style={{
                width: 96,
                height: 96,
                borderRadius: 48,
                borderWidth: 2,
                borderColor: "#cfe1ff",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 12,
                backgroundColor: C.chip,
              }}
            >
              <CheckCircle2 color={C.blue} size={48} />
            </View>

            <Text sx={{ color: C.text, fontWeight: "900", fontSize: 18, mb: 8, textAlign: "center" }}>
              Request Submitted!
            </Text>
            <Text sx={{ color: C.sub, textAlign: "center", lineHeight: 20, mb: 16 }}>
              You’ll receive a notification once an admin reviews your request.
            </Text>

            <Pressable
              onPress={() => {
                setSubmitted(false);
                router.replace(CONFIRM_ROUTE);
              }}
              sx={{ bg: C.blue, borderRadius: 12, px: 16, py: 14, alignSelf: "stretch" }}
            >
              <Text sx={{ color: "#fff", fontWeight: "900", textAlign: "center" }}>Go to Dashboard</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}

/* ---------- UI Bits ---------- */

function Card({
  title,
  children,
  actionLabel,
  onAction,
  loading,
}: {
  title: string;
  children: ReactNode;
  actionLabel?: string;
  onAction?: () => void;
  loading?: boolean;
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
      <View sx={{ flexDirection: "row", alignItems: "center", mb: 14 }}>
        <Text sx={{ color: C.text, fontWeight: "900", fontSize: 20, flex: 1 }}>{title}</Text>
        {actionLabel && onAction ? (
          <Pressable
            onPress={onAction}
            sx={{
              flexDirection: "row",
              alignItems: "center",
              px: 12,
              py: 8,
              bg: C.chip,
              borderRadius: 999,
              borderWidth: 1,
              borderColor: C.border,
            }}
          >
            <Pencil color={C.blue} size={16} />
            <Text sx={{ color: C.blue, fontWeight: "800", ml: 6 }}>{actionLabel}</Text>
          </Pressable>
        ) : null}
      </View>
      {loading ? <Text sx={{ color: C.sub }}>Loading…</Text> : children}
    </View>
  );
}

function InfoBanner({ text }: { text: string }) {
  return (
    <View
      sx={{
        borderWidth: 1,
        borderColor: C.border,
        bg: "#f5f9ff",
        borderRadius: 16,
        px: 14,
        py: 12,
        mb: 18,
        flexDirection: "row",
        alignItems: "flex-start",
      }}
    >
      <Info color={C.blue} size={18} />
      <Text sx={{ color: C.text, ml: 10, lineHeight: 20, flex: 1 }}>{text}</Text>
    </View>
  );
}

function Avatar({ uri }: { uri?: string | null }) {
  return (
    <View
      sx={{
        width: 56,
        height: 56,
        borderRadius: 28,
        borderWidth: 1,
        borderColor: C.border,
        bg: "#f1f5f9",
        overflow: "hidden",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {uri ? (
        <Image source={{ uri }} sx={{ width: "100%", height: "100%" }} />
      ) : (
        <Text sx={{ color: C.sub, fontSize: 12 }}>No Photo</Text>
      )}
    </View>
  );
}

function List({ children }: { children: ReactNode }) {
  return (
    <View
      sx={{
        borderWidth: 1,
        borderColor: C.border,
        borderRadius: 16,
        overflow: "hidden",
      }}
    >
      {children}
    </View>
  );
}

function Row({
  icon,
  label,
  value,
  highlight,
}: {
  icon: ReactNode;
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <View
      sx={{
        flexDirection: "row",
        alignItems: "center",
        px: 14,
        py: 12,
        bg: "#fff",
        borderBottomWidth: 1,
        borderBottomColor: C.border,
      }}
    >
      <View sx={{ width: 22, alignItems: "center", mr: 10 }}>{icon}</View>
      <Text sx={{ color: C.sub, width: 120, fontSize: 12 }}>{label}</Text>
      <Text
        sx={{
          color: highlight ? C.blue : C.text,
          fontWeight: highlight ? "900" : "700",
          flex: 1,
        }}
        numberOfLines={2}
      >
        {value || "—"}
      </Text>
    </View>
  );
}

function Attachment({ uri }: { uri?: string | null }) {
  return (
    <View
      sx={{
        height: 160,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: C.border,
        bg: "#eef3f9",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
      }}
    >
      {uri ? (
        <Image source={{ uri }} sx={{ width: "100%", height: "100%" }} resizeMode="cover" />
      ) : (
        <View sx={{ alignItems: "center" }}>
          <ImageIcon color="#9aa9bc" size={28} />
          <Text sx={{ color: "#9aa9bc", mt: 6 }}>No Attachment</Text>
        </View>
      )}
    </View>
  );
}

function ReadyCard({ ok, schedule }: { ok: boolean; schedule: string }) {
  return (
    <View
      sx={{
        borderWidth: 1,
        borderColor: ok ? "#d1fae5" : C.border,
        bg: ok ? "#ecfdf5" : "#fff",
        borderRadius: 16,
        px: 14,
        py: 14,
        flexDirection: "row",
        alignItems: "center",
        mb: 22,
      }}
    >
      <CheckCircle2 color={ok ? C.good : C.sub} size={22} />
      <View sx={{ ml: 12, flex: 1 }}>
        <Text sx={{ color: C.text, fontWeight: "900" }}>
          {ok ? "Everything looks ready" : "Double-check your details"}
        </Text>
        <Text sx={{ color: C.sub, mt: 4 }}>
          Preferred schedule: {schedule || "—"}
        </Text>
      </View>
      <ChevronRight color={C.sub} size={18} />
    </View>
  );
}

/* ---------- Helpers ---------- */
function fullName(first?: string, last?: string) {
  const f = first?.trim() || "";
  const l = last?.trim() || "";
  return [f, l].filter(Boolean).join(" ");
}
function isoDate(iso?: string | null) {
  if (!iso) return "—";
  const d = new Date(iso);
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}
function isoTime(iso?: string | null) {
  if (!iso) return "—";
  const d = new Date(iso);
  let h = d.getHours();
  const m = String(d.getMinutes()).padStart(2, "0");
  const am = h < 12 ? "AM" : "PM";
  h = h % 12 || 12;
  return `${h}:${m} ${am}`;
}
function formatSchedule(dateISO?: string | null, timeISO?: string | null) {
  if (!dateISO && !timeISO) return "—";
  const d = dateISO ? isoDate(dateISO) : "";
  const t = timeISO ? isoTime(timeISO) : "";
  return `${d}${d && t ? " • " : ""}${t}`;
}
function money(s?: string | null) {
  if (!s) return "";
  const n = Number(s);
  if (Number.isNaN(n)) return s || "";
  return n.toLocaleString("en-PH", { minimumFractionDigits: 0, maximumFractionDigits: 2 });
}
function yn(v?: boolean | null) {
  if (v === true) return "Yes";
  if (v === false) return "No";
  return "—";
}
function serviceLine(type?: string | null, task?: string | null) {
  if (!type && !task) return "—";
  return [type, task].filter(Boolean).join(" — ");
}

/** NEW: readiness check to drive the ReadyCard */
function isReady(p1?: Step1 | null, p2?: Step2 | null, p3?: Step3 | null) {
  if (!p1 || !p2 || !p3) return false;
  // Basic presence checks (mirror earlier steps' validations roughly)
  const s1Ok =
    !!p1.first?.trim() &&
    !!p1.last?.trim() &&
    !!p1.phone?.trim() &&
    !!p1.email?.trim() &&
    !!p1.brgy &&
    !!p1.street?.trim() &&
    !!p1.addr?.trim();

  const s2Ok =
    !!p2.serviceType &&
    !!p2.serviceTask &&
    !!p2.date &&
    !!p2.time &&
    !!p2.desc?.trim();

  const s3Ok =
    (p3.rateType === "hour" && !!p3.hourFrom && !!p3.hourTo) ||
    (p3.rateType === "job" && !!p3.jobFixed);

  return s1Ok && s2Ok && s3Ok;
}