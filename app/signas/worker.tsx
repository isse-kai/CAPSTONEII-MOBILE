import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { memo, useEffect, useState } from "react";
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";

/** -------------------- Types -------------------- */
interface FormData {
  // Step 1 - Personal Info
  name: string;
  gender: string;
  email: string;
  birthdate: string;
  contact: string;
  address: string;
  profilePic: string;

  // Step 2 - Job Info
  jobType: string;
  category: string;
  experience: string;
  skills: string;

  // Step 3 - Upload IDs
  primaryFront: string;
  primaryBack: string;
  secondaryFront: string;
  nbi: string;
  proofAddress: string;
  medical: string;
  certificate: string;

  // Step 4 - Gov Numbers
  tin: string;
  sss: string;
  philhealth: string;
  pagibig: string;

  // Step 5 - Agreements
  termsAgreed: boolean;
  privacyAgreed: boolean;
  dataProcessingAgreed: boolean;
}

/** -------------------- Constants -------------------- */
const TOTAL_STEPS = 5;
const GENDER_OPTIONS = ["Male", "Female", "Other"];
const JOB_TYPES = ["Plumber", "Carpenter", "Electrician", "Mechanic", "Laundry", "House Cleaner"];
const CATEGORIES = ["Home Repair", "Construction", "Electrical", "Auto", "Cleaning", "Others"];

// Use your exact path here if this file isn't next to /assets
const LOGO = require("assets/jdklogo.png");

/** -------------------- Helpers -------------------- */
const emailOk = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
const normalizePhone = (raw: string) => raw.replace(/[^\d+]/g, "");
const phoneOk = (phone: string) => /^09\d{9}$/.test(normalizePhone(phone)) || /^\+639\d{9}$/.test(normalizePhone(phone));
const formatPhonePH = (phone: string) => {
  const p = phone.replace(/[^\d]/g, "");
  if (p.startsWith("09") && p.length === 11) return p;
  if (p.startsWith("9") && p.length === 10) return "0" + p;
  if (p.startsWith("639") && p.length === 12) return "+63" + p.slice(2);
  if (p.startsWith("63") && p.length === 12) return "+63" + p.slice(2);
  return phone;
};
const birthdateOk = (s: string) => {
  const m = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(s);
  if (!m) return false;
  const mm = Number(m[1]), dd = Number(m[2]), yy = Number(m[3]);
  const d = new Date(yy, mm - 1, dd);
  if (d.getFullYear() !== yy || d.getMonth() !== mm - 1 || d.getDate() !== dd) return false;
  const today = new Date();
  const age = today.getFullYear() - d.getFullYear() - (today < new Date(today.getFullYear(), d.getMonth(), d.getDate()) ? 1 : 0);
  return age >= 18;
};
const trimNum = (s: string, max = 20) => s.replace(/[^\d\-]/g, "").slice(0, max);

/** -------------------- Reusable UI (memoized) -------------------- */
type FieldProps = {
  label: string;
  value: string;
  onChangeText: (t: string) => void;
  placeholder?: string;
  keyboardType?: "default" | "email-address" | "phone-pad" | "numeric";
  multiline?: boolean;
  error?: string;
};
const Field = memo(function Field({
  label, value, onChangeText, placeholder, keyboardType = "default", multiline = false, error,
}: FieldProps) {
  return (
    <View style={styles.inputContainer}>
      <Text style={styles.label}>{label}</Text>
      <View style={[styles.inputWrapper, error && styles.inputWrapperError]}>
        <TextInput
          value={value}
          onChangeText={onChangeText}
          style={[styles.input, multiline && styles.textArea]}
          placeholder={placeholder}
          keyboardType={keyboardType}
          multiline={multiline}
          numberOfLines={multiline ? 3 : 1}
          placeholderTextColor="#94a3b8"
          blurOnSubmit={false}
          returnKeyType="next"
        />
      </View>
      {!!error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
});

type ChipRowProps = {
  label: string;
  options: string[];
  selected: string;
  onSelect: (s: string) => void;
  error?: string;
};
const ChipRow = memo(function ChipRow({ label, options, selected, onSelect, error }: ChipRowProps) {
  return (
    <View style={styles.inputContainer}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.chipsWrap}>
        {options.map((opt) => {
          const active = selected === opt;
          return (
            <Pressable
              key={opt}
              onPress={() => onSelect(opt)}
              style={[styles.chip, active && styles.chipActive]}
              accessibilityRole="button"
              accessibilityState={{ selected: active }}
            >
              <Text style={[styles.chipText, active && styles.chipTextActive]}>{opt}</Text>
            </Pressable>
          );
        })}
      </View>
      {!!error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
});

type UploadTileProps = { label: string; field: keyof FormData; required?: boolean; uri?: string; error?: string; onPick: (f: keyof FormData) => void; };
const UploadTile = memo(function UploadTile({ label, field, required = true, uri, error, onPick }: UploadTileProps) {
  const hasImage = !!uri;
  return (
    <View style={styles.uploadTile}>
      <Text style={styles.smallLabel}>
        {label} {required && <Text style={styles.required}>*</Text>}
      </Text>
      <Pressable onPress={() => onPick(field)} style={[styles.uploadBox, error && styles.uploadBoxError]} accessibilityRole="button">
        {hasImage ? <Image source={{ uri }} style={styles.previewImage} /> : <Text style={styles.uploadHint}>Tap to select image</Text>}
      </Pressable>
      {!!error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
});

const StepHeader = memo(function StepHeader({ title, step }: { title: string; step: number }) {
  return (
    <View style={styles.stepHeader}>
      <Text style={styles.stepTitle}>{title}</Text>
      <View style={styles.progressBarBackground}>
        <View style={[styles.progressBarFill, { width: `${(step / TOTAL_STEPS) * 100}%` }]} />
      </View>
    </View>
  );
});

/** -------------------- Main Component -------------------- */
export default function MultiStepForm() {
  const router = useRouter();

  const [step, setStep] = useState<number>(1);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mediaPermGranted, setMediaPermGranted] = useState<boolean | null>(null);

  const [formData, setFormData] = useState<FormData>({
    name: "", gender: "", email: "", birthdate: "", contact: "", address: "", profilePic: "",
    jobType: "", category: "", experience: "", skills: "",
    primaryFront: "", primaryBack: "", secondaryFront: "", nbi: "", proofAddress: "", medical: "", certificate: "",
    tin: "", sss: "", philhealth: "", pagibig: "",
    termsAgreed: false, privacyAgreed: false, dataProcessingAgreed: false,
  });

  /** Permissions for Image Picker */
  useEffect(() => {
    (async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      setMediaPermGranted(status === "granted");
    })();
  }, []);

  /** State updater */
  const setField = (field: keyof FormData, value: string | boolean) => {
    setFormData((p) => ({ ...p, [field]: value as any }));
    if (errors[field]) setErrors((e) => ({ ...e, [field]: "" }));
  };

  /** Validation */
  const validateStep = (s: number) => {
    const e: Record<string, string> = {};
    if (s === 1) {
      if (!formData.name.trim()) e.name = "Full name is required";
      if (!formData.gender.trim()) e.gender = "Please select a gender";
      if (!formData.email.trim()) e.email = "Email is required";
      else if (!emailOk(formData.email)) e.email = "Enter a valid email";
      if (!formData.birthdate.trim()) e.birthdate = "Birthdate is required";
      else if (!birthdateOk(formData.birthdate)) e.birthdate = "Use MM/DD/YYYY • Must be 18+";
      if (!formData.contact.trim()) e.contact = "Contact number is required";
      else if (!phoneOk(formatPhonePH(formData.contact))) e.contact = "Use 09XXXXXXXXX or +639XXXXXXXXX";
      if (!formData.address.trim()) e.address = "Address is required";
    } else if (s === 2) {
      if (!formData.jobType.trim()) e.jobType = "Select a job type";
      if (!formData.category.trim()) e.category = "Select a service category";
      if (!formData.experience.trim()) e.experience = "Enter years of experience";
      else if (isNaN(Number(formData.experience))) e.experience = "Use a number (e.g., 5)";
    } else if (s === 3) {
      if (!formData.primaryFront) e.primaryFront = "Primary ID (front) is required";
      if (!formData.primaryBack) e.primaryBack = "Primary ID (back) is required";
      if (!formData.nbi) e.nbi = "NBI/Police clearance is required";
      if (!formData.proofAddress) e.proofAddress = "Proof of address is required";
      if (!formData.medical) e.medical = "Medical certificate is required";
    } else if (s === 4) {
      if (!formData.tin.trim()) e.tin = "TIN is required";
      if (!formData.sss.trim()) e.sss = "SSS is required";
      if (!formData.philhealth.trim()) e.philhealth = "PhilHealth is required";
      if (!formData.pagibig.trim()) e.pagibig = "PAG-IBIG is required";
    } else if (s === 5) {
      if (!formData.termsAgreed) e.termsAgreed = "You must agree to the Terms & Conditions";
      if (!formData.privacyAgreed) e.privacyAgreed = "You must agree to the Privacy Policy";
      if (!formData.dataProcessingAgreed) e.dataProcessingAgreed = "You must consent to data processing";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  /** Image picking */
  const ensureMediaPerms = async () => {
    if (mediaPermGranted === true) return true;
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission needed", "Please allow photo library access to upload your documents.");
      return false;
    }
    setMediaPermGranted(true);
    return true;
  };
  const pickImage = async (field: keyof FormData) => {
    try {
      const ok = await ensureMediaPerms();
      if (!ok) return;
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 0.7,
        aspect: [4, 3],
      });
      if (!result.canceled) setField(field, result.assets[0].uri);
    } catch {
      Alert.alert("Upload failed", "Could not open your photo library. Please try again.");
    }
  };

  /** Navigation */
  const goNext = () => { if (validateStep(step)) setStep((s) => Math.min(TOTAL_STEPS, s + 1)); };
  const goBack = () => { setErrors({}); setStep((s) => Math.max(1, s - 1)); };

  /** Submit */
  const handleSubmit = () => {
    if (!validateStep(5)) return;
    setIsSubmitting(true);
    Alert.alert("Success 🎉", "Your application has been submitted.");
    setIsSubmitting(false);
  };

  /** Render */
  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      {/* Sticky top-right Back */}
      <View style={styles.topBarRight}>
        <Pressable onPress={() => router.push("/signup/signup")} style={styles.topBackBtn}>
          <Text style={styles.topBackText}>Back</Text>
        </Pressable>
      </View>

      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode={Platform.OS === "ios" ? "interactive" : "on-drag"}
      >
        {/* Simple Logo Header (just the logo) */}
        <View style={styles.logoWrap}>
          <Image source={LOGO} style={styles.logo} resizeMode="contain" />
        </View>

        {/* Step 1 */}
        {step === 1 && (
          <View style={styles.card}>
            <StepHeader title="Personal Information" step={step} />
            <Field label="Full Name" value={formData.name} onChangeText={(t) => setField("name", t)} placeholder="e.g., Juan Dela Cruz" error={errors.name} />
            <ChipRow label="Gender" options={GENDER_OPTIONS} selected={formData.gender} onSelect={(s) => setField("gender", s)} error={errors.gender} />
            <Field label="Email" value={formData.email} onChangeText={(t) => setField("email", t.trim())} placeholder="you@email.com" keyboardType="email-address" error={errors.email} />
            <Field label="Birthdate (MM/DD/YYYY)" value={formData.birthdate} onChangeText={(t) => setField("birthdate", t)} placeholder="MM/DD/YYYY" error={errors.birthdate} />
            <Field label="Contact Number" value={formData.contact} onChangeText={(t) => setField("contact", formatPhonePH(t))} placeholder="09XXXXXXXXX or +639XXXXXXXXX" keyboardType="phone-pad" error={errors.contact} />
            <Field label="Home Address" value={formData.address} onChangeText={(t) => setField("address", t)} placeholder="House #, Street, Barangay, City/Province" multiline error={errors.address} />

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Profile Picture (optional)</Text>
              <Pressable onPress={() => pickImage("profilePic")} style={[styles.uploadBox, errors.profilePic && styles.uploadBoxError]}>
                {formData.profilePic ? <Image source={{ uri: formData.profilePic }} style={styles.avatarPreview} /> : <Text style={styles.uploadHint}>Tap to select image</Text>}
              </Pressable>
            </View>
          </View>
        )}

        {/* Step 2 */}
        {step === 2 && (
          <View style={styles.card}>
            <StepHeader title="Job Information" step={step} />
            <ChipRow label="Job Type" options={JOB_TYPES} selected={formData.jobType} onSelect={(s) => setField("jobType", s)} error={errors.jobType} />
            <ChipRow label="Service Category" options={CATEGORIES} selected={formData.category} onSelect={(s) => setField("category", s)} error={errors.category} />
            <Field label="Years of Experience" value={formData.experience} onChangeText={(t) => setField("experience", t.replace(/[^\d]/g, ""))} placeholder="e.g., 5" keyboardType="numeric" error={errors.experience} />
            <Field label="Skills & Certifications (optional)" value={formData.skills} onChangeText={(t) => setField("skills", t)} placeholder="List key skills, tools, certificates" multiline />
          </View>
        )}

        {/* Step 3 */}
        {step === 3 && (
          <View style={styles.card}>
            <StepHeader title="Document Uploads" step={step} />
            <View style={styles.grid2}>
              <UploadTile label="Primary ID (Front)" field="primaryFront" required uri={formData.primaryFront} error={errors.primaryFront} onPick={pickImage} />
              <UploadTile label="Primary ID (Back)" field="primaryBack" required uri={formData.primaryBack} error={errors.primaryBack} onPick={pickImage} />
              <UploadTile label="Secondary ID (Front)" field="secondaryFront" uri={formData.secondaryFront} error={errors.secondaryFront} onPick={pickImage} />
              <UploadTile label="NBI/Police Clearance" field="nbi" required uri={formData.nbi} error={errors.nbi} onPick={pickImage} />
              <UploadTile label="Proof of Address" field="proofAddress" required uri={formData.proofAddress} error={errors.proofAddress} onPick={pickImage} />
              <UploadTile label="Medical Certificate" field="medical" required uri={formData.medical} error={errors.medical} onPick={pickImage} />
              <UploadTile label="Professional Certificate" field="certificate" uri={formData.certificate} error={errors.certificate} onPick={pickImage} />
            </View>
          </View>
        )}

        {/* Step 4 */}
        {step === 4 && (
          <View style={styles.card}>
            <StepHeader title="Government Numbers" step={step} />
            <Field label="TIN" value={formData.tin} onChangeText={(t) => setField("tin", trimNum(t))} placeholder="e.g., 123-456-789-000" keyboardType="numeric" error={errors.tin} />
            <Field label="SSS" value={formData.sss} onChangeText={(t) => setField("sss", trimNum(t))} placeholder="e.g., 34-1234567-8" keyboardType="numeric" error={errors.sss} />
            <Field label="PhilHealth" value={formData.philhealth} onChangeText={(t) => setField("philhealth", trimNum(t))} placeholder="e.g., 12-345678901-2" keyboardType="numeric" error={errors.philhealth} />
            <Field label="PAG-IBIG" value={formData.pagibig} onChangeText={(t) => setField("pagibig", trimNum(t))} placeholder="e.g., 1234-5678-9012" keyboardType="numeric" error={errors.pagibig} />
          </View>
        )}

        {/* Step 5 */}
        {step === 5 && (
          <View style={styles.card}>
            <StepHeader title="Agreements" step={step} />
            <View style={styles.checkRow}>
              <Pressable onPress={() => setField("termsAgreed", !formData.termsAgreed)} style={[styles.checkbox, formData.termsAgreed && styles.checkboxOn]} accessibilityRole="checkbox" accessibilityState={{ checked: formData.termsAgreed }}>
                {formData.termsAgreed && <Text style={styles.checkmark}>✓</Text>}
              </Pressable>
              <Text style={styles.checkText}>I agree to the Terms & Conditions</Text>
            </View>
            {!!errors.termsAgreed && <Text style={styles.errorText}>{errors.termsAgreed}</Text>}

            <View style={styles.checkRow}>
              <Pressable onPress={() => setField("privacyAgreed", !formData.privacyAgreed)} style={[styles.checkbox, formData.privacyAgreed && styles.checkboxOn]} accessibilityRole="checkbox" accessibilityState={{ checked: formData.privacyAgreed }}>
                {formData.privacyAgreed && <Text style={styles.checkmark}>✓</Text>}
              </Pressable>
              <Text style={styles.checkText}>I agree to the Privacy Policy</Text>
            </View>
            {!!errors.privacyAgreed && <Text style={styles.errorText}>{errors.privacyAgreed}</Text>}

            <View style={styles.checkRow}>
              <Pressable onPress={() => setField("dataProcessingAgreed", !formData.dataProcessingAgreed)} style={[styles.checkbox, formData.dataProcessingAgreed && styles.checkboxOn]} accessibilityRole="checkbox" accessibilityState={{ checked: formData.dataProcessingAgreed }}>
                {formData.dataProcessingAgreed && <Text style={styles.checkmark}>✓</Text>}
              </Pressable>
              <Text style={styles.checkText}>I consent to data processing for verification purposes</Text>
            </View>
            {!!errors.dataProcessingAgreed && <Text style={styles.errorText}>{errors.dataProcessingAgreed}</Text>}
          </View>
        )}

        <View style={{ height: 110 }} />
      </ScrollView>

      {/* Sticky Footer Nav */}
      <View style={styles.footer}>
        {step > 1 ? (
          <Pressable onPress={goBack} style={[styles.btn, styles.btnGhost]}>
            <Text style={[styles.btnText, styles.btnGhostText]}>Back</Text>
          </Pressable>
        ) : (
          <View style={{ width: 96 }} />
        )}

        <View style={styles.dotsWrap}>
          {Array.from({ length: TOTAL_STEPS }).map((_, i) => {
            const idx = i + 1;
            const active = idx === step;
            return <View key={idx} style={[styles.dot, active && styles.dotActive]} />;
          })}
        </View>

        {step < TOTAL_STEPS ? (
          <Pressable onPress={goNext} style={[styles.btn, styles.btnPrimary]}>
            <Text style={styles.btnText}>Next</Text>
          </Pressable>
        ) : (
          <Pressable onPress={handleSubmit} disabled={isSubmitting} style={[styles.btn, styles.btnSuccess, isSubmitting && styles.btnDisabled]}>
            <Text style={styles.btnText}>{isSubmitting ? "Submitting..." : "Submit"}</Text>
          </Pressable>
        )}
      </View>
    </KeyboardAvoidingView>
  );
}

/** -------------------- Styles -------------------- */
const styles = {
  container: { flex: 1, backgroundColor: "#f6f7fb" },

  // Sticky top-right back button
  topBarRight: {
    position: "absolute" as const,
    top: Platform.OS === "ios" ? 48 : 18,
    right: 16,
    zIndex: 30,
  },
  topBackBtn: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: "#f1f5f9",
    borderRadius: 10,
  },
  topBackText: {
    fontSize: 16,
    fontWeight: "700" as const,
    color: "#0f172a",
  },

  scroll: { padding: 16, paddingBottom: 24 },

  // Simple logo header
  logoWrap: {
    alignItems: "center" as const,
    marginBottom: 12,
  },
  logo: {
    width: 110,
    height: 110,
    borderRadius: 16,
  },

  // Card + progress
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#e8eef6",
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  stepHeader: { marginBottom: 12 },
  stepTitle: {
    fontSize: 18,
    fontWeight: "800" as const,
    color: "#0f172a",
    textAlign: "center" as const,
    marginBottom: 8,
  },
  progressBarBackground: { height: 6, backgroundColor: "#e5e7eb", borderRadius: 999, overflow: "hidden" as const },
  progressBarFill: { height: 6, backgroundColor: "#0685f4", borderRadius: 999 },

  // Inputs
  inputContainer: { marginBottom: 14 },
  label: { fontSize: 14, fontWeight: "700" as const, color: "#0f172a", marginBottom: 6 },
  smallLabel: { fontSize: 12, fontWeight: "700" as const, color: "#0f172a", marginBottom: 6 },
  required: { color: "#ef4444" },
  inputWrapper: {
    borderWidth: 1,
    borderColor: "#dbe2ea",
    borderRadius: 12,
    backgroundColor: "#fff",
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  inputWrapperError: { borderColor: "#ef4444" },
  input: { fontSize: 16, color: "#0f172a", padding: 0 },
  textArea: { minHeight: 88, textAlignVertical: "top" as const },
  errorText: { color: "#ef4444", fontSize: 12, marginTop: 6 },

  // Chips
  chipsWrap: { flexDirection: "row" as const, flexWrap: "wrap" as const, gap: 8 },
  chip: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#cbd5e1",
    backgroundColor: "#fff",
  },
  chipActive: { backgroundColor: "#e7f2ff", borderColor: "#0685f4" },
  chipText: { color: "#334155" },
  chipTextActive: { color: "#0369a1", fontWeight: "800" as const },

  // Uploads
  grid2: { flexDirection: "row" as const, flexWrap: "wrap" as const, justifyContent: "space-between" as const, gap: 12 },
  uploadTile: { width: "48%" },
  uploadBox: {
    height: 130,
    borderWidth: 2,
    borderColor: "#dbe2ea",
    borderStyle: "dashed" as const,
    borderRadius: 12,
    backgroundColor: "#f8fafc",
    alignItems: "center" as const,
    justifyContent: "center" as const,
  },
  uploadBoxError: { borderColor: "#ef4444" },
  uploadHint: { color: "#64748b", fontSize: 12 },
  previewImage: { width: "100%", height: "100%", borderRadius: 10, resizeMode: "cover" as const },
  avatarPreview: { width: 120, height: 120, borderRadius: 60, alignSelf: "center" as const },

  // Checks
  checkRow: { flexDirection: "row" as const, alignItems: "center" as const, paddingVertical: 10 },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: "#cbd5e1",
    alignItems: "center" as const,
    justifyContent: "center" as const,
    marginRight: 10,
  },
  checkboxOn: { backgroundColor: "#0685f4", borderColor: "#0685f4" },
  checkmark: { color: "#fff", fontSize: 12, fontWeight: "900" as const },
  checkText: { color: "#0f172a", flex: 1 },

  // Footer
  footer: {
    position: "absolute" as const,
    left: 0,
    right: 0,
    bottom: 0,
    padding: 12,
    backgroundColor: "#ffffff",
    borderTopWidth: 1,
    borderTopColor: "#e8eef6",
    flexDirection: "row" as const,
    alignItems: "center" as const,
    justifyContent: "space-between" as const,
    gap: 10,
  },
  btn: {
    minWidth: 96,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignItems: "center" as const,
    justifyContent: "center" as const,
  },
  btnText: { color: "#fff", fontWeight: "800" as const, fontSize: 16 },
  btnPrimary: { backgroundColor: "#0685f4" },
  btnSuccess: { backgroundColor: "#16a34a" },
  btnGhost: { backgroundColor: "#f1f5f9" },
  btnGhostText: { color: "#0f172a", fontWeight: "800" as const, fontSize: 16 },
  btnDisabled: { opacity: 0.6 },

  dotsWrap: { flexDirection: "row" as const, gap: 6, alignItems: "center" as const },
  dot: { width: 8, height: 8, borderRadius: 8, backgroundColor: "#e5e7eb" },
  dotActive: { backgroundColor: "#0685f4" },
} as const;
