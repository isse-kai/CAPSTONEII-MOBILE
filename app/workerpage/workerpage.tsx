// app/workerpage/workerpage.tsx
import { useFocusEffect } from "@react-navigation/native";
import { useRouter } from "expo-router";
import { ClipboardPenLine, UserCog } from "lucide-react-native";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  Animated,
  Modal,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { supabase } from "../../supabase/supabase";
import BottomNav from "./nav/bottomnav/BottomNav";
import TopNav from "./nav/topnav/TopNav";

const BLUE = "#1E88E5";

// 🔵 Banner images (update paths if needed)
const BANNERS = [
  require("../../image/Banner1.png"),
  require("../../image/Banner2.png"),
  require("../../image/Banner3.png"),
];

/**
 * ✅ Accepts:
 * - "MM/DD/YYYY"
 * - "YYYY-MM-DD"
 * - "YYYY-MM-DDTHH:mm:ss..." (keeps first 10)
 */
function calculateAgeAny(dobStr: string): number | null {
  if (!dobStr) return null;
  const raw = dobStr.trim();
  if (!raw) return null;

  // handle ISO datetime string
  const s = raw.includes("T") ? raw.slice(0, 10) : raw;

  let birthDate: Date | null = null;

  // YYYY-MM-DD
  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) {
    const [y, m, d] = s.split("-").map(Number);
    birthDate = new Date(y, m - 1, d);
  }

  // MM/DD/YYYY
  if (!birthDate && /^\d{2}\/\d{2}\/\d{4}$/.test(s)) {
    const [mm, dd, yyyy] = s.split("/").map(Number);
    birthDate = new Date(yyyy, mm - 1, dd);
  }

  if (!birthDate || isNaN(birthDate.getTime())) return null;

  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--;
  return age;
}

// digits-only helper for phone check
const onlyDigits = (v: string) => (v || "").replace(/[^\d]/g, "");

// returns local 10 digits after +63 or after leading 0
function getPHLocal10(phone: string) {
  const d = onlyDigits(phone);
  if (!d) return "";
  if (d.startsWith("63") && d.length >= 12) return d.slice(2, 12); // 63 + 10 digits
  if (d.startsWith("09") && d.length >= 11) return d.slice(1, 11); // remove 0
  if (d.startsWith("9") && d.length >= 10) return d.slice(0, 10);
  if (d.length > 10) return d.slice(d.length - 10);
  return d; // still typing
}

type EligibilityState = "missing" | "underage" | null;

export default function WorkerPage() {
  const router = useRouter();

  const [search, setSearch] = useState("");

  // ✅ this is only for highlighting BottomNav
  const [tab] = useState<"home" | "browse" | "profile">("home");

  // ✅ Logged-in name
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");

  // ✅ Values from either user_worker OR user_client
  const [userPhone, setUserPhone] = useState<string>("");
  const [userDob, setUserDob] = useState<string>("");

  const [eligibilityVisible, setEligibilityVisible] = useState(false);
  const [eligibilityState, setEligibilityState] =
    useState<EligibilityState>(null);

  const displayName = useMemo(() => {
    const fn = (firstName || "").trim();
    const ln = (lastName || "").trim();
    const full = `${fn} ${ln}`.trim();
    return full || "User";
  }, [firstName, lastName]);

  const loadProfile = useCallback(async () => {
    const { data: authData, error: authErr } = await supabase.auth.getUser();
    if (authErr || !authData?.user) {
      router.replace("/login/login");
      return;
    }

    const uid = authData.user.id;

    // ✅ Try worker first
    const workerRes = await supabase
      .from("user_worker")
      .select("first_name,last_name,contact_number,date_of_birth")
      .eq("auth_uid", uid)
      .maybeSingle();

    if (!workerRes.error && workerRes.data) {
      setFirstName(workerRes.data.first_name ?? "");
      setLastName(workerRes.data.last_name ?? "");
      setUserPhone(workerRes.data.contact_number ?? "");
      setUserDob(workerRes.data.date_of_birth ?? "");
      return;
    }

    // ✅ If no worker row, try client
    const clientRes = await supabase
      .from("user_client")
      .select("first_name,last_name,contact_number,date_of_birth")
      .eq("auth_uid", uid)
      .maybeSingle();

    if (!clientRes.error && clientRes.data) {
      setFirstName(clientRes.data.first_name ?? "");
      setLastName(clientRes.data.last_name ?? "");
      setUserPhone(clientRes.data.contact_number ?? "");
      setUserDob(clientRes.data.date_of_birth ?? "");
      return;
    }

    // ✅ fallback meta
    const meta: any = authData.user.user_metadata || {};
    setFirstName(meta.first_name ?? "");
    setLastName(meta.last_name ?? "");
    setUserPhone("");
    setUserDob("");
  }, [router]);

  // First load
  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  // ✅ Reload when you return from Account Settings
  useFocusEffect(
    useCallback(() => {
      loadProfile();
    }, [loadProfile]),
  );

  const handleBecomeWorker = () => {
    // normalize checks
    const local10 = getPHLocal10(userPhone);
    const dobTrimmed = (userDob || "").trim();

    // Require BOTH
    if (!local10 || local10.length < 10 || !dobTrimmed) {
      setEligibilityState("missing");
      setEligibilityVisible(true);
      return;
    }

    const age = calculateAgeAny(dobTrimmed);
    if (age === null) {
      setEligibilityState("missing");
      setEligibilityVisible(true);
      return;
    }

    if (age < 18) {
      setEligibilityState("underage");
      setEligibilityVisible(true);
      return;
    }

    router.push("/workerforms/WorkerInfoStep1");
  };

  const goToAccountSettings = () => {
    setEligibilityVisible(false);
    router.push("/workerpage/profile/workeraccountsettings");
  };

  const renderModalContent = () => {
    if (!eligibilityState) return null;

    if (eligibilityState === "missing") {
      return (
        <>
          <Text style={styles.modalTitle}>Complete your details</Text>
          <Text style={styles.modalBody}>
            To become a worker, please provide both your{" "}
            <Text style={styles.bold}>mobile number</Text> and{" "}
            <Text style={styles.bold}>birthday</Text> in Account Settings.
          </Text>

          <View style={styles.modalButtonRow}>
            <TouchableOpacity
              activeOpacity={0.85}
              style={[styles.modalBtn, styles.modalBtnGhost]}
              onPress={() => setEligibilityVisible(false)}
            >
              <Text style={styles.modalBtnGhostText}>Maybe later</Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.9}
              style={[styles.modalBtn, styles.modalBtnPrimary]}
              onPress={goToAccountSettings}
            >
              <Text style={styles.modalBtnPrimaryText}>
                Go to Account Settings
              </Text>
            </TouchableOpacity>
          </View>
        </>
      );
    }

    return (
      <>
        <Text style={styles.modalTitle}>You must be 18 or older</Text>
        <Text style={styles.modalBody}>
          Based on your birthday, you are currently under 18. You need to be at
          least 18 years old to apply as a worker on JDK HOMECARE.
        </Text>

        <View style={styles.modalButtonRow}>
          <TouchableOpacity
            activeOpacity={0.9}
            style={[styles.modalBtn, styles.modalBtnPrimary]}
            onPress={goToAccountSettings}
          >
            <Text style={styles.modalBtnPrimaryText}>
              Review Account Details
            </Text>
          </TouchableOpacity>
        </View>
      </>
    );
  };

  // 🔵 Banner fade logic
  const [bannerIndex, setBannerIndex] = useState(0);
  const fadeAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    let isMounted = true;

    const cycle = () => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }).start(() => {
        if (!isMounted) return;
        setBannerIndex((prev) => (prev + 1) % BANNERS.length);
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }).start();
      });
    };

    const interval = setInterval(cycle, 4000); // change every 4 seconds
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [fadeAnim]);

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.root}>
        <TopNav
          searchValue={search}
          onChangeSearch={setSearch}
          onPressBell={() => console.log("Bell")}
          onSelectMenu={(key) => console.log("Menu:", key)}
        />

        <ScrollView
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
        >
          {/* 🔵 Hero banner with fading images */}
          <View style={styles.hero}>
            <Animated.Image
              source={BANNERS[bannerIndex]}
              resizeMode="cover"
              style={{
                width: "100%",
                height: "100%",
                opacity: fadeAnim,
              }}
            />
          </View>

          <Text style={styles.welcome}>
            Welcome, Mr. <Text style={styles.blue}>{displayName}</Text>
          </Text>

          <Text style={styles.sectionTitle}>Work Application Post</Text>
          <View style={styles.card}>
            <View style={styles.cardCenter}>
              <View style={styles.iconCircle}>
                <ClipboardPenLine size={30} color={BLUE} />
              </View>

              <Text style={styles.centerText}>
                Start by posting your application to get hired for home service
                jobs.
              </Text>

              <TouchableOpacity
                style={styles.outlineBtn}
                activeOpacity={0.85}
                onPress={handleBecomeWorker}
              >
                <Text style={styles.outlineBtnText}>+ Become a worker</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.headerRow}>
            <Text style={styles.sectionTitle}>Available Service Requests</Text>
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => router.push("/workerpage/Browse/Browse")}
            >
              <Text style={styles.link}>Browse available requests →</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.card}>
            <View style={styles.cardCenter}>
              <View style={styles.iconCircle}>
                <UserCog size={30} color={BLUE} />
              </View>

              <Text style={styles.emptyTitle}>
                No Available Service Requests
              </Text>
              <Text style={styles.emptySub}>
                Start by checking back later for new service requests.
              </Text>
            </View>
          </View>

          <View style={{ height: 20 }} />
        </ScrollView>

        {/* ✅ BottomNav now navigates internally (no onChange prop) */}
        <BottomNav active={tab} />

        <Modal visible={eligibilityVisible} transparent animationType="fade">
          <View style={styles.modalBackdrop}>
            <View style={styles.modalCard}>{renderModalContent()}</View>
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#f5f6fa" },
  root: { flex: 1, backgroundColor: "#f5f6fa" },

  scroll: { paddingHorizontal: 18, paddingBottom: 16 },
  blue: { color: BLUE },

  hero: {
    marginTop: 12,
    height: 170,
    borderRadius: 14,
    overflow: "hidden",
    backgroundColor: "#d1d5db",
  },

  welcome: {
    marginTop: 16,
    fontSize: 22,
    fontWeight: "900",
    color: "#0f172a",
  },

  sectionTitle: {
    marginTop: 18,
    fontSize: 14,
    fontWeight: "900",
    color: "#0f172a",
  },

  headerRow: {
    marginTop: 18,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },

  link: { fontSize: 13, fontWeight: "800", color: BLUE },

  card: {
    marginTop: 12,
    borderRadius: 14,
    backgroundColor: "#ffffff",
    padding: 18,
    borderWidth: 1,
    borderColor: "#e5e9f2",
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  cardCenter: { alignItems: "center" },

  iconCircle: {
    width: 68,
    height: 68,
    borderRadius: 34,
    borderWidth: 1.5,
    borderColor: "#dbeafe",
    backgroundColor: "#eff6ff",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
  },

  centerText: {
    textAlign: "center",
    fontSize: 13.5,
    color: "#334155",
    fontWeight: "600",
    lineHeight: 20,
    marginBottom: 16,
    paddingHorizontal: 10,
  },

  outlineBtn: {
    minWidth: 190,
    height: 46,
    paddingHorizontal: 22,
    borderRadius: 999,
    borderWidth: 1.8,
    borderColor: BLUE,
    backgroundColor: "#ffffff",
    alignItems: "center",
    justifyContent: "center",
  },
  outlineBtnText: { color: BLUE, fontSize: 13.5, fontWeight: "900" },

  emptyTitle: {
    marginTop: 4,
    fontSize: 14,
    fontWeight: "900",
    color: "#0f172a",
    textAlign: "center",
  },
  emptySub: {
    marginTop: 6,
    fontSize: 13,
    fontWeight: "600",
    color: "#64748b",
    textAlign: "center",
    lineHeight: 19,
    paddingHorizontal: 10,
  },

  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(15,23,42,0.35)",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  modalCard: {
    borderRadius: 14,
    backgroundColor: "#ffffff",
    padding: 18,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: "#0f172a",
    marginBottom: 6,
  },
  modalBody: { fontSize: 13, color: "#4b5563", lineHeight: 19 },
  bold: { fontWeight: "800" },
  modalButtonRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    columnGap: 10,
    marginTop: 16,
  },
  modalBtn: {
    height: 40,
    borderRadius: 999,
    paddingHorizontal: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  modalBtnGhost: {
    borderWidth: 1,
    borderColor: "#e5e7eb",
    backgroundColor: "#ffffff",
  },
  modalBtnGhostText: { fontSize: 13, fontWeight: "700", color: "#4b5563" },
  modalBtnPrimary: { backgroundColor: BLUE },
  modalBtnPrimaryText: { fontSize: 13, fontWeight: "800", color: "#ffffff" },
});
