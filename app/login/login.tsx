// app/login/login.tsx
import { Image, Pressable, Text, TextInput, View } from "dripsy";
import { useFonts } from "expo-font";
import { useRouter } from "expo-router";
import { Globe, Lock, LogIn, Mail } from "lucide-react-native";
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StatusBar,
} from "react-native";

/* ---------- Theme ---------- */
const C = {
  bg: "#ffffff",
  card: "#ffffff",
  text: "#0f172a",
  sub: "#64748b",
  blue: "#1e86ff",
  border: "#e6eef7",
  field: "#f8fafc",
  placeholder: "#9aa4b2",
};
const PAD = 18;
const GAP = 12;
const { width } = Dimensions.get("window");

export default function ClientLogin() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");

  // Anim
  const fade = useRef(new Animated.Value(0)).current;

  // Fonts
  const [fontsLoaded] = useFonts({
    "Poppins-Regular": require("../../assets/fonts/Poppins/Poppins-Regular.ttf"),
    "Poppins-Medium": require("../../assets/fonts/Poppins/Poppins-Medium.ttf"),
    "Poppins-SemiBold": require("../../assets/fonts/Poppins/Poppins-SemiBold.ttf"),
    "Poppins-Bold": require("../../assets/fonts/Poppins/Poppins-Bold.ttf"),
    "Poppins-ExtraBold": require("../../assets/fonts/Poppins/Poppins-ExtraBold.ttf"),
  });

  useEffect(() => {
    Animated.timing(fade, { toValue: 1, duration: 500, useNativeDriver: true }).start();
  }, [fade]);

  /* ---------- Validation ---------- */
  const emailOk = useMemo(() => /\S+@\S+\.\S+/.test(email), [email]);
  const canLogin = useMemo(() => emailOk && pw.trim().length > 0, [emailOk, pw]);

  const onLogin = () => {
    if (!canLogin) return;
    // TODO: wire up to your auth
    router.replace("/_sitemap");
  };

  const onGoogle = () => {
    // TODO: hook Google auth
  };

  if (!fontsLoaded) return null;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: C.bg }}>
      <StatusBar barStyle="dark-content" backgroundColor={C.bg} />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
      >
        {/* Top-centered logo (thin + roomy) */}
        <View
          sx={{
            position: "absolute",
            top:
              Platform.select({
                ios: 8,
                android: (StatusBar.currentHeight ?? 0) + 8,
                default: 8,
              }) ?? 8,
            left: 0,
            right: 0,
            alignItems: "center",
            zIndex: 10,
          }}
          pointerEvents="none"
        >
          <Image
            source={require("../../assets/jdklogo.png")}
            sx={{ width: Math.min(width * 0.55, 230), height: 60 }}
            resizeMode="contain"
          />
        </View>

        <Animated.View style={{ flex: 1, opacity: fade }}>
          {/* Centered content */}
          <View
            sx={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              px: PAD,
              pb: 24,
              pt: 96, // space so content doesn't collide with the floating logo
            }}
          >
            {/* Card */}
            <View
              sx={{
                width: "100%",
                maxWidth: 560,
                bg: C.card,
                borderWidth: 1, // thin stroke
                borderColor: C.border,
                borderRadius: 18,
                px: PAD,
                py: 20,
                shadowColor: "#000",
                shadowOpacity: Platform.OS === "android" ? 0 : 0.05,
                shadowRadius: 14,
                shadowOffset: { width: 0, height: 8 },
                elevation: 1,
              }}
            >
              {/* Title */}
              <View sx={{ alignItems: "center", mb: 14 }}>
                <Text
                  sx={{
                    color: C.text,
                    fontFamily: "Poppins-ExtraBold",
                    fontSize: 24,
                    textAlign: "center",
                  }}
                >
                  Welcome back
                </Text>
                <Text
                  sx={{
                    color: C.sub,
                    fontFamily: "Poppins-Regular",
                    fontSize: 14,
                    textAlign: "center",
                    mt: 4,
                  }}
                >
                  Sign in to JDK HOMECARE
                </Text>
              </View>

              {/* Google */}
              <Pressable
                onPress={onGoogle}
                sx={{
                  height: 48,
                  borderWidth: 1, // thinner
                  borderColor: C.blue,
                  borderRadius: 14,
                  alignItems: "center",
                  justifyContent: "center",
                  flexDirection: "row",
                  columnGap: 10,
                  mb: 14,
                  bg: "#fff",
                }}
              >
                <Globe color={C.blue} size={18} />
                <Text sx={{ color: C.text, fontFamily: "Poppins-SemiBold" }}>
                  Continue with Google
                </Text>
              </Pressable>

              {/* or divider */}
              <View sx={{ flexDirection: "row", alignItems: "center", my: 12 }}>
                <View sx={{ flex: 1, height: 1, bg: C.border }} />
                <Text sx={{ color: C.sub, mx: 10 }}>or</Text>
                <View sx={{ flex: 1, height: 1, bg: C.border }} />
              </View>

              {/* Email */}
              <Field label="Email" icon={<Mail color={C.sub} size={16} />}>
                <Input
                  value={email}
                  onChangeText={setEmail}
                  placeholder="you@email.com"
                  autoCapitalize="none"
                  keyboardType="email-address"
                  rightStatus={email ? (emailOk ? "ok" : "bad") : "none"}
                />
              </Field>

              {/* Password */}
              <Field label="Password" icon={<Lock color={C.sub} size={16} />}>
                <Input
                  value={pw}
                  onChangeText={setPw}
                  placeholder="Your password"
                  secureTextEntry
                />
              </Field>

              {/* Login */}
              <Pressable
                onPress={onLogin}
                disabled={!canLogin}
                sx={{
                  height: 50,
                  borderRadius: 14,
                  alignItems: "center",
                  justifyContent: "center",
                  mt: 14,
                  bg: !canLogin ? "#cfd8e3" : C.blue,
                }}
                style={({ pressed }) => [
                  { opacity: pressed && canLogin ? 0.92 : 1 },
                ]}
              >
                <Text
                  sx={{
                    color: "#fff",
                    fontFamily: "Poppins-Bold",
                    letterSpacing: 0.2,
                  }}
                >
                  <LogIn color="#fff" size={16} /> Login
                </Text>
              </Pressable>

              {/* Footer links */}
              <View sx={{ alignItems: "center", mt: 12 }}>
                <Text sx={{ color: C.sub }}>
                  Don’t have an account?{" "}
                  <Text
                    onPress={() => router.push("/signup/signup")}
                    sx={{ color: C.blue, fontFamily: "Poppins-SemiBold" }}
                  >
                    Create one
                  </Text>
                </Text>
              </View>
            </View>
          </View>
        </Animated.View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

/* ---------- UI bits ---------- */
function Field({
  label,
  children,
  icon,
}: {
  label: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
}) {
  return (
    <View sx={{ mb: GAP }}>
      <View sx={{ flexDirection: "row", alignItems: "center", mb: 6 }}>
        {icon ? <View sx={{ width: 18, mr: 8 }}>{icon}</View> : null}
        <Text sx={{ color: C.text, fontFamily: "Poppins-SemiBold" }}>{label}</Text>
      </View>
      {children}
    </View>
  );
}

const Input = ({
  rightStatus = "none",
  ...props
}: any & { rightStatus?: "ok" | "bad" | "none" }) => (
  <View
    sx={{
      position: "relative",
      height: 48,
      bg: C.field,
      borderWidth: 1, // thinner stroke
      borderColor: C.border,
      borderRadius: 14,
      justifyContent: "center",
      px: 14,
    }}
  >
    <TextInput
      {...props}
      style={{
        color: C.text,
        fontSize: 15,
        padding: 0,
      }}
      placeholderTextColor={C.placeholder}
    />
    {/* Right status dot */}
    {rightStatus !== "none" ? (
      <View
        style={{
          position: "absolute",
          right: 10,
          top: 0,
          bottom: 0,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <View
          style={{
            width: 8,
            height: 8,
            borderRadius: 4,
            backgroundColor: rightStatus === "ok" ? "#16a34a" : "#ef4444",
          }}
        />
      </View>
    ) : null}
  </View>
);
