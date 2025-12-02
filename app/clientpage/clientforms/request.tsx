import { Ionicons } from '@expo/vector-icons'
import AsyncStorage from "@react-native-async-storage/async-storage"
import { Picker } from "@react-native-picker/picker"
import { Pressable, ScrollView, Text, TextInput, View } from "dripsy"
import { useFonts } from "expo-font"
import * as ImagePicker from "expo-image-picker"
import { useRouter } from "expo-router"
import { MotiView } from "moti"
import React, { useEffect, useMemo, useState } from "react"
import {
  Dimensions,
  Image,
  ImageBackground,
  KeyboardTypeOptions,
} from "react-native"
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context"
import { saveClientRequest } from "../../../supabase/services/clientservice"
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

const STORAGE_KEY = "request_step1"

const BARANGAYS: string[] = [
  "Select Barangay",
  "Barangay 1","Barangay 2","Barangay 3","Barangay 4","Barangay 5",
  "Barangay 6","Barangay 7","Barangay 8","Barangay 9","Barangay 10",
  "Alangilan","Alijis","Banago","Bata","Cabug","Estefanía","Felisa",
  "Granada","Handumanan","Mandalagan","Mansilingan","Montevista",
  "Pahanocoy","Punta Taytay","Singcang-Airport","Sum-ag","Taculing",
  "Tangub","Villamonte","Vista Alegre",
]

export default function ClientRequest1() {
  const router = useRouter()
  const insets = useSafeAreaInsets()

  const [fontsLoaded] = useFonts({
    "Poppins-Regular": require("../../../assets/fonts/Poppins/Poppins-Regular.ttf"),
    "Poppins-Bold": require("../../../assets/fonts/Poppins/Poppins-Bold.ttf"),
  })

  const [first, setFirst] = useState("")
  const [last, setLast] = useState("")
  const [phone, setPhone] = useState("")
  const [email, setEmail] = useState("")
  const [brgy, setBrgy] = useState<string>(BARANGAYS[0])
  const [street, setStreet] = useState("")
  const [additionalAddr, setAdditionalAddr] = useState("")
  const [photo, setPhoto] = useState<string | null>(null)

  useEffect(() => {
    (async () => {
      const raw = await AsyncStorage.getItem(STORAGE_KEY)
      if (!raw) return
      const v = JSON.parse(raw)
      setFirst(v.first ?? "")
      setLast(v.last ?? "")
      setPhone(v.phone ?? "")
      setEmail(v.email ?? "")
      setBrgy(v.brgy ?? BARANGAYS[0])
      setStreet(v.street ?? "")
      setAdditionalAddr(v.additional_address ?? "")
      setPhoto(v.photo ?? null)
    })()
  }, [])

  const emailOk = useMemo(() => /\S+@\S+\.\S+/.test(email), [email])
  const phoneOk = useMemo(() => phone.trim().length === 10, [phone])
  const brgyOk = useMemo(() => brgy !== BARANGAYS[0], [brgy])

  const canNext = Boolean(
    first.trim() &&
      last.trim() &&
      emailOk &&
      phoneOk &&
      brgyOk &&
      street.trim() &&
      additionalAddr.trim()
  )

  const choosePhoto = async () => {
    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.9,
    })
    if (!res.canceled) setPhoto(res.assets[0]?.uri ?? null)
  }

  const onNext = async () => {
    if (!canNext) return

    await AsyncStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ first, last, phone, email, brgy, street, additional_address: additionalAddr, photo })
    )

    try {
      await saveClientRequest({
        first_name: first,
        last_name: last,
        email_address: email,
        phone,
        barangay: brgy,
        street,
<<<<<<< HEAD
        additional_address: moreAddr,
=======
        additional_address: additionalAddr,
>>>>>>> 13ab7732e6273eb2b250cddef2516c322462876d
        profile_picture_url: photo,
      })
      router.push("./clientforms/request2")
    } catch (err) {
      console.error(err)
    }
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
            {/* Main content */}
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
                Step 1 of 4
              </Text>
              <Text sx={{ fontSize: 14, fontFamily: "Poppins-Regular", color: C.sub }}>
                Client Information
              </Text>
              <View sx={{ flexDirection: "row", mt: 10, columnGap: 12 }}>
                {[1, 2, 3, 4].map((i) => (
                  <View
                    key={i}
                    sx={{
                      flex: 1,
                      height: 10,
                      borderRadius: 999,
                      bg: i <= 1 ? C.blue : C.track,
                    }}
                  />
                ))}
              </View>
            </View>

            {/* Personal Info Card */}
            <View style={{ backgroundColor: '#ffffffcc', borderRadius: 12, padding: 16, marginBottom: 20 }}>
              <Text sx={{ fontSize: 18, fontFamily: 'Poppins-Bold', mb: 12 }}>
                Personal Information
              </Text>

              <Field label="FIRST NAME:" value={first} onChangeText={setFirst} placeholder="Enter first name" editable={!first} />
              <Field label="LAST NAME:" value={last} onChangeText={setLast} placeholder="Enter last name" editable={!last}/>
              <Field label="EMAIL:" value={email} onChangeText={setEmail} placeholder="Enter email" keyboardType="email-address" editable={!email}/>
              
              <View style={{ marginBottom: 12 }}>
                <Text sx={{ fontSize: 12, fontFamily: 'Poppins-Bold', marginBottom: 4 }}>
                  CONTACT NUMBER:
                </Text>

                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    borderWidth: 1,
                    borderColor: C.border,
                    borderRadius: 8,
                    backgroundColor: "#fff",
                  }}
                >
                  {/* Non-editable prefix */}
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      paddingHorizontal: 10,
                      paddingVertical: 12,
                      borderRightWidth: 1,
                      borderRightColor: C.border,
                    }}
                  >
                    <Text style={{ fontSize: 16 }}>🇵🇭</Text>
                    <Text style={{ fontSize: 14, marginLeft: 6, color: C.text }}>+63</Text>
                  </View>

                  {/* Editable input */}
                  <TextInput
                    value={phone}
                    onChangeText={setPhone}
                    placeholder="Enter contact number"
                    placeholderTextColor={C.placeholder}
                    keyboardType="number-pad"
                    style={{
                      flex: 1,
                      paddingHorizontal: 10,
                      paddingVertical: 12,
                      fontSize: 14,
                      fontFamily: 'Poppins-Regular',
                      color: C.text,
                    }}
                  />
                </View>
              </View>

              {/* Barangay */}
              <View style={{ marginBottom: 12 }}>
                <Text sx={{ fontSize: 12, fontFamily: 'Poppins-Bold', mb: 4 }}>BARANGAY:</Text>
                <View style={{ borderWidth: 1, borderColor: C.border, borderRadius: 8, overflow: 'hidden', backgroundColor: '#fff' }}>
                  <Picker
                    selectedValue={brgy}
                    onValueChange={(itemValue) => setBrgy(itemValue)}
                    style={{ fontSize: 14, fontFamily: 'Poppins-Regular', color: C.text }}
                  >
                    {BARANGAYS.map((b) => (
                      <Picker.Item
                        key={b}
                        label={b}
                        value={b}
                        color={b === "Select Barangay" ? C.placeholder : C.text}
                      />
                    ))}
                  </Picker>
                </View>
              </View>

              <Field label="STREET:" value={street} onChangeText={setStreet} placeholder="House No. and Street" />
              <Field label="ADDITIONAL ADDRESS:" value={additionalAddr} onChangeText={setAdditionalAddr} placeholder="Landmark etc." multiline />
            </View>

            {/* Profile Photo Card */}
            <View style={{ backgroundColor: '#ffffffcc', borderRadius: 12, padding: 16, marginBottom: 20 }}>
              <Text sx={{ fontSize: 18, fontFamily: 'Poppins-Bold', mb: 12 }}>
                Profile Picture
              </Text>

              {/* Preview / No Image */}
              <View
                style={{
                  alignSelf: 'center',
                  width: 140,
                  height: 140,
                  borderRadius: 70,
                  borderWidth: 1,
                  borderColor: C.border,
                  backgroundColor: '#f9fafb',
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden',
                  marginBottom: 16, // spacing before button
                }}
              >
                {photo ? (
                  <Image
                    source={{ uri: photo }}
                    style={{ width: '100%', height: '100%' }}
                    resizeMode="cover"
                  />
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
            borderTopLeftRadius: 10,
            borderTopRightRadius: 10,
            shadowColor: "#000",
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 3
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
            <Text sx={{ color: C.text, fontWeight: "900", fontSize: 16 }}>Back</Text>
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
            <Text sx={{ color: "#fff", fontWeight: "900", fontSize: 16, paddingLeft: 14 }}>
              Next : Service Request Details
            </Text>
          </Pressable>
        </View>

      <ClientNavbar />
    </SafeAreaView>
  </ImageBackground>
);
}

/* Shared Field Component */
type FieldProps = {
  label: string
  value: string
  onChangeText: (text: string) => void
  placeholder: string
  multiline?: boolean
  keyboardType?: KeyboardTypeOptions
  editable?: boolean
}

function Field({
  label,
  value,
  onChangeText,
  placeholder,
  multiline = false,
  keyboardType = "default",
  editable = true,
}: FieldProps) {
  return (
    <View style={{ marginBottom: 12 }}>
      <Text sx={{ fontSize: 12, fontFamily: 'Poppins-Bold', marginBottom: 4 }}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={C.placeholder}
        keyboardType={keyboardType}
        multiline={multiline}
        editable={editable}
        style={{
          borderWidth: 1,
          borderColor: C.border,
          borderRadius: 8,
          paddingHorizontal: 10,
          paddingVertical: 12,
          fontSize: 14,
          fontFamily: 'Poppins-Regular',
          backgroundColor: editable? '#fff' : '#f1f5f9',
          color: C.text,
          minHeight: multiline ? 80 : undefined,
        }}
      />
    </View>
  );
}
