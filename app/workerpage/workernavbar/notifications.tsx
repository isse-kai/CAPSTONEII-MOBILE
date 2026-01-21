import AsyncStorage from "@react-native-async-storage/async-storage";
import { Text, View } from "dripsy";
import { useFonts } from "expo-font";
import { useRouter, type Href } from "expo-router";
import { MotiView } from "moti";
import { useEffect, useState } from "react";
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import WorkerHeader from "./header";

type Notification = {
  id: string;
  title?: string;
  message?: string;
  detail?: string;
  created_at?: string;
};

const NOTIFS_KEY = "worker_notifications_local_list";

const seedNotifications = async () => {
  const raw = await AsyncStorage.getItem(NOTIFS_KEY);
  if (raw) return;

  const now = new Date();
  const sample: Notification[] = [
    {
      id: "wn1",
      title: "Welcome!",
      message: "Your worker account is ready.",
      created_at: now.toISOString(),
    },
    {
      id: "wn2",
      title: "Profile tip",
      message: "Complete your profile to get more job matches.",
      created_at: new Date(now.getTime() - 60 * 60 * 1000).toISOString(),
    },
    {
      id: "wn3",
      title: "Reminder",
      detail: "Check “Find New Jobs” to browse service requests.",
      created_at: new Date(now.getTime() - 2 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: "wn4",
      title: "Safety",
      message: "Always confirm job details before heading out.",
      created_at: new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString(),
    },
  ];

  await AsyncStorage.setItem(NOTIFS_KEY, JSON.stringify(sample));
};

async function getNotificationsLocal(): Promise<Notification[]> {
  try {
    await seedNotifications();
    const raw = await AsyncStorage.getItem(NOTIFS_KEY);
    const list: Notification[] = raw ? JSON.parse(raw) : [];
    list.sort((a, b) => (b.created_at ?? "").localeCompare(a.created_at ?? ""));
    return list;
  } catch {
    return [];
  }
}

export default function WorkerNotifications() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [fontsLoaded] = useFonts({
    "Poppins-Regular": require("../../../assets/fonts/Poppins/Poppins-Regular.ttf"),
    "Poppins-Bold": require("../../../assets/fonts/Poppins/Poppins-Bold.ttf"),
  });

  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    (async () => {
      const data = await getNotificationsLocal();
      setNotifications(data);
    })();
  }, []);

  if (!fontsLoaded) return null;

  return (
    <SafeAreaView
      style={{
        flex: 1,
        paddingTop: insets.top - 20,
        paddingBottom: insets.bottom + 2,
        backgroundColor: "rgba(249, 250, 251, 0.9)",
      }}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
      >
        <View sx={{ flex: 1, px: 16, py: 12 }}>
          <MotiView
            from={{ opacity: 0, translateY: 20 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: "timing", duration: 500 }}
            style={{ flex: 1 }}
          >
            <WorkerHeader />

            {/* Notifications Title */}
            <Text
              sx={{
                fontSize: 18,
                fontFamily: "Poppins-Bold",
                color: "#001a33",
                mb: 12,
              }}
            >
              Notifications
            </Text>

            {/* Notification List */}
            <FlatList
              data={notifications}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <Pressable
                  onPress={() =>
                    router.push(
                      `/workerpage/workernavbar/notifications/${item.id}` as Href,
                    )
                  }
                >
                  <View
                    sx={{
                      bg: "#fff",
                      borderRadius: 12,
                      px: 14,
                      py: 12,
                      mb: 12,
                      shadowColor: "#000",
                      shadowOffset: { width: 0, height: 1 },
                      shadowOpacity: 0.1,
                      shadowRadius: 2,
                      elevation: 2,
                    }}
                  >
                    <Text
                      sx={{
                        fontSize: 16,
                        fontFamily: "Poppins-Bold",
                        color: "#001a33",
                        mb: 4,
                      }}
                    >
                      {item.title || "Notification"}
                    </Text>
                    <Text
                      sx={{
                        fontSize: 14,
                        fontFamily: "Poppins-Regular",
                        color: "#4b5563",
                      }}
                    >
                      {item.message || item.detail || ""}
                    </Text>
                  </View>
                </Pressable>
              )}
              contentContainerStyle={{ paddingBottom: 16 }}
              showsVerticalScrollIndicator={false}
            />
          </MotiView>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
