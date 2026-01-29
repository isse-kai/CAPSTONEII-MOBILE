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

      // ✅ Backend should accept: { application_letter: "..." }
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

        {/* ✅ ONLY display work_request + user_id */}
        <View style={styles.card}>
          <Row label="Work Request" value={title} />
          <Row label="Posted User ID" value={String(job.user_id ?? "—")} />
          <Row label="Request ID" value={String(job.id ?? "—")} />
        </View>

        {/* ✅ Form */}
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
      </ScrollView>
    </SafeAreaView>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={styles.rowValue}>{value}</Text>
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

  row: { paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: "#eef2f7" },
  rowLabel: { fontSize: 12, fontWeight: "900", color: "#64748b" },
  rowValue: { marginTop: 4, fontSize: 14, fontWeight: "800", color: "#0f172a" },

  label: { fontSize: 12, fontWeight: "900", color: "#64748b" },
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
