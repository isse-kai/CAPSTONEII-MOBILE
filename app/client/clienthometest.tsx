import {
    ScrollView,
    Text,
    View,
    useSx,
} from "dripsy";
import { useRouter } from "expo-router";
import { useEffect, useRef } from "react";
import {
    Animated,
    Pressable,
    StatusBar,
    ViewStyle
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function HomeScreen() {
  const router = useRouter();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const insets = useSafeAreaInsets();
  const sx = useSx();

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  return (
    <View
      sx={{
        flex: 1,
        bg: "white",
        px: 4,
        pt: insets.top + 4,
        pb: insets.bottom + 4,
      }}
    >
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      <Animated.View style={{ flex: 1, opacity: fadeAnim }}>
        {/* Header */}
        <View
          sx={{
            pt: insets.top + 20,
            px: 20,
            pb: 30,
            bg: "#0685f4",
            borderBottomLeftRadius: 24,
            borderBottomRightRadius: 24,
            position: "relative",
          }}
        >
          <Text
            sx={{
              fontSize: 28,
              fontFamily: "Poppins-ExtraBold",
              color: "white",
              mb: 6,
            }}
          >
            Welcome to JDK Homecare 👋
          </Text>
          <Text
            sx={{
              fontSize: 16,
              fontFamily: "Poppins-Regular",
              color: "#e6f0ff",
            }}
          >
            Your trusted partner for home services and care
          </Text>

          <Pressable
            style={sx({
              position: "absolute",
              top: insets.top + 10,
              right: 20,
              py: 6,
              px: 14,
              bg: "white",
              borderRadius: 16,
              shadowColor: "#000",
              shadowOpacity: 0.1,
              shadowRadius: 4,
              elevation: 3,
            })}
            onPress={() => router.push("/login/login")}
          >
            <Text
              sx={{
                fontFamily: "Poppins-SemiBold",
                fontSize: 14,
                color: "#0685f4",
              }}
            >
              Logout
            </Text>
          </Pressable>
        </View>

        {/* Scrollable Content */}
        <ScrollView
          contentContainerSx={{
            px: 20,
            pt: 20,
            pb: 140,
          }}
          showsVerticalScrollIndicator={false}
        >
          {[
            {
              title: "What You Need to Know",
              content: [
                "We provide reliable and affordable homecare services to make your life easier. From cleaning and repairs to health & safety assistance — we’ve got you covered.",
              ],
            },
            {
              title: "Why Choose Us",
              content: [
                "✔ Professional & trained staff",
                "✔ Affordable, transparent pricing",
                "✔ Available 24/7 for emergencies",
                "✔ 100% satisfaction guaranteed",
              ],
            },
            {
              title: "Our Services",
              content: [
                "🧹 House Cleaning",
                "🔧 Plumbing & Repairs",
                "💡 Electrical Support",
                "🏡 General Home Maintenance",
              ],
            },
            {
              title: "What Our Clients Say",
              content: [
                "⭐⭐⭐⭐⭐ “JDK Homecare made my life so much easier! Highly recommended.”",
                "⭐⭐⭐⭐⭐ “Professional team, quick service, and affordable rates.”",
              ],
            },
          ].map((section, index) => (
            <View key={index}>
              <Text
                sx={{
                  fontSize: 20,
                  fontFamily: "Poppins-SemiBold",
                  color: "#001a33",
                  mb: 12,
                }}
              >
                {section.title}
              </Text>
              <View
                sx={{
                  bg: "#f8f9fa",
                  borderRadius: 16,
                  p: 16,
                  mb: 24,
                  shadowColor: "#000",
                  shadowOpacity: 0.05,
                  shadowRadius: 4,
                  elevation: 2,
                }}
              >
                {section.content.map((line, i) => (
                  <Text
                    key={i}
                    sx={{
                      fontFamily: "Poppins-Regular",
                      fontSize: 14,
                      color: "#001a33",
                      mb: 6,
                    }}
                  >
                    {line}
                  </Text>
                ))}
              </View>
            </View>
          ))}

          <Text
            sx={{
              fontSize: 20,
              fontFamily: "Poppins-SemiBold",
              color: "#001a33",
              mb: 12,
            }}
          >
            Ready to Get Started?
          </Text>
          <Pressable
            onPress={() => router.push("/screen/bookscreentest")}
            style={sx({
              height: 120,
              bg: "#0685f4",
              borderRadius: 16,
              justifyContent: "center" as ViewStyle["justifyContent"],
              alignItems: "center" as ViewStyle["alignItems"],
              mb: 24,
              shadowColor: "#000",
              shadowOpacity: 0.1,
              shadowRadius: 6,
              elevation: 3,
            })}
          >
            <Text
              sx={{
                fontFamily: "Poppins-SemiBold",
                fontSize: 18,
                color: "white",
              }}
            >
              📅 Book a Service Now
            </Text>
          </Pressable>
        </ScrollView>

        {/* Floating Navigation */}
        <View
          sx={{
            position: "absolute",
            bottom: insets.bottom + 10,
            left: 20,
            right: 20,
            bg: "white",
            borderRadius: 30,
            flexDirection: "row",
            justifyContent: "space-around",
            alignItems: "center",
            py: 10,
            shadowColor: "#000",
            shadowOpacity: 0.15,
            shadowRadius: 8,
            elevation: 5,
          }}
        >
          {([
            { label: "Home", icon: "🏠", route: "/screen/homescreentest" as const },
            { label: "Notifications", icon: "🔔", route: "/screen/notificationscreentest" as const },
            { label: "Profile", icon: "👤", route: "/screen/profilescreentest" as const },
          ]).map((nav, index) => (
            <Pressable
              key={index}
              onPress={() => router.push(nav.route)}
              style={sx({
                justifyContent: "center" as ViewStyle["justifyContent"],
                alignItems: "center" as ViewStyle["alignItems"],
              })}
            >
              <Text sx={{ fontSize: 22, mb: 2 }}>{nav.icon}</Text>
              <Text
                sx={{
                  fontSize: 12,
                  fontFamily: "Poppins-Medium",
                  color: "#001a33",
                }}
              >
                {nav.label}
              </Text>
            </Pressable>
          ))}
        </View>
      </Animated.View>
    </View>
  );
}
