// app/workerpage/WorkerForms/WorkerReviewApplication.tsx
import { Ionicons } from "@expo/vector-icons"
import { Pressable, Text } from "dripsy"
import { useFonts } from "expo-font"
import { useRouter } from "expo-router"
import { MotiView } from "moti"
import React, { useEffect, useState } from "react"
import {
  ActivityIndicator,
  Alert,
  Image,
  Modal,
  ScrollView,
  TouchableOpacity,
  View,
} from "react-native"
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context"

import WorkerHeader from "../workernavbar/header"
import WorkerNavbar from "../workernavbar/navbar"

import {
  handleGetWorkerInformation,
  handleGetWorkerWorkInformation,
} from "../../../supabase/controllers/workerinformationcontroller"
import { getCurrentUser } from "../../../supabase/services/loginservice"

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

  // submit modals
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [showSubmittingModal, setShowSubmittingModal] = useState(false)

  // ---------- LOAD FROM SUPABASE (with data-wrapper fallback) ----------
  useEffect(() => {
    const load = async () => {
      try {
        const authUser = await getCurrentUser()
        setAuthUid(authUser.id)

        const [infoRaw, workRaw] = await Promise.all([
          handleGetWorkerInformation(authUser.id),
          handleGetWorkerWorkInformation(authUser.id),
        ])

        const info =
          infoRaw && "data" in infoRaw && (infoRaw as any).data
            ? (infoRaw as any).data
            : infoRaw
        const workInfo =
          workRaw && "data" in workRaw && (workRaw as any).data
            ? (workRaw as any).data
            : workRaw

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

  // quick edit navigation
  const handleEditPersonal = () => {
    // if your personal info route is different, adjust this path
    router.push("/workerpage/WorkerForms/Workerinformation")
  }

  const handleEditWork = () => {
    router.push("/workerpage/WorkerForms/WorkerWorkInformation")
  }

  const handleEditDocuments = () => {
    router.push("/workerpage/WorkerForms/WorkerRequiredDocuments")
  }

  const handleSubmit = () => {
    if (!authUid) {
      Alert.alert("Session error", "Please log in again before submitting.")
      return
    }
    setShowConfirmModal(true)
  }

  const handleConfirmSubmit = () => {
    setShowConfirmModal(false)
    setShowSubmittingModal(true)

    // fake loading for 1.5 seconds then go home
    setTimeout(() => {
      setShowSubmittingModal(false)
      router.push("/workerpage/home")
    }, 1500)
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
            fontSize: 17,
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
    fontSize: 18,
    fontFamily: "Poppins-Bold" as const,
    color: "#111827",
  }

  const labelKey = {
    fontSize: 13,
    fontFamily: "Poppins-Bold" as const,
    color: "#6b7280",
  }

  const labelValueLink = {
    fontSize: 14,
    fontFamily: "Poppins-Bold" as const,
    color: "#2563eb",
  }

  const labelValue = {
    fontSize: 14,
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

  const editPillStyle = {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: "#eff6ff",
  }

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
                fontSize: 13,
                fontFamily: "Poppins-Regular",
                color: "#6b7280",
              }}
            >
              4 of 4 | Post a Worker Application
            </Text>
            <Text
              sx={{
                fontSize: 26,
                fontFamily: "Poppins-ExtraBold",
                color: "#111827",
                mt: 4,
              }}
            >
              Step 4: Review Application
            </Text>
            <Text
              sx={{
                fontSize: 17,
                fontFamily: "Poppins-Regular",
                color: "#4b5563",
                mt: 4,
              }}
            >
              Quickly review each section and edit anything before submitting.
            </Text>

            {/* quick nav chips */}
            <View
              style={{
                flexDirection: "row",
                marginTop: 12,
                columnGap: 8,
                flexWrap: "wrap",
              }}
            >
              <TouchableOpacity
                onPress={handleEditPersonal}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  paddingHorizontal: 12,
                  paddingVertical: 6,
                  borderRadius: 999,
                  backgroundColor: "#e0f2fe",
                }}
              >
                <Ionicons name="person-outline" size={14} color="#0369a1" />
                <Text
                  sx={{
                    fontSize: 13,
                    fontFamily: "Poppins-Bold",
                    color: "#0369a1",
                    ml: 6,
                  }}
                >
                  Personal Info
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleEditWork}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  paddingHorizontal: 12,
                  paddingVertical: 6,
                  borderRadius: 999,
                  backgroundColor: "#dcfce7",
                }}
              >
                <Ionicons name="construct-outline" size={14} color="#15803d" />
                <Text
                  sx={{
                    fontSize: 13,
                    fontFamily: "Poppins-Bold",
                    color: "#15803d",
                    ml: 6,
                  }}
                >
                  Work Details
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleEditDocuments}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  paddingHorizontal: 12,
                  paddingVertical: 6,
                  borderRadius: 999,
                  backgroundColor: "#fef3c7",
                }}
              >
                <Ionicons name="document-text-outline" size={14} color="#b45309" />
                <Text
                  sx={{
                    fontSize: 13,
                    fontFamily: "Poppins-Bold",
                    color: "#b45309",
                    ml: 6,
                  }}
                >
                  Documents
                </Text>
              </TouchableOpacity>
            </View>

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
                  fontSize: 20,
                  fontFamily: "Poppins-Bold",
                  color: "#111827",
                }}
              >
                {fullName || "Unnamed worker"}
              </Text>
              <Text
                sx={{
                  fontSize: 13,
                  fontFamily: "Poppins-Regular",
                  color: "#6b7280",
                  mt: 2,
                }}
              >
                {serviceTypes()}
              </Text>
              <Text
                sx={{
                  fontSize: 12,
                  fontFamily: "Poppins-Regular",
                  color: "#9ca3af",
                  mt: 4,
                }}
              >
                This is how clients will see your basic info.
              </Text>
            </View>
          </View>

          {/* PERSONAL INFORMATION */}
          <View style={cardStyle}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginBottom: 10,
                justifyContent: "space-between",
              }}
            >
              <View style={{ flexDirection: "row", alignItems: "center" }}>
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

              <TouchableOpacity onPress={handleEditPersonal} style={editPillStyle}>
                <Ionicons name="create-outline" size={14} color="#1d4ed8" />
                <Text
                  sx={{
                    fontSize: 12,
                    fontFamily: "Poppins-Bold",
                    color: "#1d4ed8",
                    ml: 4,
                  }}
                >
                  Edit
                </Text>
              </TouchableOpacity>
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
                justifyContent: "space-between",
              }}
            >
              <View style={{ flexDirection: "row", alignItems: "center" }}>
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

              <TouchableOpacity onPress={handleEditWork} style={editPillStyle}>
                <Ionicons name="create-outline" size={14} color="#15803d" />
                <Text
                  sx={{
                    fontSize: 12,
                    fontFamily: "Poppins-Bold",
                    color: "#15803d",
                    ml: 4,
                  }}
                >
                  Edit
                </Text>
              </TouchableOpacity>
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

          {/* SUMMARY FOOTER */}
          <View style={cardStyle}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginBottom: 10,
                justifyContent: "space-between",
              }}
            >
              <Text sx={labelTitle}>Application Summary</Text>

              <TouchableOpacity onPress={handleEditDocuments} style={editPillStyle}>
                <Ionicons name="create-outline" size={14} color="#b45309" />
                <Text
                  sx={{
                    fontSize: 12,
                    fontFamily: "Poppins-Bold",
                    color: "#b45309",
                    ml: 4,
                  }}
                >
                  Edit
                </Text>
              </TouchableOpacity>
            </View>

            <View style={{ marginTop: 2 }}>
              <Text
                sx={{
                  fontSize: 12,
                  fontFamily: "Poppins-Regular",
                  color: "#6b7280",
                  mb: 6,
                }}
              >
                Final overview before you submit your application.
              </Text>
            </View>

            <View
              style={{
                borderTopWidth: 1,
                borderTopColor: "#e5e7eb",
                paddingTop: 8,
                marginTop: 4,
              }}
            >
              <View style={{ marginTop: 4 }}>
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
              onPress={handleEditDocuments}
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
                  fontSize: 15,
                  fontFamily: "Poppins-Bold",
                  color: "#374151",
                }}
              >
                Back to Documents
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
                  fontSize: 15,
                  fontFamily: "Poppins-Bold",
                  color: "#fff",
                }}
              >
                Submit
              </Text>
            </Pressable>
          </View>
        </MotiView>
      </ScrollView>

      <WorkerNavbar />

      {/* --------- Confirm Submit Modal --------- */}
      <Modal
        transparent
        animationType="fade"
        visible={showConfirmModal}
        onRequestClose={() => setShowConfirmModal(false)}
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
            <Text
              sx={{
                fontSize: 18,
                fontFamily: "Poppins-Bold",
                color: "#111827",
                mb: 8,
              }}
            >
              Submit Application
            </Text>
            <Text
              sx={{
                fontSize: 14,
                fontFamily: "Poppins-Regular",
                color: "#4b5563",
                mb: 16,
              }}
            >
              Are you sure you want to submit your worker application? You can no
              longer edit your details after submitting.
            </Text>

            <View
              style={{
                flexDirection: "row",
                marginTop: 4,
              }}
            >
              <TouchableOpacity
                onPress={() => setShowConfirmModal(false)}
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
                    fontSize: 14,
                    fontFamily: "Poppins-Bold",
                    color: "#374151",
                  }}
                >
                  Cancel
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleConfirmSubmit}
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
                    fontSize: 14,
                    fontFamily: "Poppins-Bold",
                    color: "#ffffff",
                  }}
                >
                  Yes, Submit
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* --------- Submitting Loading Modal --------- */}
      <Modal
        transparent
        animationType="fade"
        visible={showSubmittingModal}
        onRequestClose={() => {}}
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
              maxWidth: 320,
              backgroundColor: "#ffffff",
              borderRadius: 20,
              paddingHorizontal: 20,
              paddingVertical: 22,
              alignItems: "center",
            }}
          >
            <ActivityIndicator size="large" color="#008CFC" />
            <Text
              sx={{
                fontSize: 15,
                fontFamily: "Poppins-Bold",
                color: "#111827",
                mt: 12,
              }}
            >
              Submitting your application...
            </Text>
            <Text
              sx={{
                fontSize: 12,
                fontFamily: "Poppins-Regular",
                color: "#6b7280",
                mt: 4,
                textAlign: "center",
              }}
            >
              Please wait a moment while we save your details.
            </Text>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  )
}
