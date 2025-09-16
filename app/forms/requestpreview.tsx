import AsyncStorage from "@react-native-async-storage/async-storage";
import { Image, Pressable, ScrollView, Text, View } from "dripsy";
import { useRouter, type Href } from "expo-router";
import { ArrowLeft } from "lucide-react-native";
import { useEffect, useMemo, useState } from "react";
import { Dimensions, Modal, Platform } from "react-native";

const { width } = Dimensions.get("window");
const LOGO = require("../../assets/jdklogo.png");

const C = {
  bg: "#ffffff",
  text: "#0f172a",
  sub: "#475569",
  blue: "#1e86ff",
  border: "#e6eef7",
  chip: "#eaf4ff",
  card: "#fff",
  muted: "#64748b",
};

const STEP1_KEY = "request_step1";
const STEP2_KEY = "request_step2";
const STEP3_KEY = "request_step3";
const MERGED_KEY = "request_full";
const CONFIRM_ROUTE = "/home/home" as Href;

type Step1 = {
  first?: string;
  last?: string;
  phone?: string;
  email?: string;
  brgy?: string | null;
  street?: string;
  addr?: string;
  fb?: string;
  ig?: string;
  li?: string;
  photo?: string | null;
};
type Step2 = {
  serviceType?: string | null;
  serviceTask?: string | null;
  date?: string | null; // ISO
  time?: string | null; // ISO
  toolsProvided?: boolean | null;
  urgent?: boolean | null;
  desc?: string;
  photo?: string | null; // kept in payload
};
type Step3 = {
  rateType?: "hour" | "job" | null;
  hourFrom?: string;
  hourTo?: string;
  jobFixed?: string;
};

export default function ReviewSubmit() {
  const router = useRouter();
  const [p1, setP1] = useState<Step1 | null>(null);
  const [p2, setP2] = useState<Step2 | null>(null);
  const [p3, setP3] = useState<Step3 | null>(null);
  const [loading, setLoading] = useState(true);

  // success modal
  const [submitted, setSubmitted] = useState(false);

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
    setSubmitted(true); // show popup instead of navigating immediately
  };

  return (
    <View sx={{ flex: 1, bg: C.bg }}>
      {/* Header with Back + centered logo */}
      <View
        sx={{
          px: 16,
          pt: 8,
          pb: 12,
          borderBottomWidth: 1,
          borderBottomColor: C.border,
          position: "relative",
          bg: "#fff",
        }}
      >
        <View sx={{ position: "absolute", left: 0, right: 0, top: 6, alignItems: "center" }} pointerEvents="none">
          <Image source={LOGO} sx={{ width: Math.min(width * 0.78, 340), height: 66 }} resizeMode="contain" />
        </View>
        <Pressable
          onPress={() => router.back()}
          sx={{ width: 44, height: 44, alignItems: "center", justifyContent: "center" }}
        >
          <ArrowLeft color={C.text} size={26} strokeWidth={2.4} />
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 108 }}>
        <View sx={{ px: 16, pt: 14 }}>
          <Text sx={{ color: C.sub, fontSize: 12, mb: 6 }}>4 of 4 | Post a Service Request</Text>
          <Text sx={{ color: C.text, fontSize: 26, fontWeight: "900", mb: 16 }}>Review & Submit</Text>

          {/* PERSONAL INFO */}
          <Card title="Personal Information" loading={loading}>
            <View sx={{ alignItems: "center", mb: 16 }}>
              <View
                sx={{
                  width: 110,
                  height: 110,
                  borderRadius: 110 / 2,
                  borderWidth: 1,
                  borderColor: C.border,
                  bg: "#f1f5f9",
                  overflow: "hidden",
                  shadowColor: "#000",
                  shadowOpacity: Platform.OS === "android" ? 0 : 0.12,
                  shadowRadius: 10,
                  shadowOffset: { width: 0, height: 6 },
                  elevation: 2,
                }}
              >
                {p1?.photo ? (
                  <Image source={{ uri: p1.photo }} sx={{ width: "100%", height: "100%" }} />
                ) : (
                  <View sx={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
                    <Text sx={{ color: C.muted }}>No Photo</Text>
                  </View>
                )}
              </View>
            </View>

            <TwoCol>
              <KV label="First Name" value={p1?.first} />
              <KV label="Last Name" value={p1?.last} />
              <KV label="Contact Number" value={p1?.phone} />
              <KV label="Email" value={p1?.email} />
              <KV label="Address" value={addressLine} />
              <KV label="Additional Address" value={p1?.addr} />
            </TwoCol>
          </Card>

          <Card title="Social Media">
            <TwoCol>
              <KV label="Facebook" value={p1?.fb} highlight />
              <KV label="Instagram" value={p1?.ig} highlight />
              <KV label="LinkedIn" value={p1?.li} highlight />
            </TwoCol>
          </Card>

          {/* REQUEST DETAILS */}
          <Card title="Service Request Details" loading={loading}>
            <TwoCol>
              <KV label="Service Type" value={p2?.serviceType} highlight />
              <KV label="Service Task" value={p2?.serviceTask} highlight />
              <KV label="Preferred Date" value={p2?.date ? isoDate(p2.date) : undefined} />
              <KV label="Preferred Time" value={p2?.time ? isoTime(p2.time) : undefined} />
              <KV label="Tools Provided" value={yn(p2?.toolsProvided)} />
              <KV label="Urgent" value={yn(p2?.urgent)} />
            </TwoCol>
            <Divider />
            <KVBlock label="Description" value={p2?.desc} />
          </Card>

          {/* RATE */}
          <Card title="Service Rate">
            <TwoCol>
              <KV label="Rate Type" value={rateTypeText} />
              <KV label="Rate" value={rateLine} />
            </TwoCol>
          </Card>
        </View>
      </ScrollView>

      {/* Sticky actions */}
      <View
        sx={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          bg: "#fff",
          borderTopWidth: 1,
          borderTopColor: C.border,
          px: 16,
          py: 12,
          flexDirection: "row",
          gap: 12,
        }}
      >
        <Pressable
          onPress={() => router.back()}
          sx={{
            flex: 1,
            borderWidth: 1,
            borderColor: C.border,
            borderRadius: 14,
            alignItems: "center",
            justifyContent: "center",
            py: 13,
          }}
        >
          <Text sx={{ color: C.text, fontWeight: "800" }}>Back : Step 3</Text>
        </Pressable>

        <Pressable
          onPress={onConfirm}
          sx={{
            flex: 1.3,
            borderRadius: 14,
            alignItems: "center",
            justifyContent: "center",
            py: 13,
            bg: C.blue,
            shadowColor: C.blue,
            shadowOpacity: Platform.OS === "android" ? 0 : 0.22,
            shadowRadius: 10,
            shadowOffset: { width: 0, height: 6 },
            elevation: 3,
          }}
        >
          <Text sx={{ color: "#fff", fontWeight: "800" }}>Confirm Service Request</Text>
        </Pressable>
      </View>

      {/* SUCCESS POPUP */}
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
              borderRadius: 18,
              borderWidth: 2,
              borderColor: C.blue,
              paddingVertical: 20,
              paddingHorizontal: 16,
              alignItems: "center",
            }}
          >
            {/* circular logo */}
            <View
              style={{
                width: 96,
                height: 96,
                borderRadius: 48,
                borderWidth: 2,
                borderColor: "#cfe1ff",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 14,
              }}
            >
              <Image source={LOGO} sx={{ width: 56, height: 56 }} resizeMode="contain" />
            </View>

            <Text sx={{ color: C.text, fontWeight: "900", fontSize: 18, mb: 8, textAlign: "center" }}>
              Request Submitted!
            </Text>

            <Text
              sx={{
                color: C.sub,
                textAlign: "center",
                lineHeight: 20,
                mb: 6,
                px: 6,
              }}
            >
              Please wait for admin approval within 1–2 hours.
            </Text>
            <Text sx={{ color: C.sub, textAlign: "center", lineHeight: 20, mb: 16, px: 6 }}>
              The details below will remain on this page for your reference.
            </Text>

            <Pressable
              onPress={() => {
                setSubmitted(false);
                router.replace(CONFIRM_ROUTE);
              }}
              sx={{
                bg: C.blue,
                borderRadius: 12,
                px: 14,
                py: 12,
                alignSelf: "stretch",
                mx: 4,
              }}
            >
              <Text sx={{ color: "#fff", fontWeight: "800", textAlign: "center" }}>
                Go back to Dashboard
              </Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}

/* ---------------- Components & helpers ---------------- */

function Card({
  title,
  children,
  loading,
}: {
  title: string;
  children: React.ReactNode;
  loading?: boolean;
}) {
  return (
    <View
      sx={{
        bg: C.card,
        borderWidth: 1,
        borderColor: C.border,
        borderRadius: 16,
        px: 14,
        py: 16,
        mb: 16,
        shadowColor: "#000",
        shadowOpacity: Platform.OS === "android" ? 0 : 0.06,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 6 },
        elevation: 1,
      }}
    >
      <Text sx={{ color: C.text, fontWeight: "900", fontSize: 18, mb: 12 }}>{title}</Text>
      {loading ? <Text sx={{ color: C.sub }}>Loading…</Text> : children}
    </View>
  );
}

function TwoCol({ children }: { children: React.ReactNode }) {
  return <View sx={{ flexDirection: "row", flexWrap: "wrap", columnGap: 12 }}>{children}</View>;
}

function KV({ label, value, highlight }: { label: string; value?: string | null; highlight?: boolean }) {
  const has = value && value.toString().trim().length > 0;
  return (
    <View sx={{ width: "48%", mb: 10 }}>
      <Text sx={{ color: C.muted, fontSize: 12, mb: 4 }}>{label}</Text>
      <Text
        sx={{
          color: has ? (highlight ? C.blue : C.text) : C.sub,
          bg: highlight && has ? C.chip : "transparent",
          borderRadius: 8,
          px: highlight && has ? 8 : 0,
          py: highlight && has ? 4 : 0,
          lineHeight: 20,
        }}
      >
        {has ? value : "—"}
      </Text>
    </View>
  );
}

function KVBlock({ label, value }: { label: string; value?: string | null }) {
  const has = value && value.toString().trim().length > 0;
  return (
    <View sx={{ mt: 8 }}>
      <Text sx={{ color: C.muted, fontSize: 12, mb: 6 }}>{label}</Text>
      <Text
        sx={{
          color: has ? C.text : C.sub,
          lineHeight: 22,
          bg: "#f8fafc",
          borderWidth: 1,
          borderColor: C.border,
          borderRadius: 12,
          px: 12,
          py: 10,
        }}
      >
        {has ? value : "—"}
      </Text>
    </View>
  );
}

function Divider() {
  return <View sx={{ height: 1, bg: C.border, my: 12 }} />;
}

function isoDate(iso: string) {
  const d = new Date(iso);
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}
function isoTime(iso: string) {
  const d = new Date(iso);
  let h = d.getHours();
  const m = String(d.getMinutes()).padStart(2, "0");
  const am = h < 12 ? "AM" : "PM";
  h = h % 12 || 12;
  return `${h}:${m} ${am}`;
}
function money(s?: string | null) {
  if (!s) return "";
  const n = Number(s);
  if (Number.isNaN(n)) return s;
  return n.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 });
}
function yn(v?: boolean | null) {
  if (v === true) return "Yes";
  if (v === false) return "No";
  return "—";
}
