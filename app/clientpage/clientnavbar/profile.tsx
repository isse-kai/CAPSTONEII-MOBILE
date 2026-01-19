import { Ionicons } from "@expo/vector-icons";
import { Pressable, Text } from "dripsy";
import { useFonts } from "expo-font";
import { useRouter } from "expo-router";
import { MotiImage, MotiView } from "moti";
import React from "react";
import { Dimensions, ImageBackground, ScrollView, View } from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import Header from "../clientnavbar/header";
import ClientNavbar from "../clientnavbar/navbar";

const { width, height } = Dimensions.get("window");

export default function ClientProfile() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [fontsLoaded] = useFonts({
    "Poppins-Regular": require("../../../assets/fonts/Poppins/Poppins-Regular.ttf"),
    "Poppins-Bold": require("../../../assets/fonts/Poppins/Poppins-Bold.ttf"),
    "Poppins-ExtraBold": require("../../../assets/fonts/Poppins/Poppins-ExtraBold.ttf"),
  });

  if (!fontsLoaded) return null;

  // ✅ Frontend-only placeholders (no backend)
  const fullName = "Full Name";
  const email = "user@email.com";

  const handleLogout = () => {
    // ✅ No backend call, just navigate
    router.push("../../login/login");
  };

  return (
    <ImageBackground
      source={require("../../../assets/login.jpg")}
      style={{
        flex: 1,
        height: height,
      }}
      resizeMode="cover"
    >
      <SafeAreaView
        style={{
          flex: 1,
          paddingBottom: insets.bottom,
          backgroundColor: "rgba(249, 250, 251, 0.9)",
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
            from={{ opacity: 0, translateY: 20 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: "timing", duration: 500 }}
            style={{ flex: 1 }}
          >
            <Header />

            {/* User Account */}
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginBottom: height * 0.03,
              }}
            >
              <MotiImage
                from={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", delay: 200 }}
                source={require("../../../assets/profile-icon.png")}
                style={{
                  width: width * 0.15,
                  height: width * 0.15,
                  borderRadius: (width * 0.15) / 2,
                  marginRight: width * 0.04,
                }}
              />

              <View style={{ flexDirection: "column" }}>
                <Text
                  sx={{
                    fontSize: width * 0.055,
                    fontFamily: "Poppins-ExtraBold",
                    color: "#000",
                    mb: 4,
                  }}
                >
                  {fullName}
                </Text>

                <Text
                  sx={{
                    fontSize: width * 0.04,
                    fontFamily: "Poppins-Regular",
                    color: "#555",
                  }}
                >
                  {email}
                </Text>
              </View>
            </View>

            {/* Buttons */}
            <Pressable
              onPress={() => router.push("./profiles/settings")}
              sx={{
                flexDirection: "row",
                alignItems: "center",
                bg: "#ffffffcc",
                borderRadius: 10,
                px: width * 0.04,
                py: height * 0.02,
                mb: 12,
              }}
            >
              <Ionicons
                name="settings-outline"
                size={22}
                color="#333"
                style={{ marginRight: 12 }}
              />
              <Text
                sx={{
                  fontSize: width * 0.04,
                  fontFamily: "Poppins-Bold",
                  color: "#000",
                  lineHeight: 22,
                }}
              >
                Account Settings
              </Text>
            </Pressable>

            <Pressable
              onPress={handleLogout}
              sx={{
                flexDirection: "row",
                alignItems: "center",
                bg: "#ffffffcc",
                borderRadius: 10,
                px: width * 0.04,
                py: height * 0.02,
              }}
            >
              <Ionicons
                name="log-out-outline"
                size={22}
                color="#333"
                style={{ marginRight: 12 }}
              />
              <Text
                sx={{
                  fontSize: width * 0.04,
                  fontFamily: "Poppins-Bold",
                  color: "#000",
                  lineHeight: 22,
                }}
              >
                Logout
              </Text>
            </Pressable>
          </MotiView>
        </ScrollView>

        <ClientNavbar />
      </SafeAreaView>
    </ImageBackground>
  );
}
