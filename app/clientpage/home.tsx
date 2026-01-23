import { Ionicons } from "@expo/vector-icons";
import { Pressable, Text, View } from "dripsy";
import { useFonts } from "expo-font";
import { useRouter } from "expo-router";
import { AnimatePresence, MotiImage, MotiView } from "moti";
import React, { useEffect, useRef, useState } from "react";
import {
  Dimensions,
  Image,
  ImageBackground,
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import Header from "./clientnavbar/header";
import ClientNavbar from "./clientnavbar/navbar";

const { width, height } = Dimensions.get("window");

const banners = [
  { id: 1, image: require("../../assets/banner.png") },
  { id: 2, image: require("../../assets/banner-2.png") },
  { id: 3, image: require("../../assets/banner-3.png") },
];

const workers = [
  { id: 1, name: "Anna Reyes", role: "Electrician" },
  { id: 2, name: "Mark Santos", role: "Plumber" },
  { id: 3, name: "Liza Cruz", role: "Cleaner" },
  { id: 4, name: "John Tan", role: "Carpenter" },
];

export default function ClientHome() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const scrollRef = useRef<ScrollView>(null);

  const [fontsLoaded] = useFonts({
    "Poppins-Regular": require("../../assets/fonts/Poppins/Poppins-Regular.ttf"),
    "Poppins-Bold": require("../../assets/fonts/Poppins/Poppins-Bold.ttf"),
  });

  const [bannerIndex, setBannerIndex] = useState(0);
  const [scrollX, setScrollX] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setBannerIndex((prev) => (prev + 1) % banners.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) =>
    setScrollX(event.nativeEvent.contentOffset.x);

  const scrollBy = (offset: number) => {
    scrollRef.current?.scrollTo({ x: scrollX + offset, animated: true });
  };

  if (!fontsLoaded) return null;

  return (
    <ImageBackground
      source={require("../../assets/welcome.jpg")}
      resizeMode="cover"
      style={{
        flex: 1,
        height: height,
      }}
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

            {/* Banner Slideshow */}
            <View
              sx={{
                width: "100%",
                height: height * 0.18,
                borderRadius: 14,
                overflow: "hidden",
                mb: 18,
              }}
            >
              <AnimatePresence>
                <MotiImage
                  key={banners[bannerIndex].id}
                  source={banners[bannerIndex].image}
                  style={{
                    width: "100%",
                    height: "100%",
                    resizeMode: "contain",
                    position: "absolute",
                  }}
                  from={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ type: "timing", duration: 800 }}
                />
              </AnimatePresence>
            </View>

            {/* Service Request */}
            <View sx={{ gap: 16 }}>
              <Text
                sx={{
                  fontSize: 18,
                  fontFamily: "Poppins-Bold",
                  color: "#001a33",
                  mb: 10,
                }}
              >
                Service Request Post
              </Text>

              <Pressable
                onPress={() => router.push("./clientforms/request")}
                sx={{
                  borderWidth: 2,
                  borderColor: "#008CFC",
                  borderRadius: 14,
                  p: 16,
                  bg: "white",
                }}
              >
                <View
                  sx={{ flexDirection: "row", alignItems: "center", gap: 12 }}
                >
                  <Image
                    source={require("../../assets/add-icon.png")}
                    style={{
                      width: 42,
                      height: 42,
                      resizeMode: "contain",
                    }}
                  />
                  <View sx={{ flex: 1 }}>
                    <Text
                      sx={{
                        fontSize: 16,
                        fontFamily: "Poppins-Bold",
                        color: "#008CFC",
                        marginBottom: 4,
                      }}
                    >
                      Post a Service Request
                    </Text>
                    <Text
                      sx={{
                        fontSize: 14,
                        fontFamily: "Poppins-Regular",
                        color: "#4b5563",
                      }}
                    >
                      No active service requests found. You can post a new
                      service request to find available workers.
                    </Text>
                  </View>
                </View>
              </Pressable>
            </View>

            {/* Worker Carousel */}
            <View sx={{ mt: 24 }}>
              <View
                sx={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 10,
                }}
              >
                <Text
                  sx={{
                    fontSize: 18,
                    fontFamily: "Poppins-Bold",
                    color: "#001a33",
                  }}
                >
                  Available Workers
                </Text>

                <View sx={{ flexDirection: "row", gap: 12 }}>
                  <Pressable onPress={() => scrollBy(-160)}>
                    <Ionicons name="chevron-back" size={24} color="#001a33" />
                  </Pressable>
                  <Pressable onPress={() => scrollBy(160)}>
                    <Ionicons
                      name="chevron-forward"
                      size={24}
                      color="#001a33"
                    />
                  </Pressable>
                </View>
              </View>

              <ScrollView
                ref={scrollRef}
                horizontal
                onScroll={handleScroll}
                scrollEventThrottle={16}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ gap: 14 }}
              >
                {workers.map((worker) => (
                  <View
                    key={worker.id}
                    sx={{
                      width: width * 0.38,
                      bg: "#fff",
                      borderRadius: 14,
                      p: 14,
                      alignItems: "center",
                    }}
                  >
                    <View
                      sx={{
                        width: 80,
                        height: 80,
                        borderRadius: 40,
                        bg: "#e5e7eb",
                        mb: 8,
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <Text sx={{ fontSize: 28 }}>👤</Text>
                    </View>
                    <Text
                      sx={{
                        fontSize: 15,
                        fontFamily: "Poppins-Bold",
                        color: "#001a33",
                        textAlign: "center",
                      }}
                    >
                      {worker.name}
                    </Text>
                    <Text
                      sx={{
                        fontSize: 13,
                        fontFamily: "Poppins-Regular",
                        color: "#4b5563",
                        textAlign: "center",
                      }}
                    >
                      {worker.role}
                    </Text>
                  </View>
                ))}
              </ScrollView>

              {/* Scroll indicator dots */}
              <View
                sx={{ flexDirection: "row", justifyContent: "center", mt: 12 }}
              >
                {workers.map((_, index) => {
                  const isActive = Math.round(scrollX / 160) === index;
                  return (
                    <View
                      key={index}
                      sx={{
                        width: 8,
                        height: 8,
                        borderRadius: 4,
                        bg: isActive ? "#008CFC" : "#d1d5db",
                        mx: 4,
                      }}
                    />
                  );
                })}
              </View>
            </View>
          </MotiView>
        </ScrollView>

        <ClientNavbar />
      </SafeAreaView>
    </ImageBackground>
  );
}
