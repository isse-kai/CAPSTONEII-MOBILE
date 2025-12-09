import { Ionicons } from '@expo/vector-icons'
import AsyncStorage from "@react-native-async-storage/async-storage"
import DateTimePicker, { Event } from '@react-native-community/datetimepicker'
import { Picker } from "@react-native-picker/picker"
import { Pressable, ScrollView, Text, TextInput, View } from "dripsy"
import { useFonts } from "expo-font"
import * as ImagePicker from "expo-image-picker"
import { useRouter } from "expo-router"
import { MotiView } from "moti"
import React, { useEffect, useState } from "react"
import {
  Dimensions,
  Image,
  ImageBackground,
  KeyboardAvoidingView,
  Modal,
  Platform,
  TouchableOpacity,
} from "react-native"
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context"
import { supabase } from "../../../supabase/db"
import { saveClientRequest } from "../../../supabase/services/clientrequestservice"
import Header from "../clientnavbar/header"
import ClientNavbar from "../clientnavbar/navbar"

const { width, height } = Dimensions.get("window")
const C = {
  bg: "#f7f9fc",
  text: "#0f172a",
  sub: "#64748b",
  blue: "#1e86ff",
  border: "#d1d5db",
  placeholder: "#93a3b5",
  track: "#e5e7eb",
}

const STORAGE_KEY = "request_step2"

/**
 * SERVICE TASKS map:
 * Edit these lists anytime if you need to change available tasks for each type.
 */
const SERVICE_TASKS_MAP: Record<string, string[]> = {
  "": [], // default
  "Car Washing": [
    "Exterior Wash",
    "Interior Cleaning",
    "Wax & Polish",
    "Underbody Cleaning",
    "Engine Bay Cleaning",
    "Headlight Restoration",
    "Ceramic Coating",
    "Tire & Rim Cleaning",
    "Vacuum & Odor Removal",
    "Paint Protection Film Application",
  ],
  "Carpentry": [
    "General Carpentry",
    "Furniture Repair",
    "Cabinet Installation",
    "Door/Window Repair",
  ],
  "Electrical Works": [
    "Wiring Repair",
    "Light Fixture Installation",
    "Outlet/Switch Repair",
    "Appliance Wiring",
  ],
  "Laundry": [
    "Wash & Fold",
    "Dry Cleaning",
    "Pressing/Ironing",
    "Stain Treatment",
  ],
  "Plumbing": [
    "Leak Repair",
    "Drain Cleaning",
    "Toilet Repair",
    "Pipe Replacement",
  ],
}

export default function ClientRequest2() {
  const router = useRouter()
  const insets = useSafeAreaInsets()

  const [fontsLoaded] = useFonts({
    "Poppins-Regular": require("../../../assets/fonts/Poppins/Poppins-Regular.ttf"),
    "Poppins-Bold": require("../../../assets/fonts/Poppins/Poppins-Bold.ttf"),
  })

  // form state
  const [serviceType, setServiceType] = useState("")
  const [serviceTask, setServiceTask] = useState("")
  const [date, setDate] = useState("")
  const [time, setTime] = useState("")
  const [toolsProvided, setToolsProvided] = useState("")
  const [urgent, setUrgent] = useState("")
  const [desc, setDesc] = useState("")
  const [photo, setPhoto] = useState<string | null>(null)

  // add state for clientId and email
  const [clientId, setClientId] = useState("")
  const [email, setEmail] = useState("")

  // modal controls for dropdown-like UX
  const [showTypePicker, setShowTypePicker] = useState(false)
  const [showTaskPicker, setShowTaskPicker] = useState(false)

  // date picker state
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [dateObj, setDateObj] = useState<Date>(new Date()) // selected Date object for native control

  const choosePhoto = async () => {
    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.9,
    })
    if (!res.canceled) {
      setPhoto(res.assets[0]?.uri ?? null)
    }
  }

  useEffect(() => {
    (async () => {
      // load step1 values
      const rawStep1 = await AsyncStorage.getItem("request_step1")
      if (rawStep1) {
        const v1 = JSON.parse(rawStep1)
        setClientId(v1.client_id ?? "")
        setEmail(v1.email_address ?? "")
      }

      // load step2 values
      const rawStep2 = await AsyncStorage.getItem(STORAGE_KEY)
      if (rawStep2) {
        const v2 = JSON.parse(rawStep2)
        setServiceType(v2.serviceType ?? "")
        setServiceTask(v2.serviceTask ?? "")
        setDate(v2.date ?? "")
        setTime(v2.time ?? "")
        setToolsProvided(v2.toolsProvided ?? "")
        setUrgent(v2.urgent ?? "")
        setDesc(v2.desc ?? "")
        setPhoto(v2.photo ?? null)

        // if saved date exists, parse into dateObj so picker shows it
        if (v2.date) {
          const parts = (v2.date as string).split("/")
          if (parts.length === 3) {
            const dd = Number(parts[0]), mm = Number(parts[1]) - 1, yy = Number(parts[2])
            const parsed = new Date(yy, mm, dd)
            if (!isNaN(parsed.getTime())) setDateObj(parsed)
          }
        }
      }
    })()
  }, [])

  // reset task whenever type changes (UI convenience only)
  useEffect(() => {
    setServiceTask("")
  }, [serviceType])

  const canNext = Boolean(
    serviceType.trim() &&
    serviceTask.trim() &&
    date.trim() &&
    time.trim() &&
    toolsProvided.trim() &&
    urgent.trim() &&
    desc.trim().length >= 3
  )

  const onNext = async () => {
    if (!canNext) return

    await AsyncStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ serviceType, serviceTask, date, time, toolsProvided, urgent, desc, photo })
    )

    try {
      const { data: { user }, error } = await supabase.auth.getUser()
      if (error || !user) {
        console.error("No authenticated user", error)
        return
      }
      const authUid = user.id

      // ✅ Save request to backend
      await saveClientRequest({
        client_id: clientId,              // loaded from step1
        auth_uid: authUid,
        email_address: email,             // loaded from step1
        category: "General",              // or whatever category you need
        service_type: serviceType,
        service_task: serviceTask,
        preferred_date: date,
        preferred_time: time,
        tools_provided: toolsProvided,
        is_urgent: urgent === "Yes",      // convert string to boolean
        description: desc,
        request_image_url: photo ?? null,
      })

      router.push("./clientforms/request3")
    } catch (err) {
      console.error("Error saving request:", err)
    }
  }

  if (!fontsLoaded) return null

  // list of top-level service types (you can change order or add later)
  const SERVICE_TYPES = [
    "Car Washing",
    "Carpentry",
    "Electrical Works",
    "Laundry",
    "Plumbing",
  ]

  // derived list of tasks for the currently selected type
  const currentTasks = SERVICE_TASKS_MAP[serviceType] ?? []

  // helpers ------------------------------------------------
  const formatDate = (d: Date) => {
    const dd = `${d.getDate()}`.padStart(2, "0")
    const mm = `${d.getMonth() + 1}`.padStart(2, "0")
    const yy = d.getFullYear()
    return `${dd}/${mm}/${yy}`
  }

  // Handler for native DateTimePicker change
  const onDateChange = (event: Event, selected?: Date | undefined) => {
    // Android: event.type === "dismissed" or selection
    // iOS: selected updates live
    if (Platform.OS === "android") {
      // On Android the picker is shown as a dialog and closes automatically.
      setShowDatePicker(false)
      if (selected) {
        setDateObj(selected)
        setDate(formatDate(selected))
      }
    } else {
      // iOS behavior: selected may be undefined on cancel
      if (selected) {
        setDateObj(selected)
        setDate(formatDate(selected))
      }
    }
  }

  // open date picker, seed with existing dateObj if present
  const openDatePicker = () => {
    // If there's already a selected date string parse into dateObj (already done on mount)
    setShowDatePicker(true)
  }

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
        <View style={{ flex: 1 }}>
          <ScrollView
            contentContainerStyle={{ paddingHorizontal: 18, paddingBottom: 20 }}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <MotiView
              from={{ opacity: 0, translateY: 20 }}
              animate={{ opacity: 1, translateY: 0 }}
              transition={{ type: "timing", duration: 500 }}
            >
              <Header />

              {/* Step status */}
              <View sx={{ mb: 20 }}>
                <Text sx={{ fontSize: 18, fontFamily: "Poppins-Bold", color: C.text }}>
                  Step 2 of 4
                </Text>
                <Text sx={{ fontSize: 14, fontFamily: "Poppins-Regular", color: C.sub }}>
                  Describe Your Request
                </Text>
                <View sx={{ flexDirection: "row", mt: 10, columnGap: 12 }}>
                  {[1, 2, 3, 4].map((i) => (
                    <View
                      key={i}
                      sx={{
                        flex: 1,
                        height: 10,
                        borderRadius: 999,
                        bg: i <= 2 ? C.blue : C.track,
                      }}
                    />
                  ))}
                </View>
              </View>

              {/* Service Info Card */}
              <View style={{ backgroundColor: '#ffffffcc', borderRadius: 12, padding: 16, marginBottom: 20 }}>
                <Text sx={{ fontSize: 18, fontFamily: 'Poppins-Bold', mb: 12 }}>
                  Service Request Details
                </Text>

                {/* SERVICE TYPE - tappable row that opens a modal picker */}
                <View style={{ marginBottom: 12 }}>
                  <Text sx={{ fontSize: 12, fontFamily: 'Poppins-Bold', marginBottom: 4 }}>
                    SERVICE TYPE:
                  </Text>

                  <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => setShowTypePicker(true)}
                    style={{
                      borderWidth: 1,
                      borderColor: C.border,
                      borderRadius: 8,
                      backgroundColor: '#fff',
                      paddingHorizontal: 12,
                      paddingVertical: 12,
                      justifyContent: 'center',
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <Text sx={{ fontSize: 14, fontFamily: 'Poppins-Regular', color: serviceType ? C.text : C.placeholder }}>
                      {serviceType || 'Select service type'}
                    </Text>
                    <Ionicons name="chevron-down" size={20} color={C.sub} />
                  </TouchableOpacity>

                  <Modal
                    visible={showTypePicker}
                    transparent
                    animationType="slide"
                    onRequestClose={() => setShowTypePicker(false)}
                  >
                    <TouchableOpacity
                      style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.4)' }}
                      activeOpacity={1}
                      onPressOut={() => setShowTypePicker(false)}
                    >
                      <KeyboardAvoidingView
                        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                        style={{ justifyContent: 'flex-end', flex: 1 }}
                      >
                        <View style={{ backgroundColor: '#fff', paddingBottom: 20 }}>
                          <Picker
                            selectedValue={serviceType}
                            onValueChange={(val) => setServiceType(val)}
                          >
                            <Picker.Item label="Select service type" value="" color={C.placeholder} />
                            {SERVICE_TYPES.map((t) => (
                              <Picker.Item key={t} label={t} value={t} color={C.text} />
                            ))}
                          </Picker>

                          <View style={{ paddingHorizontal: 18, marginTop: 8 }}>
                            <Pressable
                              onPress={() => setShowTypePicker(false)}
                              style={{
                                alignItems: 'center',
                                justifyContent: 'center',
                                borderRadius: 8,
                                paddingVertical: 12,
                                backgroundColor: C.blue
                              }}
                            >
                              <Text sx={{ color: '#fff', fontFamily: 'Poppins-Bold' }}>Done</Text>
                            </Pressable>
                          </View>
                        </View>
                      </KeyboardAvoidingView>
                    </TouchableOpacity>
                  </Modal>
                </View>

                {/* SERVICE TASK - tappable row that opens a modal picker (disabled when no tasks) */}
                <View style={{ marginBottom: 12 }}>
                  <Text sx={{ fontSize: 12, fontFamily: 'Poppins-Bold', marginBottom: 4 }}>
                    SERVICE TASK:
                  </Text>

                  <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => { if (currentTasks.length > 0) setShowTaskPicker(true) }}
                    style={{
                      borderWidth: 1,
                      borderColor: C.border,
                      borderRadius: 8,
                      backgroundColor: currentTasks.length > 0 ? '#fff' : '#f3f4f6',
                      paddingHorizontal: 12,
                      paddingVertical: 12,
                      justifyContent: 'center',
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <Text sx={{ fontSize: 14, fontFamily: 'Poppins-Regular', color: serviceTask ? C.text : (currentTasks.length > 0 ? C.placeholder : C.sub) }}>
                      {serviceTask || (currentTasks.length > 0 ? 'Select task' : 'Select service type first')}
                    </Text>
                    <Ionicons name="chevron-down" size={20} color={currentTasks.length > 0 ? C.sub : '#e5e7eb'} />
                  </TouchableOpacity>

                  <Modal
                    visible={showTaskPicker}
                    transparent
                    animationType="slide"
                    onRequestClose={() => setShowTaskPicker(false)}
                  >
                    <TouchableOpacity
                      style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.4)' }}
                      activeOpacity={1}
                      onPressOut={() => setShowTaskPicker(false)}
                    >
                      <KeyboardAvoidingView
                        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                        style={{ justifyContent: 'flex-end', flex: 1 }}
                      >
                        <View style={{ backgroundColor: '#fff', paddingBottom: 20 }}>
                          <Picker
                            selectedValue={serviceTask}
                            onValueChange={(val) => setServiceTask(val)}
                            enabled={currentTasks.length > 0}
                          >
                            <Picker.Item
                              label={currentTasks.length > 0 ? "Select task" : "Select service type first"}
                              value=""
                              color={C.placeholder}
                            />
                            {currentTasks.map((t) => (
                              <Picker.Item key={t} label={t} value={t} color={C.text} />
                            ))}
                          </Picker>

                          <View style={{ paddingHorizontal: 18, marginTop: 8 }}>
                            <Pressable
                              onPress={() => setShowTaskPicker(false)}
                              style={{
                                alignItems: 'center',
                                justifyContent: 'center',
                                borderRadius: 8,
                                paddingVertical: 12,
                                backgroundColor: C.blue
                              }}
                            >
                              <Text sx={{ color: '#fff', fontFamily: 'Poppins-Bold' }}>Done</Text>
                            </Pressable>
                          </View>
                        </View>
                      </KeyboardAvoidingView>
                    </TouchableOpacity>
                  </Modal>
                </View>

                {/* PREFERRED DATE - tappable row that opens native calendar picker */}
                <View style={{ marginBottom: 12 }}>
                  <Text sx={{ fontSize: 12, fontFamily: 'Poppins-Bold', marginBottom: 4 }}>
                    PREFERRED DATE:
                  </Text>

                  <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => openDatePicker()}
                    style={{
                      borderWidth: 1,
                      borderColor: C.border,
                      borderRadius: 8,
                      backgroundColor: '#fff',
                      paddingHorizontal: 12,
                      paddingVertical: 12,
                      justifyContent: 'center',
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <Text sx={{ fontSize: 14, fontFamily: 'Poppins-Regular', color: date ? C.text : C.placeholder }}>
                      {date || 'Select preferred date'}
                    </Text>
                    <Ionicons name="calendar-outline" size={20} color={C.sub} />
                  </TouchableOpacity>

                  {/* On iOS we show the picker inline/modal; on Android DateTimePicker shows a dialog automatically */}
                  {showDatePicker && (
                    <DateTimePicker
                      value={dateObj || new Date()}
                      mode="date"
                      display={Platform.OS === "ios" ? "spinner" : "calendar"}
                      onChange={onDateChange}
                      minimumDate={new Date()} // prevent selecting past dates
                    />
                  )}
                </View>

                {/* Keep other fields as plain text inputs (unchanged) */}
                <Field label="PREFERRED TIME:" value={time} onChangeText={setTime} placeholder="--:-- --" />
                <Field label="TOOLS PROVIDED:" value={toolsProvided} onChangeText={setToolsProvided} placeholder="Yes or No" />
                <Field label="DESCRIPTION:" value={desc} onChangeText={setDesc} placeholder="Describe the service" multiline />
              </View>

              {/* Upload Image Card */}
              <View style={{ backgroundColor: '#ffffffcc', borderRadius: 12, padding: 16, marginBottom: 20 }}>
                <Text sx={{ fontSize: 18, fontFamily: 'Poppins-Bold', mb: 12 }}>
                  Upload Image
                </Text>

                {/* Preview / No Image */}
                <View
                  style={{
                    height: 200,
                    borderRadius: 12,
                    borderWidth: 1,
                    borderColor: C.border,
                    backgroundColor: '#f9fafb',
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflow: 'hidden',
                    marginBottom: 16,
                  }}
                >
                  {photo ? (
                    <Image source={{ uri: photo }} style={{ width: '100%', height: '100%' }} resizeMode="cover" />
                  ) : (
                    <View style={{ alignItems: 'center' }}>
                      <Ionicons name="image-outline" size={32} color="#9aa9bc" />
                      <Text sx={{ color: '#9aa9bc', marginTop: 8, fontSize: 14 }}>
                        No Image Selected
                      </Text>
                    </View>
                  )}
                </View>

                {/* Choose Photo button */}
                <Pressable
                  onPress={choosePhoto}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderWidth: 1,
                    borderColor: C.border,
                    borderRadius: 8,
                    paddingHorizontal: 10,
                    paddingVertical: 12,
                  }}
                >
                  <Ionicons name="camera-outline" size={22} color={C.text} style={{ marginRight: 8 }} />
                  <Text sx={{ fontSize: 14, fontFamily: 'Poppins-Bold', color: C.text }}>
                    Choose Photo
                  </Text>
                </Pressable>
              </View>

              {/* Urgent dropdown */}
              <View style={{ marginBottom: 12 }}>
                <Text sx={{ fontSize: 12, fontFamily: 'Poppins-Bold', mb: 4 }}>URGENT:</Text>
                <View
                  style={{
                    borderWidth: 1,
                    borderColor: C.border,
                    borderRadius: 8,
                    overflow: 'hidden',
                    backgroundColor: '#fff',
                  }}
                >
                  <Picker
                    selectedValue={urgent}
                    onValueChange={(itemValue) => setUrgent(itemValue)}
                    style={{ fontSize: 14, fontFamily: 'Poppins-Regular', color: C.text }}
                  >
                    <Picker.Item label="Select urgency" value="" color={C.placeholder} />
                    <Picker.Item label="Yes" value="Yes" color={C.text} />
                    <Picker.Item label="No" value="No" color={C.text} />
                  </Picker>
                </View>
              </View>

            </MotiView>
          </ScrollView>
        </View>

        {/* Sticky bottom actions */}
        <View
          style={{
            flexDirection: "row",
            paddingHorizontal: 18,
            paddingBottom: insets.bottom,
            paddingTop: 10,
            backgroundColor: "#fff",
            borderTopLeftRadius: 12,
            borderTopRightRadius: 12,
            shadowColor: "#000",
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 3,
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
              Back : Step 1
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
                color: "#ffffffff",
                fontWeight: "900",
                fontSize: 16,
                paddingLeft: 14,
              }}
            >
              Next : Service Rate
            </Text>
          </Pressable>
        </View>

        <ClientNavbar />
      </SafeAreaView>
    </ImageBackground>
  )
}

/* Shared Field Component */
type FieldProps = {
  label: string
  value: string
  onChangeText: (text: string) => void
  placeholder: string
  multiline?: boolean
  keyboardType?: "default" | "email-address" | "number-pad"
}

function Field({
  label,
  value,
  onChangeText,
  placeholder,
  multiline = false,
  keyboardType = "default",
}: FieldProps) {
  return (
    <View style={{ marginBottom: 12 }}>
      <Text
        sx={{
          fontSize: 12,
          fontFamily: "Poppins-Bold",
          marginBottom: 4,
        }}
      >
        {label}
      </Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={C.placeholder}
        keyboardType={keyboardType}
        multiline={multiline}
        style={{
          borderWidth: 1,
          borderColor: C.border,
          borderRadius: 8,
          paddingHorizontal: 10,
          paddingVertical: 12,
          fontSize: 14,
          fontFamily: "Poppins-Regular",
          backgroundColor: "#fff",
          color: C.text,
          minHeight: multiline ? 80 : undefined,
        }}
      />
    </View>
  )
}
