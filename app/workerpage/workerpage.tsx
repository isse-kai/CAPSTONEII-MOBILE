// app/workerpage/workerpage.tsx
import { useFocusEffect } from "@react-navigation/native";
import { useRouter } from "expo-router";
import { Briefcase, ClipboardPenLine, Eye, MapPin, UserCog } from "lucide-react-native";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Alert,
  Animated,
  Modal,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import BottomNav from "./nav/bottomnav/BottomNav";
import TopNav from "./nav/topnav/TopNav";

import {
  getWorkerHome,
  getWorkRequests,
  type WorkerHomeUser,
  type WorkRequest,
} from "../../api/worksService";

const BLUE = "#1E88E5";

const BANNERS = [
  require("../../image/Banner1.png"),
  require("../../image/Banner2.png"),
  require("../../image/Banner3.png"),
];

function calculateAgeAny(dobStr: string): number | null {
  if (!dobStr) return null;
  const raw = dobStr.trim();
  if (!raw) return null;

  const s = raw.includes("T") ? raw.slice(0, 10) : raw;

  let birthDate: Date | null = null;

  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) {
    const [y, m, d] = s.split("-").map(Number);
    birthDate = new Date(y, m - 1, d);
  }

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

const onlyDigits = (v: string) => (v || "").replace(/[^\d]/g, "");

function getPHLocal10(phone: string) {
  const d = onlyDigits(phone);
  if (!d) return "";
  if (d.startsWith("63") && d.length >= 12) return d.slice(2, 12);
  if (d.startsWith("09") && d.length >= 11) return d.slice(1, 11);
  if (d.startsWith("9") && d.length >= 10) return d.slice(0, 10);
  if (d.length > 10) return d.slice(d.length - 10);
  return d;
}

type EligibilityState = "missing" | "underage" | null;

function fmtLocationFromPoster(req: WorkRequest) {
  return req.posted_barangay || req.posted_street || "Unknown location";
}

export default function WorkerPage() {
  const router = useRouter();

  const [search, setSearch] = useState("");
  const [tab] = useState<"home" | "browse" | "profile">("home");

  const [me, setMe] = useState<WorkerHomeUser | null>(null);

  const [userPhone, setUserPhone] = useState<string>("");
  const [userDob, setUserDob] = useState<string>("");

  const [eligibilityVisible, setEligibilityVisible] = useState(false);
  const [eligibilityState, setEligibilityState] = useState<EligibilityState>(null);

  const [loadingHome, setLoadingHome] = useState(true);
  const [loadingRequests, setLoadingRequests] = useState(true);

  const [requests, setRequests] = useState<WorkRequest[]>([]);

  const displayName = useMemo(() => {
    const fn = (me?.first_name || "").trim();
    const ln = (me?.last_name || "").trim();
    const full = `${fn} ${ln}`.trim();
    return full || "User";
  }, [me?.first_name, me?.last_name]);

  const loadHome = useCallback(async () => {
    try {
      setLoadingHome(true);

      const homeRes = await getWorkerHome();
      const u = homeRes?.user;

      if (!u?.id) {
        router.replace("./login/login");
        return;
      }

      setMe(u);
      setUserPhone(u.phone_number ?? "");
      setUserDob(u.birthdate ?? "");
    } catch (e: any) {
      Alert.alert("Error", e?.message ?? "Failed to load user.");
      router.replace("./login/login");
    } finally {
      setLoadingHome(false);
    }
  }, [router]);

  const loadRequests = useCallback(async () => {
    try {
      setLoadingRequests(true);

      const res = await getWorkRequests({
        q: search.trim() || undefined,
      });

      setRequests(res?.jobs ?? []);
    } catch (e: any) {
      Alert.alert("Error", e?.message ?? "Failed to load work requests.");
      setRequests([]);
    } finally {
      setLoadingRequests(false);
    }
  }, [search]);

  useEffect(() => {
    loadHome();
    loadRequests();
  }, [loadHome, loadRequests]);

  useFocusEffect(
    useCallback(() => {
      loadHome();
      loadRequests();
    }, [loadHome, loadRequests])
  );

  const handleBecomeWorker = () => {
    const local10 = getPHLocal10(userPhone);
    const dobTrimmed = (userDob || "").trim();

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

    router.push("./workerforms/WorkerInfoStep1");
  };

  const goToAccountSettings = () => {
    setEligibilityVisible(false);
    router.push("./workerpage/profile/workeraccountsettings");
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
              <Text style={styles.modalBtnPrimaryText}>Go to Account Settings</Text>
            </TouchableOpacity>
          </View>
        </>
      );
    }

    return (
      <>
        <Text style={styles.modalTitle}>You must be 18 or older</Text>
        <Text style={styles.modalBody}>
          Based on your birthday, you are currently under 18. You need to be at least 18 years old to apply
          as a worker on JDK HOMECARE.
        </Text>

        <View style={styles.modalButtonRow}>
          <TouchableOpacity
            activeOpacity={0.9}
            style={[styles.modalBtn, styles.modalBtnPrimary]}
            onPress={goToAccountSettings}
          >
            <Text style={styles.modalBtnPrimaryText}>Review Account Details</Text>
          </TouchableOpacity>
        </View>
      </>
    );
  };

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

    const interval = setInterval(cycle, 4000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [fadeAnim]);

  const emptyRequestsCard = (
    <View style={styles.card}>
      <View style={styles.cardCenter}>
        <View style={styles.iconCircle}>
          <UserCog size={30} color={BLUE} />
        </View>

        <Text style={styles.emptyTitle}>No Available Service Requests</Text>
        <Text style={styles.emptySub}>Start by checking back later for new service requests.</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.root}>
        <TopNav
          searchValue={search}
          onChangeSearch={setSearch}
          onPressBell={() => console.log("Bell")}
          onSelectMenu={(key) => console.log("Menu:", key)}
        />

        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
          <View style={styles.hero}>
            <Animated.Image
              source={BANNERS[bannerIndex]}
              resizeMode="cover"
              style={{ width: "100%", height: "100%", opacity: fadeAnim }}
            />
          </View>

          <Text style={styles.welcome}>
            Welcome, <Text style={styles.blue}>{displayName}</Text>
            {loadingHome ? <Text style={{ color: "#94a3b8" }}> …</Text> : null}
          </Text>

          <Text style={styles.sectionTitle}>Work Application Post</Text>
          <View style={styles.card}>
            <View style={styles.cardCenter}>
              <View style={styles.iconCircle}>
                <ClipboardPenLine size={30} color={BLUE} />
              </View>

              <Text style={styles.centerText}>
                Signed in as{" "}
                <Text style={{ fontWeight: "900", color: "#0f172a" }}>{displayName}</Text>
                {"\n"}
                Role: <Text style={{ fontWeight: "900", color: "#0f172a" }}>{me?.role || "—"}</Text>
              </Text>

              <TouchableOpacity style={styles.outlineBtn} activeOpacity={0.85} onPress={handleBecomeWorker}>
                <Text style={styles.outlineBtnText}>+ Become a worker</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.headerRow}>
            <Text style={styles.sectionTitle}>Available Service Requests</Text>
            <TouchableOpacity activeOpacity={0.85} onPress={() => router.push("./workerpage/Browse/Browse")}>
              <Text style={styles.link}>Browse available requests →</Text>
            </TouchableOpacity>
          </View>

          {loadingRequests ? (
            <View style={styles.card}>
              <View style={styles.cardCenter}>
                <Text style={styles.emptyTitle}>Loading requests...</Text>
                <Text style={styles.emptySub}>Please wait.</Text>
              </View>
            </View>
          ) : requests.length === 0 ? (
            emptyRequestsCard
          ) : (
            <View style={styles.cardListWrap}>
              {requests.map((req) => {
                const id = String(req.id);

                const service = req.service || "Service";
                const title = req.title || req.service || "Service Request";

                const postedBy =
                  req.posted_name ||
                  `${req.posted_first_name ?? ""} ${req.posted_last_name ?? ""}`.trim() ||
                  "Unknown";

                const location = fmtLocationFromPoster(req);

                // ✅ IMPORTANT: fallback so it always displays
                const totalPrice = req.total_price_display ?? "—";

                const description = req.description || "";

                return (
                  <View key={id} style={styles.reqCard}>
                    <View style={styles.reqTopRow}>
                      <View style={styles.reqBadge}>
                        <Briefcase size={14} color={BLUE} />
                        <Text style={styles.reqBadgeText}>{service}</Text>
                      </View>

                      <View style={{ alignItems: "flex-end" }}>
                        <Text style={styles.reqPosted}>Posted by: {postedBy}</Text>
                        <Text style={styles.reqPosted}>Total: {totalPrice}</Text>
                      </View>
                    </View>

                    <Text style={styles.reqTitle}>{title}</Text>

                    <View style={styles.reqMetaRow}>
                      <MapPin size={16} color="#64748b" />
                      <Text style={styles.reqMetaText}>{location}</Text>
                    </View>

                    <Text style={styles.reqDesc} numberOfLines={2}>
                      {description}
                    </Text>

                    <View style={styles.reqBtnRow}>
                      <TouchableOpacity
                        activeOpacity={0.9}
                        style={styles.reqViewBtn}
                        onPress={() =>
                          router.push({
                            pathname: "/workerpage/Browse/ViewDetails",
                            params: { requestId: id },
                          })
                        }
                      >
                        <Eye size={16} color={BLUE} />
                        <Text style={styles.reqViewBtnText}>View</Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        activeOpacity={0.9}
                        style={styles.reqApplyBtn}
                        onPress={() =>
                          router.push({
                            pathname: "/workerpage/Browse/Apply",
                            params: { requestId: id },
                          })
                        }
                      >
                        <Text style={styles.reqApplyBtnText}>Apply Now</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                );
              })}
            </View>
          )}

          <View style={{ height: 20 }} />
        </ScrollView>

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

  hero: { marginTop: 12, height: 170, borderRadius: 14, overflow: "hidden", backgroundColor: "#d1d5db" },

  welcome: { marginTop: 16, fontSize: 22, fontWeight: "900", color: "#0f172a" },

  sectionTitle: { marginTop: 18, fontSize: 14, fontWeight: "900", color: "#0f172a" },

  headerRow: { marginTop: 18, flexDirection: "row", justifyContent: "space-between", alignItems: "flex-end" },

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

  emptyTitle: { marginTop: 4, fontSize: 14, fontWeight: "900", color: "#0f172a", textAlign: "center" },
  emptySub: {
    marginTop: 6,
    fontSize: 13,
    fontWeight: "600",
    color: "#64748b",
    textAlign: "center",
    lineHeight: 19,
    paddingHorizontal: 10,
  },

  cardListWrap: { marginTop: 12, gap: 12 },

  reqCard: {
    borderRadius: 16,
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#e5e9f2",
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },

  reqTopRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 },

  reqBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 12,
    height: 30,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#dbeafe",
    backgroundColor: "#eff6ff",
  },
  reqBadgeText: { fontSize: 12.5, fontWeight: "900", color: BLUE },

  reqPosted: { fontSize: 12, fontWeight: "800", color: "#94a3b8" },

  reqTitle: { fontSize: 15.5, fontWeight: "900", color: "#0f172a" },

  reqMetaRow: { marginTop: 8, flexDirection: "row", alignItems: "center", gap: 6, flexWrap: "wrap" },
  reqMetaText: { fontSize: 12.5, fontWeight: "800", color: "#475569" },

  reqDesc: { marginTop: 8, fontSize: 12.8, color: "#64748b", fontWeight: "700", lineHeight: 18 },

  reqBtnRow: { marginTop: 12, flexDirection: "row", gap: 10 },

  reqViewBtn: {
    flex: 1,
    height: 46,
    borderRadius: 999,
    borderWidth: 1.6,
    borderColor: BLUE,
    backgroundColor: "#ffffff",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8,
  },
  reqViewBtnText: { fontSize: 13.5, fontWeight: "900", color: BLUE },

  reqApplyBtn: { flex: 1, height: 46, borderRadius: 999, backgroundColor: BLUE, alignItems: "center", justifyContent: "center" },
  reqApplyBtnText: { fontSize: 13.5, fontWeight: "900", color: "#ffffff" },

  modalBackdrop: { flex: 1, backgroundColor: "rgba(15,23,42,0.35)", justifyContent: "center", paddingHorizontal: 24 },
  modalCard: { borderRadius: 14, backgroundColor: "#ffffff", padding: 18, borderWidth: 1, borderColor: "#e5e7eb" },
  modalTitle: { fontSize: 16, fontWeight: "800", color: "#0f172a", marginBottom: 6 },
  modalBody: { fontSize: 13, color: "#4b5563", lineHeight: 19 },
  bold: { fontWeight: "800" },
  modalButtonRow: { flexDirection: "row", justifyContent: "flex-end", columnGap: 10, marginTop: 16 },
  modalBtn: { height: 40, borderRadius: 999, paddingHorizontal: 14, alignItems: "center", justifyContent: "center" },
  modalBtnGhost: { borderWidth: 1, borderColor: "#e5e7eb", backgroundColor: "#ffffff" },
  modalBtnGhostText: { fontSize: 13, fontWeight: "700", color: "#4b5563" },
  modalBtnPrimary: { backgroundColor: BLUE },
  modalBtnPrimaryText: { fontSize: 13, fontWeight: "800", color: "#ffffff" },
});
