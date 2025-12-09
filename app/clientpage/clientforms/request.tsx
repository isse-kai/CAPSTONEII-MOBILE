// (Only layout / UI imports added — no function or logic changes)
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
  Keyboard,
  KeyboardAvoidingView,
  KeyboardTypeOptions,
  Platform,
  TouchableWithoutFeedback,
  useWindowDimensions,
} from "react-native"
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context"
import { supabase } from '../../../supabase/db'
import {
  getClientInformationByAuthUid,
  getUserClientByAuthUid,
  saveClientProfile,
  updateClientProfile
} from "../../../supabase/services/clientprofileservice"
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
  const { height: winHeight } = useWindowDimensions()

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

  // ✅ Prefill from Supabase
  useEffect(() => {
    (async () => {
      try {
        const { data: { user }, error } = await supabase.auth.getUser()
        if (error || !user) return

        // Personal info
        const userClient = await getUserClientByAuthUid(user.id)
        if (userClient) {
          setFirst(userClient.first_name ?? "")
          setLast(userClient.last_name ?? "")
          setEmail(userClient.email_address ?? "")
          setPhone(userClient.contact_number ?? "")
        }

        // Address/photo info
        const clientInfo = await getClientInformationByAuthUid(user.id)
        if (clientInfo) {
          setBrgy(clientInfo.barangay ?? BARANGAYS[0])
          setStreet(clientInfo.street ?? "")
          setAdditionalAddr(clientInfo.additional_address ?? "")
          setPhoto(clientInfo.profile_picture_url ?? null)
        }
      } catch (err) {
        console.error("Error fetching profile:", err)
      }
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

  // ✅ Save before navigating
  const onNext = async () => {
    if (!canNext) return

    await AsyncStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ first, last, phone, email, brgy, street, additional_address: additionalAddr, photo })
    )

    try {
      const { data: { user }, error } = await supabase.auth.getUser()
      if (error || !user) {
        console.error("No authenticated user", error)
        return
      }
      const authUid = user.id

      const userClient = await getUserClientByAuthUid(authUid)
      // const clientInfo = await getClientInformationByAuthUid(authUid)

      // ✅ If no user_client row, create it
      if (!userClient) {
        await updateClientProfile(authUid, {
          first_name: first,
          last_name: last,
          email_address: email,
          contact_number: phone,
        })
      } else {
        await updateClientProfile(authUid, {
          first_name: first,
          last_name: last,
          email_address: email,
          contact_number: phone,
        })
      }

      // ✅ If no client_information row, upsert it
      await saveClientProfile(authUid, {
        auth_uid: authUid,
        barangay: brgy,
        street,
        additional_address: additionalAddr,
        profile_picture_url: photo ?? null,
      })

      router.push("./request2")
    } catch (err) {
      console.error("Error saving profile:", err)
    }
  }

  if (!fontsLoaded) return null

  // Reserve space at bottom so ScrollView content won't be hidden by the sticky bar
  const BOTTOM_BAR_HEIGHT = 80
  const scrollPaddingBottom = BOTTOM_BAR_HEIGHT + Math.max(16, insets.bottom)

  return (
    <ImageBackground
      source={require("../../../assets/welcome.jpg")}
      resizeMode="cover"
      style={{ flex: 1 }} // removed fixed width/height for responsiveness
    >
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: "rgba(249, 250, 251, 0.9)",
        }}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          style={{ flex: 1 }}
        >
          <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
            <View style={{ flex: 1 }}>
              {/* Main content */}
              <View style={{ flex: 1 }}>
                <ScrollView
                  contentContainerStyle={{ paddingHorizontal: 18, paddingBottom: scrollPaddingBottom }}
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

              {/* Sticky bottom actions (made absolute so it stays visible on small screens and above keyboard) */}
              <View
                style={{
                  position: "absolute",
                  left: 0,
                  right: 0,
                  bottom: 0,
                  paddingHorizontal: 18,
                  paddingTop: 10,
                  paddingBottom: Math.max(12, insets.bottom),
                }}
                pointerEvents="box-none"
              >
                <View
                  style={{
                    flexDirection: "row",
                    backgroundColor: "#fff",
                    borderTopLeftRadius: 10,
                    borderTopRightRadius: 10,
                    shadowColor: "#000",
                    shadowOpacity: 0.1,
                    shadowRadius: 4,
                    elevation: 3,
                    padding: 10,
                    bottom: 48,
                    borderRadius: 15
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
                      paddingLeft: 14,
                    }}
                  >
                    <Text sx={{ color: "#fff", fontWeight: "900", fontSize: 16 }}>
                      Next : Service Request Details
                    </Text>
                  </Pressable>
                </View>
              </View>

              <ClientNavbar />
            </View>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
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
