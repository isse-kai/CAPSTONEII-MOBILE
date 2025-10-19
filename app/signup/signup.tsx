import { Image, Pressable, Text, View } from "dripsy";
import { useFonts } from "expo-font";
import { useRouter } from "expo-router";
import { Home, Wrench } from "lucide-react-native";
import { useEffect, useRef } from "react";
import { Animated, Platform, SafeAreaView, StatusBar } from "react-native";

const C = {
  bg: "#ffffff",
  text: "#001a33",
  sub: "#4e6075",
  blue: "#0685f4",
  blueDark: "#056cd1",
  chip: "#f1f5f9",
  card: "#fff",
  border: "#e6eef7",
  shadow: Platform.OS === "android" ? 0 : 0.08,
};

export default function Signup() {
  const router = useRouter();

  // page entrance animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(24)).current;

  // press animations for role cards
  const scaleClient = useRef(new Animated.Value(1)).current;
  const scaleWorker = useRef(new Animated.Value(1)).current;

  // fonts
  const [fontsLoaded] = useFonts({
    "Poppins-Regular": require("../../assets/fonts/Poppins/Poppins-Regular.ttf"),
    "Poppins-Medium": require("../../assets/fonts/Poppins/Poppins-Medium.ttf"),
    "Poppins-SemiBold": require("../../assets/fonts/Poppins/Poppins-SemiBold.ttf"),
    "Poppins-Bold": require("../../assets/fonts/Poppins/Poppins-Bold.ttf"),
    "Poppins-ExtraBold": require("../../assets/fonts/Poppins/Poppins-ExtraBold.ttf"),
  });

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 700, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 700, useNativeDriver: true }),
    ]).start();
  }, [fadeAnim, slideAnim]);

  // nav
  const goLogin = () => router.replace("/login/login");
  const handleClientSignup = () => router.push("/signas/client");
  const handleWorkerSignup = () => router.push("/signas/worker");

  // helpers: card press feedback
  const pressIn = (v: Animated.Value) =>
    Animated.spring(v, { toValue: 0.96, useNativeDriver: true, speed: 20, bounciness: 0 }).start();
  const pressOut = (v: Animated.Value) =>
    Animated.spring(v, { toValue: 1, useNativeDriver: true, speed: 20, bounciness: 6 }).start();

  if (!fontsLoaded) return null;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: C.bg }}>
      <StatusBar barStyle="dark-content" backgroundColor={C.bg} />

      {/* Sticky Back (top-right) */}
      <View
        sx={{
          position: "absolute",
          right: 18,
          top: 18,
          zIndex: 10,
        }}
      >
        <Pressable
          onPress={goLogin}
          accessibilityRole="button"
          accessibilityLabel="Go to login"
          sx={{
            px: 14,
            height: 40,
            borderRadius: 999,
            backgroundColor: C.chip,
            justifyContent: "center",
            alignItems: "center",
            borderWidth: 1,
            borderColor: C.border,
            shadowColor: "#000",
            shadowOpacity: C.shadow,
            shadowRadius: 8,
            shadowOffset: { width: 0, height: 4 },
            elevation: 2,
          }}
          style={({ pressed }) => [{ opacity: pressed ? 0.8 : 1 }]}
        >
          <Text sx={{ fontSize: 14, color: C.text, fontFamily: "Poppins-Bold" }}>Back</Text>
        </Pressable>
      </View>

      <Animated.View
        style={{
          flex: 1,
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        }}
      >
        {/* Top: Logo */}
        <View sx={{ alignItems: "center", px: 20, pt: 26, pb: 8 }}>
          <Image
            source={require("../../assets/jdklogo.png")}
            style={{ width: 110, height: 110 }}
            resizeMode="contain"
          />
        </View>

        {/* CENTER: Headline + Roles (all centered vertically) */}
        <View sx={{ flex: 1, justifyContent: "center", px: 20 }}>
          {/* Headline in the middle with roles */}
          <View sx={{ alignItems: "center", px: 24, mb: 18 }}>
            <Text
              sx={{
                fontSize: 30,
                fontFamily: "Poppins-ExtraBold",
                color: C.text,
                textAlign: "center",
              }}
            >
              Join JDK HOMECARE
            </Text>
            <Text
              sx={{
                fontSize: 16,
                fontFamily: "Poppins-Regular",
                color: C.sub,
                textAlign: "center",
                lineHeight: 24,
                mt: 6,
              }}
            >
              Choose how you’d like to get started
            </Text>
            <View sx={{ width: 54, height: 4, backgroundColor: C.blue, borderRadius: 2, mt: 10 }} />
          </View>

          {/* Role Cards */}
          <View sx={{ flexDirection: "row", justifyContent: "space-between" }}>
            {/* Client Card (outlined) */}
            <Animated.View style={{ flex: 1, transform: [{ scale: scaleClient }] }}>
              <Pressable
                onPress={handleClientSignup}
                onPressIn={() => pressIn(scaleClient)}
                onPressOut={() => pressOut(scaleClient)}
                sx={{
                  backgroundColor: C.card,
                  borderWidth: 2,
                  borderColor: C.blue,
                  borderRadius: 18,
                  p: 16,
                  alignItems: "center",
                  minHeight: 168,
                  justifyContent: "center",
                  mr: 8,
                  shadowColor: "#000",
                  shadowOpacity: C.shadow,
                  shadowRadius: 12,
                  shadowOffset: { width: 0, height: 6 },
                  elevation: 3,
                }}
                style={({ pressed }) => [{ opacity: pressed ? 0.95 : 1 }]}
              >
                <View
                  sx={{
                    width: 56,
                    height: 56,
                    borderRadius: 28,
                    backgroundColor: C.blue,
                    alignItems: "center",
                    justifyContent: "center",
                    mb: 14,
                  }}
                >
                  <Home color="#ffffff" size={28} />
                </View>

                <Text
                  sx={{
                    fontSize: 16,
                    fontFamily: "Poppins-Bold",
                    color: C.text,
                    mb: 6,
                    textAlign: "center",
                  }}
                >
                  Sign as Client
                </Text>
                <Text
                  sx={{
                    fontSize: 12,
                    fontFamily: "Poppins-Regular",
                    color: C.sub,
                    textAlign: "center",
                    lineHeight: 16,
                  }}
                >
                  Book home{"\n"}services
                </Text>
              </Pressable>
            </Animated.View>

            {/* Worker Card (solid) */}
            <Animated.View style={{ flex: 1, transform: [{ scale: scaleWorker }] }}>
              <Pressable
                onPress={handleWorkerSignup}
                onPressIn={() => pressIn(scaleWorker)}
                onPressOut={() => pressOut(scaleWorker)}
                sx={{
                  backgroundColor: C.blue,
                  borderRadius: 18,
                  p: 16,
                  alignItems: "center",
                  minHeight: 168,
                  justifyContent: "center",
                  ml: 8,
                  shadowColor: "#0685f4",
                  shadowOpacity: 0.18,
                  shadowRadius: 14,
                  shadowOffset: { width: 0, height: 8 },
                  elevation: 5,
                }}
                style={({ pressed }) => [{ opacity: pressed ? 0.92 : 1 }]}
              >
                <View
                  sx={{
                    width: 56,
                    height: 56,
                    borderRadius: 28,
                    backgroundColor: "#ffffff",
                    alignItems: "center",
                    justifyContent: "center",
                    mb: 14,
                  }}
                >
                  <Wrench color={C.blue} size={28} />
                </View>

                <Text
                  sx={{
                    fontSize: 16,
                    fontFamily: "Poppins-Bold",
                    color: "#ffffff",
                    mb: 6,
                    textAlign: "center",
                  }}
                >
                  Sign as Worker
                </Text>
                <Text
                  sx={{
                    fontSize: 12,
                    fontFamily: "Poppins-Regular",
                    color: "#ffffff",
                    textAlign: "center",
                    lineHeight: 16,
                    opacity: 0.92,
                  }}
                >
                  Offer your{"\n"}services
                </Text>
              </Pressable>
            </Animated.View>
          </View>

          {/* Already have an account */}
          <View sx={{ alignItems: "center", mt: 22 }}>
            <Text
              sx={{
                margin: 10,
                fontSize: 14,
                fontFamily: "Poppins-Regular",
                color: C.sub,
                textAlign: "center",
                lineHeight: 20,
              }}
            >
              Already have an account?{" "}
              <Text onPress={goLogin} sx={{ color: C.blue, fontFamily: "Poppins-SemiBold" }}>
                Log in
              </Text>
            </Text>
          </View>
        </View>

        {/* Bottom: Terms (always at the bottom) */}
        <View sx={{ px: 20, pb: 26, alignItems: "center" }}>
          <Text
            sx={{
              fontSize: 12,
              color: "#9aa4b2",
              textAlign: "center",
              lineHeight: 18,
              fontFamily: "Poppins-Regular",
            }}
          >
            By continuing, you agree to our Terms of Service{"\n"}and Privacy Policy
          </Text>
        </View>
      </Animated.View>
    </SafeAreaView>
  );
}
