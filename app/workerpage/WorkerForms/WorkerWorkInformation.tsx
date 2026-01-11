// app/workerpage/WorkerForms/WorkerWorkInformation.tsx
import { Ionicons } from "@expo/vector-icons"
import { Pressable, Text } from "dripsy"
import { useFonts } from "expo-font"
import { useRouter } from "expo-router"
import { MotiView } from "moti"
import React, { useEffect, useState } from "react"
import {
  Alert,
  ImageBackground,
  Modal,
  ScrollView,
  TextInput,
  View,
} from "react-native"
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context"

import WorkerHeader from "../workernavbar/header"
import WorkerNavbar from "../workernavbar/navbar"

import {
  handleGetWorkerWorkInformation,
  handleSaveWorkerWorkInformation,
} from "../../../supabase/controllers/workerinformationcontroller"
import { getCurrentUser } from "../../../supabase/services/loginservice"

// ----- Task options per service type (no prices) -----
const CARPENTER_TASK_OPTIONS = [
  "General Carpentry",
  "Door Repair / Alignment",
  "Window Repair / Installation",
  "Furniture Repair",
  "Wood Polishing / Revarnish",
  "Custom Shelves / Cabinets",
  "Modular Kitchen Installation",
  "Flooring / Decking",
  "Wall Paneling / False Ceiling",
  "Partition Wall (Drywall / Plyboard)",
  "Roof Framing / Trusses",
]

const ELECTRICIAN_TASK_OPTIONS = [
  "Basic Check-up & Minor Repair",
  "Outlet & Switch Repair",
  "New Outlet / Switch Installation",
  "Lighting Installation",
  "Ceiling Fan Installation",
  "House Wiring",
  "Circuit Breaker / Panel Setup",
  "Appliance Wiring / Hook-up",
  "Emergency Power Check",
  "Grounding / Earthing Installation",
]

const PLUMBER_TASK_OPTIONS = [
  "Leak Repair",
  "Clogged Drain / Toilet",
  "Pipe Installation / Replacement",
  "Toilet & Sink Installation",
  "Faucet / Shower Replacement",
  "Water Heater Installation",
  "Water Line Check-up",
  "Septic Tank Check / Basic Service",
  "Outdoor Faucet / Garden Line Setup",
]

const CARWASHER_TASK_OPTIONS = [
  "Sedan – Basic Wash",
  "Sedan – Wash + Vacuum",
  "SUV / MPV – Basic Wash",
  "SUV / MPV – Wash + Vacuum",
  "Engine Wash",
  "Interior Detailing",
  "Full Detailing Package",
  "Motorcycle Wash",
  "Ceramic Coating / Wax",
]

const LAUNDRY_TASK_OPTIONS = [
  "Wash & Fold – Regular Clothes",
  "Wash, Dry & Iron",
  "Bedsheets / Curtains",
  "Blankets / Comforters",
  "Delicate / Special Fabrics",
  "Uniforms / Office Attire",
  "Pickup & Delivery Service",
  "Express Service (Same Day)",
]

// Type for what we *expect* from the DB/controller
interface WorkerWorkInformationExisting {
  service_carpenter?: boolean
  service_electrician?: boolean
  service_plumber?: boolean
  service_carwasher?: boolean
  service_laundry?: boolean
  description?: string | null
  years_experience?: number | null
  has_own_tools?: boolean | null
}

// Marker used when appending selected services to description
const SUMMARY_MARKER = "Selected services:"

/**
 * Remove any previously appended service-summary text from the description.
 * Handles:
 *  - Our marker line "Selected services:"
 *  - Older data that may already contain "Carpenter:", "Electrician:", etc.
 */
const cleanDescriptionFromSummary = (raw: string | null | undefined): string => {
  if (!raw) return ""

  let text = raw

  // Case 1: we already have the explicit marker
  const idx = text.indexOf(SUMMARY_MARKER)
  if (idx !== -1) {
    text = text.slice(0, idx)
  }

  // Case 2: older data that appended lines like "Carpenter: ...", etc.
  const lines = text.split("\n")
  const filtered: string[] = []

  for (const line of lines) {
    const t = line.trim()
    if (!t) {
      filtered.push(line)
      continue
    }

    if (t.startsWith("Selected services")) continue
    if (t.startsWith("Carpenter:")) continue
    if (t.startsWith("Electrician:")) continue
    if (t.startsWith("Plumber:")) continue
    if (t.startsWith("Carwasher:")) continue
    if (t.startsWith("Laundry:")) continue

    filtered.push(line)
  }

  return filtered.join("\n").trimEnd()
}

export default function WorkerWorkInformation() {
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

  // Service type toggles
  const [serviceCarpenter, setServiceCarpenter] = useState(false)
  const [serviceElectrician, setServiceElectrician] = useState(false)
  const [servicePlumber, setServicePlumber] = useState(false)
  const [serviceCarwasher, setServiceCarwasher] = useState(false)
  const [serviceLaundry, setServiceLaundry] = useState(false)

  // Selected services per service type
  const [carpenterTasks, setCarpenterTasks] = useState<string[]>([])
  const [electricianTasks, setElectricianTasks] = useState<string[]>([])
  const [plumberTasks, setPlumberTasks] = useState<string[]>([])
  const [carwasherTasks, setCarwasherTasks] = useState<string[]>([])
  const [laundryTasks, setLaundryTasks] = useState<string[]>([])

  // Dropdown (modal) visibility per service type
  const [showCarpenterServicesModal, setShowCarpenterServicesModal] =
    useState(false)
  const [showElectricianServicesModal, setShowElectricianServicesModal] =
    useState(false)
  const [showPlumberServicesModal, setShowPlumberServicesModal] =
    useState(false)
  const [showCarwasherServicesModal, setShowCarwasherServicesModal] =
    useState(false)
  const [showLaundryServicesModal, setShowLaundryServicesModal] =
    useState(false)

  // Other fields
  const [description, setDescription] = useState("")
  const [yearsExperience, setYearsExperience] = useState("")
  const [hasOwnToolsChoice, setHasOwnToolsChoice] = useState<"" | "yes" | "no">(
    "",
  )

  useEffect(() => {
    const load = async () => {
      try {
        const authUser = await getCurrentUser()
        setAuthUid(authUser.id)

        const existing = (await handleGetWorkerWorkInformation(
          authUser.id,
        )) as WorkerWorkInformationExisting | null

        if (existing) {
          setServiceCarpenter(!!existing.service_carpenter)
          setServiceElectrician(!!existing.service_electrician)
          setServicePlumber(!!existing.service_plumber)
          setServiceCarwasher(!!existing.service_carwasher)
          setServiceLaundry(!!existing.service_laundry)

          if (existing.description) {
            setDescription(cleanDescriptionFromSummary(existing.description))
          }

          setYearsExperience(
            existing.years_experience != null
              ? String(existing.years_experience)
              : "",
          )

          if (existing.has_own_tools === true) setHasOwnToolsChoice("yes")
          else if (existing.has_own_tools === false)
            setHasOwnToolsChoice("no")
        }
      } catch (err) {
        console.error("Failed to load worker work information", err)
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [])

  // ---------- helpers ----------
  const toggleService = (
    current: boolean,
    setter: React.Dispatch<React.SetStateAction<boolean>>,
    clearTasks: () => void,
  ) => {
    const next = !current
    setter(next)
    if (!next) clearTasks()
  }

  const anyServiceSelected =
    serviceCarpenter ||
    serviceElectrician ||
    servicePlumber ||
    serviceCarwasher ||
    serviceLaundry

  const buildTasksSummary = () => {
    const lines: string[] = []

    if (carpenterTasks.length) {
      lines.push(`Carpenter: ${carpenterTasks.join(", ")}`)
    }
    if (electricianTasks.length) {
      lines.push(`Electrician: ${electricianTasks.join(", ")}`)
    }
    if (plumberTasks.length) {
      lines.push(`Plumber: ${plumberTasks.join(", ")}`)
    }
    if (carwasherTasks.length) {
      lines.push(`Carwasher: ${carwasherTasks.join(", ")}`)
    }
    if (laundryTasks.length) {
      lines.push(`Laundry: ${laundryTasks.join(", ")}`)
    }

    if (!lines.length) return ""

    return `\n\n${SUMMARY_MARKER}\n${lines.join("\n")}`
  }

  const handleNext = async () => {
    if (!authUid) return

    if (!anyServiceSelected) {
      Alert.alert("Missing details", "Please select at least one service type.")
      return
    }

    if (!description.trim()) {
      Alert.alert(
        "Missing details",
        "Please provide a short description of your service.",
      )
      return
    }

    // Optional: require at least one service per enabled type
    const missingServices: string[] = []
    if (serviceCarpenter && carpenterTasks.length === 0)
      missingServices.push("Carpenter")
    if (serviceElectrician && electricianTasks.length === 0)
      missingServices.push("Electrician")
    if (servicePlumber && plumberTasks.length === 0)
      missingServices.push("Plumber")
    if (serviceCarwasher && carwasherTasks.length === 0)
      missingServices.push("Carwasher")
    if (serviceLaundry && laundryTasks.length === 0)
      missingServices.push("Laundry")

    if (missingServices.length) {
      Alert.alert(
        "Missing services",
        `Please select at least one service for: ${missingServices.join(", ")}`,
      )
      return
    }

    let years: number | null = null
    if (yearsExperience.trim()) {
      const parsed = Number(yearsExperience)
      if (Number.isNaN(parsed) || parsed < 0) {
        Alert.alert("Invalid input", "Please enter a valid number of years.")
        return
      }
      years = parsed
    }

    const hasOwnTools =
      hasOwnToolsChoice === ""
        ? null
        : hasOwnToolsChoice === "yes"
          ? true
          : false

    // Always strip any old summary before appending a fresh one
    const baseDescription = cleanDescriptionFromSummary(description)
    const finalDescription = baseDescription + buildTasksSummary()

    try {
      setSaving(true)

      await handleSaveWorkerWorkInformation(authUid, {
        service_carpenter: serviceCarpenter,
        service_electrician: serviceElectrician,
        service_plumber: servicePlumber,
        service_carwasher: serviceCarwasher,
        service_laundry: serviceLaundry,
        description: finalDescription,
        years_experience: years,
        has_own_tools: hasOwnTools,
      })

      router.push("/workerpage/WorkerForms/WorkerRequiredDocuments")
    } catch (err) {
      console.error("Unexpected error in handleNext", err)
      router.push("/workerpage/WorkerForms/WorkerRequiredDocuments")
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
    fontSize: 12,
    fontFamily: "Poppins-Bold" as const,
    marginBottom: 4,
    color: "#111827",
  }

  const inputStyle = {
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 14,
    fontFamily: "Poppins-Regular" as const,
    backgroundColor: "#f9fafb",
    color: "#111827",
  }

  const renderServiceToggle = (
    label: string,
    value: boolean,
    setter: React.Dispatch<React.SetStateAction<boolean>>,
    clearTasks: () => void,
  ) => (
    <Pressable
      key={label}
      onPress={() => toggleService(value, setter, clearTasks)}
      sx={{
        flexDirection: "row",
        alignItems: "center",
        mb: 8,
      }}
    >
      <Ionicons
        name={value ? "checkbox-outline" : "square-outline"}
        size={20}
        color={value ? "#008CFC" : "#6b7280"}
      />
      <Text
        sx={{
          ml: 2,
          fontSize: 14,
          fontFamily: "Poppins-Regular",
          color: "#111827",
        }}
      >
        {label}
      </Text>
    </Pressable>
  )

  // Dropdown-like card for selecting services per type
  const renderServiceDropdownCard = (
    title:
      | "Carpenter"
      | "Electrician"
      | "Plumber"
      | "Carwasher"
      | "Laundry",
    selected: string[],
    onOpen: () => void,
    onClear: () => void,
  ) => {
    return (
      <View
        style={{
          marginTop: 12,
          borderWidth: 1,
          borderColor: "#e5e7eb",
          borderRadius: 14,
          padding: 12,
          backgroundColor: "#ffffff",
        }}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 8,
          }}
        >
          <Text
            sx={{
              fontSize: 16,
              fontFamily: "Poppins-Bold",
              color: "#111827",
            }}
          >
            {title} Services
          </Text>
          <Text
            sx={{
              fontSize: 12,
              fontFamily: "Poppins-Regular",
              color: "#6b7280",
            }}
          >
            {selected.length} selected
          </Text>
        </View>

        {/* Dropdown bar */}
        <Pressable
          onPress={onOpen}
          style={{
            borderWidth: 1,
            borderColor: "#d1d5db",
            borderRadius: 10,
            paddingHorizontal: 12,
            paddingVertical: 10,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Text
            style={{
              flex: 1,
              fontSize: 14,
              fontFamily: "Poppins-Regular",
              color: selected.length ? "#111827" : "#9ca3af",
            }}
            numberOfLines={2}
          >
            {selected.length ? selected.join(", ") : "Select services"}
          </Text>
          <Ionicons name="chevron-down-outline" size={18} color="#6b7280" />
        </Pressable>

        {selected.length > 0 && (
          <Pressable
            onPress={onClear}
            sx={{
              mt: 8,
              alignSelf: "flex-end",
              px: 8,
              py: 4,
            }}
          >
            <Text
              sx={{
                fontSize: 12,
                fontFamily: "Poppins-Bold",
                color: "#ef4444",
              }}
            >
              Clear {title} services
            </Text>
          </Pressable>
        )}
      </View>
    )
  }

  // Reusable modal for multi-selecting services (no prices)
  const TaskModal = ({
    visible,
    title,
    options,
    selected,
    onClose,
    onToggle,
  }: {
    visible: boolean
    title: string
    options: string[]
    selected: string[]
    onClose: () => void
    onToggle: (value: string) => void
  }) => {
    if (!visible) return null
    return (
      <Modal
        visible={visible}
        transparent
        animationType="slide"
        onRequestClose={onClose}
      >
        <View
          style={{
            flex: 1,
            justifyContent: "flex-end",
            backgroundColor: "rgba(0,0,0,0.4)",
          }}
        >
          <View
            style={{
              backgroundColor: "#fff",
              borderTopLeftRadius: 16,
              borderTopRightRadius: 16,
              paddingBottom: insets.bottom || 16,
              maxHeight: "75%",
            }}
          >
            {/* Header */}
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                paddingHorizontal: 16,
                paddingTop: 12,
                paddingBottom: 8,
                borderBottomWidth: 1,
                borderBottomColor: "#e5e7eb",
              }}
            >
              <Pressable onPress={onClose}>
                <Text
                  sx={{
                    fontSize: 14,
                    fontFamily: "Poppins-Bold",
                    color: "#6b7280",
                  }}
                >
                  Cancel
                </Text>
              </Pressable>
              <Text
                sx={{
                  fontSize: 16,
                  fontFamily: "Poppins-Bold",
                  color: "#111827",
                }}
              >
                {title}
              </Text>
              <Pressable onPress={onClose}>
                <Text
                  sx={{
                    fontSize: 14,
                    fontFamily: "Poppins-Bold",
                    color: "#008CFC",
                  }}
                >
                  Done
                </Text>
              </Pressable>
            </View>

            {/* Options list */}
            <ScrollView
              style={{
                paddingHorizontal: 16,
                paddingVertical: 8,
              }}
            >
              {options.map(option => {
                const isSelected = selected.includes(option)

                return (
                  <Pressable
                    key={option}
                    onPress={() => onToggle(option)}
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "space-between",
                      paddingVertical: 10,
                      borderBottomWidth: 1,
                      borderBottomColor: "#e5e7eb",
                    }}
                  >
                    <Text
                      sx={{
                        flex: 1,
                        fontSize: 14,
                        fontFamily: "Poppins-Regular",
                        color: "#111827",
                        mr: 8,
                      }}
                    >
                      {option}
                    </Text>
                    <Ionicons
                      name={
                        isSelected ? "checkbox-outline" : "square-outline"
                      }
                      size={20}
                      color={isSelected ? "#008CFC" : "#6b7280"}
                    />
                  </Pressable>
                )
              })}
            </ScrollView>
          </View>
        </View>
      </Modal>
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
                2 of 4 | Post a Worker Application
              </Text>
              <Text
                sx={{
                  fontSize: 24,
                  fontFamily: "Poppins-ExtraBold",
                  color: "#111827",
                  mt: 4,
                }}
              >
                Step 2: Describe Your Work
              </Text>
              <Text
                sx={{
                  fontSize: 18,
                  fontFamily: "Poppins-Bold",
                  color: "#111827",
                  mt: 4,
                }}
              >
                Tell us about your work
              </Text>

              {/* Progress bar */}
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
                    width: "50%",
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
                  mb: 4,
                }}
              >
                Work Information
              </Text>

              {/* Service Type toggles */}
              <View style={{ marginTop: 12 }}>
                <Text
                  sx={{
                    fontSize: 16,
                    fontFamily: "Poppins-Bold",
                    color: "#111827",
                    mb: 8,
                  }}
                >
                  Service Type
                </Text>

                <View
                  style={{
                    flexDirection: "row",
                    flexWrap: "wrap",
                    columnGap: 20,
                    rowGap: 4,
                  }}
                >
                  {renderServiceToggle(
                    "Carpenter",
                    serviceCarpenter,
                    setServiceCarpenter,
                    () => setCarpenterTasks([]),
                  )}
                  {renderServiceToggle(
                    "Electrician",
                    serviceElectrician,
                    setServiceElectrician,
                    () => setElectricianTasks([]),
                  )}
                  {renderServiceToggle(
                    "Plumber",
                    servicePlumber,
                    setServicePlumber,
                    () => setPlumberTasks([]),
                  )}
                  {renderServiceToggle(
                    "Carwasher",
                    serviceCarwasher,
                    setServiceCarwasher,
                    () => setCarwasherTasks([]),
                  )}
                  {renderServiceToggle(
                    "Laundry",
                    serviceLaundry,
                    setServiceLaundry,
                    () => setLaundryTasks([]),
                  )}
                </View>
              </View>

              {/* Service dropdown cards (per enabled service) */}
              {serviceCarpenter &&
                renderServiceDropdownCard(
                  "Carpenter",
                  carpenterTasks,
                  () => setShowCarpenterServicesModal(true),
                  () => setCarpenterTasks([]),
                )}

              {serviceElectrician &&
                renderServiceDropdownCard(
                  "Electrician",
                  electricianTasks,
                  () => setShowElectricianServicesModal(true),
                  () => setElectricianTasks([]),
                )}

              {servicePlumber &&
                renderServiceDropdownCard(
                  "Plumber",
                  plumberTasks,
                  () => setShowPlumberServicesModal(true),
                  () => setPlumberTasks([]),
                )}

              {serviceCarwasher &&
                renderServiceDropdownCard(
                  "Carwasher",
                  carwasherTasks,
                  () => setShowCarwasherServicesModal(true),
                  () => setCarwasherTasks([]),
                )}

              {serviceLaundry &&
                renderServiceDropdownCard(
                  "Laundry",
                  laundryTasks,
                  () => setShowLaundryServicesModal(true),
                  () => setLaundryTasks([]),
                )}

              {/* Years of experience */}
              <View style={{ marginTop: 16 }}>
                <Text sx={labelStyle}>Years of Experience *</Text>
                <TextInput
                  value={yearsExperience}
                  onChangeText={setYearsExperience}
                  keyboardType="number-pad"
                  style={inputStyle}
                  placeholder="Enter years of experience"
                  placeholderTextColor="#9ca3af"
                />
              </View>

              {/* Own tools yes/no */}
              <View style={{ marginTop: 16 }}>
                <Text sx={labelStyle}>
                  Do you have your own tools or equipment? *
                </Text>
                <View
                  style={{
                    flexDirection: "row",
                    columnGap: 10,
                    marginTop: 4,
                  }}
                >
                  <Pressable
                    onPress={() => setHasOwnToolsChoice("yes")}
                    sx={{
                      flex: 1,
                      borderRadius: 999,
                      borderWidth: 1,
                      borderColor:
                        hasOwnToolsChoice === "yes" ? "#008CFC" : "#d1d5db",
                      bg: hasOwnToolsChoice === "yes" ? "#008CFC" : "#ffffff",
                      py: 10,
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Text
                      sx={{
                        fontSize: 14,
                        fontFamily: "Poppins-Bold",
                        color:
                          hasOwnToolsChoice === "yes" ? "#ffffff" : "#111827",
                      }}
                    >
                      Yes
                    </Text>
                  </Pressable>

                  <Pressable
                    onPress={() => setHasOwnToolsChoice("no")}
                    sx={{
                      flex: 1,
                      borderRadius: 999,
                      borderWidth: 1,
                      borderColor:
                        hasOwnToolsChoice === "no" ? "#008CFC" : "#d1d5db",
                      bg: hasOwnToolsChoice === "no" ? "#008CFC" : "#ffffff",
                      py: 10,
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Text
                      sx={{
                        fontSize: 14,
                        fontFamily: "Poppins-Bold",
                        color:
                          hasOwnToolsChoice === "no" ? "#ffffff" : "#111827",
                      }}
                    >
                      No
                    </Text>
                  </Pressable>
                </View>
              </View>

              {/* Description at bottom */}
              <View style={{ marginTop: 16 }}>
                <Text
                  sx={{
                    fontSize: 16,
                    fontFamily: "Poppins-Bold",
                    color: "#111827",
                    mb: 8,
                  }}
                >
                  Service Description
                </Text>
                <TextInput
                  value={description}
                  onChangeText={setDescription}
                  style={{
                    ...inputStyle,
                    height: 140,
                    textAlignVertical: "top",
                  }}
                  multiline
                  placeholder="Describe the service you offer"
                  placeholderTextColor="#9ca3af"
                />
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
                  router.push("/workerpage/WorkerForms/Workerinformation")
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
                  Back: Personal Information
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
                  {saving ? "Saving..." : "Next: Required Documents"}
                </Text>
              </Pressable>
            </View>
          </MotiView>
        </ScrollView>

        {/* Service dropdown modals */}
        <TaskModal
          visible={showCarpenterServicesModal}
          title="Carpenter services"
          options={CARPENTER_TASK_OPTIONS}
          selected={carpenterTasks}
          onClose={() => setShowCarpenterServicesModal(false)}
          onToggle={option =>
            setCarpenterTasks(prev =>
              prev.includes(option)
                ? prev.filter(t => t !== option)
                : [...prev, option],
            )
          }
        />
        <TaskModal
          visible={showElectricianServicesModal}
          title="Electrician services"
          options={ELECTRICIAN_TASK_OPTIONS}
          selected={electricianTasks}
          onClose={() => setShowElectricianServicesModal(false)}
          onToggle={option =>
            setElectricianTasks(prev =>
              prev.includes(option)
                ? prev.filter(t => t !== option)
                : [...prev, option],
            )
          }
        />
        <TaskModal
          visible={showPlumberServicesModal}
          title="Plumber services"
          options={PLUMBER_TASK_OPTIONS}
          selected={plumberTasks}
          onClose={() => setShowPlumberServicesModal(false)}
          onToggle={option =>
            setPlumberTasks(prev =>
              prev.includes(option)
                ? prev.filter(t => t !== option)
                : [...prev, option],
            )
          }
        />
        <TaskModal
          visible={showCarwasherServicesModal}
          title="Carwasher services"
          options={CARWASHER_TASK_OPTIONS}
          selected={carwasherTasks}
          onClose={() => setShowCarwasherServicesModal(false)}
          onToggle={option =>
            setCarwasherTasks(prev =>
              prev.includes(option)
                ? prev.filter(t => t !== option)
                : [...prev, option],
            )
          }
        />
        <TaskModal
          visible={showLaundryServicesModal}
          title="Laundry services"
          options={LAUNDRY_TASK_OPTIONS}
          selected={laundryTasks}
          onClose={() => setShowLaundryServicesModal(false)}
          onToggle={option =>
            setLaundryTasks(prev =>
              prev.includes(option)
                ? prev.filter(t => t !== option)
                : [...prev, option],
            )
          }
        />

        <WorkerNavbar />
      </SafeAreaView>
    </ImageBackground>
  )
}
