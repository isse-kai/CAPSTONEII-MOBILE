// app/clientpage/clientpage.tsx
import { useRouter } from "expo-router";
import { ClipboardPenLine, UserCog } from "lucide-react-native";
import React, { useEffect, useMemo, useState } from "react";
import {
    Modal,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

import { supabase } from "../../supabase/supabase";

// ✅ Correct based on your directory screenshot:
import Bottomnav, { ClientTabKey } from "./nav/bottomnav/Bottomnav";
import Topnav, { ClientMenuKey } from "./nav/topnav/Topnav";

const BLUE = "#1E88E5";
type EligibilityState = "missing" | null;

export default function ClientPage() {
  const router = useRouter();

  const [search, setSearch] = useState("");
  const [tab, setTab] = useState<ClientTabKey>("home");

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const [userPhone, setUserPhone] = useState("");
  const [userDob, setUserDob] = useState("");

  const [eligibilityVisible, setEligibilityVisible] = useState(false);
  const [eligibilityState, setEligibilityState] =
    useState<EligibilityState>(null);

  const displayName = useMemo(() => {
    const fn = firstName.trim();
    const ln = lastName.trim();
    const full = `${fn} ${ln}`.trim();
    return full || "User";
  }, [firstName, lastName]);

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      const { data: authData, error: authErr } = await supabase.auth.getUser();
      if (authErr || !authData?.user) {
        router.replace("/login/login");
        return;
      }

      const uid = authData.user.id;

      const { data: clientRow, error: clientErr } = await supabase
        .from("user_client")
        .select("first_name,last_name,contact_number,date_of_birth")
        .eq("auth_uid", uid)
        .maybeSingle();

      if (!mounted) return;

      if (!clientErr && clientRow) {
        setFirstName(clientRow.first_name ?? "");
        setLastName(clientRow.last_name ?? "");
        setUserPhone(clientRow.contact_number ?? "");
        setUserDob(clientRow.date_of_birth ?? "");
        return;
      }

      const meta: any = authData.user.user_metadata || {};
      setFirstName(meta.first_name ?? "");
      setLastName(meta.last_name ?? "");
    };

    load();
    return () => {
      mounted = false;
    };
  }, [router]);

  const handlePostServiceRequest = () => {
    const phoneTrimmed = userPhone.trim();
    const dobTrimmed = userDob.trim();

    if (!phoneTrimmed || !dobTrimmed) {
      setEligibilityState("missing");
      setEligibilityVisible(true);
      return;
    }

    // ✅ change this to your service request screen
    router.push("/_sitemap");
  };

  const goToAccountSettings = () => {
    setEligibilityVisible(false);
    // ✅ change this to your client settings screen
    router.push("/_sitemap");
  };

  const renderModalContent = () => {
    if (!eligibilityState) return null;

    return (
      <>
        <Text style={styles.modalTitle}>Complete your details</Text>
        <Text style={styles.modalBody}>
          To post a service request, please provide both your{" "}
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
  };

  const handleMenu = (key: ClientMenuKey) => {
    // ✅ replace with real routes
    if (key === "manageRequest") router.push("/_sitemap");
    if (key === "ongoingRequest") router.push("/_sitemap");
    if (key === "bookWorker") router.push("/_sitemap");
    if (key === "messages") router.push("/_sitemap");
    if (key === "profile") router.push("./clientpage/profile/clientprofile");
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.root}>
        {/* TOP NAV */}
        <Topnav
          searchValue={search}
          onChangeSearch={setSearch}
          onPressBell={() => console.log("Bell")}
          onSelectMenu={handleMenu}
          placeholder="Search workers"
        />

        {/* BODY */}
        <ScrollView
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
        >
          {/* HERO */}
          <View style={styles.hero}>
            <View style={styles.heroOverlay}>
              <Text style={styles.heroTitle}>Helping You Live Better,</Text>
              <Text style={styles.heroTitle}>One Task at a Time.</Text>
              <Text style={styles.heroSub}>
                Your go-to platform for{"\n"}home services and work
              </Text>
            </View>
          </View>

          {/* WELCOME */}
          <Text style={styles.welcome}>
            Welcome, Mr. <Text style={styles.blue}>{displayName}</Text>
          </Text>

          {/* SERVICE REQUEST POST */}
          <Text style={styles.sectionTitle}>Service Request Post</Text>
          <View style={styles.card}>
            <View style={styles.cardCenter}>
              <View style={styles.iconCircle}>
                <ClipboardPenLine size={30} color={BLUE} />
              </View>

              <Text style={styles.centerText}>
                Start by posting a service request to find available workers.
              </Text>

              <TouchableOpacity
                style={styles.outlineBtn}
                activeOpacity={0.85}
                onPress={handlePostServiceRequest}
              >
                <Text style={styles.outlineBtnText}>
                  + Post a service request
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* AVAILABLE WORKERS */}
          <View style={styles.headerRow}>
            <Text style={styles.sectionTitle}>Available Workers</Text>
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => router.push("/_sitemap")}
            >
              <Text style={styles.link}>Browse available workers →</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.card}>
            <View style={styles.cardCenter}>
              <View style={styles.iconCircle}>
                <UserCog size={30} color={BLUE} />
              </View>

              <Text style={styles.emptyTitle}>No Available Workers</Text>
              <Text style={styles.emptySub}>
                Start by checking back later for available workers.
              </Text>
            </View>
          </View>

          <View style={{ height: 14 }} />
        </ScrollView>

        {/* BOTTOM NAV */}
        <Bottomnav
          active={tab}
          onChange={(t) => {
            setTab(t);

            // ✅ change routes to your real pages
            if (t === "home") router.push("./clientpage/clientpage");
            if (t === "browse") router.push("/_sitemap");
            if (t === "profile")
              router.push("./clientpage/profile/clientprofile");
          }}
        />

        {/* MODAL */}
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

  scroll: {
    paddingHorizontal: 18,
    paddingBottom: 12,
  },

  blue: { color: BLUE },

  hero: {
    marginTop: 12,
    height: 170,
    borderRadius: 14,
    overflow: "hidden",
    backgroundColor: "#d1d5db",
  },
  heroOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    padding: 16,
    backgroundColor: "rgba(0,0,0,0.32)",
  },
  heroTitle: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "900",
    lineHeight: 26,
  },
  heroSub: {
    marginTop: 8,
    color: "#e5edff",
    fontSize: 13,
    fontWeight: "600",
    lineHeight: 18,
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

  link: {
    fontSize: 13,
    fontWeight: "800",
    color: BLUE,
  },

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
    minWidth: 220,
    height: 46,
    paddingHorizontal: 22,
    borderRadius: 999,
    borderWidth: 1.8,
    borderColor: BLUE,
    backgroundColor: "#ffffff",
    alignItems: "center",
    justifyContent: "center",
  },
  outlineBtnText: {
    color: BLUE,
    fontSize: 13.5,
    fontWeight: "900",
  },

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
  modalBody: {
    fontSize: 13,
    color: "#4b5563",
    lineHeight: 19,
  },
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
  modalBtnGhostText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#4b5563",
  },
  modalBtnPrimary: { backgroundColor: BLUE },
  modalBtnPrimaryText: {
    fontSize: 13,
    fontWeight: "800",
    color: "#ffffff",
  },
});
