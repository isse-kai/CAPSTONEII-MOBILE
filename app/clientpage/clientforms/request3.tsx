import AsyncStorage from "@react-native-async-storage/async-storage";
import { Picker } from "@react-native-picker/picker";
import { ScrollView, Text, TextInput, View } from "dripsy";
import { useRouter } from "expo-router";
import { MotiView } from "moti";
import React, { useEffect, useMemo, useState } from "react";
import { Dimensions, ImageBackground, Pressable } from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import Header from "../clientnavbar/header";
import ClientNavbar from "../clientnavbar/navbar";

const { width, height } = Dimensions.get("window");

const C = {
  bg: "#f7f9fc",
  text: "#0f172a",
  sub: "#64748b",
  blue: "#1e86ff",
  border: "#d1d5db",
  placeholder: "#93a3b5",
  track: "#e5e7eb",
};

const STORAGE_KEY = "request_step3";

type RateType = "hour" | "job";

export default function ClientRequest3() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [rateType, setRateType] = useState<RateType | null>(null);
  const [rateFrom, setRateFrom] = useState("");
  const [rateTo, setRateTo] = useState("");
  const [jobFixed, setJobFixed] = useState("");
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        // ✅ Load local step 3 saved data only
        const rawStep3 = await AsyncStorage.getItem(STORAGE_KEY);
        if (rawStep3) {
          const v3 = JSON.parse(rawStep3);
          setRateType(v3.rateType ?? null);
          setRateFrom(v3.rateFrom ?? "");
          setRateTo(v3.rateTo ?? "");
          setJobFixed(v3.jobFixed ?? "");
        }
      } catch (e) {
        console.error("Error loading step3:", e);
      }
    })();
  }, []);

  const canNext = useMemo(() => {
    if (rateType === "hour") {
      const f = Number(rateFrom);
      const t = Number(rateTo);
      return !!rateFrom && !!rateTo && f > 0 && t >= f;
    }
    if (rateType === "job") {
      const p = Number(jobFixed);
      return !!jobFixed && p > 0;
    }
    return false;
  }, [rateType, rateFrom, rateTo, jobFixed]);

  const onNext = async () => {
    setSubmitted(true);
    if (!canNext) return;

    const payload = { rateType, rateFrom, rateTo, jobFixed };
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(payload));

    router.push("./request4");
  };

  return (
    <ImageBackground
      source={require("../../../assets/welcome.jpg")}
      resizeMode="cover"
      style={{ flex: 1, width, height }}
    >
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: "rgba(249, 250, 251, 0.9)",
          paddingBottom: insets.bottom,
        }}
      >
        <ScrollView
          contentContainerStyle={{ paddingHorizontal: 18, paddingBottom: 20 }}
          showsVerticalScrollIndicator={false}
        >
          <MotiView
            from={{ opacity: 0, translateY: 20 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: "timing", duration: 500 }}
          >
            <Header />

            {/* Step status */}
            <View sx={{ mb: 20 }}>
              <Text
                sx={{ fontSize: 18, fontFamily: "Poppins-Bold", color: C.text }}
              >
                Step 3 of 4
              </Text>
              <Text
                sx={{
                  fontSize: 14,
                  fontFamily: "Poppins-Regular",
                  color: C.sub,
                }}
              >
                Set Your Price Rate
              </Text>
              <View sx={{ flexDirection: "row", mt: 10, columnGap: 12 }}>
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

            {/* Rate Info Card */}
            <View
              style={{
                backgroundColor: "#ffffffcc",
                borderRadius: 12,
                padding: 16,
                marginBottom: 20,
              }}
            >
              <Text sx={{ fontSize: 18, fontFamily: "Poppins-Bold", mb: 12 }}>
                Pricing Details
              </Text>

              {/* RATE TYPE */}
              <View style={{ marginBottom: 12 }}>
                <Text sx={{ fontSize: 12, fontFamily: "Poppins-Bold", mb: 4 }}>
                  RATE TYPE:
                </Text>
                <View
                  style={{
                    borderWidth: 1,
                    borderColor: C.border,
                    borderRadius: 8,
                    backgroundColor: "#fff",
                  }}
                >
                  <Picker
                    selectedValue={rateType}
                    onValueChange={(val) => setRateType(val)}
                    style={{
                      fontSize: 14,
                      fontFamily: "Poppins-Regular",
                      color: C.text,
                    }}
                  >
                    <Picker.Item
                      label="Select rate type"
                      value={null}
                      color={C.placeholder}
                    />
                    <Picker.Item
                      label="Hourly Rate"
                      value="hour"
                      color={C.text}
                    />
                    <Picker.Item
                      label="By the Job Rate"
                      value="job"
                      color={C.text}
                    />
                  </Picker>
                </View>
              </View>

              {/* HOURLY RATE */}
              {rateType === "hour" && (
                <>
                  <View style={{ marginBottom: 12 }}>
                    <Text
                      sx={{ fontSize: 12, fontFamily: "Poppins-Bold", mb: 4 }}
                    >
                      FROM (₱/hr):
                    </Text>
                    <TextInput
                      value={rateFrom}
                      onChangeText={setRateFrom}
                      placeholder="₱"
                      keyboardType="numeric"
                      style={{
                        borderWidth: 1,
                        borderColor: C.border,
                        borderRadius: 8,
                        backgroundColor: "#fff",
                        padding: 12,
                        fontSize: 14,
                        fontFamily: "Poppins-Regular",
                        color: C.text,
                      }}
                    />
                  </View>

                  <View style={{ marginBottom: 12 }}>
                    <Text
                      sx={{ fontSize: 12, fontFamily: "Poppins-Bold", mb: 4 }}
                    >
                      TO (₱/hr):
                    </Text>
                    <TextInput
                      value={rateTo}
                      onChangeText={setRateTo}
                      placeholder="₱"
                      keyboardType="numeric"
                      style={{
                        borderWidth: 1,
                        borderColor: C.border,
                        borderRadius: 8,
                        backgroundColor: "#fff",
                        padding: 12,
                        fontSize: 14,
                        fontFamily: "Poppins-Regular",
                        color: C.text,
                      }}
                    />
                  </View>

                  {submitted && Number(rateFrom) <= 0 && (
                    <Text sx={{ color: "#ef4444", fontSize: 12, mt: 4 }}>
                      Enter a valid starting hourly rate.
                    </Text>
                  )}
                  {submitted && Number(rateTo) < Number(rateFrom) && (
                    <Text sx={{ color: "#ef4444", fontSize: 12, mt: 4 }}>
                      &#39;To&#39; rate should be greater than or equal to
                      &#39;From&#39;.
                    </Text>
                  )}
                </>
              )}

              {/* JOB RATE */}
              {rateType === "job" && (
                <View style={{ marginBottom: 12 }}>
                  <Text
                    sx={{ fontSize: 12, fontFamily: "Poppins-Bold", mb: 4 }}
                  >
                    FIXED PRICE (₱):
                  </Text>
                  <TextInput
                    value={jobFixed}
                    onChangeText={setJobFixed}
                    placeholder="₱"
                    keyboardType="numeric"
                    style={{
                      borderWidth: 1,
                      borderColor: C.border,
                      borderRadius: 8,
                      backgroundColor: "#fff",
                      padding: 12,
                      fontSize: 14,
                      fontFamily: "Poppins-Regular",
                      color: C.text,
                    }}
                  />

                  {submitted && Number(jobFixed) <= 0 && (
                    <Text sx={{ color: "#ef4444", fontSize: 12, mt: 4 }}>
                      Enter a valid fixed price.
                    </Text>
                  )}
                </View>
              )}
            </View>
          </MotiView>
        </ScrollView>

        {/* Sticky bottom actions */}
        <View
          style={{
            flexDirection: "row",
            paddingHorizontal: 18,
            paddingBottom: Math.max(insets.bottom, 12),
            paddingTop: 10,
            backgroundColor: "#fff",
            borderTopLeftRadius: 12,
            borderTopRightRadius: 12,
            shadowColor: "#000",
            shadowOpacity: 0.2,
            shadowRadius: 6,
            elevation: 6,
          }}
        >
          <Pressable
            onPress={() => router.back()}
            style={{
              flex: 1,
              borderWidth: 1,
              borderColor: C.border,
              borderRadius: 18,
              alignItems: "center",
              justifyContent: "center",
              paddingVertical: 8,
              backgroundColor: "#fff",
            }}
          >
            <Text sx={{ color: C.text, fontWeight: "900", fontSize: 16 }}>
              Back : Step 2
            </Text>
          </Pressable>

          <Pressable
            onPress={onNext}
            disabled={!canNext}
            style={{
              flex: 1.25,
              borderRadius: 18,
              alignItems: "flex-start",
              justifyContent: "center",
              paddingVertical: 12,
              backgroundColor: canNext ? C.blue : "#a7c8ff",
              opacity: canNext ? 1 : 0.9,
              marginLeft: 12,
            }}
          >
            <Text
              sx={{
                color: "#fff",
                fontWeight: "900",
                fontSize: 16,
                paddingLeft: 14,
              }}
            >
              Next : Terms and Agreement
            </Text>
          </Pressable>
        </View>

        <ClientNavbar />
      </SafeAreaView>
    </ImageBackground>
  );
}
