// app/profile/index.tsx
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import {
    ArrowLeft,
    ChevronDown,
    Eye,
    EyeOff,
    KeyRound,
    Mail,
    Phone,
    Save,
    Search,
    User,
    X,
} from "lucide-react-native";
import React, { useEffect, useMemo, useState } from "react";
import {
    Alert,
    Dimensions,
    KeyboardAvoidingView,
    Modal,
    Platform,
    Pressable,
    SafeAreaView,
    ScrollView,
    Text,
    TextInput,
    View,
} from "react-native";

const { width } = Dimensions.get("window");

const C = {
  bg: "#ffffff",
  text: "#0f172a",
  sub: "#475569",
  blue: "#1e86ff",
  blueDark: "#0c62c9",
  border: "#e6eef7",
  fieldBg: "#f8fafc",
  placeholder: "#93a3b5",
};

const PROFILE_KEY = "profile_info";
const AUTH_PW_KEY = "auth_pw";

// Bacolod Barangays
const ALL_BARANGAYS = [
  // Numbered (Poblacion)
  "Barangay 1","Barangay 2","Barangay 3","Barangay 4","Barangay 5","Barangay 6","Barangay 7","Barangay 8","Barangay 9","Barangay 10",
  "Barangay 11","Barangay 12","Barangay 13","Barangay 14","Barangay 15","Barangay 16","Barangay 17","Barangay 18","Barangay 19","Barangay 20",
  "Barangay 21","Barangay 22","Barangay 23","Barangay 24","Barangay 25","Barangay 26","Barangay 27","Barangay 28","Barangay 29","Barangay 30",
  "Barangay 31","Barangay 32","Barangay 33","Barangay 34","Barangay 35","Barangay 36","Barangay 37","Barangay 38","Barangay 39","Barangay 40",
  "Barangay 41","Alangilan","Alijis","Banago","Bata","Cabug","Estefania","Felisa","Granada","Handumanan","Mandalagan",
  "Mansilingan","Montevista","Pahanocoy","Punta Taytay","Singcang-Airport","Sum-ag","Taculing","Tangub","Villamonte","Vista Alegre",
];

// validators
const isEmail = (s: string) => /\S+@\S+\.\S+/.test(s.trim());
const isPhonePH = (s: string) => /^\d{10,11}$/.test(s.replace(/\D/g, "")); // 10-11 digits

type Profile = {
  first: string;
  last: string;
  email: string;
  phone: string;
  brgy: string | null;
  tagline: string;
};

export default function ProfileScreen() {
  const router = useRouter();

  // tab: "profile" | "password"
  const [tab, setTab] = useState<"profile" | "password">("profile");

  // profile state
  const [first, setFirst] = useState("");
  const [last, setLast] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [brgy, setBrgy] = useState<string | null>(null);
  const [tagline, setTagline] = useState("");

  const [loading, setLoading] = useState(true);

  // password state
  const [curPw, setCurPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [newPw2, setNewPw2] = useState("");
  const [showCur, setShowCur] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showNew2, setShowNew2] = useState(false);

  // barangay modal
  const [openBrgy, setOpenBrgy] = useState(false);
  const [brgyQuery, setBrgyQuery] = useState("");
  const filteredBarangays = useMemo(() => {
    const q = brgyQuery.trim().toLowerCase();
    if (!q) return ALL_BARANGAYS;
    return ALL_BARANGAYS.filter((b) => b.toLowerCase().includes(q));
  }, [brgyQuery]);

  // hydrate
  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(PROFILE_KEY);
        if (raw) {
          const p: Profile = JSON.parse(raw);
          setFirst(p.first ?? "");
          setLast(p.last ?? "");
          setEmail(p.email ?? "");
          setPhone(p.phone ?? "");
          setBrgy(p.brgy ?? null);
          setTagline(p.tagline ?? "");
        }
        // seed a demo password if not set
        const pw = await AsyncStorage.getItem(AUTH_PW_KEY);
        if (!pw) await AsyncStorage.setItem(AUTH_PW_KEY, "changeme");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // profile validation
  const profileValid = useMemo(() => {
    return (
      first.trim().length > 1 &&
      last.trim().length > 1 &&
      isEmail(email) &&
      isPhonePH(phone) &&
      !!brgy
    );
  }, [first, last, email, phone, brgy]);

  // password validation
  const passwordValid = useMemo(() => {
    return newPw.length >= 6 && newPw === newPw2 && curPw.length > 0;
  }, [curPw, newPw, newPw2]);

  const saveProfile = async () => {
    if (!profileValid) {
      Alert.alert("Incomplete", "Please fill all required fields correctly.");
      return;
    }
    const payload: Profile = {
      first: first.trim(),
      last: last.trim(),
      email: email.trim(),
      phone: phone.trim(),
      brgy,
      tagline: tagline.trim(),
    };
    await AsyncStorage.setItem(PROFILE_KEY, JSON.stringify(payload));
    Alert.alert("Saved", "Your profile has been updated.");
  };

  const savePassword = async () => {
    if (!passwordValid) {
      Alert.alert("Check fields", "Make sure your new passwords match and have at least 6 characters.");
      return;
    }
    const stored = (await AsyncStorage.getItem(AUTH_PW_KEY)) || "changeme";
    if (curPw !== stored) {
      Alert.alert("Incorrect Password", "Your current password is incorrect.");
      return;
    }
    await AsyncStorage.setItem(AUTH_PW_KEY, newPw);
    setCurPw("");
    setNewPw("");
    setNewPw2("");
    setShowCur(false);
    setShowNew(false);
    setShowNew2(false);
    Alert.alert("Password Changed", "Your password has been updated.");
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: C.bg }}>
      {/* HEADER */}
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
          style={{ width: 44, height: 44, alignItems: "center", justifyContent: "center", marginRight: 6 }}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <ArrowLeft color={C.text} size={26} strokeWidth={2.4} />
        </Pressable>
        <Text style={{ color: C.text, fontWeight: "900", fontSize: 18 }}>Profile</Text>
      </View>

      {/* TAB SWITCH */}
      <View style={{ paddingHorizontal: 14, paddingTop: 10, paddingBottom: 6, backgroundColor: "#fff", borderBottomWidth: 1, borderBottomColor: C.border }}>
        <View style={{ flexDirection: "row" }}>
          <Pressable
            onPress={() => setTab("profile")}
            style={{
              flex: 1,
              paddingVertical: 10,
              borderWidth: 1,
              borderColor: tab === "profile" ? C.blue : C.border,
              backgroundColor: tab === "profile" ? "#eaf4ff" : "#fff",
              borderTopLeftRadius: 12,
              borderBottomLeftRadius: 12,
              alignItems: "center",
            }}
          >
            <Text style={{ color: tab === "profile" ? C.blue : C.text, fontWeight: "800" }}>Edit Profile</Text>
          </Pressable>
          <Pressable
            onPress={() => setTab("password")}
            style={{
              flex: 1,
              paddingVertical: 10,
              borderWidth: 1,
              borderColor: tab === "password" ? C.blue : C.border,
              backgroundColor: tab === "password" ? "#eaf4ff" : "#fff",
              borderTopRightRadius: 12,
              borderBottomRightRadius: 12,
              alignItems: "center",
            }}
          >
            <Text style={{ color: tab === "password" ? C.blue : C.text, fontWeight: "800" }}>Edit Password</Text>
          </Pressable>
        </View>
      </View>

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <ScrollView contentContainerStyle={{ padding: 14, paddingBottom: 120 }}>
          {tab === "profile" ? (
            <View>
              <Section title="Basic Information">
                <Field
                  label="First Name"
                  icon={<User color={C.sub} size={18} />}
                  value={first}
                  onChangeText={setFirst}
                  placeholder="First Name"
                />
                <Field
                  label="Last Name"
                  icon={<User color={C.sub} size={18} />}
                  value={last}
                  onChangeText={setLast}
                  placeholder="Last Name"
                />
              </Section>

              <Section title="Contact">
                <Field
                  label="Email"
                  icon={<Mail color={C.sub} size={18} />}
                  value={email}
                  onChangeText={setEmail}
                  placeholder="name@email.com"
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
                <PhoneField
                  label="Contact Number"
                  value={phone}
                  onChangeText={setPhone}
                />
              </Section>

              <Section title="Location">
                <Label>Barangay (Bacolod)</Label>
                <Pressable
                  onPress={() => setOpenBrgy(true)}
                  style={{
                    backgroundColor: C.fieldBg,
                    borderWidth: 1,
                    borderColor: C.border,
                    borderRadius: 12,
                    paddingHorizontal: 12,
                    paddingVertical: 12,
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: 12,
                  }}
                >
                  <Text style={{ color: brgy ? C.text : C.placeholder }}>
                    {brgy || "Select Barangay"}
                  </Text>
                  <ChevronDown color={C.sub} size={18} />
                </Pressable>
              </Section>

              <Section title="Tagline">
                <Text style={{ color: C.sub, marginBottom: 6 }}>
                  Briefly describe yourself (e.g., “Reliable electrician with fast response”).
                </Text>
                <TextInput
                  value={tagline}
                  onChangeText={(t) => setTagline(t.slice(0, 120))}
                  placeholder="Your tagline"
                  placeholderTextColor={C.placeholder}
                  multiline
                  style={{
                    backgroundColor: C.fieldBg,
                    borderWidth: 1,
                    borderColor: C.border,
                    borderRadius: 12,
                    paddingHorizontal: 12,
                    paddingVertical: 12,
                    minHeight: 80,
                    color: C.text,
                    textAlignVertical: "top",
                  }}
                />
                <Text style={{ color: C.sub, fontSize: 12, marginTop: 6 }}>
                  {tagline.length}/120
                </Text>
              </Section>
            </View>
          ) : (
            <View>
              <Section title="Change Password">
                <PasswordField
                  label="Current Password"
                  value={curPw}
                  onChangeText={setCurPw}
                  visible={showCur}
                  setVisible={setShowCur}
                />
                <PasswordField
                  label="New Password"
                  value={newPw}
                  onChangeText={setNewPw}
                  visible={showNew}
                  setVisible={setShowNew}
                />
                <PasswordField
                  label="Confirm New Password"
                  value={newPw2}
                  onChangeText={setNewPw2}
                  visible={showNew2}
                  setVisible={setShowNew2}
                />
                <Text style={{ color: C.sub, fontSize: 12, marginTop: 6 }}>
                  Password must be at least 6 characters.
                </Text>
              </Section>
            </View>
          )}
        </ScrollView>

        {/* Sticky Save */}
        <View
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "#fff",
            borderTopWidth: 1,
            borderTopColor: C.border,
            padding: 12,
          }}
        >
          {tab === "profile" ? (
            <Pressable
              onPress={saveProfile}
              disabled={!profileValid || loading}
              style={({ pressed }) => ({
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                backgroundColor: !profileValid || loading ? "#a7c8ff" : pressed ? C.blueDark : C.blue,
                paddingVertical: 14,
                borderRadius: 14,
              })}
            >
              <Save color="#fff" size={18} />
              <Text style={{ color: "#fff", fontWeight: "800" }}>Save Profile</Text>
            </Pressable>
          ) : (
            <Pressable
              onPress={savePassword}
              disabled={!passwordValid || loading}
              style={({ pressed }) => ({
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                backgroundColor: !passwordValid || loading ? "#a7c8ff" : pressed ? C.blueDark : C.blue,
                paddingVertical: 14,
                borderRadius: 14,
              })}
            >
              <KeyRound color="#fff" size={18} />
              <Text style={{ color: "#fff", fontWeight: "800" }}>Update Password</Text>
            </Pressable>
          )}
        </View>
      </KeyboardAvoidingView>

      {/* Barangay Picker Modal */}
      <Modal visible={openBrgy} animationType="slide" transparent onRequestClose={() => setOpenBrgy(false)}>
        <Pressable onPress={() => setOpenBrgy(false)} style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.25)" }}>
          <View
            style={{
              marginTop: "auto",
              backgroundColor: "#fff",
              borderTopLeftRadius: 16,
              borderTopRightRadius: 16,
              maxHeight: "70%",
              padding: 14,
            }}
          >
            <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 10 }}>
              <Text style={{ color: C.text, fontWeight: "900", fontSize: 16, flex: 1 }}>Select Barangay</Text>
              <Pressable onPress={() => setOpenBrgy(false)} style={{ padding: 6 }}>
                <X color={C.sub} size={20} />
              </Pressable>
            </View>

            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                borderWidth: 1,
                borderColor: C.border,
                borderRadius: 999,
                paddingLeft: 10,
                paddingRight: 12,
                height: 36,
                marginBottom: 10,
              }}
            >
              <Search color={C.sub} size={18} />
              <TextInput
                value={brgyQuery}
                onChangeText={setBrgyQuery}
                placeholder="Search barangay"
                placeholderTextColor={C.placeholder}
                style={{ flex: 1, paddingVertical: 0, paddingLeft: 6, color: C.text }}
              />
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              {filteredBarangays.map((b) => (
                <Pressable
                  key={b}
                  onPress={() => {
                    setBrgy(b);
                    setOpenBrgy(false);
                  }}
                  style={{
                    paddingVertical: 12,
                    borderBottomWidth: 1,
                    borderBottomColor: C.border,
                  }}
                >
                  <Text style={{ color: C.text }}>{b}</Text>
                </Pressable>
              ))}
            </ScrollView>
          </View>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
}

/* ---------- small UI helpers ---------- */

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={{ backgroundColor: "#fff", borderWidth: 1, borderColor: C.border, borderRadius: 16, padding: 14, marginBottom: 14 }}>
      <Text style={{ color: C.text, fontWeight: "900", fontSize: 18, marginBottom: 12 }}>{title}</Text>
      {children}
    </View>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return <Text style={{ color: C.text, fontWeight: "700", marginBottom: 6 }}>{children}</Text>;
}

function Field({
  label,
  icon,
  ...props
}: {
  label: string;
  icon?: React.ReactNode;
  value: string;
  onChangeText: (v: string) => void;
  placeholder?: string;
  keyboardType?: any;
  autoCapitalize?: "none" | "sentences" | "words" | "characters";
}) {
  return (
    <View style={{ marginBottom: 12 }}>
      <Label>{label}</Label>
      <View
        style={{
          backgroundColor: C.fieldBg,
          borderWidth: 1,
          borderColor: C.border,
          borderRadius: 12,
          paddingHorizontal: 12,
          paddingVertical: 10,
          flexDirection: "row",
          alignItems: "center",
          gap: 8,
        }}
      >
        {icon}
        <TextInput
          {...props}
          style={{ flex: 1, color: C.text, paddingVertical: 0 }}
          placeholderTextColor={C.placeholder}
        />
      </View>
    </View>
  );
}

function PhoneField({
  label,
  value,
  onChangeText,
}: {
  label: string;
  value: string;
  onChangeText: (v: string) => void;
}) {
  return (
    <View style={{ marginBottom: 12 }}>
      <Label>{label}</Label>
      <View
        style={{
          flexDirection: "row",
          borderWidth: 1,
          borderColor: C.border,
          borderRadius: 12,
          overflow: "hidden",
          backgroundColor: C.fieldBg,
          alignItems: "center",
        }}
      >
        <View
          style={{
            paddingHorizontal: 10,
            paddingVertical: 10,
            borderRightWidth: 1,
            borderRightColor: C.border,
            backgroundColor: "#fff",
          }}
        >
          <Text style={{ color: C.text }}>🇵🇭 +63</Text>
        </View>
        <View style={{ flexDirection: "row", alignItems: "center", flex: 1, paddingRight: 10 }}>
          <Phone color={C.sub} size={18} />
          <TextInput
            keyboardType="phone-pad"
            value={value}
            onChangeText={onChangeText}
            placeholder="9XXXXXXXXX"
            placeholderTextColor={C.placeholder}
            style={{ flex: 1, paddingHorizontal: 8, paddingVertical: 10, color: C.text }}
          />
        </View>
      </View>
    </View>
  );
}

function PasswordField({
  label,
  value,
  onChangeText,
  visible,
  setVisible,
}: {
  label: string;
  value: string;
  onChangeText: (v: string) => void;
  visible: boolean;
  setVisible: (v: boolean) => void;
}) {
  return (
    <View style={{ marginBottom: 12 }}>
      <Label>{label}</Label>
      <View
        style={{
          backgroundColor: C.fieldBg,
          borderWidth: 1,
          borderColor: C.border,
          borderRadius: 12,
          paddingHorizontal: 12,
          paddingVertical: 10,
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <KeyRound color={C.sub} size={18} />
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder="••••••••"
          placeholderTextColor={C.placeholder}
          secureTextEntry={!visible}
          autoCapitalize="none"
          style={{ flex: 1, color: C.text, paddingVertical: 0, marginLeft: 8 }}
        />
        <Pressable onPress={() => setVisible(!visible)} hitSlop={8} style={{ paddingLeft: 6 }}>
          {visible ? <Eye color={C.sub} size={20} /> : <EyeOff color={C.sub} size={20} />}
        </Pressable>
      </View>
    </View>
  );
}
