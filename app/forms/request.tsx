// app/forms/request.tsx
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";
import { useRouter, type Href } from "expo-router";
import {
  ArrowLeft,
  Camera,
  ChevronDown,
  Image as ImageIcon,
  Mail,
  MapPin,
  Phone as PhoneIcon,
  User
} from "lucide-react-native";
import { useEffect, useMemo, useState } from "react";
import {
  Dimensions,
  FlatList,
  Image,
  Modal,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

/* ---------- Theme / Layout ---------- */
const { width } = Dimensions.get("window");
const C = {
  bg: "#f7f9fc",
  card: "#ffffff",
  text: "#0f172a",
  sub: "#64748b",
  blue: "#1e86ff",
  blueDark: "#0c62c9",
  border: "#e6eef7",
  field: "#f8fafc",
  placeholder: "#93a3b5",
  chip: "#eef6ff",
};
const PAD = 18;
const GAP = 14;

/* ---------- Storage / Routes ---------- */
const STORAGE_KEY = "client_request_step1";
const NEXT_ROUTE = "/forms/request2" as Href;
const BACK_ROUTE = "/home/index" as Href; // adjust if your client's home is different

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

/* ---------- Screen ---------- */
export default function ClientRequest1() {
  const router = useRouter();

  // Form state
  const [first, setFirst] = useState("");
  const [last, setLast] = useState("");
  const [phone, setPhone] = useState(""); // 10 digits after +63
  const [email, setEmail] = useState("");
  const [brgy, setBrgy] = useState<string>(BARANGAYS[0]);
  const [street, setStreet] = useState("");
  const [moreAddr, setMoreAddr] = useState(""); // Additional Address (Required)
  const [photo, setPhoto] = useState<string | null>(null);

  // Barangay selector
  const [brgyOpen, setBrgyOpen] = useState(false);
  const [brgyQuery, setBrgyQuery] = useState("");

  // Hydrate
  useEffect(() => {
    (async () => {
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
    })();
  }, []);

  // Autosave
  useEffect(() => {
    const id = setTimeout(() => {
      AsyncStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ first, last, phone, email, brgy, street, moreAddr, photo })
      ).catch(() => {});
    }, 350);
    return () => clearTimeout(id);
  }, [first, last, phone, email, brgy, street, moreAddr, photo]);

  // Derived
  const emailOk = useMemo(() => /\S+@\S+\.\S+/.test(email), [email]);
  const phoneOk = useMemo(() => phone.trim().length === 10, [phone]); // after +63
  const brgyOk = useMemo(() => brgy !== BARANGAYS[0], [brgy]);
  const canNext = useMemo(() => {
    return (
      first.trim() &&
      last.trim() &&
      emailOk &&
      phoneOk &&
      brgyOk &&
      street.trim() &&
      moreAddr.trim()
    );
  }, [first, last, emailOk, phoneOk, brgyOk, street, moreAddr]);

  // Actions
  const choosePhoto = async () => {
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
        style={{
          paddingHorizontal: PAD,
          paddingTop: 8,
          paddingBottom: 12,
          borderBottomWidth: 1,
          borderBottomColor: C.border,
          backgroundColor: "#fff",
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
          <Pressable
            onPress={() => router.push(BACK_ROUTE)}
            style={{ width: 44, height: 44, alignItems: "center", justifyContent: "center" }}
          >
            <ArrowLeft color={C.text} size={26} />
          </Pressable>

          {/* Step indicator right side */}
          <View style={{ alignItems: "flex-end", flex: 1 }}>
            <Text style={{ color: C.sub, marginBottom: 6, textAlign: "right" }}>Step 1 of 4</Text>
            <View
              style={{
                width: 140,
                height: 6,
                backgroundColor: "#e8eef7",
                borderRadius: 999,
                overflow: "hidden",
                alignSelf: "flex-end",
              }}
            >
              <View style={{ width: "25%", height: "100%", backgroundColor: C.blue }} />
            </View>
          </View>
        </View>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 160 }} showsVerticalScrollIndicator={false}>
        <View style={{ paddingHorizontal: PAD, paddingTop: 14 }}>
          {/* Card */}
          <View
            style={{
              backgroundColor: C.card,
              borderWidth: 1,
              borderColor: C.border,
              borderRadius: 20,
              paddingHorizontal: PAD,
              paddingVertical: 16,
              shadowColor: "#000",
              shadowOpacity: Platform.OS === "android" ? 0 : 0.06,
              shadowRadius: 12,
              shadowOffset: { width: 0, height: 6 },
              elevation: 1,
            }}
          >
            <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 10 }}>
              <Text style={{ color: C.text, fontWeight: "900", fontSize: 18, flex: 1 }}>
                Personal Information
              </Text>
              <View
                style={{
                  paddingVertical: 4,
                  paddingHorizontal: 10,
                  backgroundColor: C.chip,
                  borderRadius: 999,
                  borderWidth: 1,
                  borderColor: C.border,
                }}
              >
                <Text style={{ color: C.sub, fontWeight: "700" }}>Client</Text>
              </View>
            </View>

            <Text style={{ color: C.sub, marginBottom: 14 }}>
              Please fill in your personal details to proceed.
            </Text>

            {/* Two column on wide phones, stacked on small */}
            <View style={{ flexDirection: "row", gap: GAP }}>
              <View style={{ flex: 1 }}>
                <Label icon={<User color={C.sub} size={16} />}>First Name</Label>
                <Input
                  value={first}
                  onChangeText={setFirst}
                  placeholder="First name"
                />
              </View>
              <View style={{ flex: 1 }}>
                <Label icon={<User color={C.sub} size={16} />}>Last Name</Label>
                <Input
                  value={last}
                  onChangeText={setLast}
                  placeholder="Last name"
                />
              </View>
            </View>

            <View style={{ height: 10 }} />

            <View style={{ flexDirection: "row", gap: GAP }}>
              <View style={{ flex: 1 }}>
                <Label icon={<PhoneIcon color={C.sub} size={16} />}>Contact Number</Label>
                <PhoneGroup
                  value={phone}
                  onChangeText={(t: string) => setPhone(t.replace(/[^0-9]/g, "").slice(0, 10))}
                />
                <Text style={{ color: C.sub, fontSize: 12, marginTop: 6 }}>
                  Format: +63 <Text style={{ fontWeight: "700" }}>9XXXXXXXXX</Text>
                </Text>
              </View>

              <View style={{ flex: 1 }}>
                <Label icon={<Mail color={C.sub} size={16} />}>Email Address</Label>
                <Input
                  value={email}
                  onChangeText={setEmail}
                  placeholder="Email address"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  borderTint={email ? (emailOk ? "ok" : "bad") : "none"}
                />
              </View>
            </View>

            <View style={{ height: 10 }} />

            <View style={{ flexDirection: "row", gap: GAP }}>
              <View style={{ flex: 1 }}>
                <Label icon={<MapPin color={C.sub} size={16} />}>Barangay</Label>
                <Pressable onPress={() => setBrgyOpen(true)} style={selectBtn}>
                  <Text style={{ color: brgy === BARANGAYS[0] ? C.placeholder : C.text }}>
                    {brgy}
                  </Text>
                  <ChevronDown color={C.sub} size={18} />
                </Pressable>
              </View>

              <View style={{ flex: 1 }}>
                <Label icon={<MapPin color={C.sub} size={16} />}>Street</Label>
                <Input value={street} onChangeText={setStreet} placeholder="House No. and Street" />
              </View>
            </View>

            <View style={{ height: 10 }} />

            <Label>Additional Address (Landmark etc.)</Label>
            <Multiline
              value={moreAddr}
              onChangeText={setMoreAddr}
              placeholder="Additional Address (Required)"
            />

            {/* Profile Picture (right column in web -> here stacked) */}
            <View style={{ marginTop: 18, alignItems: "center" }}>
              <Text style={{ color: C.text, fontWeight: "900", marginBottom: 6 }}>Profile Picture</Text>
              <Text style={{ color: C.sub, marginBottom: 12 }}>Upload your profile picture.</Text>

              <Pressable onPress={choosePhoto} style={{ alignItems: "center" }}>
                <View
                  style={{
                    width: 124,
                    height: 124,
                    borderRadius: 62,
                    borderWidth: 1,
                    borderColor: C.border,
                    backgroundColor: "#f1f5f9",
                    overflow: "hidden",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {photo ? (
                    <Image source={{ uri: photo }} style={{ width: "100%", height: "100%" }} />
                  ) : (
                    <>
                      <ImageIcon color="#c2cfdf" size={28} />
                      <Text style={{ color: C.sub, marginTop: 6 }}>+</Text>
                    </>
                  )}
                </View>

                <View
                  style={{
                    marginTop: 12,
                    paddingVertical: 12,
                    paddingHorizontal: 18,
                    borderRadius: 12,
                    backgroundColor: C.blue,
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 8,
                  }}
                >
                  <Camera color="#fff" size={18} />
                  <Text style={{ color: "#fff", fontWeight: "800" }}>Choose Photo</Text>
                </View>
              </Pressable>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Sticky Bottom Bar */}
      <View
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "#fff",
          borderTopWidth: 1,
          borderTopColor: C.border,
          padding: 14,
          flexDirection: "row",
          columnGap: 12,
        }}
      >
        <Pressable
          onPress={() => router.push(BACK_ROUTE)}
          style={{
            flex: 1,
            borderWidth: 1,
            borderColor: C.border,
            borderRadius: 14,
            alignItems: "center",
            justifyContent: "center",
            paddingVertical: 14,
            backgroundColor: "#fff",
          }}
        >
          <Text style={{ color: C.text, fontWeight: "800" }}>Back</Text>
        </Pressable>

        <Pressable
          onPress={onNext}
          disabled={!canNext}
          style={{
            flex: 1.25,
            borderRadius: 14,
            alignItems: "center",
            justifyContent: "center",
            paddingVertical: 14,
            backgroundColor: canNext ? C.blue : "#a7c8ff",
          }}
        >
          <Text style={{ color: "#fff", fontWeight: "800" }}>Next : Service Request Details</Text>
        </Pressable>
      </View>

      {/* Barangay Modal */}
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
              borderTopLeftRadius: 22,
              borderTopRightRadius: 22,
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
              <Text style={{ fontWeight: "900", fontSize: 18, color: C.text }}>Select Barangay</Text>
              <TouchableOpacity onPress={() => setBrgyOpen(false)} style={{ padding: 8 }}>
                <Text style={{ color: C.blue, fontWeight: "800" }}>Close</Text>
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
                <SearchIcon />
                <TextInput
                  value={brgyQuery}
                  onChangeText={setBrgyQuery}
                  placeholder="Search barangay…"
                  placeholderTextColor={C.placeholder}
                  style={{ color: C.text, flex: 1 }}
                />
              </View>
            </View>

            {/* list */}
            <FlatList
              keyboardShouldPersistTaps="handled"
              data={BARANGAYS.filter((b) =>
                b.toLowerCase().includes((brgyQuery || "").toLowerCase())
              ).filter((b) => b !== "Select Barangay")}
              keyExtractor={(item) => item}
              ItemSeparatorComponent={() => (
                <View style={{ height: 1, backgroundColor: C.border }} />
              )}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => {
                    setBrgy(item);
                    setBrgyOpen(false);
                  }}
                  style={{ paddingHorizontal: PAD, paddingVertical: 14 }}
                >
                  <Text style={{ color: C.text }}>{item}</Text>
                </TouchableOpacity>
              )}
              style={{ maxHeight: "100%" }}
            />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

/* ---------- UI bits ---------- */
const Label = ({ children, icon }: any) => (
  <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 8 }}>
    {icon ? <View style={{ width: 18, marginRight: 8 }}>{icon}</View> : null}
    <Text style={{ color: C.text, fontWeight: "800" }}>{children}</Text>
  </View>
);

const Input = ({
  borderTint = "none",
  style,
  ...props
}: any & { borderTint?: "ok" | "bad" | "none" }) => (
  <TextInput
    {...props}
    placeholderTextColor={C.placeholder}
    style={[
      {
        height: 48,
        paddingHorizontal: 14,
        borderRadius: 14,
        backgroundColor: C.field,
        fontSize: 15,
        borderWidth: 2,
        borderColor:
          borderTint === "none" ? C.border : borderTint === "ok" ? "#16a34a" : "#ef4444",
        color: C.text,
      },
      style,
    ]}
  />
);

const Multiline = (props: any) => (
  <TextInput
    {...props}
    multiline
    textAlignVertical="top"
    placeholderTextColor={C.placeholder}
    style={{
      minHeight: 84,
      paddingHorizontal: 14,
      paddingVertical: 12,
      borderRadius: 14,
      backgroundColor: C.field,
      fontSize: 15,
      borderWidth: 2,
      borderColor: C.border,
      color: C.text,
    }}
  />
);

const selectBtn = {
  height: 48,
  backgroundColor: C.field,
  borderWidth: 2,
  borderColor: C.border,
  borderRadius: 14,
  paddingHorizontal: 14,
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
} as const;

/** phone with +63 prefix + flag */
const PhoneGroup = ({
  value,
  onChangeText,
}: {
  value: string;
  onChangeText: (t: string) => void;
}) => (
  <View style={{ flexDirection: "row" }}>
    <View
      style={{
        paddingHorizontal: 12,
        minWidth: 84,
        alignItems: "center",
        justifyContent: "center",
        borderTopLeftRadius: 14,
        borderBottomLeftRadius: 14,
        borderWidth: 2,
        borderColor: C.border,
        backgroundColor: C.field,
        flexDirection: "row",
        gap: 8,
      }}
    >
      {/* simple PH flag dot */}
      <View
        style={{
          width: 16,
          height: 10,
          backgroundColor: "#3f7de0",
          borderRadius: 2,
          borderWidth: 1,
          borderColor: "#2d5fb3",
        }}
      />
      <Text style={{ color: C.text, fontWeight: "900" }}>+63</Text>
    </View>
    <TextInput
      value={value}
      onChangeText={onChangeText}
      keyboardType="number-pad"
      placeholder="9XXXXXXXXX"
      placeholderTextColor={C.placeholder}
      style={{
        flex: 1,
        backgroundColor: C.field,
        borderWidth: 2,
        borderColor: C.border,
        borderLeftWidth: 0,
        borderTopRightRadius: 14,
        borderBottomRightRadius: 14,
        paddingHorizontal: 14,
        fontSize: 15,
        color: C.text,
      }}
    />
  </View>
);

const SearchIcon = () => (
  // tiny inline search glyph (keeps deps consistent even if lucide isn't imported here)
  <View
    style={{
      width: 16,
      height: 16,
      borderRadius: 8,
      borderWidth: 2,
      borderColor: C.placeholder,
      justifyContent: "center",
      alignItems: "center",
    }}
  >
    <View
      style={{
        width: 6,
        height: 2,
        backgroundColor: C.placeholder,
        borderRadius: 1,
        transform: [{ rotate: "45deg" }, { translateX: 5 }, { translateY: 3 }],
      }}
    />
  </View>
);
