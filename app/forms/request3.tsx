// app/request/rate.tsx
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Image, Pressable, ScrollView, Text, TextInput, View } from "dripsy";
import { useRouter, type Href } from "expo-router";
import { ArrowLeft, Banknote, Clock } from "lucide-react-native";
import React, { useEffect, useMemo, useState } from "react";
import { Dimensions } from "react-native";

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

const STORAGE_KEY = "request_step3";
const NEXT_ROUTE = "/forms/requestpreview" as Href; // change to '/request/review' when ready

type RateType = "hour" | "job";

export default function RateScreen() {
  const router = useRouter();

  const [rateType, setRateType] = useState<RateType | null>(null);
  const [hourFrom, setHourFrom] = useState("");
  const [hourTo, setHourTo] = useState("");
  const [jobFixed, setJobFixed] = useState("");

  // hydrate from draft (if user comes back)
  useEffect(() => {
    (async () => {
      try {
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

  // validation
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
    if (!canNext) return;
    await AsyncStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        rateType,
        hourFrom,
        hourTo,
        jobFixed,
      })
    );
    router.push(NEXT_ROUTE);
  };

  // helpers
  const onlyMoney = (s: string) => {
    // keep digits + single dot
    const cleaned = s.replace(/[^\d.]/g, "");
    const parts = cleaned.split(".");
    if (parts.length <= 1) return cleaned;
    return parts[0] + "." + parts.slice(1).join("");
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

        <Pressable
          onPress={() => router.back()}
          sx={{ width: 40, height: 40, alignItems: "center", justifyContent: "center" }}
        >
          <ArrowLeft color={C.text} size={26} strokeWidth={2.4} />
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 96 }} showsVerticalScrollIndicator={false}>
        <View sx={{ px: 14, pt: 12 }}>
          <Text sx={{ color: C.sub, fontSize: 12, mb: 6 }}>3 of 4 | Post a Service Request</Text>
          <Text sx={{ color: C.text, fontSize: 24, fontWeight: "900", mb: 14 }}>
            Step 3: Set Your Price Rate
          </Text>

          <Text sx={{ color: C.text, fontSize: 18, fontWeight: "800" }}>Service Request Price Rate</Text>
          <Text sx={{ color: C.sub, mt: 4, mb: 14 }}>
            Please choose the service rate type and enter the price.
          </Text>

          {/* Rate type selector */}
          <View sx={{ flexDirection: "row", gap: 10, mb: 14 }}>
            <RateCard
              label="By the hour"
              icon={<Clock color={rateType === "hour" ? C.blue : C.sub} size={20} />}
              active={rateType === "hour"}
              onPress={() => setRateType("hour")}
            />
            <RateCard
              label="By the job"
              icon={<Banknote color={rateType === "job" ? C.blue : C.sub} size={20} />}
              active={rateType === "job"}
              onPress={() => setRateType("job")}
            />
          </View>

          {/* Hourly range */}
          {rateType === "hour" && (
            <>
              <Text sx={{ color: C.text, fontWeight: "700", mb: 8 }}>Enter the Rate (Per Hour)</Text>
              <View sx={{ flexDirection: "row", gap: 10 }}>
                <CurrencyField
                  label="From"
                  value={hourFrom}
                  onChangeText={(v) => setHourFrom(onlyMoney(v))}
                />
                <CurrencyField
                  label="To"
                  value={hourTo}
                  onChangeText={(v) => setHourTo(onlyMoney(v))}
                />
              </View>
              <Text sx={{ color: C.sub, mt: 8, mb: 16 }}>
                This is the average rate for similar home services.
              </Text>

              <Text sx={{ color: C.sub, lineHeight: 20 }}>
                Our workers offer affordable rates for services like plumbing, carpentry, electrical work, car washing,
                and laundry. Prices may vary depending on the job, so feel free to talk with your service provider to
                agree on what works best.
              </Text>
            </>
          )}

          {/* Job fixed price */}
          {rateType === "job" && (
            <>
              <Text sx={{ color: C.text, fontWeight: "700", mb: 8 }}>Enter the Rate</Text>
              <CurrencyField
                value={jobFixed}
                onChangeText={(v) => setJobFixed(onlyMoney(v))}
              />
              <Text sx={{ color: C.sub, mt: 8, mb: 16 }}>
                Set a fixed price for the service request.
              </Text>

              <Text sx={{ color: C.sub, lineHeight: 20 }}>
                The fixed price is an amount that you and the service provider can discuss and agree on together. Feel
                free to negotiate the price based on the scope of the work.
              </Text>
            </>
          )}
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
          <Text sx={{ color: C.text, fontWeight: "800" }}>Back : Step 2</Text>
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
          <Text sx={{ color: "#fff", fontWeight: "800" }}>Review Service Request</Text>
        </Pressable>
      </View>
    </View>
  );
}

/* ---------- tiny components ---------- */

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
        borderRadius: 12,
        bg: active ? "#eaf4ff" : C.fieldBg,
        py: 16,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <View sx={{ mb: 8 }}>{icon}</View>
      <Text sx={{ color: C.text, fontWeight: "800" }}>{label}</Text>
    </Pressable>
  );
}

function CurrencyField({
  label,
  value,
  onChangeText,
}: {
  label?: string;
  value: string;
  onChangeText: (v: string) => void;
}) {
  return (
    <View sx={{ flex: 1 }}>
      {label ? <Text sx={{ color: C.text, mb: 6 }}>{label}</Text> : null}
      <View
        sx={{
          flexDirection: "row",
          alignItems: "center",
          borderWidth: 1,
          borderColor: C.border,
          borderRadius: 10,
          bg: C.fieldBg,
          overflow: "hidden",
        }}
      >
        <View
          sx={{
            px: 12,
            py: 12,
            bg: "#fff",
            borderRightWidth: 1,
            borderRightColor: C.border,
          }}
        >
          <Text sx={{ color: C.text }}>₱</Text>
        </View>
        <TextInput
          keyboardType="numeric"
          value={value}
          onChangeText={onChangeText}
          placeholder="0.00"
          placeholderTextColor={C.placeholder}
          sx={{ flex: 1, px: 12, py: 12, color: C.text }}
        />
      </View>
    </View>
  );
}
