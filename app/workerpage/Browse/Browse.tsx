// app/workerpage/Browse/Browse.tsx
import { useRouter } from "expo-router";
import { Briefcase, Eye, Filter, MapPin, Star } from "lucide-react-native";
import React, { useMemo, useState } from "react";
import {
  Alert,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import BottomNav from "../nav/bottomnav/BottomNav";

const BLUE = "#1E88E5";

type ServiceFilter =
  | "All"
  | "Carwash"
  | "Plumbing"
  | "Carpentry"
  | "Laundry"
  | "Electrician";

type RequestItem = {
  id: string;
  title: string;
  service: Exclude<ServiceFilter, "All">;
  location: string;
  budget: string;
  posted: string;
  description: string;
  rating: number; // 0-5
};

const PLACEHOLDER_REQUESTS: RequestItem[] = [
  {
    id: "REQ-001",
    title: "Car Wash (Sedan) - Home Service",
    service: "Carwash",
    location: "Bacolod City",
    budget: "₱250 - ₱400",
    posted: "Posted today",
    description:
      "Need basic exterior wash and vacuum. Prefer morning schedule.",
    rating: 4.6,
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
    rating: 4.2,
  },
  {
    id: "REQ-003",
    title: "Door Hinge & Cabinet Repair",
    service: "Carpentry",
    location: "Barangay Tangub",
    budget: "₱700 - ₱1,400",
    posted: "Posted 2 days ago",
    description:
      "Cabinet door sagging and hinge needs replacement. Quick repair requested.",
    rating: 4.8,
  },
  {
    id: "REQ-004",
    title: "Laundry Help (Wash & Fold)",
    service: "Laundry",
    location: "Mandalagan",
    budget: "₱350 - ₱650",
    posted: "Posted 3 days ago",
    description:
      "Need wash & fold for clothes (approx 1 load). Pickup/drop-off preferred.",
    rating: 4.1,
  },
  {
    id: "REQ-005",
    title: "Install Light Fixture",
    service: "Electrician",
    location: "Singcang-Airport",
    budget: "₱500 - ₱900",
    posted: "Posted 4 days ago",
    description:
      "Replace old ceiling light with new fixture. Please bring basic tools.",
    rating: 4.9,
  },
];

function Stars({ rating }: { rating: number }) {
  const full = Math.floor(rating);
  const hasHalf = rating - full >= 0.5;
  const total = 5;

  return (
    <View style={styles.starsRow}>
      {Array.from({ length: total }).map((_, i) => {
        const idx = i + 1;
        const filled = idx <= full;
        const half = !filled && hasHalf && idx === full + 1;

        return (
          <View key={i} style={{ position: "relative" }}>
            <Star
              size={14}
              color={filled || half ? "#f59e0b" : "#cbd5e1"}
              fill={filled ? "#f59e0b" : "none"}
            />
            {half ? (
              <View style={styles.halfStarMask}>
                <Star size={14} color="#f59e0b" fill="#f59e0b" />
              </View>
            ) : null}
          </View>
        );
      })}
      <Text style={styles.ratingText}>{rating.toFixed(1)}</Text>
    </View>
  );
}

export default function BrowseRequestsScreen() {
  const router = useRouter();
  const [search, setSearch] = useState("");

  // ✅ Filter state
  const [filterOpen, setFilterOpen] = useState(false);
  const [serviceFilter, setServiceFilter] = useState<ServiceFilter>("All");

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();

    return PLACEHOLDER_REQUESTS.filter((r) => {
      const matchesSearch = !q
        ? true
        : `${r.id} ${r.title} ${r.service} ${r.location}`
            .toLowerCase()
            .includes(q);

      const matchesFilter =
        serviceFilter === "All" ? true : r.service === serviceFilter;

      return matchesSearch && matchesFilter;
    });
  }, [search, serviceFilter]);

  const onApply = (req: RequestItem) => {
    Alert.alert(
      "Apply Now (Placeholder)",
      `You tapped Apply for:\n${req.title}\n\nLater you can connect this to your real apply flow.`,
    );
  };

  const clearFilters = () => {
    setServiceFilter("All");
    setSearch("");
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.root}>
        {/* ✅ Header with Logo + Title */}
        <View style={styles.header}>
          <Image
            source={require("../../../image/jdklogo.png")}
            style={styles.logo}
          />
          <Text style={styles.headerTitle}>Browse Requests</Text>
          <Text style={styles.headerSub}>
            Available client service requests
          </Text>
        </View>

        {/* ✅ Search + Filter Row */}
        <View style={styles.searchRow}>
          <View style={styles.searchWrap}>
            <TextInput
              value={search}
              onChangeText={setSearch}
              placeholder="Search request, service, location..."
              placeholderTextColor="#9ca3af"
              style={styles.searchInput}
            />
          </View>

          <TouchableOpacity
            activeOpacity={0.9}
            style={styles.filterBtn}
            onPress={() => setFilterOpen((v) => !v)}
          >
            <Filter size={18} color={BLUE} />
            <Text style={styles.filterBtnText}>Filter</Text>
          </TouchableOpacity>
        </View>

        {/* ✅ Filter pills */}
        {filterOpen ? (
          <View style={styles.filterPillsWrap}>
            {(
              [
                "All",
                "Carwash",
                "Plumbing",
                "Carpentry",
                "Laundry",
                "Electrician",
              ] as ServiceFilter[]
            ).map((k) => {
              const active = serviceFilter === k;
              return (
                <TouchableOpacity
                  key={k}
                  activeOpacity={0.9}
                  style={[styles.pill, active && styles.pillActive]}
                  onPress={() => setServiceFilter(k)}
                >
                  <Text
                    style={[styles.pillText, active && styles.pillTextActive]}
                  >
                    {k}
                  </Text>
                </TouchableOpacity>
              );
            })}

            <TouchableOpacity
              activeOpacity={0.9}
              style={styles.clearBtn}
              onPress={clearFilters}
            >
              <Text style={styles.clearBtnText}>Clear</Text>
            </TouchableOpacity>
          </View>
        ) : null}

        <ScrollView
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
        >
          {/* results count */}
          <View style={styles.resultsRow}>
            <Text style={styles.resultsText}>
              Showing{" "}
              <Text style={styles.resultsStrong}>{filtered.length}</Text>{" "}
              request{filtered.length === 1 ? "" : "s"}
            </Text>

            {serviceFilter !== "All" ? (
              <View style={styles.activeFilterTag}>
                <Text style={styles.activeFilterText}>{serviceFilter}</Text>
              </View>
            ) : null}
          </View>

          {filtered.length === 0 ? (
            <View style={styles.emptyCard}>
              <Text style={styles.emptyTitle}>No results</Text>
              <Text style={styles.emptySub}>
                Try a different keyword or clear filters.
              </Text>
            </View>
          ) : (
            filtered.map((req) => (
              <View key={req.id} style={styles.card}>
                <View style={styles.cardTopRow}>
                  <View style={styles.badgeRow}>
                    <View style={styles.badge}>
                      <Briefcase size={14} color={BLUE} />
                      <Text style={styles.badgeText}>{req.service}</Text>
                    </View>

                    <View style={{ alignItems: "flex-end", gap: 4 }}>
                      <Text style={styles.posted}>{req.posted}</Text>
                      <Stars rating={req.rating} />
                    </View>
                  </View>

                  <Text style={styles.reqTitle}>{req.title}</Text>

                  <View style={styles.metaRow}>
                    <MapPin size={16} color="#64748b" />
                    <Text style={styles.metaText}>{req.location}</Text>
                    <Text style={styles.metaDot}>•</Text>

                    {/* price highlight */}
                    <View style={styles.priceChip}>
                      <Text style={styles.priceChipText}>{req.budget}</Text>
                    </View>
                  </View>

                  <Text style={styles.desc} numberOfLines={2}>
                    {req.description}
                  </Text>
                </View>

                <View style={styles.btnRow}>
                  <TouchableOpacity
                    activeOpacity={0.9}
                    style={styles.viewBtn}
                    onPress={() =>
                      router.push(`./workerpage/Browse/ViewDetails`)
                    }
                  >
                    <Eye size={16} color={BLUE} />
                    <Text style={styles.viewBtnText}>View</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    activeOpacity={0.9}
                    style={styles.applyBtn}
                    onPress={() => onApply(req)}
                  >
                    <Text style={styles.applyBtnText}>Apply Now</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))
          )}

          <View style={{ height: 18 }} />
        </ScrollView>

        <BottomNav active="browse" />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#f5f6fa" },
  root: { flex: 1, backgroundColor: "#f5f6fa" },

  header: {
    paddingHorizontal: 18,
    paddingTop: 10,
    paddingBottom: 8,
    alignItems: "center",
  },
  logo: { width: 190, height: 42, resizeMode: "contain" },
  headerTitle: {
    marginTop: 10,
    fontSize: 18,
    fontWeight: "900",
    color: "#0f172a",
  },
  headerSub: {
    marginTop: 3,
    fontSize: 12.5,
    color: "#64748b",
    fontWeight: "700",
  },

  searchRow: {
    paddingHorizontal: 18,
    paddingBottom: 10,
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
  },
  searchWrap: { flex: 1 },
  searchInput: {
    height: 48,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    backgroundColor: "#ffffff",
    paddingHorizontal: 14,
    fontSize: 14,
    color: "#0f172a",
    fontWeight: "700",
  },
  filterBtn: {
    height: 48,
    paddingHorizontal: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#dbeafe",
    backgroundColor: "#ffffff",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  filterBtnText: { fontSize: 13, fontWeight: "900", color: BLUE },

  filterPillsWrap: {
    paddingHorizontal: 18,
    paddingBottom: 6,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    alignItems: "center",
  },
  pill: {
    paddingHorizontal: 12,
    height: 34,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    backgroundColor: "#ffffff",
    alignItems: "center",
    justifyContent: "center",
  },
  pillActive: { borderColor: BLUE, backgroundColor: "#e5f0ff" },
  pillText: { fontSize: 12.5, fontWeight: "900", color: "#475569" },
  pillTextActive: { color: BLUE },

  clearBtn: {
    marginLeft: "auto",
    height: 34,
    paddingHorizontal: 12,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#fee2e2",
    backgroundColor: "#fef2f2",
    alignItems: "center",
    justifyContent: "center",
  },
  clearBtnText: { fontSize: 12.5, fontWeight: "900", color: "#b91c1c" },

  scroll: { paddingHorizontal: 18, paddingBottom: 16 },

  resultsRow: {
    marginTop: 2,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  resultsText: { fontSize: 12.5, fontWeight: "800", color: "#64748b" },
  resultsStrong: { fontWeight: "900", color: "#0f172a" },

  activeFilterTag: {
    paddingHorizontal: 10,
    height: 26,
    borderRadius: 999,
    backgroundColor: "#e5f0ff",
    borderWidth: 1,
    borderColor: "#dbeafe",
    alignItems: "center",
    justifyContent: "center",
  },
  activeFilterText: { fontSize: 12, fontWeight: "900", color: BLUE },

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

  cardTopRow: { gap: 8 },

  badgeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 12,
    height: 30,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#dbeafe",
    backgroundColor: "#eff6ff",
  },
  badgeText: { fontSize: 12.5, fontWeight: "900", color: BLUE },
  posted: { fontSize: 12, fontWeight: "800", color: "#94a3b8" },

  starsRow: { flexDirection: "row", alignItems: "center", gap: 4 },
  ratingText: {
    marginLeft: 6,
    fontSize: 12,
    fontWeight: "900",
    color: "#0f172a",
  },
  halfStarMask: {
    position: "absolute",
    left: 0,
    top: 0,
    width: 7,
    height: 14,
    overflow: "hidden",
  },

  reqTitle: { fontSize: 15.5, fontWeight: "900", color: "#0f172a" },

  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    flexWrap: "wrap",
  },
  metaText: { fontSize: 12.5, fontWeight: "800", color: "#475569" },
  metaDot: { color: "#cbd5e1", fontWeight: "900" },

  priceChip: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
    backgroundColor: "#ecfdf5",
    borderWidth: 1,
    borderColor: "#bbf7d0",
  },
  priceChipText: { fontSize: 12.5, fontWeight: "900", color: "#065f46" },

  desc: { fontSize: 12.8, color: "#64748b", fontWeight: "700", lineHeight: 18 },

  btnRow: { marginTop: 12, flexDirection: "row", gap: 10 },

  viewBtn: {
    flex: 1,
    height: 46,
    borderRadius: 999,
    borderWidth: 1.6,
    borderColor: BLUE,
    backgroundColor: "#ffffff",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8,
  },
  viewBtnText: { fontSize: 13.5, fontWeight: "900", color: BLUE },

  applyBtn: {
    flex: 1,
    height: 46,
    borderRadius: 999,
    backgroundColor: BLUE,
    alignItems: "center",
    justifyContent: "center",
  },
  applyBtnText: { fontSize: 13.5, fontWeight: "900", color: "#ffffff" },

  emptyCard: {
    marginTop: 14,
    borderRadius: 16,
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#e5e9f2",
    padding: 18,
    alignItems: "center",
  },
  emptyTitle: { fontSize: 14.5, fontWeight: "900", color: "#0f172a" },
  emptySub: {
    marginTop: 6,
    fontSize: 12.8,
    fontWeight: "700",
    color: "#64748b",
    textAlign: "center",
    lineHeight: 18,
  },
});
