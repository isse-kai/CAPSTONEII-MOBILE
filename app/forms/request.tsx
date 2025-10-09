// app/request.tsx
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";
import { useRouter, type Href } from "expo-router";
import { ArrowLeft, Plus, Search } from "lucide-react-native";
import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  Image,
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
const LOGO = require("../../assets/jdklogo.png");

const C = {
  bg: "#f7f9fc",        // softer app bg (same vibe as Step 2)
  text: "#0f172a",
  sub: "#64748b",
  blue: "#1e86ff",
  blueDark: "#0c62c9",
  border: "#e6eef7",
  fieldBg: "#fff",
  placeholder: "#93a3b5",
  inputIcon: "#7b8aa0",
  card: "#ffffff",
  track: "#e9f0fb",     // segmented progress track (same as Step 2)
};

const STORAGE_KEY = "request_step1";
const NEXT_ROUTE = "/forms/request2" as Href;

/** Full list: 61 Bacolod barangays */
const ALL_BARANGAYS = [
  // Numbered (Poblacion)
  "Barangay 1","Barangay 2","Barangay 3","Barangay 4","Barangay 5","Barangay 6","Barangay 7","Barangay 8","Barangay 9","Barangay 10",
  "Barangay 11","Barangay 12","Barangay 13","Barangay 14","Barangay 15","Barangay 16","Barangay 17","Barangay 18","Barangay 19","Barangay 20",
  "Barangay 21","Barangay 22","Barangay 23","Barangay 24","Barangay 25","Barangay 26","Barangay 27","Barangay 28","Barangay 29","Barangay 30",
  "Barangay 31","Barangay 32","Barangay 33","Barangay 34","Barangay 35","Barangay 36","Barangay 37","Barangay 38","Barangay 39","Barangay 40",
  "Barangay 41",
  // Named
  "Alangilan","Alijis","Banago","Bata","Cabug","Estefania","Felisa","Granada","Handumanan","Mandalagan",
  "Mansilingan","Montevista","Pahanocoy","Punta Taytay","Singcang-Airport","Sum-ag","Taculing","Tangub","Villamonte","Vista Alegre",
];

const isEmail = (s: string) => /\S+@\S+\.\S+/.test(s.trim());
const isPhonePH = (s: string) => /^\d{10,11}$/.test(s.replace(/\D/g, ""));

export default function RequestClientInfo() {
  const router = useRouter();

  // form state
  const [first, setFirst] = useState("");
  const [last, setLast] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [brgy, setBrgy] = useState<string | null>(null);
  const [street, setStreet] = useState("");
  const [addr, setAddr] = useState("");
  const [photo, setPhoto] = useState<string | null>(null);

  // hydrate from draft
  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw) {
          const v = JSON.parse(raw);
          setFirst(v.first ?? "");
          setLast(v.last ?? "");
          setPhone(v.phone ?? "");
          setEmail(v.email ?? "");
          setBrgy(v.brgy ?? null);
          setStreet(v.street ?? "");
          setAddr(v.addr ?? "");
          setPhoto(v.photo ?? null);
        }
      } catch {}
    })();
  }, []);

  // barangay modal
  const [showBrgy, setShowBrgy] = useState(false);
  const [brgyQuery, setBrgyQuery] = useState("");
  const filteredBarangays = useMemo(
    () =>
      brgyQuery
        ? ALL_BARANGAYS.filter((b) =>
            b.toLowerCase().includes(brgyQuery.toLowerCase())
          )
        : ALL_BARANGAYS,
    [brgyQuery]
  );

  // image picker
  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") return;
    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.85,
      aspect: [1, 1],
      allowsEditing: true,
    });
    if (!res.canceled) setPhoto(res.assets[0].uri);
  };

  const isComplete = useMemo(
    () =>
      first.trim().length > 1 &&
      last.trim().length > 1 &&
      isPhonePH(phone) &&
      isEmail(email) &&
      !!brgy &&
      street.trim().length > 2 &&
      addr.trim().length > 2,
    [first, last, phone, email, brgy, street, addr]
  );

  const [saving, setSaving] = useState(false);
  const onNext = async () => {
    if (!isComplete) return;
    try {
      setSaving(true);
      await AsyncStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          first,
          last,
          phone,
          email,
          brgy,
          street,
          addr,
          photo,
        })
      );
      router.push(NEXT_ROUTE);
    } finally {
      setSaving(false);
    }
  };

  // “touched” flags to show hints only after typing
  const [touchedEmail, setTouchedEmail] = useState(false);
  const [touchedPhone, setTouchedPhone] = useState(false);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: C.bg }}>
      {/* HEADER: Back (left) + centered logo */}
      <View
        style={{
          paddingHorizontal: 14,
          paddingTop: 10,
          paddingBottom: 12,
          borderBottomWidth: 1,
          borderBottomColor: C.border,
          position: "relative",
          backgroundColor: "#fff",
        }}
      >
        <View
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 6,
            alignItems: "center",
          }}
          pointerEvents="none"
        >
          <Image
            source={LOGO}
            style={{
              width: Math.min(width * 0.72, 320),
              height: 60,
              resizeMode: "contain",
            }}
          />
        </View>

        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Pressable
            hitSlop={10}
            onPress={() => router.back()}
            style={{
              width: 44,
              height: 44,
              alignItems: "center",
              justifyContent: "center",
            }}
            accessibilityRole="button"
            accessibilityLabel="Go back"
          >
            <ArrowLeft color={C.text} size={26} strokeWidth={2.4} />
          </Pressable>
        </View>
      </View>

      {/* STEP STATUS BAR (1/4) */}
      <View style={{ paddingHorizontal: 16, paddingTop: 12, paddingBottom: 10, backgroundColor: "#fff" }}>
        <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 12 }}>
          <Text style={{ color: C.text, fontWeight: "900", fontSize: 16 }}>Step 1 of 4</Text>
          <Text style={{ color: C.sub, marginLeft: 12 }}>Client Information</Text>
        </View>
        {/* Segmented progress bar (4 steps) */}
        <View style={{ flexDirection: "row", columnGap: 12 }}>
          {[1, 2, 3, 4].map((i) => (
            <View
              key={i}
              style={{
                flex: 1,
                height: 10,
                borderRadius: 999,
                backgroundColor: i <= 1 ? C.blue : C.track,
              }}
            />
          ))}
        </View>
      </View>

      {/* CONTENT */}
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{
            paddingHorizontal: 18,   // a bit wider
            paddingTop: 14,
            paddingBottom: 132,      // larger bottom space for CTA
          }}
          showsVerticalScrollIndicator={false}
        >
          {/* CARD: Personal Information */}
          <Section
            title="Personal Information"
            subtitle="Please provide accurate details for contact and verification."
          >
            <Field
              label="First Name"
              value={first}
              onChangeText={setFirst}
              placeholder="First Name"
              autoCapitalize="words"
              returnKeyType="next"
            />
            <Field
              label="Last Name"
              value={last}
              onChangeText={setLast}
              placeholder="Last Name"
              autoCapitalize="words"
              returnKeyType="next"
            />

            <Label>Contact Number</Label>
            <View
              style={{
                flexDirection: "row",
                borderWidth: 1,
                borderColor: C.border,
                borderRadius: 16,
                overflow: "hidden",
                backgroundColor: C.fieldBg,
                alignItems: "center",
                marginBottom: 6,
              }}
            >
              <View
                style={{
                  paddingHorizontal: 14,
                  paddingVertical: 14,
                  borderRightWidth: 1,
                  borderRightColor: C.border,
                  backgroundColor: "#fff",
                }}
              >
                <Text style={{ color: C.text, fontWeight: "700" }}>+63</Text>
              </View>
              <TextInput
                keyboardType="phone-pad"
                value={phone}
                onChangeText={(t) => {
                  setPhone(t);
                  if (!touchedPhone) setTouchedPhone(true);
                }}
                placeholder="9XXXXXXXXX"
                placeholderTextColor={C.placeholder}
                style={{
                  flex: 1,
                  paddingHorizontal: 14,
                  paddingVertical: 14,
                  color: C.text,
                }}
                returnKeyType="next"
              />
            </View>
            {touchedPhone && phone.length > 0 && !isPhonePH(phone) ? (
              <Hint text="Enter 10–11 digits (PH mobile)." />
            ) : null}

            <Field
              label="Email Address"
              value={email}
              onChangeText={(t) => {
                setEmail(t);
                if (!touchedEmail) setTouchedEmail(true);
              }}
              placeholder="name@email.com"
              keyboardType="email-address"
              autoCapitalize="none"
            />
            {touchedEmail && email.length > 0 && !isEmail(email) ? (
              <Hint text="Please enter a valid email address." />
            ) : null}
          </Section>

          {/* CARD: Address */}
          <Section title="Address" subtitle="We’ll use this to find nearby pros.">
            <Label>Barangay (Bacolod)</Label>
            <Pressable onPress={() => setShowBrgy(true)}>
              <View
                style={{
                  backgroundColor: C.fieldBg,
                  borderWidth: 1,
                  borderColor: C.border,
                  borderRadius: 16,
                  paddingHorizontal: 14,
                  paddingVertical: 14,
                  marginBottom: 14,
                }}
              >
                <Text style={{ color: brgy ? C.text : C.placeholder }}>
                  {brgy || "Select Barangay"}
                </Text>
              </View>
            </Pressable>

            <Field
              label="House No. and Street"
              value={street}
              onChangeText={setStreet}
              placeholder="e.g., #12, Mabini St."
            />

            <Label>Landmark / Additional Details</Label>
            <TextInput
              value={addr}
              onChangeText={setAddr}
              placeholder="e.g., Near plaza, blue gate (Required)"
              placeholderTextColor={C.placeholder}
              multiline
              style={{
                backgroundColor: C.fieldBg,
                borderWidth: 1,
                borderColor: C.border,
                borderRadius: 16,
                paddingHorizontal: 14,
                paddingVertical: 14,
                minHeight: 110,
                color: C.text,
                textAlignVertical: "top",
              }}
            />
          </Section>

          {/* CARD: Profile Picture */}
          <Section
            title="Profile Picture"
            subtitle="A clear photo helps pros recognize you on arrival."
          >
            <View style={{ flexDirection: "row", alignItems: "center", columnGap: 16 }}>
              <Pressable onPress={pickImage} onLongPress={() => setPhoto(null)}>
                <View
                  style={{
                    width: 120,
                    height: 120,
                    borderRadius: 60,
                    borderWidth: 1,
                    borderColor: C.border,
                    backgroundColor: "#f1f5f9",
                    alignItems: "center",
                    justifyContent: "center",
                    overflow: "hidden",
                  }}
                >
                  {photo ? (
                    <Image source={{ uri: photo }} style={{ width: "100%", height: "100%" }} />
                  ) : (
                    <Plus color="#94a3b8" size={30} strokeWidth={2.6} />
                  )}
                </View>
              </Pressable>

              <Pressable
                onPress={pickImage}
                style={({ pressed }) => ({
                  paddingVertical: 12,
                  paddingHorizontal: 18,
                  borderRadius: 12,
                  borderWidth: 1,
                  borderColor: C.border,
                  backgroundColor: pressed ? "#eef2f7" : "#fff",
                })}
              >
                <Text style={{ color: C.text, fontWeight: "800" }}>Choose Photo</Text>
              </Pressable>
            </View>
            <Text style={{ color: C.sub, fontSize: 12, marginTop: 8 }}>
              Tip: Long-press the photo to remove it.
            </Text>
          </Section>
        </ScrollView>

        {/* STICKY: Next only */}
        <View
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 0,
            padding: 16,
            backgroundColor: "#fff",
            borderTopWidth: 1,
            borderTopColor: C.border,
          }}
        >
          <Pressable
            disabled={!isComplete || saving}
            onPress={onNext}
            style={({ pressed }) => ({
              paddingVertical: 16,
              borderRadius: 18,
              alignItems: "center",
              justifyContent: "center",
              backgroundColor:
                !isComplete || saving ? "#a7c8ff" : pressed ? C.blueDark : C.blue,
              shadowColor: C.blue,
              shadowOpacity: Platform.OS === "android" ? 0.18 : 0.28,
              shadowRadius: 10,
              shadowOffset: { width: 0, height: 4 },
              elevation: 3,
            })}
          >
            {saving ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={{ color: "#fff", fontWeight: "900", fontSize: 16 }}>
                Next
              </Text>
            )}
          </Pressable>
        </View>
      </KeyboardAvoidingView>

      {/* Barangay modal */}
      <Modal
        visible={showBrgy}
        animationType="slide"
        transparent
        onRequestClose={() => setShowBrgy(false)}
      >
        <Pressable
          onPress={() => setShowBrgy(false)}
          style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.25)" }}
        >
          <View
            style={{
              marginTop: "auto",
              backgroundColor: "#fff",
              borderTopLeftRadius: 22,
              borderTopRightRadius: 22,
              maxHeight: "72%",
              padding: 16,
            }}
          >
            <Text
              style={{
                color: C.text,
                fontWeight: "900",
                fontSize: 16,
                marginBottom: 12,
              }}
            >
              Select Barangay
            </Text>

            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                borderWidth: 1,
                borderColor: C.border,
                borderRadius: 999,
                paddingLeft: 10,
                paddingRight: 12,
                height: 42,
                marginBottom: 12,
                backgroundColor: C.fieldBg,
              }}
            >
              <Search color={C.inputIcon} size={18} strokeWidth={2.2} />
              <TextInput
                value={brgyQuery}
                onChangeText={setBrgyQuery}
                placeholder="Search barangay"
                placeholderTextColor={C.placeholder}
                style={{
                  flex: 1,
                  paddingVertical: 0,
                  paddingLeft: 8,
                  color: C.text,
                }}
              />
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              {filteredBarangays.map((b) => (
                <Pressable
                  key={b}
                  onPress={() => {
                    setBrgy(b);
                    setShowBrgy(false);
                  }}
                  style={{
                    paddingVertical: 14,
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

/* ---------------- small UI helpers ---------------- */

function Section({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <View
      style={{
        backgroundColor: C.card,
        borderWidth: 1,
        borderColor: C.border,
        borderRadius: 20,
        padding: 16,
        marginBottom: 18, // a touch more space between cards
        shadowColor: "#000",
        shadowOpacity: Platform.OS === "android" ? 0 : 0.06,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: 6 },
        elevation: 1,
      }}
    >
      <Text style={{ color: C.text, fontWeight: "900", fontSize: 18 }}>
        {title}
      </Text>
      {subtitle ? (
        <Text style={{ color: C.sub, marginTop: 6, marginBottom: 14 }}>
          {subtitle}
        </Text>
      ) : null}
      {children}
    </View>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <Text style={{ color: C.text, fontWeight: "800", marginBottom: 8 }}>
      {children}
    </Text>
  );
}

function Hint({ text }: { text: string }) {
  return (
    <Text style={{ color: "#ef4444", fontSize: 12, marginTop: 4, marginBottom: 8 }}>
      {text}
    </Text>
  );
}

function Field(props: {
  label: string;
  value: string;
  onChangeText: (t: string) => void;
  placeholder?: string;
  keyboardType?: any;
  autoCapitalize?: "none" | "sentences" | "words" | "characters";
  returnKeyType?: "next" | "done" | "go" | "search" | "send";
  multiline?: boolean;
}) {
  const {
    label,
    value,
    onChangeText,
    placeholder,
    keyboardType,
    autoCapitalize,
    returnKeyType,
    multiline,
  } = props;
  return (
    <View style={{ marginBottom: 14 }}>
      <Label>{label}</Label>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={C.placeholder}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
        returnKeyType={returnKeyType}
        multiline={multiline}
        style={{
          backgroundColor: C.fieldBg,
          borderWidth: 1,
          borderColor: C.border,
          borderRadius: 16,
          paddingHorizontal: 14,
          paddingVertical: multiline ? 14 : 16,
          minHeight: multiline ? 110 : undefined,
          color: C.text,
          textAlignVertical: multiline ? "top" : "auto",
        }}
      />
    </View>
  );
}
