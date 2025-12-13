import AsyncStorage from "@react-native-async-storage/async-storage"
import { Image, ScrollView, Text, View } from "dripsy"
import { useRouter } from "expo-router"
import { MotiView } from "moti"
import React, { useEffect, useState } from "react"
import {
  Dimensions,
  ImageBackground,
  Pressable,
} from "react-native"
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context"
import { supabase } from "../../../supabase/db"
import Header from "../clientnavbar/header"
import ClientNavbar from "../clientnavbar/navbar"

const { width, height } = Dimensions.get("window")

const C = {
  bg: "#f7f9fc",
  text: "#0f172a",
  sub: "#64748b",
  blue: "#1e86ff",
  border: "#d1d5db",
  track: "#e5e7eb",
}

export default function ClientRequestPreview() {
  const router = useRouter()
  const insets = useSafeAreaInsets()

  const [personalInfo, setPersonalInfo] = useState<any>(null)
  const [serviceDetails, setServiceDetails] = useState<any>(null)
  const [serviceRate, setServiceRate] = useState<any>(null)
  const [summary, setSummary] = useState("")
  const [agreements, setAgreements] = useState<any>(null)

useEffect(() => {
  (async () => {
    const rawStep1 = await AsyncStorage.getItem("request_step1")
    if (!rawStep1) {
      console.log("No step1 data in AsyncStorage")
      return
    }

    const step1Data = JSON.parse(rawStep1)
    console.log("Step1Data:", step1Data)

    if (step1Data?.client_id) {
      const clientId = step1Data.client_id

      try {
        const { data: userClient, error: userErr } = await supabase
          .from("user_client")
          .select("first_name, last_name, contact_number, email_address")
          .eq("client_id", clientId)
          .single()
        if (userErr) console.error("user_client error:", userErr)

        const { data: clientInfo, error: infoErr } = await supabase
          .from("client_information")
          .select("brgy, additional_address, street, profile_picture")
          .eq("client_id", clientId)
          .single()
        if (infoErr) console.error("client_information error:", infoErr)

        setPersonalInfo({ client_id: clientId, ...userClient, ...clientInfo })
        console.log("PersonalInfo:", { client_id: clientId, ...userClient, ...clientInfo })

        const { data: details } = await supabase
          .from("client_service_request_details")
          .select("*")
          .eq("client_id", clientId)
          .single()
        setServiceDetails(details)
        console.log("ServiceDetails:", details)

        const { data: rate } = await supabase
          .from("client_service_rate")
          .select("*")
          .eq("client_id", clientId)
          .single()
        setServiceRate(rate)
        console.log("ServiceRate:", rate)
      } catch (err) {
        console.error("Error fetching preview data:", err)
      }
    }

    const rawStep4 = await AsyncStorage.getItem("request_step4")
    if (rawStep4) {
      const v = JSON.parse(rawStep4)
      setSummary(v.summary ?? "")
      setAgreements({
        consent_background_checks: v.consent_background_checks,
        consent_terms_privacy: v.consent_terms_privacy,
        consent_data_privacy: v.consent_data_privacy,
      })
      console.log("Agreements:", v)
    }
  })()
}, [])

  const onSubmit = async () => {
    try {
      const { data: { user }, error } = await supabase.auth.getUser()
      if (error || !user) {
        console.error("No authenticated user", error)
        return
      }

      const clientId = personalInfo?.client_id

      // ✅ Check agreements
      if (!agreements?.consent_background_checks || !agreements?.consent_terms_privacy || !agreements?.consent_data_privacy) {
        alert("You must agree to all terms and agreements before submitting.")
        return
      }

      // Insert service request details
      if (serviceDetails) {
        await supabase.from("client_service_request_details").insert([{
          client_id: clientId,
          ...serviceDetails,
          created_at: new Date().toISOString(),
        }])
      }

      // Insert service rate
      if (serviceRate) {
        await supabase.from("client_service_rate").insert([{
          client_id: clientId,
          ...serviceRate,
          created_at: new Date().toISOString(),
        }])
      }

      // Insert agreements (optional table)
      await supabase.from("client_terms_agreement").insert([{
        client_id: clientId,
        auth_uid: user.id,
        email_address: personalInfo?.email_address,
        consent_background_checks: agreements.consent_background_checks,
        consent_terms_privacy: agreements.consent_terms_privacy,
        consent_data_privacy: agreements.consent_data_privacy,
        created_at: new Date().toISOString(),
      }])

      router.push("./requestsuccess")
    } catch (err) {
      console.error("Error submitting request:", err)
    }
  }

  return (
    <ImageBackground source={require("../../../assets/welcome.jpg")} resizeMode="cover" style={{ flex: 1, width, height }}>
      <SafeAreaView style={{ flex: 1, backgroundColor: "rgba(249, 250, 251, 0.9)", paddingBottom: insets.bottom }}>
        <ScrollView contentContainerStyle={{ paddingHorizontal: 18, paddingBottom: 20 }} showsVerticalScrollIndicator={false}>
          <MotiView from={{ opacity: 0, translateY: 20 }} animate={{ opacity: 1, translateY: 0 }} transition={{ type: "timing", duration: 500 }}>
            <Header />

            {/* Step status */}
            <View sx={{ mb: 20 }}>
              <Text sx={{ fontSize: 18, fontFamily: "Poppins-Bold", color: C.text }}>Step 5 of 5</Text>
              <Text sx={{ fontSize: 14, fontFamily: "Poppins-Regular", color: C.sub }}>Request Preview</Text>
              <View sx={{ flexDirection: "row", mt: 10, columnGap: 12 }}>
                {[1, 2, 3, 4, 5].map((i) => (
                  <View key={i} sx={{ flex: 1, height: 10, borderRadius: 999, bg: i <= 5 ? C.blue : C.track }} />
                ))}
              </View>
            </View>

            {/* Personal Information Card */}
            <View style={{ backgroundColor: "#ffffffcc", borderRadius: 12, padding: 16, marginBottom: 20 }}>
              <Text sx={{ fontSize: 18, fontFamily: "Poppins-Bold", mb: 12 }}>Personal Information</Text>
              {personalInfo && (
                <>
                  <Text>First Name: {personalInfo.first_name}</Text>
                  <Text>Last Name: {personalInfo.last_name}</Text>
                  <Text>Contact Number: {personalInfo.contact_number}</Text>
                  <Text>Email: {personalInfo.email_address}</Text>
                  <Text>Barangay: {personalInfo.brgy}</Text>
                  <Text>Additional Address: {personalInfo.additional_address}</Text>
                  <Text>Street: {personalInfo.street}</Text>
                  {personalInfo.profile_picture && (
                    <Image source={{ uri: personalInfo.profile_picture }} style={{ width: 100, height: 100, borderRadius: 50, marginTop: 10 }} />
                  )}
                </>
              )}
            </View>

            {/* Service Request Details Card */}
            <View style={{ backgroundColor: "#ffffffcc", borderRadius: 12, padding: 16, marginBottom: 20 }}>
              <Text sx={{ fontSize: 18, fontFamily: "Poppins-Bold", mb: 12 }}>Service Request Details</Text>
              {serviceDetails && (
                <>
                  <Text>Service Type: {serviceDetails.service_type}</Text>
                  <Text>Service Task: {serviceDetails.service_task}</Text>
                  <Text>Preferred Date: {serviceDetails.preferred_date}</Text>
                  <Text>Preferred Time: {serviceDetails.preferred_time}</Text>
                  <Text>Urgent: {serviceDetails.urgent ? "Yes" : "No"}</Text>
                  <Text>Tools Provided: {serviceDetails.tools_provided}</Text>
                  <Text>Description: {serviceDetails.description}</Text>
                  {serviceDetails.request_image && (
                    <Image
                      source={{ uri: serviceDetails.request_image }}
                      style={{ width: "100%", height: 200, marginTop: 10, borderRadius: 8 }}
                    />
                  )}
                </>
              )}
            </View>

            {/* Service Rate Card */}
            <View style={{ backgroundColor: "#ffffffcc", borderRadius: 12, padding: 16, marginBottom: 20 }}>
              <Text sx={{ fontSize: 18, fontFamily: "Poppins-Bold", mb: 12 }}>Service Rate</Text>
              {serviceRate && (
                <>
                  <Text>Rate From: {serviceRate.rate_from}</Text>
                  <Text>Rate To: {serviceRate.rate_to}</Text>
                  <Text>Rate Value: ₱{serviceRate.rate_value}</Text>
                </>
              )}
            </View>

            {/* Summary Card */}
            <View style={{ backgroundColor: "#ffffffcc", borderRadius: 12, padding: 16, marginBottom: 20 }}>
              <Text sx={{ fontSize: 18, fontFamily: "Poppins-Bold", mb: 12 }}>Summary</Text>
              <Text>{summary}</Text>
            </View>
          </MotiView>
        </ScrollView>

        {/* Sticky bottom actions */}
        <View
          style={{
            flexDirection: "row",
            paddingHorizontal: 18,
            paddingBottom: Math.max(insets.bottom, 12),
            paddingTop: 10,
            backgroundColor: "#fff",
            borderTopLeftRadius: 12,
            borderTopRightRadius: 12,
            shadowColor: "#000",
            shadowOpacity: 0.2,
            shadowRadius: 6,
            elevation: 6,
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
              Back : Step 4
            </Text>
          </Pressable>

          <Pressable
            onPress={onSubmit}
            style={{
              flex: 1.25,
              borderRadius: 18,
              alignItems: "center",
              justifyContent: "center",
              paddingVertical: 12,
              backgroundColor: C.blue,
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
              Submit Request
            </Text>
          </Pressable>
        </View>

        <ClientNavbar />
      </SafeAreaView>
    </ImageBackground>
  )
}
