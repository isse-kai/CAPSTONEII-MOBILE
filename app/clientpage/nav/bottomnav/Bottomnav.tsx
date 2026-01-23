// app/clientpage/nav/bottomnav/Bottomnav.tsx
import { Compass, Home, User } from "lucide-react-native";
import React from "react";
import {
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

const BLUE = "#1E88E5";
const INACTIVE = "#6b7280";

export type ClientTabKey = "home" | "browse" | "profile";

export default function Bottomnav({
  active,
  onChange,
}: {
  active: ClientTabKey;
  onChange: (t: ClientTabKey) => void;
}) {
  const Tab = ({
    keyName,
    label,
    Icon,
  }: {
    keyName: ClientTabKey;
    label: string;
    Icon: any;
  }) => {
    const isActive = active === keyName;

    return (
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={() => onChange(keyName)}
        style={styles.tabBtn}
      >
        <Icon size={22} color={isActive ? BLUE : INACTIVE} strokeWidth={2.2} />

        <Text style={[styles.tabLabel, isActive && styles.tabLabelActive]}>
          {label}
        </Text>

        <View style={[styles.indicator, isActive && styles.indicatorActive]} />
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.wrap}>
        <Tab keyName="home" label="Home" Icon={Home} />
        <Tab keyName="browse" label="Browse" Icon={Compass} />
        <Tab keyName="profile" label="Profile" Icon={User} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    backgroundColor: "#fff",
  },
  wrap: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",

    // ✅ smaller height
    paddingTop: 6,
    paddingBottom: 4,

    borderTopWidth: 1,
    borderTopColor: "#eef2f7",
    backgroundColor: "#fff",
  },
  tabBtn: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",

    // ✅ smaller touch padding but still comfy
    paddingVertical: 6,
  },
  tabLabel: {
    marginTop: 3,
    fontSize: 12,
    fontWeight: "800",
    color: INACTIVE,
  },
  tabLabelActive: {
    color: BLUE,
  },

  // ✅ smaller underline
  indicator: {
    marginTop: 6,
    height: 4,
    width: 36,
    borderRadius: 999,
    backgroundColor: "transparent",
  },
  indicatorActive: {
    backgroundColor: BLUE,
  },
});
