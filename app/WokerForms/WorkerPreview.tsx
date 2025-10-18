import AsyncStorage from "@react-native-async-storage/async-storage";
import { Image, Pressable, ScrollView, Text, View } from "dripsy";
import { useRouter, type Href } from "expo-router";
import { ArrowLeft, CheckCircle2, Image as ImageIcon, Pencil, X } from "lucide-react-native";
import React, { useEffect, useMemo, useState } from "react";
import { Dimensions, Modal, Platform } from "react-native";

/* ---------- Keys / Routes ---------- */
const S1 = "worker_step1";
const S2 = "worker_step2";
const S3 = "worker_step3";
const S4 = "worker_step4";
const S5 = "worker_step5";
const MERGED = "worker_full";
const DONE_ROUTE = "/home/homeworker" as Href;

// Edit routes (change if yours differ)
const EDIT_STEP1 = "/WokerForms/WorkerForms1" as Href;
const EDIT_STEP2 = "/WokerForms/WorkerForms2" as Href;
const EDIT_STEP3 = "/WokerForms/WorkerForms3" as Href;
const EDIT_STEP4 = "/WokerForms/WorkerForms4" as Href;
const EDIT_STEP5 = "/WokerForms/WorkerForms5" as Href;

/* ---------- Theme / Dimensions ---------- */
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
  muted: "#64748b",
  field: "#f8fafc",
  track: "#e9f0fb",
};
const PAD = 20;
const GAP = 16;
const BTN_PY = 16;

/* ---------- Preview ---------- */
export default function WorkerPreview() {
  const router = useRouter();
  const [p1, setP1] = useState<any>(null);
  const [p2, setP2] = useState<any>(null);
  const [p3, setP3] = useState<any>(null);
  const [p4, setP4] = useState<any>(null);
  const [p5, setP5] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // lightbox
  const [previewUri, setPreviewUri] = useState<string | null>(null);

  // success modal
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    (async () => {
      const [a, b, c, d, e] = await Promise.all([
        AsyncStorage.getItem(S1),
        AsyncStorage.getItem(S2),
        AsyncStorage.getItem(S3),
        AsyncStorage.getItem(S4),
        AsyncStorage.getItem(S5),
      ]);
      if (a) setP1(JSON.parse(a));
      if (b) setP2(JSON.parse(b));
      if (c) setP3(JSON.parse(c));
      if (d) setP4(JSON.parse(d));
      if (e) setP5(JSON.parse(e));
      setLoading(false);
    })();
  }, []);

  const address = useMemo(() => {
    const s = p1?.street?.trim();
    const b = p1?.brgy?.toString().trim?.();
    return s && b ? `${s}, ${b}` : (s || b || "—");
  }, [p1]);

  const rateType = useMemo(
    () => (p4?.rateType === "hour" ? "Hourly Rate" : p4?.rateType === "job" ? "By the Job Rate" : "—"),
    [p4]
  );

  const rateLine = useMemo(() => {
    if (p4?.rateType === "hour") {
      const f = money(p4?.from);
      const t = money(p4?.to);
      if (f && t) return `₱${f} – ₱${t} / hr`;
      if (f) return `₱${f} / hr`;
      if (t) return `Up to ₱${t} / hr`;
      return "—";
    }
    const j = money(p4?.job);
    return j ? `₱${j}` : "—";
  }, [p4]);

  const a1 = !!p5?.a1, a2 = !!p5?.a2, a3 = !!p5?.a3;

  const onConfirm = async () => {
    const merged = {
      step1: p1,
      step2: p2,
      step3: p3,
      step4: p4,
      step5: p5,
      createdAt: new Date().toISOString(),
    };
    await AsyncStorage.setItem(MERGED, JSON.stringify(merged));
    setSubmitted(true); // show success modal
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
          onPress={() => router.back()}
          sx={{ width: 48, height: 48, alignItems: "center", justifyContent: "center" }}
        >
          <ArrowLeft color={C.text} size={28} strokeWidth={2.4} />
        </Pressable>
      </View>

      {/* Step bar */}
      <View sx={{ px: PAD, pt: 18, pb: 14, bg: C.card }}>
        <View sx={{ flexDirection: "row", alignItems: "center", mb: 14 }}>
          <Text sx={{ color: C.text, fontWeight: "900", fontSize: 18 }}>Step 6 of 6</Text>
          <Text sx={{ color: C.sub, ml: 12, fontSize: 14 }}>Review Application</Text>
        </View>
        <View sx={{ flexDirection: "row", columnGap: 12 }}>
          {[1, 1, 1, 1, 1, 1].map((f, i) => (
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
          {/* Personal Information */}
          <Card
            title="Personal Information"
            loading={loading}
            actionLabel="Edit"
            onAction={() => router.push(EDIT_STEP1)}
          >
            <View sx={{ alignItems: "center", mb: 16 }}>
              <View
                sx={{
                  width: 110,
                  height: 110,
                  borderRadius: 55,
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
              <KV label="Birthdate" value={p1?.dob ? isoDate(p1.dob) : undefined} />
              <KV label="Contact Number" value={p1?.phone} />
              <KV label="Email" value={p1?.email} />
              <KV label="Address" value={address} />
            </TwoCol>
          </Card>

          {/* Work Details */}
          <Card
            title="Work Details"
            loading={loading}
            actionLabel="Edit"
            onAction={() => router.push(EDIT_STEP2)}
          >
            <TwoCol>
              <KV
                label="Service Types"
                value={Object.entries(p2?.types ?? {})
                  .filter(([, v]) => v)
                  .map(([k]) => k)
                  .join(", ")}
              />
              <KV label="Years of Experience" value={p2?.years} />
              <KV label="Tools Provided" value={yn(p2?.ownTools)} />
            </TwoCol>

            {Array.isArray(p2?.tasks) && p2.tasks.filter((t: string) => t?.trim()).length ? (
              <KVBlock
                label="Tasks / Specialties"
                value={p2.tasks.filter((t: string) => t?.trim()).join(", ")}
              />
            ) : null}

            {p2?.desc ? <KVBlock label="Description" value={p2.desc} /> : null}
          </Card>

          {/* Required Documents */}
          <Card
            title="Required Documents"
            loading={loading}
            actionLabel="Edit"
            onAction={() => router.push(EDIT_STEP3)}
          >
            <DocsGrid
              items={[
                { k: "primaryFront", label: "Primary ID (Front)", uri: p3?.primaryFront },
                { k: "primaryBack", label: "Primary ID (Back)", uri: p3?.primaryBack },
                { k: "secondaryId", label: "Secondary ID", uri: p3?.secondaryId },
                { k: "nbi", label: "NBI/Police Clearance", uri: p3?.nbi },
                { k: "address", label: "Proof of Address", uri: p3?.address },
                { k: "medical", label: "Medical Certificate", uri: p3?.medical },
                { k: "certificates", label: "Certificates", uri: p3?.certificates },
              ]}
              onOpen={(u) => setPreviewUri(u)}
            />
          </Card>

          {/* Service Rate */}
          <Card
            title="Service Rate"
            loading={loading}
            actionLabel="Edit"
            onAction={() => router.push(EDIT_STEP4)}
          >
            <TwoCol>
              <KV label="Rate Type" value={rateType} />
              <KV label="Rate" value={rateLine} />
            </TwoCol>
          </Card>

          {/* Terms & Agreements */}
          <Card
            title="Terms & Agreements"
            loading={loading}
            actionLabel="Edit"
            onAction={() => router.push(EDIT_STEP5)}
          >
            <TwoCol>
              <KV label="Background check & document verification" value={yn(a1)} />
              <KV label="Agree to ToS & Privacy Policy" value={yn(a2)} />
              <KV label="Data Privacy consent (RA 10173)" value={yn(a3)} />
            </TwoCol>
          </Card>
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
          <Text sx={{ color: C.text, fontWeight: "900", fontSize: 16 }}>Back : Step 5</Text>
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
          <Text sx={{ color: "#fff", fontWeight: "900", fontSize: 16 }}>Confirm Application</Text>
        </Pressable>
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
            <Image
              source={{ uri: previewUri }}
              sx={{ width: "100%", height: "100%" }}
              resizeMode="contain"
            />
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

      {/* Success Modal (copied & adapted) */}
      <Modal
        visible={submitted}
        animationType="fade"
        transparent
        onRequestClose={() => setSubmitted(false)}
      >
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
                router.replace(DONE_ROUTE);
              }}
              sx={{ bg: C.blue, borderRadius: 12, px: 16, py: 14, alignSelf: "stretch" }}
            >
              <Text sx={{ color: "#fff", fontWeight: "900", textAlign: "center" }}>
                Go to Dashboard
              </Text>
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
  loading,
  actionLabel,
  onAction,
}: {
  title: string;
  children: React.ReactNode;
  loading?: boolean;
  actionLabel?: string;
  onAction?: () => void;
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
        mb: 24,
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

const TwoCol = ({ children }: any) => (
  <View sx={{ flexDirection: "row", flexWrap: "wrap", columnGap: 12 }}>{children}</View>
);

function KV({
  label,
  value,
  highlight,
}: {
  label: string;
  value?: string | null;
  highlight?: boolean;
}) {
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
        numberOfLines={2}
      >
        {has ? value : "—"}
      </Text>
    </View>
  );
}

function KVBlock({ label, value }: { label: string; value?: string | null }) {
  const has = value && value.toString().trim().length > 0;
  return (
    <View sx={{ mt: 12 }}>
      <Text sx={{ color: C.muted, fontSize: 12, mb: 6 }}>{label}</Text>
      <Text
        sx={{
          color: has ? C.text : C.sub,
          lineHeight: 22,
          bg: C.field,
          borderWidth: 1,
          borderColor: C.border,
          borderRadius: 14,
          px: 14,
          py: 12,
        }}
      >
        {has ? value : "—"}
      </Text>
    </View>
  );
}

function DocsGrid({
  items,
  onOpen,
}: {
  items: { k: string; label: string; uri?: string | null }[];
  onOpen: (u: string) => void;
}) {
  return (
    <View sx={{ flexDirection: "row", flexWrap: "wrap", columnGap: 12 }}>
      {items.map((it) => (
        <View
          key={it.k}
          sx={{
            width: "48%",
            borderWidth: 1,
            borderColor: C.border,
            borderRadius: 14,
            p: 10,
            mb: 12,
            bg: "#fff",
          }}
        >
          <Text sx={{ color: C.text, fontWeight: "800", mb: 8 }}>{it.label}</Text>
          <Pressable
            onPress={it.uri ? () => onOpen(it.uri!) : undefined}
            sx={{
              height: 120,
              borderRadius: 12,
              borderWidth: 1,
              borderColor: C.border,
              bg: C.field,
              alignItems: "center",
              justifyContent: "center",
              overflow: "hidden",
            }}
          >
            {it.uri ? (
              <Image source={{ uri: it.uri }} sx={{ width: "100%", height: "100%" }} resizeMode="cover" />
            ) : (
              <View sx={{ alignItems: "center" }}>
                <ImageIcon color="#9aa9bc" size={24} />
                <Text sx={{ color: "#9aa9bc", mt: 6 }}>No file</Text>
              </View>
            )}
          </Pressable>
        </View>
      ))}
    </View>
  );
}

/* ---------- Helpers ---------- */
function isoDate(iso: string) {
  const d = new Date(iso);
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
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
