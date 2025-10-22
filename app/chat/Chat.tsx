import { useRouter, type Href } from "expo-router";
import { Bell } from "lucide-react-native";
import { useMemo } from "react";
import {
  Dimensions,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Text,
  View,
} from "react-native";

const { width } = Dimensions.get("window");

const C = {
  bg: "#f7f9fc",
  card: "#ffffff",
  text: "#0f172a",
  sub: "#64748b",
  blue: "#1e86ff",
  border: "#e6eef7",
  chip: "#eaf4ff",
};

type Row = {
  id: string;
  name: string;
  preview: string;
  time: string;
  unread: number;
  color: string; // avatar background
  initial?: string;
};

const PLACEHOLDER: Row[] = [
  { id: "1", name: "Nola Sofyan", preview: "Dimanaaaa", time: "14:23 PM", unread: 2, color: "#d0f4de", initial: "N" },
  { id: "2", name: "Abdul Mughni", preview: "https://www.figma.com/file/…", time: "13:03 PM", unread: 1, color: "#fde2e4", initial: "A" },
  { id: "3", name: "Vito Arvy", preview: "Cek Figma ya", time: "12:23 PM", unread: 0, color: "#e2f0ff", initial: "V" },
  { id: "4", name: "Nora", preview: "za pinjam motor", time: "11:23 PM", unread: 0, color: "#ede7ff", initial: "N" },
  { id: "5", name: "Farhan Bagas", preview: "Gas han!", time: "09:50 PM", unread: 4, color: "#fff1cf", initial: "F" },
  { id: "6", name: "Adhitya Putra", preview: "https://meet.com/…", time: "09:09 PM", unread: 3, color: "#ffe0e0", initial: "A" },
];

export default function Chat() {
  const router = useRouter();

  const rows = useMemo(() => PLACEHOLDER, []);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: C.bg }}>
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View
        style={{
          backgroundColor: "#fff",
          paddingHorizontal: 16,
          paddingTop: 8,
          paddingBottom: 14,
          borderBottomWidth: 1,
          borderBottomColor: C.border,
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
          {/* Small avatar (placeholder) */}
          <View
            style={{
              width: 36,
              height: 36,
              borderRadius: 18,
              backgroundColor: "#ffe8d6",
              alignItems: "center",
              justifyContent: "center",
              borderWidth: 1,
              borderColor: C.border,
            }}
          >
            <Text style={{ color: C.text, fontWeight: "800" }}>😊</Text>
          </View>

          {/* Segmented control with only “Message” */}
          <View
            style={{
              flexDirection: "row",
              backgroundColor: C.chip,
              borderRadius: 999,
              padding: 4,
              borderWidth: 1,
              borderColor: C.border,
              width: Math.min(260, width * 0.6),
              justifyContent: "center",
            }}
          >
            <View
              style={{
                paddingVertical: 8,
                paddingHorizontal: 18,
                borderRadius: 999,
                backgroundColor: C.blue,
                shadowColor: "#000",
                shadowOpacity: Platform.OS === "android" ? 0 : 0.08,
                shadowRadius: 8,
                shadowOffset: { width: 0, height: 3 },
              }}
            >
              <Text style={{ color: "#fff", fontWeight: "800" }}>Message</Text>
            </View>
          </View>

          {/* Bell */}
          <Pressable
            onPress={() => {}}
            style={{ width: 36, height: 36, alignItems: "center", justifyContent: "center" }}
          >
            <Bell color={C.text} size={22} />
          </Pressable>
        </View>
      </View>

      {/* List */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingTop: 10, paddingBottom: 18 }}
      >
        {rows.map((row) => (
          <Pressable
            key={row.id}
            onPress={() =>
              router.push({ pathname: "/chat/Messaging", params: { name: row.name } } as Href)
            }
            style={({ pressed }) => ({
              opacity: pressed ? 0.92 : 1,
              marginHorizontal: 16,
              marginBottom: 12,
              backgroundColor: C.card,
              borderWidth: 1,
              borderColor: C.border,
              borderRadius: 18,
              paddingVertical: 12,
              paddingHorizontal: 12,
              flexDirection: "row",
              alignItems: "center",
              shadowColor: "#000",
              shadowOpacity: Platform.OS === "android" ? 0 : 0.06,
              shadowRadius: 12,
              shadowOffset: { width: 0, height: 6 },
              elevation: 1,
            })}
          >
            {/* Avatar */}
            <View
              style={{
                width: 44,
                height: 44,
                borderRadius: 22,
                backgroundColor: row.color,
                alignItems: "center",
                justifyContent: "center",
                borderWidth: 1,
                borderColor: C.border,
              }}
            >
              <Text style={{ color: C.text, fontWeight: "900" }}>{row.initial || "🙂"}</Text>
            </View>

            {/* Texts */}
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text
                numberOfLines={1}
                style={{ color: C.text, fontWeight: "900", fontSize: 16 }}
              >
                {row.name}
              </Text>
              <Text
                numberOfLines={1}
                style={{ color: C.sub, marginTop: 4 }}
              >
                {row.preview}
              </Text>
            </View>

            {/* Right meta */}
            <View style={{ alignItems: "flex-end" }}>
              <Text style={{ color: C.sub, fontSize: 12 }}>{row.time}</Text>
              {row.unread > 0 ? (
                <View
                  style={{
                    marginTop: 8,
                    minWidth: 20,
                    height: 20,
                    paddingHorizontal: 6,
                    borderRadius: 10,
                    backgroundColor: "#ef4444",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Text style={{ color: "#fff", fontWeight: "800", fontSize: 11 }}>
                    {row.unread}
                  </Text>
                </View>
              ) : null}
            </View>
          </Pressable>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
