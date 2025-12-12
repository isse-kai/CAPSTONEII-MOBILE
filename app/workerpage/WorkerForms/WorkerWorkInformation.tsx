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

// ----- Task options per service type -----
const CARPENTER_TASK_OPTIONS = [
  "General Carpentry",
  "Furniture Repair",
  "Wood Polishing",
  "Door & Window Fitting",
  "Custom Furniture Design",
  "Modular Kitchen Installation",
  "Flooring & Decking",
  "Cabinet & Wardrobe Fixing",
  "Wall Paneling & False Ceiling",
]

const ELECTRICIAN_TASK_OPTIONS = [
  "House Wiring",
  "Lighting Installation",
  "Outlet & Switch Repair",
  "Circuit Breaker Setup",
]

const PLUMBER_TASK_OPTIONS = [
  "Leak Repair",
  "Pipe Installation",
  "Toilet & Sink Repair",
  "Water Heater Installation",
]

const CARWASHER_TASK_OPTIONS = [
  "Basic Car Wash",
  "Interior Detailing",
  "Engine Wash",
]

const LAUNDRY_TASK_OPTIONS = [
  "Wash & Fold",
  "Ironing",
  "Dry Cleaning (Pickup)",
]

// Type for what we *expect* from the DB/controller,
// so `existing` is NOT inferred as `never`.
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

  // Task selections per service type
  const [carpenterTasks, setCarpenterTasks] = useState<string[]>([])
  const [electricianTasks, setElectricianTasks] = useState<string[]>([])
  const [plumberTasks, setPlumberTasks] = useState<string[]>([])
  const [carwasherTasks, setCarwasherTasks] = useState<string[]>([])
  const [laundryTasks, setLaundryTasks] = useState<string[]>([])

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

          // For now description is UI-only
          if (existing.description) {
            setDescription(existing.description)
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

  const toggleTask = (
    task: string,
    selected: string[],
    setter: React.Dispatch<React.SetStateAction<string[]>>,
  ) => {
    if (selected.includes(task)) {
      setter(selected.filter(t => t !== task))
    } else {
      setter([...selected, task])
    }
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

    return `\n\nSelected tasks:\n${lines.join("\n")}`
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

    const finalDescription = description + buildTasksSummary()

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
      // still allow navigation forward
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

  const renderTaskChip = (
    task: string,
    selected: string[],
    setter: React.Dispatch<React.SetStateAction<string[]>>,
  ) => {
    const active = selected.includes(task)
    return (
      <Pressable
        key={task}
        onPress={() => toggleTask(task, selected, setter)}
        sx={{
          px: 14,
          py: 8,
          borderRadius: 999,
          borderWidth: 1,
          borderColor: active ? "#008CFC" : "#d1d5db",
          bg: active ? "#008CFC" : "#ffffff",
          mr: 8,
          mb: 8,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Text
          sx={{
            fontSize: 12,
            fontFamily: "Poppins-Regular",
            color: active ? "#ffffff" : "#111827",
          }}
        >
          {task}
        </Text>
      </Pressable>
    )
  }

  const renderServiceTaskCard = (
    title: string,
    tasks: string[],
    options: string[],
    clearAll: () => void,
  ) => {
    if (!options.length) return null

    return (
      <View
        style={{
          marginTop: 16,
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
            {tasks.length} selected
          </Text>
        </View>

        {/* Task 1 bar (visual only) */}
        <View
          style={{
            borderWidth: 1,
            borderColor: "#e5e7eb",
            borderRadius: 10,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            paddingHorizontal: 12,
            paddingVertical: 10,
            marginBottom: 12,
          }}
        >
          <Text
            sx={{
              fontSize: 12,
              fontFamily: "Poppins-Regular",
              color: "#6b7280",
            }}
          >
            Task 1
          </Text>
          <Text
            sx={{
              flex: 1,
              ml: 10,
              fontSize: 14,
              fontFamily: "Poppins-Regular",
              color: "#9ca3af",
            }}
          >
            Select a service
          </Text>
          <Ionicons name="chevron-down-outline" size={18} color="#9ca3af" />
        </View>

        <View
          style={{
            flexDirection: "row",
            flexWrap: "wrap",
          }}
        >
          {options.map(task =>
            renderTaskChip(task, tasks, selected => {
              if (title === "Carpenter") setCarpenterTasks(selected)
              else if (title === "Electrician") setElectricianTasks(selected)
              else if (title === "Plumber") setPlumberTasks(selected)
              else if (title === "Carwasher") setCarwasherTasks(selected)
              else if (title === "Laundry") setLaundryTasks(selected)
            }),
          )}
        </View>

        {tasks.length > 0 && (
          <Pressable
            onPress={clearAll}
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
              Clear {title}
            </Text>
          </Pressable>
        )}
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
                2 of 6 | Post a Worker Application
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
                    width: "33.4%",
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

              {/* Service Task cards */}
              {serviceCarpenter &&
                renderServiceTaskCard(
                  "Carpenter",
                  carpenterTasks,
                  CARPENTER_TASK_OPTIONS,
                  () => setCarpenterTasks([]),
                )}

              {serviceElectrician &&
                renderServiceTaskCard(
                  "Electrician",
                  electricianTasks,
                  ELECTRICIAN_TASK_OPTIONS,
                  () => setElectricianTasks([]),
                )}

              {servicePlumber &&
                renderServiceTaskCard(
                  "Plumber",
                  plumberTasks,
                  PLUMBER_TASK_OPTIONS,
                  () => setPlumberTasks([]),
                )}

              {serviceCarwasher &&
                renderServiceTaskCard(
                  "Carwasher",
                  carwasherTasks,
                  CARWASHER_TASK_OPTIONS,
                  () => setCarwasherTasks([]),
                )}

              {serviceLaundry &&
                renderServiceTaskCard(
                  "Laundry",
                  laundryTasks,
                  LAUNDRY_TASK_OPTIONS,
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

        <WorkerNavbar />
      </SafeAreaView>
    </ImageBackground>
  )
}
