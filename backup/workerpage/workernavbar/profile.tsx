// import { Ionicons } from "@expo/vector-icons";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { Pressable, Text } from "dripsy";
// import { useFonts } from "expo-font";
// import { useRouter } from "expo-router";
// import { MotiImage, MotiView } from "moti";
// import React from "react";
// import { Dimensions, ImageBackground, ScrollView, View } from "react-native";
// import {
//   SafeAreaView,
//   useSafeAreaInsets,
// } from "react-native-safe-area-context";
// import WorkerHeader from "../workernavbar/header";
// import WorkerNavbar from "../workernavbar/navbar";

// const { width, height } = Dimensions.get("window");

// type LocalUser = {
//   email?: string;
//   user_metadata?: {
//     first_name?: string;
//     last_name?: string;
//   };
// };

// // change this key to whatever you use for saving user info locally
// const LOCAL_USER_KEY = "local_auth_user";

// async function getCurrentUserLocal(): Promise<LocalUser | null> {
//   try {
//     const raw = await AsyncStorage.getItem(LOCAL_USER_KEY);
//     if (!raw) return null;
//     return JSON.parse(raw) as LocalUser;
//   } catch {
//     return null;
//   }
// }

// async function logoutUserLocal() {
//   // remove tokens / user data you store locally
//   await AsyncStorage.multiRemove([LOCAL_USER_KEY]);
// }

// export default function WorkerProfile() {
//   const router = useRouter();
//   const insets = useSafeAreaInsets();

//   const [fontsLoaded] = useFonts({
//     "Poppins-Regular": require("../../../assets/fonts/Poppins/Poppins-Regular.ttf"),
//     "Poppins-Bold": require("../../../assets/fonts/Poppins/Poppins-Bold.ttf"),
//     "Poppins-ExtraBold": require("../../../assets/fonts/Poppins/Poppins-ExtraBold.ttf"),
//   });

//   const [user, setUser] = React.useState<LocalUser | null>(null);

//   React.useEffect(() => {
//     (async () => {
//       const u = await getCurrentUserLocal();
//       setUser(u);
//     })();
//   }, []);

//   if (!fontsLoaded) return null;

//   const handleLogout = async () => {
//     try {
//       await logoutUserLocal();
//       router.replace("../login/login");
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   const fullName =
//     `${user?.user_metadata?.first_name ?? ""} ${user?.user_metadata?.last_name ?? ""}`.trim() ||
//     "Full Name";

//   return (
//     <ImageBackground
//       source={require("../../../assets/login.jpg")}
//       style={{
//         flex: 1,
//         height: height,
//       }}
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
//             transition={{ type: "timing", duration: 500 }}
//             style={{ flex: 1 }}
//           >
//             <WorkerHeader />

//             {/* User Account */}
//             <View
//               style={{
//                 flexDirection: "row",
//                 alignItems: "center",
//                 marginBottom: height * 0.03,
//               }}
//             >
//               {/* Profile Picture */}
//               <MotiImage
//                 from={{ scale: 0.8, opacity: 0 }}
//                 animate={{ scale: 1, opacity: 1 }}
//                 transition={{ type: "spring", delay: 200 }}
//                 source={require("../../../assets/profile-icon.png")}
//                 style={{
//                   width: width * 0.15,
//                   height: width * 0.15,
//                   borderRadius: (width * 0.15) / 2,
//                   marginRight: width * 0.04,
//                 }}
//               />

//               {/* Name & Email */}
//               <View style={{ flexDirection: "column" }}>
//                 <Text
//                   sx={{
//                     fontSize: width * 0.055,
//                     fontFamily: "Poppins-ExtraBold",
//                     color: "#000",
//                     mb: 4,
//                   }}
//                 >
//                   {fullName}
//                 </Text>

//                 <Text
//                   sx={{
//                     fontSize: width * 0.04,
//                     fontFamily: "Poppins-Regular",
//                     color: "#555",
//                   }}
//                 >
//                   {user?.email || "user@email.com"}
//                 </Text>
//               </View>
//             </View>

//             {/* Buttons */}
//             <Pressable
//               onPress={() => router.push("./profiles/settings")}
//               sx={{
//                 flexDirection: "row",
//                 alignItems: "center",
//                 bg: "#ffffffcc",
//                 borderRadius: 10,
//                 px: width * 0.04,
//                 py: height * 0.02,
//                 mb: 12,
//               }}
//             >
//               <Ionicons
//                 name="settings-outline"
//                 size={22}
//                 color="#333"
//                 style={{ marginRight: 12 }}
//               />
//               <Text
//                 sx={{
//                   fontSize: width * 0.04,
//                   fontFamily: "Poppins-Bold",
//                   color: "#000",
//                   lineHeight: 22,
//                 }}
//               >
//                 Account Settings
//               </Text>
//             </Pressable>

//             <Pressable
//               onPress={handleLogout}
//               sx={{
//                 flexDirection: "row",
//                 alignItems: "center",
//                 bg: "#ffffffcc",
//                 borderRadius: 10,
//                 px: width * 0.04,
//                 py: height * 0.02,
//               }}
//             >
//               <Ionicons
//                 name="log-out-outline"
//                 size={22}
//                 color="#333"
//                 style={{ marginRight: 12 }}
//               />
//               <Text
//                 sx={{
//                   fontSize: width * 0.04,
//                   fontFamily: "Poppins-Bold",
//                   color: "#000",
//                   lineHeight: 22,
//                 }}
//               >
//                 Logout
//               </Text>
//             </Pressable>
//           </MotiView>
//         </ScrollView>

//         <WorkerNavbar />
//       </SafeAreaView>
//     </ImageBackground>
//   );
// }
