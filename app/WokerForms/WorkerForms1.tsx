import AsyncStorage from "@react-native-async-storage/async-storage";
import DateTimePicker, { type DateTimePickerEvent } from "@react-native-community/datetimepicker";
import { Image, Pressable, ScrollView, Text, TextInput, View } from "dripsy";
import * as ImagePicker from "expo-image-picker";
import { useRouter, type Href } from "expo-router";
import { ArrowLeft, Calendar, Upload } from "lucide-react-native";
import { useEffect, useMemo, useState } from "react";
import { Dimensions, Platform } from "react-native";

const { width } = Dimensions.get("window");
const LOGO = require("../../assets/jdklogo.png");
const STORAGE_KEY = "worker_step1";
const NEXT_ROUTE = "/WokerForms/WorkerForms2" as Href;

const C = {
  bg: "#fff", text: "#0f172a", sub: "#475569", blue: "#1e86ff",
  border: "#d9e3f0", field: "#f8fafc", placeholder: "#93a3b5",
};

export default function WorkerForms1() {
  const router = useRouter();

  const [first, setFirst] = useState("");
  const [last, setLast] = useState("");
  const [dob, setDob] = useState<Date | null>(null);
  const [showDob, setShowDob] = useState(false);
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [brgy, setBrgy] = useState("");
  const [street, setStreet] = useState("");
  const [fb, setFb] = useState("");
  const [ig, setIg] = useState("");
  const [li, setLi] = useState("");
  const [photo, setPhoto] = useState<string | null>(null);

  // hydrate
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
      setBrgy(v.brgy ?? "");
      setStreet(v.street ?? "");
      setFb(v.fb ?? ""); setIg(v.ig ?? ""); setLi(v.li ?? "");
      setPhoto(v.photo ?? null);
    })();
  }, []);

  // auto-save
  useEffect(() => {
    const id = setTimeout(() => {
      AsyncStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          first, last, dob: dob ? dob.toISOString() : null,
          phone, email, brgy, street, fb, ig, li, photo
        })
      ).catch(() => {});
    }, 350);
    return () => clearTimeout(id);
  }, [first,last,dob,phone,email,brgy,street,fb,ig,li,photo]);

  const age = useMemo(() => {
    if (!dob) return "";
    const today = new Date();
    let a = today.getFullYear() - dob.getFullYear();
    const m = today.getMonth() - dob.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) a--;
    return String(a);
  }, [dob]);

  const canNext = useMemo(
    () => first.trim() && last.trim() && dob && phone.trim() && email.trim() && brgy.trim() && street.trim(),
    [first,last,dob,phone,email,brgy,street]
  );

  const pickPhoto = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") return;
    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images, allowsEditing: true, aspect: [1,1], quality: 0.9
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
      JSON.stringify({ first,last,dob: dob?.toISOString(),phone,email,brgy,street,fb,ig,li,photo })
    );
    router.push(NEXT_ROUTE);
  };

  return (
    <View sx={{ flex: 1, bg: C.bg }}>
      {/* Header */}
      <View sx={{ px: 14, pt: 8, pb: 10, borderBottomWidth: 1, borderBottomColor: C.border, position: "relative" }}>
        <View sx={{ position: "absolute", left: 0, right: 0, top: 6, alignItems: "center" }} pointerEvents="none">
          <Image source={LOGO} sx={{ width: Math.min(width * 0.75, 320), height: 60 }} resizeMode="contain" />
        </View>
        <Pressable onPress={() => router.back()} sx={{ width: 44, height: 44, alignItems: "center", justifyContent: "center" }}>
          <ArrowLeft color={C.text} size={26} />
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 96 }}>
        <View sx={{ px: 16, pt: 12 }}>
          <Text sx={{ color: C.sub, fontSize: 12, mb: 6 }}>1 of 6 | Post a Worker Application</Text>
          <Text sx={{ color: C.text, fontSize: 24, fontWeight: "900", mb: 14 }}>Step 1: Worker Information</Text>

          <Text sx={{ color: C.text, fontSize: 18, fontWeight: "800" }}>Personal Information</Text>
          <Text sx={{ color: C.sub, mt: 4, mb: 12 }}>Please fill in your personal details to proceed.</Text>

          {/* names */}
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

          {/* dob & age */}
          <Row>
            <Col>
              <Label>Birthdate</Label>
              <Pressable onPress={() => setShowDob(true)} sx={boxBtn}>
                <Text sx={{ color: dob ? C.text : C.placeholder }}>{dob ? formatDate(dob) : "dd/mm/yyyy"}</Text>
                <Calendar color={C.sub} size={18} />
              </Pressable>
            </Col>
            <Col>
              <Label>Age</Label>
              <Input value={age} editable={false} placeholder="Age" />
            </Col>
          </Row>

          {/* contact / email */}
          <Row>
            <Col>
              <Label>Contact Number</Label>
              <Input value={phone} onChangeText={setPhone} keyboardType="phone-pad" placeholder="09xxxxxxxxx" />
            </Col>
            <Col>
              <Label>Email Address</Label>
              <Input value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" placeholder="email@domain.com" />
            </Col>
          </Row>

          {/* brgy / street */}
          <Row>
            <Col>
              <Label>Barangay</Label>
              <Input value={brgy} onChangeText={setBrgy} placeholder="Barangay" />
            </Col>
            <Col>
              <Label>Street</Label>
              <Input value={street} onChangeText={setStreet} placeholder="House No. & Street" />
            </Col>
          </Row>

          {/* profile picture */}
          <View sx={{ mt: 18 }}>
            <Text sx={{ color: C.text, fontSize: 18, fontWeight: "800", mb: 10 }}>Profile Picture</Text>
            <View sx={{ flexDirection: "row", alignItems: "center", gap: 14 }}>
              <Pressable onPress={pickPhoto}>
                <View sx={{ width: 110, height: 110, borderRadius: 55, borderWidth: 1, borderColor: C.border, bg: "#f1f5f9", overflow: "hidden", alignItems: "center", justifyContent: "center" }}>
                  {photo ? <Image source={{ uri: photo }} sx={{ width: "100%", height: "100%" }} /> : <Upload color={C.sub} size={22} />}
                </View>
              </Pressable>
              <Pressable onPress={pickPhoto} sx={{ borderWidth: 1, borderColor: C.border, borderRadius: 10, px: 14, py: 10 }}>
                <Text sx={{ color: C.text, fontWeight: "700" }}>Choose Photo</Text>
              </Pressable>
            </View>
          </View>

          {/* Socials */}
          <View sx={{ mt: 18 }}>
            <Text sx={{ color: C.text, fontSize: 18, fontWeight: "800", mb: 10 }}>Social Media</Text>
            <Input value={fb} onChangeText={setFb} placeholder="Facebook Link" autoCapitalize="none" sx={{ mb: 10 }} />
            <Input value={ig} onChangeText={setIg} placeholder="Instagram Link" autoCapitalize="none" sx={{ mb: 10 }} />
            <Input value={li} onChangeText={setLi} placeholder="LinkedIn Link" autoCapitalize="none" />
          </View>
        </View>
      </ScrollView>

      {/* sticky actions */}
      <Bar>
        <Ghost onPress={() => router.back()} label="Back" />
        <Primary onPress={onNext} disabled={!canNext} label="Next : Work Information" />
      </Bar>

      {showDob && (
        <DateTimePicker
          value={dob ?? new Date()}
          mode="date"
          display={Platform.OS === "ios" ? "spinner" : "default"}
          onChange={onDobChange}
        />
      )}
    </View>
  );
}

/* --- mini ui --- */
const Row = ({ children }: any) => <View sx={{ flexDirection: "row", gap: 10, mb: 12 }}>{children}</View>;
const Col = ({ children }: any) => <View sx={{ flex: 1 }}>{children}</View>;
const Label = ({ children }: any) => <Text sx={{ color: C.text, fontWeight: "700", mb: 6 }}>{children}</Text>;
const Input = (props: any) => (
  <TextInput
    {...props}
    sx={{ bg: C.field, borderWidth: 1, borderColor: C.border, borderRadius: 10, px: 12, py: 12, color: C.text, ...(props.sx || {}) }}
    placeholderTextColor={C.placeholder}
  />
);
const boxBtn = { bg: C.field, borderWidth: 1, borderColor: C.border, borderRadius: 10, px: 12, py: 12, flexDirection: "row", alignItems: "center", justifyContent: "space-between" } as const;
const Bar = ({ children }: any) => (
  <View sx={{ position: "absolute", left: 0, right: 0, bottom: 0, bg: "#fff", borderTopWidth: 1, borderTopColor: C.border, px: 12, py: 12, flexDirection: "row", gap: 10 }}>
    {children}
  </View>
);
const Primary = ({ onPress, label, disabled }: any) => (
  <Pressable onPress={onPress} disabled={disabled} sx={{ flex: 1.3, py: 12, borderRadius: 12, alignItems: "center", bg: disabled ? "#a7c8ff" : C.blue }}>
    <Text sx={{ color: "#fff", fontWeight: "800" }}>{label}</Text>
  </Pressable>
);
const Ghost = ({ onPress, label }: any) => (
  <Pressable onPress={onPress} sx={{ flex: 1, py: 12, borderRadius: 12, alignItems: "center", borderWidth: 1, borderColor: C.border }}>
    <Text sx={{ color: C.text, fontWeight: "800" }}>{label}</Text>
  </Pressable>
);

function formatDate(d: Date) {
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yy = d.getFullYear();
  return `${dd}/${mm}/${yy}`;
}
