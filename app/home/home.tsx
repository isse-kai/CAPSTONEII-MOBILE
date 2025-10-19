// app/home/index.tsx
import { useRouter, type Href } from "expo-router";
import { Bell, Home, Menu, MessageCircle, Search, User } from "lucide-react-native";
import {
  Dimensions,
  Platform,
  Pressable,
  SafeAreaView,
  Text,
  View,
} from "react-native";

const { width } = Dimensions.get("window");

const C = {
  bg: "#ffffff",
  text: "#0f172a",
  sub: "#475569",
  blue: "#1e86ff",
  blueDark: "#0c62c9",
  border: "#eef2f7",
};

const ROUTES = {
  search: "/search" as Href,
  notifications: "/notification/Notification" as Href,
  profile: "/profile/Profile" as Href,
  request: "/forms/request" as Href, // ← target route
  messages: "/chat/Messaging" as Href,
};

export default function ClientWelcome() {
  const router = useRouter();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: C.bg }}>
      {/* HEADER */}
      <View
        style={{
          paddingHorizontal: 14,
          paddingTop: 6,
          paddingBottom: 10,
          borderBottomWidth: 1,
          borderBottomColor: C.border,
          backgroundColor: "#fff",
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {/* Left: Hamburger */}
          <Pressable
            onPress={() => {}}
            hitSlop={12}
            style={{
              width: 52,
              height: 52,
              borderRadius: 26,
              alignItems: "center",
              justifyContent: "center",
            }}
            accessibilityRole="button"
            accessibilityLabel="Open menu"
          >
            <Menu color={C.text} size={30} strokeWidth={2.6} />
          </Pressable>

          {/* Right: Search • Bell • Profile */}
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Pressable
              onPress={() => router.push(ROUTES.search)}
              hitSlop={12}
              style={{
                width: 52,
                height: 52,
                borderRadius: 26,
                alignItems: "center",
                justifyContent: "center",
                marginLeft: 2,
              }}
              accessibilityRole="button"
              accessibilityLabel="Search"
            >
              <Search color={C.text} size={26} strokeWidth={2.6} />
            </Pressable>

            <Pressable
              onPress={() => router.push(ROUTES.notifications)}
              hitSlop={12}
              style={{
                width: 52,
                height: 52,
                borderRadius: 26,
                alignItems: "center",
                justifyContent: "center",
                marginLeft: 4,
              }}
              accessibilityRole="button"
              accessibilityLabel="Notifications"
            >
              <Bell color={C.text} size={26} strokeWidth={2.6} />
            </Pressable>

            <Pressable
              onPress={() => router.push(ROUTES.profile)}
              hitSlop={12}
              style={{
                width: 52,
                height: 52,
                borderRadius: 26,
                alignItems: "center",
                justifyContent: "center",
                marginLeft: 4,
              }}
              accessibilityRole="button"
              accessibilityLabel="Profile"
            >
              <User color={C.text} size={26} strokeWidth={2.6} />
            </Pressable>
          </View>
        </View>
      </View>

      {/* CENTERED HERO */}
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          paddingHorizontal: 24,
        }}
      >
        <Home color={C.blue} size={92} strokeWidth={2.6} style={{ marginBottom: 28 }} />

        <Text
          style={{
            color: C.text,
            fontSize: 30,
            fontWeight: "900",
            textAlign: "center",
            marginBottom: 8,
          }}
        >
          Welcome, <Text style={{ color: C.blue }}>John Doe</Text>!
        </Text>

        <Text
          style={{
            color: C.sub,
            fontSize: 16,
            textAlign: "center",
            lineHeight: 24,
            maxWidth: width * 0.88,
            marginBottom: 32,
          }}
        >
          Your home, your schedule. Book trusted professionals quickly and easily.
          We’ll make sure the right expert is on the way.
        </Text>

        {/* Direct navigation to /forms/request */}
        <Pressable
          onPress={() => router.push("/forms/request" as Href)}
          style={({ pressed }) => ({
            backgroundColor: pressed ? C.blueDark : C.blue,
            paddingVertical: 16,
            paddingHorizontal: 40,
            borderRadius: 16,
            shadowColor: C.blue,
            shadowOpacity: Platform.OS === "android" ? 0.18 : 0.28,
            shadowRadius: 8,
            shadowOffset: { width: 0, height: 4 },
            elevation: 3,
          })}
          accessibilityRole="button"
          accessibilityLabel="Request Service Now"
        >
          <Text
            style={{
              color: "#fff",
              fontWeight: "800",
              fontSize: 17,
              textAlign: "center",
            }}
          >
            Request Service Now
          </Text>
        </Pressable>
      </View>

      {/* FLOATING MESSAGE BUTTON */}
      <View pointerEvents="box-none" style={{ position: "absolute", right: 0, bottom: 0, left: 0 }}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Open messages"
          onPress={() => router.push(ROUTES.messages)}
          hitSlop={12}
          style={({ pressed }) => ({
            position: "absolute",
            right: 18,
            bottom: 24,
            width: 64,
            height: 64,
            borderRadius: 32,
            backgroundColor: C.blue,
            alignItems: "center",
            justifyContent: "center",
            transform: [{ scale: pressed ? 0.98 : 1 }],
            shadowColor: C.blue,
            shadowOpacity: Platform.OS === "android" ? 0.22 : 0.28,
            shadowRadius: 12,
            shadowOffset: { width: 0, height: 6 },
            elevation: 7,
          })}
        >
          <MessageCircle color="#fff" size={28} strokeWidth={2.6} />
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
