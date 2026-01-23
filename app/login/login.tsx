import axios from "axios";
import { Pressable, Text, View } from "dripsy";
import { useFonts } from "expo-font";
import { useRouter } from "expo-router";
import { MotiView } from "moti";
import React, { useState } from "react";
import {
  Alert,
  Dimensions,
  Image,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  View as RNView,
  ScrollView,
  TextInput,
  TouchableOpacity,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

type LoginResponse = {
  ok: boolean;
  access_token?: string;
  refresh_token?: string;
  user?: any; // supabase user object
  detail?: string;
};

export default function Login() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const screenHeight = Dimensions.get("window").height;

  const API_URL = process.env.EXPO_PUBLIC_API_URL; // e.g. http://192.168.1.10:8081

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [fontsLoaded] = useFonts({
    "Poppins-Regular": require("../../assets/fonts/Poppins/Poppins-Regular.ttf"),
    "Poppins-Bold": require("../../assets/fonts/Poppins/Poppins-Bold.ttf"),
    "Poppins-ExtraBold": require("../../assets/fonts/Poppins/Poppins-ExtraBold.ttf"),
  });

  if (!fontsLoaded) return null;

  const normalizeEmail = (e: string) => (e || "").trim().toLowerCase();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Missing Fields", "Please enter both email and password");
      return;
    }

    if (!API_URL) {
      Alert.alert(
        "Missing API URL",
        "Set EXPO_PUBLIC_API_URL to your backend IP (not localhost).",
      );
      return;
    }

    setIsLoading(true);

    try {
      const res = await axios.post<LoginResponse>(
        `${API_URL}/auth/login`,
        {
          email: normalizeEmail(email),
          password: String(password),
        },
        { timeout: 15000 },
      );

      if (!res.data?.ok) {
        Alert.alert("Login Failed", res.data?.detail || "Invalid credentials.");
        return;
      }

      const user = res.data.user;
      // role stored in metadata (based on your /auth/verify createUser)
      const role =
        user?.user_metadata?.role || user?.app_metadata?.role || "client";

      // ✅ Navigate to home (use replace so it doesn't stack)
      if (String(role).toLowerCase() === "worker") {
        router.replace("/workerpage/home");
      } else {
        router.replace("/clientpage/home");
      }
    } catch (err: any) {
      const msg =
        err?.response?.data?.detail || err?.message || "Something went wrong.";
      Alert.alert("Login Failed", msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ImageBackground
      source={require("../../assets/login.jpg")}
      style={{ flex: 1 }}
      resizeMode="cover"
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
      >
        <SafeAreaView style={{ flex: 1, paddingBottom: insets.bottom }}>
          <ScrollView
            contentContainerStyle={{
              flexGrow: 1,
              minHeight: screenHeight - insets.top - insets.bottom - 24,
              paddingHorizontal: 16,
              justifyContent: "center",
            }}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <MotiView
              from={{ opacity: 0, translateY: 20 }}
              animate={{ opacity: 1, translateY: 0 }}
              transition={{ type: "timing", duration: 500 }}
              style={{ gap: 20 }}
            >
              {/* Logo */}
              <View sx={{ alignItems: "center", mt: -150, mb: -60 }}>
                <Image
                  source={require("../../assets/jdklogo.png")}
                  style={{ width: 250, height: 250, resizeMode: "contain" }}
                />
              </View>

              {/* Login */}
              <View
                style={{
                  backgroundColor: "#ffffffcc",
                  borderRadius: 12,
                  padding: 16,
                  marginBottom: 20,
                  alignSelf: "center",
                  width: "90%",
                  maxWidth: 400,
                }}
              >
                {/* Title */}
                <Text
                  sx={{
                    fontSize: 22,
                    fontFamily: "Poppins-ExtraBold",
                    color: "#000000",
                    mb: 12,
                    textAlign: "center",
                  }}
                >
                  LOGIN
                </Text>

                {/* Email */}
                <View style={{ marginBottom: 16 }}>
                  <Text sx={{ fontSize: 16, color: "#000", mb: 6 }}>Email</Text>
                  <TextInput
                    value={email}
                    onChangeText={setEmail}
                    placeholder="Enter your email"
                    placeholderTextColor="#ccc"
                    autoCapitalize="none"
                    keyboardType="email-address"
                    style={{
                      borderWidth: 1,
                      borderColor: "#d1d5db",
                      borderRadius: 8,
                      paddingHorizontal: 12,
                      paddingVertical: 12,
                      fontSize: 16,
                      backgroundColor: "#f9fafb",
                    }}
                  />
                </View>

                {/* Password */}
                <View style={{ marginBottom: 16 }}>
                  <Text sx={{ fontSize: 16, color: "#000", mb: 6 }}>
                    Password
                  </Text>
                  <RNView
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      borderWidth: 1,
                      borderColor: "#d1d5db",
                      borderRadius: 8,
                      backgroundColor: "#f9fafb",
                      paddingHorizontal: 12,
                    }}
                  >
                    <TextInput
                      value={password}
                      onChangeText={setPassword}
                      placeholder="Enter your password"
                      placeholderTextColor="#ccc"
                      secureTextEntry={!showPassword}
                      style={{
                        flex: 1,
                        paddingVertical: 12,
                        fontSize: 16,
                      }}
                    />
                    <TouchableOpacity
                      onPress={() => setShowPassword((prev) => !prev)}
                    >
                      <Image
                        source={
                          showPassword
                            ? require("../../assets/view.png")
                            : require("../../assets/hide.png")
                        }
                        style={{ width: 24, height: 24, tintColor: "#333" }}
                      />
                    </TouchableOpacity>
                  </RNView>
                </View>

                {/* Login Button */}
                <Pressable
                  onPress={handleLogin}
                  disabled={isLoading}
                  sx={{
                    bg: isLoading ? "#93c5fd" : "#008CFC",
                    borderRadius: 10,
                    py: 14,
                    alignItems: "center",
                    mb: 16,
                  }}
                >
                  <Text
                    sx={{
                      fontSize: 18,
                      fontFamily: "Poppins-Bold",
                      color: "#fff",
                      lineHeight: 22,
                    }}
                  >
                    {isLoading ? "Logging in..." : "Login"}
                  </Text>
                </Pressable>

                {/* Sign Up */}
                <View
                  sx={{
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text
                    sx={{
                      fontSize: 14,
                      color: "#000",
                      fontFamily: "Poppins-Regular",
                    }}
                  >
                    Don’t have an account?{" "}
                  </Text>
                  <Pressable onPress={() => router.push("/signup/roles")}>
                    <Text
                      sx={{
                        fontSize: 14,
                        fontFamily: "Poppins-Bold",
                        color: "#008CFC",
                        textDecorationLine: "underline",
                      }}
                    >
                      Sign up
                    </Text>
                  </Pressable>
                </View>
              </View>
            </MotiView>
          </ScrollView>
        </SafeAreaView>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
}
