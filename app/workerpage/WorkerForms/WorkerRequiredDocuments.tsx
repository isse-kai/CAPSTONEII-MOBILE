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
  handleGetWorkerWorkInformation,
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
  | "tesdaCarpentry"
  | "tesdaPlumbing"
  | "tesdaElectrical"
  | "tesdaHousekeeping"
  | "tesdaAutomotive"

interface DocState {
  url: string | null
  name: string | null
  uploading: boolean
}

interface WorkerWorkInformationExisting {
  service_carpenter?: boolean
  service_electrician?: boolean
  service_plumber?: boolean
  service_carwasher?: boolean
  service_laundry?: boolean
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

  // --- Service types from Step 2 (for TESDA requirements) ---
  const [serviceCarpenter, setServiceCarpenter] = useState(false)
  const [serviceElectrician, setServiceElectrician] = useState(false)
  const [servicePlumber, setServicePlumber] = useState(false)
  const [serviceCarwasher, setServiceCarwasher] = useState(false)
  const [serviceLaundry, setServiceLaundry] = useState(false)

  // --- Base required documents ---
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

  // Optional generic certificates (no UI card now, but still saved if ever used)
  const [certificates, setCertificates] = useState<DocState>({
    url: null,
    name: null,
    uploading: false,
  })

  // --- TESDA certificate uploads (per service type) ---
  const [tesdaCarpentry, setTesdaCarpentry] = useState<DocState>({
    url: null,
    name: null,
    uploading: false,
  })
  const [tesdaPlumbing, setTesdaPlumbing] = useState<DocState>({
    url: null,
    name: null,
    uploading: false,
  })
  const [tesdaElectrical, setTesdaElectrical] = useState<DocState>({
    url: null,
    name: null,
    uploading: false,
  })
  const [tesdaHousekeeping, setTesdaHousekeeping] = useState<DocState>({
    url: null,
    name: null,
    uploading: false,
  })
  const [tesdaAutomotive, setTesdaAutomotive] = useState<DocState>({
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
    tesdaCarpentry: [tesdaCarpentry, setTesdaCarpentry],
    tesdaPlumbing: [tesdaPlumbing, setTesdaPlumbing],
    tesdaElectrical: [tesdaElectrical, setTesdaElectrical],
    tesdaHousekeeping: [tesdaHousekeeping, setTesdaHousekeeping],
    tesdaAutomotive: [tesdaAutomotive, setTesdaAutomotive],
  }

  useEffect(() => {
    const load = async () => {
      try {
        const authUser = await getCurrentUser()
        setAuthUid(authUser.id)

        const [existingDocs, existingWork] = await Promise.all([
          handleGetWorkerRequiredDocuments(authUser.id) as any,
          handleGetWorkerWorkInformation(
            authUser.id,
          ) as WorkerWorkInformationExisting | null,
        ])

        // Existing docs (if any)
        if (existingDocs) {
          if (existingDocs.primary_id_front_url) {
            setPrimaryFront({
              url: existingDocs.primary_id_front_url,
              name: "Uploaded file",
              uploading: false,
            })
          }
          if (existingDocs.primary_id_back_url) {
            setPrimaryBack({
              url: existingDocs.primary_id_back_url,
              name: "Uploaded file",
              uploading: false,
            })
          }
          if (existingDocs.secondary_id_url) {
            setSecondaryId({
              url: existingDocs.secondary_id_url,
              name: "Uploaded file",
              uploading: false,
            })
          }
          if (existingDocs.nbi_clearance_url) {
            setNbiClearance({
              url: existingDocs.nbi_clearance_url,
              name: "Uploaded file",
              uploading: false,
            })
          }
          if (existingDocs.proof_of_address_url) {
            setProofOfAddress({
              url: existingDocs.proof_of_address_url,
              name: "Uploaded file",
              uploading: false,
            })
          }
          if (existingDocs.medical_certificate_url) {
            setMedicalCertificate({
              url: existingDocs.medical_certificate_url,
              name: "Uploaded file",
              uploading: false,
            })
          }
          // Optional certificates, if you ever stored them
          if (existingDocs.certificates_url) {
            setCertificates({
              url: existingDocs.certificates_url,
              name: "Uploaded file",
              uploading: false,
            })
          }
          // TESDA URLs can also be hydrated here later if backend supports them.
        }

        // Existing work info (service types)
        if (existingWork) {
          setServiceCarpenter(!!existingWork.service_carpenter)
          setServiceElectrician(!!existingWork.service_electrician)
          setServicePlumber(!!existingWork.service_plumber)
          setServiceCarwasher(!!existingWork.service_carwasher)
          setServiceLaundry(!!existingWork.service_laundry)
        }
      } catch (err) {
        console.error("Failed to load worker required documents", err)
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [])

  // ---- Required-docs counters (for header progress) ----
  const baseRequiredDocs: DocState[] = [
    primaryFront,
    primaryBack,
    secondaryId,
    nbiClearance,
    proofOfAddress,
    medicalCertificate,
  ]
  const baseRequiredUploadedCount = baseRequiredDocs.filter(
    d => !!d.url,
  ).length

  const tesdaRequiredCount =
    (serviceCarpenter ? 1 : 0) +
    (servicePlumber ? 1 : 0) +
    (serviceElectrician ? 1 : 0) +
    (serviceLaundry ? 1 : 0) +
    (serviceCarwasher ? 1 : 0)

  const tesdaUploadedCount =
    (serviceCarpenter && tesdaCarpentry.url ? 1 : 0) +
    (servicePlumber && tesdaPlumbing.url ? 1 : 0) +
    (serviceElectrician && tesdaElectrical.url ? 1 : 0) +
    (serviceLaundry && tesdaHousekeeping.url ? 1 : 0) +
    (serviceCarwasher && tesdaAutomotive.url ? 1 : 0)

  const totalRequiredDocs = 6 + tesdaRequiredCount
  const uploadedRequiredDocsCount =
    baseRequiredUploadedCount + tesdaUploadedCount

  const anyTesdaRequired =
    serviceCarpenter ||
    servicePlumber ||
    serviceElectrician ||
    serviceLaundry ||
    serviceCarwasher

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

    // Require base 6 documents + TESDA certificates based on service types
    if (
      !primaryFront.url ||
      !primaryBack.url ||
      !secondaryId.url ||
      !nbiClearance.url ||
      !proofOfAddress.url ||
      !medicalCertificate.url ||
      (serviceCarpenter && !tesdaCarpentry.url) ||
      (servicePlumber && !tesdaPlumbing.url) ||
      (serviceElectrician && !tesdaElectrical.url) ||
      (serviceLaundry && !tesdaHousekeeping.url) ||
      (serviceCarwasher && !tesdaAutomotive.url)
    ) {
      Alert.alert(
        "Missing documents",
        "Please upload all required documents and TESDA certificates based on your selected service types.",
      )
      return
    }

    try {
      setSaving(true)

      await handleSaveWorkerRequiredDocuments(authUid, {
        primary_id_front_url: primaryFront.url,
        primary_id_back_url: primaryBack.url,
        secondary_id_url: secondaryId.url,
        nbi_clearance_url: nbiClearance.url,
        proof_of_address_url: proofOfAddress.url,
        medical_certificate_url: medicalCertificate.url,
        certificates_url: certificates.url, // still sent, but no UI card
        // TESDA URLs can be added here later once backend supports them
      })

      // AFTER REQUIRED DOCUMENTS → GO DIRECTLY TO REVIEW APPLICATION
      router.push("/workerpage/WorkerForms/WorkerReviewApplication")
    } catch (err) {
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
    opts?: { required?: boolean },
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
        {opts?.required === false ? null : requiredBadge}
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
              Click to upload or drag and drop
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

  const renderTesdaChip = (label: string) => (
    <View
      key={label}
      style={{
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 999,
        borderWidth: 1,
        borderColor: "#bfdbfe",
        backgroundColor: "#eff6ff",
        marginRight: 8,
        marginBottom: 8,
      }}
    >
      <Text
        sx={{
          fontSize: 11,
          fontFamily: "Poppins-Bold",
          color: "#1d4ed8",
        }}
      >
        {label}
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
                3 of 4 | Post a Worker Application
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
                    width: "75%", // 3 of 4
                    height: "100%",
                    backgroundColor: "#008CFC",
                  }}
                />
              </View>
            </View>

            {/* Card: Base required documents */}
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
                  {uploadedRequiredDocsCount}/{totalRequiredDocs} uploaded
                </Text>
              </View>

              {/* vertical list of base document cards */}
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
              </View>
            </View>

            {/* Card: TESDA Certificate Requirement (based on service type) */}
            {anyTesdaRequired && (
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
                    mb: 4,
                  }}
                >
                  TESDA Certificate Requirement
                </Text>
                <Text
                  sx={{
                    fontSize: 12,
                    fontFamily: "Poppins-Regular",
                    color: "#6b7280",
                    mb: 8,
                  }}
                >
                  Based on your selected service types:
                </Text>

                {/* Chips */}
                <View
                  style={{
                    flexDirection: "row",
                    flexWrap: "wrap",
                    marginBottom: 12,
                  }}
                >
                  {serviceCarpenter &&
                    renderTesdaChip("TESDA Carpentry NC II Certificate")}
                  {servicePlumber &&
                    renderTesdaChip("TESDA Plumbing NC II Certificate")}
                  {serviceElectrician &&
                    renderTesdaChip(
                      "TESDA Electrical Installation and Maintenance NC II Certificate",
                    )}
                  {serviceLaundry &&
                    renderTesdaChip("TESDA Housekeeping NC II Certificate")}
                  {serviceCarwasher &&
                    renderTesdaChip(
                      "TESDA Automotive Servicing NC II Certificate",
                    )}
                </View>

                {/* Upload cards */}
                <View>
                  {serviceCarpenter &&
                    renderDocCard(
                      "TESDA Carpentry NC II Certificate *",
                      "tesdaCarpentry",
                      tesdaCarpentry,
                      "Upload your TESDA Carpentry NC II certificate (PDF, JPG, or PNG).",
                    )}
                  {servicePlumber &&
                    renderDocCard(
                      "TESDA Plumbing NC II Certificate *",
                      "tesdaPlumbing",
                      tesdaPlumbing,
                      "Upload your TESDA Plumbing NC II certificate (PDF, JPG, or PNG).",
                    )}
                  {serviceElectrician &&
                    renderDocCard(
                      "TESDA Electrical Installation and Maintenance NC II Certificate *",
                      "tesdaElectrical",
                      tesdaElectrical,
                      "Upload your TESDA Electrical Installation and Maintenance NC II certificate.",
                    )}
                  {serviceLaundry &&
                    renderDocCard(
                      "TESDA Housekeeping NC II Certificate *",
                      "tesdaHousekeeping",
                      tesdaHousekeeping,
                      "Upload your TESDA Housekeeping NC II certificate.",
                    )}
                  {serviceCarwasher &&
                    renderDocCard(
                      "TESDA Automotive Servicing NC II Certificate *",
                      "tesdaAutomotive",
                      tesdaAutomotive,
                      "Upload your TESDA Automotive Servicing NC II certificate.",
                    )}
                </View>
              </View>
            )}

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
