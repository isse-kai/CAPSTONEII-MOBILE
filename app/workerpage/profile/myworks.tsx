// app/workerpage/profile/myworks.tsx
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { ChevronLeft, Trash2, Upload } from "lucide-react-native";
import React, { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { supabase } from "../../../supabase/supabase";

const BLUE = "#1E88E5";

type WorkSlotType = "best" | "previous";

type WorkSlot = {
  id: string;
  type: WorkSlotType;
  index: number; // 1–3
  label: string;
  uri?: string | null; // we will store this string directly in Supabase
};

const createInitialSlots = (): WorkSlot[] => [
  { id: "best-1", type: "best", index: 1, label: "Slot 1 of 3" },
  { id: "best-2", type: "best", index: 2, label: "Slot 2 of 3" },
  { id: "best-3", type: "best", index: 3, label: "Slot 3 of 3" },
  { id: "prev-1", type: "previous", index: 1, label: "Slot 1 of 3" },
  { id: "prev-2", type: "previous", index: 2, label: "Slot 2 of 3" },
  { id: "prev-3", type: "previous", index: 3, label: "Slot 3 of 3" },
];

export default function WorkerMyWorksScreen() {
  const router = useRouter();
  const [slots, setSlots] = useState<WorkSlot[]>(createInitialSlots);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  const hasAnyUpload = useMemo(() => slots.some((s) => !!s.uri), [slots]);

  // ---------- LOAD EXISTING DATA FROM SUPABASE ----------
  useEffect(() => {
    let isMounted = true;

    const loadWorks = async () => {
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

        const { data, error } = await supabase
          .from("worker_works")
          .select(
            "best_work_1, best_work_2, best_work_3, previous_work_1, previous_work_2, previous_work_3",
          )
          .eq("auth_uid", authUid)
          .maybeSingle();

        if (error && error.code !== "PGRST116") throw error; // ignore "no rows" error

        if (data && isMounted) {
          setSlots((prev) =>
            prev.map((slot) => {
              const colName =
                slot.type === "best"
                  ? `best_work_${slot.index}`
                  : `previous_work_${slot.index}`;
              return {
                ...slot,
                uri: (data as any)[colName] || null,
              };
            }),
          );
        }
      } catch (e: any) {
        console.log("loadWorks error", e);
        Alert.alert(
          "Error",
          e?.message ?? "Failed to load your works from Supabase.",
        );
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadWorks();
    return () => {
      isMounted = false;
    };
  }, [router]);

  // ---------- LOCAL PICK / CLEAR ----------

  const pickImageForSlot = async (slotId: string) => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission needed", "Gallery access is required to upload.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
    });

    if (result.canceled) return;

    const selected = result.assets[0];
    if (!selected?.uri) return;

    setSlots((prev) =>
      prev.map((s) => (s.id === slotId ? { ...s, uri: selected.uri } : s)),
    );
  };

  // just local clear
  const clearSlotLocal = (slotId: string) => {
    setSlots((prev) =>
      prev.map((s) => (s.id === slotId ? { ...s, uri: null } : s)),
    );
  };

  // Supabase clear for a given slot
  const clearSlotInSupabase = async (slot: WorkSlot) => {
    try {
      const {
        data: { user },
        error: userErr,
      } = await supabase.auth.getUser();
      if (userErr) throw userErr;
      if (!user) {
        return; // if no user, we've already cleared local
      }
      const authUid = user.id;

      const columnName =
        slot.type === "best"
          ? `best_work_${slot.index}`
          : `previous_work_${slot.index}`;

      const updatePayload: any = {
        [columnName]: null,
        updated_at: new Date().toISOString(),
      };

      const { error } = await supabase
        .from("worker_works")
        .update(updatePayload)
        .eq("auth_uid", authUid);

      if (error) {
        console.log("clearSlotInSupabase error", error);
        // optional: tell user, but we already cleared UI
        Alert.alert(
          "Remove failed (online)",
          "Photo was removed locally but not synced to server.",
        );
      }
    } catch (e) {
      console.log("clearSlotInSupabase catch", e);
      // same note: UI already cleared
    }
  };

  // confirm before clearing + call supabase
  const handleRemoveSlot = (slot: WorkSlot) => {
    if (!slot.uri) return;

    Alert.alert("Remove photo", "Are you sure you want to remove this photo?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Remove",
        style: "destructive",
        onPress: () => {
          // 1) clear locally
          clearSlotLocal(slot.id);
          // 2) async clear in Supabase (fire and forget)
          clearSlotInSupabase(slot);
        },
      },
    ]);
  };

  const bestSlots = slots.filter((s) => s.type === "best");
  const previousSlots = slots.filter((s) => s.type === "previous");

  // ---------- SAVE TO worker_works TABLE ONLY (NO STORAGE) ----------

  const handleConfirmUploads = async () => {
    if (!hasAnyUpload || saving) return;

    try {
      setSaving(true);

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

      // build payload with columns
      const payload: any = {
        auth_uid: authUid,
        best_work_1: null,
        best_work_2: null,
        best_work_3: null,
        previous_work_1: null,
        previous_work_2: null,
        previous_work_3: null,
      };

      slots.forEach((slot) => {
        const col =
          slot.type === "best"
            ? `best_work_${slot.index}`
            : `previous_work_${slot.index}`;
        payload[col] = slot.uri || null; // just save the string we have
      });

      // check if row exists
      const { data: existing, error: fetchErr } = await supabase
        .from("worker_works")
        .select("id")
        .eq("auth_uid", authUid)
        .maybeSingle();

      if (fetchErr && fetchErr.code !== "PGRST116") {
        throw fetchErr;
      }

      if (existing) {
        const { error } = await supabase
          .from("worker_works")
          .update({
            ...payload,
            updated_at: new Date().toISOString(),
          })
          .eq("id", existing.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("worker_works").insert({
          ...payload,
          created_at: new Date().toISOString(),
        });
        if (error) throw error;
      }

      // 🔔 Success alert text
      Alert.alert("Upload successfully", "Your works have been saved.");
    } catch (e: any) {
      console.log("handleConfirmUploads error", e);
      Alert.alert(
        "Save failed",
        e?.message ?? "Something went wrong while saving your works.",
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.root}>
        {/* Top bar with back & logo */}
        <View style={styles.topBar}>
          <TouchableOpacity
            onPress={() => router.back()}
            activeOpacity={0.85}
            style={styles.backBtn}
          >
            <ChevronLeft size={20} color="#0f172a" />
          </TouchableOpacity>

          <Image
            source={require("../../../image/jdklogo.png")}
            style={styles.logo}
          />

          <View style={styles.topRight} />
        </View>

        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Page title */}
          <View style={styles.pageHeader}>
            <View style={{ flex: 1 }}>
              <Text style={styles.pageTitle}>My Works</Text>
              <Text style={styles.pageSubtitle}>
                Upload your best projects and previous works to build your
                portfolio.
              </Text>
            </View>

            <View style={styles.statusPill}>
              <Text style={styles.statusLabel}>PORTFOLIO STATUS</Text>
              <Text style={styles.statusValue}>
                {loading ? "Loading..." : "Up to date"}
              </Text>
            </View>
          </View>

          {/* Best Works */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View>
                <Text style={styles.sectionTitle}>Best Works</Text>
                <Text style={styles.sectionSub}>
                  Upload your top 3 best works.
                </Text>
              </View>
            </View>

            {/* horizontal carousel */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.carouselRow}
            >
              {bestSlots.map((slot) => (
                <WorkCard
                  key={slot.id}
                  slot={slot}
                  onUpload={() => pickImageForSlot(slot.id)}
                  onRemove={() => handleRemoveSlot(slot)}
                />
              ))}
            </ScrollView>
          </View>

          {/* Previous Works */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View>
                <Text style={styles.sectionTitle}>Previous Works</Text>
                <Text style={styles.sectionSub}>
                  Upload 3 previous works (older projects).
                </Text>
              </View>
            </View>

            {/* horizontal carousel */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.carouselRow}
            >
              {previousSlots.map((slot) => (
                <WorkCard
                  key={slot.id}
                  slot={slot}
                  onUpload={() => pickImageForSlot(slot.id)}
                  onRemove={() => handleRemoveSlot(slot)}
                />
              ))}
            </ScrollView>
          </View>

          {/* spacer so content doesn't hide behind bottom bar */}
          <View style={{ height: 90 }} />
        </ScrollView>

        {/* Bottom confirm button */}
        <View style={styles.bottomBar}>
          <TouchableOpacity
            activeOpacity={0.9}
            disabled={!hasAnyUpload || saving}
            onPress={handleConfirmUploads}
            style={[
              styles.confirmBtn,
              (!hasAnyUpload || saving) && styles.confirmBtnDisabled,
            ]}
          >
            <Text style={styles.confirmBtnText}>
              {saving ? "Saving..." : "Confirm Uploads"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

/* ---------- Slot Card Component ---------- */

function WorkCard({
  slot,
  onUpload,
  onRemove,
}: {
  slot: WorkSlot;
  onUpload: () => void;
  onRemove: () => void;
}) {
  const hasImage = !!slot.uri;
  const title = slot.type === "best" ? "BEST WORK" : "PREVIOUS WORK";

  return (
    <View style={styles.card}>
      {/* Card header (slot label & remove button only) */}
      <View style={styles.cardHeader}>
        <View>
          <Text style={styles.cardLabel}>{title}</Text>
          <Text style={styles.cardSlotText}>{slot.label}</Text>
        </View>

        <View style={styles.cardButtonsRow}>
          <TouchableOpacity
            onPress={onRemove}
            activeOpacity={0.85}
            disabled={!hasImage}
            style={[styles.removeBtn, !hasImage && styles.removeBtnDisabled]}
          >
            <Trash2 size={18} color={hasImage ? "#64748b" : "#cbd5e1"} />
            <Text
              style={[
                styles.removeBtnText,
                !hasImage && styles.removeBtnTextDisabled,
              ]}
            >
              Remove
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Upload area (tap to upload / replace) */}
      <TouchableOpacity
        activeOpacity={0.9}
        style={styles.uploadArea}
        onPress={onUpload}
      >
        {hasImage ? (
          <Image source={{ uri: slot.uri! }} style={styles.previewImage} />
        ) : (
          <View style={styles.uploadEmpty}>
            <View style={styles.uploadIconCircle}>
              <Upload size={30} color={BLUE} />
            </View>
            <Text style={styles.uploadMainText}>Click to upload</Text>
            <Text style={styles.uploadHintText}>
              JPG / PNG / WebP (max 6MB)
            </Text>
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
}

/* ---------- Styles ---------- */

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#f8fafc" },
  root: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },

  topBar: {
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 6,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  backBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    backgroundColor: "#ffffff",
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    width: 150,
    height: 30,
    resizeMode: "contain",
  },
  topRight: {
    width: 44,
    height: 44,
  },

  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 6,
    paddingBottom: 10,
  },

  pageHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginBottom: 22,
    columnGap: 12,
  },
  pageTitle: {
    fontSize: 22,
    fontWeight: "900",
    color: "#0f172a",
    marginBottom: 4,
  },
  pageSubtitle: {
    fontSize: 13,
    color: "#64748b",
    fontWeight: "600",
  },

  statusPill: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: "#ecfdf3",
    borderWidth: 1,
    borderColor: "#bbf7d0",
    alignItems: "flex-start",
  },
  statusLabel: {
    fontSize: 10,
    fontWeight: "800",
    color: "#16a34a",
    letterSpacing: 0.7,
  },
  statusValue: {
    marginTop: 4,
    fontSize: 12.5,
    fontWeight: "800",
    color: "#14532d",
  },

  section: {
    marginBottom: 26,
  },
  sectionHeader: {
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "900",
    color: "#0f172a",
  },
  sectionSub: {
    marginTop: 4,
    fontSize: 12.5,
    color: "#64748b",
    fontWeight: "600",
  },

  // horizontal carousel row
  carouselRow: {
    paddingVertical: 6,
    paddingRight: 10,
  },

  card: {
    width: 320,
    borderRadius: 18,
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#dbe3f0",
    paddingHorizontal: 14,
    paddingTop: 12,
    paddingBottom: 16,
    marginRight: 14,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    columnGap: 8,
    marginBottom: 12,
  },
  cardLabel: {
    fontSize: 11,
    fontWeight: "900",
    color: "#9ca3af",
    textTransform: "uppercase",
  },
  cardSlotText: {
    marginTop: 3,
    fontSize: 13,
    color: "#6b7280",
    fontWeight: "700",
  },

  cardButtonsRow: {
    flexDirection: "row",
    columnGap: 6,
  },

  removeBtn: {
    flexDirection: "row",
    alignItems: "center",
    columnGap: 6,
    paddingHorizontal: 12,
    height: 34,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    backgroundColor: "#f9fafb",
  },
  removeBtnDisabled: {
    borderColor: "#e5e7eb",
    backgroundColor: "#f9fafb",
  },
  removeBtnText: {
    fontSize: 12.5,
    fontWeight: "700",
    color: "#64748b",
  },
  removeBtnTextDisabled: {
    color: "#cbd5e1",
  },

  uploadArea: {
    marginTop: 10,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: "#dbe3f0",
    backgroundColor: "#f5f7ff",
    height: 220,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
  },
  uploadEmpty: {
    alignItems: "center",
    justifyContent: "center",
  },
  uploadIconCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 3,
    borderColor: "#dbeafe",
    backgroundColor: "#eff6ff",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  uploadMainText: {
    fontSize: 14,
    fontWeight: "900",
    color: "#0f172a",
  },
  uploadHintText: {
    marginTop: 4,
    fontSize: 12,
    color: "#6b7280",
    fontWeight: "600",
  },
  previewImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },

  bottomBar: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
    backgroundColor: "#f8fafc",
  },
  confirmBtn: {
    height: 48,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: BLUE,
  },
  confirmBtnDisabled: {
    backgroundColor: "#cbd5e1",
  },
  confirmBtnText: {
    color: "#ffffff",
    fontSize: 15,
    fontWeight: "900",
  },
});
