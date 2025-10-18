import AsyncStorage from "@react-native-async-storage/async-storage";
import DateTimePicker, { type DateTimePickerEvent } from "@react-native-community/datetimepicker";
import { Image, Pressable, ScrollView, Text, TextInput, View } from "dripsy";
import * as ImagePicker from "expo-image-picker";
import { useRouter, type Href } from "expo-router";
import { ArrowLeft, Calendar, Search, Upload, X } from "lucide-react-native";
import { useEffect, useMemo, useState } from "react";
import { Dimensions, FlatList, Modal, Platform, TouchableOpacity } from "react-native";

/* ---------- Dimensions / Theme (match requestpreview.tsx) ---------- */
const { width } = Dimensions.get("window");
const LOGO = require("../../assets/jdklogo.png");

const C = {
  bg: "#f7f9fc",
  text: "#0f172a",
  sub: "#64748b",
  blue: "#1e86ff",
  blueDark: "#0c62c9",
  border: "#e6eef7",
  chip: "#eaf4ff",
  card: "#fff",
  muted: "#64748b",
  track: "#e9f0fb",
  good: "#16a34a",
  field: "#f8fafc",
  placeholder: "#93a3b5",
};

const PAD = 20;      // page x padding
const GAP = 16;      // gaps between elements
const BTN_PY = 16;   // button vertical padding

/* ---------- Storage / Routing ---------- */
const STORAGE_KEY = "worker_step1";
const NEXT_ROUTE = "/WokerForms/WorkerForms2" as Href;
const BACK_ROUTE = "/home/homeworker" as Href; // ✅ added

/* ---------- Data ---------- */
/** Bacolod City barangays (61) */
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

/* ---------- Helpers ---------- */
function formatDate(d: Date) {
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yy = d.getFullYear();
  return `${dd}/${mm}/${yy}`;
}

/* ---------- Screen ---------- */
export default function WorkerForms1() {
  const router = useRouter();

  const [first, setFirst] = useState("");
  const [last, setLast] = useState("");
  const [dob, setDob] = useState<Date | null>(null);
  const [showDob, setShowDob] = useState(false);
  const [phone, setPhone] = useState("");   // only 10 digits after +63
  const [email, setEmail] = useState("");
  const [brgy, setBrgy] = useState<string>(BARANGAYS[0]);
  const [street, setStreet] = useState("");
  const [photo, setPhoto] = useState<string | null>(null);

  // Barangay selector
  const [brgyOpen, setBrgyOpen] = useState(false);
  const [brgyQuery, setBrgyQuery] = useState("");

  /* -------- hydrate -------- */
  useEffect(() => {
    (async () => {
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const v = JSON.parse(raw);
      setFirst(v.first ?? "");
      setLast(v.last ?? "");
      setDob(v.dob ? new Date(v.dob) : null);
      setPhone(v.phone ?? "");
      setEmail(v.email ?? "");
      setBrgy(v.brgy ?? BARANGAYS[0]);
      setStreet(v.street ?? "");
      setPhoto(v.photo ?? null);
    })();
  }, []);

  /* -------- autosave -------- */
  useEffect(() => {
    const id = setTimeout(() => {
      AsyncStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          first,
          last,
          dob: dob ? dob.toISOString() : null,
          phone,
          email,
          brgy,
          street,
          photo,
        })
      ).catch(() => {});
    }, 350);
    return () => clearTimeout(id);
  }, [first, last, dob, phone, email, brgy, street, photo]);

  /* -------- derived -------- */
  const age = useMemo(() => {
    if (!dob) return "";
    const today = new Date();
    let a = today.getFullYear() - dob.getFullYear();
    const m = today.getMonth() - dob.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) a--;
    return String(Math.max(0, a));
  }, [dob]);

  const ageValid = useMemo(() => {
    if (!dob) return false;
    const n = Number(age);
    return n >= 21 && n <= 55;
  }, [dob, age]);

  const canNext = useMemo(() => {
    const phoneOk = phone.trim().length === 10; // after +63
    const brgyOk = brgy !== BARANGAYS[0];
    return (
      first.trim() &&
      last.trim() &&
      !!dob &&
      ageValid &&
      phoneOk &&
      email.trim() &&
      brgyOk &&
      street.trim()
    );
  }, [first, last, dob, ageValid, phone, email, brgy, street]);

  /* -------- actions -------- */
  const pickPhoto = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") return;
    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.9,
    });
    if (!res.canceled) setPhoto(res.assets[0].uri);
  };

  const onDobChange = (_e: DateTimePickerEvent, d?: Date) => {
    setShowDob(false);
    if (d) setDob(d);
  };

  const onNext = async () => {
    if (!canNext) return;
    await AsyncStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        first,
        last,
        dob: dob?.toISOString(),
        phone,
        email,
        brgy,
        street,
        photo,
      })
    );
    router.push(NEXT_ROUTE);
  };

  /* -------- UI -------- */
  return (
    <View sx={{ flex: 1, bg: C.bg }}>
      {/* Header (roomy) */}
      <View
        sx={{
          px: PAD,
          pt: 12,
          pb: 16,
          borderBottomWidth: 1,
          borderBottomColor: C.border,
          position: "relative",
          bg: C.card,
        }}
      >
        <View sx={{ position: "absolute", left: 0, right: 0, top: 10, alignItems: "center" }} pointerEvents="none">
          <Image source={LOGO} sx={{ width: Math.min(width * 0.7, 300), height: 56 }} resizeMode="contain" />
        </View>
        <Pressable onPress={() => router.push(BACK_ROUTE)} sx={{ width: 48, height: 48, alignItems: "center", justifyContent: "center" }}>
          <ArrowLeft color={C.text} size={28} strokeWidth={2.4} />
        </Pressable>
      </View>

      {/* Step bar */}
      <View sx={{ px: PAD, pt: 18, pb: 14, bg: C.card }}>
        <View sx={{ flexDirection: "row", alignItems: "center", mb: 14 }}>
          <Text sx={{ color: C.text, fontWeight: "900", fontSize: 18 }}>Step 1 of 6</Text>
          <Text sx={{ color: C.sub, ml: 12, fontSize: 14 }}>Worker Information</Text>
        </View>
        <View sx={{ flexDirection: "row", columnGap: 12 }}>
          {[1, 0, 0, 0, 0, 0].map((f, i) => (
            <View
              key={i}
              sx={{
                flex: 1,
                height: 10,
                borderRadius: 999,
                bg: f ? C.blue : C.track,
                borderWidth: 1,
                borderColor: C.border,
              }}
            />
          ))}
        </View>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 160 }} showsVerticalScrollIndicator={false}>
        <View sx={{ px: PAD, pt: 18 }}>
          {/* Card wrapper for a spacious feel */}
          <View
            sx={{
              bg: C.card,
              borderWidth: 1,
              borderColor: C.border,
              borderRadius: 24,
              px: PAD,
              py: 18,
              mb: 24,
              shadowColor: "#000",
              shadowOpacity: Platform.OS === "android" ? 0 : 0.06,
              shadowRadius: 14,
              shadowOffset: { width: 0, height: 6 },
              elevation: 1,
            }}
          >
            {/* Title */}
            <Text sx={{ color: C.text, fontWeight: "900", fontSize: 20, mb: 6 }}>
              Personal Information
            </Text>
            <Text sx={{ color: C.sub, mb: GAP }}>
              Please fill in your personal details to proceed.
            </Text>

            {/* Names */}
            <Row>
              <Col>
                <Label>First Name</Label>
                <Input value={first} onChangeText={setFirst} placeholder="First name" />
              </Col>
              <Col>
                <Label>Last Name</Label>
                <Input value={last} onChangeText={setLast} placeholder="Last name" />
              </Col>
            </Row>

            {/* Birthdate & Age */}
            <Row>
              <Col>
                <Label>Birthdate</Label>
                <Pressable onPress={() => setShowDob(true)} sx={boxBtn}>
                  <Text sx={{ color: dob ? C.text : C.placeholder }}>
                    {dob ? formatDate(dob) : "dd/mm/yyyy"}
                  </Text>
                  <Calendar color={C.sub} size={18} />
                </Pressable>
                <Text sx={{ color: C.muted, fontSize: 12, mt: 6 }}>
                  Must be between 10/18/1970 and 10/18/2004 (21–55 yrs).
                </Text>
                {!ageValid && dob && (
                  <Text sx={{ color: "#ef4444", fontSize: 12, mt: 4 }}>Age must be 21–55.</Text>
                )}
              </Col>
              <Col>
                <Label>Age</Label>
                <Input value={age} editable={false} placeholder="Age" />
              </Col>
            </Row>

            {/* Contact & Email */}
            <Row>
              <Col>
                <Label>Contact Number</Label>
                <PhoneGroup
                  value={phone}
                  onChangeText={(t: string) => setPhone(t.replace(/[^0-9]/g, "").slice(0, 10))}
                />
                <Text sx={{ color: C.muted, fontSize: 12, mt: 6 }}>
                  Format: +63 <Text sx={{ fontWeight: "700" }}>9XXXXXXXXX</Text>
                </Text>
              </Col>
              <Col>
                <Label>Email Address</Label>
                <Input
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  placeholder="email@domain.com"
                />
              </Col>
            </Row>

            {/* Barangay & Street */}
            <Row>
              <Col>
                <Label>Barangay</Label>
                <Pressable onPress={() => setBrgyOpen(true)} sx={selectBtn}>
                  <Text sx={{ color: brgy === BARANGAYS[0] ? C.placeholder : C.text }}>
                    {brgy || "Select Barangay"}
                  </Text>
                </Pressable>
              </Col>
              <Col>
                <Label>Street</Label>
                <Input value={street} onChangeText={setStreet} placeholder="House No. & Street" />
              </Col>
            </Row>

            {/* Profile Picture */}
            <View sx={{ mt: GAP }}>
              <Text sx={{ color: C.text, fontSize: 16, fontWeight: "900", mb: 10 }}>
                Profile Picture
              </Text>
              <View sx={{ flexDirection: "row", alignItems: "center", columnGap: 14 }}>
                <Pressable onPress={pickPhoto}>
                  <View
                    sx={{
                      width: 124,
                      height: 124,
                      borderRadius: 62,
                      borderWidth: 1,
                      borderColor: C.border,
                      bg: "#f1f5f9",
                      overflow: "hidden",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {photo ? (
                      <Image source={{ uri: photo }} sx={{ width: "100%", height: "100%" }} />
                    ) : (
                      <Upload color={C.sub} size={22} />
                    )}
                  </View>
                </Pressable>

                <Pressable
                  onPress={pickPhoto}
                  sx={{
                    borderWidth: 1,
                    borderColor: C.border,
                    borderRadius: 14,
                    px: 16,
                    py: 12,
                    bg: "#fff",
                  }}
                >
                  <Text sx={{ color: C.text, fontWeight: "900" }}>Choose Photo</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Sticky Actions (roomy) */}
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
          }}
        >
          <Text sx={{ color: "#fff", fontWeight: "900", fontSize: 16 }}>
            Next : Work Information
          </Text>
        </Pressable>
      </View>

      {/* Date Picker */}
      {showDob && (
        <DateTimePicker
          value={dob ?? new Date(2000, 0, 1)}
          mode="date"
          display={Platform.OS === "ios" ? "spinner" : "default"}
          onChange={onDobChange}
          maximumDate={new Date()}
        />
      )}

      {/* Barangay Modal (spacious) */}
      <Modal
        visible={brgyOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setBrgyOpen(false)}
      >
        <View style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.35)", justifyContent: "flex-end" }}>
          <View
            style={{
              backgroundColor: "#fff",
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
              maxHeight: "75%",
            }}
          >
            {/* header */}
            <View
              style={{
                paddingHorizontal: PAD,
                paddingVertical: 14,
                borderBottomWidth: 1,
                borderBottomColor: C.border,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Text style={{ fontWeight: "900", fontSize: 18, color: C.text }}>
                Select Barangay
              </Text>
              <TouchableOpacity onPress={() => setBrgyOpen(false)} style={{ padding: 8 }}>
                <X color={C.text} size={22} />
              </TouchableOpacity>
            </View>

            {/* search */}
            <View style={{ paddingHorizontal: PAD, paddingVertical: 12 }}>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  backgroundColor: C.field,
                  borderWidth: 1,
                  borderColor: C.border,
                  borderRadius: 14,
                  paddingHorizontal: 12,
                  paddingVertical: 10,
                  columnGap: 8,
                }}
              >
                <Search color={C.sub} size={18} />
                <TextInput
                  value={brgyQuery}
                  onChangeText={setBrgyQuery}
                  placeholder="Search barangay…"
                  placeholderTextColor={C.placeholder}
                  sx={{ color: C.text, flex: 1 }}
                />
              </View>
            </View>

            {/* list */}
            <FlatList
              keyboardShouldPersistTaps="handled"
              data={BARANGAYS.filter(b =>
                b.toLowerCase().includes((brgyQuery || "").toLowerCase())
              ).filter(b => b !== "Select Barangay")}
              keyExtractor={(item) => item}
              ItemSeparatorComponent={() => <View style={{ height: 1, backgroundColor: C.border }} />}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => {
                    setBrgy(item);
                    setBrgyOpen(false);
                  }}
                  style={{ paddingHorizontal: PAD, paddingVertical: 14 }}
                >
                  <Text style={{ color: C.text, fontSize: 15 }}>{item}</Text>
                </TouchableOpacity>
              )}
              style={{ maxHeight: "100%" }}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
}

/* ---------- UI Bits (roomier defaults) ---------- */
const Row = ({ children }: any) => (
  <View sx={{ flexDirection: "row", gap: GAP, mb: GAP }}>
    {children}
  </View>
);
const Col = ({ children }: any) => <View sx={{ flex: 1 }}>{children}</View>;
const Label = ({ children }: any) => (
  <Text sx={{ color: C.text, fontWeight: "900", mb: 8 }}>{children}</Text>
);
const Input = (props: any) => (
  <TextInput
    {...props}
    sx={{
      bg: C.field,
      borderWidth: 1,
      borderColor: C.border,
      borderRadius: 14,
      px: 14,
      py: 14,
      color: C.text,
      fontSize: 15,
      ...(props.sx || {}),
    }}
    placeholderTextColor={C.placeholder}
  />
);

const boxBtn = {
  bg: C.field,
  borderWidth: 1,
  borderColor: C.border,
  borderRadius: 14,
  px: 14,
  py: 14,
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
} as const;

const selectBtn = {
  bg: C.field,
  borderWidth: 1,
  borderColor: C.border,
  borderRadius: 14,
  px: 14,
  py: 14,
} as const;

/** phone with +63 prefix */
const PhoneGroup = ({ value, onChangeText }: { value: string; onChangeText: (t: string) => void }) => (
  <View sx={{ flexDirection: "row" }}>
    <View
      sx={{
        px: 14,
        minWidth: 70,
        alignItems: "center",
        justifyContent: "center",
        borderTopLeftRadius: 14,
        borderBottomLeftRadius: 14,
        borderWidth: 1,
        borderColor: C.border,
        bg: C.field,
      }}
    >
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
        bg: C.field,
        borderWidth: 1,
        borderColor: C.border,
        borderLeftWidth: 0,
        borderTopRightRadius: 14,
        borderBottomRightRadius: 14,
        px: 14,
        py: 14,
        color: C.text,
        fontSize: 15,
      }}
    />
  </View>
);
