// app/workerpage/nav/TopNav.tsx
import { useRouter } from "expo-router";
import {
  Bell,
  ChevronDown,
  ChevronUp,
  Menu,
  Search,
  X,
} from "lucide-react-native";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Image,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const BLUE = "#1E88E5";
const { width } = Dimensions.get("window");
const DRAWER_W = Math.min(320, Math.floor(width * 0.82));

export type TopNavMenuKey =
  | "appPostStatus"
  | "completedWorks"
  | "ongoingService"
  | "findClient"
  | "messages";

interface TopNavProps {
  searchValue: string;
  onChangeSearch: (value: string) => void;
  onPressBell?: () => void;
  onSelectMenu?: (key: TopNavMenuKey) => void;
}

export default function TopNav({
  searchValue,
  onChangeSearch,
  onPressBell,
  onSelectMenu,
}: TopNavProps) {
  const router = useRouter();

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [manageExpanded, setManageExpanded] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const searchHeight = useRef(new Animated.Value(0)).current;

  // Drawer animation
  const drawerTranslateX = useRef(new Animated.Value(-DRAWER_W)).current;
  const overlayOpacity = useRef(new Animated.Value(0)).current;

  const openDrawer = () => {
    setDrawerOpen(true);
    Animated.parallel([
      Animated.timing(drawerTranslateX, {
        toValue: 0,
        duration: 220,
        useNativeDriver: true,
      }),
      Animated.timing(overlayOpacity, {
        toValue: 1,
        duration: 220,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const closeDrawer = () => {
    Animated.parallel([
      Animated.timing(drawerTranslateX, {
        toValue: -DRAWER_W,
        duration: 220,
        useNativeDriver: true,
      }),
      Animated.timing(overlayOpacity, {
        toValue: 0,
        duration: 220,
        useNativeDriver: true,
      }),
    ]).start(({ finished }) => {
      if (finished) {
        setDrawerOpen(false);
        setManageExpanded(false);
      }
    });
  };

  // map menu key → route
  const routeMap: Record<TopNavMenuKey, string> = {
    appPostStatus: "/workerpage/appPostStatus",
    completedWorks: "/workerpage/completedWorks",
    ongoingService: "/workerpage/ongoingService",
    findClient: "/workerpage/Browse/Browse",
    messages: "/workerpage/Messages/messages",
  };

  const handleSelectMenu = (key: TopNavMenuKey) => {
    onSelectMenu?.(key);

    const path = routeMap[key];
    if (path) {
      router.push(path as any);
    }

    closeDrawer();
  };

  useEffect(() => {
    Animated.timing(searchHeight, {
      toValue: searchOpen ? 54 : 0,
      duration: 180,
      useNativeDriver: false,
    }).start();
  }, [searchOpen, searchHeight]);

  return (
    <View style={styles.wrap}>
      {/* Drawer via Modal */}
      <Modal
        visible={drawerOpen}
        transparent
        animationType="none"
        statusBarTranslucent
      >
        <View style={StyleSheet.absoluteFill}>
          {/* Overlay */}
          <Pressable style={StyleSheet.absoluteFill} onPress={closeDrawer}>
            <Animated.View
              style={[styles.overlay, { opacity: overlayOpacity }]}
            />
          </Pressable>

          {/* Drawer */}
          <Animated.View
            style={[
              styles.drawer,
              {
                width: DRAWER_W,
                transform: [{ translateX: drawerTranslateX }],
              },
            ]}
          >
            <View style={styles.drawerHeader}>
              <Image
                source={require("../../../../image/jdklogo.png")}
                style={styles.drawerLogo}
              />
              <TouchableOpacity
                onPress={closeDrawer}
                style={styles.iconBtn}
                activeOpacity={0.85}
              >
                <X size={18} color="#0f172a" />
              </TouchableOpacity>
            </View>

            {/* Manage Post Group */}
            <TouchableOpacity
              activeOpacity={0.85}
              style={styles.drawerItem}
              onPress={() => setManageExpanded((prev) => !prev)}
            >
              <Text style={styles.drawerText}>Manage Post</Text>
              {manageExpanded ? (
                <ChevronUp size={18} color="#64748b" />
              ) : (
                <ChevronDown size={18} color="#64748b" />
              )}
            </TouchableOpacity>

            {manageExpanded && (
              <View style={styles.subWrap}>
                <TouchableOpacity
                  activeOpacity={0.85}
                  style={styles.subItem}
                  onPress={() => handleSelectMenu("appPostStatus")}
                >
                  <Text style={styles.subText}>Application Post Status</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  activeOpacity={0.85}
                  style={styles.subItem}
                  onPress={() => handleSelectMenu("completedWorks")}
                >
                  <Text style={styles.subText}>Completed Works</Text>
                </TouchableOpacity>
              </View>
            )}

            {/* Single Items */}
            <TouchableOpacity
              activeOpacity={0.85}
              style={styles.drawerItem}
              onPress={() => handleSelectMenu("ongoingService")}
            >
              <Text style={styles.drawerText}>On Going Service</Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.85}
              style={styles.drawerItem}
              onPress={() => handleSelectMenu("findClient")}
            >
              <Text style={styles.drawerText}>Find a Client</Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.85}
              style={[styles.drawerItem, { borderBottomWidth: 0 }]}
              onPress={() => handleSelectMenu("messages")}
            >
              <Text style={styles.drawerText}>Messages</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </Modal>

      {/* Top Row */}
      <View style={styles.row}>
        <TouchableOpacity
          onPress={openDrawer}
          activeOpacity={0.85}
          style={styles.iconBtn}
        >
          <Menu size={20} color="#0f172a" />
        </TouchableOpacity>

        <Image
          source={require("../../../../image/jdklogo.png")}
          style={styles.logo}
        />

        <View style={styles.rightIcons}>
          <TouchableOpacity
            onPress={() => setSearchOpen((prev) => !prev)}
            activeOpacity={0.85}
            style={styles.iconBtn}
          >
            <Search size={18} color="#0f172a" />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={onPressBell}
            activeOpacity={0.85}
            style={styles.iconBtn}
          >
            <Bell size={18} color="#0f172a" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Expanding Search */}
      <Animated.View style={[styles.searchArea, { height: searchHeight }]}>
        <View style={styles.searchInner}>
          <TextInput
            value={searchValue}
            onChangeText={onChangeSearch}
            placeholder="Search clients"
            placeholderTextColor="#94a3b8"
            style={styles.searchInput}
            returnKeyType="search"
          />
          <TouchableOpacity activeOpacity={0.85} style={styles.searchBtn}>
            <Text style={styles.searchBtnText}>Search</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    paddingHorizontal: 14,
    paddingTop: 10,
    paddingBottom: 10,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#eef2f7",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  logo: { width: 150, height: 28, resizeMode: "contain" },
  rightIcons: { flexDirection: "row", gap: 10 },

  iconBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 1,
    borderColor: "#e6eaf2",
    backgroundColor: "#fbfcfe",
    alignItems: "center",
    justifyContent: "center",
  },

  searchArea: { overflow: "hidden" },
  searchInner: {
    marginTop: 10,
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
  },
  searchInput: {
    flex: 1,
    height: 44,
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 10,
    paddingHorizontal: 12,
    fontSize: 13.5,
    color: "#111827",
    backgroundColor: "#fff",
  },
  searchBtn: {
    height: 44,
    paddingHorizontal: 14,
    borderRadius: 10,
    backgroundColor: BLUE,
    alignItems: "center",
    justifyContent: "center",
  },
  searchBtnText: { color: "#fff", fontSize: 13, fontWeight: "900" },

  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(15,23,42,0.35)",
  },
  drawer: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    backgroundColor: "#fff",
    borderRightWidth: 1,
    borderRightColor: "#eef2f7",
    paddingTop: 10,
    elevation: 20,
  },

  drawerHeader: {
    paddingHorizontal: 14,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eef2f7",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  drawerLogo: { width: 150, height: 28, resizeMode: "contain" },

  drawerItem: {
    paddingHorizontal: 14,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  drawerText: { fontSize: 13, fontWeight: "900", color: "#0f172a" },

  subWrap: {
    paddingHorizontal: 14,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
    backgroundColor: "#fbfcfe",
  },
  subItem: {
    marginTop: 10,
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#eef2f7",
    backgroundColor: "#fff",
  },
  subText: { fontSize: 12.5, fontWeight: "800", color: "#0f172a" },
});
