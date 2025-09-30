// app/notifications/index.tsx
import { useRouter } from "expo-router";
import {
    AlertCircle,
    ArrowLeft,
    Bell,
    Calendar,
    CheckCircle2,
    MessageSquare,
} from "lucide-react-native";
import { useMemo, useState } from "react";
import {
    FlatList,
    Pressable,
    RefreshControl,
    SafeAreaView,
    Text,
    View
} from "react-native";

type Notif = {
  id: string;
  title: string;
  body: string;
  ts: number;
  unread: boolean;
  kind: "system" | "job" | "message";
};

const C = {
  bg: "#ffffff",
  text: "#0f172a",
  sub: "#475569",
  blue: "#1e86ff",
  blueDark: "#0c62c9",
  border: "#e6eef7",
  chip: "#eaf4ff",
  muted: "#64748b",
};

const initialData: Notif[] = [
  {
    id: "n1",
    title: "Job Request Received",
    body: "A client requested an electrician tomorrow at 3 PM.",
    ts: Date.now() - 1000 * 60 * 3,
    unread: true,
    kind: "job",
  },
  {
    id: "n2",
    title: "New Message",
    body: "JDK Support: “How can we help today?”",
    ts: Date.now() - 1000 * 60 * 25,
    unread: true,
    kind: "message",
  },
  {
    id: "n3",
    title: "Schedule Reminder",
    body: "Don’t forget your appointment set for Friday.",
    ts: Date.now() - 1000 * 60 * 90,
    unread: false,
    kind: "system",
  },
  {
    id: "n4",
    title: "Payout Processed",
    body: "Your latest payout is on the way.",
    ts: Date.now() - 1000 * 60 * 240,
    unread: false,
    kind: "system",
  },
];

export default function NotificationsScreen() {
  const router = useRouter();
  const [items, setItems] = useState<Notif[]>(initialData);
  const [refreshing, setRefreshing] = useState(false);

  const unreadCount = useMemo(
    () => items.filter((n) => n.unread).length,
    [items]
  );

  const onRefresh = () => {
    setRefreshing(true);
    // Placeholder refresh: just wait a bit
    setTimeout(() => setRefreshing(false), 700);
  };

  const markAllRead = () => {
    setItems((s) => s.map((n) => ({ ...n, unread: false })));
  };

  const clearAll = () => {
    setItems([]);
  };

  const toggleRead = (id: string) => {
    setItems((s) =>
      s.map((n) => (n.id === id ? { ...n, unread: !n.unread } : n))
    );
  };

  const renderIcon = (kind: Notif["kind"]) => {
    const common = { size: 20, strokeWidth: 2.4, color: C.blue };
    switch (kind) {
      case "job":
        return <Calendar {...common} />;
      case "message":
        return <MessageSquare {...common} />;
      default:
        return <Bell {...common} />;
    }
  };

  const renderItem = ({ item }: { item: Notif }) => {
    return (
      <Pressable
        onPress={() => toggleRead(item.id)}
        style={({ pressed }) => ({
          paddingVertical: 12,
          paddingHorizontal: 14,
          backgroundColor: "#fff",
          borderBottomWidth: 1,
          borderBottomColor: C.border,
          opacity: pressed ? 0.96 : 1,
          flexDirection: "row",
          alignItems: "center",
          gap: 12,
        })}
      >
        {/* Icon bubble */}
        <View
          style={{
            width: 40,
            height: 40,
            borderRadius: 20,
            backgroundColor: C.chip,
            alignItems: "center",
            justifyContent: "center",
            borderWidth: 1,
            borderColor: C.border,
          }}
        >
          {renderIcon(item.kind)}
        </View>

        {/* Content */}
        <View style={{ flex: 1 }}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text
              style={{ color: C.text, fontWeight: "900", flex: 1 }}
              numberOfLines={1}
            >
              {item.title}
            </Text>
            <Text style={{ color: C.muted, fontSize: 12, marginLeft: 8 }}>
              {fmtTime(item.ts)}
            </Text>
          </View>

          <Text style={{ color: C.sub }} numberOfLines={2}>
            {item.body}
          </Text>
        </View>

        {/* Unread dot */}
        {item.unread ? (
          <View
            style={{
              width: 10,
              height: 10,
              borderRadius: 5,
              backgroundColor: C.blue,
              marginLeft: 8,
            }}
          />
        ) : (
          <CheckCircle2 color={C.border} size={18} />
        )}
      </Pressable>
    );
  };

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
          style={{
            width: 44,
            height: 44,
            alignItems: "center",
            justifyContent: "center",
            marginRight: 6,
          }}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <ArrowLeft color={C.text} size={26} strokeWidth={2.4} />
        </Pressable>

        <View style={{ flex: 1 }}>
          <Text style={{ color: C.text, fontWeight: "900", fontSize: 18 }}>
            Notifications
          </Text>
          <Text style={{ color: C.sub, fontSize: 12 }}>
            {unreadCount} unread
          </Text>
        </View>

        {/* Header actions */}
        <Pressable
          onPress={markAllRead}
          style={{ paddingHorizontal: 8, height: 44, justifyContent: "center" }}
        >
          <Text style={{ color: C.blue, fontWeight: "800" }}>Mark all read</Text>
        </Pressable>
        <Pressable
          onPress={clearAll}
          style={{ paddingHorizontal: 8, height: 44, justifyContent: "center" }}
        >
          <Text style={{ color: C.sub, fontWeight: "800" }}>Clear</Text>
        </Pressable>
      </View>

      {/* List */}
      {items.length === 0 ? (
        <View
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
            padding: 24,
          }}
        >
          <AlertCircle color={C.sub} size={36} />
          <Text
            style={{
              color: C.text,
              fontWeight: "900",
              fontSize: 18,
              marginTop: 10,
              marginBottom: 4,
              textAlign: "center",
            }}
          >
            No notifications
          </Text>
          <Text style={{ color: C.sub, textAlign: "center" }}>
            You’re all caught up. New updates will appear here.
          </Text>
        </View>
      ) : (
        <FlatList
          data={[...items].sort((a, b) => b.ts - a.ts)}
          keyExtractor={(n) => n.id}
          renderItem={renderItem}
          refreshControl={
            <RefreshControl
              tintColor={C.blue}
              colors={[C.blue]}
              refreshing={refreshing}
              onRefresh={onRefresh}
            />
          }
        />
      )}
    </SafeAreaView>
  );
}

function fmtTime(ts: number) {
  const d = new Date(ts);
  const now = new Date();
  const sameDay =
    d.getFullYear() === now.getFullYear() &&
    d.getMonth() === now.getMonth() &&
    d.getDate() === now.getDate();
  let h = d.getHours();
  const m = String(d.getMinutes()).padStart(2, "0");
  const am = h < 12 ? "AM" : "PM";
  h = h % 12 || 12;
  return sameDay ? `${h}:${m} ${am}` : d.toLocaleDateString();
}
