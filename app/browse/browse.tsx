// app/browse/browse.tsx
import { useLocalSearchParams, useRouter } from "expo-router";
import {
    ArrowLeft,
    CheckCircle2,
    MapPin,
    MessageCircle,
    Search,
    SlidersHorizontal,
    Star,
    X,
} from "lucide-react-native";
import React, { useEffect, useMemo, useState } from "react";
import {
    Alert,
    FlatList,
    Image,
    Platform,
    Pressable,
    SafeAreaView,
    Text,
    TextInput,
    View,
    useWindowDimensions,
} from "react-native";

/* ---------- Theme ---------- */
const C = {
  bg: "#ffffff",
  text: "#0f172a",
  sub: "#475569",
  blue: "#1e86ff",
  blueDark: "#0c62c9",
  inputBg: "#ffffff",
  inputBorder: "#d9e3f0",
  inputIcon: "#7b8aa0",
  placeholder: "#93a3b5",
  border: "#eef2f7",
  card: "#fff",
  chip: "#eef6ff",
  gold: "#f59e0b",
  success: "#16a34a",
};

const shadowSm = Platform.select({
  ios: { shadowColor: "#000", shadowOpacity: 0.06, shadowRadius: 8, shadowOffset: { width: 0, height: 4 } },
  android: { elevation: 2 },
  default: {},
});

/* ---------- Data types ---------- */
type WorkerItem = {
  id: string;
  name: string;
  role: string;
  rating: number;
  distanceKm: number;
  priceFrom: number;
  verified: boolean;
  jobsDone: number;
  createdAt: number;
  photoUri?: string | null;
};

/* ---------- Mock (swap with API) ---------- */
const NOW = Date.now();
const MOCK: WorkerItem[] = [
  { id: "1", name: "Ana Santos",  role: "Cleaning",   rating: 4.8, distanceKm: 1.2, priceFrom: 350, verified: true,  jobsDone: 142, createdAt: NOW - 1 * 86400000 },
  { id: "2", name: "Ben Cruz",    role: "Plumbing",   rating: 4.6, distanceKm: 3.8, priceFrom: 500, verified: true,  jobsDone:  90, createdAt: NOW - 4 * 86400000 },
  { id: "3", name: "Carlo D.",    role: "Electrical", rating: 4.7, distanceKm: 2.5, priceFrom: 600, verified: false, jobsDone:  81, createdAt: NOW - 2 * 86400000 },
  { id: "4", name: "Diane M.",    role: "Laundry",    rating: 4.9, distanceKm: 1.0, priceFrom: 300, verified: true,  jobsDone: 203, createdAt: NOW - 0.5 * 86400000 },
  { id: "5", name: "Evan R.",     role: "Car Wash",   rating: 4.4, distanceKm: 6.4, priceFrom: 250, verified: false, jobsDone:  47, createdAt: NOW - 8 * 86400000 },
  { id: "6", name: "Faye L.",     role: "Carpentry",  rating: 4.5, distanceKm: 5.2, priceFrom: 700, verified: true,  jobsDone:  66, createdAt: NOW - 3 * 86400000 },
];

/* ---------- Filters & Sorts ---------- */
const CATEGORIES = ["Cleaning", "Plumbing", "Electrical", "Laundry", "Car Wash", "Carpentry"] as const;
type Category = typeof CATEGORIES[number];

const SORTS = [
  "Relevance",
  "Near me",
  "Highest rated",
  "Newest",
  "Price: Low to High",
  "Price: High to Low",
] as const;
type SortKey = typeof SORTS[number];

export default function BrowsePage() {
  const router = useRouter();
  const params = useLocalSearchParams<{ q?: string }>();
  const { width } = useWindowDimensions();

  /* ----- 1 column, square tiles ----- */
  const H_PAD = 12;
  const tileSize = Math.floor(width - H_PAD * 2); // full width minus padding (square)

  /* ----- State ----- */
  const [q, setQ] = useState(params.q ? String(params.q) : "");
  const [selectedCats, setSelectedCats] = useState<Set<Category>>(new Set());
  const [sort, setSort] = useState<SortKey>("Relevance");
  const [verifiedOnly, setVerifiedOnly] = useState(false);

  useEffect(() => {
    if (params.q && String(params.q) !== q) setQ(String(params.q));
  }, [params.q]);

  /* ----- Filter + sort ----- */
  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    const pass = (item: WorkerItem) => {
      const matchQ = !query || item.name.toLowerCase().includes(query) || item.role.toLowerCase().includes(query);
      const matchCat = selectedCats.size === 0 || selectedCats.has(item.role as Category);
      const matchVer = !verifiedOnly || item.verified;
      return matchQ && matchCat && matchVer;
    };
    const base = MOCK.filter(pass);

    const relevanceScore = (it: WorkerItem) => {
      let score = 0;
      if (q.trim()) {
        const t = q.trim().toLowerCase();
        if (it.name.toLowerCase().includes(t)) score += 3;
        if (it.role.toLowerCase().includes(t)) score += 2;
      }
      score += it.rating * 0.2 + (it.verified ? 1 : 0) - it.distanceKm * 0.05;
      return score;
    };

    return [...base].sort((a, b) => {
      switch (sort) {
        case "Near me": return a.distanceKm - b.distanceKm;
        case "Highest rated": return b.rating - a.rating;
        case "Newest": return b.createdAt - a.createdAt;
        case "Price: Low to High": return a.priceFrom - b.priceFrom;
        case "Price: High to Low": return b.priceFrom - a.priceFrom;
        default: return relevanceScore(b) - relevanceScore(a);
      }
    });
  }, [q, selectedCats, verifiedOnly, sort]);

  const toggleCat = (cat: Category) => {
    const next = new Set(selectedCats);
    next.has(cat) ? next.delete(cat) : next.add(cat);
    setSelectedCats(next);
  };

  const clearAll = () => {
    setQ("");
    setSelectedCats(new Set());
    setSort("Relevance");
    setVerifiedOnly(false);
  };

  const activeFilterCount =
    (verifiedOnly ? 1 : 0) + (selectedCats.size ? 1 : 0) + (sort !== "Relevance" ? 1 : 0) + (q.trim() ? 1 : 0);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: C.bg }}>
      {/* Header */}
      <View
        style={{
          paddingHorizontal: H_PAD,
          paddingVertical: 10,
          borderBottomWidth: 1,
          borderBottomColor: C.border,
          backgroundColor: "#fff",
          flexDirection: "row",
          alignItems: "center",
          gap: 8,
        }}
      >
        <Pressable
          onPress={() => router.back()}
          hitSlop={8}
          style={{ width: 40, height: 40, borderRadius: 20, alignItems: "center", justifyContent: "center" }}
        >
          <ArrowLeft size={24} color={C.text} />
        </Pressable>

        {/* Search bar */}
        <View
          style={[
            {
              flex: 1,
              flexDirection: "row",
              alignItems: "center",
              backgroundColor: C.inputBg,
              borderWidth: 1,
              borderColor: C.inputBorder,
              borderRadius: 12,
              paddingHorizontal: 12,
              height: 44,
            },
            shadowSm,
          ]}
        >
          <Search color={C.inputIcon} size={18} />
          <TextInput
            value={q}
            onChangeText={setQ}
            placeholder="Search services or names"
            placeholderTextColor={C.placeholder}
            returnKeyType="search"
            style={{ flex: 1, marginLeft: 8, color: C.text, fontSize: 16 }}
          />
          {q.length > 0 && (
            <Pressable onPress={() => setQ("")} style={{ padding: 6 }}>
              <X color={C.inputIcon} size={18} />
            </Pressable>
          )}
        </View>
      </View>

      {/* Filters (wrap) */}
      <View style={{ paddingHorizontal: H_PAD, paddingTop: 10, paddingBottom: 6 }}>
        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
          <FilterChip
            label={verifiedOnly ? "Verified only ✓" : "Verified only"}
            active={verifiedOnly}
            onPress={() => setVerifiedOnly((v) => !v)}
          />
          {(SORTS as SortKey[]).map((s) => (
            <FilterChip
              key={s}
              label={s === "Price: Low to High" ? "Price ↑" : s === "Price: High to Low" ? "Price ↓" : s}
              active={sort === s}
              onPress={() => setSort(s)}
              icon={s === "Relevance" ? <SlidersHorizontal size={14} color={sort === s ? C.blue : C.sub} /> : undefined}
            />
          ))}
        </View>

        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 10 }}>
          {CATEGORIES.map((cat) => (
            <CategoryChip key={cat} label={cat} active={selectedCats.has(cat)} onPress={() => toggleCat(cat)} />
          ))}
          {activeFilterCount > 0 && (
            <Pressable
              onPress={clearAll}
              style={{
                borderWidth: 1, borderColor: C.inputBorder, backgroundColor: "#fff",
                borderRadius: 999, paddingHorizontal: 12, height: 34,
                alignItems: "center", justifyContent: "center",
              }}
            >
              <Text style={{ color: C.sub, fontSize: 12 }}>Clear all ({activeFilterCount})</Text>
            </Pressable>
          )}
        </View>
      </View>

      {/* Results header */}
      <View style={{ paddingHorizontal: H_PAD, paddingVertical: 8 }}>
        <Text style={{ color: C.sub, fontSize: 12 }}>
          {filtered.length} result{filtered.length !== 1 ? "s" : ""}{q ? ` for “${q}”` : ""}
        </Text>
      </View>

      {/* 1×1 vertical list; each card is square */}
      <FlatList
        data={filtered}
        keyExtractor={(it) => it.id}
        contentContainerStyle={{ paddingHorizontal: H_PAD, paddingBottom: 24, rowGap: 12 }}
        renderItem={({ item }) => (
          <SquareCard
            item={item}
            size={tileSize}
            onChat={() => router.push({ pathname: "/chat/Chat", params: { to: item.name } })}
          />
        )}
      />
    </SafeAreaView>
  );
}

/* ---------- UI Bits ---------- */

function FilterChip({
  label,
  onPress,
  active,
  icon,
}: {
  label: string;
  onPress: () => void;
  active?: boolean;
  icon?: React.ReactNode;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={{
        borderWidth: 1,
        borderColor: active ? C.blue : C.inputBorder,
        backgroundColor: active ? C.chip : "#fff",
        borderRadius: 999,
        paddingHorizontal: 12,
        height: 34,
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "row",
        gap: 6,
      }}
    >
      {icon}
      <Text style={{ color: active ? C.blue : C.sub, fontSize: 12, fontWeight: "600" }}>{label}</Text>
    </Pressable>
  );
}

function CategoryChip({
  label,
  active,
  onPress,
}: {
  label: string;
  active?: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={{
        borderWidth: 1.5,
        borderColor: active ? C.blue : C.inputBorder,
        backgroundColor: active ? C.chip : "#fff",
        borderRadius: 999,
        paddingHorizontal: 14,
        height: 36,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Text style={{ color: active ? C.blue : C.text, fontSize: 13, fontWeight: "700" }}>{label}</Text>
    </Pressable>
  );
}

/* Square 1×1 card with placeholder image */
function SquareCard({
  item,
  size,
  onChat,
}: {
  item: WorkerItem;
  size: number;
  onChat: () => void;
}) {
  // Unique placeholder per item (swap to item.photoUri when you have real images)
  const img = item.photoUri || `https://picsum.photos/seed/jd-${encodeURIComponent(item.id)}/800/800`;

  // Split the square: top image ~60%, bottom details ~40%
  const imageH = Math.round(size * 0.6);
  const bottomH = size - imageH;

  return (
    <View
      style={[
        {
          width: size,
          height: size,               // keep the tile perfectly square
          backgroundColor: C.card,
          borderRadius: 16,
          borderWidth: 1,
          borderColor: C.inputBorder,
          overflow: "hidden",
        },
        shadowSm,
      ]}
    >
      {/* Placeholder image */}
      <Image
        source={{ uri: img }}
        style={{ width: "100%", height: imageH }}
        resizeMode="cover"
      />

      {/* Bottom content */}
      <View style={{ height: bottomH, padding: 12 }}>
        {/* Top row: name + verified */}
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
          <Text numberOfLines={1} style={{ color: C.text, fontSize: 15, fontWeight: "900", flex: 1, marginRight: 6 }}>
            {item.name}
          </Text>
          {item.verified ? <CheckCircle2 size={16} color={C.success} /> : null}
        </View>

        <Text numberOfLines={1} style={{ color: C.sub, marginTop: 2 }}>{item.role}</Text>

        <View style={{ flexDirection: "row", alignItems: "center", gap: 6, marginTop: 8 }}>
          <Star size={16} color={C.gold} />
          <Text style={{ color: C.text, fontWeight: "800" }}>{item.rating.toFixed(1)}</Text>
          <Text style={{ color: C.sub }}>({item.jobsDone}+)</Text>
        </View>

        <View style={{ flex: 1 }} />

        {/* Bottom meta + CTA */}
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
            <MapPin size={14} color={C.sub} />
            <Text style={{ color: C.text, fontSize: 12 }}>{item.distanceKm.toFixed(1)} km</Text>
          </View>
          <Text style={{ color: C.text, fontSize: 12, fontWeight: "800" }}>From ₱{item.priceFrom}</Text>
        </View>

        <View style={{ flexDirection: "row", gap: 8 }}>
          <Pressable
            onPress={onChat}
            style={({ pressed }) => ({
              flex: 1,
              backgroundColor: pressed ? C.blueDark : C.blue,
              height: 36,
              borderRadius: 9,
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "row",
              gap: 6,
            })}
          >
            <MessageCircle size={16} color="#fff" />
            <Text style={{ color: "#fff", fontWeight: "800", fontSize: 12 }}>Chat</Text>
          </Pressable>

          <Pressable
            onPress={() => Alert.alert("Request sent", `We'll notify ${item.name} about your request.`)}
            style={{
              width: 36,
              height: 36,
              borderRadius: 9,
              borderWidth: 1,
              borderColor: C.inputBorder,
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "#fff",
            }}
          >
            <Text style={{ color: C.text, fontWeight: "900", fontSize: 14 }}>+</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}
