// app/request/rate.tsx
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Image, Pressable, ScrollView, Text, TextInput, View } from "dripsy";
import { useRouter, type Href } from "expo-router";
import {
  ArrowLeft,
  Banknote,
  ChevronRight,
  Clock,
  Info,
} from "lucide-react-native";
import React, { useEffect, useMemo, useState } from "react";
import { Dimensions, Platform } from "react-native";

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

const PAD = 20;
const GAP = 16;
const BTN_PY = 16;

const STORAGE_KEY = "request_step3";
const STEP2_KEY = "request_step2";
const NEXT_ROUTE = "/forms/requestpreview" as Href;

type RateType = "hour" | "job";

type Step2Draft = {
  serviceType?: string | null;
  serviceTask?: string | null;
  date?: string | null;
  time?: string | null;
  toolsProvided?: boolean | null;
  urgent?: boolean | null;
  desc?: string | null;
};

const SUGGESTED: Record<
  string,
  { hour?: [number, number]; job?: [number, number] }
> = {
  Plumbing: { hour: [300, 600], job: [800, 3000] },
  Electrical: { hour: [300, 600], job: [800, 3000] },
  Cleaning: { hour: [200, 400], job: [500, 2000] },
  Laundry: { hour: [150, 300], job: [300, 1200] },
  Mechanic: { hour: [350, 700], job: [1000, 5000] },
  Carpentry: { hour: [300, 600], job: [900, 3500] },
};

export default function RateScreen() {
  const router = useRouter();

  // step-2 summary (to make this step more informative)
  const [prev, setPrev] = useState<Step2Draft | null>(null);

  // rate form
  const [rateType, setRateType] = useState<RateType | null>(null);
  const [hourFrom, setHourFrom] = useState("");
  const [hourTo, setHourTo] = useState("");
  const [jobFixed, setJobFixed] = useState("");

  // submitted flag for inline hints
  const [submitted, setSubmitted] = useState(false);

  // hydrate from drafts
  useEffect(() => {
    (async () => {
      try {
        const step2 = await AsyncStorage.getItem(STEP2_KEY);
        if (step2) setPrev(JSON.parse(step2));

        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw) {
          const v = JSON.parse(raw);
          setRateType(v.rateType ?? null);
          setHourFrom(v.hourFrom ?? "");
          setHourTo(v.hourTo ?? "");
          setJobFixed(v.jobFixed ?? "");
        }
      } catch {}
    })();
  }, []);

  // autosave (debounced)
  useEffect(() => {
    const id = setTimeout(() => {
      AsyncStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ rateType, hourFrom, hourTo, jobFixed })
      ).catch(() => {});
    }, 350);
    return () => clearTimeout(id);
  }, [rateType, hourFrom, hourTo, jobFixed]);

  const canNext = useMemo(() => {
    if (rateType === "hour") {
      const f = Number(hourFrom);
      const t = Number(hourTo);
      return !!hourFrom && !!hourTo && f > 0 && t >= f;
    }
    if (rateType === "job") {
      const p = Number(jobFixed);
      return !!jobFixed && p > 0;
    }
    return false;
  }, [rateType, hourFrom, hourTo, jobFixed]);

  const onNext = async () => {
    setSubmitted(true);
    if (!canNext) return;
    await AsyncStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ rateType, hourFrom, hourTo, jobFixed })
    );
    router.push(NEXT_ROUTE);
  };

  // helpers
  const onlyMoney = (s: string) => {
    const cleaned = s.replace(/[^\d.]/g, "");
    const parts = cleaned.split(".");
    if (parts.length <= 1) return cleaned;
    return parts[0] + "." + parts.slice(1).join("");
  };
  const peso = (n?: number) =>
    typeof n === "number" && !Number.isNaN(n)
      ? `₱${n.toLocaleString("en-PH", { maximumFractionDigits: 0 })}`
      : "";

  const guidance = useMemo(() => {
    const t = prev?.serviceType || "";
    return SUGGESTED[t] || {};
  }, [prev?.serviceType]);

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
        <View
          sx={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 10,
            alignItems: "center",
          }}
          pointerEvents="none"
        >
          <Image
            source={LOGO}
            sx={{ width: Math.min(width * 0.7, 300), height: 56 }}
            resizeMode="contain"
          />
        </View>
        <Pressable
          onPress={() => router.back()}
          sx={{
            width: 48,
            height: 48,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <ArrowLeft color={C.text} size={28} strokeWidth={2.4} />
        </Pressable>
      </View>

      {/* STEP STATUS BAR (3/4) */}
      <View sx={{ px: PAD, pt: 16, pb: 14, bg: "#fff" }}>
        <View sx={{ flexDirection: "row", alignItems: "center", mb: 14 }}>
          <Text sx={{ color: C.text, fontWeight: "900", fontSize: 18 }}>
            Step 3 of 4
          </Text>
          <Text sx={{ color: C.sub, ml: 12, fontSize: 14 }}>
            Set Your Price Rate
          </Text>
        </View>
        <View sx={{ flexDirection: "row", columnGap: 12 }}>
          {[1, 2, 3, 4].map((i) => (
            <View
              key={i}
              sx={{
                flex: 1,
                height: 10,
                borderRadius: 999,
                bg: i <= 3 ? C.blue : C.track,
              }}
            />
          ))}
        </View>
      </View>

      <ScrollView
        contentContainerStyle={{ paddingBottom: 140 }}
        showsVerticalScrollIndicator={false}
      >
        <View sx={{ px: PAD, pt: 18 }}>
          {/* Summary from Step 2 (informational) */}
          <Card
            title="Your Request at a Glance"
            subtitle="We’ll use this to help match your rate to the job."
          >
            <SummaryRow
              label="Service"
              value={
                prev?.serviceType
                  ? `${prev?.serviceType}${
                      prev?.serviceTask ? ` — ${prev?.serviceTask}` : ""
                    }`
                  : "Not set"
              }
            />
            <SummaryRow
              label="Preferred Schedule"
              value={formatSchedule(prev?.date, prev?.time)}
            />
            <SummaryRow
              label="Urgent"
              value={yesNo(prev?.urgent)}
            />
            <SummaryRow
              label="Tools Provided"
              value={yesNo(prev?.toolsProvided)}
            />
            {prev?.desc ? (
              <View sx={{ mt: 8 }}>
                <Text sx={{ color: C.sub, fontSize: 12 }}>Notes</Text>
                <Text sx={{ color: C.text, mt: 4, lineHeight: 20 }}>
                  {prev.desc}
                </Text>
              </View>
            ) : null}
            <Pressable
              onPress={() => router.push("/forms/request2" as Href)}
              sx={{
                mt: 14,
                alignSelf: "flex-start",
                flexDirection: "row",
                alignItems: "center",
                px: 12,
                py: 8,
                borderRadius: 999,
                bg: C.chip,
              }}
            >
              <Text sx={{ color: C.blue, fontWeight: "800", mr: 6 }}>
                Edit details (Step 2)
              </Text>
              <ChevronRight color={C.blue} size={16} />
            </Pressable>
          </Card>

          {/* Helpful guidance banner */}
          <InfoBanner
            text="You can always negotiate with your service provider in chat. Setting a clear rate now helps you get faster responses."
          />

          {/* Rate selection */}
          <Card
            title="Price Rate"
            subtitle="Choose how you want to price this job."
          >
            <View sx={{ flexDirection: "row", columnGap: GAP, mb: GAP }}>
              <RateCard
                label="By the hour"
                icon={
                  <Clock color={rateType === "hour" ? C.blue : C.sub} size={20} />
                }
                active={rateType === "hour"}
                onPress={() => setRateType("hour")}
              />
              <RateCard
                label="By the job"
                icon={
                  <Banknote
                    color={rateType === "job" ? C.blue : C.sub}
                    size={20}
                  />
                }
                active={rateType === "job"}
                onPress={() => setRateType("job")}
              />
            </View>

            {/* Hourly range */}
            {rateType === "hour" && (
              <>
                <Label>Set your hourly range</Label>
                <View sx={{ flexDirection: "row", columnGap: GAP }}>
                  <CurrencyField
                    label="From"
                    value={hourFrom}
                    onChangeText={(v) => setHourFrom(onlyMoney(v))}
                    suffix="/hr"
                    danger={submitted && !(Number(hourFrom) > 0)}
                  />
                  <CurrencyField
                    label="To"
                    value={hourTo}
                    onChangeText={(v) => setHourTo(onlyMoney(v))}
                    suffix="/hr"
                    danger={
                      submitted &&
                      !(
                        Number(hourTo) > 0 &&
                        Number(hourTo) >= Number(hourFrom || "0")
                      )
                    }
                  />
                </View>

                {/* Suggestions based on Step 2 type */}
                {guidance.hour ? (
                  <SuggestionChips
                    label="Quick fill"
                    options={[
                      peso(guidance.hour[0]),
                      peso(Math.round(
                        (guidance.hour[0] + guidance.hour[1]) / 2
                      )),
                      peso(guidance.hour[1]),
                    ]}
                    onPick={(p) => {
                      const n = Number((p || "").replace(/[^\d]/g, ""));
                      if (!hourFrom) setHourFrom(String(n));
                      else setHourTo(String(Math.max(n, Number(hourFrom))));
                    }}
                  />
                ) : null}

                <Text sx={{ color: C.sub, mt: 8, lineHeight: 20 }}>
                  Tip: A tighter range builds trust. You can finalize the exact
                  price with the pro after they review the scope.
                </Text>

                {/* Inline errors */}
                {submitted && !(Number(hourFrom) > 0) ? (
                  <Hint text="Enter a valid starting hourly rate." />
                ) : null}
                {submitted &&
                !(
                  Number(hourTo) > 0 &&
                  Number(hourTo) >= Number(hourFrom || "0")
                ) ? (
                  <Hint text="Your 'To' rate should be greater than or equal to 'From'." />
                ) : null}
              </>
            )}

            {/* Fixed job price */}
            {rateType === "job" && (
              <>
                <Label>Set a fixed price</Label>
                <CurrencyField
                  value={jobFixed}
                  onChangeText={(v) => setJobFixed(onlyMoney(v))}
                  danger={submitted && !(Number(jobFixed) > 0)}
                />
                {guidance.job ? (
                  <SuggestionChips
                    label="Common picks"
                    options={[
                      peso(guidance.job[0]),
                      peso(Math.round(
                        (guidance.job[0] + guidance.job[1]) / 2
                      )),
                      peso(guidance.job[1]),
                    ]}
                    onPick={(p) =>
                      setJobFixed(String(Number((p || "").replace(/[^\d]/g, ""))))
                    }
                  />
                ) : null}
                <Text sx={{ color: C.sub, mt: 8, lineHeight: 20 }}>
                  Fixed prices are great when the scope is clear. If details are
                  uncertain, consider an hourly rate.
                </Text>
                {submitted && !(Number(jobFixed) > 0) ? (
                  <Hint text="Enter a valid fixed amount." />
                ) : null}
              </>
            )}
          </Card>

          {/* Small note about fees */}
          <InfoBanner
            text="No upfront charges. You only pay the service provider directly when the job is done."
          />
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
          <Text sx={{ color: C.text, fontWeight: "900", fontSize: 16 }}>
            Back : Step 2
          </Text>
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
          <Text sx={{ color: "#fff", fontWeight: "900", fontSize: 16 }}>
            Review Service Request
          </Text>
        </Pressable>
      </View>
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
      <Text sx={{ color: C.text, fontWeight: "900", fontSize: 20 }}>
        {title}
      </Text>
      {subtitle ? (
        <Text sx={{ color: C.sub, mt: 6, mb: 14, lineHeight: 20 }}>
          {subtitle}
        </Text>
      ) : null}
      {children}
    </View>
  );
}

function SummaryRow({ label, value }: { label: string; value?: string }) {
  return (
    <View
      sx={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        py: 8,
        borderBottomWidth: 1,
        borderBottomColor: C.border,
      }}
    >
      <Text sx={{ color: C.sub }}>{label}</Text>
      <Text sx={{ color: C.text, fontWeight: "700", maxWidth: "65%", textAlign: "right" }}>
        {value || "—"}
      </Text>
    </View>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <Text sx={{ color: C.text, fontWeight: "800", mb: 10, fontSize: 14 }}>
      {children}
    </Text>
  );
}

function Hint({ text }: { text: string }) {
  return <Text sx={{ color: C.bad, fontSize: 12, mt: 8 }}>{text}</Text>;
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

function RateCard({
  label,
  icon,
  active,
  onPress,
}: {
  label: string;
  icon: React.ReactNode;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      sx={{
        flex: 1,
        borderWidth: 1,
        borderColor: active ? C.blue : C.border,
        borderRadius: 18,
        bg: active ? C.chip : C.fieldBg,
        py: 18,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <View sx={{ mb: 8 }}>{icon}</View>
      <Text sx={{ color: C.text, fontWeight: "900" }}>{label}</Text>
    </Pressable>
  );
}

function CurrencyField({
  label,
  value,
  onChangeText,
  suffix,
  danger,
}: {
  label?: string;
  value: string;
  onChangeText: (v: string) => void;
  suffix?: string;
  danger?: boolean;
}) {
  return (
    <View sx={{ flex: 1 }}>
      {label ? (
        <Text sx={{ color: C.text, mb: 8, fontWeight: "700" }}>{label}</Text>
      ) : null}
      <View
        sx={{
          flexDirection: "row",
          alignItems: "center",
          borderWidth: 1,
          borderColor: danger ? C.bad : C.border,
          borderRadius: 20,
          bg: C.fieldBg,
          overflow: "hidden",
        }}
      >
        <View
          sx={{
            px: 14,
            py: 14,
            bg: "#fff",
            borderRightWidth: 1,
            borderRightColor: C.border,
          }}
        >
          <Text sx={{ color: C.text, fontWeight: "900" }}>₱</Text>
        </View>
        <TextInput
          keyboardType="numeric"
          value={value}
          onChangeText={onChangeText}
          placeholder="0.00"
          placeholderTextColor={C.placeholder}
          sx={{ flex: 1, px: 14, py: 14, color: C.text, fontSize: 16 }}
        />
        {suffix ? (
          <View sx={{ px: 14, py: 14 }}>
            <Text sx={{ color: C.sub, fontWeight: "700" }}>{suffix}</Text>
          </View>
        ) : null}
      </View>
    </View>
  );
}

function SuggestionChips({
  label,
  options,
  onPick,
}: {
  label: string;
  options: (string | undefined)[];
  onPick: (v: string) => void;
}) {
  const valid = options.filter(Boolean) as string[];
  if (valid.length === 0) return null;
  return (
    <View sx={{ mt: 12 }}>
      <Text sx={{ color: C.sub, mb: 8 }}>{label}</Text>
      <View sx={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
        {valid.map((o) => (
          <Pressable
            key={o}
            onPress={() => onPick(o)}
            sx={{
              px: 12,
              py: 8,
              borderRadius: 999,
              bg: C.chip,
              borderWidth: 1,
              borderColor: C.border,
            }}
          >
            <Text sx={{ color: C.blue, fontWeight: "800" }}>{o}</Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

function yesNo(v?: boolean | null) {
  if (v === true) return "Yes";
  if (v === false) return "No";
  return "—";
}

function formatSchedule(dateISO?: string | null, timeISO?: string | null) {
  if (!dateISO && !timeISO) return "—";
  const d = dateISO ? new Date(dateISO) : null;
  const t = timeISO ? new Date(timeISO) : null;
  const date = d ? formatDate(d) : "";
  const time = t ? formatTime(t) : "";
  return `${date}${date && time ? " • " : ""}${time}`;
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
