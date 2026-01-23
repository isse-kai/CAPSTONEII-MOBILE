// app/workerpage/profile/profile.tsx
import { useRouter } from "expo-router";
import {
    ChevronLeft,
    Image as ImageIcon,
    LogOut,
    Settings,
} from "lucide-react-native";
import React, { useEffect, useMemo, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    SafeAreaView,
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
  sex: string | null;
  email_address: string | null;
  contact_number: string | null;
  date_of_birth: string | null;
};

export default function ProfileScreen() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [role, setRole] = useState<Role>(null);
  const [profile, setProfile] = useState<ProfileRow | null>(null);

  const [contactNumber, setContactNumber] = useState("");
  const [birthday, setBirthday] = useState("");

  const email = profile?.email_address ?? "";

  const fullName = useMemo(() => {
    const fn = (profile?.first_name ?? "").trim();
    const ln = (profile?.last_name ?? "").trim();
    return [fn, ln].filter(Boolean).join(" ");
  }, [profile]);

  const initials = useMemo(() => {
    const fn = (profile?.first_name ?? "").trim();
    const ln = (profile?.last_name ?? "").trim();
    const a = fn ? fn[0].toUpperCase() : "";
    const b = ln ? ln[0].toUpperCase() : "";
    return a + b || "U";
  }, [profile]);

  const roleBadgeText = useMemo(() => {
    if (role === "worker") return "WORKER";
    if (role === "client") return "CLIENT";
    return "UNKNOWN";
  }, [role]);

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

        // worker
        const workerRes = await supabase
          .from("user_worker")
          .select(
            "id, auth_uid, first_name, last_name, sex, email_address, contact_number, date_of_birth",
          )
          .eq("auth_uid", authUid)
          .maybeSingle();

        if (workerRes.error) throw workerRes.error;

        if (workerRes.data) {
          if (!mounted) return;
          setRole("worker");
          setProfile(workerRes.data as ProfileRow);
          setContactNumber(workerRes.data.contact_number ?? "");
          setBirthday(workerRes.data.date_of_birth ?? "");
          return;
        }

        // client
        const clientRes = await supabase
          .from("user_client")
          .select(
            "id, auth_uid, first_name, last_name, sex, email_address, contact_number, date_of_birth",
          )
          .eq("auth_uid", authUid)
          .maybeSingle();

        if (clientRes.error) throw clientRes.error;

        if (clientRes.data) {
          if (!mounted) return;
          setRole("client");
          setProfile(clientRes.data as ProfileRow);
          setContactNumber(clientRes.data.contact_number ?? "");
          setBirthday(clientRes.data.date_of_birth ?? "");
          return;
        }

        Alert.alert(
          "Profile not found",
          "Your account is not registered as Worker or Client.",
        );
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

  const handleSave = async () => {
    if (!role || !profile || saving) return;

    if (birthday.trim() && !/^\d{4}-\d{2}-\d{2}$/.test(birthday.trim())) {
      Alert.alert(
        "Invalid birthday",
        "Use format YYYY-MM-DD (example: 2001-08-25).",
      );
      return;
    }

    try {
      setSaving(true);

      const table = role === "worker" ? "user_worker" : "user_client";

      const { error } = await supabase
        .from(table)
        .update({
          contact_number: contactNumber.trim() || null,
          date_of_birth: birthday.trim() || null,
        })
        .eq("id", profile.id);

      if (error) throw error;

      Alert.alert("Saved", "Your profile was updated.");
      setProfile((p) =>
        p
          ? {
              ...p,
              contact_number: contactNumber.trim() || null,
              date_of_birth: birthday.trim() || null,
            }
          : p,
      );
    } catch (e: any) {
      Alert.alert("Save failed", e?.message ?? "Something went wrong.");
    } finally {
      setSaving(false);
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

          <Text style={styles.topTitle}>Profile</Text>

          <View style={{ width: 44 }} />
        </View>

        {loading ? (
          <View style={styles.loadingWrap}>
            <ActivityIndicator />
            <Text style={styles.loadingText}>Loading profile...</Text>
          </View>
        ) : (
          <>
            {/* Profile summary */}
            <View style={styles.summaryCard}>
              <View style={styles.avatarRow}>
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>{initials}</Text>
                </View>

                <View style={styles.summaryTextWrap}>
                  <View style={styles.roleRow}>
                    <Text style={styles.summaryLabel}>Signed in as</Text>

                    <View
                      style={[
                        styles.roleBadge,
                        role === "worker"
                          ? styles.roleBadgeWorker
                          : role === "client"
                            ? styles.roleBadgeClient
                            : styles.roleBadgeUnknown,
                      ]}
                    >
                      <Text style={styles.roleBadgeText}>{roleBadgeText}</Text>
                    </View>
                  </View>

                  {!!fullName && (
                    <Text style={styles.summaryName}>{fullName}</Text>
                  )}
                  <Text style={styles.summaryEmail}>{email}</Text>
                </View>
              </View>

              <View style={styles.infoRow}>
                <View style={styles.infoField}>
                  <Text style={styles.infoLabel}>Contact Number</Text>
                  <TextInput
                    value={contactNumber}
                    onChangeText={setContactNumber}
                    placeholder="Enter contact number"
                    placeholderTextColor="#9aa4b2"
                    keyboardType="phone-pad"
                    style={styles.infoInput}
                  />
                </View>

                <View style={styles.infoField}>
                  <Text style={styles.infoLabel}>Birthday</Text>
                  <TextInput
                    value={birthday}
                    onChangeText={setBirthday}
                    placeholder="YYYY-MM-DD"
                    placeholderTextColor="#9aa4b2"
                    style={styles.infoInput}
                  />
                </View>
              </View>

              <TouchableOpacity
                activeOpacity={0.9}
                onPress={handleSave}
                disabled={saving || loading || !role}
                style={[
                  styles.saveBtn,
                  saving ? styles.saveBtnOff : styles.saveBtnOn,
                ]}
              >
                <Text style={styles.saveBtnText}>
                  {saving ? "Saving..." : "Save"}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Actions */}
            <View style={styles.actionsCard}>
              {/* 🔵 My Works – on top */}
              <TouchableOpacity
                activeOpacity={0.9}
                style={styles.actionRow}
                onPress={() =>
                  router.push("/workerpage/profile/myworks" as const)
                }
              >
                <View style={styles.actionLeft}>
                  <View style={styles.actionIconBox}>
                    <ImageIcon size={22} color={BLUE} />
                  </View>

                  <View style={styles.actionTextWrap}>
                    <Text style={styles.actionTitle}>My Works</Text>
                    <Text style={styles.actionSub}>
                      Upload your best and previous projects
                    </Text>
                  </View>
                </View>

                <Text style={styles.chevron}>›</Text>
              </TouchableOpacity>

              <View style={styles.actionDivider} />

              {/* Account Settings */}
              <TouchableOpacity
                activeOpacity={0.9}
                style={styles.actionRow}
                onPress={() =>
                  router.push("/workerpage/profile/workeraccountsettings")
                }
              >
                <View style={styles.actionLeft}>
                  <View style={styles.actionIconBox}>
                    <Settings size={22} color={BLUE} />
                  </View>

                  <View style={styles.actionTextWrap}>
                    <Text style={styles.actionTitle}>Account Settings</Text>
                    <Text style={styles.actionSub}>
                      Manage your personal info and password
                    </Text>
                  </View>
                </View>

                <Text style={styles.chevron}>›</Text>
              </TouchableOpacity>

              <View className="divider" style={styles.actionDivider} />

              {/* Logout */}
              <TouchableOpacity
                activeOpacity={0.9}
                style={styles.actionRow}
                onPress={handleLogout}
              >
                <View style={styles.actionLeft}>
                  <View style={[styles.actionIconBox, styles.logoutIconBox]}>
                    <LogOut size={22} color="#ef4444" />
                  </View>

                  <View style={styles.actionTextWrap}>
                    <Text style={[styles.actionTitle, styles.logoutTitle]}>
                      Logout
                    </Text>
                    <Text style={styles.actionSub}>
                      Sign out of this account
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            </View>
          </>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#f8fafc" },
  root: {
    flex: 1,
    backgroundColor: "#f8fafc",
    paddingHorizontal: 18,
    paddingTop: 10,
  },

  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 18,
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
  topTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#0f172a",
  },

  loadingWrap: {
    paddingTop: 30,
    alignItems: "center",
    gap: 10,
  },
  loadingText: {
    fontSize: 12.5,
    color: "#6b7280",
    fontWeight: "700",
  },

  summaryCard: {
    borderRadius: 12,
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    paddingVertical: 18,
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  avatarRow: {
    flexDirection: "row",
    alignItems: "center",
    columnGap: 14,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 16,
    backgroundColor: "#e5f0ff",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    fontSize: 28,
    fontWeight: "800",
    color: BLUE,
  },
  summaryTextWrap: { flex: 1 },

  roleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 4,
    flexWrap: "wrap",
  },
  summaryLabel: {
    fontSize: 12,
    color: "#9ca3af",
    textTransform: "uppercase",
    letterSpacing: 0.7,
  },
  roleBadge: {
    paddingHorizontal: 10,
    height: 22,
    borderRadius: 999,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  roleBadgeWorker: {
    backgroundColor: "#eff6ff",
    borderColor: "#bfdbfe",
  },
  roleBadgeClient: {
    backgroundColor: "#ecfdf5",
    borderColor: "#bbf7d0",
  },
  roleBadgeUnknown: {
    backgroundColor: "#f8fafc",
    borderColor: "#e5e7eb",
  },
  roleBadgeText: {
    fontSize: 11,
    fontWeight: "900",
    color: "#0f172a",
    letterSpacing: 0.6,
  },

  summaryName: {
    fontSize: 16,
    fontWeight: "900",
    color: "#111827",
    marginBottom: 2,
  },
  summaryEmail: {
    fontSize: 14,
    fontWeight: "700",
    color: "#111827",
  },

  infoRow: {
    marginTop: 14,
    flexDirection: "row",
    gap: 12,
  },
  infoField: { flex: 1 },
  infoLabel: {
    fontSize: 12,
    fontWeight: "800",
    color: "#111827",
    marginBottom: 6,
  },
  infoInput: {
    height: 44,
    borderWidth: 1,
    borderColor: "#d7dee9",
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 13.5,
    color: "#111827",
    backgroundColor: "#ffffff",
  },

  saveBtn: {
    height: 44,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 14,
  },
  saveBtnOn: { backgroundColor: "#cfd6df" },
  saveBtnOff: { backgroundColor: "#d1d5db" },
  saveBtnText: { fontSize: 14, fontWeight: "900", color: "#111827" },

  actionsCard: {
    borderRadius: 12,
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  actionRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
  },
  actionLeft: {
    flexDirection: "row",
    alignItems: "center",
    columnGap: 12,
    flex: 1,
  },
  actionIconBox: {
    width: 44,
    height: 44,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#dbeafe",
    backgroundColor: "#eff6ff",
    alignItems: "center",
    justifyContent: "center",
  },
  logoutIconBox: {
    borderColor: "#fee2e2",
    backgroundColor: "#fef2f2",
  },
  actionTextWrap: { flex: 1 },
  actionTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#0f172a",
  },
  actionSub: {
    marginTop: 4,
    fontSize: 12.5,
    color: "#6b7280",
  },
  chevron: {
    fontSize: 22,
    fontWeight: "800",
    color: "#9ca3af",
    marginLeft: 6,
  },

  actionDivider: {
    height: 1,
    backgroundColor: "#e5e7eb",
  },

  logoutTitle: { color: "#b91c1c" },
});
