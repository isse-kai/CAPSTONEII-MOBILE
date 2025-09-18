import { useRouter, type Href } from "expo-router";
import { Briefcase, Menu, Search } from "lucide-react-native";
import { useState } from "react";
import {
    Dimensions,
    Image,
    Platform,
    Pressable,
    SafeAreaView,
    Text,
    TextInput,
    View,
} from "react-native";

const { width } = Dimensions.get("window");
const LOGO = require("../../assets/jdklogo.png");

const C = {
  bg: "#ffffff",
  text: "#0f172a",
  sub: "#475569",
  blue: "#1e86ff",
  blueDark: "#0c62c9",
  inputBg: "#ffffff",
  inputBorder: "#d9e3f0",
  inputIcon: "#7b8aa0",
  placeholder: "#93a3b5",
};

export default function WorkerHome() {
  const router = useRouter();
  const [q, setQ] = useState("");

  const handleSearch = () => {
    const query = q.trim();
    if (!query) return;
    // Wire to your worker search route later; this keeps TS happy for now.
    router.push({ pathname: "/home/home", params: { q: query } } as Href);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: C.bg }}>
      {/* HEADER */}
      <View
        style={{
          paddingHorizontal: 14,
          paddingTop: 6,
          paddingBottom: 10,
          borderBottomWidth: 1,
          borderBottomColor: "#eef2f7",
          position: "relative",
        }}
      >
        {/* Centered BIG logo */}
        <View
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 6,
            alignItems: "center",
          }}
          pointerEvents="none"
        >
          <Image
            source={LOGO}
            style={{
              width: Math.min(width * 0.7, 280),
              height: 56,
              resizeMode: "contain",
            }}
          />
        </View>

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {/* Hamburger */}
          <Pressable
            onPress={() => {
              /* open drawer */
            }}
            hitSlop={8}
            style={{
              width: 44,
              height: 44,
              borderRadius: 22,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Menu color={C.text} size={26} strokeWidth={2.5} />
          </Pressable>

          {/* Search input with icon */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              backgroundColor: C.inputBg,
              borderWidth: 1,
              borderColor: C.inputBorder,
              borderRadius: 999,
              height: 38,
              maxWidth: width * 0.58,
              paddingLeft: 20,
              paddingRight: 20,
            }}
          >
            {/* Left icon slightly left */}
            <Search
              color={C.inputIcon}
              size={18}
              strokeWidth={2.25}
              style={{ marginLeft: -2 }}
            />

            <TextInput
              value={q}
              onChangeText={setQ}
              placeholder="Search requests"
              placeholderTextColor={C.placeholder}
              style={{
                flex: 1,
                color: C.text,
                paddingVertical: 0,
                paddingLeft: 6,
                fontSize: 14,
                minWidth: 120,
              }}
              returnKeyType="search"
              onSubmitEditing={handleSearch}
            />

            {/* Tap-to-search icon */}
            <Pressable
              hitSlop={8}
              onPress={handleSearch}
              style={{ marginLeft: 6, paddingHorizontal: 4 }}
            >
              <Search color={C.inputIcon} size={18} strokeWidth={2.25} />
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
        <Briefcase
          color={C.blue}
          size={88}
          strokeWidth={2.5}
          style={{ marginBottom: 28 }}
        />

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
          Browse open requests near you and send your application to start
          earning today.
        </Text>

        <Pressable
          onPress={() =>
            router.push({ pathname: "/home/home" } as Href) // change to '/worker/requests' later
          }
          style={({ pressed }) => ({
            backgroundColor: pressed ? C.blueDark : C.blue,
            paddingVertical: 14,
            paddingHorizontal: 36,
            borderRadius: 14,
            shadowColor: C.blue,
            shadowOpacity: Platform.OS === "android" ? 0.18 : 0.28,
            shadowRadius: 8,
            shadowOffset: { width: 0, height: 4 },
            elevation: 3,
          })}
        >
          <Text
            style={{
              color: "#fff",
              fontWeight: "800",
              fontSize: 16,
              textAlign: "center",
            }}
          >
            Apply Now
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
