import { useLocalSearchParams, useRouter } from "expo-router";
import { Briefcase, ChevronLeft, MapPin } from "lucide-react-native";
import React, { useMemo } from "react";
import {
    Alert,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

const BLUE = "#1E88E5";

type RequestItem = {
  id: string;
  title: string;
  service: string;
  location: string;
  budget: string;
  posted: string;
  description: string;
};

const PLACEHOLDER_REQUESTS: RequestItem[] = [
  {
    id: "REQ-001",
    title: "House Cleaning Needed",
    service: "Cleaning",
    location: "Bacolod City",
    budget: "₱500 - ₱800",
    posted: "Posted today",
    description:
      "Need help with general cleaning (living room + kitchen). Estimated 2-3 hours.",
  },
  {
    id: "REQ-002",
    title: "Fix Leaking Faucet",
    service: "Plumbing",
    location: "Barangay Villamonte",
    budget: "₱600 - ₱1,200",
    posted: "Posted 1 day ago",
    description:
      "Kitchen faucet leaking. Bring basic tools if possible. Prefer afternoon schedule.",
  },
  {
    id: "REQ-003",
    title: "Electrical Outlet Repair",
    service: "Electrical",
    location: "Barangay Tangub",
    budget: "₱800 - ₱1,500",
    posted: "Posted 2 days ago",
    description:
      "One outlet not working. Need inspection and fix. Safety first.",
  },
];

export default function RequestDetailsScreen() {
  const router = useRouter();
  const { requestId } = useLocalSearchParams<{ requestId: string }>();

  const req = useMemo(() => {
    return PLACEHOLDER_REQUESTS.find((r) => r.id === requestId) || null;
  }, [requestId]);

  const onApply = () => {
    Alert.alert(
      "Apply Now (Placeholder)",
      "Later connect this to your real apply/submit flow.",
    );
  };

  if (!req) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.topBar}>
          <TouchableOpacity
            activeOpacity={0.85}
            style={styles.iconBtn}
            onPress={() => router.back()}
          >
            <ChevronLeft size={22} color="#0f172a" />
          </TouchableOpacity>
          <Text style={styles.topTitle}>Request</Text>
          <View style={{ width: 44 }} />
        </View>

        <View style={styles.missingCard}>
          <Text style={styles.missingTitle}>Request not found</Text>
          <Text style={styles.missingSub}>
            This is placeholder data. Go back and choose another request.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.topBar}>
        <TouchableOpacity
          activeOpacity={0.85}
          style={styles.iconBtn}
          onPress={() => router.back()}
        >
          <ChevronLeft size={22} color="#0f172a" />
        </TouchableOpacity>

        <View style={{ flex: 1 }}>
          <Text style={styles.topTitle}>Request Details</Text>
          <Text style={styles.topSub}>{req.id}</Text>
        </View>

        <View style={{ width: 44 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.card}>
          <View style={styles.badge}>
            <Briefcase size={14} color={BLUE} />
            <Text style={styles.badgeText}>{req.service}</Text>
          </View>

          <Text style={styles.title}>{req.title}</Text>

          <View style={styles.metaRow}>
            <MapPin size={16} color="#64748b" />
            <Text style={styles.metaText}>{req.location}</Text>
            <Text style={styles.metaDot}>•</Text>
            <Text style={styles.budget}>{req.budget}</Text>
          </View>

          <Text style={styles.posted}>{req.posted}</Text>

          <Text style={styles.section}>Description</Text>
          <Text style={styles.desc}>{req.description}</Text>

          <TouchableOpacity
            activeOpacity={0.9}
            style={styles.applyBtn}
            onPress={onApply}
          >
            <Text style={styles.applyBtnText}>Apply Now</Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 18 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#f5f6fa" },

  topBar: {
    paddingHorizontal: 18,
    paddingTop: 10,
    paddingBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    columnGap: 12,
  },
  iconBtn: {
    width: 44,
    height: 44,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    backgroundColor: "#ffffff",
    alignItems: "center",
    justifyContent: "center",
  },
  topTitle: { fontSize: 18, fontWeight: "900", color: "#0f172a" },
  topSub: { marginTop: 2, fontSize: 12.5, color: "#64748b", fontWeight: "800" },

  scroll: { paddingHorizontal: 18, paddingBottom: 16 },

  card: {
    marginTop: 12,
    borderRadius: 16,
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#e5e9f2",
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },

  badge: {
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 12,
    height: 30,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#dbeafe",
    backgroundColor: "#eff6ff",
    marginBottom: 10,
  },
  badgeText: { fontSize: 12.5, fontWeight: "900", color: BLUE },

  title: { fontSize: 18, fontWeight: "900", color: "#0f172a" },

  metaRow: { marginTop: 8, flexDirection: "row", alignItems: "center", gap: 6 },
  metaText: { fontSize: 12.8, fontWeight: "800", color: "#475569" },
  metaDot: { color: "#cbd5e1", fontWeight: "900" },
  budget: { fontSize: 12.8, fontWeight: "900", color: "#0f172a" },

  posted: { marginTop: 8, fontSize: 12.2, fontWeight: "800", color: "#94a3b8" },

  section: { marginTop: 14, fontSize: 13, fontWeight: "900", color: "#0f172a" },
  desc: {
    marginTop: 6,
    fontSize: 13,
    fontWeight: "700",
    color: "#64748b",
    lineHeight: 19,
  },

  applyBtn: {
    marginTop: 18,
    height: 48,
    borderRadius: 999,
    backgroundColor: BLUE,
    alignItems: "center",
    justifyContent: "center",
  },
  applyBtnText: { fontSize: 14, fontWeight: "900", color: "#ffffff" },

  missingCard: {
    marginTop: 14,
    marginHorizontal: 18,
    borderRadius: 16,
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#e5e9f2",
    padding: 18,
    alignItems: "center",
  },
  missingTitle: { fontSize: 14.5, fontWeight: "900", color: "#0f172a" },
  missingSub: {
    marginTop: 6,
    fontSize: 12.8,
    fontWeight: "700",
    color: "#64748b",
    textAlign: "center",
    lineHeight: 18,
  },
});
