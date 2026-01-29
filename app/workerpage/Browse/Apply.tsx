// app/workerpage/Browse/Apply.tsx
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useCallback, useEffect, useMemo, useState } from "react";
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

import {
  applyToWorkRequest,
  getWorkRequestById,
  type WorkRequest,
} from "../../../api/worksService";

const BLUE = "#1E88E5";

export default function Apply() {
  const router = useRouter();
  const { requestId } = useLocalSearchParams<{ requestId?: string }>();

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [job, setJob] = useState<WorkRequest | null>(null);
  const [applicationLetter, setApplicationLetter] = useState("");

  const load = useCallback(async () => {
    try {
      setLoading(true);

      if (!requestId) {
        Alert.alert("Error", "Missing requestId.");
        router.back();
        return;
      }

      const res = await getWorkRequestById(requestId);
      if (!res?.job) {
        Alert.alert("Not found", "This request no longer exists.");
        router.back();
        return;
      }

      setJob(res.job);
    } catch (e: any) {
      Alert.alert("Error", e?.message ?? "Failed to load work request.");
      router.back();
    } finally {
      setLoading(false);
    }
  }, [requestId, router]);

  useEffect(() => {
    load();
  }, [load]);

  const title = useMemo(() => {
    return job?.service_task || job?.service || "Work Request";
  }, [job]);

  // ✅ Client name fallback:
  // 1) new fields (client_name/client_first_name...)
  // 2) existing posted_* fields (your ViewDetails)
  const clientName = useMemo(() => {
    const v1 =
      (job as any)?.client_name ||
      `${(job as any)?.client_first_name ?? ""} ${(job as any)?.client_last_name ?? ""}`.trim();

    const v2 =
      job?.posted_name ||
      `${job?.posted_first_name ?? ""} ${job?.posted_last_name ?? ""}`.trim();

    return (v1 || v2 || "Unknown").trim() || "Unknown";
  }, [job]);

  const clientPhone =
    (job as any)?.client_phone_number || job?.posted_phone_number || "—";
  const clientBarangay =
    (job as any)?.client_barangay || job?.posted_barangay || "—";
  const clientStreet =
    (job as any)?.client_street || job?.posted_street || "—";
  const clientEmail = (job as any)?.client_email || job?.posted_email || "—";

  const submit = useCallback(async () => {
    try {
      if (!requestId) {
        Alert.alert("Error", "Missing requestId.");
        return;
      }

      const text = applicationLetter.trim();
      if (text.length < 10) {
        Alert.alert("Application Letter", "Please write at least 10 characters.");
        return;
      }

      setSubmitting(true);

      await applyToWorkRequest(requestId, {
        application_letter: text,
      });

      Alert.alert("Success", "Your application was submitted.", [
        { text: "OK", onPress: () => router.back() },
      ]);
    } catch (e: any) {
      Alert.alert("Error", e?.message ?? "Failed to submit application.");
    } finally {
      setSubmitting(false);
    }
  }, [applicationLetter, requestId, router]);

  if (loading) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.wrap}>
          <Text style={styles.h1}>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!job) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.wrap}>
          <Text style={styles.h1}>Work request not found.</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.wrap} keyboardShouldPersistTaps="handled">
        <Text style={styles.h1}>Apply</Text>
        <Text style={styles.subTitle}>{title}</Text>

        {/* ✅ Card 1: Job Details (GRID) */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Job Details</Text>

          <Grid>
            <GridItem label="Service" value={job.service ?? "—"} />
            <GridItem label="Urgency" value={job.urgency ?? "—"} />

            <GridItem
              label="Workers Needed"
              value={String(job.workers_needed ?? "—")}
            />
            <GridItem
              label="Status"
              value={job.status ?? "—"}
            />

            <GridItem
              label="Preferred Date"
              value={String(job.preferred_date ?? "—")}
            />
            <GridItem
              label="Preferred Time"
              value={String(job.preferred_time ?? "—")}
            />

            <GridItem
              label="Payment Method"
              value={job.payment_method ?? "—"}
            />
            <GridItem
              label="Client User ID"
              value={String(job.user_id ?? "—")}
            />
          </Grid>
        </View>

        {/* ✅ Card 2: Client Details (GRID) */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Client Details</Text>

          <Grid>
            <GridItem label="Client Name" value={clientName} />
            <GridItem label="Email" value={clientEmail} />

            <GridItem label="Phone" value={clientPhone} />
            <GridItem label="Barangay" value={clientBarangay} />

            <GridItem label="Street" value={clientStreet} />
          </Grid>
        </View>

        {/* ✅ Card 3: Pricing (GRID) */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Pricing</Text>

          <Grid>
            <GridItem label="Price (each)" value={job.price_display ?? "—"} />
            <GridItem label="Units" value={String(job.units ?? "—")} />

            <GridItem label="Total Price" value={job.total_price_display ?? "—"} full />
          </Grid>
        </View>

        {/* ✅ Card 4: Description + Equipments (keeps your existing style) */}
        <View style={styles.card}>
          <Text style={styles.label}>Description</Text>
          <Text style={styles.value}>{job.service_description ?? "—"}</Text>

          <Text style={[styles.label, { marginTop: 12 }]}>Equipments</Text>
          <Text style={styles.value}>{job.service_equipments ?? "—"}</Text>
        </View>

        {/* ✅ Card 5: Form (keep Apply.tsx style) */}
        <View style={styles.card}>
          <Text style={styles.label}>Application Letter</Text>
          <Text style={styles.helper}>
            Write a short message explaining why you&apos;re a good fit.
          </Text>

          <TextInput
            value={applicationLetter}
            onChangeText={setApplicationLetter}
            placeholder="Type your application letter here..."
            placeholderTextColor="#94a3b8"
            style={styles.input}
            multiline
            textAlignVertical="top"
            maxLength={2000}
          />

          <Text style={styles.counter}>{applicationLetter.length}/2000</Text>

          <TouchableOpacity
            activeOpacity={0.9}
            style={[styles.btn, submitting && { opacity: 0.7 }]}
            onPress={submit}
            disabled={submitting}
          >
            <Text style={styles.btnText}>
              {submitting ? "Submitting..." : "Submit Application"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.9}
            style={styles.btnGhost}
            onPress={() => router.back()}
            disabled={submitting}
          >
            <Text style={styles.btnGhostText}>Cancel</Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 10 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

/** ✅ Grid helpers (minimal changes, keeps your structure) */
function Grid({ children }: { children: React.ReactNode }) {
  return <View style={styles.grid}>{children}</View>;
}

function GridItem({
  label,
  value,
  full,
}: {
  label: string;
  value: string;
  full?: boolean;
}) {
  return (
    <View style={[styles.gridItem, full && styles.gridItemFull]}>
      <Text style={styles.gridLabel}>{label}</Text>
      <Text style={styles.gridValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#f5f6fa" },
  wrap: { padding: 18, paddingBottom: 30 },

  h1: { fontSize: 20, fontWeight: "900", color: "#0f172a", marginTop: 10 },
  subTitle: {
    marginTop: 6,
    fontSize: 14,
    fontWeight: "800",
    color: "#334155",
  },

  card: {
    marginTop: 14,
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: "#e5e9f2",
  },

  cardTitle: {
    fontSize: 12,
    fontWeight: "900",
    color: "#0f172a",
    marginBottom: 10,
  },

  /** ✅ GRID (2 columns) */
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10, // RN supports gap on newer versions; if not, tell me and I'll switch to margins
  },
  gridItem: {
    width: "48%",
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#eef2f7",
    backgroundColor: "#ffffff",
  },
  gridItemFull: {
    width: "100%",
  },
  gridLabel: {
    fontSize: 12,
    fontWeight: "900",
    color: "#64748b",
  },
  gridValue: {
    marginTop: 4,
    fontSize: 14,
    fontWeight: "700",
    color: "#0f172a",
  },

  /** Keep your ViewDetails label/value styles too */
  label: { fontSize: 12, fontWeight: "900", color: "#64748b" },
  value: { marginTop: 4, fontSize: 14, fontWeight: "700", color: "#0f172a" },

  helper: { marginTop: 6, fontSize: 12.5, fontWeight: "700", color: "#64748b" },

  input: {
    marginTop: 12,
    minHeight: 140,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e5e9f2",
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 14,
    fontWeight: "700",
    color: "#0f172a",
    backgroundColor: "#ffffff",
  },

  counter: {
    marginTop: 8,
    fontSize: 12,
    fontWeight: "800",
    color: "#94a3b8",
    textAlign: "right",
  },

  btn: {
    marginTop: 14,
    height: 46,
    borderRadius: 999,
    backgroundColor: BLUE,
    alignItems: "center",
    justifyContent: "center",
  },
  btnText: { color: "#fff", fontWeight: "900", fontSize: 13.5 },

  btnGhost: {
    marginTop: 10,
    height: 46,
    borderRadius: 999,
    backgroundColor: "#fff",
    borderWidth: 1.6,
    borderColor: "#e5e9f2",
    alignItems: "center",
    justifyContent: "center",
  },
  btnGhostText: { color: "#334155", fontWeight: "900", fontSize: 13.5 },
});
