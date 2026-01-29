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
    return job?.posted_name ||
      `${job?.posted_first_name ?? ""} ${job?.posted_last_name ?? ""}`.trim() ||
      "Unknown";
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

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.wrap}>
        <Text style={styles.h1}>{title}</Text>

        <View style={styles.card}>
          <Row label="Service" value={job?.service ?? "—"} />
          <Row label="Urgency" value={job?.urgency ?? "—"} />
          <Row label="Workers Needed" value={String(job?.workers_needed ?? "—")} />
          <Row label="Preferred Date" value={String(job?.preferred_date ?? "—")} />
          <Row label="Preferred Time" value={String(job?.preferred_time ?? "—")} />
          <Row label="Payment Method" value={job?.payment_method ?? "—"} />
          <Row label="Status" value={job?.status ?? "—"} />
        </View>

        <View style={styles.card}>
          <Row label="Posted by" value={postedBy} />
          <Row label="Email" value={job?.posted_email ?? "—"} />
          <Row label="Phone" value={job?.posted_phone_number ?? "—"} />
          <Row label="Barangay" value={job?.posted_barangay ?? "—"} />
          <Row label="Street" value={job?.posted_street ?? "—"} />
        </View>

        <View style={styles.card}>
          <Row label="Price (each)" value={job?.price_display ?? "—"} />
          <Row label="Units" value={String(job?.units ?? "—")} />
          <Row label="Total Price" value={job?.total_price_display ?? "—"} />
        </View>

        <View style={styles.card}>
          <Text style={styles.label}>Description</Text>
          <Text style={styles.value}>{job?.service_description ?? "—"}</Text>

          <Text style={[styles.label, { marginTop: 12 }]}>Equipments</Text>
          <Text style={styles.value}>{job?.service_equipments ?? "—"}</Text>
        </View>

        <TouchableOpacity style={styles.btn} onPress={() => router.back()}>
          <Text style={styles.btnText}>Back</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
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

  row: { paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: "#eef2f7" },
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
