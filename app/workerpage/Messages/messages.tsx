// app/workerpage/Messages/messages.tsx
import { useRouter } from "expo-router";
import { CheckCheck, ChevronLeft, Plus, Search } from "lucide-react-native";
import React, { useMemo, useState } from "react";
import {
  FlatList,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const BLUE = "#1E88E5";

type TabKey = "all" | "unread";

export type WorkerChatItem = {
  id: string;
  name: string;
  lastMessage: string;
  time: string;
  unread: number;
  online?: boolean;
  avatar?: any;
};

const MOCK_WORKER_CHATS: WorkerChatItem[] = [
  {
    id: "client-juan",
    name: "Juan Dela Cruz",
    lastMessage: "Boss, available ko tomorrow morning.",
    time: "2:14 PM",
    unread: 2,
    online: true,
  },
  {
    id: "client-maria",
    name: "Maria Santos",
    lastMessage: "How much po for plumbing repair?",
    time: "11:05 AM",
    unread: 0,
    online: false,
  },
  {
    id: "client-aaa-water",
    name: "AAA Water Refilling Station",
    lastMessage: "Okay, proceed tayo sa schedule.",
    time: "Yesterday",
    unread: 1,
    online: true,
  },
];

export default function WorkerMessagesScreen() {
  const router = useRouter();

  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<TabKey>("all");

  const filteredConvos = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();

    let base = MOCK_WORKER_CHATS;
    if (activeTab === "unread") {
      base = base.filter((c) => c.unread > 0);
    }

    if (!q) return base;

    return base.filter((c) => {
      const haystack = `${c.name} ${c.lastMessage}`.toLowerCase();
      return haystack.includes(q);
    });
  }, [searchQuery, activeTab]);

  const handleOpenConversation = (convo: WorkerChatItem) => {
    // 🔵 For now just go to a static chat screen (no params)
    router.push("./workerpage/Messages/chat");
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Top bar with back & logo */}
      <View style={styles.topBar}>
        <TouchableOpacity
          onPress={() => router.back()}
          activeOpacity={0.85}
          style={styles.backBtn}
        >
          <ChevronLeft size={20} color="#0f172a" />
        </TouchableOpacity>

        <Image
          source={require("../../../image/jdklogo.png")}
          style={styles.logo}
        />

        <View style={styles.topRight} />
      </View>

      {/* Header text */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Messages</Text>
          <Text style={styles.headerSubtitle}>
            View and reply to client messages
          </Text>
        </View>

        <TouchableOpacity
          activeOpacity={0.85}
          style={styles.newMessageButton}
          onPress={() => {
            // UI only for now
          }}
        >
          <Plus size={18} color="#fff" />
          <Text style={styles.newMessageText}>New</Text>
        </TouchableOpacity>
      </View>

      {/* Search */}
      <View style={styles.searchContainer}>
        <Search size={16} color="#64748b" />
        <TextInput
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search conversations"
          placeholderTextColor="#94a3b8"
          style={styles.searchInput}
        />
      </View>

      {/* Tabs */}
      <View style={styles.tabsRow}>
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => setActiveTab("all")}
          style={[
            styles.tabButton,
            activeTab === "all" && styles.tabButtonActive,
          ]}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "all" && styles.tabTextActive,
            ]}
          >
            All
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => setActiveTab("unread")}
          style={[
            styles.tabButton,
            activeTab === "unread" && styles.tabButtonActive,
          ]}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "unread" && styles.tabTextActive,
            ]}
          >
            Unread
          </Text>
        </TouchableOpacity>
      </View>

      {/* List */}
      <FlatList
        data={filteredConvos}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 18, flexGrow: 1 }}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        renderItem={({ item }) => {
          const unread = item.unread ?? 0;
          const hasUnread = unread > 0;

          return (
            <TouchableOpacity
              activeOpacity={0.9}
              style={styles.chatRow}
              onPress={() => handleOpenConversation(item)}
            >
              <View style={styles.avatarContainer}>
                {item.avatar ? (
                  <Image
                    source={item.avatar}
                    style={styles.avatarImage}
                    resizeMode="cover"
                  />
                ) : (
                  <View style={styles.avatarFallback}>
                    <Text style={styles.avatarInitials}>
                      {item.name
                        .split(" ")
                        .filter(Boolean)
                        .map((n) => n[0])
                        .join("")
                        .slice(0, 2)
                        .toUpperCase()}
                    </Text>
                  </View>
                )}

                {item.online && <View style={styles.onlineDot} />}
              </View>

              <View style={styles.chatMiddle}>
                <View style={styles.chatTopRow}>
                  <Text style={styles.chatName} numberOfLines={1}>
                    {item.name}
                  </Text>
                  <Text style={styles.chatTime} numberOfLines={1}>
                    {item.time}
                  </Text>
                </View>

                <View style={styles.chatBottomRow}>
                  <Text style={styles.chatPreview} numberOfLines={1}>
                    {item.lastMessage}
                  </Text>

                  {hasUnread ? (
                    <View style={styles.unreadBadge}>
                      <Text style={styles.unreadBadgeText}>
                        {unread > 99 ? "99+" : unread}
                      </Text>
                    </View>
                  ) : (
                    <View style={styles.readIconWrapper}>
                      <CheckCheck size={16} color="#94a3b8" />
                    </View>
                  )}
                </View>
              </View>
            </TouchableOpacity>
          );
        }}
        ListEmptyComponent={() => (
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>No conversations yet</Text>
            <Text style={styles.emptySubtitle}>
              Once you start chatting with clients, they’ll appear here.
            </Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#fff" },

  topBar: {
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 6,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    backgroundColor: "#ffffff",
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    width: 140,
    height: 26,
    resizeMode: "contain",
  },
  topRight: {
    width: 40,
    height: 40,
  },

  header: {
    paddingHorizontal: 16,
    paddingTop: 4,
    paddingBottom: 10,
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
  },
  headerTitle: { fontSize: 22, fontWeight: "900", color: "#0f172a" },
  headerSubtitle: {
    marginTop: 2,
    fontSize: 12.5,
    color: "#64748b",
    fontWeight: "700",
  },

  newMessageButton: {
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
    paddingHorizontal: 14,
    height: 40,
    borderRadius: 12,
    backgroundColor: BLUE,
  },
  newMessageText: { color: "#fff", fontWeight: "900", fontSize: 13 },

  searchContainer: {
    marginTop: 6,
    marginHorizontal: 16,
    height: 44,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    backgroundColor: "#fbfcfe",
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  searchInput: { flex: 1, fontSize: 13.5, color: "#0f172a" },

  tabsRow: {
    marginTop: 12,
    marginHorizontal: 16,
    flexDirection: "row",
    gap: 10,
    marginBottom: 6,
  },
  tabButton: {
    flex: 1,
    height: 38,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  tabButtonActive: {
    borderColor: "#cfe6fb",
    backgroundColor: "#f0f8ff",
  },
  tabText: { fontSize: 13, fontWeight: "900", color: "#64748b" },
  tabTextActive: { color: BLUE },

  separator: { height: 1, backgroundColor: "#f1f5f9", marginLeft: 16 },

  chatRow: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: "row",
    gap: 12,
    alignItems: "center",
  },

  avatarContainer: { width: 46, height: 46 },
  avatarImage: { width: 46, height: 46, borderRadius: 23 },
  avatarFallback: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: "#eef6ff",
    borderWidth: 1,
    borderColor: "#d7eaff",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarInitials: {
    fontSize: 14,
    fontWeight: "900",
    color: BLUE,
  },
  onlineDot: {
    position: "absolute",
    right: 2,
    bottom: 2,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#22c55e",
    borderWidth: 2,
    borderColor: "#fff",
  },

  chatMiddle: { flex: 1 },
  chatTopRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
  },
  chatName: { flex: 1, fontSize: 14.5, fontWeight: "900", color: "#0f172a" },
  chatTime: { fontSize: 12, color: "#94a3b8", fontWeight: "800" },

  chatBottomRow: {
    marginTop: 4,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
  },
  chatPreview: {
    flex: 1,
    fontSize: 12.8,
    color: "#475569",
    fontWeight: "700",
  },

  unreadBadge: {
    minWidth: 22,
    height: 22,
    paddingHorizontal: 7,
    borderRadius: 11,
    backgroundColor: BLUE,
    alignItems: "center",
    justifyContent: "center",
  },
  unreadBadgeText: { color: "#fff", fontWeight: "900", fontSize: 12 },
  readIconWrapper: { width: 24, alignItems: "flex-end" },

  emptyState: {
    paddingHorizontal: 16,
    paddingTop: 40,
    alignItems: "center",
  },
  emptyTitle: { fontSize: 14.5, fontWeight: "900", color: "#0f172a" },
  emptySubtitle: {
    marginTop: 6,
    fontSize: 12.5,
    color: "#64748b",
    fontWeight: "700",
    textAlign: "center",
  },
});
