import AsyncStorage from "@react-native-async-storage/async-storage"
import { Image, Pressable, ScrollView, Text, TextInput, View } from "dripsy"
import { useRouter, type Href } from "expo-router"
import { Banknote, ChevronRight, Clock } from "lucide-react-native"
import { MotiView } from "moti"
import React, { useEffect, useMemo, useState } from "react"
import { ImageBackground, Platform } from "react-native"
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context"

// const { width } = Dimensions.get("window")
const LOGO = require("../../../assets/jdklogo.png")
const BG = require("../../../assets/login.jpg")

const PAD = 20
const GAP = 16
const BTN_PY = 16
const STORAGE_KEY = "request_step3"
const STEP2_KEY = "request_step2"
const NEXT_ROUTE = "./clientforms/requestpreview" as Href

type RateType = "hour" | "job"
type Step2Draft = {
  serviceType?: string | null
  serviceTask?: string | null
  date?: string | null
  time?: string | null
  toolsProvided?: boolean | null
  urgent?: boolean | null
  desc?: string | null
}

const SUGGESTED: Record<string, { hour?: [number, number]; job?: [number, number] }> = {
  Plumbing: { hour: [300, 600], job: [800, 3000] },
  Electrical: { hour: [300, 600], job: [800, 3000] },
  Cleaning: { hour: [200, 400], job: [500, 2000] },
  Laundry: { hour: [150, 300], job: [300, 1200] },
  Mechanic: { hour: [350, 700], job: [1000, 5000] },
  Carpentry: { hour: [300, 600], job: [900, 3500] },
}

export default function RateScreen() {
  const router = useRouter()
  const insets = useSafeAreaInsets()

  const [prev, setPrev] = useState<Step2Draft | null>(null)
  const [rateType, setRateType] = useState<RateType | null>(null)
  const [hourFrom, setHourFrom] = useState("")
  const [hourTo, setHourTo] = useState("")
  const [jobFixed, setJobFixed] = useState("")
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    (async () => {
      try {
        const step2 = await AsyncStorage.getItem(STEP2_KEY)
        if (step2) setPrev(JSON.parse(step2))

        const raw = await AsyncStorage.getItem(STORAGE_KEY)
        if (raw) {
          const v = JSON.parse(raw)
          setRateType(v.rateType ?? null)
          setHourFrom(v.hourFrom ?? "")
          setHourTo(v.hourTo ?? "")
          setJobFixed(v.jobFixed ?? "")
        }
      } catch {}
    })()
  }, [])

  useEffect(() => {
    const id = setTimeout(() => {
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify({ rateType, hourFrom, hourTo, jobFixed }))
    }, 350)
    return () => clearTimeout(id)
  }, [rateType, hourFrom, hourTo, jobFixed])

  const canNext = useMemo(() => {
    if (rateType === "hour") {
      const f = Number(hourFrom)
      const t = Number(hourTo)
      return !!hourFrom && !!hourTo && f > 0 && t >= f
    }
    if (rateType === "job") {
      const p = Number(jobFixed)
      return !!jobFixed && p > 0
    }
    return false
  }, [rateType, hourFrom, hourTo, jobFixed])

  const onNext = async () => {
    setSubmitted(true)
    if (!canNext) return
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify({ rateType, hourFrom, hourTo, jobFixed }))
    router.push(NEXT_ROUTE)
  }

  const onlyMoney = (s: string) => {
    const cleaned = s.replace(/[^\d.]/g, "")
    const parts = cleaned.split(".")
    if (parts.length <= 1) return cleaned
    return parts[0] + "." + parts.slice(1).join("")
  }
  const peso = (n?: number) =>
    typeof n === "number" && !Number.isNaN(n)
      ? `₱${n.toLocaleString("en-PH", { maximumFractionDigits: 0 })}`
      : ""

  const guidance = useMemo(() => {
    const t = prev?.serviceType || ""
    return SUGGESTED[t] || {}
  }, [prev?.serviceType])

  return (
    <ImageBackground source={BG} style={{ flex: 1 }} resizeMode="cover">
      <SafeAreaView style={{ flex: 1, paddingTop: insets.top, paddingBottom: insets.bottom }}>
        <ScrollView contentContainerStyle={{ flexGrow: 1, paddingHorizontal: PAD, paddingBottom: 140 }} showsVerticalScrollIndicator={false}>
          <MotiView from={{ opacity: 0, translateY: 20 }} animate={{ opacity: 1, translateY: 0 }} transition={{ type: "timing", duration: 300 }} style={{ gap: 20 }}>
            
            {/* Header */}
            <View sx={{ alignItems: "center", mt: -20 }}>
              <Image source={LOGO} style={{ width: 180, height: 60, resizeMode: "contain" }} />
            </View>

            {/* Step Status */}
            <View sx={{ bg: "#fff", borderRadius: 20, p: 16 }}>
              <Text sx={{ fontSize: 18, fontFamily: "Poppins-Bold", color: "#000" }}>Step 3 of 4</Text>
              <Text sx={{ fontSize: 14, color: "#64748b", mt: 4 }}>Set Your Price Rate</Text>
              <View sx={{ flexDirection: "row", mt: 12 }}>
                {[1, 2, 3, 4].map((i) => (
                  <View key={i} sx={{ flex: 1, height: 8, borderRadius: 999, bg: i <= 3 ? "#1e86ff" : "#e9f0fb", mx: 2 }} />
                ))}
              </View>
            </View>

            {/* Summary Card */}
            <Card title="Your Request at a Glance" subtitle="We’ll use this to help match your rate to the job.">
              <SummaryRow label="Service" value={prev?.serviceType || "Not set"} />
              <SummaryRow label="Preferred Schedule" value={formatSchedule(prev?.date, prev?.time)} />
              <SummaryRow label="Urgent" value={yesNo(prev?.urgent)} />
              <SummaryRow label="Tools Provided" value={yesNo(prev?.toolsProvided)} />
              {prev?.desc ? <Text sx={{ color: "#64748b", mt: 8 }}>{prev.desc}</Text> : null}
              <Pressable onPress={() => router.push("/forms/request2" as Href)} sx={{ mt: 14, flexDirection: "row", alignItems: "center", px: 12, py: 8, borderRadius: 999, bg: "#eaf4ff" }}>
                <Text sx={{ color: "#1e86ff", fontWeight: "800", mr: 6 }}>Edit details (Step 2)</Text>
                <ChevronRight color="#1e86ff" size={16} />
              </Pressable>
            </Card>

            {/* Rate Selection */}
            <Card title="Price Rate" subtitle="Choose how you want to price this job.">
              <View sx={{ flexDirection: "row", columnGap: GAP, mb: GAP }}>
                <RateCard label="By the hour" icon={<Clock color={rateType === "hour" ? "#1e86ff" : "#64748b"} size={20} />} active={rateType === "hour"} onPress={() => setRateType("hour")} />
                <RateCard label="By the job" icon={<Banknote color={rateType === "job" ? "#1e86ff" : "#64748b"} size={20} />} active={rateType === "job"} onPress={() => setRateType("job")} />
              </View>

              {rateType === "hour" && (
                <>
                  <Label>Set your hourly range</Label>
                  <View sx={{ flexDirection: "row", columnGap: GAP }}>
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

                {guidance.hour ? (
                  <SuggestionChips
                    label="Quick fill"
                    options={[
                      peso(guidance.hour[0]),
                      peso(Math.round((guidance.hour[0] + guidance.hour[1]) / 2)),
                      peso(guidance.hour[1]),
                    ]}
                    onPick={(p) => {
                      const n = Number((p || "").replace(/[^\d]/g, ""))
                      if (!hourFrom) setHourFrom(String(n))
                      else setHourTo(String(Math.max(n, Number(hourFrom))))
                    }}
                  />
                ) : null}

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
                      peso(Math.round((guidance.job[0] + guidance.job[1]) / 2)),
                      peso(guidance.job[1]),
                    ]}
                    onPick={(p) =>
                      setJobFixed(String(Number((p || "").replace(/[^\d]/g, ""))))
                    }
                  />
                ) : null}
                {submitted && !(Number(jobFixed) > 0) ? (
                  <Hint text="Enter a valid fixed amount." />
                ) : null}
              </>
            )}
          </Card>
        </MotiView>
      </ScrollView>

      {/* Sticky Bottom Actions */}
      <View
        sx={{
          flexDirection: "row",
          columnGap: 12,
          bg: "#fff",
          p: 14,
          borderTopWidth: 1,
          borderTopColor: "#e6eef7",
        }}
      >
        <Pressable
          onPress={() => router.back()}
          sx={{
            flex: 1,
            borderWidth: 1,
            borderColor: "#e6eef7",
            borderRadius: 18,
            alignItems: "center",
            justifyContent: "center",
            py: BTN_PY,
          }}
        >
          <Text sx={{ color: "#0f172a", fontFamily: "Poppins-Bold", fontSize: 16 }}>
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
            bg: canNext ? "#1e86ff" : "#a7c8ff",
          }}
        >
          <Text sx={{ color: "#fff", fontFamily: "Poppins-Bold", fontSize: 16 }}>
            Review Service Request
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  </ImageBackground>
  )
}

/* ---------- helpers & tiny components ---------- */

function Card({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <View
      sx={{
        bg: "#fff",
        borderWidth: 1,
        borderColor: "#e6eef7",
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
      <Text sx={{ color: "#0f172a", fontFamily: "Poppins-Bold", fontSize: 20 }}>{title}</Text>
      {subtitle ? (
        <Text sx={{ color: "#64748b", mt: 6, mb: 14, lineHeight: 20 }}>{subtitle}</Text>
      ) : null}
      {children}
    </View>
  )
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
        borderBottomColor: "#e6eef7",
      }}
    >
      <Text sx={{ color: "#64748b" }}>{label}</Text>
      <Text sx={{ color: "#0f172a", fontFamily: "Poppins-Bold", maxWidth: "65%", textAlign: "right" }}>
        {value || "—"}
      </Text>
    </View>
  )
}

function Label({ children }: { children: React.ReactNode }) {
  return <Text sx={{ color: "#0f172a", fontFamily: "Poppins-Bold", mb: 10, fontSize: 14 }}>{children}</Text>
}

function Hint({ text }: { text: string }) {
  return <Text sx={{ color: "#ef4444", fontSize: 12, mt: 8 }}>{text}</Text>
}

function RateCard({ label, icon, active, onPress }: { label: string; icon: React.ReactNode; active: boolean; onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      sx={{
        flex: 1,
        borderWidth: 1,
        borderColor: active ? "#1e86ff" : "#e6eef7",
        borderRadius: 18,
        bg: active ? "#eaf4ff" : "#fff",
        py: 18,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <View sx={{ mb: 8 }}>{icon}</View>
      <Text sx={{ color: "#0f172a", fontFamily: "Poppins-Bold" }}>{label}</Text>
    </Pressable>
  )
}

function CurrencyField({ label, value, onChangeText, suffix, danger }: { label?: string; value: string; onChangeText: (v: string) => void; suffix?: string; danger?: boolean }) {
  return (
    <View sx={{ flex: 1 }}>
      {label ? <Text sx={{ color: "#0f172a", fontFamily: "Poppins-Bold", mb: 8 }}>{label}</Text> : null}
      <View
        sx={{
          flexDirection: "row",
          alignItems: "center",
          borderWidth: 1,
          borderColor: danger ? "#ef4444" : "#e6eef7",
          borderRadius: 20,
          bg: "#fff",
          overflow: "hidden",
        }}
      >
        <View sx={{ px: 14, py: 14, bg: "#fff", borderRightWidth: 1, borderRightColor: "#e6eef7" }}>
          <Text sx={{ color: "#0f172a", fontFamily: "Poppins-Bold" }}>₱</Text>
        </View>
        <TextInput
          keyboardType="numeric"
          value={value}
          onChangeText={onChangeText}
          placeholder="0.00"
          placeholderTextColor="#93a3b5"
          sx={{ flex: 1, px: 14, py: 14, color: "#0f172a", fontSize: 16 }}
        />
        {suffix ? (
          <View sx={{ px: 14, py: 14 }}>
            <Text sx={{ color: "#64748b", fontFamily: "Poppins-Bold" }}>{suffix}</Text>
          </View>
        ) : null}
      </View>
    </View>
  )
}

function SuggestionChips({
  label,
  options,
  onPick,
}: {
  label: string
  options: (string | undefined)[]
  onPick: (v: string) => void
}) {
  const valid = options.filter(Boolean) as string[]
  if (valid.length === 0) return null

  return (
    <View sx={{ mt: 12 }}>
      <Text sx={{ color: "#64748b", mb: 8 }}>{label}</Text>
      <View sx={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
        {valid.map((o) => (
          <Pressable
            key={o}
            onPress={() => onPick(o)}
            sx={{
              px: 12,
              py: 8,
              borderRadius: 999,
              bg: "#eaf4ff",
              borderWidth: 1,
              borderColor: "#e6eef7",
            }}
          >
            <Text sx={{ color: "#1e86ff", fontFamily: "Poppins-Bold" }}>{o}</Text>
          </Pressable>
        ))}
      </View>
    </View>
  )
}

/* ---------- tiny utilities ---------- */

function yesNo(v?: boolean | null) {
  if (v === true) return "Yes"
  if (v === false) return "No"
  return "—"
}

function formatSchedule(dateISO?: string | null, timeISO?: string | null) {
  if (!dateISO && !timeISO) return "—"
  const d = dateISO ? new Date(dateISO) : null
  const t = timeISO ? new Date(timeISO) : null
  const date = d ? formatDate(d) : ""
  const time = t ? formatTime(t) : ""
  return `${date}${date && time ? " • " : ""}${time}`
}

function formatDate(d: Date) {
  const dd = String(d.getDate()).padStart(2, "0")
  const mm = String(d.getMonth() + 1).padStart(2, "0")
  const yy = d.getFullYear()
  return `${dd}/${mm}/${yy}`
}

function formatTime(d: Date) {
  let h = d.getHours()
  const m = String(d.getMinutes()).padStart(2, "0")
  const am = h < 12 ? "AM" : "PM"
  h = h % 12 || 12
  return `${h}:${m} ${am}`
}