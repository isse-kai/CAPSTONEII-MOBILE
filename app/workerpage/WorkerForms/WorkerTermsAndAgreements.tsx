// app/workerpage/WorkerForms/WorkerTermsAndAgreements.tsx
import { Ionicons } from "@expo/vector-icons"
import { Pressable, Text } from "dripsy"
import { useFonts } from "expo-font"
import { useRouter } from "expo-router"
import { MotiView } from "moti"
import React, { useEffect, useState } from "react"
import {
    Alert,
    ImageBackground,
    Linking,
    ScrollView,
    View,
} from "react-native"
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context"

import {
    handleGetWorkerAgreements,
    handleSaveWorkerAgreements,
} from "../../../supabase/controllers/workerinformationcontroller"
import { getCurrentUser } from "../../../supabase/services/loginservice"
import WorkerHeader from "../workernavbar/header"
import WorkerNavbar from "../workernavbar/navbar"

export default function WorkerTermsAndAgreements() {
  const router = useRouter()
  const insets = useSafeAreaInsets()

  const [fontsLoaded] = useFonts({
    "Poppins-Regular": require("../../../assets/fonts/Poppins/Poppins-Regular.ttf"),
    "Poppins-Bold": require("../../../assets/fonts/Poppins/Poppins-Bold.ttf"),
    "Poppins-ExtraBold": require("../../../assets/fonts/Poppins/Poppins-ExtraBold.ttf"),
  })

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [authUid, setAuthUid] = useState<string | null>(null)

  const [consentBackgroundCheck, setConsentBackgroundCheck] = useState(false)
  const [agreeTermsPrivacy, setAgreeTermsPrivacy] = useState(false)
  const [consentDataPrivacy, setConsentDataPrivacy] = useState(false)

  useEffect(() => {
    const load = async () => {
      try {
        const authUser = await getCurrentUser()
        setAuthUid(authUser.id)

        // TEMP: currently returns null, but keep for future real DB
        const existing: any = await handleGetWorkerAgreements(authUser.id)

        if (existing) {
          if (typeof existing.consent_background_check === "boolean") {
            setConsentBackgroundCheck(existing.consent_background_check)
          }
          if (typeof existing.agree_terms_privacy === "boolean") {
            setAgreeTermsPrivacy(existing.agree_terms_privacy)
          }
          if (typeof existing.consent_data_privacy === "boolean") {
            setConsentDataPrivacy(existing.consent_data_privacy)
          }
        }
      } catch (err) {
        console.error("Failed to load worker agreements", err)
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [])

  const labelStyle = {
    fontSize: 18,
    fontFamily: "Poppins-Bold" as const,
    color: "#111827",
  }

  const renderCheckboxRow = ({
    checked,
    onToggle,
    title,
    subtitle,
    showLink,
  }: {
    checked: boolean
    onToggle: () => void
    title: string
    subtitle: string
    showLink?: boolean
  }) => (
    <Pressable
      onPress={onToggle}
      sx={{
        flexDirection: "row",
        alignItems: "flex-start",
        py: 10,
      }}
    >
      {/* Checkbox icon */}
      <View style={{ paddingTop: 2, marginRight: 12 }}>
        <Ionicons
          name={checked ? "checkbox-outline" : "square-outline"}
          size={22}
          color={checked ? "#008CFC" : "#9ca3af"}
        />
      </View>

      {/* Text content */}
      <View style={{ flex: 1 }}>
        <Text
          sx={{
            fontSize: 13,
            fontFamily: "Poppins-Regular",
            color: "#111827",
          }}
        >
          {title}
          <Text
            sx={{
              fontSize: 13,
              fontFamily: "Poppins-Regular",
              color: "#dc2626",
            }}
          >
            {" "}
            *
          </Text>
        </Text>

        {subtitle ? (
          <Text
            sx={{
              fontSize: 11,
              fontFamily: "Poppins-Regular",
              color: "#6b7280",
              mt: 2,
            }}
          >
            {subtitle}
          </Text>
        ) : null}

        {showLink && (
          <Pressable
            onPress={() => {
              // TODO: replace with your real JD HOMECARE TOS URL
              Linking.openURL("https://example.com/terms-and-privacy")
            }}
          >
            <Text
              sx={{
                fontSize: 11,
                fontFamily: "Poppins-Regular",
                color: "#2563eb",
                mt: 4,
                textDecorationLine: "underline",
              }}
            >
              View Terms of Service and Privacy Policy
            </Text>
          </Pressable>
        )}
      </View>
    </Pressable>
  )

  const handleNext = async () => {
    if (!authUid) return

    if (!consentBackgroundCheck || !agreeTermsPrivacy || !consentDataPrivacy) {
      Alert.alert(
        "Agreements required",
        "Please agree to all terms and agreements before continuing.",
      )
      return
    }

    try {
      setSaving(true)

      await handleSaveWorkerAgreements(authUid, {
        consent_background_check: consentBackgroundCheck,
        agree_terms_privacy: agreeTermsPrivacy,
        consent_data_privacy: consentDataPrivacy,
      })

      // Go to review step – adjust path if your review screen name is different
      router.push("/workerpage/WorkerForms/WorkerReviewApplication")
    } catch (err) {
      console.error("Failed to save worker agreements", err)
      Alert.alert("Error", "Could not save your agreements.")
    } finally {
      setSaving(false)
    }
  }

  if (!fontsLoaded || loading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#f9fafb",
        }}
      >
        <Text
          sx={{
            fontFamily: "Poppins-Regular",
            fontSize: 16,
          }}
        >
          Loading...
        </Text>
      </View>
    )
  }

  return (
    <ImageBackground
      source={require("../../../assets/login.jpg")}
      style={{ flex: 1 }}
      resizeMode="cover"
    >
      <SafeAreaView
        style={{
          flex: 1,
          paddingBottom: insets.bottom,
          backgroundColor: "rgba(249, 250, 251, 0.92)",
        }}
      >
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            paddingHorizontal: 18,
            paddingBottom: 100,
          }}
          showsVerticalScrollIndicator={false}
        >
          <MotiView
            from={{ opacity: 0, translateY: 16 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: "timing", duration: 400 }}
            style={{ flex: 1 }}
          >
            <WorkerHeader />

            {/* Step header */}
            <View
              style={{
                marginTop: 8,
                marginBottom: 16,
              }}
            >
              <Text
                sx={{
                  fontSize: 12,
                  fontFamily: "Poppins-Regular",
                  color: "#6b7280",
                }}
              >
                5 of 6 | Post a Worker Application
              </Text>
              <Text
                sx={{
                  fontSize: 24,
                  fontFamily: "Poppins-ExtraBold",
                  color: "#111827",
                  mt: 4,
                }}
              >
                Step 5: Terms & Agreements
              </Text>
              <Text
                sx={{
                  fontSize: 22,
                  fontFamily: "Poppins-Bold",
                  color: "#111827",
                  mt: 12,
                }}
              >
                Terms & Agreements
              </Text>

              {/* progress bar */}
              <View
                style={{
                  marginTop: 12,
                  height: 6,
                  borderRadius: 999,
                  backgroundColor: "#e5e7eb",
                  overflow: "hidden",
                }}
              >
                <View
                  style={{
                    width: "80%", // step 5 of 6
                    height: "100%",
                    backgroundColor: "#008CFC",
                  }}
                />
              </View>
            </View>

            {/* Card container */}
            <View
              style={{
                backgroundColor: "#ffffffcc",
                borderRadius: 16,
                padding: 16,
                marginBottom: 16,
                shadowColor: "#000",
                shadowOpacity: 0.06,
                shadowRadius: 6,
                shadowOffset: { width: 0, height: 3 },
                elevation: 3,
              }}
            >
              <Text sx={labelStyle}>Agreements</Text>

              <View
                style={{
                  marginTop: 10,
                  borderTopWidth: 1,
                  borderTopColor: "#e5e7eb",
                  paddingTop: 4,
                }}
              />

              {renderCheckboxRow({
                checked: consentBackgroundCheck,
                onToggle: () =>
                  setConsentBackgroundCheck((prev) => !prev),
                title: "I consent to background checks and verify my documents.",
                subtitle:
                  "JD HOMECARE may verify the authenticity of your submitted documents.",
              })}

              {renderCheckboxRow({
                checked: agreeTermsPrivacy,
                onToggle: () => setAgreeTermsPrivacy((prev) => !prev),
                title:
                  "I agree to JD HOMECARE's Terms of Service and Privacy Policy.",
                subtitle: "",
                showLink: true,
              })}

              {renderCheckboxRow({
                checked: consentDataPrivacy,
                onToggle: () => setConsentDataPrivacy((prev) => !prev),
                title:
                  "I consent to the collection and processing of my personal data in accordance with the Data Privacy Act (RA 10173).",
                subtitle:
                  "Your data will be protected and processed in compliance with Philippine law.",
              })}
            </View>

            {/* Footer buttons */}
            <View
              style={{
                flexDirection: "row",
                columnGap: 10,
                marginTop: 8,
              }}
            >
              <Pressable
                onPress={() =>
                  router.push("/workerpage/WorkerForms/WorkerPriceRate")
                }
                sx={{
                  flex: 1,
                  borderRadius: 999,
                  borderWidth: 1,
                  borderColor: "#d1d5db",
                  bg: "#ffffffee",
                  py: 12,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Text
                  sx={{
                    fontSize: 14,
                    fontFamily: "Poppins-Bold",
                    color: "#374151",
                  }}
                >
                  Back: Set Your Price Rate
                </Text>
              </Pressable>

              <Pressable
                onPress={handleNext}
                disabled={saving}
                sx={{
                  flex: 1,
                  borderRadius: 999,
                  bg: "#008CFC",
                  py: 12,
                  alignItems: "center",
                  justifyContent: "center",
                  opacity: saving ? 0.7 : 1,
                }}
              >
                <Text
                  sx={{
                    fontSize: 14,
                    fontFamily: "Poppins-Bold",
                    color: "#fff",
                  }}
                >
                  {saving ? "Saving..." : "Next: Review Application"}
                </Text>
              </Pressable>
            </View>
          </MotiView>
        </ScrollView>

        <WorkerNavbar />
      </SafeAreaView>
    </ImageBackground>
  )
}
