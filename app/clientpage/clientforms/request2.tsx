import { Ionicons } from '@expo/vector-icons'
import AsyncStorage from "@react-native-async-storage/async-storage"
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
} from "react-native"
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context"
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

  useEffect(() => {
    (async () => {
      const raw = await AsyncStorage.getItem(STORAGE_KEY)
      if (!raw) return
      const v = JSON.parse(raw)
      setServiceType(v.serviceType ?? "")
      setServiceTask(v.serviceTask ?? "")
      setDate(v.date ?? "")
      setTime(v.time ?? "")
      setToolsProvided(v.toolsProvided ?? "")
      setUrgent(v.urgent ?? "")
      setDesc(v.desc ?? "")
      setPhoto(v.photo ?? null)
    })()
  }, [])

  const canNext = Boolean(
    serviceType.trim() &&
    serviceTask.trim() &&
    date.trim() &&
    time.trim() &&
    toolsProvided.trim() &&
    urgent.trim() &&
    desc.trim().length >= 3
  )

  const choosePhoto = async () => {
    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.9,
    })
    if (!res.canceled) setPhoto(res.assets[0]?.uri ?? null)
  }

  const onNext = async () => {
    if (!canNext) return
    await AsyncStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ serviceType, serviceTask, date, time, toolsProvided, urgent, desc, photo })
    )
    router.push("./clientforms/request3")
  }

  if (!fontsLoaded) return null

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

                <Field label="SERVICE TYPE:" value={serviceType} onChangeText={setServiceType} placeholder="Enter service type" />
                <Field label="SERVICE TASK:" value={serviceTask} onChangeText={setServiceTask} placeholder="Enter specific task" />
                <Field label="PREFERRED DATE:" value={date} onChangeText={setDate} placeholder="dd/mm/yyyy" />
                <Field label="PREFERRED TIME:" value={time} onChangeText={setTime} placeholder="--:-- --" />
                <Field label="TOOLS PROVIDED:" value={toolsProvided} onChangeText={setToolsProvided} placeholder="Yes or No" />
                <Field label="URGENT:" value={urgent} onChangeText={setUrgent} placeholder="Yes or No" />
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
                color: "#fff",
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
