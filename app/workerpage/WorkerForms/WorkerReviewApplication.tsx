// app/workerpage/WorkerForms/WorkerReviewApplication.tsx
import { Ionicons } from "@expo/vector-icons"
import { Pressable, Text } from "dripsy"
import { useFonts } from "expo-font"
import * as ImagePicker from "expo-image-picker"
import { useRouter } from "expo-router"
import { MotiView } from "moti"
import React, { useEffect, useState } from "react"
import {
    Alert,
    Image,
    Modal,
    ScrollView,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native"
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context"

import WorkerHeader from "../workernavbar/header"
import WorkerNavbar from "../workernavbar/navbar"

import {
    handleGetWorkerInformation,
    handleGetWorkerRate,
    handleGetWorkerWorkInformation,
} from "../../../supabase/controllers/workerinformationcontroller"
import { getCurrentUser } from "../../../supabase/services/loginservice"
import { WorkerRatePayload } from "../../../supabase/services/workerinformationservice"

interface PersonalInfo {
  first_name?: string
  last_name?: string
  contact_number?: string
  email_address?: string
  barangay?: string
  street?: string
  profile_picture_url?: string | null
}

interface WorkInfo {
  service_carpenter?: boolean
  service_electrician?: boolean
  service_plumber?: boolean
  service_carwasher?: boolean
  service_laundry?: boolean
  description?: string
  years_experience?: number | null
  has_own_tools?: boolean | null
}

const APPLICATION_FEE = 150

export default function WorkerReviewApplication() {
  const router = useRouter()
  const insets = useSafeAreaInsets()

  const [fontsLoaded] = useFonts({
    "Poppins-Regular": require("../../../assets/fonts/Poppins/Poppins-Regular.ttf"),
    "Poppins-Bold": require("../../../assets/fonts/Poppins/Poppins-Bold.ttf"),
    "Poppins-ExtraBold": require("../../../assets/fonts/Poppins/Poppins-ExtraBold.ttf"),
  })

  const [loading, setLoading] = useState(true)
  const [authUid, setAuthUid] = useState<string | null>(null)

  const [personal, setPersonal] = useState<PersonalInfo>({})
  const [work, setWork] = useState<WorkInfo>({})
  const [rate, setRate] = useState<WorkerRatePayload | null>(null)

  // payment modal state
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState<"qr" | "details">("qr")
  const [referenceNo, setReferenceNo] = useState("")
  const [paymentScreenshotUri, setPaymentScreenshotUri] = useState<string | null>(
    null,
  )
  const [paymentScreenshotName, setPaymentScreenshotName] = useState<string | null>(
    null,
  )

  // ---------- LOAD FROM SUPABASE (with data-wrapper fallback) ----------
  useEffect(() => {
    const load = async () => {
      try {
        const authUser = await getCurrentUser()
        setAuthUid(authUser.id)

        const [infoRaw, workRaw, rateRaw] = await Promise.all([
          handleGetWorkerInformation(authUser.id),
          handleGetWorkerWorkInformation(authUser.id),
          handleGetWorkerRate(authUser.id),
        ])

        const info =
          infoRaw && "data" in infoRaw && (infoRaw as any).data
            ? (infoRaw as any).data
            : infoRaw
        const workInfo =
          workRaw && "data" in workRaw && (workRaw as any).data
            ? (workRaw as any).data
            : workRaw
        const rateInfo =
          rateRaw && "data" in rateRaw && (rateRaw as any).data
            ? (rateRaw as any).data
            : rateRaw

        if (info) {
          setPersonal({
            first_name: (info as any).first_name,
            last_name: (info as any).last_name,
            contact_number: (info as any).contact_number,
            email_address: (info as any).email_address,
            barangay: (info as any).barangay,
            street: (info as any).street,
            profile_picture_url: (info as any).profile_picture_url,
          })
        }

        if (workInfo) setWork(workInfo as WorkInfo)
        if (rateInfo) setRate(rateInfo as WorkerRatePayload)

        // generate reference number once
        const ts = Date.now()
        const rand = Math.floor(Math.random() * 1000000)
        setReferenceNo(`JDK-${ts}-${rand}`)
      } catch (err) {
        console.error("Failed to load review data", err)
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [])

  // ---------- HELPERS ----------
  const fullName = `${personal.first_name || ""} ${personal.last_name || ""}`.trim()

  const serviceTypes = () => {
    const types: string[] = []
    if (work.service_carpenter) types.push("Carpenter")
    if (work.service_electrician) types.push("Electrician")
    if (work.service_plumber) types.push("Plumber")
    if (work.service_carwasher) types.push("Car Washer")
    if (work.service_laundry) types.push("Laundry")
    return types.length ? types.join(", ") : "Not specified"
  }

  const toolsProvidedLabel =
    work.has_own_tools == null ? "Not specified" : work.has_own_tools ? "Yes" : "No"

  const formatRateSummary = () => {
    if (!rate) return "Not specified"

    if (rate.rate_type === "hourly") {
      if (rate.hourly_min_rate != null && rate.hourly_max_rate != null) {
        return `₱${rate.hourly_min_rate} - ₱${rate.hourly_max_rate} per hour`
      }
      if (rate.hourly_min_rate != null) {
        return `From ₱${rate.hourly_min_rate} per hour`
      }
      if (rate.hourly_max_rate != null) {
        return `Up to ₱${rate.hourly_max_rate} per hour`
      }
      return "Hourly rate not set"
    }

    if (rate.rate_type === "job") {
      if (rate.job_rate != null) {
        return `₱${rate.job_rate} per job`
      }
      return "Job rate not set"
    }

    return "Not specified"
  }

  const rateTypeLabel = () => {
    if (!rate) return "Not specified"
    return rate.rate_type === "hourly" ? "Hourly Rate" : "By the Job Rate"
  }

  const handleSubmit = () => {
    if (!authUid) {
      Alert.alert("Session error", "Please log in again before paying.")
      return
    }
    setShowPaymentModal(true)
  }

  const handleConfirmPayment = () => {
    setShowPaymentModal(false)
    Alert.alert(
      "Payment submitted",
      "Your GCash payment will be verified. We will notify you once your worker application has been reviewed.",
      [
        {
          text: "OK",
          onPress: () => router.push("/workerpage/home"),
        },
      ],
    )
  }

  const handleChooseScreenshot = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync()
    if (permission.status !== "granted") {
      Alert.alert("Permission required", "Please allow access to your photos.")
      return
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      quality: 0.8,
    })

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const asset = result.assets[0]
      setPaymentScreenshotUri(asset.uri)
      setPaymentScreenshotName(asset.fileName ?? "Screenshot selected")
    }
  }

  // ---------- LOADING ----------
  if (!fontsLoaded || loading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#f3f4f6",
        }}
      >
        <Text
          sx={{
            fontFamily: "Poppins-Regular",
            fontSize: 16,
            color: "#6b7280",
          }}
        >
          Preparing your application summary...
        </Text>
      </View>
    )
  }

  // ---------- SHARED TEXT STYLES ----------
  const labelTitle = {
    fontSize: 16,
    fontFamily: "Poppins-Bold" as const,
    color: "#111827",
  }

  const labelKey = {
    fontSize: 12,
    fontFamily: "Poppins-Bold" as const,
    color: "#6b7280",
  }

  const labelValueLink = {
    fontSize: 13,
    fontFamily: "Poppins-Bold" as const,
    color: "#2563eb",
  }

  const labelValue = {
    fontSize: 13,
    fontFamily: "Poppins-Regular" as const,
    color: "#111827",
  }

  const cardStyle = {
    backgroundColor: "#ffffff",
    borderRadius: 18,
    padding: 16,
    marginBottom: 14,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  } as const

  // ---------- UI ----------
  return (
    <SafeAreaView
      style={{
        flex: 1,
        paddingBottom: insets.bottom,
        backgroundColor: "#f3f4f6",
      }}
    >
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          paddingHorizontal: 18,
          paddingBottom: 110,
        }}
        showsVerticalScrollIndicator={false}
      >
        <MotiView
          from={{ opacity: 0, translateY: 20 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: "timing", duration: 450 }}
          style={{ flex: 1 }}
        >
          <WorkerHeader />

          {/* Step header */}
          <View
            style={{
              marginTop: 10,
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
              6 of 6 | Post a Worker Application
            </Text>
            <Text
              sx={{
                fontSize: 24,
                fontFamily: "Poppins-ExtraBold",
                color: "#111827",
                mt: 4,
              }}
            >
              Step 6: Review Application
            </Text>
            <Text
              sx={{
                fontSize: 16,
                fontFamily: "Poppins-Regular",
                color: "#4b5563",
                mt: 4,
              }}
            >
              Make sure everything looks correct before you submit.
            </Text>

            {/* progress bar */}
            <View
              style={{
                marginTop: 14,
                height: 6,
                borderRadius: 999,
                backgroundColor: "#e5e7eb",
                overflow: "hidden",
              }}
            >
              <View
                style={{
                  width: "100%",
                  height: "100%",
                  backgroundColor: "#008CFC",
                }}
              />
            </View>
          </View>

          {/* SUMMARY HEADER CARD */}
          <View style={[cardStyle, { flexDirection: "row", alignItems: "center" }]}>
            <View
              style={{
                width: 72,
                height: 72,
                borderRadius: 72,
                overflow: "hidden",
                backgroundColor: "#e5e7eb",
                borderWidth: 2,
                borderColor: "#bfdbfe",
                marginRight: 14,
              }}
            >
              {personal.profile_picture_url ? (
                <Image
                  source={{ uri: personal.profile_picture_url }}
                  style={{ width: "100%", height: "100%" }}
                  resizeMode="cover"
                />
              ) : (
                <View
                  style={{
                    flex: 1,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Ionicons name="person-circle-outline" size={60} color="#9ca3af" />
                </View>
              )}
            </View>

            <View style={{ flex: 1 }}>
              <Text
                sx={{
                  fontSize: 18,
                  fontFamily: "Poppins-Bold",
                  color: "#111827",
                }}
              >
                {fullName || "Unnamed worker"}
              </Text>
              <Text
                sx={{
                  fontSize: 12,
                  fontFamily: "Poppins-Regular",
                  color: "#6b7280",
                  mt: 2,
                }}
              >
                {serviceTypes()}
              </Text>

              <View
                style={{
                  flexDirection: "row",
                  marginTop: 8,
                  alignItems: "center",
                }}
              >
                <View
                  style={{
                    paddingHorizontal: 10,
                    paddingVertical: 4,
                    borderRadius: 999,
                    backgroundColor: "#eff6ff",
                    marginRight: 6,
                  }}
                >
                  <Text
                    sx={{
                      fontSize: 11,
                      fontFamily: "Poppins-Bold",
                      color: "#1d4ed8",
                    }}
                  >
                    {rateTypeLabel()}
                  </Text>
                </View>

                <Text
                  sx={{
                    fontSize: 12,
                    fontFamily: "Poppins-Bold",
                    color: "#0f766e",
                  }}
                >
                  {formatRateSummary()}
                </Text>
              </View>
            </View>
          </View>

          {/* PERSONAL INFORMATION */}
          <View style={cardStyle}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginBottom: 10,
              }}
            >
              <View
                style={{
                  width: 26,
                  height: 26,
                  borderRadius: 13,
                  backgroundColor: "#dbeafe",
                  alignItems: "center",
                  justifyContent: "center",
                  marginRight: 8,
                }}
              >
                <Ionicons name="person-outline" size={16} color="#1d4ed8" />
              </View>
              <Text sx={labelTitle}>Personal Information</Text>
            </View>

            <View style={{ marginTop: 4 }}>
              <Text sx={labelKey}>Full Name</Text>
              <Text sx={labelValueLink}>{fullName || "—"}</Text>
            </View>

            <View
              style={{
                flexDirection: "row",
                marginTop: 10,
              }}
            >
              <View style={{ flex: 1, paddingRight: 6 }}>
                <Text sx={labelKey}>Contact Number</Text>
                <Text sx={labelValueLink}>
                  {personal.contact_number || "—"}
                </Text>
              </View>
              <View style={{ flex: 1, paddingLeft: 6 }}>
                <Text sx={labelKey}>Email Address</Text>
                <Text sx={labelValueLink}>
                  {personal.email_address || "—"}
                </Text>
              </View>
            </View>

            <View
              style={{
                flexDirection: "row",
                marginTop: 10,
              }}
            >
              <View style={{ flex: 1, paddingRight: 6 }}>
                <Text sx={labelKey}>Barangay</Text>
                <Text sx={labelValue}>{personal.barangay || "—"}</Text>
              </View>
              <View style={{ flex: 1, paddingLeft: 6 }}>
                <Text sx={labelKey}>Street</Text>
                <Text sx={labelValue}>{personal.street || "—"}</Text>
              </View>
            </View>
          </View>

          {/* WORK DETAILS */}
          <View style={cardStyle}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginBottom: 10,
              }}
            >
              <View
                style={{
                  width: 26,
                  height: 26,
                  borderRadius: 13,
                  backgroundColor: "#dcfce7",
                  alignItems: "center",
                  justifyContent: "center",
                  marginRight: 8,
                }}
              >
                <Ionicons name="construct-outline" size={16} color="#15803d" />
              </View>
              <Text sx={labelTitle}>Work Details</Text>
            </View>

            <View style={{ marginBottom: 8 }}>
              <Text sx={labelKey}>Service Types</Text>
              <Text sx={labelValueLink}>{serviceTypes()}</Text>
            </View>

            <View style={{ marginBottom: 8 }}>
              <Text sx={labelKey}>Service Tasks</Text>
              <Text sx={labelValue}>
                {work.description || "General home services."}
              </Text>
            </View>

            <View
              style={{
                flexDirection: "row",
                marginBottom: 8,
              }}
            >
              <View style={{ flex: 1, paddingRight: 6 }}>
                <Text sx={labelKey}>Years of Experience</Text>
                <Text sx={labelValueLink}>
                  {work.years_experience != null
                    ? work.years_experience
                    : "Not specified"}
                </Text>
              </View>

              <View style={{ flex: 1, paddingLeft: 6 }}>
                <Text sx={labelKey}>Tools Provided</Text>
                <Text sx={labelValueLink}>{toolsProvidedLabel}</Text>
              </View>
            </View>

            <View style={{ marginTop: 4 }}>
              <Text sx={labelKey}>Work Description</Text>
              <Text sx={labelValue}>
                {work.description || "No detailed description provided."}
              </Text>
            </View>
          </View>

          {/* SERVICE RATE */}
          <View style={cardStyle}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginBottom: 10,
              }}
            >
              <View
                style={{
                  width: 26,
                  height: 26,
                  borderRadius: 13,
                  backgroundColor: "#fef3c7",
                  alignItems: "center",
                  justifyContent: "center",
                  marginRight: 8,
                }}
              >
                <Ionicons name="cash-outline" size={16} color="#b45309" />
              </View>
              <Text sx={labelTitle}>Service Rate</Text>
            </View>

            <View style={{ marginBottom: 8 }}>
              <Text sx={labelKey}>Rate Type</Text>
              <Text sx={labelValueLink}>{rateTypeLabel()}</Text>
            </View>

            <View>
              <Text sx={labelKey}>Rate</Text>
              <Text sx={labelValueLink}>{formatRateSummary()}</Text>
            </View>
          </View>

          {/* SUMMARY FOOTER */}
          <View style={cardStyle}>
            <Text sx={labelTitle}>Application Summary</Text>

            <View style={{ marginTop: 10 }}>
              <Text sx={labelKey}>Worker</Text>
              <Text sx={labelValueLink}>{fullName || "—"}</Text>
            </View>

            <View style={{ marginTop: 8 }}>
              <Text sx={labelKey}>Primary Service</Text>
              <Text sx={labelValueLink}>{serviceTypes()}</Text>
            </View>

            <View style={{ marginTop: 8 }}>
              <Text sx={labelKey}>Experience</Text>
              <Text sx={labelValueLink}>
                {work.years_experience != null
                  ? `${work.years_experience} year(s)`
                  : "Not specified"}
              </Text>
            </View>

            <View style={{ marginTop: 8 }}>
              <Text sx={labelKey}>Offered Rate</Text>
              <Text sx={labelValueLink}>{formatRateSummary()}</Text>
            </View>
          </View>

          {/* Footer buttons */}
          <View
            style={{
              flexDirection: "row",
              columnGap: 10,
              marginTop: 8,
              marginBottom: 8,
            }}
          >
            <Pressable
              onPress={() =>
                router.push(
                  "/workerpage/WorkerForms/WorkerTermsAndAgreements",
                )
              }
              sx={{
                flex: 1,
                borderRadius: 999,
                borderWidth: 1,
                borderColor: "#d1d5db",
                bg: "#ffffff",
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
                Back
              </Text>
            </Pressable>

            <Pressable
              onPress={handleSubmit}
              sx={{
                flex: 1,
                borderRadius: 999,
                bg: "#008CFC",
                py: 12,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text
                sx={{
                  fontSize: 14,
                  fontFamily: "Poppins-Bold",
                  color: "#fff",
                }}
              >
                Pay &amp; Submit
              </Text>
            </Pressable>
          </View>
        </MotiView>
      </ScrollView>

      <WorkerNavbar />

      {/* --------- GCash Payment Modal --------- */}
      <Modal
        transparent
        animationType="slide"
        visible={showPaymentModal}
        onRequestClose={() => setShowPaymentModal(false)}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.35)",
            justifyContent: "center",
            alignItems: "center",
            paddingHorizontal: 12,
          }}
        >
          <View
            style={{
              width: "100%",
              maxWidth: 430,
              backgroundColor: "#ffffff",
              borderRadius: 20,
              paddingHorizontal: 18,
              paddingVertical: 20,
            }}
          >
            {/* Header row */}
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 6,
              }}
            >
              <Text
                sx={{
                  fontSize: 18,
                  fontFamily: "Poppins-Bold",
                  color: "#111827",
                }}
              >
                Pay via GCash
              </Text>
              <Text
                sx={{
                  fontSize: 13,
                  fontFamily: "Poppins-Bold",
                  color: "#111827",
                }}
              >
                Amount:{" "}
                <Text
                  sx={{
                    fontSize: 13,
                    fontFamily: "Poppins-Bold",
                    color: "#0ea5e9",
                  }}
                >
                  ₱{APPLICATION_FEE}
                </Text>
              </Text>
            </View>

            <Text
              sx={{
                fontSize: 11,
                fontFamily: "Poppins-Regular",
                color: "#6b7280",
                mb: 8,
              }}
            >
              Choose a method
            </Text>

            {/* Method tabs */}
            <View
              style={{
                flexDirection: "row",
                marginBottom: 14,
              }}
            >
              <TouchableOpacity
                style={{
                  flex: 1,
                  paddingVertical: 10,
                  borderRadius: 999,
                  borderWidth: 1.2,
                  borderColor:
                    paymentMethod === "qr" ? "#008CFC" : "#e5e7eb",
                  backgroundColor:
                    paymentMethod === "qr" ? "#eff6ff" : "#f9fafb",
                  alignItems: "center",
                  marginRight: 8,
                }}
                onPress={() => setPaymentMethod("qr")}
              >
                <Text
                  sx={{
                    fontSize: 13,
                    fontFamily: "Poppins-Bold",
                    color:
                      paymentMethod === "qr" ? "#008CFC" : "#4b5563",
                  }}
                >
                  GCash QR
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={{
                  flex: 1,
                  paddingVertical: 10,
                  borderRadius: 999,
                  borderWidth: 1.2,
                  borderColor:
                    paymentMethod === "details" ? "#008CFC" : "#e5e7eb",
                  backgroundColor:
                    paymentMethod === "details" ? "#eff6ff" : "#f9fafb",
                  alignItems: "center",
                }}
                onPress={() => setPaymentMethod("details")}
              >
                <Text
                  sx={{
                    fontSize: 13,
                    fontFamily: "Poppins-Bold",
                    color:
                      paymentMethod === "details" ? "#008CFC" : "#4b5563",
                  }}
                >
                  Fill GCash Details
                </Text>
              </TouchableOpacity>
            </View>

            {/* QR / Details content */}
            {paymentMethod === "qr" ? (
              <View
                style={{
                  alignItems: "center",
                  marginBottom: 16,
                }}
              >
                {/* IMAGE PLACEHOLDER for QR */}
                <View
                  style={{
                    width: 220,
                    height: 220,
                    borderRadius: 18,
                    borderWidth: 1,
                    borderColor: "#e5e7eb",
                    backgroundColor: "#f9fafb",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Image
                    source={require("../../../assets/QR.jpg")}
                    style={{ width: 190, height: 190, resizeMode: "contain" }}
                  />
                </View>

                <Text
                  sx={{
                    fontSize: 11,
                    fontFamily: "Poppins-Regular",
                    color: "#6b7280",
                    mt: 6,
                  }}
                >
                  Scan this QR using GCash
                </Text>
              </View>
            ) : (
              <View style={{ marginBottom: 16 }}>
                <Text
                  sx={{
                    fontSize: 12,
                    fontFamily: "Poppins-Regular",
                    color: "#6b7280",
                  }}
                >
                  Enter your GCash reference number and upload screenshot of your
                  payment. (Custom details screen can be expanded here.)
                </Text>
              </View>
            )}

            {/* Reference No. */}
            <View style={{ marginBottom: 10 }}>
              <Text
                sx={{
                  fontSize: 12,
                  fontFamily: "Poppins-Bold",
                  color: "#4b5563",
                  mb: 4,
                }}
              >
                Reference No.
              </Text>
              <TextInput
                value={referenceNo}
                editable={false}
                style={{
                  borderWidth: 1,
                  borderColor: "#e5e7eb",
                  borderRadius: 10,
                  paddingHorizontal: 12,
                  paddingVertical: 10,
                  backgroundColor: "#f9fafb",
                  fontSize: 13,
                  fontFamily: "Poppins-Regular",
                  color: "#111827",
                }}
              />
            </View>

            {/* Upload screenshot */}
            <View style={{ marginBottom: 14 }}>
              <Text
                sx={{
                  fontSize: 12,
                  fontFamily: "Poppins-Bold",
                  color: "#4b5563",
                  mb: 4,
                }}
              >
                Upload Screenshot
              </Text>

              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <TouchableOpacity
                  onPress={handleChooseScreenshot}
                  style={{
                    paddingHorizontal: 14,
                    paddingVertical: 9,
                    borderRadius: 999,
                    borderWidth: 1,
                    borderColor: "#d1d5db",
                    backgroundColor: "#ffffff",
                    marginRight: 8,
                  }}
                >
                  <Text
                    sx={{
                      fontSize: 12,
                      fontFamily: "Poppins-Bold",
                      color: "#2563eb",
                    }}
                  >
                    Choose Image
                  </Text>
                </TouchableOpacity>

                <Text
                  numberOfLines={1}
                  style={{
                    flex: 1,
                    fontSize: 11,
                    fontFamily: "Poppins-Regular",
                    color: "#6b7280",
                  }}
                >
                  {paymentScreenshotName || "No file chosen"}
                </Text>
              </View>
            </View>

            {/* Modal buttons */}
            <View
              style={{
                flexDirection: "row",
                marginTop: 4,
              }}
            >
              <TouchableOpacity
                onPress={() => setShowPaymentModal(false)}
                style={{
                  flex: 1,
                  paddingVertical: 11,
                  borderRadius: 999,
                  borderWidth: 1,
                  borderColor: "#d1d5db",
                  backgroundColor: "#ffffff",
                  alignItems: "center",
                  marginRight: 8,
                }}
              >
                <Text
                  sx={{
                    fontSize: 13,
                    fontFamily: "Poppins-Bold",
                    color: "#374151",
                  }}
                >
                  Cancel
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleConfirmPayment}
                style={{
                  flex: 1,
                  paddingVertical: 11,
                  borderRadius: 999,
                  backgroundColor: "#008CFC",
                  alignItems: "center",
                }}
              >
                <Text
                  sx={{
                    fontSize: 13,
                    fontFamily: "Poppins-Bold",
                    color: "#ffffff",
                  }}
                >
                  Confirm Payment
                </Text>
              </TouchableOpacity>
            </View>

            <Text
              sx={{
                fontSize: 10,
                fontFamily: "Poppins-Regular",
                color: "#9ca3af",
                textAlign: "center",
                mt: 10,
              }}
            >
              GCash only · Secure payment · Non-refundable application fee
            </Text>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  )
}
