// app/clientpage/clientpage.tsx
import { useRouter } from "expo-router";
import { ClipboardPenLine, UserCog, X } from "lucide-react-native";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  Modal,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { getUser as apiGetUser } from "../../api/authService";
import { getClientProfileByAuthUid } from "../../api/clientService";

import {
  getVerifiedWorkerById,
  listVerifiedWorkers,
  type VerifiedWorkerRow,
} from "../../api/clientWorkerService";

import Bottomnav, { ClientTabKey } from "./nav/bottomnav/Bottomnav";
import Topnav, { ClientMenuKey } from "./nav/topnav/Topnav";

const BLUE = "#1E88E5";
type EligibilityState = "missing" | null;

const SERVICE_LABELS: Record<string, string> = {
  carpenter: "Carpenter",

  carwasher: "Carwasher",
  car_washer: "Carwasher",
  carwash: "Carwasher",
  car_wash: "Carwasher",

  plumber: "Plumber",
  plumbing: "Plumber",

  electrician: "Electrician",
  electrical: "Electrician",

  laundry: "Laundry",
};

function titleCaseFromSlug(s: string) {
  return (s || "")
    .replace(/[_-]+/g, " ")
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((w) => w[0]?.toUpperCase() + w.slice(1).toLowerCase())
    .join(" ");
}

function normalizeServiceTags(service: any): string[] {
  if (!service) return [];

  let raw: any = service;

  if (typeof raw === "string") {
    const s = raw.trim();
    if (!s) return [];

    if (
      (s.startsWith("[") && s.endsWith("]")) ||
      (s.startsWith("{") && s.endsWith("}"))
    ) {
      try {
        raw = JSON.parse(s);
      } catch {
        raw = s;
      }
    } else {
      raw = s;
    }
  }

  let arr: any[] = [];
  if (Array.isArray(raw)) arr = raw;
  else if (raw && typeof raw === "object") {
    if (Array.isArray((raw as any).service)) arr = (raw as any).service;
    else arr = [raw];
  } else {
    arr = [raw];
  }

  const tokens = arr
    .map((item) => {
      if (typeof item === "string") return item;
      if (item && typeof item === "object") {
        return (
          item.value ??
          item.key ??
          item.name ??
          item.label ??
          item.title ??
          ""
        );
      }
      return "";
    })
    .map((x) => String(x).trim())
    .filter(Boolean);

  const labels = tokens.map((t) => {
    const key = t.toLowerCase().replace(/\s+/g, "_");
    return SERVICE_LABELS[key] ?? titleCaseFromSlug(t);
  });

  return Array.from(new Set(labels));
}

function getWorkerRowId(w: any): number {
  const v =
    w?.id ??
    w?.worker_id ??
    w?.worker_profile_id ??
    w?.user_information_workers_id ??
    null;

  const n = typeof v === "string" ? parseInt(v, 10) : v;
  return Number.isFinite(n) ? (n as number) : 0;
}

// ✅ just users (logged-in user info from auth)
type LoggedUser = {
  id?: string | number;
  email?: string;
  phone?: string;
  created_at?: string;
  last_sign_in_at?: string;
  user_metadata?: any;
};

export default function ClientPage() {
  const router = useRouter();
  const scrollRef = useRef<ScrollView | null>(null);

  const [search, setSearch] = useState("");
  const [tab, setTab] = useState<ClientTabKey>("home");

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const [userPhone, setUserPhone] = useState("");
  const [userDob, setUserDob] = useState("");

  // ✅ store current logged-in user (from auth only)
  const [authUser, setAuthUser] = useState<LoggedUser | null>(null);

  const [eligibilityVisible, setEligibilityVisible] = useState(false);
  const [eligibilityState, setEligibilityState] =
    useState<EligibilityState>(null);

  const [workersLoading, setWorkersLoading] = useState(true);
  const [workersError, setWorkersError] = useState<string | null>(null);
  const [workers, setWorkers] = useState<VerifiedWorkerRow[]>([]);

  const [detailOpen, setDetailOpen] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);
  const [selectedWorker, setSelectedWorker] = useState<VerifiedWorkerRow | null>(
    null,
  );

  const [refreshing, setRefreshing] = useState(false);

  const displayName = useMemo(() => {
    const fn = firstName.trim();
    const ln = lastName.trim();
    const full = `${fn} ${ln}`.trim();
    return full || "User";
  }, [firstName, lastName]);

  // ---------------------------
  // Load signed-in client
  // ---------------------------
  useEffect(() => {
    let mounted = true;

    const load = async () => {
      const userRes = await apiGetUser();
      const u = (userRes?.user || userRes?.data?.user || null) as any;

      if (!u) {
        router.replace("/login/login");
        return;
      }

      // ✅ keep auth user only (for display)
      if (mounted) {
        setAuthUser({
          id: u.id,
          email: u.email,
          phone: u.phone,
          created_at: u.created_at,
          last_sign_in_at: u.last_sign_in_at,
          user_metadata: u.user_metadata,
        });
      }

      // still keep your client profile lookup (for welcome + eligibility)
      const uid = u.id;
      const clientRes = await getClientProfileByAuthUid(uid);
      const clientRow = clientRes?.data || clientRes || null;

      if (!mounted) return;

      if (clientRow) {
        setFirstName(clientRow.first_name ?? "");
        setLastName(clientRow.last_name ?? "");
        setUserPhone(clientRow.contact_number ?? "");
        setUserDob(clientRow.date_of_birth ?? "");
        return;
      }

      const meta: any = u.user_metadata || {};
      setFirstName(meta.first_name ?? "");
      setLastName(meta.last_name ?? "");
    };

    load();
    return () => {
      mounted = false;
    };
  }, [router]);

  const loadWorkers = useCallback(
    async (opts?: { showSpinner?: boolean }) => {
      const showSpinner = opts?.showSpinner ?? true;

      try {
        if (showSpinner) setWorkersLoading(true);
        setWorkersError(null);

        const res = await listVerifiedWorkers({ q: search });
        const rows = (res?.data ?? res ?? []) as VerifiedWorkerRow[];

        setWorkers(Array.isArray(rows) ? rows : []);
      } catch (e: any) {
        setWorkersError(e?.message ?? "Failed to load workers.");
        setWorkers([]);
      } finally {
        if (showSpinner) setWorkersLoading(false);
      }
    },
    [search],
  );

  useEffect(() => {
    let mounted = true;
    const run = async () => {
      if (!mounted) return;
      await loadWorkers({ showSpinner: true });
    };
    run();
    return () => {
      mounted = false;
    };
  }, [loadWorkers]);

  const onRefresh = useCallback(async () => {
    try {
      setRefreshing(true);
      await loadWorkers({ showSpinner: false });
    } finally {
      setRefreshing(false);
    }
  }, [loadWorkers]);

  const handlePostServiceRequest = () => {
    const phoneTrimmed = userPhone.trim();
    const dobTrimmed = userDob.trim();

    if (!phoneTrimmed || !dobTrimmed) {
      setEligibilityState("missing");
      setEligibilityVisible(true);
      return;
    }

    router.push("/_sitemap");
  };

  const goToAccountSettings = () => {
    setEligibilityVisible(false);
    router.push("/_sitemap");
  };

  const renderEligibilityModalContent = () => {
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
            <Text style={styles.modalBtnPrimaryText}>Go to Account Settings</Text>
          </TouchableOpacity>
        </View>
      </>
    );
  };

  const handleMenu = (key: ClientMenuKey) => {
    if (key === "manageRequest") router.push("/_sitemap");
    if (key === "ongoingRequest") router.push("/_sitemap");
    if (key === "bookWorker") scrollRef.current?.scrollTo({ y: 520, animated: true });
    if (key === "messages") router.push("/_sitemap");
    if (key === "profile") router.push("/clientpage/profile/clientprofile");
  };

  const openWorkerDetail = async (workerRowId: number) => {
    if (!workerRowId || !Number.isFinite(workerRowId)) return;

    try {
      setDetailOpen(true);
      setDetailLoading(true);
      setSelectedWorker(null);

      const res = await getVerifiedWorkerById(workerRowId);
      const row = (res?.data ?? res ?? null) as VerifiedWorkerRow | null;

      setSelectedWorker(row);
    } catch (e: any) {
      setSelectedWorker(null);
      setWorkersError(e?.message ?? "Failed to load worker details.");
    } finally {
      setDetailLoading(false);
    }
  };

  // ✅ helpers to display auth user cleanly (users only)
  const authName = useMemo(() => {
    const meta = authUser?.user_metadata || {};
    const fn = String(meta?.first_name || meta?.firstName || "").trim();
    const ln = String(meta?.last_name || meta?.lastName || "").trim();
    const full = `${fn} ${ln}`.trim();
    return full || displayName || "User";
  }, [authUser, displayName]);

  const authEmail = authUser?.email ? String(authUser.email) : "—";
  const authId = authUser?.id != null ? String(authUser.id) : "—";

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.root}>
        <Topnav
          searchValue={search}
          onChangeSearch={setSearch}
          onPressBell={() => console.log("Bell")}
          onSelectMenu={handleMenu}
          placeholder="Search workers"
        />

        <ScrollView
          ref={(r) => (scrollRef.current = r)}
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          <View style={styles.hero}>
            <View style={styles.heroOverlay}>
              <Text style={styles.heroTitle}>Helping You Live Better,</Text>
              <Text style={styles.heroTitle}>One Task at a Time.</Text>
              <Text style={styles.heroSub}>
                Your go-to platform for{"\n"}home services and work
              </Text>
            </View>
          </View>

          <Text style={styles.welcome}>
            Welcome, Mr. <Text style={styles.blue}>{displayName}</Text>
          </Text>

          {/* ✅ REPLACED: "Start by posting..." -> Logged user details (users only) */}
          <Text style={styles.sectionTitle}>Your Account</Text>
          <View style={styles.card}>
            <View style={styles.cardCenter}>
              <View style={styles.iconCircle}>
                <ClipboardPenLine size={30} color={BLUE} />
              </View>

              <Text style={styles.userTitle}>{authName}</Text>

              <View style={{ width: "100%", marginTop: 10, gap: 8 }}>
                <View style={styles.userRow}>
                  <Text style={styles.userLabel}>User ID</Text>
                  <Text style={styles.userValue}>{authId}</Text>
                </View>
                <View style={styles.userRow}>
                  <Text style={styles.userLabel}>Email</Text>
                  <Text style={styles.userValue}>{authEmail}</Text>
                </View>
              </View>
            </View>
          </View>

          <View style={styles.headerRow}>
            <Text style={styles.sectionTitle}>Available Workers</Text>
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => scrollRef.current?.scrollToEnd({ animated: true })}
            >
              <Text style={styles.link}>Browse available workers →</Text>
            </TouchableOpacity>
          </View>

          {workersLoading ? (
            <View style={[styles.card, { alignItems: "center", gap: 10 }]}>
              <ActivityIndicator />
              <Text style={styles.loadingText}>Loading workers...</Text>
            </View>
          ) : workersError ? (
            <View style={styles.card}>
              <Text style={styles.emptyTitle}>Failed to load workers</Text>
              <Text style={styles.emptySub}>{workersError}</Text>

              <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => loadWorkers({ showSpinner: true })}
                style={[styles.modalBtn, styles.modalBtnPrimary, { marginTop: 14 }]}
              >
                <Text style={styles.modalBtnPrimaryText}>Retry</Text>
              </TouchableOpacity>
            </View>
          ) : workers.length === 0 ? (
            <View style={styles.card}>
              <View style={styles.cardCenter}>
                <View style={styles.iconCircle}>
                  <UserCog size={30} color={BLUE} />
                </View>

                <Text style={styles.emptyTitle}>No Verified Workers</Text>
                <Text style={styles.emptySub}>
                  Try a different search or check back later.
                </Text>
              </View>
            </View>
          ) : (
            <View style={{ marginTop: 10 }}>
              {workers.map((w) => {
                const name = `${w.first_name ?? ""} ${w.last_name ?? ""}`.trim();
                const tags = normalizeServiceTags((w as any).service);
                const workerRowId = getWorkerRowId(w);

                return (
                  <TouchableOpacity
                    key={String(workerRowId || name)}
                    activeOpacity={0.9}
                    onPress={() => openWorkerDetail(workerRowId)}
                    style={styles.workerCard}
                    disabled={!workerRowId}
                  >
                    <View style={styles.workerTop}>
                      <View style={styles.workerAvatar}>
                        <Text style={styles.workerAvatarText}>
                          {(w.first_name?.[0] || "W").toUpperCase()}
                          {(w.last_name?.[0] || "").toUpperCase()}
                        </Text>
                      </View>

                      <View style={{ flex: 1 }}>
                        <Text style={styles.workerName}>{name || "Worker"}</Text>

                        {!!tags.length && (
                          <View style={styles.tagRow}>
                            {tags.map((t, idx) => (
                              <View
                                key={`tag-${workerRowId}-${idx}`}
                                style={styles.tagChip}
                              >
                                <Text style={styles.tagText}>{t}</Text>
                              </View>
                            ))}
                          </View>
                        )}

                        {!!(w as any).barangay && (
                          <Text style={styles.workerMeta}>
                            {(w as any).barangay}
                            {(w as any).street ? `, ${(w as any).street}` : ""}
                          </Text>
                        )}
                      </View>

                      <View style={styles.verifiedBadge}>
                        <Text style={styles.verifiedBadgeText}>VERIFIED</Text>
                      </View>
                    </View>

                    {!!(w as any).service_description && (
                      <Text style={styles.workerDesc} numberOfLines={2}>
                        {(w as any).service_description}
                      </Text>
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          )}

          <View style={{ height: 14 }} />
        </ScrollView>

        <Bottomnav
          active={tab}
          onChange={(t) => {
            setTab(t);
            if (t === "home") router.push("/clientpage/clientpage");
            if (t === "browse") router.push("/_sitemap");
            if (t === "profile") router.push("/clientpage/profile/clientprofile");
          }}
        />

        <Modal visible={eligibilityVisible} transparent animationType="fade">
          <View style={styles.modalBackdrop}>
            <View style={styles.modalCard}>{renderEligibilityModalContent()}</View>
          </View>
        </Modal>

        <Modal visible={detailOpen} transparent animationType="fade">
          <View style={styles.modalBackdrop}>
            <View style={styles.detailCard}>
              <View style={styles.detailTopRow}>
                <Text style={styles.detailTitle}>Worker Details</Text>
                <TouchableOpacity
                  activeOpacity={0.85}
                  onPress={() => setDetailOpen(false)}
                  style={styles.closeBtn}
                >
                  <X size={18} color="#0f172a" />
                </TouchableOpacity>
              </View>

              {detailLoading ? (
                <View style={{ paddingVertical: 16, alignItems: "center", gap: 10 }}>
                  <ActivityIndicator />
                  <Text style={styles.loadingText}>Loading...</Text>
                </View>
              ) : !selectedWorker ? (
                <View style={{ paddingVertical: 10 }}>
                  <Text style={styles.emptyTitle}>No details</Text>
                  <Text style={styles.emptySub}>Could not load worker details.</Text>
                </View>
              ) : (
                <>
                  <Text style={styles.detailName}>
                    {`${selectedWorker.first_name ?? ""} ${selectedWorker.last_name ?? ""}`.trim() ||
                      "Worker"}
                  </Text>

                  {!!normalizeServiceTags((selectedWorker as any).service).length && (
                    <View style={[styles.tagRow, { marginTop: 10 }]}>
                      {normalizeServiceTags((selectedWorker as any).service).map(
                        (t, idx) => (
                          <View key={`detail-tag-${idx}`} style={styles.tagChip}>
                            <Text style={styles.tagText}>{t}</Text>
                          </View>
                        ),
                      )}
                    </View>
                  )}

                  {!!(selectedWorker as any).service_years && (
                    <Text style={styles.detailLine}>
                      Experience:{" "}
                      <Text style={styles.detailStrong}>
                        {(selectedWorker as any).service_years} years
                      </Text>
                    </Text>
                  )}

                  {!!(selectedWorker as any).contact_number && (
                    <Text style={styles.detailLine}>
                      Contact:{" "}
                      <Text style={styles.detailStrong}>
                        {(selectedWorker as any).contact_number}
                      </Text>
                    </Text>
                  )}

                  {!!(selectedWorker as any).barangay && (
                    <Text style={styles.detailLine}>
                      Address:{" "}
                      <Text style={styles.detailStrong}>
                        {(selectedWorker as any).barangay}
                        {(selectedWorker as any).street
                          ? `, ${(selectedWorker as any).street}`
                          : ""}
                      </Text>
                    </Text>
                  )}

                  {!!(selectedWorker as any).service_description && (
                    <Text style={[styles.detailLine, { marginTop: 8 }]}>
                      About:{" "}
                      <Text style={styles.detailStrong}>
                        {(selectedWorker as any).service_description}
                      </Text>
                    </Text>
                  )}
                </>
              )}

              <TouchableOpacity
                activeOpacity={0.9}
                style={[styles.modalBtn, styles.modalBtnGhost, { marginTop: 14 }]}
                onPress={() => setDetailOpen(false)}
              >
                <Text style={styles.modalBtnGhostText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#f5f6fa" },
  root: { flex: 1, backgroundColor: "#f5f6fa" },
  scroll: { paddingHorizontal: 18, paddingBottom: 12 },
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
  heroTitle: { color: "#fff", fontSize: 22, fontWeight: "900", lineHeight: 26 },
  heroSub: { marginTop: 8, color: "#e5edff", fontSize: 13, fontWeight: "600", lineHeight: 18 },

  welcome: { marginTop: 16, fontSize: 22, fontWeight: "900", color: "#0f172a" },
  sectionTitle: { marginTop: 18, fontSize: 14, fontWeight: "900", color: "#0f172a" },

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

  // ✅ user card text
  userTitle: { fontSize: 15, fontWeight: "900", color: "#0f172a" },
  userRow: { flexDirection: "row", justifyContent: "space-between" },
  userLabel: { fontSize: 12.5, fontWeight: "800", color: "#64748b" },
  userValue: { fontSize: 12.5, fontWeight: "900", color: "#0f172a" },

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
  outlineBtnText: { color: BLUE, fontSize: 13.5, fontWeight: "900" },

  emptyTitle: { marginTop: 4, fontSize: 14, fontWeight: "900", color: "#0f172a", textAlign: "center" },
  emptySub: { marginTop: 6, fontSize: 13, fontWeight: "600", color: "#64748b", textAlign: "center", lineHeight: 19, paddingHorizontal: 10 },

  loadingText: { fontSize: 12.5, color: "#64748b", fontWeight: "700" },

  workerCard: { borderRadius: 14, backgroundColor: "#ffffff", padding: 14, borderWidth: 1, borderColor: "#e5e9f2", marginTop: 10 },
  workerTop: { flexDirection: "row", alignItems: "flex-start", gap: 12 },
  workerAvatar: { width: 46, height: 46, borderRadius: 14, backgroundColor: "#e5f0ff", alignItems: "center", justifyContent: "center", marginTop: 1 },
  workerAvatarText: { fontSize: 14, fontWeight: "900", color: BLUE },
  workerName: { fontSize: 14.5, fontWeight: "900", color: "#0f172a" },
  workerMeta: { marginTop: 6, fontSize: 12, fontWeight: "700", color: "#64748b" },
  workerDesc: { marginTop: 10, fontSize: 12.5, fontWeight: "600", color: "#334155" },

  verifiedBadge: { paddingHorizontal: 10, height: 22, borderRadius: 999, borderWidth: 1, borderColor: "#bbf7d0", backgroundColor: "#ecfdf5", alignItems: "center", justifyContent: "center", marginTop: 2 },
  verifiedBadgeText: { fontSize: 11, fontWeight: "900", color: "#166534" },

  tagRow: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 8 },
  tagChip: { paddingHorizontal: 10, height: 26, borderRadius: 999, borderWidth: 1, borderColor: "#dbeafe", backgroundColor: "#eff6ff", alignItems: "center", justifyContent: "center" },
  tagText: { fontSize: 12, fontWeight: "800", color: BLUE },

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

  detailCard: { borderRadius: 14, backgroundColor: "#ffffff", padding: 16, borderWidth: 1, borderColor: "#e5e7eb" },
  detailTopRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 8 },
  detailTitle: { fontSize: 15, fontWeight: "900", color: "#0f172a" },
  closeBtn: { width: 36, height: 36, borderRadius: 10, borderWidth: 1, borderColor: "#e5e7eb", alignItems: "center", justifyContent: "center", backgroundColor: "#ffffff" },
  detailName: { marginTop: 6, fontSize: 16, fontWeight: "900", color: "#0f172a" },
  detailLine: { marginTop: 8, fontSize: 13, color: "#334155", fontWeight: "700" },
  detailStrong: { fontWeight: "900", color: "#0f172a" },
});
