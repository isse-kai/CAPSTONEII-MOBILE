// app/clientpage/profile/profile.tsx
import { useRouter } from "expo-router";
import { ArrowLeft, ChevronRight, LogOut, Settings } from "lucide-react-native";
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

import { getUser as apiGetUser, logout as apiLogout } from "../../../api/authService";
import {
  getClientProfileByAuthUid,
  updateClientProfileByAuthUid,
} from "../../../api/clientService";

const BLUE = "#1E88E5";

function getInitials(first: string, last: string) {
  const a = (first || "").trim().slice(0, 1).toUpperCase();
  const b = (last || "").trim().slice(0, 1).toUpperCase();
  return (a + b).trim() || "U";
}

export default function ClientProfile() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);

  const [email, setEmail] = useState<string>("");
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");

  const [phone, setPhone] = useState<string>("");
  const [dob, setDob] = useState<string>("");

  const initials = useMemo(
    () => getInitials(firstName, lastName),
    [firstName, lastName]
  );

  const fullName = useMemo(() => {
    const fn = (firstName || "").trim();
    const ln = (lastName || "").trim();
    const full = `${fn} ${ln}`.trim();
    return full || "Client";
  }, [firstName, lastName]);

  useEffect(() => {
    let mounted = true;

    const safeStr = (v: any) => (v ?? "").toString();

    const load = async () => {
      try {
        setLoading(true);

        const userRes = await apiGetUser();
        const user = userRes?.user || userRes?.data?.user || null;

        if (!user) {
          router.replace("/login/login");
          return;
        }

        // If your API returns first_name/last_name on the user model:
        if (mounted) {
          setEmail(safeStr(user.email));
          if (user.first_name != null) setFirstName(safeStr(user.first_name));
          if (user.last_name != null) setLastName(safeStr(user.last_name));
        }

        const authUid = user.id;

        const clientRes = await getClientProfileByAuthUid(authUid);
        const client = clientRes?.data || clientRes || null;

        if (client && mounted) {
          const p: any = client;

          // If client profile has the real profile fields, prioritize them:
          if (p.first_name != null) setFirstName(safeStr(p.first_name));
          if (p.last_name != null) setLastName(safeStr(p.last_name));
          if (p.email != null) setEmail(safeStr(p.email));

          setPhone(safeStr(p.contact_number));
          setDob(safeStr(p.date_of_birth));
        }
      } catch (e: any) {
        Alert.alert("Error", e?.message || "Failed to load profile.");
      } finally {
        if (mounted) setLoading(false);
      }
    };

    load();

    return () => {
      mounted = false;
    };
  }, [router]);

  const onSaveQuick = async () => {
    try {
      const userRes = await apiGetUser();
      const user = userRes?.user || userRes?.data?.user || null;
      if (!user) {
        router.replace("/login/login");
        return;
      }

      const uid = user.id;

      const res = await updateClientProfileByAuthUid(uid, {
        contact_number: phone.trim(),
        date_of_birth: dob.trim(),
      });

      // Handle common API shapes
      if (res?.error) {
        Alert.alert("Update failed", res.error?.message || "");
        return;
      }

      Alert.alert("Saved", "Your profile details were updated.");
    } catch (e: any) {
      Alert.alert("Update failed", e?.message || "Please try again.");
    }
  };

  const onLogout = async () => {
    try {
      await apiLogout();
    } finally {
      router.replace("/login/login");
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.root}>
        {/* Top Bar */}
        <View style={styles.topBar}>
          <TouchableOpacity
            activeOpacity={0.85}
            style={styles.backBtn}
            onPress={() => router.back()}
          >
            <ArrowLeft size={18} color="#0f172a" />
          </TouchableOpacity>

          <Text style={styles.topTitle}>Profile</Text>

          <View style={{ width: 44 }} />
        </View>

        <ScrollView
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
        >
          {/* Profile Card */}
          <View style={styles.card}>
            <View style={styles.profileRow}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{initials}</Text>
              </View>

              <View style={{ flex: 1 }}>
                <View style={styles.signedRow}>
                  <Text style={styles.signedText}>SIGNED IN AS</Text>
                  <View style={styles.rolePill}>
                    <Text style={styles.rolePillText}>CLIENT</Text>
                  </View>
                </View>

                <Text style={styles.name}>{fullName}</Text>
                <Text style={styles.email}>{email || "—"}</Text>
              </View>
            </View>

            <View style={styles.grid}>
              <View style={styles.fieldBox}>
                <Text style={styles.label}>Contact Number</Text>
                <TextInput
                  value={phone}
                  onChangeText={setPhone}
                  placeholder="+63..."
                  placeholderTextColor="#94a3b8"
                  style={styles.input}
                />
              </View>

              <View style={styles.fieldBox}>
                <Text style={styles.label}>Birthday</Text>
                <TextInput
                  value={dob}
                  onChangeText={setDob}
                  placeholder="YYYY-MM-DD"
                  placeholderTextColor="#94a3b8"
                  style={styles.input}
                />
              </View>
            </View>

            <TouchableOpacity
              activeOpacity={0.9}
              style={[styles.primaryBtn, loading && { opacity: 0.6 }]}
              disabled={loading}
              onPress={onSaveQuick}
            >
              <Text style={styles.primaryBtnText}>Save</Text>
            </TouchableOpacity>
          </View>

          {/* Actions Card */}
          <View style={styles.card}>
            <TouchableOpacity
              activeOpacity={0.9}
              style={styles.actionRow}
              onPress={() =>
                router.push("/clientpage/profile/clientaccountsettings")
              }
            >
              <View
                style={[
                  styles.actionIconWrap,
                  { backgroundColor: "#eaf2ff", borderColor: "#cfe2ff" },
                ]}
              >
                <Settings size={20} color={BLUE} />
              </View>

              <View style={{ flex: 1 }}>
                <Text style={styles.actionTitle}>Account Settings</Text>
                <Text style={styles.actionSub}>
                  Manage your personal info and password
                </Text>
              </View>

              <ChevronRight size={20} color="#94a3b8" />
            </TouchableOpacity>

            <View style={styles.divider} />

            <TouchableOpacity
              activeOpacity={0.9}
              style={styles.actionRow}
              onPress={onLogout}
            >
              <View
                style={[
                  styles.actionIconWrap,
                  { backgroundColor: "#ffecec", borderColor: "#ffd1d1" },
                ]}
              >
                <LogOut size={20} color="#d33" />
              </View>

              <View style={{ flex: 1 }}>
                <Text style={[styles.actionTitle, { color: "#b42318" }]}>
                  Logout
                </Text>
                <Text style={styles.actionSub}>Sign out of this account</Text>
              </View>

              <ChevronRight size={20} color="#f0a4a4" />
            </TouchableOpacity>
          </View>

          <View style={{ height: 22 }} />
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#f6f7fb" },
  root: { flex: 1, backgroundColor: "#f6f7fb" },

  topBar: {
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  backBtn: {
    width: 44,
    height: 44,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  topTitle: {
    fontSize: 20,
    fontWeight: "900",
    color: "#0f172a",
  },

  scroll: { paddingHorizontal: 16, paddingBottom: 18 },

  card: {
    marginTop: 12,
    borderRadius: 18,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#e9edf5",
    padding: 14,
  },

  profileRow: { flexDirection: "row", gap: 12, alignItems: "center" },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 16,
    backgroundColor: "#eaf2ff",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: { fontSize: 26, fontWeight: "900", color: BLUE },

  signedRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  signedText: { fontSize: 12, fontWeight: "800", color: "#94a3b8" },
  rolePill: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#cfe2ff",
    backgroundColor: "#eaf2ff",
  },
  rolePillText: {
    fontSize: 12,
    fontWeight: "900",
    color: "#0f172a",
    letterSpacing: 1,
  },

  name: { marginTop: 6, fontSize: 18, fontWeight: "900", color: "#0f172a" },
  email: { marginTop: 2, fontSize: 13, fontWeight: "700", color: "#334155" },

  grid: { marginTop: 14, flexDirection: "row", gap: 12 },
  fieldBox: { flex: 1 },
  label: { fontSize: 13, fontWeight: "900", color: "#0f172a", marginBottom: 8 },
  input: {
    height: 48,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#d7dce6",
    paddingHorizontal: 14,
    fontSize: 15,
    color: "#0f172a",
    backgroundColor: "#fff",
  },

  primaryBtn: {
    marginTop: 14,
    height: 50,
    borderRadius: 16,
    backgroundColor: "#d1d5db",
    alignItems: "center",
    justifyContent: "center",
  },
  primaryBtnText: { fontSize: 16, fontWeight: "900", color: "#111827" },

  actionRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 12,
  },
  actionIconWrap: {
    width: 52,
    height: 52,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  actionTitle: { fontSize: 16, fontWeight: "900", color: "#0f172a" },
  actionSub: {
    marginTop: 2,
    fontSize: 13,
    fontWeight: "700",
    color: "#64748b",
  },
  divider: { height: 1, backgroundColor: "#eef2f7" },
});
