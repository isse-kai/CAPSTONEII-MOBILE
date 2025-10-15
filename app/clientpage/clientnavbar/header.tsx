import { Ionicons } from "@expo/vector-icons";
import { Text, View } from "dripsy";
import { useRouter } from "expo-router";
import { AnimatePresence, MotiView } from "moti";
import { useState } from "react";
import { Image, Pressable, TextInput } from "react-native";

const Header = () => {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [submenuOpen, setSubmenuOpen] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleNotificationPress = () => {
    router.push("/_sitemap");
  };

  return (
    <View>
      {/* === TOP HEADER ROW === */}
      <View
        sx={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 24,
        }}
      >
        {/* === LOGO === */}
        <Image
          source={require("../../../assets/jdklogo.png")}
          style={{
            width: 120,
            height: 32,
            resizeMode: "contain",
          }}
        />

        {/* === ICONS AREA === */}
        <View sx={{ flexDirection: "row", alignItems: "center", gap: 16 }}>
          {/* Search Icon */}
          <Pressable onPress={() => setShowSearch((prev) => !prev)}>
            <Ionicons name="search" size={24} color="#001a33" />
          </Pressable>

          {/* Notifications */}
          <Pressable onPress={handleNotificationPress}>
            <Ionicons name="notifications-outline" size={24} color="#001a33" />
          </Pressable>

          {/* Burger Menu */}
          <Pressable onPress={() => setMenuOpen((prev) => !prev)}>
            <Ionicons name="menu" size={28} color="#001a33" />
          </Pressable>
        </View>
      </View>

      {/* === SEARCH BAR (slides in) === */}
      <AnimatePresence>
        {showSearch && (
          <MotiView
            from={{ opacity: 0, translateY: -10 }}
            animate={{ opacity: 1, translateY: 0 }}
            exit={{ opacity: 0, translateY: -10 }}
            transition={{ type: "timing", duration: 300 }}
            style={{
              marginBottom: 16,
              width: "100%",
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                backgroundColor: "#fff",
                borderRadius: 12,
                paddingHorizontal: 14,
                paddingVertical: 8,
                borderWidth: 1,
                borderColor: "#e5e7eb",
                shadowColor: "#000",
                shadowOpacity: 0.05,
                shadowRadius: 3,
                elevation: 2,
              }}
            >
              <Ionicons name="search-outline" size={20} color="#4b5563" />
              <TextInput
                placeholder="Search..."
                value={searchQuery}
                onChangeText={setSearchQuery}
                style={{
                  flex: 1,
                  marginLeft: 10,
                  fontSize: 15,
                  color: "#001a33",
                  fontFamily: "Poppins-Regular",
                }}
                placeholderTextColor="#9ca3af"
              />
              <Pressable onPress={() => setShowSearch(false)}>
                <Ionicons name="close" size={20} color="#6b7280" />
              </Pressable>
            </View>
          </MotiView>
        )}
      </AnimatePresence>

      {/* === DROPDOWN MENU === */}
      <AnimatePresence>
        {menuOpen && (
          <MotiView
            from={{ opacity: 0, translateY: -5 }}
            animate={{ opacity: 1, translateY: 0 }}
            exit={{ opacity: 0, translateY: -5 }}
            transition={{ type: "timing", duration: 200 }}
            style={{
              backgroundColor: "#fff",
              borderRadius: 12,
              padding: 16,
              shadowColor: "#000",
              shadowOpacity: 0.1,
              shadowRadius: 2,
              elevation: 2,
              gap: 12,
            }}
          >
            {/* Manage Request */}
            <Pressable onPress={() => setSubmenuOpen((prev) => !prev)}>
              <Text
                sx={{
                  fontSize: 16,
                  fontFamily: "Poppins-Bold",
                  color: "#001a33",
                }}
              >
                Manage Request
              </Text>
            </Pressable>

            {/* Submenu */}
            <AnimatePresence>
              {submenuOpen && (
                <MotiView
                  from={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ type: "timing", duration: 250 }}
                  style={{ paddingLeft: 12, gap: 8 }}
                >
                  <Pressable onPress={() => router.push("./burgermenu/current")}>
                    <Text
                      sx={{
                        fontSize: 14,
                        fontFamily: "Poppins-Regular",
                        color: "#4b5563",
                      }}
                    >
                      Current Service Requests
                    </Text>
                  </Pressable>
                  <Pressable onPress={() => router.push("./burgermenu/completed")}>
                    <Text
                      sx={{
                        fontSize: 14,
                        fontFamily: "Poppins-Regular",
                        color: "#4b5563",
                      }}
                    >
                      Completed Requests
                    </Text>
                  </Pressable>
                </MotiView>
              )}
            </AnimatePresence>

            {/* Hire a Worker */}
            <Pressable onPress={() => router.push("./burgermenu/hire")}>
              <Text
                sx={{
                  fontSize: 16,
                  fontFamily: "Poppins-Bold",
                  color: "#001a33",
                }}
              >
                Hire a Worker
              </Text>
            </Pressable>
          </MotiView>
        )}
      </AnimatePresence>
    </View>
  );
};

export default Header;
