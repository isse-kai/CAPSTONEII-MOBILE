import AsyncStorage from "@react-native-async-storage/async-storage";
import { ScrollView, Text, View } from "dripsy";
import { useRouter } from "expo-router";
import { MotiView } from "moti";
import React, { useEffect, useState } from "react";
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
  track: "#e5e7eb",
};

const STORAGE_KEY = "request_step4";

export default function ClientRequestTerms() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [consentBackground, setConsentBackground] = useState(false);
  const [consentTerms, setConsentTerms] = useState(false);
  const [consentDataPrivacy, setConsentDataPrivacy] = useState(false);

  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const rawTerms = await AsyncStorage.getItem(STORAGE_KEY);
        if (rawTerms) {
          const v = JSON.parse(rawTerms);
          setConsentBackground(v.consent_background_checks ?? false);
          setConsentTerms(v.consent_terms_privacy ?? false);
          setConsentDataPrivacy(v.consent_data_privacy ?? false);
        }
      } catch (e) {
        console.error("Error loading step4:", e);
      }
    })();
  }, []);

  const canNext = consentBackground && consentTerms && consentDataPrivacy;

  const onNext = async () => {
    setSubmitted(true);
    if (!canNext) return;

    const payload = {
      consent_background_checks: consentBackground,
      consent_terms_privacy: consentTerms,
      consent_data_privacy: consentDataPrivacy,
    };

    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    router.push("./requestpreview");
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
                Step 4 of 4
              </Text>
              <Text
                sx={{
                  fontSize: 14,
                  fontFamily: "Poppins-Regular",
                  color: C.sub,
                }}
              >
                Terms and Agreement
              </Text>
              <View sx={{ flexDirection: "row", mt: 10, columnGap: 12 }}>
                {[1, 2, 3, 4].map((i) => (
                  <View
                    key={i}
                    sx={{
                      flex: 1,
                      height: 10,
                      borderRadius: 999,
                      bg: i <= 4 ? C.blue : C.track,
                    }}
                  />
                ))}
              </View>
            </View>

            {/* Parent Card with three inner cards */}
            <View
              style={{
                backgroundColor: "#ffffffcc",
                borderRadius: 12,
                padding: 16,
                marginBottom: 20,
              }}
            >
              <Text sx={{ fontSize: 18, fontFamily: "Poppins-Bold", mb: 12 }}>
                Agreements
              </Text>

              {/* Background Checks */}
              <Pressable
                onPress={() => setConsentBackground(!consentBackground)}
                style={{
                  borderWidth: 1,
                  borderColor: consentBackground ? C.blue : C.border,
                  borderRadius: 8,
                  padding: 12,
                  marginBottom: 12,
                  backgroundColor: "#fff",
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginBottom: 8,
                  }}
                >
                  <View
                    style={{
                      width: 20,
                      height: 20,
                      marginRight: 10,
                      borderWidth: 1,
                      borderColor: C.border,
                      backgroundColor: consentBackground ? C.blue : "#fff",
                    }}
                  />
                  <Text
                    sx={{
                      fontSize: 16,
                      fontFamily: "Poppins-Bold",
                      color: C.text,
                    }}
                  >
                    Background Checks
                  </Text>
                </View>
                <Text
                  sx={{
                    fontSize: 14,
                    fontFamily: "Poppins-Regular",
                    color: C.text,
                  }}
                >
                  I consent to background checks and verify my documents.
                </Text>
              </Pressable>

              {/* Terms & Privacy */}
              <Pressable
                onPress={() => setConsentTerms(!consentTerms)}
                style={{
                  borderWidth: 1,
                  borderColor: consentTerms ? C.blue : C.border,
                  borderRadius: 8,
                  padding: 12,
                  marginBottom: 12,
                  backgroundColor: "#fff",
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginBottom: 8,
                  }}
                >
                  <View
                    style={{
                      width: 20,
                      height: 20,
                      marginRight: 10,
                      borderWidth: 1,
                      borderColor: C.border,
                      backgroundColor: consentTerms ? C.blue : "#fff",
                    }}
                  />
                  <Text
                    sx={{
                      fontSize: 16,
                      fontFamily: "Poppins-Bold",
                      color: C.text,
                    }}
                  >
                    Terms & Privacy
                  </Text>
                </View>
                <Text
                  sx={{
                    fontSize: 14,
                    fontFamily: "Poppins-Regular",
                    color: C.text,
                  }}
                >
                  I agree to JD HOMECARE&apos;s Terms of Service and Privacy
                  Policy.
                </Text>
              </Pressable>

              {/* Data Privacy */}
              <Pressable
                onPress={() => setConsentDataPrivacy(!consentDataPrivacy)}
                style={{
                  borderWidth: 1,
                  borderColor: consentDataPrivacy ? C.blue : C.border,
                  borderRadius: 8,
                  padding: 12,
                  backgroundColor: "#fff",
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginBottom: 8,
                  }}
                >
                  <View
                    style={{
                      width: 20,
                      height: 20,
                      marginRight: 10,
                      borderWidth: 1,
                      borderColor: C.border,
                      backgroundColor: consentDataPrivacy ? C.blue : "#fff",
                    }}
                  />
                  <Text
                    sx={{
                      fontSize: 16,
                      fontFamily: "Poppins-Bold",
                      color: C.text,
                    }}
                  >
                    Data Privacy
                  </Text>
                </View>
                <Text
                  sx={{
                    fontSize: 14,
                    fontFamily: "Poppins-Regular",
                    color: C.text,
                  }}
                >
                  I consent to the collection and processing of my personal data
                  in accordance with the Data Privacy Act (RA 10173).
                </Text>
              </Pressable>

              {submitted && !canNext && (
                <Text sx={{ color: "#ef4444", fontSize: 12, mt: 8 }}>
                  You must agree to all three items to continue.
                </Text>
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
              Back : Step 3
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
              Next : Request Preview
            </Text>
          </Pressable>
        </View>

        <ClientNavbar />
      </SafeAreaView>
    </ImageBackground>
  );
}
