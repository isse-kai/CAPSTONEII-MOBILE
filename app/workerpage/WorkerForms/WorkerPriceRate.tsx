// app/workerpage/WorkerForms/WorkerPriceRate.tsx
import { Ionicons } from "@expo/vector-icons"
import { Pressable, Text } from "dripsy"
import { useFonts } from "expo-font"
import { useRouter } from "expo-router"
import { MotiView } from "moti"
import React, { useEffect, useState } from "react"
import {
    Alert,
    ImageBackground,
    ScrollView,
    TextInput,
    View,
} from "react-native"
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context"

import {
    handleGetWorkerRate,
    handleSaveWorkerRate,
} from "../../../supabase/controllers/workerinformationcontroller"
import { getCurrentUser } from "../../../supabase/services/loginservice"
import { WorkerRateType } from "../../../supabase/services/workerinformationservice"
import WorkerHeader from "../workernavbar/header"
import WorkerNavbar from "../workernavbar/navbar"

export default function WorkerPriceRate() {
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

  const [rateType, setRateType] = useState<WorkerRateType>("hourly")
  const [hourlyMin, setHourlyMin] = useState<string>("")
  const [hourlyMax, setHourlyMax] = useState<string>("")
  const [jobRate, setJobRate] = useState<string>("")

  useEffect(() => {
    const load = async () => {
      try {
        const authUser = await getCurrentUser()
        setAuthUid(authUser.id)

        // TEMP: service currently returns null; cast to any for safety
        const existing = (await handleGetWorkerRate(authUser.id)) as any

        if (existing) {
          if (existing.rate_type === "hourly" || existing.rate_type === "job") {
            setRateType(existing.rate_type)
          }
          if (existing.hourly_min_rate != null) {
            setHourlyMin(String(existing.hourly_min_rate))
          }
          if (existing.hourly_max_rate != null) {
            setHourlyMax(String(existing.hourly_max_rate))
          }
          if (existing.job_rate != null) {
            setJobRate(String(existing.job_rate))
          }
        }
      } catch (err) {
        console.error("Failed to load worker rate", err)
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [])

  const labelStyle = {
    fontSize: 14,
    fontFamily: "Poppins-Bold" as const,
    color: "#111827",
  }

  const pillBase = {
    flex: 1,
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 14,
    flexDirection: "row" as const,
    alignItems: "center" as const,
    columnGap: 10,
  }

  const renderRateTypePill = (
    type: WorkerRateType,
    title: string,
    subtitle: string,
    iconName: keyof typeof Ionicons.glyphMap,
  ) => {
    const selected = rateType === type

    return (
      <Pressable
        key={type}
        onPress={() => setRateType(type)}
        sx={{
          ...pillBase,
          borderWidth: 1,
          borderColor: selected ? "#008CFC" : "#e5e7eb",
          bg: selected ? "#e0f2fe" : "#f9fafb",
        }}
        style={{ marginRight: type === "hourly" ? 12 : 0 }}
      >
        <View
          style={{
            width: 36,
            height: 36,
            borderRadius: 18,
            backgroundColor: "#ffffff",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Ionicons
            name={iconName}
            size={20}
            color={selected ? "#008CFC" : "#6b7280"}
          />
        </View>
        <View style={{ flex: 1 }}>
          <Text
            sx={{
              fontSize: 14,
              fontFamily: "Poppins-Bold",
              color: "#111827",
            }}
          >
            {title}
          </Text>
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
        </View>
      </Pressable>
    )
  }

  const handleNext = async () => {
    if (!authUid) return

    if (rateType === "hourly") {
      const minVal = parseFloat(hourlyMin)
      const maxVal = parseFloat(hourlyMax)

      if (Number.isNaN(minVal) || Number.isNaN(maxVal)) {
        Alert.alert("Invalid rate", "Please enter valid numbers for hourly rate.")
        return
      }
      if (minVal <= 0 || maxVal <= 0) {
        Alert.alert(
          "Invalid rate",
          "Hourly rate must be greater than zero.",
        )
        return
      }
      if (minVal > maxVal) {
        Alert.alert(
          "Invalid range",
          "The 'From' amount cannot be greater than the 'To' amount.",
        )
        return
      }

      try {
        setSaving(true)

        await handleSaveWorkerRate(authUid, {
          rate_type: "hourly",
          hourly_min_rate: minVal,
          hourly_max_rate: maxVal,
          job_rate: null,
        })

        // go to Terms & Conditions step
        router.push("/workerpage/WorkerForms/WorkerTermsAndAgreements")
      } catch (err) {
        console.error("Failed to save worker rate", err)
        Alert.alert("Error", "Could not save your rate.")
      } finally {
        setSaving(false)
      }
    } else {
      const jobVal = parseFloat(jobRate)

      if (Number.isNaN(jobVal) || jobVal <= 0) {
        Alert.alert(
          "Invalid rate",
          "Please enter a valid fixed price greater than zero.",
        )
        return
      }

      try {
        setSaving(true)

        await handleSaveWorkerRate(authUid, {
          rate_type: "job",
          hourly_min_rate: null,
          hourly_max_rate: null,
          job_rate: jobVal,
        })

        router.push("/workerpage/WorkerForms/WorkerTermsAndAgreements")
      } catch (err) {
        console.error("Failed to save worker rate", err)
        Alert.alert("Error", "Could not save your rate.")
      } finally {
        setSaving(false)
      }
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
                4 of 6 | Post a Worker Application
              </Text>
              <Text
                sx={{
                  fontSize: 24,
                  fontFamily: "Poppins-ExtraBold",
                  color: "#111827",
                  mt: 4,
                }}
              >
                Step 4: Set Your Price Rate
              </Text>
              <Text
                sx={{
                  fontSize: 16,
                  fontFamily: "Poppins-Bold",
                  color: "#111827",
                  mt: 4,
                }}
              >
                Please choose your service rate
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
                    width: "65%", // 4 of 6-ish
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
              <Text
                sx={{
                  fontSize: 18,
                  fontFamily: "Poppins-Bold",
                  color: "#111827",
                  mb: 6,
                }}
              >
                Service Price Rate
              </Text>

              <Text
                sx={{
                  fontSize: 12,
                  fontFamily: "Poppins-Regular",
                  color: "#6b7280",
                  mb: 14,
                }}
              >
                Please choose the service rate type and enter the price.
              </Text>

              {/* Pills row */}
              <View
                style={{
                  flexDirection: "row",
                  marginBottom: 16,
                }}
              >
                {renderRateTypePill(
                  "hourly",
                  "Hourly Rate",
                  "Charge per hour of work",
                  "time-outline",
                )}
                {renderRateTypePill(
                  "job",
                  "By the Job Rate",
                  "Single fixed price",
                  "document-text-outline",
                )}
              </View>

              {/* Rate inputs */}
              {rateType === "hourly" ? (
                <>
                  <Text sx={labelStyle}>Enter the Rate (Per Hour)</Text>

                  <View
                    style={{
                      flexDirection: "row",
                      marginTop: 8,
                    }}
                  >
                    {/* From */}
                    <View style={{ flex: 1, marginRight: 8 }}>
                      <Text
                        sx={{
                          fontSize: 11,
                          fontFamily: "Poppins-Regular",
                          color: "#6b7280",
                          mb: 4,
                        }}
                      >
                        From
                      </Text>
                      <View
                        style={{
                          borderRadius: 12,
                          borderWidth: 1,
                          borderColor: "#e5e7eb",
                          backgroundColor: "#f9fafb",
                          flexDirection: "row",
                          alignItems: "center",
                          paddingHorizontal: 12,
                        }}
                      >
                        <Text
                          sx={{
                            fontSize: 16,
                            fontFamily: "Poppins-Bold",
                            color: "#6b7280",
                            mr: 6,
                          }}
                        >
                          ₱
                        </Text>
                        <TextInput
                          placeholder="0.00"
                          keyboardType="numeric"
                          value={hourlyMin}
                          onChangeText={setHourlyMin}
                          style={{
                            flex: 1,
                            paddingVertical: 10,
                            fontFamily: "Poppins-Regular",
                            fontSize: 14,
                            color: "#111827",
                          }}
                        />
                      </View>
                    </View>

                    {/* To */}
                    <View style={{ flex: 1 }}>
                      <Text
                        sx={{
                          fontSize: 11,
                          fontFamily: "Poppins-Regular",
                          color: "#6b7280",
                          mb: 4,
                        }}
                      >
                        To
                      </Text>
                      <View
                        style={{
                          borderRadius: 12,
                          borderWidth: 1,
                          borderColor: "#e5e7eb",
                          backgroundColor: "#f9fafb",
                          flexDirection: "row",
                          alignItems: "center",
                          paddingHorizontal: 12,
                        }}
                      >
                        <Text
                          sx={{
                            fontSize: 16,
                            fontFamily: "Poppins-Bold",
                            color: "#6b7280",
                            mr: 6,
                          }}
                        >
                          ₱
                        </Text>
                        <TextInput
                          placeholder="0.00"
                          keyboardType="numeric"
                          value={hourlyMax}
                          onChangeText={setHourlyMax}
                          style={{
                            flex: 1,
                            paddingVertical: 10,
                            fontFamily: "Poppins-Regular",
                            fontSize: 14,
                            color: "#111827",
                          }}
                        />
                      </View>
                    </View>
                  </View>

                  <Text
                    sx={{
                      mt: 8,
                      fontSize: 11,
                      fontFamily: "Poppins-Regular",
                      color: "#6b7280",
                    }}
                  >
                    This can be your usual hourly rate for home services.
                  </Text>
                  <Text
                    sx={{
                      mt: 2,
                      fontSize: 11,
                      fontFamily: "Poppins-Regular",
                      color: "#6b7280",
                    }}
                  >
                    Offer your budget-friendly rates for plumbing, carpentry,
                    electrical work, car washing, and laundry.
                  </Text>
                </>
              ) : (
                <>
                  <Text sx={labelStyle}>Enter the Rate</Text>

                  <View
                    style={{
                      marginTop: 8,
                    }}
                  >
                    <View
                      style={{
                        borderRadius: 12,
                        borderWidth: 1,
                        borderColor: "#e5e7eb",
                        backgroundColor: "#f9fafb",
                        flexDirection: "row",
                        alignItems: "center",
                        paddingHorizontal: 12,
                      }}
                    >
                      <Text
                        sx={{
                          fontSize: 16,
                          fontFamily: "Poppins-Bold",
                          color: "#6b7280",
                          mr: 6,
                        }}
                      >
                        ₱
                      </Text>
                      <TextInput
                        placeholder="0.00"
                        keyboardType="numeric"
                        value={jobRate}
                        onChangeText={setJobRate}
                        style={{
                          flex: 1,
                          paddingVertical: 10,
                          fontFamily: "Poppins-Regular",
                          fontSize: 14,
                          color: "#111827",
                        }}
                      />
                    </View>
                  </View>

                  <Text
                    sx={{
                      mt: 8,
                      fontSize: 11,
                      fontFamily: "Poppins-Regular",
                      color: "#6b7280",
                    }}
                  >
                    Set a fixed price for your service.
                  </Text>
                  <Text
                    sx={{
                      mt: 2,
                      fontSize: 11,
                      fontFamily: "Poppins-Regular",
                      color: "#6b7280",
                    }}
                  >
                    You and the client can discuss and agree on this fixed price
                    based on the scope of work.
                  </Text>
                </>
              )}
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
                  router.push("/workerpage/WorkerForms/WorkerRequiredDocuments")
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
                  Back: Required Documents
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
                  {saving ? "Saving..." : "Next: Terms & Condition Agreements"}
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
