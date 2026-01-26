// import { Ionicons } from "@expo/vector-icons";
// import { Pressable, Text } from "dripsy";
// import { useFonts } from "expo-font";
// import moment from "moment";
// import { MotiView } from "moti";
// import React from "react";
// import { ImageBackground, ScrollView, TextInput, View } from "react-native";
// import DateTimePickerModal from "react-native-modal-datetime-picker";
// import {
//   SafeAreaView,
//   useSafeAreaInsets,
// } from "react-native-safe-area-context";
// import Header from "../../clientnavbar/header";
// import ClientNavbar from "../../clientnavbar/navbar";

// export default function AccountSettings() {
//   const insets = useSafeAreaInsets();

//   const [fontsLoaded] = useFonts({
//     "Poppins-Regular": require("../../../../assets/fonts/Poppins/Poppins-Regular.ttf"),
//     "Poppins-Bold": require("../../../../assets/fonts/Poppins/Poppins-Bold.ttf"),
//     "Poppins-ExtraBold": require("../../../../assets/fonts/Poppins/Poppins-ExtraBold.ttf"),
//   });

//   // ✅ Frontend-only dummy user (no backend)
//   const [user] = React.useState<any>({
//     confirmed_at: true,
//     created_at: new Date().toISOString(),
//     email: "user@email.com",
//     user_metadata: { first_name: "First", last_name: "Last" },
//     id: "local-user",
//   });

//   const [facebook, setFacebook] = React.useState("");
//   const [instagram, setInstagram] = React.useState("");
//   const [successMessage, setSuccessMessage] = React.useState<string>("");

//   const [dob, setDob] = React.useState<string>(""); // YYYY-MM-DD
//   const [contactNumber, setContactNumber] = React.useState<string>(""); // local only
//   const [showPicker, setShowPicker] = React.useState(false);

//   const showSuccess = (msg: string) => {
//     setSuccessMessage(msg);
//     setTimeout(() => setSuccessMessage(""), 3000);
//   };

//   function calculateAge(d: string): string {
//     if (!d) return "";
//     const birthDate = new Date(d);
//     const today = new Date();
//     let age = today.getFullYear() - birthDate.getFullYear();
//     const m = today.getMonth() - birthDate.getMonth();
//     if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--;
//     return age.toString();
//   }

//   // ✅ Local-only handlers (no backend)
//   const handleUpdateContact = () =>
//     showSuccess("Contact number updated (local only)");
//   const handleRemoveContact = () => {
//     setContactNumber("");
//     showSuccess("Contact number removed (local only)");
//   };

//   const handleUpdateDob = () => showSuccess("DOB updated (local only)");
//   const handleRemoveDob = () => {
//     setDob("");
//     showSuccess("DOB removed (local only)");
//   };

//   const handleUpdateFacebook = () =>
//     showSuccess("Facebook updated (local only)");
//   const handleRemoveFacebook = () => {
//     setFacebook("");
//     showSuccess("Facebook removed (local only)");
//   };

//   const handleUpdateInstagram = () =>
//     showSuccess("Instagram updated (local only)");
//   const handleRemoveInstagram = () => {
//     setInstagram("");
//     showSuccess("Instagram removed (local only)");
//   };

//   if (!fontsLoaded) return null;

//   return (
//     <ImageBackground
//       source={require("../../../../assets/login.jpg")}
//       style={{ flex: 1 }}
//       resizeMode="cover"
//     >
//       <SafeAreaView
//         style={{
//           flex: 1,
//           paddingBottom: insets.bottom,
//           backgroundColor: "rgba(249, 250, 251, 0.9)",
//         }}
//       >
//         <ScrollView
//           contentContainerStyle={{
//             flexGrow: 1,
//             paddingHorizontal: 18,
//             paddingBottom: 100,
//           }}
//           showsVerticalScrollIndicator={false}
//         >
//           <MotiView
//             from={{ opacity: 0, translateY: 20 }}
//             animate={{ opacity: 1, translateY: 0 }}
//             transition={{ type: "timing", duration: 400 }}
//             style={{ flex: 1 }}
//           >
//             <Header />

//             {/* Account Details */}
//             <View
//               style={{
//                 backgroundColor: "#ffffffcc",
//                 borderRadius: 12,
//                 padding: 16,
//                 marginBottom: 20,
//               }}
//             >
//               <View
//                 style={{
//                   flexDirection: "row",
//                   alignItems: "center",
//                   justifyContent: "space-between",
//                   marginBottom: 12,
//                 }}
//               >
//                 <View style={{ flexDirection: "row", alignItems: "center" }}>
//                   <Ionicons
//                     name="person-outline"
//                     size={22}
//                     color="#374151"
//                     style={{ marginRight: 8 }}
//                   />
//                   <Text sx={{ fontSize: 18, fontFamily: "Poppins-Bold" }}>
//                     Profile
//                   </Text>
//                 </View>

//                 <View
//                   style={{
//                     flexDirection: "row",
//                     alignItems: "center",
//                     paddingHorizontal: 12,
//                     paddingVertical: 6,
//                     borderRadius: 12,
//                     backgroundColor: user?.confirmed_at ? "#dcfce7" : "#fee2e2",
//                   }}
//                 >
//                   <View
//                     style={{
//                       width: 12,
//                       height: 12,
//                       borderRadius: 6,
//                       marginRight: 8,
//                       backgroundColor: user?.confirmed_at
//                         ? "#22c55e"
//                         : "#ef4444",
//                     }}
//                   />
//                   <Text
//                     sx={{
//                       fontSize: 14,
//                       fontFamily: "Poppins-Bold",
//                       color: user?.confirmed_at ? "#166534" : "#991b1b",
//                     }}
//                   >
//                     {user?.confirmed_at ? "Active" : "Inactive"}
//                   </Text>
//                 </View>
//               </View>

//               <View style={{ marginBottom: 12 }}>
//                 <Text sx={{ fontSize: 14, fontFamily: "Poppins-Bold", mb: 2 }}>
//                   ACCOUNT CREATED
//                 </Text>
//                 <Text
//                   sx={{
//                     fontSize: 14,
//                     fontFamily: "Poppins-Regular",
//                     color: "#374151",
//                   }}
//                 >
//                   {user?.created_at
//                     ? new Date(user.created_at).toLocaleString()
//                     : "N/A"}
//                 </Text>
//               </View>
//             </View>

//             {/* Personal Information */}
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

//               {/* First Name */}
//               <View style={{ marginBottom: 12 }}>
//                 <Text sx={{ fontSize: 12, fontFamily: "Poppins-Bold", mb: 4 }}>
//                   FIRST NAME:
//                 </Text>
//                 <TextInput
//                   value={user?.user_metadata?.first_name || "N/A"}
//                   editable={false}
//                   style={{
//                     borderWidth: 1,
//                     borderColor: "#d1d5db",
//                     borderRadius: 8,
//                     paddingHorizontal: 10,
//                     fontSize: 14,
//                     fontFamily: "Poppins-Regular",
//                     backgroundColor: "#f9fafb",
//                     color: "#374151",
//                   }}
//                 />
//               </View>

//               {/* Last Name */}
//               <View style={{ marginBottom: 12 }}>
//                 <Text sx={{ fontSize: 12, fontFamily: "Poppins-Bold", mb: 4 }}>
//                   LAST NAME:
//                 </Text>
//                 <TextInput
//                   value={user?.user_metadata?.last_name || "N/A"}
//                   editable={false}
//                   style={{
//                     borderWidth: 1,
//                     borderColor: "#d1d5db",
//                     borderRadius: 8,
//                     paddingHorizontal: 10,
//                     fontSize: 14,
//                     fontFamily: "Poppins-Regular",
//                     backgroundColor: "#f9fafb",
//                     color: "#374151",
//                   }}
//                 />
//               </View>

//               {/* Email */}
//               <View style={{ marginBottom: 12 }}>
//                 <Text sx={{ fontSize: 12, fontFamily: "Poppins-Bold", mb: 4 }}>
//                   EMAIL:
//                 </Text>
//                 <TextInput
//                   value={user?.email || "N/A"}
//                   editable={false}
//                   style={{
//                     borderWidth: 1,
//                     borderColor: "#d1d5db",
//                     borderRadius: 8,
//                     paddingHorizontal: 10,
//                     fontSize: 14,
//                     fontFamily: "Poppins-Regular",
//                     backgroundColor: "#f9fafb",
//                     color: "#374151",
//                   }}
//                 />
//               </View>

//               {/* Age */}
//               <View style={{ marginBottom: 12 }}>
//                 <Text sx={{ fontSize: 12, fontFamily: "Poppins-Bold", mb: 4 }}>
//                   AGE:
//                 </Text>
//                 <TextInput
//                   value={calculateAge(dob)}
//                   editable={false}
//                   style={{
//                     borderWidth: 1,
//                     borderColor: "#d1d5db",
//                     borderRadius: 8,
//                     paddingHorizontal: 10,
//                     fontSize: 14,
//                     fontFamily: "Poppins-Regular",
//                     backgroundColor: "#f9fafb",
//                     color: "#374151",
//                   }}
//                 />
//               </View>

//               {/* Contact Number */}
//               <View style={{ marginBottom: 12 }}>
//                 <Text sx={{ fontSize: 12, fontFamily: "Poppins-Bold", mb: 4 }}>
//                   CONTACT NUMBER:
//                 </Text>
//                 <View
//                   style={{
//                     flexDirection: "row",
//                     alignItems: "center",
//                     borderWidth: 1,
//                     borderColor: "#d1d5db",
//                     borderRadius: 8,
//                     overflow: "hidden",
//                   }}
//                 >
//                   <View
//                     style={{
//                       flexDirection: "row",
//                       alignItems: "center",
//                       paddingHorizontal: 10,
//                       backgroundColor: "#f9fafb",
//                     }}
//                   >
//                     <Text sx={{ fontSize: 14, fontFamily: "Poppins-Regular" }}>
//                       🇵🇭 +63
//                     </Text>
//                     <View
//                       style={{
//                         width: 1,
//                         height: "100%",
//                         backgroundColor: "#d1d5db",
//                         marginLeft: 8,
//                       }}
//                     />
//                   </View>

//                   <TextInput
//                     value={contactNumber}
//                     onChangeText={setContactNumber}
//                     placeholder="Enter contact number"
//                     keyboardType="number-pad"
//                     style={{
//                       flex: 1,
//                       paddingHorizontal: 10,
//                       fontSize: 14,
//                       fontFamily: "Poppins-Regular",
//                     }}
//                   />
//                 </View>

//                 <View style={{ flexDirection: "row", marginTop: 6 }}>
//                   <Pressable
//                     onPress={handleRemoveContact}
//                     style={{
//                       backgroundColor: "#ef4444",
//                       paddingVertical: 6,
//                       paddingHorizontal: 12,
//                       borderRadius: 6,
//                       marginRight: 8,
//                     }}
//                   >
//                     <Text
//                       sx={{
//                         fontSize: 14,
//                         fontFamily: "Poppins-Bold",
//                         color: "#fff",
//                       }}
//                     >
//                       Remove
//                     </Text>
//                   </Pressable>
//                   <Pressable
//                     onPress={handleUpdateContact}
//                     style={{
//                       backgroundColor: "#008CFC",
//                       paddingVertical: 6,
//                       paddingHorizontal: 12,
//                       borderRadius: 6,
//                     }}
//                   >
//                     <Text
//                       sx={{
//                         fontSize: 14,
//                         fontFamily: "Poppins-Bold",
//                         color: "#fff",
//                       }}
//                     >
//                       Change
//                     </Text>
//                   </Pressable>
//                 </View>
//               </View>

//               {/* Date of Birth */}
//               <View style={{ marginBottom: 12 }}>
//                 <Text sx={{ fontSize: 12, fontFamily: "Poppins-Bold", mb: 4 }}>
//                   DATE OF BIRTH:
//                 </Text>

//                 <Pressable
//                   onPress={() => setShowPicker(true)}
//                   style={{
//                     flexDirection: "row",
//                     justifyContent: "space-between",
//                     alignItems: "center",
//                     borderWidth: 1,
//                     borderColor: "#d1d5db",
//                     borderRadius: 8,
//                     paddingHorizontal: 10,
//                     paddingVertical: 12,
//                   }}
//                 >
//                   <Text
//                     sx={{
//                       fontSize: 14,
//                       fontFamily: "Poppins-Regular",
//                       color: dob ? "#000" : "#9ca3af",
//                     }}
//                   >
//                     {dob || "Select date"}
//                   </Text>

//                   <Ionicons name="calendar-outline" size={20} color="#6b7280" />
//                 </Pressable>

//                 <DateTimePickerModal
//                   isVisible={showPicker}
//                   mode="date"
//                   onConfirm={(selectedDate) => {
//                     setShowPicker(false);
//                     if (selectedDate) {
//                       const formatted =
//                         moment(selectedDate).format("YYYY-MM-DD");
//                       setDob(formatted);
//                     }
//                   }}
//                   onCancel={() => setShowPicker(false)}
//                   date={dob ? new Date(dob) : new Date()}
//                 />

//                 <View style={{ flexDirection: "row", marginTop: 6 }}>
//                   <Pressable
//                     onPress={handleRemoveDob}
//                     style={{
//                       backgroundColor: "#ef4444",
//                       paddingVertical: 6,
//                       paddingHorizontal: 12,
//                       borderRadius: 6,
//                       marginRight: 8,
//                     }}
//                   >
//                     <Text
//                       sx={{
//                         fontSize: 14,
//                         fontFamily: "Poppins-Bold",
//                         color: "#fff",
//                       }}
//                     >
//                       Remove
//                     </Text>
//                   </Pressable>
//                   <Pressable
//                     onPress={handleUpdateDob}
//                     style={{
//                       backgroundColor: "#008CFC",
//                       paddingVertical: 6,
//                       paddingHorizontal: 12,
//                       borderRadius: 6,
//                     }}
//                   >
//                     <Text
//                       sx={{
//                         fontSize: 14,
//                         fontFamily: "Poppins-Bold",
//                         color: "#fff",
//                       }}
//                     >
//                       Change
//                     </Text>
//                   </Pressable>
//                 </View>
//               </View>
//             </View>

//             {/* Social Media */}
//             <View
//               style={{
//                 backgroundColor: "#ffffffcc",
//                 borderRadius: 12,
//                 padding: 16,
//                 marginBottom: 20,
//               }}
//             >
//               <Text sx={{ fontSize: 18, fontFamily: "Poppins-Bold", mb: 12 }}>
//                 Social Media
//               </Text>

//               {/* Facebook */}
//               <View style={{ marginBottom: 12 }}>
//                 <Text sx={{ fontSize: 12, fontFamily: "Poppins-Bold", mb: 4 }}>
//                   FACEBOOK:
//                 </Text>
//                 <View
//                   style={{
//                     flexDirection: "row",
//                     alignItems: "center",
//                     borderWidth: 1,
//                     borderColor: "#d1d5db",
//                     borderRadius: 8,
//                     overflow: "hidden",
//                   }}
//                 >
//                   <Ionicons
//                     name="logo-facebook"
//                     size={22}
//                     color="#1877F2"
//                     style={{ marginHorizontal: 8 }}
//                   />
//                   <TextInput
//                     value={facebook}
//                     onChangeText={setFacebook}
//                     placeholder="Enter Facebook profile link"
//                     style={{
//                       flex: 1,
//                       paddingHorizontal: 10,
//                       fontSize: 14,
//                       fontFamily: "Poppins-Regular",
//                     }}
//                   />
//                 </View>
//                 <View style={{ flexDirection: "row", marginTop: 6 }}>
//                   <Pressable
//                     onPress={handleRemoveFacebook}
//                     style={{
//                       backgroundColor: "#ef4444",
//                       paddingVertical: 6,
//                       paddingHorizontal: 12,
//                       borderRadius: 6,
//                       marginRight: 8,
//                     }}
//                   >
//                     <Text
//                       sx={{
//                         fontSize: 14,
//                         fontFamily: "Poppins-Bold",
//                         color: "#fff",
//                       }}
//                     >
//                       Remove
//                     </Text>
//                   </Pressable>
//                   <Pressable
//                     onPress={handleUpdateFacebook}
//                     style={{
//                       backgroundColor: "#008CFC",
//                       paddingVertical: 6,
//                       paddingHorizontal: 12,
//                       borderRadius: 6,
//                     }}
//                   >
//                     <Text
//                       sx={{
//                         fontSize: 14,
//                         fontFamily: "Poppins-Bold",
//                         color: "#fff",
//                       }}
//                     >
//                       Update
//                     </Text>
//                   </Pressable>
//                 </View>
//               </View>

//               {/* Instagram */}
//               <View style={{ marginBottom: 12 }}>
//                 <Text sx={{ fontSize: 12, fontFamily: "Poppins-Bold", mb: 4 }}>
//                   INSTAGRAM:
//                 </Text>
//                 <View
//                   style={{
//                     flexDirection: "row",
//                     alignItems: "center",
//                     borderWidth: 1,
//                     borderColor: "#d1d5db",
//                     borderRadius: 8,
//                     overflow: "hidden",
//                   }}
//                 >
//                   <Ionicons
//                     name="logo-instagram"
//                     size={22}
//                     color="#C13584"
//                     style={{ marginHorizontal: 8 }}
//                   />
//                   <TextInput
//                     value={instagram}
//                     onChangeText={setInstagram}
//                     placeholder="Enter Instagram profile link"
//                     style={{
//                       flex: 1,
//                       paddingHorizontal: 10,
//                       fontSize: 14,
//                       fontFamily: "Poppins-Regular",
//                     }}
//                   />
//                 </View>
//                 <View style={{ flexDirection: "row", marginTop: 6 }}>
//                   <Pressable
//                     onPress={handleRemoveInstagram}
//                     style={{
//                       backgroundColor: "#ef4444",
//                       paddingVertical: 6,
//                       paddingHorizontal: 12,
//                       borderRadius: 6,
//                       marginRight: 8,
//                     }}
//                   >
//                     <Text
//                       sx={{
//                         fontSize: 14,
//                         fontFamily: "Poppins-Bold",
//                         color: "#fff",
//                       }}
//                     >
//                       Remove
//                     </Text>
//                   </Pressable>
//                   <Pressable
//                     onPress={handleUpdateInstagram}
//                     style={{
//                       backgroundColor: "#008CFC",
//                       paddingVertical: 6,
//                       paddingHorizontal: 12,
//                       borderRadius: 6,
//                     }}
//                   >
//                     <Text
//                       sx={{
//                         fontSize: 14,
//                         fontFamily: "Poppins-Bold",
//                         color: "#fff",
//                       }}
//                     >
//                       Update
//                     </Text>
//                   </Pressable>
//                 </View>
//               </View>
//             </View>

//             {/* Security */}
//             <View
//               style={{
//                 backgroundColor: "#ffffffcc",
//                 borderRadius: 12,
//                 padding: 16,
//                 marginBottom: 20,
//               }}
//             >
//               <View
//                 style={{
//                   flexDirection: "row",
//                   alignItems: "center",
//                   marginBottom: 12,
//                 }}
//               >
//                 <Ionicons
//                   name="shield-checkmark-outline"
//                   size={22}
//                   color="#374151"
//                   style={{ marginRight: 8 }}
//                 />
//                 <Text sx={{ fontSize: 18, fontFamily: "Poppins-Bold" }}>
//                   Security
//                 </Text>
//               </View>

//               {/* Current Password */}
//               <View style={{ marginBottom: 12 }}>
//                 <Text sx={{ fontSize: 12, fontFamily: "Poppins-Bold", mb: 4 }}>
//                   CURRENT PASSWORD:
//                 </Text>
//                 <View
//                   style={{
//                     flexDirection: "row",
//                     alignItems: "center",
//                     borderWidth: 1,
//                     borderColor: "#d1d5db",
//                     borderRadius: 8,
//                     overflow: "hidden",
//                   }}
//                 >
//                   <Ionicons
//                     name="lock-closed-outline"
//                     size={20}
//                     color="#6b7280"
//                     style={{ marginHorizontal: 8 }}
//                   />
//                   <TextInput
//                     placeholder="Enter current password"
//                     secureTextEntry
//                     style={{
//                       flex: 1,
//                       paddingHorizontal: 10,
//                       fontSize: 14,
//                       fontFamily: "Poppins-Regular",
//                     }}
//                   />
//                 </View>
//               </View>

//               {/* New Password */}
//               <View style={{ marginBottom: 12 }}>
//                 <Text sx={{ fontSize: 12, fontFamily: "Poppins-Bold", mb: 4 }}>
//                   NEW PASSWORD:
//                 </Text>
//                 <View
//                   style={{
//                     flexDirection: "row",
//                     alignItems: "center",
//                     borderWidth: 1,
//                     borderColor: "#d1d5db",
//                     borderRadius: 8,
//                     overflow: "hidden",
//                   }}
//                 >
//                   <Ionicons
//                     name="key-outline"
//                     size={20}
//                     color="#6b7280"
//                     style={{ marginHorizontal: 8 }}
//                   />
//                   <TextInput
//                     placeholder="Enter new password"
//                     secureTextEntry
//                     style={{
//                       flex: 1,
//                       paddingHorizontal: 10,
//                       fontSize: 14,
//                       fontFamily: "Poppins-Regular",
//                     }}
//                   />
//                 </View>
//               </View>

//               {/* Confirm New Password */}
//               <View style={{ marginBottom: 12 }}>
//                 <Text sx={{ fontSize: 12, fontFamily: "Poppins-Bold", mb: 4 }}>
//                   CONFIRM NEW PASSWORD:
//                 </Text>
//                 <View
//                   style={{
//                     flexDirection: "row",
//                     alignItems: "center",
//                     borderWidth: 1,
//                     borderColor: "#d1d5db",
//                     borderRadius: 8,
//                     overflow: "hidden",
//                   }}
//                 >
//                   <Ionicons
//                     name="checkmark-done-outline"
//                     size={20}
//                     color="#6b7280"
//                     style={{ marginHorizontal: 8 }}
//                   />
//                   <TextInput
//                     placeholder="Confirm new password"
//                     secureTextEntry
//                     style={{
//                       flex: 1,
//                       paddingHorizontal: 10,
//                       fontSize: 14,
//                       fontFamily: "Poppins-Regular",
//                     }}
//                   />
//                 </View>
//               </View>

//               <Pressable
//                 onPress={() => showSuccess("Password updated (local only)")}
//                 style={{
//                   flexDirection: "row",
//                   alignItems: "center",
//                   justifyContent: "center",
//                   backgroundColor: "#008CFC",
//                   paddingVertical: 10,
//                   borderRadius: 8,
//                 }}
//               >
//                 <Text
//                   sx={{
//                     fontSize: 14,
//                     fontFamily: "Poppins-Bold",
//                     color: "#fff",
//                   }}
//                 >
//                   Update Password
//                 </Text>
//               </Pressable>
//             </View>
//           </MotiView>
//         </ScrollView>

//         {successMessage ? (
//           <View
//             style={{
//               position: "absolute",
//               bottom: 20,
//               left: 0,
//               right: 0,
//               alignItems: "center",
//             }}
//           >
//             <Text
//               sx={{
//                 fontSize: 14,
//                 fontFamily: "Poppins-Bold",
//                 color: "#22c55e",
//                 backgroundColor: "#dcfce7",
//                 paddingHorizontal: 16,
//                 paddingVertical: 8,
//                 borderRadius: 8,
//               }}
//             >
//               {successMessage}
//             </Text>
//           </View>
//         ) : null}

//         <ClientNavbar />
//       </SafeAreaView>
//     </ImageBackground>
//   );
// }
