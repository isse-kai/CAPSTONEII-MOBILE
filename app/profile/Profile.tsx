// app/profile/index.tsx
import AsyncStorage from "@react-native-async-storage/async-storage";
import DateTimePicker from "@react-native-community/datetimepicker";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import {
  ArrowLeft,
  CheckCircle2,
  ChevronDown,
  Eye,
  EyeOff,
  Image as ImageIcon,
  KeyRound,
  Link2,
  Mail,
  Phone,
  User,
} from "lucide-react-native";
import React, { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";

/* ---------- Spacious minimalist theme ---------- */
const C = {
  bg: "#f6f8fb",
  card: "#ffffff",
  text: "#0f172a",
  sub: "#5b6473",
  placeholder: "#9aa5b1",
  border: "#e6ebf2",
  fieldBg: "#fbfdff",
  blue: "#1e86ff",
  blueDark: "#0c62c9",
  green: "#16a34a",
  red: "#ef4444",
};
const RADIUS = 16;
const PAD = 24;         // page/card padding
const GAP = 18;         // space between fields/sections
const INPUT_H = 56;     // comfy input height
const BTN_H = 56;

/* ---------- Storage keys ---------- */
const PROFILE_KEY = "profile_info";
const AUTH_PW_KEY = "auth_pw";
const CREATED_AT_KEY = "acct_created_at";

/* ---------- Utils ---------- */
const isEmail = (s: string) => /\S+@\S+\.\S+/.test(s.trim());
const isPhonePH = (s: string) => /^\d{10,11}$/.test(s.replace(/\D/g, ""));
const isUrlOrEmpty = (s: string) => !s || /^https?:\/\/.+/i.test(s.trim());
const formatDate = (d?: Date | null) =>
  d ? d.toLocaleDateString(undefined, { month: "long", day: "numeric", year: "numeric" }) : "";
const ageFrom = (d?: Date | null) => {
  if (!d) return "";
  const now = new Date();
  let a = now.getFullYear() - d.getFullYear();
  const m = now.getMonth() - d.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < d.getDate())) a--;
  return a >= 0 ? String(a) : "";
};

type Profile = {
  first: string;
  last: string;
  email: string;
  phone: string;
  dob?: string | null;
  facebook?: string;
  instagram?: string;
  photoUri?: string | null;
};

export default function ProfileScreen() {
  const router = useRouter();

  const [tab, setTab] = useState<"profile" | "password">("profile");

  // Profile
  const [first, setFirst] = useState("");
  const [last, setLast] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [dob, setDob] = useState<Date | null>(null);
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [facebook, setFacebook] = useState("");
  const [instagram, setInstagram] = useState("");
  const [createdAt, setCreatedAt] = useState<string>("");

  // Password
  const [curPw, setCurPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [newPw2, setNewPw2] = useState("");
  const [showCur, setShowCur] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showNew2, setShowNew2] = useState(false);

  // UI
  const [showDobPicker, setShowDobPicker] = useState(false);
  const [loading, setLoading] = useState(true);

  // Inline validation (gentle hints)
  const emailErr = email.length > 0 && !isEmail(email);
  const phoneErr = phone.length > 0 && !isPhonePH(phone);
  const fbErr = !isUrlOrEmpty(facebook);
  const igErr = !isUrlOrEmpty(instagram);

  const profileValid = useMemo(
    () =>
      first.trim().length > 1 &&
      last.trim().length > 1 &&
      isEmail(email) &&
      (phone ? isPhonePH(phone) : true) &&
      isUrlOrEmpty(facebook) &&
      isUrlOrEmpty(instagram),
    [first, last, email, phone, facebook, instagram]
  );

  const passwordValid = useMemo(
    () => newPw.length >= 6 && newPw === newPw2 && curPw.length > 0,
    [curPw, newPw, newPw2]
  );

  /* ---------- Hydrate ---------- */
  useEffect(() => {
    (async () => {
      try {
        const [raw, pw, createdRaw] = await Promise.all([
          AsyncStorage.getItem(PROFILE_KEY),
          AsyncStorage.getItem(AUTH_PW_KEY),
          AsyncStorage.getItem(CREATED_AT_KEY),
        ]);

        if (raw) {
          const p: Profile = JSON.parse(raw);
          setFirst(p.first ?? "");
          setLast(p.last ?? "");
          setEmail(p.email ?? "");
          setPhone(p.phone ?? "");
          setDob(p.dob ? new Date(p.dob) : null);
          setFacebook(p.facebook ?? "");
          setInstagram(p.instagram ?? "");
          setPhotoUri(p.photoUri ?? null);
        }
        if (!pw) await AsyncStorage.setItem(AUTH_PW_KEY, "changeme");
        if (createdRaw) {
          setCreatedAt(createdRaw);
        } else {
          const now = new Date().toISOString();
          await AsyncStorage.setItem(CREATED_AT_KEY, now);
          setCreatedAt(now);
        }
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  /* ---------- Actions ---------- */
  const saveProfile = async () => {
    if (!profileValid) {
      Alert.alert("Incomplete", "Please fix the highlighted fields.");
      return;
    }
    const payload: Profile = {
      first: first.trim(),
      last: last.trim(),
      email: email.trim(),
      phone: phone.trim(),
      dob: dob ? dob.toISOString() : null,
      facebook: facebook.trim(),
      instagram: instagram.trim(),
      photoUri: photoUri || null,
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
    setCurPw(""); setNewPw(""); setNewPw2("");
    setShowCur(false); setShowNew(false); setShowNew2(false);
    Alert.alert("Password Changed", "Your password has been updated.");
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission needed", "Allow photo library access to pick a profile picture.");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.9,
      allowsEditing: true,
      aspect: [1, 1],
    });
    if (!result.canceled) setPhotoUri(result.assets[0].uri);
  };

  /* ---------- Render ---------- */
  const createdAtText = createdAt ? new Date(createdAt).toLocaleString() : "";

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: C.bg }}>
      {/* TOP HEADER (spacious) */}
      <TopHeader
        title="Personal Information"
        subtitle="This is a client account"
        createdAtText={createdAtText}
        onBack={() => router.back()}
      />

      {/* TABS (larger touch targets) */}
      <Tabs active={tab} onChange={(v) => setTab(v)} />

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <ScrollView contentContainerStyle={{ padding: PAD, paddingBottom: 200 }}>
          {tab === "profile" ? (
            <>
              {/* Avatar */}
              <Card title="Profile Picture" subtitle="A clear face photo helps us recognize you.">
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <View style={{
                    width: 120, height: 120, borderRadius: 60,
                    backgroundColor: C.fieldBg, borderWidth: 1, borderColor: C.border,
                    alignItems: "center", justifyContent: "center", overflow: "hidden", marginRight: 18
                  }}>
                    {photoUri ? <Image source={{ uri: photoUri }} style={{ width: "100%", height: "100%" }} /> : <User color={C.placeholder} size={58} />}
                  </View>
                  <PrimaryBtn
                    label="Choose Photo"
                    icon={<ImageIcon color="#fff" size={20} />}
                    onPress={pickImage}
                  />
                </View>
              </Card>

              {/* Personal Info */}
              <Card title="Personal Information" subtitle="Keep your details up to date so we can reach you easily.">
                <Field
                  label="First Name"
                  value={first}
                  onChangeText={setFirst}
                  icon={<User color={C.sub} size={20} />}
                  placeholder="First name"
                  autoComplete="name-given"
                  returnKeyType="next"
                />
                <Field
                  label="Last Name"
                  value={last}
                  onChangeText={setLast}
                  icon={<User color={C.sub} size={20} />}
                  placeholder="Last name"
                  autoComplete="name-family"
                  returnKeyType="next"
                />
                <Field
                  label="Email"
                  value={email}
                  onChangeText={setEmail}
                  icon={<Mail color={C.sub} size={20} />}
                  placeholder="name@email.com"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoComplete="email"
                  error={emailErr ? "Enter a valid email address" : ""}
                  returnKeyType="next"
                />

                {/* DOB & Age (stacked for clarity) */}
                <View style={{ marginBottom: GAP }}>
                  <Label>Date of Birth</Label>
                  <Pressable
                    onPress={() => setShowDobPicker(true)}
                    style={{
                      backgroundColor: C.fieldBg,
                      borderWidth: 1,
                      borderColor: C.border,
                      borderRadius: 14,
                      paddingHorizontal: 14,
                      height: INPUT_H,
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                    hitSlop={8}
                  >
                    <Text style={{ color: dob ? C.text : C.placeholder, fontSize: 16 }}>
                      {dob ? formatDate(dob) : "+ Add date of birth"}
                    </Text>
                    <ChevronDown color={C.sub} size={20} />
                  </Pressable>
                  <Text style={{ color: C.sub, fontSize: 12, marginTop: 8 }}>
                    We use your date of birth only to show your age.
                  </Text>
                </View>

                <PhoneField
                  label="Contact Number"
                  value={phone}
                  onChangeText={setPhone}
                  error={phoneErr ? "Enter a 10–11 digit Philippine number" : ""}
                />

                <ReadOnlyField label="Age" value={dob ? ageFrom(dob) : "—"} />

                <SectionAction>
                  <PrimaryBtn
                    label="Save Personal Info"
                    onPress={saveProfile}
                    disabled={!profileValid || loading}
                    icon={<CheckCircle2 color="#fff" size={20} />}
                  />
                </SectionAction>
              </Card>

              {/* Socials */}
              <Card title="Social Media" subtitle="Optional links to help us reach you faster.">
                <Field
                  label="Facebook"
                  value={facebook}
                  onChangeText={setFacebook}
                  icon={<Link2 color={"#1877f2"} size={20} />}
                  placeholder="https://facebook.com/username"
                  autoCapitalize="none"
                  autoComplete="url"
                  error={fbErr ? "Use a full URL (http/https)" : ""}
                />
                <Field
                  label="Instagram"
                  value={instagram}
                  onChangeText={setInstagram}
                  icon={<Link2 color={"#c32aa3"} size={20} />}
                  placeholder="https://instagram.com/username"
                  autoCapitalize="none"
                  autoComplete="url"
                  error={igErr ? "Use a full URL (http/https)" : ""}
                />

                <SectionAction>
                  <PrimaryBtn
                    label="Save Social Links"
                    onPress={saveProfile}
                    disabled={!profileValid || loading}
                    icon={<CheckCircle2 color="#fff" size={20} />}
                  />
                </SectionAction>
              </Card>
            </>
          ) : (
            <Card title="Change Password" subtitle="Choose a strong password that you haven't used elsewhere.">
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
              <Text style={{ color: C.sub, fontSize: 12, marginTop: 8 }}>
                Must be at least 6 characters.
              </Text>

              <SectionAction>
                <PrimaryBtn
                  onPress={savePassword}
                  label="Update Password"
                  icon={<KeyRound color="#fff" size={20} />}
                  disabled={!passwordValid}
                />
              </SectionAction>
            </Card>
          )}
        </ScrollView>

        {/* Sticky bottom confirm for whole profile (extra affordance) */}
        {tab === "profile" && (
          <View style={{
            position: "absolute",
            left: 0, right: 0, bottom: 0,
            backgroundColor: C.card,
            borderTopWidth: 1, borderTopColor: C.border,
            padding: PAD
          }}>
            <PrimaryBtn
              onPress={saveProfile}
              label="Confirm Changes"
              icon={<CheckCircle2 color="#fff" size={20} />}
              disabled={!profileValid || loading}
            />
          </View>
        )}
      </KeyboardAvoidingView>

      {/* DOB picker */}
      {showDobPicker && (
        <DateTimePicker
          value={dob ?? new Date(1995, 0, 1)}
          mode="date"
          display={Platform.OS === "ios" ? "spinner" : "default"}
          onChange={(e, d) => {
            setShowDobPicker(false);
            if (d) setDob(d);
          }}
          maximumDate={new Date()}
        />
      )}
    </SafeAreaView>
  );
}

/* ======================= Top: Spacious Header & Tabs ======================= */

function TopHeader({
  title,
  subtitle,
  createdAtText,
  onBack,
}: {
  title: string;
  subtitle?: string;
  createdAtText?: string;
  onBack: () => void;
}) {
  return (
    <View
      style={{
        backgroundColor: C.card,
        borderBottomWidth: 1,
        borderBottomColor: C.border,
        paddingHorizontal: PAD,
        paddingTop: 20,
        paddingBottom: 22,
      }}
    >
      {/* Back + title/subtitle stacked for readability */}
      <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 18 }}>
        <Pressable
          onPress={onBack}
          style={{ width: 48, height: 48, alignItems: "center", justifyContent: "center", marginRight: 12 }}
          accessibilityRole="button"
          accessibilityLabel="Go back"
          hitSlop={8}
        >
          <ArrowLeft color={C.text} size={28} strokeWidth={2.4} />
        </Pressable>
        <View style={{ flex: 1 }}>
          <Text style={{ color: C.text, fontSize: 24, fontWeight: "900", letterSpacing: 0.2 }}>
            {title}
          </Text>
          {!!subtitle && (
            <Text style={{ color: C.sub, fontSize: 15, marginTop: 6, lineHeight: 20 }}>
              {subtitle}
            </Text>
          )}
        </View>
      </View>

      {/* Account meta row */}
      <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
        <View>
          <Text style={{ color: C.sub, fontSize: 12, marginBottom: 2 }}>Account Created</Text>
          <Text style={{ color: C.text, fontSize: 14 }}>{createdAtText || "—"}</Text>
        </View>

        <View style={{ flexDirection: "row", alignItems: "center", paddingVertical: 8, paddingHorizontal: 12, backgroundColor: "#eaf4ff", borderRadius: 999 }}>
          <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: C.green, marginRight: 8 }} />
          <Text style={{ color: C.blue, fontWeight: "800", fontSize: 13 }}>Active</Text>
        </View>
      </View>
    </View>
  );
}

function Tabs({
  active,
  onChange,
}: {
  active: "profile" | "password";
  onChange: (v: "profile" | "password") => void;
}) {
  const TabBtn = ({ label, value }: { label: string; value: "profile" | "password" }) => {
    const isActive = active === value;
    return (
      <Pressable
        onPress={() => onChange(value)}
        hitSlop={8}
        style={{
          flex: 1,
          paddingVertical: 14,
          alignItems: "center",
          borderWidth: 1.5,
          borderColor: isActive ? C.blue : C.border,
          backgroundColor: isActive ? "#eaf4ff" : C.card,
          borderRadius: 12,
        }}
      >
        <Text style={{ color: isActive ? C.blue : C.text, fontWeight: "800", fontSize: 15, letterSpacing: 0.2 }}>
          {label}
        </Text>
      </Pressable>
    );
  };

  return (
    <View style={{ backgroundColor: C.card, borderBottomWidth: 1, borderBottomColor: C.border, paddingHorizontal: PAD, paddingTop: 12, paddingBottom: 14 }}>
      <View style={{ flexDirection: "row", gap: 12 }}>
        <TabBtn label="My Information" value="profile" />
        <TabBtn label="Password" value="password" />
      </View>
    </View>
  );
}

/* ======================= Components ======================= */

function Card({
  title, subtitle, children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <View style={{
      backgroundColor: C.card,
      borderRadius: RADIUS,
      padding: PAD,
      marginBottom: GAP + 6,
      borderWidth: 1, borderColor: C.border,
    }}>
      <Text style={{ color: C.text, fontWeight: "900", fontSize: 20 }}>{title}</Text>
      {subtitle ? (
        <Text style={{ color: C.sub, marginTop: 6, marginBottom: 16, lineHeight: 20 }}>
          {subtitle}
        </Text>
      ) : <View style={{ height: 12 }} />}
      {children}
    </View>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return <Text style={{ color: C.sub, fontWeight: "700", marginBottom: 8, fontSize: 15 }}>{children}</Text>;
}

function Field({
  label, icon, error, ...props
}: {
  label: string;
  icon?: React.ReactNode;
  value: string;
  onChangeText: (v: string) => void;
  placeholder?: string;
  keyboardType?: any;
  autoCapitalize?: "none" | "sentences" | "words" | "characters";
  autoComplete?: any;
  returnKeyType?: any;
  error?: string;
}) {
  const hasError = Boolean(error);
  return (
    <View style={{ marginBottom: GAP }}>
      <Label>{label}</Label>
      <View style={{
        backgroundColor: C.fieldBg,
        borderWidth: 1,
        borderColor: hasError ? C.red : C.border,
        borderRadius: 14,
        paddingHorizontal: 14,
        height: INPUT_H,
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
      }}>
        {icon}
        <TextInput
          {...props}
          style={{ flex: 1, color: C.text, fontSize: 16, paddingVertical: 0 }}
          placeholderTextColor={C.placeholder}
        />
      </View>
      {hasError ? <Text style={{ color: C.red, marginTop: 8, fontSize: 13 }}>{error}</Text> : null}
    </View>
  );
}

function PhoneField({
  label, value, onChangeText, error,
}: {
  label: string;
  value: string;
  onChangeText: (v: string) => void;
  error?: string;
}) {
  const empty = value.trim().length === 0;
  const hasError = Boolean(error);
  return (
    <View style={{ marginBottom: GAP }}>
      <Label>{label}</Label>
      <View style={{
        flexDirection: "row",
        borderWidth: 1,
        borderColor: hasError ? C.red : C.border,
        borderRadius: 14,
        overflow: "hidden",
        backgroundColor: C.fieldBg,
        alignItems: "center",
        height: INPUT_H,
      }}>
        <View style={{
          paddingHorizontal: 14,
          height: "100%",
          alignItems: "center",
          justifyContent: "center",
          borderRightWidth: 1, borderRightColor: C.border,
          backgroundColor: "#fff"
        }}>
          <Text style={{ color: C.text, fontWeight: "700" }}>+63</Text>
        </View>
        <View style={{ flexDirection: "row", alignItems: "center", flex: 1, paddingRight: 12 }}>
          <Phone color={C.sub} size={20} />
          <TextInput
            keyboardType="phone-pad"
            value={value}
            onChangeText={onChangeText}
            placeholder={empty ? "+ Add contact number" : "9XXXXXXXXX"}
            placeholderTextColor={C.placeholder}
            style={{ flex: 1, paddingHorizontal: 10, color: C.text, fontSize: 16 }}
          />
        </View>
      </View>
      {hasError ? <Text style={{ color: C.red, marginTop: 8, fontSize: 13 }}>{error}</Text> : null}
    </View>
  );
}

function ReadOnlyField({ label, value }: { label: string; value: string }) {
  return (
    <View style={{ marginBottom: GAP }}>
      <Label>{label}</Label>
      <View style={{
        backgroundColor: C.fieldBg,
        borderWidth: 1,
        borderColor: C.border,
        borderRadius: 14,
        paddingHorizontal: 14,
        height: INPUT_H,
        justifyContent: "center",
      }}>
        <Text style={{ color: value === "—" ? C.placeholder : C.text, fontSize: 16 }}>{value}</Text>
      </View>
    </View>
  );
}

function PasswordField({
  label, value, onChangeText, visible, setVisible,
}: {
  label: string;
  value: string;
  onChangeText: (v: string) => void;
  visible: boolean;
  setVisible: (v: boolean) => void;
}) {
  return (
    <View style={{ marginBottom: GAP }}>
      <Label>{label}</Label>
      <View style={{
        backgroundColor: C.fieldBg,
        borderWidth: 1,
        borderColor: C.border,
        borderRadius: 14,
        paddingHorizontal: 14,
        height: INPUT_H,
        flexDirection: "row",
        alignItems: "center",
      }}>
        <KeyRound color={C.sub} size={20} />
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder="••••••••"
          placeholderTextColor={C.placeholder}
          secureTextEntry={!visible}
          autoCapitalize="none"
          style={{ flex: 1, color: C.text, fontSize: 16, paddingVertical: 0, marginLeft: 10 }}
        />
        <Pressable onPress={() => setVisible(!visible)} hitSlop={8} style={{ paddingLeft: 8 }}>
          {visible ? <Eye color={C.sub} size={22} /> : <EyeOff color={C.sub} size={22} />}
        </Pressable>
      </View>
    </View>
  );
}

function SectionAction({ children }: { children: React.ReactNode }) {
  return <View style={{ marginTop: GAP + 6 }}>{children}</View>;
}

function PrimaryBtn({
  onPress, label, icon, disabled,
}: { onPress: () => void; label: string; icon?: React.ReactNode; disabled?: boolean }) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      style={({ pressed }) => ({
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 10,
        backgroundColor: disabled ? "#b9d5ff" : pressed ? C.blueDark : C.blue,
        height: BTN_H,
        borderRadius: 14,
        paddingHorizontal: 16,
      })}
    >
      {icon}
      <Text style={{ color: "#fff", fontWeight: "800", fontSize: 16 }}>{label}</Text>
    </Pressable>
  );
}
