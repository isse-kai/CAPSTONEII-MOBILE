// app/workerpage/Browse/ViewDetails.tsx
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Alert,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { getWorkRequestById, type WorkRequest } from "../../../api/worksService";

const BLUE = "#1E88E5";

export default function ViewDetails() {
  const router = useRouter();
  const { requestId } = useLocalSearchParams<{ requestId?: string }>();

  const [loading, setLoading] = useState(true);
  const [job, setJob] = useState<WorkRequest | null>(null);

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
      Alert.alert("Error", e?.message ?? "Failed to load details.");
      router.back();
    } finally {
      setLoading(false);
    }
  }, [requestId, router]);

  useEffect(() => {
    load();
  }, [load]);

  const title = job?.service_task || job?.service || "Service Request";

  const postedBy = useMemo(() => {
    return (
      job?.posted_name ||
      `${job?.posted_first_name ?? ""} ${job?.posted_last_name ?? ""}`.trim() ||
      "Unknown"
    );
  }, [job]);

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
          <Text style={styles.h1}>Not found.</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.wrap}>
        <Text style={styles.h1}>{title}</Text>

        {/* ✅ Job Details (GRID) */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Job Details</Text>

          <Grid>
            <GridItem label="Service" value={job.service ?? "—"} />
            <GridItem label="Urgency" value={job.urgency ?? "—"} />

            <GridItem
              label="Workers Needed"
              value={String(job.workers_needed ?? "—")}
            />
            <GridItem label="Status" value={job.status ?? "—"} />

            <GridItem
              label="Preferred Date"
              value={String(job.preferred_date ?? "—")}
            />
            <GridItem
              label="Preferred Time"
              value={String(job.preferred_time ?? "—")}
            />

            <GridItem label="Payment Method" value={job.payment_method ?? "—"} />
          </Grid>
        </View>

        {/* ✅ Posted By (GRID) */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Posted By</Text>

          <Grid>
            <GridItem label="Name" value={postedBy} />
            <GridItem label="Email" value={job.posted_email ?? "—"} />

            <GridItem label="Phone" value={job.posted_phone_number ?? "—"} />
            <GridItem label="Barangay" value={job.posted_barangay ?? "—"} />

            <GridItem label="Street" value={job.posted_street ?? "—"} full />
          </Grid>
        </View>

        {/* ✅ Pricing (GRID) */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Pricing</Text>

          <Grid>
            <GridItem label="Price (each)" value={job.price_display ?? "—"} />
            <GridItem label="Units" value={String(job.units ?? "—")} />

            <GridItem label="Total Price" value={job.total_price_display ?? "—"} full />
          </Grid>
        </View>

        {/* ✅ Description (keep your style) */}
        <View style={styles.card}>
          <Text style={styles.label}>Description</Text>
          <Text style={styles.value}>{job.service_description ?? "—"}</Text>

          <Text style={[styles.label, { marginTop: 12 }]}>Equipments</Text>
          <Text style={styles.value}>{job.service_equipments ?? "—"}</Text>
        </View>

        <TouchableOpacity style={styles.btn} onPress={() => router.back()}>
          <Text style={styles.btnText}>Back</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

/** ✅ Grid helpers */
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

  /** ✅ GRID */
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
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
  gridItemFull: { width: "100%" },

  gridLabel: { fontSize: 12, fontWeight: "900", color: "#64748b" },
  gridValue: { marginTop: 4, fontSize: 14, fontWeight: "700", color: "#0f172a" },

  /** keep your original label/value (used in Description section) */
  label: { fontSize: 12, fontWeight: "900", color: "#64748b" },
  value: { marginTop: 4, fontSize: 14, fontWeight: "700", color: "#0f172a" },

  btn: {
    marginTop: 18,
    height: 46,
    borderRadius: 999,
    backgroundColor: BLUE,
    alignItems: "center",
    justifyContent: "center",
  },
  btnText: { color: "#fff", fontWeight: "900" },
});
