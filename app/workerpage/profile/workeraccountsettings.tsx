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
import { supabase } from "../../../supabase/supabase"; // ✅ adjust path if needed

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

const parseDobToDb = (mmDdYyyy: string) => {
  // "MM/DD/YYYY" -> "YYYY-MM-DD"
  if (!mmDdYyyy) return "";
  const m = mmDdYyyy.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (!m) return "";
  const [, mo, d, y] = m;
  return `${y}-${mo}-${d}`;
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

const formatDateToUiDob = (dt: Date) => {
  const mo = String(dt.getMonth() + 1).padStart(2, "0");
  const d = String(dt.getDate()).padStart(2, "0");
  const y = String(dt.getFullYear());
  return `${mo}/${d}/${y}`;
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

// turn any input into digits after +63 (10 digits preferred)
const toPHLocalDigits = (input: string) => {
  const digits = stripToDigits(input);
  if (!digits) return "";

  // +63 9XXXXXXXXX -> digits may start with 63...
  if (digits.startsWith("63") && digits.length >= 12)
    return digits.slice(2, 12);

  // 09XXXXXXXXX (11 digits) -> take last 10 after leading 0
  if (digits.startsWith("09") && digits.length >= 11)
    return digits.slice(1, 11);

  // 9XXXXXXXXX (10 digits)
  if (digits.startsWith("9") && digits.length >= 10) return digits.slice(0, 10);

  // fallback: last 10 digits if longer
  if (digits.length > 10) return digits.slice(digits.length - 10);

  // if shorter, keep (user still typing)
  return digits;
};

const normalizePHNumber = (local10Digits: string) => {
  const d = toPHLocalDigits(local10Digits);
  if (!d) return "";
  return `+63${d}`;
};

const displayPHNumber = (dbValue: string) => {
  const d = toPHLocalDigits(dbValue);
  if (!d) return "";
  return `+63 ${d}`;
};

export default function WorkerAccountSettingsScreen() {
  const router = useRouter();

  const [tab, setTab] = useState<"info" | "password">("info");

  const [loading, setLoading] = useState(true);
  const [savingInfo, setSavingInfo] = useState(false);
  const [savingPass, setSavingPass] = useState(false);

  const [role, setRole] = useState<Role>(null);
  const [profile, setProfile] = useState<ProfileRow | null>(null);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");

  const [age, setAge] = useState("");
  const [phone, setPhone] = useState(""); // displayed as "+63 XXXXXXXXXX"
  const [dob, setDob] = useState(""); // UI: MM/DD/YYYY

  const [oldPass, setOldPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");

  const [phoneModalOpen, setPhoneModalOpen] = useState(false);
  const [dobModalOpen, setDobModalOpen] = useState(false);

  const [tempPhoneDigits, setTempPhoneDigits] = useState("");
  const [tempDobDate, setTempDobDate] = useState<Date>(new Date(2000, 0, 1));

  // ✅ Android picker dialog toggle
  const [showAndroidDobPicker, setShowAndroidDobPicker] = useState(false);

  const initials = useMemo(() => {
    const a = (firstName?.trim()?.[0] || "U").toUpperCase();
    const b = (lastName?.trim()?.[0] || "").toUpperCase();
    return a + b || "U";
  }, [firstName, lastName]);

  const createdText = useMemo(
    () => fmtCreated(profile?.created_at ?? null),
    [profile],
  );

  // ✅ Auto compute age whenever dob changes
  useEffect(() => {
    const a = calcAgeFromDobString(dob.trim());
    setAge(a == null ? "" : String(a));
  }, [dob]);

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      try {
        setLoading(true);

        const {
          data: { user },
          error: userErr,
        } = await supabase.auth.getUser();

        if (userErr) throw userErr;
        if (!user) {
          Alert.alert("Not signed in", "Please log in again.");
          router.replace("/login/login");
          return;
        }

        const authUid = user.id;

        // 1) worker
        const workerRes = await supabase
          .from("user_worker")
          .select(
            "id, auth_uid, first_name, last_name, email_address, contact_number, date_of_birth, age, created_at",
          )
          .eq("auth_uid", authUid)
          .maybeSingle();

        if (workerRes.error) throw workerRes.error;

        if (workerRes.data) {
          if (!mounted) return;
          const p = workerRes.data as ProfileRow;
          setRole("worker");
          setProfile(p);

          setFirstName(safeStr(p.first_name));
          setLastName(safeStr(p.last_name));
          setEmail(safeStr(p.email_address));

          setPhone(displayPHNumber(safeStr(p.contact_number)));
          setDob(formatDobForUi(safeStr(p.date_of_birth)));

          if (!safeStr(p.date_of_birth) && p.age != null) setAge(String(p.age));
          return;
        }

        // 2) client
        const clientRes = await supabase
          .from("user_client")
          .select(
            "id, auth_uid, first_name, last_name, email_address, contact_number, date_of_birth, age, created_at",
          )
          .eq("auth_uid", authUid)
          .maybeSingle();

        if (clientRes.error) throw clientRes.error;

        if (clientRes.data) {
          if (!mounted) return;
          const p = clientRes.data as ProfileRow;
          setRole("client");
          setProfile(p);

          setFirstName(safeStr(p.first_name));
          setLastName(safeStr(p.last_name));
          setEmail(safeStr(p.email_address));

          setPhone(displayPHNumber(safeStr(p.contact_number)));
          setDob(formatDobForUi(safeStr(p.date_of_birth)));

          if (!safeStr(p.date_of_birth) && p.age != null) setAge(String(p.age));
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

  const openPhoneModal = () => {
    setTempPhoneDigits(toPHLocalDigits(phone));
    setPhoneModalOpen(true);
  };

  const openDobModal = () => {
    const parsed = parseUiDobToDate(dob);
    setTempDobDate(parsed ?? new Date(2000, 0, 1));
    setShowAndroidDobPicker(false);
    setDobModalOpen(true);

    // ✅ optional: auto-open the Android picker as soon as modal opens
    if (Platform.OS === "android") {
      setTimeout(() => setShowAndroidDobPicker(true), 150);
    }
  };

  const confirmPhone = () => {
    const normalized = normalizePHNumber(tempPhoneDigits);
    setPhone(normalized ? `+63 ${toPHLocalDigits(normalized)}` : "");
    setPhoneModalOpen(false);
  };

  const confirmDob = () => {
    setDob(formatDateToUiDob(tempDobDate));
    setDobModalOpen(false);
    setShowAndroidDobPicker(false);
  };

  const handleSaveInfo = async () => {
    if (!profile || !role || savingInfo) return;

    const dobDb = dob.trim() ? parseDobToDb(dob.trim()) : "";
    if (dob.trim() && !dobDb) {
      Alert.alert("Invalid Birthday", "Birthday must be selected properly.");
      return;
    }

    let ageDb: number | null = null;
    if (dobDb) {
      const computed = calcAgeFromDobString(dobDb);
      if (computed == null) {
        Alert.alert(
          "Invalid Birthday",
          "Could not compute age from your birthday.",
        );
        return;
      }
      ageDb = computed;
    }

    const phoneDb = phone.trim() ? normalizePHNumber(phone) : "";

    try {
      setSavingInfo(true);
      const table = role === "worker" ? "user_worker" : "user_client";

      // ✅ Names removed from payload so they can’t be updated
      const payload: any = {
        contact_number: phoneDb || null,
        date_of_birth: dobDb || null,
        age: ageDb,
      };

      const { error } = await supabase
        .from(table)
        .update(payload)
        .eq("id", profile.id);
      if (error) throw error;

      Alert.alert("Saved", "Your information was updated.");

      setProfile((p) =>
        p
          ? {
              ...p,
              contact_number: payload.contact_number,
              date_of_birth: payload.date_of_birth,
              age: payload.age,
            }
          : p,
      );

      setPhone(
        payload.contact_number ? displayPHNumber(payload.contact_number) : "",
      );
      setDob(
        payload.date_of_birth ? formatDobForUi(payload.date_of_birth) : "",
      );
      setAge(payload.age != null ? String(payload.age) : "");
    } catch (e: any) {
      Alert.alert("Save failed", e?.message ?? "Something went wrong.");
    } finally {
      setSavingInfo(false);
    }
  };

  const handleSavePassword = async () => {
    if (savingPass) return;

    if (!newPass.trim() || !confirmPass.trim()) {
      Alert.alert(
        "Missing password",
        "Please enter and confirm your new password.",
      );
      return;
    }
    if (newPass !== confirmPass) {
      Alert.alert(
        "Password mismatch",
        "New password and confirm password do not match.",
      );
      return;
    }
    if (newPass.trim().length < 8) {
      Alert.alert("Weak password", "Use at least 8 characters.");
      return;
    }

    try {
      setSavingPass(true);
      const { error } = await supabase.auth.updateUser({
        password: newPass.trim(),
      });
      if (error) throw error;

      Alert.alert("Password updated", "Your password has been changed.");
      setOldPass("");
      setNewPass("");
      setConfirmPass("");
    } catch (e: any) {
      Alert.alert("Update failed", e?.message ?? "Could not update password.");
    } finally {
      setSavingPass(false);
    }
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
    } catch {}
    router.replace("/login/login");
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

        {/* Tabs */}
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
            <Text
              style={[styles.tabText, tab === "info" && styles.tabTextActive]}
            >
              My Information
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.9}
            style={[styles.tabBtn, tab === "password" && styles.tabBtnActive]}
            onPress={() => setTab("password")}
          >
            <Text
              style={[
                styles.tabText,
                tab === "password" && styles.tabTextActive,
              ]}
            >
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
            <Text style={styles.pageSub}>Manage your personal details</Text>
            {!!createdText && (
              <Text style={styles.createdText}>{createdText}</Text>
            )}
          </View>

          {loading ? (
            <View style={{ paddingTop: 20, alignItems: "center", gap: 10 }}>
              <ActivityIndicator />
              <Text
                style={{ fontSize: 12.5, color: "#000", fontWeight: "700" }}
              >
                Loading...
              </Text>
            </View>
          ) : tab === "info" ? (
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Personal Information</Text>

              <View style={styles.avatarRow}>
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>{initials}</Text>
                </View>
                <View style={styles.avatarInfo}>
                  <Text style={styles.avatarLabel}>
                    {role ? role.toUpperCase() : "PROFILE"}
                  </Text>
                  <Text style={styles.avatarEmail}>{email}</Text>
                </View>
              </View>

              <View style={styles.row2}>
                <View style={styles.field}>
                  <Text style={styles.label}>First Name</Text>
                  {/* ✅ UNEDITABLE */}
                  <TextInput
                    value={firstName}
                    editable={false}
                    style={[styles.input, { backgroundColor: "#f9fafb" }]}
                    placeholder="First name"
                    placeholderTextColor="#9ca3af"
                  />
                </View>

                <View style={styles.field}>
                  <Text style={styles.label}>Last Name</Text>
                  {/* ✅ UNEDITABLE */}
                  <TextInput
                    value={lastName}
                    editable={false}
                    style={[styles.input, { backgroundColor: "#f9fafb" }]}
                    placeholder="Last name"
                    placeholderTextColor="#9ca3af"
                  />
                </View>
              </View>

              <View style={styles.row2}>
                <View style={styles.field}>
                  <Text style={styles.label}>Email</Text>
                  <TextInput
                    value={email}
                    editable={false}
                    style={[styles.input, { backgroundColor: "#f9fafb" }]}
                    placeholderTextColor="#9ca3af"
                  />
                </View>
                <View style={styles.fieldSmall}>
                  <Text style={styles.label}>Age</Text>
                  <TextInput
                    value={age}
                    editable={false}
                    style={[styles.input, { backgroundColor: "#f9fafb" }]}
                    placeholder="Age"
                    placeholderTextColor="#9ca3af"
                  />
                </View>
              </View>

              <View style={styles.infoRow}>
                <View style={styles.infoLeft}>
                  <Text style={styles.infoLabel}>Mobile Number</Text>
                  <Text style={styles.infoValue}>{phone || "—"}</Text>
                </View>
                <TouchableOpacity
                  activeOpacity={0.85}
                  onPress={openPhoneModal}
                  style={styles.infoEditBtn}
                >
                  <Text style={styles.infoEditText}>
                    {phone ? "Edit" : "Add"}
                  </Text>
                </TouchableOpacity>
              </View>

              <View style={styles.infoRow}>
                <View style={styles.infoLeft}>
                  <Text style={styles.infoLabel}>Birthday</Text>
                  <Text style={styles.infoValue}>{dob || "—"}</Text>
                </View>
                <TouchableOpacity
                  activeOpacity={0.85}
                  onPress={openDobModal}
                  style={styles.infoEditBtn}
                >
                  <Text style={styles.infoEditText}>
                    {dob ? "Edit" : "Add"}
                  </Text>
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                activeOpacity={0.9}
                style={styles.primaryBtn}
                onPress={handleSaveInfo}
                disabled={savingInfo}
              >
                <Text style={styles.primaryBtnText}>
                  {savingInfo ? "Saving..." : "Confirm"}
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Change Password</Text>

              <View style={styles.fieldFull}>
                <Text style={styles.label}>Current Password</Text>
                <TextInput
                  value={oldPass}
                  onChangeText={setOldPass}
                  style={styles.input}
                  placeholder="Current password"
                  placeholderTextColor="#9ca3af"
                  secureTextEntry
                />
              </View>

              <View style={styles.fieldFull}>
                <Text style={styles.label}>New Password</Text>
                <TextInput
                  value={newPass}
                  onChangeText={setNewPass}
                  style={styles.input}
                  placeholder="New password"
                  placeholderTextColor="#9ca3af"
                  secureTextEntry
                />
              </View>

              <View style={styles.fieldFull}>
                <Text style={styles.label}>Confirm New Password</Text>
                <TextInput
                  value={confirmPass}
                  onChangeText={setConfirmPass}
                  style={styles.input}
                  placeholder="Confirm password"
                  placeholderTextColor="#9ca3af"
                  secureTextEntry
                />
              </View>

              <TouchableOpacity
                activeOpacity={0.9}
                style={styles.primaryBtn}
                onPress={handleSavePassword}
                disabled={savingPass}
              >
                <Text style={styles.primaryBtnText}>
                  {savingPass ? "Updating..." : "Update Password"}
                </Text>
              </TouchableOpacity>
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

        {/* PHONE MODAL */}
        <Modal visible={phoneModalOpen} transparent animationType="fade">
          <View style={styles.modalBackdrop}>
            <View style={styles.modalSheet}>
              <Text style={styles.modalTitle}>
                {phone ? "Edit" : "Add"} Mobile Number
              </Text>
              <Text style={styles.modalHint}>
                Enter your number (no need to type +63).
              </Text>

              <View style={styles.phoneInputRow}>
                <View style={styles.phonePrefix}>
                  <Text style={styles.phonePrefixText}>+63</Text>
                </View>
                <TextInput
                  value={tempPhoneDigits}
                  onChangeText={(v) => setTempPhoneDigits(toPHLocalDigits(v))}
                  style={[styles.input, styles.phoneDigitsInput]}
                  keyboardType="phone-pad"
                  placeholder="9123456789"
                  placeholderTextColor="#9ca3af"
                  maxLength={10}
                />
              </View>

              <Text style={styles.phoneHelper}>Example: 9123456789</Text>

              <View style={styles.modalBtnRow}>
                <TouchableOpacity
                  activeOpacity={0.85}
                  style={[styles.modalBtn, styles.modalBtnGhost]}
                  onPress={() => setPhoneModalOpen(false)}
                >
                  <Text style={styles.modalBtnGhostText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  activeOpacity={0.85}
                  style={[styles.modalBtn, styles.modalBtnPrimary]}
                  onPress={confirmPhone}
                >
                  <Text style={styles.modalBtnPrimaryText}>Save</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        {/* DOB MODAL */}
        <Modal visible={dobModalOpen} transparent animationType="fade">
          <View style={styles.modalBackdrop}>
            <View style={styles.modalSheet}>
              <Text style={styles.modalTitle}>
                {dob ? "Edit" : "Add"} Birthday
              </Text>
              <Text style={styles.modalHint}>Select your date of birth.</Text>

              {Platform.OS === "ios" ? (
                <View style={{ marginTop: 12 }}>
                  <DateTimePicker
                    value={tempDobDate}
                    mode="date"
                    display="spinner"
                    onChange={(event, selectedDate) => {
                      if (selectedDate) setTempDobDate(selectedDate);
                    }}
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
                    onPress={() => setShowAndroidDobPicker(true)}
                  >
                    <Text style={styles.modalBtnGhostText}>Pick date</Text>
                  </TouchableOpacity>

                  {showAndroidDobPicker && (
                    <DateTimePicker
                      value={tempDobDate}
                      mode="date"
                      display="default"
                      maximumDate={new Date()}
                      textColor="#000"
                      onChange={(event, selectedDate) => {
                        if (event.type === "dismissed") {
                          setShowAndroidDobPicker(false);
                          return;
                        }
                        if (selectedDate) setTempDobDate(selectedDate);
                        setShowAndroidDobPicker(false);
                      }}
                    />
                  )}
                </>
              )}

              <Text style={styles.dobPreview}>
                Selected:{" "}
                <Text style={{ fontWeight: "900", color: "#000" }}>
                  {formatDateToUiDob(tempDobDate)}
                </Text>
                {(() => {
                  const a = calcAgeFromDate(tempDobDate);
                  return a != null ? (
                    <Text>
                      {"  "}• Age:{" "}
                      <Text style={{ fontWeight: "900", color: "#000" }}>
                        {a}
                      </Text>
                    </Text>
                  ) : null;
                })()}
              </Text>

              <View style={styles.modalBtnRow}>
                <TouchableOpacity
                  activeOpacity={0.85}
                  style={[styles.modalBtn, styles.modalBtnGhost]}
                  onPress={() => {
                    setDobModalOpen(false);
                    setShowAndroidDobPicker(false);
                  }}
                >
                  <Text style={styles.modalBtnGhostText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  activeOpacity={0.85}
                  style={[styles.modalBtn, styles.modalBtnPrimary]}
                  onPress={confirmDob}
                >
                  <Text style={styles.modalBtnPrimaryText}>Save</Text>
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
  infoEditBtn: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#d1d5db",
    backgroundColor: "#f9fafb",
    marginLeft: 12,
  },
  infoEditText: { fontSize: 12, fontWeight: "700", color: "#000" },

  primaryBtn: {
    marginTop: 14,
    height: 50,
    borderRadius: 999,
    backgroundColor: BLUE,
    alignItems: "center",
    justifyContent: "center",
  },
  primaryBtnText: { fontSize: 15, fontWeight: "900", color: "#ffffff" },

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

  phoneInputRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginTop: 12,
  },
  phonePrefix: {
    height: 50,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#d1d5db",
    backgroundColor: "#f9fafb",
    alignItems: "center",
    justifyContent: "center",
  },
  phonePrefixText: { fontSize: 14, fontWeight: "900", color: "#000" },
  phoneDigitsInput: { flex: 1 },

  phoneHelper: {
    marginTop: 6,
    fontSize: 11.5,
    color: "#000",
    fontWeight: "700",
  },

  dobPreview: { marginTop: 10, fontSize: 12.5, color: "#000" },
});
