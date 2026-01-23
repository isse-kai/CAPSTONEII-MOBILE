// import { Text, View } from "dripsy";
// import { useFonts } from "expo-font";
// import { useRouter, type Href } from "expo-router";
// import { MotiView } from "moti";
// import { useMemo } from "react";
// import {
//   FlatList,
//   KeyboardAvoidingView,
//   Platform,
//   Pressable,
// } from "react-native";
// import {
//   SafeAreaView,
//   useSafeAreaInsets,
// } from "react-native-safe-area-context";
// import Header from "./header";

// export default function NotificationsPage() {
//   const router = useRouter();
//   const insets = useSafeAreaInsets();

//   const [fontsLoaded] = useFonts({
//     "Poppins-Regular": require("../../../assets/fonts/Poppins/Poppins-Regular.ttf"),
//     "Poppins-Bold": require("../../../assets/fonts/Poppins/Poppins-Bold.ttf"),
//   });

//   type Notification = {
//     id: string;
//     title?: string;
//     message?: string;
//     detail?: string;
//     created_at?: string;
//   };

//   // ✅ Frontend-only mock data (no backend)
//   const notifications: Notification[] = useMemo(
//     () => [
//       {
//         id: "1",
//         title: "Welcome!",
//         message: "Thanks for signing up. Your account is ready.",
//         created_at: new Date().toISOString(),
//       },
//       {
//         id: "2",
//         title: "Service Update",
//         detail: "Your request has been received and is being reviewed.",
//         created_at: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
//       },
//       {
//         id: "3",
//         title: "Reminder",
//         message: "Please complete your profile to continue.",
//         created_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
//       },
//     ],
//     [],
//   );

//   if (!fontsLoaded) return null;

//   return (
//     <SafeAreaView
//       style={{
//         flex: 1,
//         paddingTop: insets.top - 20,
//         paddingBottom: insets.bottom + 2,
//         backgroundColor: "rgba(249, 250, 251, 0.9)",
//       }}
//     >
//       <KeyboardAvoidingView
//         behavior={Platform.OS === "ios" ? "padding" : undefined}
//         style={{ flex: 1 }}
//       >
//         <View sx={{ flex: 1, px: 16, py: 12 }}>
//           <MotiView
//             from={{ opacity: 0, translateY: 20 }}
//             animate={{ opacity: 1, translateY: 0 }}
//             transition={{ type: "timing", duration: 500 }}
//             style={{ flex: 1 }}
//           >
//             <Header />

//             {/* Notifications Title */}
//             <Text
//               sx={{
//                 fontSize: 18,
//                 fontFamily: "Poppins-Bold",
//                 color: "#001a33",
//                 mb: 12,
//               }}
//             >
//               Notifications
//             </Text>

//             {/* Notification List */}
//             <FlatList
//               data={notifications}
//               keyExtractor={(item) => item.id}
//               renderItem={({ item }) => (
//                 <Pressable
//                   onPress={() =>
//                     router.push(
//                       `/clientpage/clientnavbar/notifications/${item.id}` as Href,
//                     )
//                   }
//                 >
//                   <View
//                     sx={{
//                       bg: "#fff",
//                       borderRadius: 12,
//                       px: 14,
//                       py: 12,
//                       mb: 12,
//                       shadowColor: "#000",
//                       shadowOffset: { width: 0, height: 1 },
//                       shadowOpacity: 0.1,
//                       shadowRadius: 2,
//                       elevation: 2,
//                     }}
//                   >
//                     <Text
//                       sx={{
//                         fontSize: 16,
//                         fontFamily: "Poppins-Bold",
//                         color: "#001a33",
//                         mb: 4,
//                       }}
//                     >
//                       {item.title || "Notification"}
//                     </Text>

//                     <Text
//                       sx={{
//                         fontSize: 14,
//                         fontFamily: "Poppins-Regular",
//                         color: "#4b5563",
//                       }}
//                     >
//                       {item.message || item.detail || "No message."}
//                     </Text>
//                   </View>
//                 </Pressable>
//               )}
//               contentContainerStyle={{ paddingBottom: 16 }}
//               ListEmptyComponent={
//                 <View sx={{ py: 24 }}>
//                   <Text
//                     sx={{
//                       textAlign: "center",
//                       fontFamily: "Poppins-Regular",
//                       color: "#6b7280",
//                     }}
//                   >
//                     No notifications yet.
//                   </Text>
//                 </View>
//               }
//             />
//           </MotiView>
//         </View>
//       </KeyboardAvoidingView>
//     </SafeAreaView>
//   );
// }
