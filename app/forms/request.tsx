// app/request.tsx
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";
import { useRouter, type Href } from "expo-router";
import {
  ArrowLeft,
  Facebook,
  Instagram,
  Linkedin,
  Plus,
  Search,
} from "lucide-react-native";
import { useEffect, useMemo, useState } from "react";
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
  bg: "#ffffff",
  text: "#0f172a",
  sub: "#475569",
  blue: "#1e86ff",
  blueDark: "#0c62c9",
  border: "#d9e3f0",
  fieldBg: "#f8fafc",
  placeholder: "#93a3b5",
  inputIcon: "#7b8aa0",
};

const STORAGE_KEY = "request_step1";
const NEXT_ROUTE = "/forms/request2" as Href; // change to '/request/details' once Step 2 exists

const ALL_BARANGAYS = [
  "Alijis","Banago","Bata","Cabug","Estefania","Felisa","Granada",
  "Handumanan","Mandalagan","Mansilingan","Montevista","Pahanocoy",
  "Singcang-Airport","Sum-ag","Taculing",
];

const isEmail = (s: string) => /\S+@\S+\.\S+/.test(s);
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
  const [fb, setFb] = useState("");
  const [ig, setIg] = useState("");
  const [li, setLi] = useState("");
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
          setFb(v.fb ?? "");
          setIg(v.ig ?? "");
          setLi(v.li ?? "");
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
      quality: 0.8,
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
          fb,
          ig,
          li,
          photo,
        })
      );
      router.push(NEXT_ROUTE);
    } finally {
      setSaving(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: C.bg }}>
      {/* HEADER: Back (left) + big centered logo */}
      <View
        style={{
          paddingHorizontal: 12,
          paddingTop: 6,
          paddingBottom: 8,
          borderBottomWidth: 1,
          borderBottomColor: "#eef2f7",
          position: "relative",
        }}
      >
        {/* centered big logo */}
        <View
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 4,
            alignItems: "center",
          }}
          pointerEvents="none"
        >
          <Image
            source={LOGO}
            style={{
              width: Math.min(width * 0.78, 340),
              height: 66,
              resizeMode: "contain",
            }}
          />
        </View>

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "flex-start",
          }}
        >
          <Pressable
            hitSlop={8}
            onPress={() => router.back()}
            style={{
              width: 40,
              height: 40,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <ArrowLeft color={C.text} size={26} strokeWidth={2.4} />
          </Pressable>
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
            paddingHorizontal: 14,
            paddingTop: 12,
            paddingBottom: 90,
          }}
          showsVerticalScrollIndicator={false}
        >
          {/* breadcrumb + title */}
          <Text style={{ color: C.sub, fontSize: 12, marginBottom: 6 }}>
            1 of 4 | Post a Service Request
          </Text>
          <Text
            style={{
              color: C.text,
              fontSize: 24,
              fontWeight: "900",
              marginBottom: 14,
            }}
          >
            Step 1: Client Information
          </Text>

          <Text style={{ color: C.text, fontSize: 18, fontWeight: "800" }}>
            Personal Information
          </Text>
          <Text style={{ color: C.sub, marginTop: 4, marginBottom: 12 }}>
            Please fill in your personal details to proceed.
          </Text>

          {/* First / Last */}
          <View style={{ flexDirection: "row", gap: 10 }}>
            <View style={{ flex: 1 }}>
              <Text
                style={{ color: C.text, fontWeight: "700", marginBottom: 6 }}
              >
                First Name
              </Text>
              <TextInput
                value={first}
                onChangeText={setFirst}
                placeholder="First Name"
                placeholderTextColor={C.placeholder}
                style={{
                  backgroundColor: C.fieldBg,
                  borderWidth: 1,
                  borderColor: C.border,
                  borderRadius: 10,
                  paddingHorizontal: 12,
                  paddingVertical: 12,
                  color: C.text,
                }}
              />
            </View>
            <View style={{ flex: 1 }}>
              <Text
                style={{ color: C.text, fontWeight: "700", marginBottom: 6 }}
              >
                Last Name
              </Text>
              <TextInput
                value={last}
                onChangeText={setLast}
                placeholder="Last Name"
                placeholderTextColor={C.placeholder}
                style={{
                  backgroundColor: C.fieldBg,
                  borderWidth: 1,
                  borderColor: C.border,
                  borderRadius: 10,
                  paddingHorizontal: 12,
                  paddingVertical: 12,
                  color: C.text,
                }}
              />
            </View>
          </View>

          {/* Contact / Email */}
          <View style={{ flexDirection: "row", gap: 10, marginTop: 12 }}>
            <View style={{ flex: 1 }}>
              <Text
                style={{ color: C.text, fontWeight: "700", marginBottom: 6 }}
              >
                Contact Number
              </Text>
              <View
                style={{
                  flexDirection: "row",
                  borderWidth: 1,
                  borderColor: C.border,
                  borderRadius: 10,
                  overflow: "hidden",
                  backgroundColor: C.fieldBg,
                  alignItems: "center",
                }}
              >
                <View
                  style={{
                    paddingHorizontal: 10,
                    paddingVertical: 12,
                    borderRightWidth: 1,
                    borderRightColor: C.border,
                    backgroundColor: "#fff",
                  }}
                >
                  <Text style={{ color: C.text }}>🇵🇭 +63</Text>
                </View>
                <TextInput
                  keyboardType="phone-pad"
                  value={phone}
                  onChangeText={setPhone}
                  placeholder="Mobile Number"
                  placeholderTextColor={C.placeholder}
                  style={{
                    flex: 1,
                    paddingHorizontal: 12,
                    paddingVertical: 12,
                    color: C.text,
                  }}
                />
              </View>
            </View>

            <View style={{ flex: 1 }}>
              <Text
                style={{ color: C.text, fontWeight: "700", marginBottom: 6 }}
              >
                Email Address
              </Text>
              <TextInput
                autoCapitalize="none"
                keyboardType="email-address"
                value={email}
                onChangeText={setEmail}
                placeholder="Email Address"
                placeholderTextColor={C.placeholder}
                style={{
                  backgroundColor: C.fieldBg,
                  borderWidth: 1,
                  borderColor: C.border,
                  borderRadius: 10,
                  paddingHorizontal: 12,
                  paddingVertical: 12,
                  color: C.text,
                }}
              />
            </View>
          </View>

          {/* Barangay / Street */}
          <View style={{ flexDirection: "row", gap: 10, marginTop: 12 }}>
            <View style={{ flex: 1 }}>
              <Text
                style={{ color: C.text, fontWeight: "700", marginBottom: 6 }}
              >
                Barangay
              </Text>
              <Pressable onPress={() => setShowBrgy(true)}>
                <View
                  style={{
                    backgroundColor: C.fieldBg,
                    borderWidth: 1,
                    borderColor: C.border,
                    borderRadius: 10,
                    paddingHorizontal: 12,
                    paddingVertical: 12,
                  }}
                >
                  <Text style={{ color: brgy ? C.text : C.placeholder }}>
                    {brgy || "Select Barangay"}
                  </Text>
                </View>
              </Pressable>
            </View>

            <View style={{ flex: 1 }}>
              <Text
                style={{ color: C.text, fontWeight: "700", marginBottom: 6 }}
              >
                Street
              </Text>
              <TextInput
                value={street}
                onChangeText={setStreet}
                placeholder="House No. and Street"
                placeholderTextColor={C.placeholder}
                style={{
                  backgroundColor: C.fieldBg,
                  borderWidth: 1,
                  borderColor: C.border,
                  borderRadius: 10,
                  paddingHorizontal: 12,
                  paddingVertical: 12,
                  color: C.text,
                }}
              />
            </View>
          </View>

          {/* Additional Address */}
          <View style={{ marginTop: 12 }}>
            <Text style={{ color: C.text, fontWeight: "700", marginBottom: 6 }}>
              Additional Address (Landmark etc.)
            </Text>
            <TextInput
              value={addr}
              onChangeText={setAddr}
              placeholder="Additional Address (Required)"
              placeholderTextColor={C.placeholder}
              multiline
              style={{
                backgroundColor: C.fieldBg,
                borderWidth: 1,
                borderColor: C.border,
                borderRadius: 10,
                paddingHorizontal: 12,
                paddingVertical: 12,
                minHeight: 84,
                color: C.text,
                textAlignVertical: "top",
              }}
            />
          </View>

          {/* Profile Picture */}
          <View style={{ marginTop: 18 }}>
            <Text
              style={{ color: C.text, fontSize: 18, fontWeight: "800", marginBottom: 10 }}
            >
              Profile Picture
            </Text>
            <Text style={{ color: C.sub, marginBottom: 12 }}>
              Upload your profile picture.
            </Text>

            <View style={{ flexDirection: "row", alignItems: "center", gap: 14 }}>
              <Pressable onPress={pickImage}>
                <View
                  style={{
                    width: 110,
                    height: 110,
                    borderRadius: 110 / 2,
                    borderWidth: 1,
                    borderColor: C.border,
                    backgroundColor: "#f1f5f9",
                    alignItems: "center",
                    justifyContent: "center",
                    overflow: "hidden",
                  }}
                >
                  {photo ? (
                    <Image
                      source={{ uri: photo }}
                      style={{ width: "100%", height: "100%" }}
                    />
                  ) : (
                    <Plus color="#94a3b8" size={28} strokeWidth={2.6} />
                  )}
                </View>
              </Pressable>

              <Pressable
                onPress={pickImage}
                style={({ pressed }) => ({
                  paddingVertical: 10,
                  paddingHorizontal: 14,
                  borderRadius: 8,
                  borderWidth: 1,
                  borderColor: C.border,
                  backgroundColor: pressed ? "#eef2f7" : "#fff",
                })}
              >
                <Text style={{ color: C.text, fontWeight: "700" }}>
                  Choose Photo
                </Text>
              </Pressable>
            </View>
          </View>

          {/* Social Media */}
          <View style={{ marginTop: 18 }}>
            <Text style={{ color: C.text, fontSize: 18, fontWeight: "800" }}>
              Social Media
            </Text>
            <Text style={{ color: C.sub, marginTop: 4, marginBottom: 10 }}>
              Please provide your social media links (For reference).
            </Text>

            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 8,
                marginBottom: 10,
              }}
            >
              <Facebook color="#1877F2" size={18} strokeWidth={2.2} />
              <TextInput
                value={fb}
                onChangeText={setFb}
                placeholder="Facebook Link"
                placeholderTextColor={C.placeholder}
                autoCapitalize="none"
                style={{
                  flex: 1,
                  backgroundColor: C.fieldBg,
                  borderWidth: 1,
                  borderColor: C.border,
                  borderRadius: 10,
                  paddingHorizontal: 12,
                  paddingVertical: 10,
                  color: C.text,
                }}
              />
            </View>

            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 8,
                marginBottom: 10,
              }}
            >
              <Instagram color="#E1306C" size={18} strokeWidth={2.2} />
              <TextInput
                value={ig}
                onChangeText={setIg}
                placeholder="Instagram Link"
                placeholderTextColor={C.placeholder}
                autoCapitalize="none"
                style={{
                  flex: 1,
                  backgroundColor: C.fieldBg,
                  borderWidth: 1,
                  borderColor: C.border,
                  borderRadius: 10,
                  paddingHorizontal: 12,
                  paddingVertical: 10,
                  color: C.text,
                }}
              />
            </View>

            <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
              <Linkedin color="#0A66C2" size={18} strokeWidth={2.2} />
              <TextInput
                value={li}
                onChangeText={setLi}
                placeholder="LinkedIn Link"
                placeholderTextColor={C.placeholder}
                autoCapitalize="none"
                style={{
                  flex: 1,
                  backgroundColor: C.fieldBg,
                  borderWidth: 1,
                  borderColor: C.border,
                  borderRadius: 10,
                  paddingHorizontal: 12,
                  paddingVertical: 10,
                  color: C.text,
                }}
              />
            </View>
          </View>
        </ScrollView>

        {/* STICKY: Next only */}
        <View
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 0,
            padding: 12,
            backgroundColor: "#fff",
            borderTopWidth: 1,
            borderTopColor: "#eef2f7",
          }}
        >
          <Pressable
            disabled={!isComplete || saving}
            onPress={onNext}
            style={({ pressed }) => ({
              paddingVertical: 14,
              borderRadius: 12,
              alignItems: "center",
              justifyContent: "center",
              backgroundColor:
                !isComplete || saving ? "#a7c8ff" : pressed ? C.blueDark : C.blue,
            })}
          >
            {saving ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={{ color: "#fff", fontWeight: "800" }}>Next</Text>
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
              borderTopLeftRadius: 16,
              borderTopRightRadius: 16,
              maxHeight: "70%",
              padding: 14,
            }}
          >
            <Text
              style={{
                color: C.text,
                fontWeight: "800",
                fontSize: 16,
                marginBottom: 10,
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
                paddingLeft: 8,
                paddingRight: 10,
                height: 36,
                marginBottom: 10,
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
                  paddingLeft: 6,
                  color: C.text,
                }}
              />
            </View>

            <ScrollView>
              {filteredBarangays.map((b) => (
                <Pressable
                  key={b}
                  onPress={() => {
                    setBrgy(b);
                    setShowBrgy(false);
                  }}
                  style={{
                    paddingVertical: 12,
                    borderBottomWidth: 1,
                    borderBottomColor: "#eef2f7",
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
