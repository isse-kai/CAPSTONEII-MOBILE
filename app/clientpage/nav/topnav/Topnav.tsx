import {
    Bell,
    ChevronDown,
    ChevronUp,
    Menu,
    Search,
    X,
} from "lucide-react-native";
import React, { useEffect, useMemo, useRef, useState } from "react";
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

export type ClientMenuKey =
  | "manageRequest"
  | "ongoingRequest"
  | "bookWorker"
  | "messages"
  | "profile";

type Props = {
  searchValue: string;
  onChangeSearch: (v: string) => void;
  onPressBell?: () => void;
  onSelectMenu?: (key: ClientMenuKey) => void;
  placeholder?: string;
};

export default function Topnav({
  searchValue,
  onChangeSearch,
  onPressBell,
  onSelectMenu,
  placeholder = "Search workers",
}: Props) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [manageExpanded, setManageExpanded] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const searchH = useRef(new Animated.Value(0)).current;
  const tx = useRef(new Animated.Value(-DRAWER_W)).current;
  const overlayOpacity = useRef(new Animated.Value(0)).current;

  const openDrawer = () => {
    setDrawerOpen(true);
    Animated.parallel([
      Animated.timing(tx, { toValue: 0, duration: 220, useNativeDriver: true }),
      Animated.timing(overlayOpacity, {
        toValue: 1,
        duration: 220,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const closeDrawer = () => {
    Animated.parallel([
      Animated.timing(tx, {
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

  const select = (key: ClientMenuKey) => {
    onSelectMenu?.(key);
    closeDrawer();
  };

  useEffect(() => {
    Animated.timing(searchH, {
      toValue: searchOpen ? 54 : 0,
      duration: 180,
      useNativeDriver: false,
    }).start();
  }, [searchOpen, searchH]);

  const logoSource = useMemo(
    () => require("../../../../image/jdklogo.png"),
    [],
  );

  return (
    <View style={styles.wrap}>
      {/* Drawer */}
      <Modal
        visible={drawerOpen}
        transparent
        animationType="none"
        statusBarTranslucent
        onRequestClose={closeDrawer}
      >
        <View style={StyleSheet.absoluteFill}>
          <Pressable style={StyleSheet.absoluteFill} onPress={closeDrawer}>
            <Animated.View
              style={[styles.overlay, { opacity: overlayOpacity }]}
            />
          </Pressable>

          <Animated.View
            style={[
              styles.drawer,
              { width: DRAWER_W, transform: [{ translateX: tx }] },
            ]}
          >
            <View style={styles.drawerHeader}>
              <Image source={logoSource} style={styles.drawerLogo} />
              <TouchableOpacity
                onPress={closeDrawer}
                style={styles.iconBtnSmall}
                activeOpacity={0.85}
              >
                <X size={18} color="#0f172a" />
              </TouchableOpacity>
            </View>

            {/* Manage Request dropdown */}
            <TouchableOpacity
              activeOpacity={0.85}
              style={styles.drawerItem}
              onPress={() => setManageExpanded((v) => !v)}
            >
              <Text style={styles.drawerText}>Manage Request</Text>
              {manageExpanded ? (
                <ChevronUp size={18} color="#64748b" />
              ) : (
                <ChevronDown size={18} color="#64748b" />
              )}
            </TouchableOpacity>

            {manageExpanded ? (
              <View style={styles.subWrap}>
                <TouchableOpacity
                  activeOpacity={0.85}
                  style={styles.subItem}
                  onPress={() => select("manageRequest")}
                >
                  <Text style={styles.subText}>Request Status</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  activeOpacity={0.85}
                  style={styles.subItem}
                  onPress={() => select("ongoingRequest")}
                >
                  <Text style={styles.subText}>On Going Request</Text>
                </TouchableOpacity>
              </View>
            ) : null}

            <TouchableOpacity
              activeOpacity={0.85}
              style={styles.drawerItem}
              onPress={() => select("bookWorker")}
            >
              <Text style={styles.drawerText}>Book a Worker</Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.85}
              style={styles.drawerItem}
              onPress={() => select("messages")}
            >
              <Text style={styles.drawerText}>Messages</Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.85}
              style={[styles.drawerItem, { borderBottomWidth: 0 }]}
              onPress={() => select("profile")}
            >
              <Text style={styles.drawerText}>Profile</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </Modal>

      {/* Top Row */}
      <View style={styles.row}>
        <TouchableOpacity
          onPress={openDrawer}
          activeOpacity={0.85}
          style={styles.iconBtnLarge}
        >
          <Menu size={22} color="#0f172a" />
        </TouchableOpacity>

        <Image source={logoSource} style={styles.logo} />

        <View style={styles.rightIcons}>
          <TouchableOpacity
            onPress={() => setSearchOpen((v) => !v)}
            activeOpacity={0.85}
            style={styles.iconBtnLarge}
          >
            <Search size={20} color="#0f172a" />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={onPressBell}
            activeOpacity={0.85}
            style={styles.iconBtnLarge}
          >
            <Bell size={20} color="#0f172a" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Search */}
      <Animated.View style={[styles.searchArea, { height: searchH }]}>
        <View style={styles.searchInner}>
          <TextInput
            value={searchValue}
            onChangeText={onChangeSearch}
            placeholder={placeholder}
            placeholderTextColor="#94a3b8"
            style={styles.searchInput}
            returnKeyType="search"
          />

          <TouchableOpacity
            activeOpacity={0.85}
            style={styles.searchBtn}
            onPress={() => console.log("Search:", searchValue)}
          >
            <Text style={styles.searchBtnText}>Search</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#eef2f7",
    paddingTop: 6, // was 10
    paddingBottom: 6, // was 10
    paddingHorizontal: 14, // was 16
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  // smaller logo
  logo: { width: 145, height: 28, resizeMode: "contain" }, // was 170 x 34

  rightIcons: { flexDirection: "row", gap: 10 }, // was 12

  // smaller round buttons
  iconBtnLarge: {
    width: 46, // was 54
    height: 46, // was 54
    borderRadius: 23, // was 27
    borderWidth: 1.5, // was 2
    borderColor: "#e6eaf2",
    backgroundColor: "#fbfcfe",
    alignItems: "center",
    justifyContent: "center",
  },

  iconBtnSmall: {
    width: 34, // was 38
    height: 34, // was 38
    borderRadius: 17, // was 19
    borderWidth: 1,
    borderColor: "#e6eaf2",
    backgroundColor: "#fbfcfe",
    alignItems: "center",
    justifyContent: "center",
  },

  searchArea: { overflow: "hidden" },

  searchInner: {
    marginTop: 8, // was 10
    flexDirection: "row",
    gap: 8, // was 10
    alignItems: "center",
  },

  searchInput: {
    flex: 1,
    height: 40, // was 44
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 10, // was 12
    paddingHorizontal: 12,
    fontSize: 13,
    color: "#111827",
    backgroundColor: "#fff",
  },

  searchBtn: {
    height: 40, // was 44
    paddingHorizontal: 12, // was 14
    borderRadius: 10, // was 12
    backgroundColor: BLUE,
    alignItems: "center",
    justifyContent: "center",
  },

  searchBtnText: { color: "#fff", fontSize: 12.5, fontWeight: "900" },

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

  drawerLogo: { width: 140, height: 26, resizeMode: "contain" }, // slightly smaller

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
