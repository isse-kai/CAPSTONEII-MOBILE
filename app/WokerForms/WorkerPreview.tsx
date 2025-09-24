import AsyncStorage from "@react-native-async-storage/async-storage";
import { Image, Pressable, ScrollView, Text, View } from "dripsy";
import { useRouter, type Href } from "expo-router";
import { ArrowLeft } from "lucide-react-native";
import React, { useEffect, useMemo, useState } from "react";
import { Platform } from "react-native";

const S1 = "worker_step1";
const S2 = "worker_step2";
const S3 = "worker_step3";
const S4 = "worker_step4";
const S5 = "worker_step5";
const MERGED = "worker_full";
const DONE_ROUTE = "/home/home" as Href;

const C = { bg: "#fff", text: "#0f172a", sub: "#475569", blue: "#1e86ff", border: "#e6eef7", chip: "#eaf4ff", card: "#fff", muted: "#64748b" };

export default function WorkerPreview() {
  const router = useRouter();
  const [p1, setP1] = useState<any>(null);
  const [p2, setP2] = useState<any>(null);
  const [p3, setP3] = useState<any>(null);
  const [p4, setP4] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const [a,b,c,d] = await Promise.all([
        AsyncStorage.getItem(S1), AsyncStorage.getItem(S2),
        AsyncStorage.getItem(S3), AsyncStorage.getItem(S4)
      ]);
      if (a) setP1(JSON.parse(a));
      if (b) setP2(JSON.parse(b));
      if (c) setP3(JSON.parse(c));
      if (d) setP4(JSON.parse(d));
      setLoading(false);
    })();
  }, []);

  const address = useMemo(() => {
    const s = p1?.street?.trim(); const b = p1?.brgy?.trim();
    return s && b ? `${s}, ${b}` : (s || b || "—");
  }, [p1]);

  const rateType = useMemo(() => (p4?.rateType === "hour" ? "Hourly Rate" : "By the Job Rate"), [p4]);
  const rateLine = useMemo(() => {
    if (p4?.rateType === "hour") {
      const f = money(p4?.from); const t = money(p4?.to);
      if (f && t) return `₱${f} - ₱${t} per hour`;
      if (f) return `₱${f} per hour`;
      if (t) return `Up to ₱${t} per hour`;
      return "—";
    }
    const j = money(p4?.job);
    return j ? `₱${j}` : "—";
  }, [p4]);

  const onConfirm = async () => {
    const merged = { step1: p1, step2: p2, step3: p3, step4: p4, createdAt: new Date().toISOString() };
    await AsyncStorage.setItem(MERGED, JSON.stringify(merged));
    router.replace(DONE_ROUTE);
  };

  return (
    <View sx={{ flex: 1, bg: C.bg }}>
      <View sx={{ px: 14, pt: 8, pb: 10, borderBottomWidth: 1, borderBottomColor: C.border }}>
        <Pressable onPress={() => router.back()} sx={{ width: 44, height: 44, alignItems: "center", justifyContent: "center" }}>
          <ArrowLeft color={C.text} size={26} />
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 108 }}>
        <View sx={{ px: 16, pt: 12 }}>
          <Text sx={{ color: C.sub, fontSize: 12, mb: 6 }}>6 of 6 | Post a Worker Application</Text>
          <Text sx={{ color: C.text, fontSize: 26, fontWeight: "900", mb: 16 }}>Review Application</Text>

          <Card title="Personal Information" loading={loading}>
            <View sx={{ alignItems: "center", mb: 16 }}>
              <View sx={{ width: 110, height: 110, borderRadius: 55, borderWidth: 1, borderColor: C.border, bg: "#f1f5f9", overflow: "hidden", shadowColor: "#000", shadowOpacity: Platform.OS === "android" ? 0 : 0.12, shadowRadius: 10, shadowOffset: { width: 0, height: 6 }, elevation: 2 }}>
                {p1?.photo ? <Image source={{ uri: p1.photo }} sx={{ width: "100%", height: "100%" }} /> : <View sx={{ flex: 1, alignItems: "center", justifyContent: "center" }}><Text sx={{ color: C.muted }}>No Photo</Text></View>}
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
            <Divider />
            <TwoCol>
              <KV label="Facebook" value={p1?.fb} highlight />
              <KV label="Instagram" value={p1?.ig} highlight />
              <KV label="LinkedIn" value={p1?.li} highlight />
            </TwoCol>
          </Card>

          <Card title="Work Details" loading={loading}>
            <TwoCol>
              <KV label="Service Types" value={Object.entries(p2?.types ?? {}).filter(([,v])=>v).map(([k])=>k).join(", ")} />
              <KV label="Years of Experience" value={p2?.years} />
              <KV label="Tools Provided" value={yn(p2?.ownTools)} />
            </TwoCol>
            <Divider />
            <KVBlock label="Description" value={p2?.desc} />
            {Array.isArray(p2?.tasks) && p2.tasks.length ? (
              <>
                <Divider />
                <KVBlock label="Selected Tasks" value={p2.tasks.filter((t:string)=>t?.trim()).join(", ")} />
              </>
            ) : null}
          </Card>

          <Card title="Service Rate">
            <TwoCol>
              <KV label="Rate Type" value={rateType} />
              <KV label="Rate" value={rateLine} />
            </TwoCol>
          </Card>
        </View>
      </ScrollView>

      <View sx={{ position: "absolute", left: 0, right: 0, bottom: 0, bg: "#fff", borderTopWidth: 1, borderTopColor: C.border, px: 16, py: 12, flexDirection: "row", gap: 12 }}>
        <Pressable onPress={() => router.back()} sx={{ flex: 1, borderWidth: 1, borderColor: C.border, borderRadius: 14, alignItems: "center", justifyContent: "center", py: 13 }}>
          <Text sx={{ color: C.text, fontWeight: "800" }}>Back : Step 5</Text>
        </Pressable>
        <Pressable onPress={onConfirm} sx={{ flex: 1.3, borderRadius: 14, alignItems: "center", justifyContent: "center", py: 13, bg: C.blue }}>
          <Text sx={{ color: "#fff", fontWeight: "800" }}>Confirm Application</Text>
        </Pressable>
      </View>
    </View>
  );
}

/* ui bits */
function Card({ title, children, loading }: { title: string; children: React.ReactNode; loading?: boolean }) {
  return (
    <View sx={{ bg: C.card, borderWidth: 1, borderColor: C.border, borderRadius: 16, px: 14, py: 16, mb: 16 }}>
      <Text sx={{ color: C.text, fontWeight: "900", fontSize: 18, mb: 12 }}>{title}</Text>
      {loading ? <Text sx={{ color: C.sub }}>Loading…</Text> : children}
    </View>
  );
}
const TwoCol = ({ children }: any) => <View sx={{ flexDirection: "row", flexWrap: "wrap", columnGap: 12 }}>{children}</View>;
function KV({ label, value, highlight }: { label: string; value?: string | null; highlight?: boolean }) {
  const has = value && value.toString().trim().length > 0;
  return (
    <View sx={{ width: "48%", mb: 10 }}>
      <Text sx={{ color: C.muted, fontSize: 12, mb: 4 }}>{label}</Text>
      <Text sx={{ color: has ? (highlight ? C.blue : C.text) : C.sub, bg: highlight && has ? C.chip : "transparent", borderRadius: 8, px: highlight && has ? 8 : 0, py: highlight && has ? 4 : 0, lineHeight: 20 }}>
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
      <Text sx={{ color: has ? C.text : C.sub, lineHeight: 22, bg: "#f8fafc", borderWidth: 1, borderColor: C.border, borderRadius: 12, px: 12, py: 10 }}>
        {has ? value : "—"}
      </Text>
    </View>
  );
}
const Divider = () => <View sx={{ height: 1, bg: C.border, my: 12 }} />;

function isoDate(iso: string) {
  const d = new Date(iso); const yyyy = d.getFullYear(); const mm = String(d.getMonth()+1).padStart(2,"0"); const dd = String(d.getDate()).padStart(2,"0");
  return `${yyyy}-${mm}-${dd}`;
}
function money(s?: string | null) {
  if (!s) return "";
  const n = Number(s); if (Number.isNaN(n)) return s;
  return n.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 });
}
function yn(v?: boolean | null) {
  if (v === true) return "Yes";
  if (v === false) return "No";
  return "—";
}
