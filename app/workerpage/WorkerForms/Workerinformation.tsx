// app/workerpage/WorkerForms/Workerinformation.tsx
import { Ionicons } from "@expo/vector-icons"
// import { Picker } from "@react-native-picker/picker" // REMOVED
import { Pressable, Text } from "dripsy"
import { useFonts } from "expo-font"
import * as ImagePicker from "expo-image-picker"
import { useRouter } from "expo-router"
import moment from "moment"
import { MotiView } from "moti"
import React, { useEffect, useState } from "react"
import {
  Alert,
  Dimensions,
  Image,
  ImageBackground,
  Modal,
  ScrollView,
  TextInput,
  View,
} from "react-native"
import DateTimePickerModal from "react-native-modal-datetime-picker"
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context"

import WorkerHeader from "../workernavbar/header"
import WorkerNavbar from "../workernavbar/navbar"

import {
  handleGetWorkerInformation,
  handleSaveWorkerInformation,
} from "../../../supabase/controllers/workerinformationcontroller"
import { getCurrentUser } from "../../../supabase/services/loginservice"
import { getUserWorkerByAuthUid } from "../../../supabase/services/workerprofileservice"

const { width } = Dimensions.get("window")

const BACOLOD_BARANGAYS = [
  "Alangilan",
  "Alijis",
  "Banago",
  "Barangay 1",
  "Barangay 2",
  "Barangay 3",
  "Barangay 4",
  "Barangay 5",
  "Barangay 6",
  "Barangay 7",
  "Barangay 8",
  "Barangay 9",
  "Barangay 10",
  "Barangay 11",
  "Barangay 12",
  "Barangay 13",
  "Barangay 14",
  "Barangay 15",
  "Barangay 16",
  "Barangay 17",
  "Barangay 18",
  "Barangay 19",
  "Barangay 20",
  "Barangay 21",
  "Barangay 22",
  "Barangay 23",
  "Barangay 24",
  "Barangay 25",
  "Barangay 26",
  "Barangay 27",
  "Barangay 28",
  "Barangay 29",
  "Barangay 30",
  "Barangay 31",
  "Barangay 32",
  "Barangay 33",
  "Barangay 34",
  "Barangay 35",
  "Barangay 36",
  "Barangay 37",
  "Barangay 38",
  "Barangay 39",
  "Barangay 40",
  "Barangay 41",
  "Bata",
  "Cabug",
  "Estefania",
  "Felisa",
  "Granada",
  "Handumanan",
  "Mandalagan",
  "Mansilingan",
  "Montevista",
  "Pahanocoy",
  "Punta Taytay",
  "Singcang-Airport",
  "Sum-ag",
  "Taculing",
  "Tangub",
  "Villamonte",
  "Vista Alegre",
]

export default function WorkerInformation() {
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

  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [dob, setDob] = useState("") // YYYY-MM-DD
  const [age, setAge] = useState("")
  const [contactNumber, setContactNumber] = useState("")
  const [emailAddress, setEmailAddress] = useState("")
  const [barangay, setBarangay] = useState<string | null>(null)
  const [street, setStreet] = useState("")
  const [profileImageUri, setProfileImageUri] = useState<string | null>(null)

  const [showDobPicker, setShowDobPicker] = useState(false)
  const [showBarangayPicker, setShowBarangayPicker] = useState(false)

  // Optional: search/filter inside barangay modal
  const [barangaySearch, setBarangaySearch] = useState("")

  const filteredBarangays = BACOLOD_BARANGAYS.filter(name =>
    name.toLowerCase().includes(barangaySearch.toLowerCase()),
  )

  useEffect(() => {
    const load = async () => {
      try {
        const authUser = await getCurrentUser()
        setAuthUid(authUser.id)

        const workerProfile = await getUserWorkerByAuthUid(authUser.id)
        const workerInfo = await handleGetWorkerInformation(authUser.id)

        setFirstName(
          workerProfile?.first_name ??
            authUser?.user_metadata?.first_name ??
            "",
        )
        setLastName(
          workerProfile?.last_name ?? authUser?.user_metadata?.last_name ?? "",
        )

        setEmailAddress(workerProfile?.email_address ?? authUser?.email ?? "")

        setContactNumber(
          workerProfile?.contact_number ??
            workerInfo?.contact_number ??
            authUser?.user_metadata?.contact_number ??
            "",
        )

        const rawDob =
          workerInfo?.birthdate ||
          workerInfo?.date_of_birth ||
          workerInfo?.dob ||
          workerProfile?.birthdate ||
          workerProfile?.date_of_birth ||
          workerProfile?.dob ||
          authUser?.user_metadata?.dob

        if (rawDob) {
          setDob(rawDob)
          const computedAge = moment().diff(
            moment(rawDob, ["YYYY-MM-DD", "MM/DD/YYYY"]),
            "years",
          )
          setAge(computedAge.toString())
        } else if (
          workerProfile?.age ||
          workerInfo?.age ||
          authUser?.user_metadata?.age
        ) {
          const srcAge =
            workerProfile?.age ||
            workerInfo?.age ||
            authUser?.user_metadata?.age
          setAge(String(srcAge))
        }

        const infoBarangay = workerInfo?.barangay ?? ""
        setBarangay(infoBarangay || null)

        setStreet(workerInfo?.street ?? workerInfo?.address ?? "")

        setProfileImageUri(workerInfo?.profile_picture_url ?? null)
      } catch (err) {
        console.error("Failed to load worker information", err)
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [])

  const handleChoosePhoto = async () => {
    const { status } =
      await ImagePicker.requestMediaLibraryPermissionsAsync()
    if (status !== "granted") {
      Alert.alert(
        "Permission needed",
        "Please allow access to your photos to upload a profile picture.",
      )
      return
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    })

    if (!result.canceled) {
      const asset = result.assets[0]
      setProfileImageUri(asset.uri)
    }
  }

  const handleConfirmDob = (selectedDate: Date) => {
    setShowDobPicker(false)
    if (!selectedDate) return

    const formatted = moment(selectedDate).format("YYYY-MM-DD")
    setDob(formatted)

    const computedAge = moment().diff(moment(selectedDate), "years")
    setAge(computedAge.toString())
  }

  // Alternative barangay selection: simple list
  const handleSelectBarangay = (name: string) => {
    setBarangay(name)
    setShowBarangayPicker(false)
  }

  const handleNext = async () => {
    if (!authUid) return

    if (
      !firstName ||
      !lastName ||
      !dob ||
      !age ||
      !contactNumber ||
      !emailAddress
    ) {
      Alert.alert("Missing details", "Please complete all required fields.")
      return
    }

    try {
      setSaving(true)

      await handleSaveWorkerInformation(authUid, {
        first_name: firstName,
        last_name: lastName,
        birthdate: dob || null,
        age: age ? Number(age) : null,
        contact_number: contactNumber,
        email_address: emailAddress,
        barangay: barangay || null,
        street: street || null,
        profile_picture_url: profileImageUri,
      })

      router.push("/workerpage/WorkerForms/WorkerWorkInformation")
    } catch (err) {
      console.error("Failed to save worker information", err)
      Alert.alert("Error", "Could not save worker information.")
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
                1 of 6 | Post a Worker Application
              </Text>
              <Text
                sx={{
                  fontSize: 24,
                  fontFamily: "Poppins-ExtraBold",
                  color: "#111827",
                  mt: 4,
                }}
              >
                Step 1: Worker Information
              </Text>
              <Text
                sx={{
                  fontSize: 14,
                  fontFamily: "Poppins-Regular",
                  color: "#4b5563",
                  mt: 4,
                }}
              >
                Please fill in your details.
              </Text>

              {/* Progress bar 1/6 */}
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
                    width: "16.7%",
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
                Personal Information
              </Text>
              <Text
                sx={{
                  fontSize: 12,
                  fontFamily: "Poppins-Regular",
                  color: "#6b7280",
                  mb: 12,
                }}
              >
                Please fill in your personal details to proceed.
              </Text>

              {/* First / Last name row */}
              <View
                style={{
                  flexDirection: "row",
                  columnGap: 10,
                  marginBottom: 10,
                }}
              >
                <View style={{ flex: 1 }}>
                  <Text sx={labelStyle}>First Name</Text>
                  <TextInput
                    value={firstName}
                    editable={false}
                    style={{
                      ...inputStyle,
                      backgroundColor: "#e5e7eb",
                      color: "#4b5563",
                    }}
                    placeholder="First Name"
                    placeholderTextColor="#9ca3af"
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <Text sx={labelStyle}>Last Name</Text>
                  <TextInput
                    value={lastName}
                    editable={false}
                    style={{
                      ...inputStyle,
                      backgroundColor: "#e5e7eb",
                      color: "#4b5563",
                    }}
                    placeholder="Last Name"
                    placeholderTextColor="#9ca3af"
                  />
                </View>
              </View>

              {/* Birthdate / Age row */}
              <View
                style={{
                  flexDirection: "row",
                  columnGap: 10,
                  marginBottom: 10,
                }}
              >
                <View style={{ flex: 1 }}>
                  <Text sx={labelStyle}>Birthdate</Text>
                  <Pressable
                    disabled
                    style={{
                      ...inputStyle,
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "center",
                      backgroundColor: "#e5e7eb",
                    }}
                  >
                    <Text
                      sx={{
                        fontSize: 14,
                        fontFamily: "Poppins-Regular",
                        color: dob ? "#4b5563" : "#9ca3af",
                      }}
                    >
                      {dob || "No birthdate"}
                    </Text>
                    <Ionicons
                      name="calendar-outline"
                      size={18}
                      color="#6b7280"
                    />
                  </Pressable>
                </View>

                <View style={{ flex: 1 }}>
                  <Text sx={labelStyle}>Age</Text>
                  <TextInput
                    value={age}
                    editable={false}
                    style={{
                      ...inputStyle,
                      backgroundColor: "#e5e7eb",
                      color: "#4b5563",
                    }}
                  />
                </View>
              </View>

              {/* Contact / Email row */}
              <View
                style={{
                  flexDirection: "row",
                  columnGap: 10,
                  marginBottom: 10,
                }}
              >
                <View style={{ flex: 1 }}>
                  <Text sx={labelStyle}>Contact Number</Text>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      borderWidth: 1,
                      borderColor: "#d1d5db",
                      borderRadius: 10,
                      backgroundColor: "#e5e7eb",
                      paddingHorizontal: 10,
                      paddingVertical: 8,
                    }}
                  >
                    <Text
                      sx={{
                        fontSize: 14,
                        fontFamily: "Poppins-Regular",
                        mr: 8,
                        color: "#4b5563",
                      }}
                    >
                      🇵🇭 +63
                    </Text>
                    <View
                      style={{
                        width: 1,
                        alignSelf: "stretch",
                        backgroundColor: "#e5e7eb",
                        marginRight: 8,
                      }}
                    />
                    <TextInput
                      value={contactNumber}
                      editable={false}
                      keyboardType="number-pad"
                      placeholder="9xxxxxxxxx"
                      placeholderTextColor="#9ca3af"
                      style={{
                        flex: 1,
                        fontSize: 14,
                        fontFamily: "Poppins-Regular",
                        color: "#4b5563",
                      }}
                    />
                  </View>
                </View>

                <View style={{ flex: 1 }}>
                  <Text sx={labelStyle}>Email Address</Text>
                  <TextInput
                    value={emailAddress}
                    editable={false}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    style={{
                      ...inputStyle,
                      backgroundColor: "#e5e7eb",
                      color: "#4b5563",
                    }}
                    placeholder="Email"
                    placeholderTextColor="#9ca3af"
                  />
                </View>
              </View>

              {/* Barangay / Street row */}
              <View
                style={{
                  flexDirection: "row",
                  columnGap: 10,
                  marginBottom: 10,
                }}
              >
                {/* Barangay field opens custom modal list */}
                <View style={{ flex: 1 }}>
                  <Text sx={labelStyle}>Barangay</Text>
                  <Pressable
                    onPress={() => {
                      setBarangaySearch("")
                      setShowBarangayPicker(true)
                    }}
                    style={{
                      ...inputStyle,
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <Text
                      sx={{
                        fontSize: 14,
                        fontFamily: "Poppins-Regular",
                        color: barangay ? "#111827" : "#9ca3af",
                      }}
                      numberOfLines={1}
                    >
                      {barangay || "Select Barangay"}
                    </Text>
                    <Ionicons
                      name="chevron-down-outline"
                      size={18}
                      color="#6b7280"
                    />
                  </Pressable>
                </View>

                {/* Street */}
                <View style={{ flex: 1 }}>
                  <Text sx={labelStyle}>Street</Text>
                  <TextInput
                    value={street}
                    onChangeText={setStreet}
                    style={inputStyle}
                    placeholder="House No. and Street"
                    placeholderTextColor="#9ca3af"
                  />
                </View>
              </View>

              {/* Profile picture & button */}
              <View
                style={{
                  marginTop: 12,
                  borderTopWidth: 1,
                  borderTopColor: "#e5e7eb",
                  paddingTop: 12,
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <View style={{ flex: 1, marginRight: 12 }}>
                  <Text
                    sx={{
                      fontSize: 16,
                      fontFamily: "Poppins-Bold",
                      color: "#111827",
                      mb: 4,
                    }}
                  >
                    Worker Profile Picture
                  </Text>
                  <Text
                    sx={{
                      fontSize: 12,
                      fontFamily: "Poppins-Regular",
                      color: "#6b7280",
                    }}
                  >
                    Upload your picture here.
                  </Text>
                  <Pressable
                    onPress={handleChoosePhoto}
                    sx={{
                      mt: 10,
                      bg: "#008CFC",
                      borderRadius: 999,
                      py: 10,
                      px: 16,
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
                      Choose Photo
                    </Text>
                  </Pressable>
                </View>

                <View
                  style={{
                    width: width * 0.25,
                    height: width * 0.25,
                    borderRadius: (width * 0.25) / 2,
                    backgroundColor: "#e5e7eb",
                    alignItems: "center",
                    justifyContent: "center",
                    overflow: "hidden",
                  }}
                >
                  {profileImageUri ? (
                    <Image
                      source={{ uri: profileImageUri }}
                      style={{
                        width: "100%",
                        height: "100%",
                      }}
                    />
                  ) : (
                    <Ionicons name="add" size={32} color="#9ca3af" />
                  )}
                </View>
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
                onPress={() => router.back()}
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
                  Back
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
                  {saving ? "Saving..." : "Next: Work Information"}
                </Text>
              </Pressable>
            </View>
          </MotiView>
        </ScrollView>

        {/* DOB picker (kept, but birthdate field is read-only now) */}
        <DateTimePickerModal
          isVisible={showDobPicker}
          mode="date"
          maximumDate={new Date()}
          onConfirm={handleConfirmDob}
          onCancel={() => setShowDobPicker(false)}
        />

        {/* Barangay picker modal – custom list instead of <Picker> */}
        <Modal
          visible={showBarangayPicker}
          transparent
          animationType="slide"
          onRequestClose={() => setShowBarangayPicker(false)}
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
                maxHeight: "70%",
              }}
            >
              {/* Header actions */}
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
                <Pressable onPress={() => setShowBarangayPicker(false)}>
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
                  Select Barangay
                </Text>
                {/* spacer to balance header */}
                <View style={{ width: 50 }} />
              </View>

              {/* Search input */}
              <View
                style={{
                  paddingHorizontal: 16,
                  paddingTop: 8,
                  paddingBottom: 4,
                }}
              >
                <TextInput
                  value={barangaySearch}
                  onChangeText={setBarangaySearch}
                  placeholder="Search barangay..."
                  placeholderTextColor="#9ca3af"
                  style={{
                    borderWidth: 1,
                    borderColor: "#d1d5db",
                    borderRadius: 10,
                    paddingHorizontal: 12,
                    paddingVertical: 8,
                    fontSize: 14,
                    fontFamily: "Poppins-Regular",
                    color: "#111827",
                  }}
                />
              </View>

              {/* List of barangays */}
              <ScrollView
                style={{
                  paddingHorizontal: 16,
                  paddingVertical: 4,
                }}
              >
                {filteredBarangays.map(name => {
                  const selected = barangay === name
                  return (
                    <Pressable
                      key={name}
                      onPress={() => handleSelectBarangay(name)}
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
                          fontSize: 14,
                          fontFamily: "Poppins-Regular",
                          color: "#111827",
                        }}
                      >
                        {name}
                      </Text>
                      {selected && (
                        <Ionicons
                          name="checkmark"
                          size={18}
                          color="#008CFC"
                        />
                      )}
                    </Pressable>
                  )
                })}
                {filteredBarangays.length === 0 && (
                  <View
                    style={{
                      paddingVertical: 16,
                      alignItems: "center",
                    }}
                  >
                    <Text
                      sx={{
                        fontSize: 14,
                        fontFamily: "Poppins-Regular",
                        color: "#6b7280",
                      }}
                    >
                      No barangays found.
                    </Text>
                  </View>
                )}
              </ScrollView>
            </View>
          </View>
        </Modal>

        <WorkerNavbar />
      </SafeAreaView>
    </ImageBackground>
  )
}
