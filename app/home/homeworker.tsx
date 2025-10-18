import { useRouter, type Href } from "expo-router";
import { Briefcase, FileText, Menu, Pencil, Search, Star, X } from "lucide-react-native";
import { useEffect, useRef, useState } from "react";
import {
  Dimensions,
  Image,
  Modal,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  View,
} from "react-native";

const { width } = Dimensions.get("window");
const LOGO = require("../../assets/jdklogo.png");

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
  dotActive: "#1e86ff",
  dot: "#c9d3e2",
  chip: "#eef6ff",
};

const SEARCH_TOP_OFFSET =
  (Platform.OS === "android" ? StatusBar.currentHeight || 0 : 0) + 24; // push the search sheet below top

const CARDS = [
  { title: "Welcome to JD HOMECARE", subtitle: "Find nearby jobs and start earning", bg: "#eaf3ff" },
  { title: "Verified Clients", subtitle: "We vet job posters for safety", bg: "#f3f7ff" },
  { title: "Fast Payouts", subtitle: "Get paid securely after each job", bg: "#eef8ff" },
];

const WORKERS = [
  { name: "Ana Santos", role: "House Cleaning", rating: 4.8 },
  { name: "Ben Cruz", role: "Plumber", rating: 4.6 },
  { name: "Carlo D.", role: "Electrician", rating: 4.7 },
  { name: "Diane M.", role: "Laundry", rating: 4.9 },
  { name: "Evan R.", role: "Carpenter", rating: 4.5 },
  { name: "Faye L.", role: "Car Wash", rating: 4.4 },
];

export default function WorkerHome() {
  const router = useRouter();

  /* ---------------- Search Sheet ---------------- */
  const [showSearch, setShowSearch] = useState(false);
  const [q, setQ] = useState("");
  const handleSearch = () => {
    const query = q.trim();
    if (!query) return setShowSearch(false);
    router.push({ pathname: "/home/homeworker", params: { q: query } } as Href);
    setShowSearch(false);
  };

  /* ---------------- Hero Carousel (auto) ---------------- */
  const heroRef = useRef<ScrollView>(null);
  const [heroIdx, setHeroIdx] = useState(0);
  const onHeroScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const idx = Math.round(e.nativeEvent.contentOffset.x / width);
    if (idx !== heroIdx) setHeroIdx(idx);
  };
  useEffect(() => {
    const id = setInterval(() => {
      const next = (heroIdx + 1) % CARDS.length;
      heroRef.current?.scrollTo({ x: next * width, y: 0, animated: true });
      setHeroIdx(next);
    }, 4000);
    return () => clearInterval(id);
  }, [heroIdx]);

  /* ---------------- Workers Carousel (auto) ---------------- */
  const WORK_CARD_W = Math.min(260, width * 0.72);
  const WORK_GAP = 12;
  const workRef = useRef<ScrollView>(null);
  const [workIdx, setWorkIdx] = useState(0);
  const onWorkScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const idx = Math.round(e.nativeEvent.contentOffset.x / (WORK_CARD_W + WORK_GAP));
    if (idx !== workIdx) setWorkIdx(idx);
  };
  useEffect(() => {
    const id = setInterval(() => {
      const next = (workIdx + 1) % WORKERS.length;
      workRef.current?.scrollTo({ x: next * (WORK_CARD_W + WORK_GAP), y: 0, animated: true });
      setWorkIdx(next);
    }, 3500);
    return () => clearInterval(id);
  }, [workIdx]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: C.bg }}>
      {/* HEADER (compact, search icon only) */}
      <View
        style={{
          paddingHorizontal: 12,
          paddingTop: 4,
          paddingBottom: 8,
          borderBottomWidth: 1,
          borderBottomColor: C.border,
          backgroundColor: "#fff",
          position: "relative",
        }}
      >
        {/* Centered logo */}
        <View
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 4,
            alignItems: "center",
          }}
          pointerEvents="none"
        >
          <Image
            source={LOGO}
            style={{
              width: Math.min(width * 0.65, 260),
              height: 48,
              resizeMode: "contain",
            }}
          />
        </View>

        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
          {/* Left: menu */}
          <Pressable
            onPress={() => {}}
            hitSlop={8}
            style={{ width: 40, height: 40, borderRadius: 20, alignItems: "center", justifyContent: "center" }}
          >
            <Menu color={C.text} size={24} strokeWidth={2.5} />
          </Pressable>

          {/* Right: search icon (opens sheet) */}
          <Pressable
            onPress={() => setShowSearch(true)}
            hitSlop={8}
            style={{ width: 40, height: 40, borderRadius: 20, alignItems: "center", justifyContent: "center" }}
          >
            <Search color={C.text} size={22} strokeWidth={2.5} />
          </Pressable>
        </View>
      </View>

      {/* BODY */}
      <ScrollView contentContainerStyle={{ paddingBottom: 28 }} showsVerticalScrollIndicator={false}>
        {/* Carousel (auto) */}
        <View style={{ marginTop: 12 }}>
          <ScrollView
            ref={heroRef}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={onHeroScroll}
            scrollEventThrottle={16}
          >
            {CARDS.map((c, i) => (
              <View key={i} style={{ width, paddingHorizontal: 16 }}>
                <View
                  style={{
                    backgroundColor: c.bg,
                    borderWidth: 1,
                    borderColor: C.inputBorder,
                    borderRadius: 20,
                    paddingVertical: 22,
                    paddingHorizontal: 18,
                    shadowColor: "#000",
                    shadowOpacity: Platform.OS === "android" ? 0 : 0.06,
                    shadowRadius: 12,
                    shadowOffset: { width: 0, height: 6 },
                  }}
                >
                  <Text style={{ color: C.text, fontWeight: "900", fontSize: 18, marginBottom: 6 }}>
                    {c.title}
                  </Text>
                  <Text style={{ color: C.sub }}>{c.subtitle}</Text>
                </View>
              </View>
            ))}
          </ScrollView>

          {/* dots */}
          <View style={{ flexDirection: "row", justifyContent: "center", marginTop: 10, gap: 6 }}>
            {CARDS.map((_, i) => (
              <View
                key={i}
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: i === heroIdx ? C.dotActive : C.dot,
                }}
              />
            ))}
          </View>
        </View>

        {/* Become a worker callout */}
        <View style={{ marginTop: 16, paddingHorizontal: 16 }}>
          <View
            style={{
              backgroundColor: C.card,
              borderWidth: 1,
              borderColor: C.inputBorder,
              borderRadius: 20,
              paddingVertical: 24,
              paddingHorizontal: 18,
              alignItems: "center",
            }}
          >
            <View
              style={{
                width: 96,
                height: 96,
                borderRadius: 24,
                backgroundColor: C.chip,
                borderWidth: 1,
                borderColor: C.inputBorder,
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 12,
              }}
            >
              <FileText color={C.blue} size={40} />
              <Pencil color={C.blueDark} size={20} style={{ position: "absolute", right: 18, bottom: 18 }} />
            </View>

            <Text style={{ color: C.sub, textAlign: "center", marginBottom: 14 }}>
              Start by posting your application to get hired for home service jobs.
            </Text>

            <Pressable
              onPress={() => router.push({ pathname: "/WokerForms/WorkerForms1" } as Href)}
              style={({ pressed }) => ({
                borderWidth: 1.5,
                borderColor: C.blue,
                paddingVertical: 12,
                paddingHorizontal: 18,
                borderRadius: 10,
                backgroundColor: pressed ? "#eff6ff" : "#fff",
              })}
            >
              <Text style={{ color: C.blue, fontWeight: "800" }}>+ Become a worker</Text>
            </Pressable>
          </View>
        </View>

        {/* Posted Workers (slider with 6 placeholders, auto) */}
        <View style={{ marginTop: 18 }}>
          <View style={{ paddingHorizontal: 16, marginBottom: 8 }}>
            <Text style={{ color: C.text, fontWeight: "900", fontSize: 18 }}>Posted Workers</Text>
          </View>

          <ScrollView
            ref={workRef}
            horizontal
            showsHorizontalScrollIndicator={false}
            onScroll={onWorkScroll}
            scrollEventThrottle={16}
            contentContainerStyle={{ paddingLeft: 16, paddingRight: 8 }}
            snapToInterval={WORK_CARD_W + WORK_GAP}
            decelerationRate="fast"
          >
            {WORKERS.map((w, i) => (
              <View
                key={i}
                style={{
                  width: WORK_CARD_W,
                  marginRight: WORK_GAP,
                  backgroundColor: "#fff",
                  borderWidth: 1,
                  borderColor: C.inputBorder,
                  borderRadius: 16,
                  padding: 14,
                  shadowColor: "#000",
                  shadowOpacity: Platform.OS === "android" ? 0 : 0.05,
                  shadowRadius: 10,
                  shadowOffset: { width: 0, height: 6 },
                }}
              >
                {/* avatar placeholder */}
                <View
                  style={{
                    width: 56,
                    height: 56,
                    borderRadius: 28,
                    backgroundColor: "#f1f5f9",
                    borderWidth: 1,
                    borderColor: C.inputBorder,
                    marginBottom: 10,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Briefcase color={C.inputIcon} size={22} />
                </View>

                <Text style={{ color: C.text, fontWeight: "900", fontSize: 16 }}>{w.name}</Text>
                <Text style={{ color: C.sub, marginTop: 2, marginBottom: 10 }}>{w.role}</Text>

                <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 12 }}>
                  <Star color="#f59e0b" size={16} />
                  <Text style={{ color: C.text, fontWeight: "800", marginLeft: 6 }}>{w.rating.toFixed(1)}</Text>
                  <Text style={{ color: C.sub, marginLeft: 6 }}>(120+ jobs)</Text>
                </View>

                <Pressable
                  onPress={() => {}}
                  style={({ pressed }) => ({
                    backgroundColor: pressed ? C.blueDark : C.blue,
                    paddingVertical: 10,
                    borderRadius: 10,
                    alignItems: "center",
                  })}
                >
                  <Text style={{ color: "#fff", fontWeight: "800" }}>View Profile</Text>
                </Pressable>
              </View>
            ))}
          </ScrollView>
        </View>
      </ScrollView>

      {/* SEARCH SHEET (pop-out, lowered from top) */}
      <Modal visible={showSearch} transparent animationType="fade" onRequestClose={() => setShowSearch(false)}>
        {/* dim background */}
        <Pressable onPress={() => setShowSearch(false)} style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.35)" }}>
          {/* floating search card */}
          <Pressable
            onPress={() => {}}
            style={{
              marginTop: SEARCH_TOP_OFFSET,
              marginHorizontal: 12,
              backgroundColor: "#fff",
              paddingHorizontal: 14,
              paddingVertical: 12,
              borderRadius: 16,
              borderWidth: 1,
              borderColor: C.border,
              shadowColor: "#000",
              shadowOpacity: Platform.OS === "android" ? 0 : 0.08,
              shadowRadius: 12,
              shadowOffset: { width: 0, height: 6 },
              elevation: 3,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                backgroundColor: C.inputBg,
                borderWidth: 1,
                borderColor: C.inputBorder,
                borderRadius: 12,
                paddingHorizontal: 12,
                height: 44,
              }}
            >
              <Search color={C.inputIcon} size={18} strokeWidth={2.25} />
              <TextInput
                value={q}
                onChangeText={setQ}
                placeholder="Search requests"
                placeholderTextColor={C.placeholder}
                autoFocus
                returnKeyType="search"
                onSubmitEditing={handleSearch}
                style={{ flex: 1, color: C.text, marginLeft: 8, fontSize: 16 }}
              />
              <Pressable onPress={() => setShowSearch(false)} style={{ padding: 6, marginLeft: 6 }}>
                <X color={C.inputIcon} size={18} />
              </Pressable>
            </View>

            {/* Quick filters (optional) */}
            <View style={{ flexDirection: "row", marginTop: 10, columnGap: 8 }}>
              {["Near me", "Highest rated", "Newest"].map((t) => (
                <Pressable
                  key={t}
                  onPress={() => {
                    setQ(t);
                    handleSearch();
                  }}
                  style={{
                    paddingHorizontal: 10,
                    paddingVertical: 8,
                    borderRadius: 999,
                    borderWidth: 1,
                    borderColor: C.inputBorder,
                    backgroundColor: "#f8fbff",
                  }}
                >
                  <Text style={{ color: C.sub, fontSize: 12 }}>{t}</Text>
                </Pressable>
              ))}
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
}
