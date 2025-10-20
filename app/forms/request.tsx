// app/forms/request.tsx
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Image, Pressable, ScrollView, Text, TextInput, View, type SxProp } from "dripsy";
import * as ImagePicker from "expo-image-picker";
import { useRouter, type Href } from "expo-router";
import {
  ArrowLeft,
  Camera,
  ChevronDown,
  Image as ImageIcon,
  Mail,
  MapPin,
  User,
  X,
} from "lucide-react-native";
import React, { useEffect, useMemo, useState } from "react";
import { Dimensions, Modal, Platform, SafeAreaView } from "react-native";

/* ---------- Theme / Layout ---------- */
const { width } = Dimensions.get("window");
const LOGO = require("../../assets/jdklogo.png");

const C = {
  bg: "#f7f9fc",
  text: "#0f172a",
  sub: "#64748b",
  blue: "#1e86ff",
  blueDark: "#0c62c9",
  border: "#e6eef7",
  fieldBg: "#ffffff",
  placeholder: "#93a3b5",
  card: "#ffffff",
  track: "#e9f0fb",
  chip: "#eaf4ff",
};

const PAD = 20;
const GAP = 16;
const BTN_PY = 16;

/* ---------- Storage / Routes ---------- */
const STORAGE_KEY = "request_step1";
const NEXT_ROUTE = "/forms/request2" as Href;
const BACK_ROUTE = "/home/home" as Href;

/* ---------- Data ---------- */
const BARANGAYS: string[] = [
  "Select Barangay",
  "Barangay 1","Barangay 2","Barangay 3","Barangay 4","Barangay 5","Barangay 6","Barangay 7","Barangay 8","Barangay 9","Barangay 10",
  "Barangay 11","Barangay 12","Barangay 13","Barangay 14","Barangay 15","Barangay 16","Barangay 17","Barangay 18","Barangay 19","Barangay 20",
  "Barangay 21","Barangay 22","Barangay 23","Barangay 24","Barangay 25","Barangay 26","Barangay 27","Barangay 28","Barangay 29","Barangay 30",
  "Barangay 31","Barangay 32","Barangay 33","Barangay 34","Barangay 35","Barangay 36","Barangay 37","Barangay 38","Barangay 39","Barangay 40",
  "Barangay 41",
  "Alangilan","Alijis","Banago","Bata","Cabug","Estefanía","Felisa","Granada","Handumanan","Mandalagan",
  "Mansilingan","Montevista","Pahanocoy","Punta Taytay","Singcang-Airport","Sum-ag","Taculing","Tangub","Villamonte","Vista Alegre",
];

/* ====================================================== */

type Nullable<T> = T | null;

export default function ClientRequest1() {
  const router = useRouter();

  // form state
  const [first, setFirst] = useState("");
  const [last, setLast] = useState("");
  const [phone, setPhone] = useState(""); // 10 digits after +63
  const [email, setEmail] = useState("");
  const [brgy, setBrgy] = useState<string>(BARANGAYS[0]);
  const [street, setStreet] = useState("");
  const [moreAddr, setMoreAddr] = useState(""); // Additional Address (Required)
  const [photo, setPhoto] = useState<Nullable<string>>(null);

  // barangay modal
  const [brgyOpen, setBrgyOpen] = useState(false);
  const [brgyQuery, setBrgyQuery] = useState("");

  // hydrate
  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (!raw) return;
        const v = JSON.parse(raw);
        setFirst(v.first ?? "");
        setLast(v.last ?? "");
        setPhone(v.phone ?? "");
        setEmail(v.email ?? "");
        setBrgy(v.brgy ?? BARANGAYS[0]);
        setStreet(v.street ?? "");
        setMoreAddr(v.moreAddr ?? "");
        setPhoto(v.photo ?? null);
      } catch {}
    })();
  }, []);

  // autosave draft (debounced)
  useEffect(() => {
    const id = setTimeout(() => {
      AsyncStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ first, last, phone, email, brgy, street, moreAddr, photo })
      ).catch(() => {});
    }, 350);
    return () => clearTimeout(id);
  }, [first, last, phone, email, brgy, street, moreAddr, photo]);

  // derived
  const emailOk = useMemo(() => /\S+@\S+\.\S+/.test(email), [email]);
  const phoneOk = useMemo(() => phone.trim().length === 10, [phone]); // after +63
  const brgyOk = useMemo(() => brgy !== BARANGAYS[0], [brgy]);

  const canNext = useMemo(
    () =>
      Boolean(
        first.trim() &&
          last.trim() &&
          emailOk &&
          phoneOk &&
          brgyOk &&
          street.trim() &&
          moreAddr.trim()
      ),
    [first, last, emailOk, phoneOk, brgyOk, street, moreAddr]
  );

  // actions
  const choosePhoto = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") return;
    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.9,
    });
    if (!res.canceled) setPhoto(res.assets[0]?.uri ?? null);
  };

  const onNext = async () => {
    if (!canNext) return;
    await AsyncStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ first, last, phone, email, brgy, street, moreAddr, photo })
    );
    router.push(NEXT_ROUTE);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: C.bg }}>
      {/* Header */}
      <View
        sx={{
          px: PAD,
          pt: 12,
          pb: 16,
          borderBottomWidth: 1,
          borderBottomColor: C.border,
          position: "relative",
          bg: "#fff",
        }}
      >
        <View
          sx={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 10,
            alignItems: "center",
          }}
          pointerEvents="none"
        >
          <Image
            source={LOGO}
            sx={{ width: Math.min(width * 0.7, 300), height: 56 }}
            resizeMode="contain"
          />
        </View>
        <Pressable
          onPress={() => router.push(BACK_ROUTE)}
          sx={{ width: 48, height: 48, alignItems: "center", justifyContent: "center" }}
        >
          <ArrowLeft color={C.text} size={28} strokeWidth={2.4} />
        </Pressable>
      </View>

      {/* Step status */}
      <View sx={{ px: PAD, pt: 16, pb: 14, bg: "#fff" }}>
        <View sx={{ flexDirection: "row", alignItems: "center", mb: 14 }}>
          <Text sx={{ color: C.text, fontWeight: "900", fontSize: 18 }}>Step 1 of 4</Text>
          <Text sx={{ color: C.sub, ml: 12, fontSize: 14 }}>Client Information</Text>
        </View>

        <View sx={{ flexDirection: "row", columnGap: 12 }}>
          {[1, 2, 3, 4].map((i) => (
            <View
              key={i}
              sx={{
                flex: 1,
                height: 10,
                borderRadius: 999,
                bg: i <= 1 ? C.blue : C.track,
              }}
            />
          ))}
        </View>
      </View>

      {/* Body */}
      <ScrollView contentContainerStyle={{ paddingBottom: 140 }} showsVerticalScrollIndicator={false}>
        <View sx={{ px: PAD, pt: 18 }}>
          {/* Personal Info */}
          <Card title="Personal Information" subtitle="Please fill in your personal details to proceed.">
            <Row>
              <Col>
                <Label>First Name</Label>
                <Field
                  value={first}
                  onChangeText={setFirst}
                  placeholder="First name"
                  icon={<User color={C.sub} size={16} />}
                />
              </Col>
              <Col>
                <Label>Last Name</Label>
                <Field
                  value={last}
                  onChangeText={setLast}
                  placeholder="Last name"
                  icon={<User color={C.sub} size={16} />}
                />
              </Col>
            </Row>

            <Row>
              <Col>
                <Label>Contact Number</Label>
                <PhoneGroup
                  value={phone}
                  onChangeText={(t: string) =>
                    setPhone(t.replace(/[^0-9]/g, "").slice(0, 10))
                  }
                />
                <Text sx={{ color: C.sub, fontSize: 12, mt: 6 }}>
                  Format: +63 <Text sx={{ fontWeight: "900" }}>9XXXXXXXXX</Text>
                </Text>
              </Col>
              <Col>
                <Label>Email Address</Label>
                <Field
                  value={email}
                  onChangeText={setEmail}
                  placeholder="Email address"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  icon={<Mail color={C.sub} size={16} />}
                  danger={!!email && !emailOk}
                  ok={!!email && emailOk}
                />
              </Col>
            </Row>

            <Row>
              <Col>
                <Label>Barangay</Label>
                <SelectBox
                  value={brgy || "Select Barangay"}
                  onPress={() => setBrgyOpen(true)}
                  danger={brgy === BARANGAYS[0]}
                />
              </Col>
              <Col>
                <Label>Street</Label>
                <Field
                  value={street}
                  onChangeText={setStreet}
                  placeholder="House No. and Street"
                  icon={<MapPin color={C.sub} size={16} />}
                />
              </Col>
            </Row>

            <View sx={{ mt: 4 }}>
              <Label>Additional Address (Landmark etc.)</Label>
              <TextInput
                value={moreAddr}
                onChangeText={setMoreAddr}
                placeholder="Additional Address (Required)"
                placeholderTextColor={C.placeholder}
                multiline
                textAlignVertical="top"
                sx={{
                  bg: C.fieldBg,
                  borderWidth: 1,
                  borderColor: C.border,
                  borderRadius: 20,
                  px: 16,
                  py: 16,
                  minHeight: 100,
                  color: C.text,
                  fontSize: 16,
                }}
              />
            </View>
          </Card>

          {/* Profile Photo */}
          <Card title="Profile Picture" subtitle="Upload your profile picture.">
            <Pressable
              onPress={choosePhoto}
              sx={{
                borderWidth: 1,
                borderColor: C.border,
                borderRadius: 20,
                bg: "#fff",
                px: 16,
                py: 14,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                mb: GAP,
              }}
            >
              <Text sx={{ color: C.text, fontWeight: "900", fontSize: 16 }}>Choose Photo</Text>
              <Camera color={C.sub} size={20} />
            </Pressable>

            <View
              sx={{
                alignSelf: "center",
                width: 140,
                height: 140,
                borderRadius: 70,
                borderWidth: 1,
                borderColor: C.border,
                bg: "#eef3f9",
                alignItems: "center",
                justifyContent: "center",
                overflow: "hidden",
              }}
            >
              {photo ? (
                <Image
                  source={{ uri: photo }}
                  sx={{ width: "100%", height: "100%" }}
                  resizeMode="cover"
                />
              ) : (
                <View sx={{ alignItems: "center" }}>
                  <ImageIcon color="#9aa9bc" size={30} />
                  <Text sx={{ color: "#9aa9bc", mt: 8, fontSize: 14 }}>No Image Selected</Text>
                </View>
              )}
            </View>
          </Card>
        </View>
      </ScrollView>

      {/* Sticky bottom actions */}
      <View
        sx={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          bg: "#fff",
          borderTopWidth: 1,
          borderTopColor: C.border,
          p: 14,
          flexDirection: "row",
          columnGap: 12,
        }}
      >
        <Pressable
          onPress={() => router.push(BACK_ROUTE)}
          sx={{
            flex: 1,
            borderWidth: 1,
            borderColor: C.border,
            borderRadius: 18,
            alignItems: "center",
            justifyContent: "center",
            py: BTN_PY,
            bg: "#fff",
          }}
        >
          <Text sx={{ color: C.text, fontWeight: "900", fontSize: 16 }}>Back</Text>
        </Pressable>

        <Pressable
          onPress={onNext}
          disabled={!canNext}
          sx={{
            flex: 1.25,
            borderRadius: 18,
            alignItems: "center",
            justifyContent: "center",
            py: BTN_PY,
            bg: canNext ? C.blue : "#a7c8ff",
            opacity: canNext ? 1 : 0.9,
          }}
        >
          <Text sx={{ color: "#fff", fontWeight: "900", fontSize: 16 }}>
            Next : Service Request Details
          </Text>
        </Pressable>
      </View>

      {/* Barangay Picker Modal */}
      <Modal
        visible={brgyOpen}
        animationType="slide"
        transparent
        onRequestClose={() => setBrgyOpen(false)}
      >
        <Pressable onPress={() => setBrgyOpen(false)} sx={{ flex: 1, bg: "rgba(0,0,0,0.25)" }}>
          <View
            sx={{
              mt: "auto",
              bg: "#fff",
              borderTopLeftRadius: 26,
              borderTopRightRadius: 26,
              maxHeight: "74%",
              p: 18,
            }}
          >
            <View sx={{ flexDirection: "row", alignItems: "center", mb: 14 }}>
              <Text sx={{ color: C.text, fontWeight: "900", fontSize: 18, flex: 1 }}>
                Select Barangay
              </Text>
              <Pressable onPress={() => setBrgyOpen(false)}>
                <X color={C.sub} size={22} />
              </Pressable>
            </View>

            {/* search */}
            <View
              sx={{
                borderWidth: 1,
                borderColor: C.border,
                borderRadius: 999,
                px: 16,
                height: 44,
                mb: 14,
                bg: "#fff",
                justifyContent: "center",
              }}
            >
              <TextInput
                value={brgyQuery}
                onChangeText={setBrgyQuery}
                placeholder="Search barangay…"
                placeholderTextColor={C.placeholder}
                sx={{ color: C.text, fontSize: 16 }}
              />
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              {BARANGAYS.filter((b) => b !== "Select Barangay")
                .filter((b) =>
                  b.toLowerCase().includes((brgyQuery || "").toLowerCase())
                )
                .map((item) => (
                  <Pressable
                    key={item}
                    onPress={() => {
                      setBrgy(item);
                      setBrgyOpen(false);
                    }}
                    sx={{ py: 14, borderBottomWidth: 1, borderBottomColor: C.border }}
                  >
                    <Text sx={{ color: C.text, fontSize: 16 }}>{item}</Text>
                  </Pressable>
                ))}
            </ScrollView>
          </View>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
}

/* =============== Reusable Components =============== */

function Card({
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
      sx={{
        bg: C.card,
        borderWidth: 1,
        borderColor: C.border,
        borderRadius: 24,
        px: PAD,
        py: 18,
        mb: 22,
        shadowColor: "#000",
        shadowOpacity: Platform.OS === "android" ? 0 : 0.06,
        shadowRadius: 14,
        shadowOffset: { width: 0, height: 6 },
        elevation: 1,
      }}
    >
      <Text sx={{ color: C.text, fontWeight: "900", fontSize: 20 }}>{title}</Text>
      {subtitle ? (
        <Text sx={{ color: C.sub, mt: 6, mb: 14, lineHeight: 20 }}>{subtitle}</Text>
      ) : null}
      {children}
    </View>
  );
}

const Row = ({ children }: { children: React.ReactNode }) => (
  <View sx={{ flexDirection: "row", flexWrap: "wrap", columnGap: GAP, rowGap: GAP, mb: GAP }}>
    {children}
  </View>
);

const Col = ({ children }: { children: React.ReactNode }) => (
  <View sx={{ flex: 1, minWidth: "48%" }}>{children}</View>
);

const Label = ({ children }: { children: React.ReactNode }) => (
  <Text sx={{ color: C.text, fontWeight: "800", mb: 10, fontSize: 14 }}>{children}</Text>
);

const fieldBox = {
  bg: C.fieldBg,
  borderWidth: 1,
  borderColor: C.border,
  borderRadius: 20,
  px: 16,
  height: 52,
  flexDirection: "row" as const,
  alignItems: "center" as const,
} as const;

type FieldProps = Omit<React.ComponentProps<typeof TextInput>, "style"> & {
  icon?: React.ReactNode;
  ok?: boolean;
  danger?: boolean;
  /** optional extra styles for the outer container */
  containerSx?: SxProp;
  /** optional extra styles for the TextInput */
  inputSx?: SxProp;
};

function Field({ icon, ok, danger, containerSx, inputSx, ...props }: FieldProps) {
  return (
    <View
      sx={{
        ...fieldBox,
        justifyContent: "flex-start",
        columnGap: 10,
        borderColor: danger ? "#ef4444" : ok ? "#16a34a" : C.border,
        ...(containerSx as object),
      }}
    >
      {icon ? <View sx={{ width: 18 }}>{icon}</View> : null}
      <TextInput
        {...props}
        placeholderTextColor={C.placeholder}
        sx={{ color: C.text, fontSize: 16, flex: 1, ...(inputSx as object) }}
      />
    </View>
  );
}

function SelectBox({
  value,
  onPress,
  danger,
}: {
  value: string;
  onPress: () => void;
  danger?: boolean;
}) {
  return (
    <Pressable
      onPress={onPress}
      sx={{
        ...fieldBox,
        justifyContent: "space-between",
        borderColor: danger ? "#ef4444" : C.border,
      }}
    >
      <Text
        sx={{
          color: value === "Select Barangay" ? C.placeholder : C.text,
          fontWeight: "700",
          fontSize: 16,
        }}
      >
        {value}
      </Text>
      <ChevronDown color={danger ? "#ef4444" : C.sub} size={20} />
    </Pressable>
  );
}

/** +63 phone prefix group with same radius/height as Field */
function PhoneGroup({
  value,
  onChangeText,
}: {
  value: string;
  onChangeText: (t: string) => void;
}) {
  return (
    <View sx={{ flexDirection: "row" }}>
      <View
        sx={{
          pl: 14,
          pr: 12,
          minWidth: 90,
          alignItems: "center",
          justifyContent: "center",
          borderTopLeftRadius: 20,
          borderBottomLeftRadius: 20,
          borderWidth: 1,
          borderColor: C.border,
          bg: C.fieldBg,
          flexDirection: "row",
          columnGap: 8,
          height: 52,
        }}
      >
        {/* simple PH flag block */}
        <View
          sx={{
            width: 16,
            height: 10,
            bg: "#3f7de0",
            borderRadius: 2,
            borderWidth: 1,
            borderColor: "#2d5fb3",
          }}
        />
        <Text sx={{ color: C.text, fontWeight: "900" }}>+63</Text>
      </View>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        keyboardType="number-pad"
        placeholder="9XXXXXXXXX"
        placeholderTextColor={C.placeholder}
        sx={{
          flex: 1,
          bg: C.fieldBg,
          borderWidth: 1,
          borderColor: C.border,
          borderLeftWidth: 0,
          borderTopRightRadius: 20,
          borderBottomRightRadius: 20,
          px: 16,
          height: 52,
          color: C.text,
          fontSize: 16,
        }}
      />
    </View>
  );
}
