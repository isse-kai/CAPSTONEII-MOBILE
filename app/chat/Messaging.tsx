import { useRouter, type Href } from "expo-router";
import { ArrowLeft, MessageSquare, Search } from "lucide-react-native";
import { useMemo, useState } from "react";
import {
    FlatList,
    Pressable,
    SafeAreaView,
    Text,
    TextInput,
    View
} from "react-native";

type Chat = {
  id: string;
  name: string;
  preview: string;
  ts: number;
  unread?: number;
};

const C = {
  bg: "#ffffff",
  text: "#0f172a",
  sub: "#475569",
  blue: "#1e86ff",
  border: "#e6eef7",
  placeholder: "#93a3b5",
};

const sample: Chat[] = [
  { id: "support", name: "JDK Support", preview: "How can we help today?", ts: Date.now() - 1000 * 60 * 2, unread: 1 },
  { id: "maria", name: "Maria S. (Electrician)", preview: "I can come at 3 PM.", ts: Date.now() - 1000 * 60 * 30 },
  { id: "juan", name: "Juan D. (Plumber)", preview: "Sent the estimate. 👍", ts: Date.now() - 1000 * 60 * 120 },
  { id: "carlo", name: "Carlo T. (Cleaner)", preview: "Thanks! See you.", ts: Date.now() - 1000 * 60 * 240 },
];

export default function ChatList() {
  const router = useRouter();
  const [query, setQuery] = useState("");

  const data = useMemo(() => {
    const q = query.trim().toLowerCase();
    const arr = [...sample].sort((a, b) => b.ts - a.ts);
    return q ? arr.filter(c => c.name.toLowerCase().includes(q)) : arr;
  }, [query]);

  const openChat = (c: Chat) => {
    router.push({
      pathname: "/chat/Chat",
      params: { id: c.id, title: c.name },
    } as Href);
  };

  const renderItem = ({ item }: { item: Chat }) => (
    <Pressable
      onPress={() => openChat(item)}
      style={({ pressed }) => ({
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 12,
        paddingHorizontal: 14,
        backgroundColor: pressed ? "#f6faff" : "#fff",
        borderBottomWidth: 1,
        borderBottomColor: C.border,
      })}
    >
      {/* Avatar (initials) */}
      <View
        style={{
          width: 44,
          height: 44,
          borderRadius: 22,
          backgroundColor: "#eaf4ff",
          alignItems: "center",
          justifyContent: "center",
          marginRight: 12,
          borderWidth: 1,
          borderColor: C.border,
        }}
      >
        <Text style={{ color: C.blue, fontWeight: "900" }}>
          {getInitials(item.name)}
        </Text>
      </View>

      {/* Title + preview */}
      <View style={{ flex: 1 }}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Text style={{ color: C.text, fontWeight: "900", flex: 1 }} numberOfLines={1}>
            {item.name}
          </Text>
          <Text style={{ color: C.placeholder, fontSize: 12, marginLeft: 8 }}>
            {fmtTime(item.ts)}
          </Text>
        </View>
        <Text style={{ color: C.sub }} numberOfLines={1}>
          {item.preview}
        </Text>
      </View>

      {/* Unread badge */}
      {item.unread ? (
        <View
          style={{
            marginLeft: 8,
            minWidth: 20,
            height: 20,
            paddingHorizontal: 6,
            borderRadius: 10,
            backgroundColor: C.blue,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text style={{ color: "#fff", fontSize: 12, fontWeight: "800" }}>
            {item.unread}
          </Text>
        </View>
      ) : null}
    </Pressable>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: C.bg }}>
      {/* Header */}
      <View
        style={{
          paddingHorizontal: 14,
          paddingTop: 6,
          paddingBottom: 10,
          borderBottomWidth: 1,
          borderBottomColor: C.border,
          backgroundColor: "#fff",
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <Pressable
          onPress={() => router.back()}
          style={{ width: 40, height: 40, alignItems: "center", justifyContent: "center", marginRight: 6 }}
        >
          <ArrowLeft color={C.text} size={26} strokeWidth={2.4} />
        </Pressable>

        <Text style={{ color: C.text, fontWeight: "900", fontSize: 18, flex: 1 }}>Messages</Text>

        <MessageSquare color={C.blue} size={22} />
      </View>

      {/* Search */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          backgroundColor: "#fff",
          margin: 14,
          marginBottom: 6,
          borderRadius: 12,
          borderWidth: 1,
          borderColor: C.border,
          paddingHorizontal: 10,
          height: 40,
        }}
      >
        <Search color={C.placeholder} size={18} />
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Search conversations"
          placeholderTextColor={C.placeholder}
          style={{ flex: 1, color: C.text, marginLeft: 8 }}
          returnKeyType="search"
        />
      </View>

      {/* List */}
      <FlatList
        data={data}
        keyExtractor={(i) => i.id}
        renderItem={renderItem}
        contentContainerStyle={{ backgroundColor: "#fff" }}
      />
    </SafeAreaView>
  );
}

function getInitials(name: string) {
  const p = name.trim().split(/\s+/);
  if (p.length === 1) return p[0][0]?.toUpperCase() ?? "?";
  return `${p[0][0] ?? ""}${p[p.length - 1][0] ?? ""}`.toUpperCase();
}
function fmtTime(ts: number) {
  const d = new Date(ts);
  let h = d.getHours();
  const m = String(d.getMinutes()).padStart(2, "0");
  const am = h < 12 ? "AM" : "PM";
  h = h % 12 || 12;
  return `${h}:${m} ${am}`;
}
