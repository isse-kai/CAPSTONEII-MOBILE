// app/clientpage/profile/clientaccountsettings.tsx
import { useRouter } from "expo-router";
import { ArrowLeft, KeyRound, LogOut, Settings } from "lucide-react-native";
import React, { useEffect, useMemo, useState } from "react";
import {
  Alert,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { supabase } from "../../../supabase/supabase";

const BLUE = "#1E88E5";

type TabKey = "info" | "password";

function initials(first: string, last: string) {
  const a = (first || "").trim().slice(0, 1).toUpperCase();
  const b = (last || "").trim().slice(0, 1).toUpperCase();
  return (a + b).trim() || "U";
}

function calcAgeAny(dobStr: string): number | null {
  if (!dobStr) return null;
  const s = dobStr.trim();
  let birthDate: Date | null = null;

  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) {
    const [y, m, d] = s.split("-").map(Number);
    birthDate = new Date(y, m - 1, d);
  } else if (/^\d{2}\/\d{2}\/\d{4}$/.test(s)) {
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

function formatCreatedAt(createdAt?: string) {
  if (!createdAt) return "—";
  const d = new Date(createdAt);
  if (isNaN(d.getTime())) return "—";
  return `${d.toLocaleDateString()} at ${d.toLocaleTimeString()}`;
}

function formatDobDisplay(dobStr: string) {
  const s = (dobStr || "").trim();
  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) {
    const [y, m, d] = s.split("-");
    return `${m}/${d}/${y}`;
  }
  return s || "—";
}

export default function ClientAccountSettings() {
  const router = useRouter();

  const [tab, setTab] = useState<TabKey>("info");
  const [loading, setLoading] = useState(true);

  const [authEmail, setAuthEmail] = useState("");
  const [createdAt, setCreatedAt] = useState<string>("");

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [dob, setDob] = useState("");

  const [editPhone, setEditPhone] = useState(false);
  const [editDob, setEditDob] = useState(false);

  // password form
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const age = useMemo(() => calcAgeAny(dob), [dob]);
  const avatar = useMemo(
    () => initials(firstName, lastName),
    [firstName, lastName],
  );

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      setLoading(true);

      const { data: authData, error: authErr } = await supabase.auth.getUser();
      if (authErr || !authData?.user) {
        router.replace("/login/login");
        return;
      }

      const u = authData.user;
      const uid = u.id;

      if (!mounted) return;

      setAuthEmail(u.email ?? "");
      setCreatedAt(u.created_at ?? "");

      const { data: row, error } = await supabase
        .from("user_client")
        .select("first_name,last_name,contact_number,date_of_birth")
        .eq("auth_uid", uid)
        .maybeSingle();

      if (!mounted) return;

      if (!error && row) {
        setFirstName(row.first_name ?? "");
        setLastName(row.last_name ?? "");
        setPhone(row.contact_number ?? "");
        setDob(row.date_of_birth ?? "");
      } else {
        const meta: any = u.user_metadata || {};
        setFirstName(meta.first_name ?? "");
        setLastName(meta.last_name ?? "");
      }

      setLoading(false);
    };

    load();

    return () => {
      mounted = false;
    };
  }, [router]);

  const onConfirmInfo = async () => {
    const { data: authData, error: authErr } = await supabase.auth.getUser();
    if (authErr || !authData?.user) return;

    const uid = authData.user.id;

    // ✅ Names removed from payload so they can't be updated
    const payload = {
      contact_number: phone.trim(),
      date_of_birth: dob.trim(),
    };

    const { error } = await supabase
      .from("user_client")
      .update(payload)
      .eq("auth_uid", uid);

    if (error) {
      Alert.alert("Update failed", error.message);
      return;
    }

    setEditPhone(false);
    setEditDob(false);
    Alert.alert("Saved", "Your information has been updated.");
  };

  const onUpdatePassword = async () => {
    const email = (authEmail || "").trim();
    if (!email) {
      Alert.alert("Error", "Missing email for this session.");
      return;
    }

    if (
      !currentPassword.trim() ||
      !newPassword.trim() ||
      !confirmPassword.trim()
    ) {
      Alert.alert("Missing fields", "Please fill in all password fields.");
      return;
    }

    if (newPassword.trim().length < 6) {
      Alert.alert(
        "Password too short",
        "New password must be at least 6 characters.",
      );
      return;
    }

    if (newPassword.trim() !== confirmPassword.trim()) {
      Alert.alert(
        "Mismatch",
        "New password and confirm password do not match.",
      );
      return;
    }

    const { error: signInErr } = await supabase.auth.signInWithPassword({
      email,
      password: currentPassword.trim(),
    });

    if (signInErr) {
      Alert.alert("Incorrect current password", signInErr.message);
      return;
    }

    const { error: updErr } = await supabase.auth.updateUser({
      password: newPassword.trim(),
    });

    if (updErr) {
      Alert.alert("Update failed", updErr.message);
      return;
    }

    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    Alert.alert("Success", "Password updated.");
  };

  const onLogout = async () => {
    await supabase.auth.signOut();
    router.replace("./login/login");
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.root}>
        {/* Header (smaller) */}
        <View style={styles.topBar}>
          <TouchableOpacity
            activeOpacity={0.85}
            style={styles.backBtn}
            onPress={() => router.back()}
          >
            <ArrowLeft size={16} color="#0f172a" />
          </TouchableOpacity>

          <Text style={styles.topTitle}>Account Settings</Text>

          <View style={{ width: 38 }} />
        </View>

        <ScrollView
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
        >
          {/* Tabs (smaller) */}
          <View style={styles.tabsRow}>
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() => setTab("info")}
              style={[styles.tabPill, tab === "info" && styles.tabPillActive]}
            >
              <Settings size={16} color={tab === "info" ? BLUE : "#64748b"} />
              <Text
                style={[styles.tabText, tab === "info" && styles.tabTextActive]}
              >
                My Information
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() => setTab("password")}
              style={[
                styles.tabPill,
                tab === "password" && styles.tabPillActive,
              ]}
            >
              <KeyRound
                size={16}
                color={tab === "password" ? BLUE : "#64748b"}
              />
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

          {/* Page heading (smaller) */}
          <Text style={styles.h1}>Profile</Text>
          <Text style={styles.sub}>Manage your personal details</Text>
          <Text style={styles.created}>
            Account created · {formatCreatedAt(createdAt)}
          </Text>

          {tab === "info" ? (
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Personal Information</Text>

              <View style={styles.infoHeader}>
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>{avatar}</Text>
                </View>

                <View style={{ flex: 1 }}>
                  <Text style={styles.roleSmall}>CLIENT</Text>
                  <Text style={styles.emailBig}>{authEmail || "—"}</Text>
                </View>
              </View>

              <View style={styles.formGrid}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.label}>First Name</Text>
                  {/* ✅ UNEDITABLE */}
                  <TextInput
                    value={firstName}
                    editable={false}
                    style={[styles.input, styles.inputDisabled]}
                  />
                </View>

                <View style={{ flex: 1 }}>
                  <Text style={styles.label}>Last Name</Text>
                  {/* ✅ UNEDITABLE */}
                  <TextInput
                    value={lastName}
                    editable={false}
                    style={[styles.input, styles.inputDisabled]}
                  />
                </View>
              </View>

              <View style={styles.formGrid}>
                <View style={{ flex: 1.5 }}>
                  <Text style={styles.label}>Email</Text>
                  <TextInput
                    value={authEmail}
                    editable={false}
                    style={[styles.input, styles.inputDisabled]}
                  />
                </View>

                <View style={{ flex: 0.8 }}>
                  <Text style={styles.label}>Age</Text>
                  <TextInput
                    value={age == null ? "—" : String(age)}
                    editable={false}
                    style={[styles.input, styles.inputDisabled]}
                  />
                </View>
              </View>

              <View style={styles.line} />

              {/* Mobile row */}
              <View style={styles.editRow}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.editLabel}>Mobile Number</Text>
                  {editPhone ? (
                    <TextInput
                      value={phone}
                      onChangeText={setPhone}
                      placeholder="+63..."
                      placeholderTextColor="#94a3b8"
                      style={styles.editInput}
                    />
                  ) : (
                    <Text style={styles.editValue}>{phone || "—"}</Text>
                  )}
                </View>

                <TouchableOpacity
                  activeOpacity={0.9}
                  style={styles.editBtn}
                  onPress={() => setEditPhone((v) => !v)}
                >
                  <Text style={styles.editBtnText}>
                    {editPhone ? "Done" : "Edit"}
                  </Text>
                </TouchableOpacity>
              </View>

              <View style={styles.line} />

              {/* Birthday row */}
              <View style={styles.editRow}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.editLabel}>Birthday</Text>
                  {editDob ? (
                    <TextInput
                      value={dob}
                      onChangeText={setDob}
                      placeholder="YYYY-MM-DD or MM/DD/YYYY"
                      placeholderTextColor="#94a3b8"
                      style={styles.editInput}
                    />
                  ) : (
                    <Text style={styles.editValue}>
                      {formatDobDisplay(dob)}
                    </Text>
                  )}
                </View>

                <TouchableOpacity
                  activeOpacity={0.9}
                  style={styles.editBtn}
                  onPress={() => setEditDob((v) => !v)}
                >
                  <Text style={styles.editBtnText}>
                    {editDob ? "Done" : "Edit"}
                  </Text>
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                activeOpacity={0.9}
                style={[styles.primaryBtn, loading && { opacity: 0.6 }]}
                disabled={loading}
                onPress={onConfirmInfo}
              >
                <Text style={styles.primaryBtnText}>Confirm</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Change Password</Text>

              <Text style={styles.label}>Current Password</Text>
              <TextInput
                value={currentPassword}
                onChangeText={setCurrentPassword}
                secureTextEntry
                placeholder="Current password"
                placeholderTextColor="#94a3b8"
                style={styles.input}
              />

              <Text style={[styles.label, { marginTop: 10 }]}>
                New Password
              </Text>
              <TextInput
                value={newPassword}
                onChangeText={setNewPassword}
                secureTextEntry
                placeholder="New password"
                placeholderTextColor="#94a3b8"
                style={styles.input}
              />

              <Text style={[styles.label, { marginTop: 10 }]}>
                Confirm New Password
              </Text>
              <TextInput
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
                placeholder="Confirm password"
                placeholderTextColor="#94a3b8"
                style={styles.input}
              />

              <TouchableOpacity
                activeOpacity={0.9}
                style={styles.primaryBtn}
                onPress={onUpdatePassword}
              >
                <Text style={styles.primaryBtnText}>Update Password</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Logout (smaller) */}
          <TouchableOpacity
            activeOpacity={0.9}
            style={styles.logoutBtn}
            onPress={onLogout}
          >
            <LogOut size={20} color="#b42318" />
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>

          <View style={{ height: 18 }} />
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#f6f7fb" },
  root: { flex: 1, backgroundColor: "#f6f7fb" },

  // smaller header
  topBar: {
    paddingHorizontal: 14,
    paddingTop: 8,
    paddingBottom: 6,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  topTitle: { fontSize: 18, fontWeight: "900", color: "#0f172a" },

  scroll: { paddingHorizontal: 14, paddingBottom: 14 },

  // smaller tabs
  tabsRow: { flexDirection: "row", gap: 10, marginTop: 6 },
  tabPill: {
    flex: 1,
    height: 48,
    borderRadius: 999,
    borderWidth: 1.3,
    borderColor: "#e5e7eb",
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8,
  },
  tabPillActive: {
    backgroundColor: "#eaf2ff",
    borderColor: BLUE,
  },
  tabText: { fontSize: 13, fontWeight: "900", color: "#64748b" },
  tabTextActive: { color: BLUE },

  // smaller headings
  h1: { marginTop: 12, fontSize: 20, fontWeight: "900", color: "#0f172a" },
  sub: { marginTop: 4, fontSize: 13, fontWeight: "700", color: "#64748b" },
  created: { marginTop: 5, fontSize: 12, fontWeight: "700", color: "#94a3b8" },

  // smaller cards
  card: {
    marginTop: 12,
    borderRadius: 16,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#e9edf5",
    padding: 12,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "900",
    color: "#0f172a",
    marginBottom: 10,
  },

  infoHeader: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
    marginBottom: 12,
  },
  avatar: {
    width: 70,
    height: 70,
    borderRadius: 16,
    backgroundColor: "#eaf2ff",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: { fontSize: 24, fontWeight: "900", color: BLUE },
  roleSmall: { fontSize: 11, fontWeight: "900", color: "#94a3b8" },
  emailBig: { marginTop: 3, fontSize: 14, fontWeight: "900", color: "#0f172a" },

  formGrid: { flexDirection: "row", gap: 10, marginTop: 10 },
  label: {
    fontSize: 12.5,
    fontWeight: "900",
    color: "#0f172a",
    marginBottom: 7,
  },

  // smaller inputs
  input: {
    height: 46,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#d7dce6",
    paddingHorizontal: 12,
    fontSize: 14,
    color: "#0f172a",
    backgroundColor: "#fff",
  },
  inputDisabled: { backgroundColor: "#f3f4f6", color: "#6b7280" },

  line: { height: 1, backgroundColor: "#eef2f7", marginTop: 14 },

  editRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginTop: 12,
  },
  editLabel: { fontSize: 12.5, fontWeight: "900", color: "#64748b" },
  editValue: {
    marginTop: 3,
    fontSize: 14.5,
    fontWeight: "900",
    color: "#0f172a",
  },
  editInput: {
    marginTop: 6,
    height: 42,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#d7dce6",
    paddingHorizontal: 12,
    fontSize: 14,
    color: "#0f172a",
    backgroundColor: "#fff",
  },

  editBtn: {
    width: 68,
    height: 36,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#d7dce6",
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  editBtnText: { fontSize: 13, fontWeight: "900", color: "#334155" },

  // smaller primary button
  primaryBtn: {
    marginTop: 16,
    height: 52,
    borderRadius: 999,
    backgroundColor: BLUE,
    alignItems: "center",
    justifyContent: "center",
  },
  primaryBtnText: { fontSize: 15, fontWeight: "900", color: "#fff" },

  // smaller logout
  logoutBtn: {
    marginTop: 12,
    height: 58,
    borderRadius: 16,
    borderWidth: 1.4,
    borderColor: "#ffb4b4",
    backgroundColor: "#fff1f1",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 10,
  },
  logoutText: { fontSize: 16, fontWeight: "900", color: "#b42318" },
});
