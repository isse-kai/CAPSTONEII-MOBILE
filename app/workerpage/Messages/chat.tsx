// app/workerpage/Messages/chat.tsx
import { useRouter } from "expo-router";
import { ChevronLeft, Send } from "lucide-react-native";
import React, { useRef, useState } from "react";
import {
    Image,
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

const BLUE = "#1E88E5";

export type WorkerMessage = {
  id: string;
  from: "me" | "client";
  text: string;
  time: string;
};

export default function WorkerChatScreen() {
  const router = useRouter();

  const [inputText, setInputText] = useState("");
  const [messages, setMessages] = useState<WorkerMessage[]>([
    {
      id: "msg-1",
      from: "client",
      text: "Hello! Available ka today?",
      time: "10:10 AM",
    },
    {
      id: "msg-2",
      from: "me",
      text: "Yes po, what time and location?",
      time: "10:12 AM",
    },
    {
      id: "msg-3",
      from: "client",
      text: "Around 2PM, near plaza.",
      time: "10:13 AM",
    },
  ]);

  const scrollViewRef = useRef<ScrollView | null>(null);

  const chatTitle = "Client Conversation"; // static for now (no params)

  const handleSend = () => {
    const trimmed = inputText.trim();
    if (!trimmed) return;

    const newMessage: WorkerMessage = {
      id: `msg-${Date.now()}`,
      from: "me",
      text: trimmed,
      time: "Now",
    };

    setMessages((prev) => [...prev, newMessage]);
    setInputText("");

    requestAnimationFrame(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    });
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

      {/* Header text for chat */}
      <View style={styles.header}>
        <View style={{ flex: 1 }}>
          <Text style={styles.headerTitle} numberOfLines={1}>
            {chatTitle}
          </Text>
          <Text style={styles.headerSubtitle} numberOfLines={1}>
            Replace this with real client name / status later
          </Text>
        </View>
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.OS === "ios" ? 10 : 0}
      >
        {/* Messages */}
        <ScrollView
          ref={scrollViewRef}
          contentContainerStyle={styles.messagesContainer}
          onContentSizeChange={() =>
            scrollViewRef.current?.scrollToEnd({ animated: true })
          }
        >
          {messages.map((message) => {
            const isMe = message.from === "me";
            return (
              <View
                key={message.id}
                style={[
                  styles.messageRow,
                  isMe ? styles.messageRowMe : styles.messageRowClient,
                ]}
              >
                <View
                  style={[
                    styles.messageBubble,
                    isMe ? styles.messageBubbleMe : styles.messageBubbleClient,
                  ]}
                >
                  <Text
                    style={[
                      styles.messageText,
                      isMe ? styles.messageTextMe : styles.messageTextClient,
                    ]}
                  >
                    {message.text}
                  </Text>
                  <Text
                    style={[
                      styles.messageTime,
                      isMe ? styles.messageTimeMe : styles.messageTimeClient,
                    ]}
                  >
                    {message.time}
                  </Text>
                </View>
              </View>
            );
          })}
        </ScrollView>

        {/* Input */}
        <View style={styles.inputBar}>
          <TextInput
            value={inputText}
            onChangeText={setInputText}
            placeholder="Type a message..."
            placeholderTextColor="#94a3b8"
            style={styles.input}
            multiline
          />
          <TouchableOpacity
            onPress={handleSend}
            activeOpacity={0.9}
            style={styles.sendButton}
          >
            <Send size={18} color="#fff" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
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
    paddingHorizontal: 14,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#eef2f7",
  },
  headerTitle: { fontSize: 16, fontWeight: "900", color: "#0f172a" },
  headerSubtitle: {
    marginTop: 2,
    fontSize: 12,
    color: "#64748b",
    fontWeight: "700",
  },

  messagesContainer: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    paddingBottom: 18,
  },

  messageRow: {
    marginBottom: 10,
    flexDirection: "row",
  },
  messageRowMe: {
    justifyContent: "flex-end",
  },
  messageRowClient: {
    justifyContent: "flex-start",
  },

  messageBubble: {
    maxWidth: "82%",
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
  },
  messageBubbleMe: {
    backgroundColor: BLUE,
    borderColor: BLUE,
  },
  messageBubbleClient: {
    backgroundColor: "#f8fafc",
    borderColor: "#e5e7eb",
  },

  messageText: { fontSize: 13.5, fontWeight: "700" },
  messageTextMe: { color: "#fff" },
  messageTextClient: { color: "#0f172a" },

  messageTime: {
    marginTop: 6,
    fontSize: 11,
    fontWeight: "800",
  },
  messageTimeMe: { color: "rgba(255,255,255,0.85)" },
  messageTimeClient: { color: "#94a3b8" },

  inputBar: {
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: "#eef2f7",
    flexDirection: "row",
    gap: 10,
    alignItems: "flex-end",
    backgroundColor: "#ffffff",
  },
  input: {
    flex: 1,
    minHeight: 44,
    maxHeight: 120,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 13.5,
    color: "#0f172a",
    backgroundColor: "#fff",
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: BLUE,
    alignItems: "center",
    justifyContent: "center",
  },
});
