// app/workerpage/nav/bottomnav/BottomNav.tsx
import { useRouter } from "expo-router";
import { Compass, Home, User } from "lucide-react-native";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

const BLUE = "#1E88E5";

export type WorkerTabKey = "home" | "browse" | "profile";

export default function BottomNav({ active }: { active: WorkerTabKey }) {
  const router = useRouter();

  const go = (tab: WorkerTabKey) => {
    if (tab === active) return;

    if (tab === "home") {
      // ✅ adjust if your worker home route filename is different
      router.push("/workerpage/workerpage");
      return;
    }

    if (tab === "browse") {
      router.push("/workerpage/Browse/Browse");
      return;
    }

    // profile
    router.push("/workerpage/profile/profile");
  };

  return (
    <View style={styles.wrap}>
      <NavItem
        label="Home"
        active={active === "home"}
        onPress={() => go("home")}
        icon={(color) => <Home size={20} color={color} />}
      />
      <NavItem
        label="Browse"
        active={active === "browse"}
        onPress={() => go("browse")}
        icon={(color) => <Compass size={20} color={color} />}
      />
      <NavItem
        label="Profile"
        active={active === "profile"}
        onPress={() => go("profile")}
        icon={(color) => <User size={20} color={color} />}
      />
    </View>
  );
}

function NavItem({
  label,
  active,
  onPress,
  icon,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
  icon: (color: string) => React.ReactNode;
}) {
  const color = active ? BLUE : "#64748b";

  return (
    <TouchableOpacity
      style={styles.item}
      onPress={onPress}
      activeOpacity={0.85}
    >
      {icon(color)}
      <Text style={[styles.label, { color }]}>{label}</Text>
      {active ? (
        <View style={styles.activeDot} />
      ) : (
        <View style={styles.dotPlaceholder} />
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingTop: 10,
    paddingBottom: 12,
    borderTopWidth: 1,
    borderTopColor: "#eef2f7",
    backgroundColor: "#fff",
  },
  item: {
    width: 90,
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  label: {
    fontSize: 12,
    fontWeight: "900",
  },
  activeDot: {
    width: 18,
    height: 3,
    borderRadius: 2,
    backgroundColor: BLUE,
    marginTop: 2,
  },
  dotPlaceholder: {
    width: 18,
    height: 3,
    marginTop: 2,
    backgroundColor: "transparent",
  },
});
