import { Stack } from "expo-router";
import React, { useEffect, useState } from "react";
import { Image, View } from "react-native";

export default function RootLayout() {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 1500); // 1.5 seconds

    return () => clearTimeout(timer);
  }, []);

  if (showSplash) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: "#ffffff", // white background
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Image
          source={require("../image/jdklogo.png")} // make sure this path is correct
          style={{
            width: 200,
            height: 200,
            resizeMode: "contain",
          }}
        />
      </View>
    );
  }

  // After splash: render app screens with NO header (removes "index" text)
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    />
  );
}
