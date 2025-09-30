import { useLocalSearchParams, useRouter } from "expo-router";
import { ArrowLeft, MoreHorizontal, Send } from "lucide-react-native";
import { useMemo, useRef, useState } from "react";
import {
    FlatList,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    SafeAreaView,
    Text,
    TextInput,
    View,
} from "react-native";

type Msg = { id: string; text: string; from: "me" | "them"; ts: number };

const C = {
  bg: "#ffffff",
  text: "#0f172a",
  sub: "#475569",
  blue: "#1e86ff",
  blueDark: "#0c62c9",
  bubbleIn: "#f4f8ff",
  border: "#e6eef7",
  placeholder: "#93a3b5",
};

export default function ChatThread() {
  const router = useRouter();
  const { id, title } = useLocalSearchParams<{ id?: string; title?: string }>();
  const name = title || "Chat";

  const listRef = useRef<FlatList<Msg>>(null);
  const [draft, setDraft] = useState("");
  const [items, setItems] = useState<Msg[]>([
    { id: "1", text: `Hi! This is ${name}.`, from: "them", ts: Date.now() - 1000 * 60 * 60 },
    { id: "2", text: "Hello!", from: "me", ts: Date.now() - 1000 * 60 * 59 },
  ]);

  const data = useMemo(() => [...items].sort((a, b) => a.ts - b.ts), [items]);

  const send = () => {
    const text = draft.trim();
    if (!text) return;
    setItems((s) => [...s, { id: Math.random().toString(), text, from: "me", ts: Date.now() }]);
    setDraft("");
    setTimeout(() => {
      setItems((s) => [...s, { id: Math.random().toString(), text: "Noted 👍", from: "them", ts: Date.now() }]);
      listRef.current?.scrollToEnd({ animated: true });
    }, 400);
  };

  const renderItem = ({ item }: { item: Msg }) => {
    const mine = item.from === "me";
    return (
      <View style={{ paddingHorizontal: 14, marginTop: 8, flexDirection: "row", justifyContent: mine ? "flex-end" : "flex-start" }}>
        <View
          style={{
            maxWidth: "80%",
            backgroundColor: mine ? C.blue : C.bubbleIn,
            borderRadius: 14,
            paddingHorizontal: 12,
            paddingVertical: 10,
            borderWidth: mine ? 0 : 1,
            borderColor: mine ? "transparent" : C.border,
          }}
        >
          <Text style={{ color: mine ? "#fff" : C.text, lineHeight: 20 }}>{item.text}</Text>
          <Text style={{ color: mine ? "rgba(255,255,255,0.8)" : C.sub, fontSize: 10, marginTop: 6, textAlign: mine ? "right" : "left" }}>
            {fmtTime(item.ts)}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: C.bg }}>
      {/* Header */}
      <View style={{ paddingHorizontal: 14, paddingTop: 6, paddingBottom: 10, borderBottomWidth: 1, borderBottomColor: C.border, backgroundColor: "#fff", flexDirection: "row", alignItems: "center" }}>
        <Pressable onPress={() => router.back()} style={{ width: 40, height: 40, alignItems: "center", justifyContent: "center", marginRight: 6 }}>
          <ArrowLeft color={C.text} size={26} strokeWidth={2.4} />
        </Pressable>
        <View style={{ flex: 1 }}>
          <Text style={{ color: C.text, fontWeight: "900", fontSize: 18 }} numberOfLines={1}>{name}</Text>
          <Text style={{ color: C.sub, fontSize: 12 }}>{id ? `@${id}` : "conversation"}</Text>
        </View>
        <Pressable onPress={() => {}} style={{ width: 40, height: 40, alignItems: "center", justifyContent: "center" }}>
          <MoreHorizontal color={C.sub} size={22} />
        </Pressable>
      </View>

      {/* Thread + Composer */}
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined} keyboardVerticalOffset={Platform.OS === "ios" ? 6 : 0}>
        <FlatList
          ref={listRef}
          data={data}
          renderItem={renderItem}
          keyExtractor={(m) => m.id}
          contentContainerStyle={{ paddingVertical: 12 }}
          onContentSizeChange={() => listRef.current?.scrollToEnd({ animated: true })}
        />

        <View style={{ borderTopWidth: 1, borderTopColor: C.border, backgroundColor: "#fff", paddingHorizontal: 10, paddingVertical: 8 }}>
          <View style={{ flexDirection: "row", alignItems: "center", backgroundColor: "#fff", borderWidth: 1, borderColor: C.border, borderRadius: 14, paddingLeft: 12, paddingRight: 6, minHeight: 46 }}>
            <TextInput
              placeholder="Type a message"
              placeholderTextColor={C.placeholder}
              value={draft}
              onChangeText={setDraft}
              multiline
              style={{ flex: 1, color: C.text, paddingVertical: 10, paddingRight: 8 }}
            />
            <Pressable
              onPress={send}
              disabled={!draft.trim()}
              style={({ pressed }) => ({
                width: 40,
                height: 40,
                borderRadius: 20,
                backgroundColor: !draft.trim() ? "#cfe2ff" : pressed ? C.blueDark : C.blue,
                alignItems: "center",
                justifyContent: "center",
                shadowColor: C.blue,
                shadowOpacity: Platform.OS === "android" ? 0.18 : 0.25,
                shadowRadius: 8,
                shadowOffset: { width: 0, height: 3 },
                elevation: 2,
              })}
            >
              <Send color="#fff" size={18} strokeWidth={2.5} />
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function fmtTime(ts: number) {
  const d = new Date(ts);
  let h = d.getHours();
  const m = String(d.getMinutes()).padStart(2, "0");
  const am = h < 12 ? "AM" : "PM";
  h = h % 12 || 12;
  return `${h}:${m} ${am}`;
}
