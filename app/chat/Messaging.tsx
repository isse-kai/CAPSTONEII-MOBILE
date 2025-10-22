import { useLocalSearchParams, useRouter } from "expo-router";
import { ArrowLeft, SendHorizontal } from "lucide-react-native";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  View,
} from "react-native";

const C = {
  bg: "#f7f9fc",
  card: "#ffffff",
  text: "#0f172a",
  sub: "#64748b",
  blue: "#1e86ff",
  border: "#e6eef7",
  bubbleMe: "#eaf4ff",
  bubbleOther: "#fff",
};

const PLACEHOLDER = [
  { id: "1", me: false, text: "Hey! Are you available tomorrow morning?" },
  { id: "2", me: true, text: "Hi! Yes, I’m free after 9AM." },
  { id: "3", me: false, text: "Great. Can you help with a quick cleaning?" },
  { id: "4", me: true, text: "Sure thing. Share the address and time." },
];

export default function Messaging() {
  const router = useRouter();
  const { name } = useLocalSearchParams<{ name?: string }>();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: C.bg }}>
      <StatusBar barStyle="dark-content" />
      {/* Header */}
      <View
        style={{
          backgroundColor: "#fff",
          paddingHorizontal: 12,
          paddingTop: 8,
          paddingBottom: 12,
          borderBottomWidth: 1,
          borderBottomColor: C.border,
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <Pressable
          onPress={() => router.back()}
          style={{ width: 44, height: 44, alignItems: "center", justifyContent: "center" }}
        >
          <ArrowLeft color={C.text} size={26} />
        </Pressable>
        <Text style={{ color: C.text, fontWeight: "900", fontSize: 18 }}>
          {name || "Chat"}
        </Text>
      </View>

      {/* Messages */}
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={80}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ padding: 16, paddingBottom: 24 }}
        >
          <Text style={{ alignSelf: "center", color: C.sub, fontSize: 12, marginBottom: 12 }}>
            Today
          </Text>

          {PLACEHOLDER.map((m) => (
            <View
              key={m.id}
              style={{
                alignSelf: m.me ? "flex-end" : "flex-start",
                backgroundColor: m.me ? C.bubbleMe : C.bubbleOther,
                borderWidth: 1,
                borderColor: C.border,
                paddingHorizontal: 14,
                paddingVertical: 10,
                borderRadius: 16,
                borderBottomRightRadius: m.me ? 4 : 16,
                borderBottomLeftRadius: m.me ? 16 : 4,
                marginBottom: 10,
                maxWidth: "78%",
              }}
            >
              <Text style={{ color: C.text }}>{m.text}</Text>
            </View>
          ))}
        </ScrollView>

        {/* Composer (placeholder only) */}
        <View
          style={{
            padding: 10,
            backgroundColor: "#fff",
            borderTopWidth: 1,
            borderTopColor: C.border,
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <TextInput
            placeholder="Type a message…"
            placeholderTextColor={C.sub}
            editable={false}
            style={{
              flex: 1,
              backgroundColor: "#fff",
              borderWidth: 1,
              borderColor: C.border,
              borderRadius: 999,
              paddingHorizontal: 16,
              height: 44,
              color: C.text,
            }}
          />
          <Pressable
            onPress={() => {}}
            style={{
              marginLeft: 10,
              width: 44,
              height: 44,
              borderRadius: 22,
              backgroundColor: C.blue,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <SendHorizontal color="#fff" size={20} />
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
