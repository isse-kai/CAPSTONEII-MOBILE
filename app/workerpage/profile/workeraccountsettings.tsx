// app/workerpage/accountsettings/WorkerAccountSettingsScreen.tsx
import DateTimePicker from "@react-native-community/datetimepicker";
import { useRouter } from "expo-router";
import { ChevronLeft, LogOut, Settings } from "lucide-react-native";
import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Modal,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { getUser as apiGetUser, logout as apiLogout } from "../../../api/authService";
import { getClientProfileByUserId } from "../../../api/clientService";
import { getWorkerProfileByUserId } from "../../../api/workerService";

const BLUE = "#1E88E5";
type Role = "worker" | "client" | null;

type ProfileRow = {
  id: number;
  auth_uid: string;
  first_name: string | null;
  last_name: string | null;
  email_address: string | null;
  contact_number: string | null;
  date_of_birth: string | null; // DB: YYYY-MM-DD recommended
  age?: number | null;
  created_at?: string | null;
};

const safeStr = (v: any) => (v ?? "").toString();

const formatDobForUi = (yyyyMmDd: string) => {
  // "YYYY-MM-DD" -> "MM/DD/YYYY"
  if (!yyyyMmDd) return "";
  const m = yyyyMmDd.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!m) return yyyyMmDd;
  const [, y, mo, d] = m;
  return `${mo}/${d}/${y}`;
};

const parseUiDobToDate = (mmDdYyyy: string) => {
  const m = (mmDdYyyy || "").match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (!m) return null;
  const mo = Number(m[1]);
  const d = Number(m[2]);
  const y = Number(m[3]);
  const dt = new Date(y, mo - 1, d);
  return Number.isNaN(dt.getTime()) ? null : dt;
};

const calcAgeFromDate = (birth: Date) => {
  if (!birth || Number.isNaN(birth.getTime())) return null;
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
  return age;
};

// Accept DB "YYYY-MM-DD" or UI "MM/DD/YYYY"
const calcAgeFromDobString = (dobStr: string) => {
  if (!dobStr) return null;
  const db = dobStr.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (db) {
    const y = Number(db[1]);
    const mo = Number(db[2]);
    const d = Number(db[3]);
    const dt = new Date(y, mo - 1, d);
    return calcAgeFromDate(dt);
  }
  const ui = parseUiDobToDate(dobStr);
  return ui ? calcAgeFromDate(ui) : null;
};

const fmtCreated = (createdAt?: string | null) => {
  if (!createdAt) return "";
  const dt = new Date(createdAt);
  if (Number.isNaN(dt.getTime())) return "";
  return `Account created • ${dt.toLocaleDateString()} at ${dt.toLocaleTimeString()}`;
};

// --- Phone helpers (PH) ---
const stripToDigits = (s: string) => (s || "").replace(/[^\d]/g, "");

const toPHLocalDigits = (input: string) => {
  const digits = stripToDigits(input);
  if (!digits) return "";

  if (digits.startsWith("63") && digits.length >= 12) return digits.slice(2, 12);
  if (digits.startsWith("09") && digits.length >= 11) return digits.slice(1, 11);
  if (digits.startsWith("9") && digits.length >= 10) return digits.slice(0, 10);
  if (digits.length > 10) return digits.slice(digits.length - 10);
  return digits;
};

const displayPHNumber = (dbValue: string) => {
  const d = toPHLocalDigits(dbValue);
  if (!d) return "";
  return `+63 ${d}`;
};

export default function WorkerAccountSettingsScreen() {
  const router = useRouter();

  const [tab, setTab] = useState<"info" | "password">("info"); // password tab kept, but read-only too

  const [loading, setLoading] = useState(true);

  const [role, setRole] = useState<Role>(null);
  const [profile, setProfile] = useState<ProfileRow | null>(null);

  const firstName = profile?.first_name ?? "";
  const lastName = profile?.last_name ?? "";
  const email = profile?.email_address ?? "";

  // display-only values (same spirit as workerpage.tsx)
  const phoneDisplay = useMemo(
    () => (profile?.contact_number ? displayPHNumber(String(profile.contact_number)) : ""),
    [profile?.contact_number],
  );

  const dobDisplay = useMemo(
    () => (profile?.date_of_birth ? formatDobForUi(String(profile.date_of_birth)) : ""),
    [profile?.date_of_birth],
  );

  const ageDisplay = useMemo(() => {
    if (profile?.date_of_birth) {
      const a = calcAgeFromDobString(String(profile.date_of_birth));
      return a == null ? "" : String(a);
    }
    if (profile?.age != null) return String(profile.age);
    return "";
  }, [profile?.date_of_birth, profile?.age]);

  const initials = useMemo(() => {
    const a = (firstName?.trim()?.[0] || "U").toUpperCase();
    const b = (lastName?.trim()?.[0] || "").toUpperCase();
    return a + b || "U";
  }, [firstName, lastName]);

  const createdText = useMemo(
    () => fmtCreated(profile?.created_at ?? null),
    [profile?.created_at],
  );

  // kept (not used anymore, but leaving harmless + no UI breaking)
  const [phoneModalOpen, setPhoneModalOpen] = useState(false);
  const [dobModalOpen, setDobModalOpen] = useState(false);
  const [showAndroidDobPicker, setShowAndroidDobPicker] = useState(false);

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      try {
        setLoading(true);

        const userRes = await apiGetUser();
        const user = userRes?.user || userRes?.data?.user || null;
        if (!user) {
          Alert.alert("Not signed in", "Please log in again.");
          router.replace("./login/login");
          return;
        }

        const authUid = user.id;

        // ✅ Prefer worker. If not found, fallback to client.
        const workerRes = await getWorkerProfileByUserId(authUid);
        const worker = workerRes?.data || workerRes || null;
        if (worker) {
          if (!mounted) return;
          setRole("worker");
          setProfile(worker as ProfileRow);
          return;
        }

        const clientRes = await getClientProfileByUserId(authUid);
        const client = clientRes?.data || clientRes || null;
        if (client) {
          if (!mounted) return;
          setRole("client");
          setProfile(client as ProfileRow);
          return;
        }

        Alert.alert("Profile not found", "No worker/client profile row found.");
      } catch (e: any) {
        Alert.alert("Error", e?.message ?? "Failed to load profile.");
      } finally {
        if (mounted) setLoading(false);
      }
    };

    load();
    return () => {
      mounted = false;
    };
  }, [router]);

  const handleLogout = async () => {
    try {
      await apiLogout();
    } catch {}
    router.replace("./login/login");
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.root}>
        {/* Top bar */}
        <View style={styles.topBar}>
          <TouchableOpacity
            onPress={() => router.back()}
            activeOpacity={0.85}
            style={styles.iconBtn}
          >
            <ChevronLeft size={24} color="#0f172a" />
          </TouchableOpacity>

          <Text style={styles.topTitle}>Account Settings</Text>
          <View style={{ width: 44 }} />
        </View>

        {/* Tabs (kept) */}
        <View style={styles.tabRow}>
          <TouchableOpacity
            activeOpacity={0.9}
            style={[styles.tabBtn, tab === "info" && styles.tabBtnActive]}
            onPress={() => setTab("info")}
          >
            <Settings
              size={20}
              color={tab === "info" ? BLUE : "#64748b"}
              strokeWidth={2.2}
            />
            <Text style={[styles.tabText, tab === "info" && styles.tabTextActive]}>
              My Information
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.9}
            style={[styles.tabBtn, tab === "password" && styles.tabBtnActive]}
            onPress={() => setTab("password")}
          >
            <Text style={[styles.tabText, tab === "password" && styles.tabTextActive]}>
              Password
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollInner}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.pageHeader}>
            <Text style={styles.pageTitle}>Profile</Text>
            <Text style={styles.pageSub}>Your account details (read-only)</Text>
            {!!createdText && <Text style={styles.createdText}>{createdText}</Text>}
          </View>

          {loading ? (
            <View style={{ paddingTop: 20, alignItems: "center", gap: 10 }}>
              <ActivityIndicator />
              <Text style={{ fontSize: 12.5, color: "#000", fontWeight: "700" }}>
                Loading...
              </Text>
            </View>
          ) : tab === "info" ? (
            <View style={styles.card}>
              <Text style={styles.cardTitle}>
                {role === "worker"
                  ? "Worker Information"
                  : role === "client"
                    ? "Client Information"
                    : "Personal Information"}
              </Text>

              <View style={styles.avatarRow}>
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>{initials}</Text>
                </View>
                <View style={styles.avatarInfo}>
                  <Text style={styles.avatarLabel}>
                    {role ? role.toUpperCase() : "PROFILE"}
                  </Text>
                  <Text style={styles.avatarEmail}>{email || "—"}</Text>
                </View>
              </View>

              <View style={styles.row2}>
                <View style={styles.field}>
                  <Text style={styles.label}>First Name</Text>
                  <TextInput
                    value={safeStr(firstName)}
                    editable={false}
                    style={[styles.input, { backgroundColor: "#f9fafb" }]}
                    placeholder="—"
                    placeholderTextColor="#9ca3af"
                  />
                </View>

                <View style={styles.field}>
                  <Text style={styles.label}>Last Name</Text>
                  <TextInput
                    value={safeStr(lastName)}
                    editable={false}
                    style={[styles.input, { backgroundColor: "#f9fafb" }]}
                    placeholder="—"
                    placeholderTextColor="#9ca3af"
                  />
                </View>
              </View>

              <View style={styles.row2}>
                <View style={styles.field}>
                  <Text style={styles.label}>Email</Text>
                  <TextInput
                    value={safeStr(email)}
                    editable={false}
                    style={[styles.input, { backgroundColor: "#f9fafb" }]}
                    placeholder="—"
                    placeholderTextColor="#9ca3af"
                  />
                </View>

                <View style={styles.fieldSmall}>
                  <Text style={styles.label}>Age</Text>
                  <TextInput
                    value={safeStr(ageDisplay)}
                    editable={false}
                    style={[styles.input, { backgroundColor: "#f9fafb" }]}
                    placeholder="—"
                    placeholderTextColor="#9ca3af"
                  />
                </View>
              </View>

              {/* ✅ display-only like workerpage.tsx */}
              <View style={styles.infoRow}>
                <View style={styles.infoLeft}>
                  <Text style={styles.infoLabel}>Mobile Number</Text>
                  <Text style={styles.infoValue}>{phoneDisplay || "—"}</Text>
                </View>
              </View>

              <View style={styles.infoRow}>
                <View style={styles.infoLeft}>
                  <Text style={styles.infoLabel}>Birthday</Text>
                  <Text style={styles.infoValue}>{dobDisplay || "—"}</Text>
                </View>
              </View>
            </View>
          ) : (
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Password</Text>
              <Text style={{ marginTop: 6, fontSize: 13, color: "#000", fontWeight: "700" }}>
                Password updates are disabled on this screen.
              </Text>
            </View>
          )}

          <TouchableOpacity
            activeOpacity={0.9}
            style={styles.logoutBtn}
            onPress={handleLogout}
          >
            <LogOut size={20} color="#b91c1c" />
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>

          <View style={{ height: 24 }} />
        </ScrollView>

        {/* (Optional) kept to avoid breaking imports; not used anymore */}
        <Modal visible={phoneModalOpen} transparent animationType="fade">
          <View style={styles.modalBackdrop}>
            <View style={styles.modalSheet}>
              <Text style={styles.modalTitle}>Mobile Number</Text>
              <Text style={styles.modalHint}>Read-only</Text>
              <View style={styles.modalBtnRow}>
                <TouchableOpacity
                  activeOpacity={0.85}
                  style={[styles.modalBtn, styles.modalBtnPrimary]}
                  onPress={() => setPhoneModalOpen(false)}
                >
                  <Text style={styles.modalBtnPrimaryText}>Close</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        <Modal visible={dobModalOpen} transparent animationType="fade">
          <View style={styles.modalBackdrop}>
            <View style={styles.modalSheet}>
              <Text style={styles.modalTitle}>Birthday</Text>
              <Text style={styles.modalHint}>Read-only</Text>

              {Platform.OS === "ios" ? (
                <View style={{ marginTop: 12 }}>
                  <DateTimePicker
                    value={new Date()}
                    mode="date"
                    display="spinner"
                    onChange={() => {}}
                    maximumDate={new Date()}
                    textColor="#000"
                  />
                </View>
              ) : (
                <>
                  <TouchableOpacity
                    activeOpacity={0.85}
                    style={[
                      styles.modalBtn,
                      styles.modalBtnGhost,
                      { marginTop: 12, alignSelf: "flex-start" },
                    ]}
                    onPress={() => setShowAndroidDobPicker(false)}
                  >
                    <Text style={styles.modalBtnGhostText}>Pick date</Text>
                  </TouchableOpacity>
                </>
              )}

              <View style={styles.modalBtnRow}>
                <TouchableOpacity
                  activeOpacity={0.85}
                  style={[styles.modalBtn, styles.modalBtnPrimary]}
                  onPress={() => {
                    setDobModalOpen(false);
                    setShowAndroidDobPicker(false);
                  }}
                >
                  <Text style={styles.modalBtnPrimaryText}>Close</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#f8fafc" },
  root: { flex: 1, backgroundColor: "#f8fafc" },

  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 18,
    paddingTop: 10,
    paddingBottom: 12,
  },
  iconBtn: {
    width: 44,
    height: 44,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    backgroundColor: "#ffffff",
    alignItems: "center",
    justifyContent: "center",
  },
  topTitle: { fontSize: 18, fontWeight: "800", color: "#0f172a" },

  tabRow: {
    flexDirection: "row",
    paddingHorizontal: 18,
    gap: 10,
    marginBottom: 6,
  },
  tabBtn: {
    flex: 1,
    height: 46,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    backgroundColor: "#ffffff",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    columnGap: 8,
  },
  tabBtnActive: { borderColor: BLUE, backgroundColor: "#e5f0ff" },
  tabText: { fontSize: 13.5, fontWeight: "700", color: "#64748b" },
  tabTextActive: { color: BLUE },

  scroll: { flex: 1 },
  scrollInner: { paddingHorizontal: 18, paddingBottom: 16 },

  pageHeader: { marginTop: 8, marginBottom: 10 },
  pageTitle: { fontSize: 18, fontWeight: "900", color: "#0f172a" },
  pageSub: { marginTop: 3, fontSize: 13, color: "#000" },
  createdText: { marginTop: 4, fontSize: 11.5, color: "#000" },

  card: {
    marginTop: 12,
    borderRadius: 12,
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    padding: 16,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: "#000",
    marginBottom: 12,
  },

  avatarRow: {
    flexDirection: "row",
    alignItems: "center",
    columnGap: 14,
    marginBottom: 16,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 16,
    backgroundColor: "#e5f0ff",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: { fontSize: 26, fontWeight: "800", color: BLUE },
  avatarInfo: { flex: 1 },
  avatarLabel: {
    fontSize: 11.5,
    fontWeight: "700",
    color: "#000",
    textTransform: "uppercase",
    letterSpacing: 0.6,
  },
  avatarEmail: {
    marginTop: 4,
    fontSize: 14,
    fontWeight: "700",
    color: "#000",
  },

  row2: { flexDirection: "row", columnGap: 12, marginBottom: 10 },
  field: { flex: 1 },
  fieldSmall: { width: 90 },
  fieldFull: { marginBottom: 10 },

  label: { fontSize: 12, fontWeight: "800", color: "#000", marginBottom: 4 },
  input: {
    height: 50,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#d1d5db",
    backgroundColor: "#ffffff",
    paddingHorizontal: 12,
    fontSize: 14,
    color: "#000",
  },

  infoRow: {
    marginTop: 8,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  infoLeft: { flex: 1 },
  infoLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: "#000",
    marginBottom: 2,
  },
  infoValue: { fontSize: 14, fontWeight: "700", color: "#000" },

  logoutBtn: {
    marginTop: 18,
    height: 50,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#fecaca",
    backgroundColor: "#fef2f2",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    columnGap: 8,
  },
  logoutText: { fontSize: 15, fontWeight: "900", color: "#b91c1c" },

  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(15,23,42,0.35)",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  modalSheet: {
    borderRadius: 14,
    backgroundColor: "#ffffff",
    padding: 16,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  modalTitle: { fontSize: 16, fontWeight: "800", color: "#000" },
  modalHint: { marginTop: 4, fontSize: 12.5, color: "#000" },

  modalBtnRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    columnGap: 10,
    marginTop: 16,
  },
  modalBtn: {
    height: 40,
    borderRadius: 999,
    paddingHorizontal: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  modalBtnGhost: {
    borderWidth: 1,
    borderColor: "#e5e7eb",
    backgroundColor: "#ffffff",
  },
  modalBtnGhostText: { fontSize: 13, fontWeight: "700", color: "#000" },
  modalBtnPrimary: { backgroundColor: BLUE },
  modalBtnPrimaryText: { fontSize: 13, fontWeight: "800", color: "#ffffff" },
});
