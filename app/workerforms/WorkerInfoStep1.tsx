// app/workerforms/WorkerInfoStep1.tsx
import DateTimePicker from "@react-native-community/datetimepicker";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import {
  Calendar,
  Camera,
  Mail,
  MapPin,
  Phone,
  User2,
} from "lucide-react-native";
import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Modal,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { supabase } from "../../supabase/supabase"; // ✅ adjust if needed

const BLUE = "#1E88E5";

const BACOLOD_BARANGAYS = [
  "Alangilan",
  "Alijis",
  "Banago",
  "Barangay 1",
  "Barangay 2",
  "Barangay 3",
  "Barangay 4",
  "Barangay 5",
  "Barangay 6",
  "Barangay 7",
  "Barangay 8",
  "Barangay 9",
  "Barangay 10",
  "Barangay 11",
  "Barangay 12",
  "Barangay 13",
  "Barangay 14",
  "Barangay 15",
  "Barangay 16",
  "Barangay 17",
  "Barangay 18",
  "Barangay 19",
  "Barangay 20",
  "Barangay 21",
  "Barangay 22",
  "Barangay 23",
  "Barangay 24",
  "Barangay 25",
  "Barangay 26",
  "Barangay 27",
  "Barangay 28",
  "Barangay 29",
  "Barangay 30",
  "Barangay 31",
  "Barangay 32",
  "Barangay 33",
  "Barangay 34",
  "Barangay 35",
  "Barangay 36",
  "Barangay 37",
  "Barangay 38",
  "Barangay 39",
  "Barangay 40",
  "Barangay 41",
  "Bata",
  "Cabug",
  "Estefania",
  "Felisa",
  "Granada",
  "Mandalagan",
  "Mansilingan",
  "Montevista",
  "Pahanocoy",
  "Punta Taytay",
  "Singcang-Airport",
  "Sum-ag",
  "Taculing",
  "Tangub",
  "Villamonte",
  "Vista Alegre",
  "Handumanan",
];

const pad2 = (n: number) => String(n).padStart(2, "0");

function formatDateToUiDob(dt: Date) {
  const mo = pad2(dt.getMonth() + 1);
  const d = pad2(dt.getDate());
  const y = String(dt.getFullYear());
  return `${mo}/${d}/${y}`;
}

function formatDobForUi(yyyyMmDd: string) {
  // "YYYY-MM-DD" -> "MM/DD/YYYY"
  if (!yyyyMmDd) return "";
  const m = yyyyMmDd.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!m) return "";
  const [, y, mo, d] = m;
  return `${mo}/${d}/${y}`;
}

function dobUiToISO(mmDdYyyy: string): string | null {
  const m = (mmDdYyyy || "").trim().match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (!m) return null;
  const [, mo, d, y] = m;
  return `${y}-${mo}-${d}`;
}

function calcAgeFromUiDob(mmDdYyyy: string): number | null {
  const m = (mmDdYyyy || "").trim().match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (!m) return null;
  const mo = Number(m[1]);
  const d = Number(m[2]);
  const y = Number(m[3]);
  const birth = new Date(y, mo - 1, d);
  if (Number.isNaN(birth.getTime())) return null;

  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const diffMo = today.getMonth() - birth.getMonth();
  if (diffMo < 0 || (diffMo === 0 && today.getDate() < birth.getDate())) age--;
  return age;
}

function getFileNameFromUri(uri: string) {
  const parts = uri.split("/");
  const last = parts[parts.length - 1] || `profile_${Date.now()}.jpg`;
  return last.includes(".") ? last : `${last}.jpg`;
}

// --- Phone helpers (PH) ---
const stripToDigits = (s: string) => (s || "").replace(/[^\d]/g, "");

// turn any input into digits after +63 (10 digits preferred)
const toPHLocalDigits = (input: string) => {
  const digits = stripToDigits(input);
  if (!digits) return "";

  // +63 9XXXXXXXXX
  if (digits.startsWith("63") && digits.length >= 12)
    return digits.slice(2, 12);

  // 09XXXXXXXXX -> take last 10 after leading 0
  if (digits.startsWith("09") && digits.length >= 11)
    return digits.slice(1, 11);

  // 9XXXXXXXXX
  if (digits.startsWith("9") && digits.length >= 10) return digits.slice(0, 10);

  // fallback
  if (digits.length > 10) return digits.slice(digits.length - 10);

  return digits;
};

type WorkerStep1Payload = {
  firstName: string;
  lastName: string;
  birthdate: string; // MM/DD/YYYY
  date_of_birth: string; // YYYY-MM-DD
  age: string;
  phone: string; // 10 digits (9XXXXXXXXX)
  email: string;
  barangay: string;
  street: string;
  profileUri: string; // local uri
  profileName: string;
};

type WorkerProfileRow = {
  auth_uid: string;
  first_name: string | null;
  last_name: string | null;
  email_address: string | null;
  contact_number: string | null; // DB can be +63XXXXXXXXXX or anything
  date_of_birth: string | null; // YYYY-MM-DD
  age?: number | null;
};

const safeStr = (v: any) => (v ?? "").toString();

export default function WorkerInfoStep1() {
  const router = useRouter();

  // ✅ fields that will be autofilled & locked (if found)
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [birthdate, setBirthdate] = useState(""); // MM/DD/YYYY
  const [phone, setPhone] = useState(""); // local digits 10
  const [email, setEmail] = useState("");

  // ✅ editable fields (NOT autofilled)
  const [barangay, setBarangay] = useState("");
  const [street, setStreet] = useState("");
  const [barangayOpen, setBarangayOpen] = useState(false);

  // DOB picker state (won't open when locked)
  const [dobModalOpen, setDobModalOpen] = useState(false);
  const [tempDobDate, setTempDobDate] = useState<Date>(new Date(2000, 0, 1));

  // profile pic (manual)
  const [profileUri, setProfileUri] = useState("");
  const [profileName, setProfileName] = useState("");

  const [saving, setSaving] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(true);

  // lock flags (if profile exists)
  const [lockNameEmailPhoneDob, setLockNameEmailPhoneDob] = useState(false);

  const age = useMemo(() => {
    const a = calcAgeFromUiDob(birthdate);
    return a == null ? "" : String(a);
  }, [birthdate]);

  // ✅ Load worker profile and autofill + lock fields
  useEffect(() => {
    let mounted = true;

    const loadProfile = async () => {
      try {
        setLoadingProfile(true);

        const {
          data: { user },
          error: userErr,
        } = await supabase.auth.getUser();

        if (userErr) throw userErr;
        if (!user) {
          Alert.alert("Not signed in", "Please log in again.");
          router.replace("./login/login");
          return;
        }

        const authUid = user.id;

        const res = await supabase
          .from("user_worker")
          .select(
            "auth_uid, first_name, last_name, email_address, contact_number, date_of_birth, age",
          )
          .eq("auth_uid", authUid)
          .maybeSingle();

        if (res.error) throw res.error;

        if (!mounted) return;

        // If worker profile found, autofill & lock
        if (res.data) {
          const p = res.data as WorkerProfileRow;

          const f = safeStr(p.first_name).trim();
          const l = safeStr(p.last_name).trim();
          const e =
            safeStr(p.email_address).trim() || safeStr(user.email).trim();
          const dobUi = formatDobForUi(safeStr(p.date_of_birth));
          const localDigits = toPHLocalDigits(safeStr(p.contact_number));

          setFirstName(f);
          setLastName(l);
          setEmail(e);
          setBirthdate(dobUi);
          setPhone(localDigits);

          // optional: align temp picker if dob exists
          if (dobUi) {
            const iso = dobUiToISO(dobUi);
            if (iso) {
              const m = iso.match(/^(\d{4})-(\d{2})-(\d{2})$/);
              if (m) {
                const y = Number(m[1]);
                const mo = Number(m[2]);
                const d = Number(m[3]);
                const dt = new Date(y, mo - 1, d);
                if (!Number.isNaN(dt.getTime())) setTempDobDate(dt);
              }
            }
          }

          setLockNameEmailPhoneDob(true);
        } else {
          // If no profile row, keep editable (so user isn't stuck)
          setLockNameEmailPhoneDob(false);

          // fallback email from auth user (optional)
          if (user.email) setEmail(user.email);
        }
      } catch (e: any) {
        if (!mounted) return;
        setLockNameEmailPhoneDob(false);
        Alert.alert("Error", e?.message ?? "Failed to load worker profile.");
      } finally {
        if (mounted) setLoadingProfile(false);
      }
    };

    loadProfile();
    return () => {
      mounted = false;
    };
  }, [router]);

  const pickProfilePhoto = async () => {
    try {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission needed",
          "Please allow photo access to upload your profile picture.",
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 0.85,
        aspect: [1, 1],
      });

      if (result.canceled) return;
      const asset = result.assets?.[0];
      if (!asset?.uri) return;

      const filename = asset.fileName || getFileNameFromUri(asset.uri);
      setProfileUri(asset.uri);
      setProfileName(filename);
    } catch (e: any) {
      Alert.alert("Upload failed", e?.message ?? "Could not choose photo");
    }
  };

  const openDobModal = () => {
    if (lockNameEmailPhoneDob) return; // 🔒 locked
    setTempDobDate(new Date(2000, 0, 1));
    setDobModalOpen(true);
  };

  const confirmDob = () => {
    setBirthdate(formatDateToUiDob(tempDobDate));
    setDobModalOpen(false);
  };

  const handleNext = async () => {
    if (loadingProfile) return;

    // ✅ validations
    if (!firstName.trim())
      return Alert.alert("Required", "Please enter your first name.");
    if (!lastName.trim())
      return Alert.alert("Required", "Please enter your last name.");
    if (!email.trim())
      return Alert.alert("Required", "Please enter your email.");

    if (!birthdate.trim())
      return Alert.alert("Required", "Please select your birthday.");
    const dobISO = dobUiToISO(birthdate);
    if (!dobISO)
      return Alert.alert("Invalid Birthday", "Birthday format is invalid.");

    const ageNum = Number(age);
    if (!age || !Number.isFinite(ageNum)) {
      return Alert.alert(
        "Invalid Birthday",
        "Age could not be calculated. Please pick birthday again.",
      );
    }

    // app rule
    if (ageNum < 21 || ageNum > 55) {
      return Alert.alert("Not eligible", "Age must be between 21 and 55.");
    }

    const digits = phone.replace(/\D/g, "").slice(0, 10);
    if (!digits || digits.length !== 10 || digits[0] !== "9") {
      return Alert.alert(
        "Invalid Contact",
        "Enter 10 digits starting with 9 (we add +63 automatically).",
      );
    }

    // ✅ NOT autofilled fields
    if (!barangay.trim())
      return Alert.alert("Required", "Please select your barangay.");
    if (!street.trim())
      return Alert.alert(
        "Required",
        "Please enter your street / house number.",
      );

    if (!profileUri)
      return Alert.alert("Required", "Please upload your profile picture.");

    try {
      setSaving(true);

      const payload: WorkerStep1Payload = {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        birthdate: birthdate.trim(),
        date_of_birth: dobISO,
        age: String(ageNum),
        phone: digits,
        email: email.trim(),
        barangay: barangay.trim(),
        street: street.trim(),
        profileUri,
        profileName: profileName || "profile.jpg",
      };

      router.push({
        pathname: "/workerforms/WorkerDescribeWorkStep2",
        params: { personal: encodeURIComponent(JSON.stringify(payload)) },
      });
    } catch (e: any) {
      Alert.alert("Next failed", e?.message ?? "Could not proceed.");
    } finally {
      setSaving(false);
    }
  };

  const handleBack = () => router.back();

  const readonlyWrapStyle = [styles.inputWrap, styles.readonlyWrap] as any;
  const readonlyInputStyle = [styles.input, styles.readonlyInput] as any;

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Image
          source={require("../../image/jdklogo.png")}
          style={styles.logo}
        />
      </View>

      <ScrollView
        style={styles.root}
        contentContainerStyle={styles.scrollInner}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.progressText}>
          1 of 4 • Post a Worker Application
        </Text>
        <Text style={styles.stepTitle}>Step 1: Worker Information</Text>
        <Text style={styles.stepSubtitle}>Please fill in your details</Text>

        {/* Personal Info Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Personal Information</Text>
          <Text style={styles.cardHint}>
            {lockNameEmailPhoneDob
              ? "These details are taken from your Account Settings and cannot be edited here."
              : "Please fill in your personal details to proceed."}
          </Text>

          {loadingProfile && (
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 10,
                marginTop: 6,
              }}
            >
              <ActivityIndicator />
              <Text
                style={{ fontSize: 12.5, color: "#6b7280", fontWeight: "700" }}
              >
                Loading your account details...
              </Text>
            </View>
          )}

          <View style={styles.row2}>
            <View style={styles.field}>
              <Text style={styles.label}>First Name</Text>
              <View
                style={
                  lockNameEmailPhoneDob ? readonlyWrapStyle : styles.inputWrap
                }
              >
                <User2 size={20} color="#9ca3af" />
                <TextInput
                  value={firstName}
                  onChangeText={setFirstName}
                  editable={!lockNameEmailPhoneDob}
                  style={
                    lockNameEmailPhoneDob ? readonlyInputStyle : styles.input
                  }
                  placeholder="First name"
                  placeholderTextColor="#9ca3af"
                />
              </View>
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Last Name</Text>
              <View
                style={
                  lockNameEmailPhoneDob ? readonlyWrapStyle : styles.inputWrap
                }
              >
                <User2 size={20} color="#9ca3af" />
                <TextInput
                  value={lastName}
                  onChangeText={setLastName}
                  editable={!lockNameEmailPhoneDob}
                  style={
                    lockNameEmailPhoneDob ? readonlyInputStyle : styles.input
                  }
                  placeholder="Last name"
                  placeholderTextColor="#9ca3af"
                />
              </View>
            </View>
          </View>

          <View style={styles.row2}>
            <View style={styles.field}>
              <Text style={styles.label}>Birthdate</Text>
              <TouchableOpacity
                activeOpacity={0.9}
                style={
                  lockNameEmailPhoneDob ? readonlyWrapStyle : styles.inputWrap
                }
                onPress={openDobModal}
                disabled={lockNameEmailPhoneDob}
              >
                <Calendar size={20} color="#9ca3af" />
                <Text
                  style={[
                    styles.inputText,
                    !birthdate && styles.placeholderText,
                  ]}
                >
                  {birthdate || "Select Birthday"}
                </Text>
              </TouchableOpacity>
              <Text style={styles.helper}>
                Must be between 21–55 yrs (based on your app rules).
              </Text>
            </View>

            <View style={[styles.field, styles.fieldSmall]}>
              <Text style={styles.label}>Age</Text>
              <View style={[styles.inputWrap, styles.readonlyWrap]}>
                <TextInput
                  value={age}
                  editable={false}
                  style={[
                    styles.input,
                    styles.readonlyInput,
                    { textAlign: "center" },
                  ]}
                  placeholder="Age"
                  placeholderTextColor="#9ca3af"
                />
              </View>
            </View>
          </View>

          <View style={styles.row2}>
            <View style={styles.field}>
              <Text style={styles.label}>Contact Number</Text>
              <View
                style={
                  lockNameEmailPhoneDob ? readonlyWrapStyle : styles.inputWrap
                }
              >
                <Phone size={20} color="#9ca3af" />
                <Text style={styles.prefixText}>+63</Text>
                <View style={styles.prefixDivider} />
                <TextInput
                  value={phone}
                  onChangeText={(t) =>
                    setPhone(t.replace(/\D/g, "").slice(0, 10))
                  }
                  editable={!lockNameEmailPhoneDob}
                  style={
                    lockNameEmailPhoneDob ? readonlyInputStyle : styles.input
                  }
                  keyboardType="phone-pad"
                  placeholder="9XXXXXXXXX"
                  placeholderTextColor="#9ca3af"
                  maxLength={10}
                />
              </View>
              <Text style={styles.helper}>
                Enter 10 digits starting with 9 (we add +63 automatically).
              </Text>
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Email Address</Text>
              <View
                style={
                  lockNameEmailPhoneDob ? readonlyWrapStyle : styles.inputWrap
                }
              >
                <Mail size={20} color="#9ca3af" />
                <TextInput
                  value={email}
                  onChangeText={setEmail}
                  editable={!lockNameEmailPhoneDob}
                  style={
                    lockNameEmailPhoneDob ? readonlyInputStyle : styles.input
                  }
                  keyboardType="email-address"
                  autoCapitalize="none"
                  placeholder="email@example.com"
                  placeholderTextColor="#9ca3af"
                />
              </View>
            </View>
          </View>

          {/* ✅ Barangay + Street stay editable (NOT autofilled) */}
          <View style={styles.row2}>
            <View style={styles.field}>
              <Text style={styles.label}>Barangay</Text>
              <TouchableOpacity
                activeOpacity={0.9}
                style={styles.inputWrap}
                onPress={() => setBarangayOpen(true)}
              >
                <MapPin size={20} color="#9ca3af" />
                <Text
                  style={[
                    styles.inputText,
                    !barangay && styles.placeholderText,
                  ]}
                >
                  {barangay || "Select Barangay"}
                </Text>
                <Text style={styles.chevron}>▾</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Street</Text>
              <View style={styles.inputWrap}>
                <TextInput
                  value={street}
                  onChangeText={setStreet}
                  style={styles.input}
                  placeholder="House No. and Street"
                  placeholderTextColor="#9ca3af"
                />
              </View>
            </View>
          </View>
        </View>

        {/* Profile Picture Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Worker Profile Picture</Text>
          <Text style={styles.cardHint}>Upload your picture here.</Text>

          <View style={styles.profileWrap}>
            <View style={styles.profileCircle}>
              {profileUri ? (
                <Image
                  source={{ uri: profileUri }}
                  style={styles.profilePreview}
                />
              ) : (
                <>
                  <Camera size={30} color="#9ca3af" />
                  <Text style={styles.plusText}>+</Text>
                </>
              )}
            </View>

            <TouchableOpacity
              activeOpacity={0.9}
              style={styles.photoBtn}
              onPress={pickProfilePhoto}
            >
              <Text style={styles.photoBtnText}>Choose Photo</Text>
            </TouchableOpacity>

            {!!profileName && (
              <Text style={styles.fileNameText}>{profileName}</Text>
            )}
          </View>
        </View>

        <View style={styles.bottomRow}>
          <TouchableOpacity
            activeOpacity={0.9}
            style={styles.backBtn}
            onPress={handleBack}
            disabled={saving}
          >
            <Text style={styles.backBtnText}>Back</Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.9}
            style={styles.nextBtn}
            onPress={handleNext}
            disabled={saving || loadingProfile}
          >
            {saving || loadingProfile ? (
              <ActivityIndicator />
            ) : (
              <Text style={styles.nextBtnText}>Next: Work Information</Text>
            )}
          </TouchableOpacity>
        </View>

        <View style={{ height: 18 }} />
      </ScrollView>

      {/* Barangay picker */}
      <Modal
        visible={barangayOpen}
        transparent
        animationType="slide"
        onRequestClose={() => setBarangayOpen(false)}
      >
        <TouchableOpacity
          activeOpacity={1}
          style={styles.modalBackdrop}
          onPress={() => setBarangayOpen(false)}
        >
          <View style={styles.modalSheet}>
            <Text style={styles.modalTitle}>Select Barangay</Text>
            <ScrollView style={styles.modalList}>
              {BACOLOD_BARANGAYS.map((b) => (
                <TouchableOpacity
                  key={b}
                  activeOpacity={0.85}
                  style={styles.modalItem}
                  onPress={() => {
                    setBarangay(b);
                    setBarangayOpen(false);
                  }}
                >
                  <Text style={styles.modalItemText}>{b}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* DOB picker modal (only opens if not locked) */}
      <Modal visible={dobModalOpen} transparent animationType="fade">
        <View style={styles.modalBackdropCenter}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Select Birthday</Text>
            <Text style={styles.modalHint}>Pick your date of birth.</Text>

            <View style={{ marginTop: 12 }}>
              <DateTimePicker
                value={tempDobDate}
                mode="date"
                display={Platform.OS === "ios" ? "spinner" : "default"}
                onChange={(event, selectedDate) => {
                  if (Platform.OS === "android") {
                    if (event.type === "dismissed") return;
                    if (selectedDate) setTempDobDate(selectedDate);
                  } else {
                    if (selectedDate) setTempDobDate(selectedDate);
                  }
                }}
                maximumDate={new Date()}
              />
            </View>

            <Text style={styles.dobPreview}>
              Selected:{" "}
              <Text style={{ fontWeight: "900" }}>
                {formatDateToUiDob(tempDobDate)}
              </Text>
              {(() => {
                const a = calcAgeFromUiDob(formatDateToUiDob(tempDobDate));
                return a != null ? (
                  <Text>
                    {"  "}• Age: <Text style={{ fontWeight: "900" }}>{a}</Text>
                  </Text>
                ) : null;
              })()}
            </Text>

            <View style={styles.modalBtnRow}>
              <TouchableOpacity
                activeOpacity={0.85}
                style={[styles.modalBtn, styles.modalBtnGhost]}
                onPress={() => setDobModalOpen(false)}
              >
                <Text style={styles.modalBtnGhostText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={0.85}
                style={[styles.modalBtn, styles.modalBtnPrimary]}
                onPress={confirmDob}
              >
                <Text style={styles.modalBtnPrimaryText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#f5f6fa" },
  header: {
    paddingHorizontal: 18,
    paddingTop: 10,
    paddingBottom: 6,
    alignItems: "center",
    backgroundColor: "#f5f6fa",
  },
  logo: { width: 190, height: 42, resizeMode: "contain" },
  root: { flex: 1 },
  scrollInner: { paddingHorizontal: 18, paddingTop: 8, paddingBottom: 22 },

  progressText: { fontSize: 13, color: "#6b7280", marginBottom: 6 },
  stepTitle: { fontSize: 22, fontWeight: "900", color: "#0f172a" },
  stepSubtitle: {
    marginTop: 4,
    fontSize: 14,
    color: "#6b7280",
    marginBottom: 12,
  },

  card: {
    marginTop: 14,
    borderRadius: 18,
    backgroundColor: "#ffffff",
    padding: 18,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  cardTitle: { fontSize: 15, fontWeight: "900", color: "#0f172a" },
  cardHint: { marginTop: 6, fontSize: 13, color: "#6b7280", marginBottom: 8 },

  row2: { flexDirection: "row", gap: 12, marginBottom: 12 },
  field: { flex: 1 },
  fieldSmall: { maxWidth: 110 },

  label: {
    fontSize: 12.5,
    fontWeight: "800",
    color: "#6b7280",
    marginBottom: 4,
  },

  inputWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#d1d5db",
    backgroundColor: "#ffffff",
    height: 54,
  },
  readonlyWrap: { backgroundColor: "#f9fafb", borderColor: "#e5e7eb" },
  input: { flex: 1, fontSize: 15, color: "#111827" },
  readonlyInput: { color: "#4b5563" },
  helper: { marginTop: 4, fontSize: 11.5, color: "#9ca3af" },

  inputText: { flex: 1, fontSize: 15, color: "#111827" },
  placeholderText: { color: "#9ca3af" },
  chevron: { fontSize: 16, fontWeight: "900", color: "#9ca3af" },

  prefixText: { fontSize: 14, fontWeight: "900", color: "#6b7280" },
  prefixDivider: { width: 1, height: 18, backgroundColor: "#e5e7eb" },

  profileWrap: { marginTop: 10, alignItems: "center" },
  profileCircle: {
    width: 132,
    height: 132,
    borderRadius: 66,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    backgroundColor: "#f9fafb",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
    position: "relative",
    overflow: "hidden",
  },
  profilePreview: { width: "100%", height: "100%" },
  plusText: {
    position: "absolute",
    fontSize: 26,
    fontWeight: "700",
    color: "#d1d5db",
  },

  photoBtn: {
    height: 52,
    borderRadius: 999,
    paddingHorizontal: 40,
    backgroundColor: BLUE,
    alignItems: "center",
    justifyContent: "center",
  },
  photoBtnText: { fontSize: 15, fontWeight: "900", color: "#ffffff" },
  fileNameText: { marginTop: 8, fontSize: 12, color: "#64748b" },

  bottomRow: { marginTop: 20, flexDirection: "row", gap: 12 },
  backBtn: {
    flex: 1,
    height: 52,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#d1d5db",
    backgroundColor: "#ffffff",
    alignItems: "center",
    justifyContent: "center",
  },
  backBtnText: { fontSize: 15, fontWeight: "800", color: "#374151" },
  nextBtn: {
    flex: 1,
    height: 52,
    borderRadius: 999,
    backgroundColor: BLUE,
    alignItems: "center",
    justifyContent: "center",
  },
  nextBtnText: { fontSize: 15, fontWeight: "900", color: "#ffffff" },

  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(15,23,42,0.4)",
    justifyContent: "flex-end",
  },
  modalSheet: {
    maxHeight: "70%",
    backgroundColor: "#ffffff",
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    paddingHorizontal: 18,
    paddingTop: 14,
    paddingBottom: 18,
  },
  modalTitle: {
    fontSize: 15,
    fontWeight: "900",
    color: "#0f172a",
    marginBottom: 10,
  },
  modalList: { marginTop: 4 },
  modalItem: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
  },
  modalItemText: { fontSize: 14, color: "#111827" },

  modalBackdropCenter: {
    flex: 1,
    backgroundColor: "rgba(15,23,42,0.35)",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  modalCard: {
    borderRadius: 14,
    backgroundColor: "#ffffff",
    padding: 16,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  modalHint: { marginTop: 4, fontSize: 12.5, color: "#6b7280" },
  dobPreview: { marginTop: 10, fontSize: 12.5, color: "#334155" },
  modalBtnRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    columnGap: 10,
    marginTop: 16,
  },
  modalBtn: {
    height: 40,
    borderRadius: 999,
    paddingHorizontal: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  modalBtnGhost: {
    borderWidth: 1,
    borderColor: "#e5e7eb",
    backgroundColor: "#ffffff",
  },
  modalBtnGhostText: { fontSize: 13, fontWeight: "700", color: "#4b5563" },
  modalBtnPrimary: { backgroundColor: BLUE },
  modalBtnPrimaryText: { fontSize: 13, fontWeight: "800", color: "#ffffff" },
});
