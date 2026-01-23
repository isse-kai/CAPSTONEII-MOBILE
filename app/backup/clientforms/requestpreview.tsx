// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { Image, ScrollView, Text, View } from "dripsy";
// import { useRouter } from "expo-router";
// import { MotiView } from "moti";
// import React, { useEffect, useState } from "react";
// import { Alert, Dimensions, ImageBackground, Pressable } from "react-native";
// import {
//   SafeAreaView,
//   useSafeAreaInsets,
// } from "react-native-safe-area-context";
// import Header from "../clientnavbar/header";
// import ClientNavbar from "../clientnavbar/navbar";

// const { width, height } = Dimensions.get("window");

// const C = {
//   bg: "#f7f9fc",
//   text: "#0f172a",
//   sub: "#64748b",
//   blue: "#1e86ff",
//   border: "#d1d5db",
//   track: "#e5e7eb",
// };

// export default function ClientRequestPreview() {
//   const router = useRouter();
//   const insets = useSafeAreaInsets();

//   const [personalInfo, setPersonalInfo] = useState<any>(null);
//   const [serviceDetails, setServiceDetails] = useState<any>(null);
//   const [serviceRate, setServiceRate] = useState<any>(null);
//   const [summary, setSummary] = useState("");
//   const [agreements, setAgreements] = useState<any>(null);

//   useEffect(() => {
//     (async () => {
//       try {
//         // ✅ Read local storage only (no backend)
//         const rawStep1 = await AsyncStorage.getItem("request_step1");
//         const rawStep2 = await AsyncStorage.getItem("request_step2");
//         const rawStep3 = await AsyncStorage.getItem("request_step3");
//         const rawStep4 = await AsyncStorage.getItem("request_step4");

//         if (rawStep1) {
//           const v1 = JSON.parse(rawStep1);

//           // You can adjust these key names depending on what you saved in step1
//           setPersonalInfo({
//             client_id: v1.client_id ?? "local-client",
//             first_name: v1.first_name ?? v1.firstname ?? "",
//             last_name: v1.last_name ?? v1.lastname ?? "",
//             contact_number: v1.contact_number ?? v1.contactNumber ?? "",
//             email_address: v1.email_address ?? v1.email ?? "",
//             brgy: v1.brgy ?? "",
//             additional_address: v1.additional_address ?? "",
//             street: v1.street ?? "",
//             profile_picture: v1.profile_picture ?? v1.profilePicture ?? "",
//           });
//         }

//         if (rawStep2) {
//           const v2 = JSON.parse(rawStep2);
//           setServiceDetails(v2);
//         }

//         if (rawStep3) {
//           const v3 = JSON.parse(rawStep3);
//           setServiceRate(v3);
//         }

//         if (rawStep4) {
//           const v4 = JSON.parse(rawStep4);
//           setSummary(v4.summary ?? "");
//           setAgreements({
//             consent_background_checks: !!v4.consent_background_checks,
//             consent_terms_privacy: !!v4.consent_terms_privacy,
//             consent_data_privacy: !!v4.consent_data_privacy,
//           });
//         }
//       } catch (err) {
//         console.error("Error loading preview data:", err);
//       }
//     })();
//   }, []);

//   const onSubmit = async () => {
//     try {
//       // ✅ Check agreements (local)
//       if (
//         !agreements?.consent_background_checks ||
//         !agreements?.consent_terms_privacy ||
//         !agreements?.consent_data_privacy
//       ) {
//         Alert.alert(
//           "Agreements Required",
//           "You must agree to all terms and agreements before submitting."
//         );
//         return;
//       }

//       // ✅ Optional: store a final “submitted request” snapshot locally
//       const submittedPayload = {
//         submitted_at: new Date().toISOString(),
//         personalInfo,
//         serviceDetails,
//         serviceRate,
//         summary,
//         agreements,
//       };
//       await AsyncStorage.setItem(
//         "request_submitted_payload",
//         JSON.stringify(submittedPayload)
//       );

//       // ✅ Navigate to success page
//       router.push("./requestsuccess");
//     } catch (err) {
//       console.error("Error submitting request:", err);
//       Alert.alert("Submit Failed", "Something went wrong. Please try again.");
//     }
//   };

//   return (
//     <ImageBackground
//       source={require("../../../assets/welcome.jpg")}
//       resizeMode="cover"
//       style={{ flex: 1, width, height }}
//     >
//       <SafeAreaView
//         style={{
//           flex: 1,
//           backgroundColor: "rgba(249, 250, 251, 0.9)",
//           paddingBottom: insets.bottom,
//         }}
//       >
//         <ScrollView
//           contentContainerStyle={{ paddingHorizontal: 18, paddingBottom: 20 }}
//           showsVerticalScrollIndicator={false}
//         >
//           <MotiView
//             from={{ opacity: 0, translateY: 20 }}
//             animate={{ opacity: 1, translateY: 0 }}
//             transition={{ type: "timing", duration: 500 }}
//           >
//             <Header />

//             {/* Step status */}
//             <View sx={{ mb: 20 }}>
//               <Text
//                 sx={{ fontSize: 18, fontFamily: "Poppins-Bold", color: C.text }}
//               >
//                 Step 5 of 5
//               </Text>
//               <Text
//                 sx={{
//                   fontSize: 14,
//                   fontFamily: "Poppins-Regular",
//                   color: C.sub,
//                 }}
//               >
//                 Request Preview
//               </Text>
//               <View sx={{ flexDirection: "row", mt: 10, columnGap: 12 }}>
//                 {[1, 2, 3, 4, 5].map((i) => (
//                   <View
//                     key={i}
//                     sx={{
//                       flex: 1,
//                       height: 10,
//                       borderRadius: 999,
//                       bg: i <= 5 ? C.blue : C.track,
//                     }}
//                   />
//                 ))}
//               </View>
//             </View>

//             {/* Personal Information Card */}
//             <View
//               style={{
//                 backgroundColor: "#ffffffcc",
//                 borderRadius: 12,
//                 padding: 16,
//                 marginBottom: 20,
//               }}
//             >
//               <Text sx={{ fontSize: 18, fontFamily: "Poppins-Bold", mb: 12 }}>
//                 Personal Information
//               </Text>

//               {personalInfo ? (
//                 <>
//                   <Text>First Name: {personalInfo.first_name}</Text>
//                   <Text>Last Name: {personalInfo.last_name}</Text>
//                   <Text>Contact Number: {personalInfo.contact_number}</Text>
//                   <Text>Email: {personalInfo.email_address}</Text>
//                   <Text>Barangay: {personalInfo.brgy}</Text>
//                   <Text>
//                     Additional Address: {personalInfo.additional_address}
//                   </Text>
//                   <Text>Street: {personalInfo.street}</Text>

//                   {personalInfo.profile_picture ? (
//                     <Image
//                       source={{ uri: personalInfo.profile_picture }}
//                       style={{
//                         width: 100,
//                         height: 100,
//                         borderRadius: 50,
//                         marginTop: 10,
//                       }}
//                     />
//                   ) : null}
//                 </>
//               ) : (
//                 <Text>No personal info found in storage.</Text>
//               )}
//             </View>

//             {/* Service Request Details Card */}
//             <View
//               style={{
//                 backgroundColor: "#ffffffcc",
//                 borderRadius: 12,
//                 padding: 16,
//                 marginBottom: 20,
//               }}
//             >
//               <Text sx={{ fontSize: 18, fontFamily: "Poppins-Bold", mb: 12 }}>
//                 Service Request Details
//               </Text>

//               {serviceDetails ? (
//                 <>
//                   <Text>Service Type: {serviceDetails.service_type}</Text>
//                   <Text>Service Task: {serviceDetails.service_task}</Text>
//                   <Text>Preferred Date: {serviceDetails.preferred_date}</Text>
//                   <Text>Preferred Time: {serviceDetails.preferred_time}</Text>
//                   <Text>Urgent: {serviceDetails.urgent ? "Yes" : "No"}</Text>
//                   <Text>Tools Provided: {serviceDetails.tools_provided}</Text>
//                   <Text>Description: {serviceDetails.description}</Text>

//                   {serviceDetails.request_image ? (
//                     <Image
//                       source={{ uri: serviceDetails.request_image }}
//                       style={{
//                         width: "100%",
//                         height: 200,
//                         marginTop: 10,
//                         borderRadius: 8,
//                       }}
//                     />
//                   ) : null}
//                 </>
//               ) : (
//                 <Text>No service details found in storage.</Text>
//               )}
//             </View>

//             {/* Service Rate Card */}
//             <View
//               style={{
//                 backgroundColor: "#ffffffcc",
//                 borderRadius: 12,
//                 padding: 16,
//                 marginBottom: 20,
//               }}
//             >
//               <Text sx={{ fontSize: 18, fontFamily: "Poppins-Bold", mb: 12 }}>
//                 Service Rate
//               </Text>

//               {serviceRate ? (
//                 <>
//                   <Text>Rate From: {serviceRate.rate_from}</Text>
//                   <Text>Rate To: {serviceRate.rate_to}</Text>
//                   <Text>Rate Value: ₱{serviceRate.rate_value}</Text>
//                 </>
//               ) : (
//                 <Text>No rate found in storage.</Text>
//               )}
//             </View>

//             {/* Summary Card */}
//             <View
//               style={{
//                 backgroundColor: "#ffffffcc",
//                 borderRadius: 12,
//                 padding: 16,
//                 marginBottom: 20,
//               }}
//             >
//               <Text sx={{ fontSize: 18, fontFamily: "Poppins-Bold", mb: 12 }}>
//                 Summary
//               </Text>
//               <Text>{summary || "No summary provided."}</Text>
//             </View>
//           </MotiView>
//         </ScrollView>

//         {/* Sticky bottom actions */}
//         <View
//           style={{
//             flexDirection: "row",
//             paddingHorizontal: 18,
//             paddingBottom: Math.max(insets.bottom, 12),
//             paddingTop: 10,
//             backgroundColor: "#fff",
//             borderTopLeftRadius: 12,
//             borderTopRightRadius: 12,
//             shadowColor: "#000",
//             shadowOpacity: 0.2,
//             shadowRadius: 6,
//             elevation: 6,
//           }}
//         >
//           <Pressable
//             onPress={() => router.back()}
//             style={{
//               flex: 1,
//               borderWidth: 1,
//               borderColor: C.border,
//               borderRadius: 18,
//               alignItems: "center",
//               justifyContent: "center",
//               paddingVertical: 8,
//               backgroundColor: "#fff",
//             }}
//           >
//             <Text sx={{ color: C.text, fontWeight: "900", fontSize: 16 }}>
//               Back : Step 4
//             </Text>
//           </Pressable>

//           <Pressable
//             onPress={onSubmit}
//             style={{
//               flex: 1.25,
//               borderRadius: 18,
//               alignItems: "center",
//               justifyContent: "center",
//               paddingVertical: 12,
//               backgroundColor: C.blue,
//               marginLeft: 12,
//             }}
//           >
//             <Text
//               sx={{
//                 color: "#fff",
//                 fontWeight: "900",
//                 fontSize: 16,
//                 paddingLeft: 14,
//               }}
//             >
//               Submit Request
//             </Text>
//           </Pressable>
//         </View>

//         <ClientNavbar />
//       </SafeAreaView>
//     </ImageBackground>
//   );
// }
