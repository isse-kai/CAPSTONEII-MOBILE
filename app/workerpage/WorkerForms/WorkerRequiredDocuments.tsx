// app/workerpage/WorkerForms/WorkerRequiredDocuments.tsx
import { Ionicons } from "@expo/vector-icons"
import { Pressable, Text } from "dripsy"
import * as DocumentPicker from "expo-document-picker"
import { useFonts } from "expo-font"
import { useRouter } from "expo-router"
import { MotiView } from "moti"
import React, { useEffect, useState } from "react"
import {
    Alert,
    ImageBackground,
    ScrollView,
    View,
} from "react-native"
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context"

import WorkerHeader from "../workernavbar/header"
import WorkerNavbar from "../workernavbar/navbar"

import {
    handleGetWorkerRequiredDocuments,
    handleSaveWorkerRequiredDocuments,
} from "../../../supabase/controllers/workerinformationcontroller"
import { getCurrentUser } from "../../../supabase/services/loginservice"

type DocKey =
  | "primaryFront"
  | "primaryBack"
  | "secondaryId"
  | "nbiClearance"
  | "proofOfAddress"
  | "medicalCertificate"
  | "certificates"

interface DocState {
  url: string | null
  name: string | null
  uploading: boolean
}

export default function WorkerRequiredDocuments() {
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

  const [primaryFront, setPrimaryFront] = useState<DocState>({
    url: null,
    name: null,
    uploading: false,
  })
  const [primaryBack, setPrimaryBack] = useState<DocState>({
    url: null,
    name: null,
    uploading: false,
  })
  const [secondaryId, setSecondaryId] = useState<DocState>({
    url: null,
    name: null,
    uploading: false,
  })
  const [nbiClearance, setNbiClearance] = useState<DocState>({
    url: null,
    name: null,
    uploading: false,
  })
  const [proofOfAddress, setProofOfAddress] = useState<DocState>({
    url: null,
    name: null,
    uploading: false,
  })
  const [medicalCertificate, setMedicalCertificate] = useState<DocState>({
    url: null,
    name: null,
    uploading: false,
  })
  const [certificates, setCertificates] = useState<DocState>({
    url: null,
    name: null,
    uploading: false,
  })

  const docStateMap: Record<
    DocKey,
    [DocState, React.Dispatch<React.SetStateAction<DocState>>]
  > = {
    primaryFront: [primaryFront, setPrimaryFront],
    primaryBack: [primaryBack, setPrimaryBack],
    secondaryId: [secondaryId, setSecondaryId],
    nbiClearance: [nbiClearance, setNbiClearance],
    proofOfAddress: [proofOfAddress, setProofOfAddress],
    medicalCertificate: [medicalCertificate, setMedicalCertificate],
    certificates: [certificates, setCertificates],
  }

  useEffect(() => {
    const load = async () => {
      try {
        const authUser = await getCurrentUser()
        setAuthUid(authUser.id)

        // TEMP: service currently returns null; cast to any so TS is happy
        const existing = (await handleGetWorkerRequiredDocuments(
          authUser.id,
        )) as any

        if (existing) {
          if (existing.primary_id_front_url) {
            setPrimaryFront({
              url: existing.primary_id_front_url,
              name: "Uploaded file",
              uploading: false,
            })
          }
          if (existing.primary_id_back_url) {
            setPrimaryBack({
              url: existing.primary_id_back_url,
              name: "Uploaded file",
              uploading: false,
            })
          }
          if (existing.secondary_id_url) {
            setSecondaryId({
              url: existing.secondary_id_url,
              name: "Uploaded file",
              uploading: false,
            })
          }
          if (existing.nbi_clearance_url) {
            setNbiClearance({
              url: existing.nbi_clearance_url,
              name: "Uploaded file",
              uploading: false,
            })
          }
          if (existing.proof_of_address_url) {
            setProofOfAddress({
              url: existing.proof_of_address_url,
              name: "Uploaded file",
              uploading: false,
            })
          }
        }
      } catch (err) {
        console.error("Failed to load worker required documents", err)
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [])

  const uploadedCount =
    (primaryFront.url ? 1 : 0) +
    (primaryBack.url ? 1 : 0) +
    (secondaryId.url ? 1 : 0) +
    (nbiClearance.url ? 1 : 0) +
    (proofOfAddress.url ? 1 : 0) +
    (medicalCertificate.url ? 1 : 0) +
    (certificates.url ? 1 : 0)

  /**
   * ALTERNATIVE “upload”: no Supabase Storage.
   * We just keep the local file URI so the UI can continue.
   */
  const uploadToSupabase = async (
    _authUid: string,
    _key: DocKey,
    file: { uri: string; name?: string | null; mimeType?: string | null },
  ): Promise<string> => {
    console.log(
      "[WorkerRequiredDocuments] Skipping Supabase storage upload, using local URI:",
      file.uri,
    )
    return file.uri
  }

  const handlePickDocument = async (key: DocKey) => {
    if (!authUid) {
      Alert.alert("Error", "User not loaded yet.")
      return
    }

    const [state, setState] = docStateMap[key]

    try {
      setState({ ...state, uploading: true })

      const result = await DocumentPicker.getDocumentAsync({
        type: ["application/pdf", "image/jpeg", "image/png"],
        copyToCacheDirectory: true,
      })

      if (result.canceled || !result.assets || !result.assets[0]) {
        setState({ ...state, uploading: false })
        return
      }

      const asset = result.assets[0]

      const uploadedUrl = await uploadToSupabase(authUid, key, {
        uri: asset.uri,
        name: asset.name,
        mimeType: asset.mimeType,
      })

      setState({
        url: uploadedUrl,
        name: asset.name || "Selected file",
        uploading: false,
      })
    } catch (err) {
      console.error("handlePickDocument error:", err)
      Alert.alert("Upload failed", "Unable to upload this file.")
      setState({ ...state, uploading: false })
    }
  }

  const handleNext = async () => {
    if (!authUid) return

    // Require all 7 documents to be uploaded (UI rule)
    if (
      !primaryFront.url ||
      !primaryBack.url ||
      !secondaryId.url ||
      !nbiClearance.url ||
      !proofOfAddress.url ||
      !medicalCertificate.url ||
      !certificates.url
    ) {
      Alert.alert(
        "Missing documents",
        "Please upload all required documents before continuing.",
      )
      return
    }

    try {
      setSaving(true)

      // TEMP: this call no longer hits Supabase; it just logs and returns a fake object.
      await handleSaveWorkerRequiredDocuments(authUid, {
          primary_id_front_url: primaryFront.url,
          primary_id_back_url: primaryBack.url,
          secondary_id_url: secondaryId.url,
          nbi_clearance_url: nbiClearance.url,
          proof_of_address_url: proofOfAddress.url,
          medical_certificate_url: null,
          certificates_url: null
      })

      router.push("/workerpage/WorkerForms/WorkerPriceRate")
    } catch (err) {
      // With the new service this should never trigger, but keep it for safety.
      console.error("Failed to save required documents", err)
      Alert.alert("Error", "Could not save your documents.")
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

  const labelStyle = {
    fontSize: 14,
    fontFamily: "Poppins-Bold" as const,
    color: "#111827",
  }

  const requiredBadge = (
    <View
      style={{
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 999,
        backgroundColor: "#e0f2fe",
      }}
    >
      <Text
        sx={{
          fontSize: 10,
          fontFamily: "Poppins-Bold",
          color: "#0284c7",
        }}
      >
        Required
      </Text>
    </View>
  )

  const renderDocCard = (
    title: string,
    key: DocKey,
    state: DocState,
    helperText: string,
  ) => (
    <View
      key={key}
      style={{
        borderRadius: 14,
        borderWidth: 1,
        borderColor: "#e5e7eb",
        backgroundColor: "#ffffff",
        padding: 12,
        marginBottom: 12,
      }}
    >
      {/* title row */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 8,
        }}
      >
        <Text sx={labelStyle}>{title}</Text>
        {requiredBadge}
      </View>

      {/* upload area */}
      <Pressable
        onPress={() => handlePickDocument(key)}
        sx={{
          borderWidth: 1,
          borderStyle: "dashed",
          borderColor: "#93c5fd",
          borderRadius: 12,
          py: 24,
          px: 12,
          alignItems: "center",
          justifyContent: "center",
          bg: "#f9fafb",
        }}
      >
        {state.uploading ? (
          <Text
            sx={{
              fontSize: 12,
              fontFamily: "Poppins-Regular",
              color: "#6b7280",
            }}
          >
            Uploading...
          </Text>
        ) : (
          <>
            <Ionicons name="cloud-upload-outline" size={26} color="#60a5fa" />
            <Text
              sx={{
                mt: 6,
                fontSize: 12,
                fontFamily: "Poppins-Regular",
                color: "#6b7280",
              }}
            >
              Click to upload
            </Text>
            <Text
              sx={{
                fontSize: 10,
                fontFamily: "Poppins-Regular",
                color: "#9ca3af",
                mt: 2,
              }}
            >
              PDF, JPG, or PNG · Max 5MB
            </Text>
          </>
        )}
      </Pressable>

      {/* filename row */}
      <Text
        sx={{
          mt: 6,
          fontSize: 10,
          fontFamily: "Poppins-Regular",
          color: "#6b7280",
        }}
      >
        {state.name ? state.name : "No file selected"}
      </Text>

      {/* helper text */}
      <Text
        sx={{
          mt: 2,
          fontSize: 10,
          fontFamily: "Poppins-Regular",
          color: "#9ca3af",
        }}
      >
        {helperText}
      </Text>
    </View>
  )

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
                3 of 6 | Post a Worker Application
              </Text>
              <Text
                sx={{
                  fontSize: 24,
                  fontFamily: "Poppins-ExtraBold",
                  color: "#111827",
                  mt: 4,
                }}
              >
                Step 3: Required Documents
              </Text>
              <Text
                sx={{
                  fontSize: 16,
                  fontFamily: "Poppins-Bold",
                  color: "#111827",
                  mt: 4,
                }}
              >
                Please upload your documents
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
                    width: "50%", // 3 of 6
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
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 10,
                }}
              >
                <Text
                  sx={{
                    fontSize: 18,
                    fontFamily: "Poppins-Bold",
                    color: "#111827",
                  }}
                >
                  Required Documents
                </Text>
                <Text
                  sx={{
                    fontSize: 12,
                    fontFamily: "Poppins-Regular",
                    color: "#6b7280",
                  }}
                >
                  {uploadedCount}/7 uploaded
                </Text>
              </View>

              {/* vertical list of document cards */}
              <View>
                {renderDocCard(
                  "Primary ID (Front) *",
                  "primaryFront",
                  primaryFront,
                  "UMID, Passport, Driver’s License, etc.",
                )}
                {renderDocCard(
                  "Primary ID (Back) *",
                  "primaryBack",
                  primaryBack,
                  "UMID, Passport, Driver’s License, etc.",
                )}
                {renderDocCard(
                  "Secondary ID *",
                  "secondaryId",
                  secondaryId,
                  "UMID, Passport, Driver’s License, etc.",
                )}
                {renderDocCard(
                  "NBI/Police Clearance *",
                  "nbiClearance",
                  nbiClearance,
                  "Barangay Certificate also accepted.",
                )}
                {renderDocCard(
                  "Proof of Address *",
                  "proofOfAddress",
                  proofOfAddress,
                  "Barangay Certificate, Utility Bill.",
                )}
                {renderDocCard(
                  "Medical Certificate *",
                  "medicalCertificate",
                  medicalCertificate,
                  "Latest medical / fit-to-work certificate.",
                )}
                {renderDocCard(
                  "Certificates *",
                  "certificates",
                  certificates,
                  "TESDA, Training Certificates, etc.",
                )}
              </View>
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
                  router.push("/workerpage/WorkerForms/WorkerWorkInformation")
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
                  Back: Work Information
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
                  {saving ? "Saving..." : "Next: Set Your Price Rate"}
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
