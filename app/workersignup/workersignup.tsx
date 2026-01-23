import { useRouter } from "expo-router";
import { Eye, EyeOff } from "lucide-react-native";
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
    Alert,
    Dimensions,
    Image,
    KeyboardAvoidingView,
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
import AgreementModal from "../legal/AgreementModal";
import type { LegalKey } from "../legal/legalContent";

// ✅ Supabase auth logic
import {
    resendSignupOtp,
    signUpWorker,
    verifyEmailOtp,
} from "../../supabase/services/authService"; // <-- adjust path if needed

const BLUE = "#1E88E5";
const { width } = Dimensions.get("window");

function RuleLine({ ok, text }: { ok: boolean; text: string }) {
  return (
    <Text style={[styles.ruleText, ok && styles.ruleOk]}>
      {ok ? "✓ " : "• "}
      {text}
    </Text>
  );
}

function maskEmail(email: string) {
  const e = (email || "").trim();
  if (!e.includes("@")) return e || "your email";
  const [user, domain] = e.split("@");
  const safeUser =
    user.length <= 2
      ? user[0] + "*"
      : user.slice(0, 2) + "*".repeat(Math.max(1, user.length - 2));
  return `${safeUser}@${domain}`;
}

export default function WorkerSignupScreen() {
  const router = useRouter();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  // Sex dropdown (no library)
  const [sex, setSex] = useState<"Male" | "Female" | "">("");
  const [sexOpen, setSexOpen] = useState(false);
  const [sexAnchor, setSexAnchor] = useState({ x: 0, y: 0, w: 0, h: 0 });
  const sexBtnRef = useRef<View | null>(null);

  const openSexDropdown = () => {
    sexBtnRef.current?.measureInWindow((x, y, w, h) => {
      setSexAnchor({ x, y, w, h });
      setSexOpen(true);
    });
  };

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // show/hide
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Agreements are ONLY set true via AgreementModal "Agree"
  const [agreePrivacy, setAgreePrivacy] = useState(false);
  const [agreePolicy, setAgreePolicy] = useState(false);
  const [agreeNda, setAgreeNda] = useState(false);

  const [agreeHint, setAgreeHint] = useState("");

  const [legalOpen, setLegalOpen] = useState(false);
  const [legalKey, setLegalKey] = useState<LegalKey>("privacy");

  // OTP UI state
  const [otpOpen, setOtpOpen] = useState(false);
  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
  const [otpError, setOtpError] = useState("");
  const [otpInfo, setOtpInfo] = useState("");
  const [otpSentTo, setOtpSentTo] = useState("");
  const [resendCooldown, setResendCooldown] = useState(0);

  const otpRefs = useRef<(TextInput | null)[]>([]);

  // Loading states
  const [isCreating, setIsCreating] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  const cooldownTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    return () => {
      if (cooldownTimerRef.current) clearInterval(cooldownTimerRef.current);
    };
  }, []);

  const openLegal = (key: LegalKey) => {
    setAgreeHint("");
    setLegalKey(key);
    setLegalOpen(true);
  };

  const onAgree = () => {
    if (legalKey === "privacy") setAgreePrivacy(true);
    if (legalKey === "policy") setAgreePolicy(true);
    if (legalKey === "nda") setAgreeNda(true);
    setLegalOpen(false);
  };

  // password rules
  const hasMin8 = password.length >= 8;
  const hasNumber = /\d/.test(password);
  const hasUpper = /[A-Z]/.test(password);
  const hasSpecial = /[^A-Za-z0-9]/.test(password);
  const passwordsMatch = password.length > 0 && password === confirmPassword;

  const canCreate = useMemo(() => {
    return (
      firstName.trim() &&
      lastName.trim() &&
      sex &&
      email.trim() &&
      hasMin8 &&
      hasNumber &&
      hasUpper &&
      hasSpecial &&
      passwordsMatch &&
      agreePrivacy &&
      agreePolicy &&
      agreeNda
    );
  }, [
    firstName,
    lastName,
    sex,
    email,
    hasMin8,
    hasNumber,
    hasUpper,
    hasSpecial,
    passwordsMatch,
    agreePrivacy,
    agreePolicy,
    agreeNda,
  ]);

  const STACK_NAMES = width < 360;

  // OTP helpers
  const otpValue = otp.join("");
  const otpComplete = otpValue.length === 6 && otp.every((d) => d !== "");

  const startResendCooldown = (seconds: number) => {
    setResendCooldown(seconds);

    if (cooldownTimerRef.current) clearInterval(cooldownTimerRef.current);

    cooldownTimerRef.current = setInterval(() => {
      setResendCooldown((s) => {
        if (s <= 1) {
          if (cooldownTimerRef.current) clearInterval(cooldownTimerRef.current);
          cooldownTimerRef.current = null;
          return 0;
        }
        return s - 1;
      });
    }, 1000);
  };

  const openOtpModal = (targetEmail: string) => {
    setOtpSentTo(targetEmail);
    setOtp(["", "", "", "", "", ""]);
    setOtpError("");
    setOtpInfo("We sent a 6-digit code to your email.");
    setOtpOpen(true);
    startResendCooldown(30);
    setTimeout(() => otpRefs.current[0]?.focus(), 120);
  };

  const closeOtpModal = () => {
    setOtpOpen(false);
    setOtpError("");
    setOtpInfo("");
  };

  const onChangeOtpDigit = (index: number, value: string) => {
    const digit = (value || "").replace(/\D/g, "").slice(-1);
    const next = [...otp];
    next[index] = digit;
    setOtp(next);
    setOtpError("");

    if (digit && index < 5) otpRefs.current[index + 1]?.focus();
  };

  const onKeyPressOtp = (index: number, key: string) => {
    if (key === "Backspace" && otp[index] === "" && index > 0) {
      const next = [...otp];
      next[index - 1] = "";
      setOtp(next);
      otpRefs.current[index - 1]?.focus();
    }
  };

  const onPasteOtp = (text: string) => {
    const digits = (text || "").replace(/\D/g, "").slice(0, 6).split("");
    if (digits.length === 0) return;

    const next = ["", "", "", "", "", ""];
    for (let i = 0; i < 6; i++) next[i] = digits[i] || "";
    setOtp(next);
    setOtpError("");

    const last = Math.min(digits.length, 6) - 1;
    setTimeout(() => otpRefs.current[Math.max(0, last)]?.focus(), 50);
  };

  // ✅ SUPABASE: Create account => sends email OTP (IF template uses {{ .Token }})
  const handleCreate = async () => {
    if (!canCreate || isCreating) return;

    try {
      setIsCreating(true);

      const cleanEmail = email.trim().toLowerCase();

      const data = await signUpWorker(cleanEmail, password, {
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        sex: sex as "Male" | "Female",
        role: "worker",
      });

      // If email confirmations are OFF, session may exist immediately:
      if (data.session) {
        router.replace("/workerpage/workerpage");
        return;
      }

      // Otherwise OTP modal
      openOtpModal(cleanEmail);
    } catch (e: any) {
      Alert.alert("Sign up failed", e?.message ?? "Something went wrong");
    } finally {
      setIsCreating(false);
    }
  };

  // ✅ SUPABASE: Verify OTP
  const handleVerifyOtp = async () => {
    if (!otpComplete || isVerifying) {
      setOtpError("Please enter the 6-digit code.");
      return;
    }

    try {
      setIsVerifying(true);
      setOtpError("");
      setOtpInfo("Verifying code...");

      // IMPORTANT: verifyOtp for signup should use type: 'signup' in your authService
      const data = await verifyEmailOtp(otpSentTo, otpValue);

      if (data.session) {
        setOtpInfo("Verified! Logging you in...");
        setTimeout(() => {
          setOtpOpen(false);
          router.replace("/workerpage/workerpage");
        }, 200);
        return;
      }

      // Fallback
      setOtpInfo("Verified. Please log in.");
      setTimeout(() => {
        setOtpOpen(false);
        router.replace("/login/login");
      }, 400);
    } catch (e: any) {
      setOtpInfo("");
      setOtpError(e?.message ?? "Invalid code.");
    } finally {
      setIsVerifying(false);
    }
  };

  // ✅ SUPABASE: Resend OTP
  const handleResend = async () => {
    if (resendCooldown > 0) return;

    try {
      setOtpInfo("Sending a new code...");
      setOtpError("");

      await resendSignupOtp(otpSentTo);

      setOtpInfo("A new code was sent.");
      startResendCooldown(30);
    } catch (e: any) {
      setOtpInfo("");
      setOtpError(e?.message ?? "Failed to resend code.");
    }
  };

  // Locked checkbox behavior (no manual ticking)
  const tapLocked = (key: LegalKey) => {
    if (key === "privacy" && !agreePrivacy) {
      setAgreeHint("Please read the Privacy Policy first.");
      openLegal("privacy");
      return;
    }
    if (key === "policy" && !agreePolicy) {
      setAgreeHint("Please read the Policy Agreement first.");
      openLegal("policy");
      return;
    }
    if (key === "nda" && !agreeNda) {
      setAgreeHint("Please read the Non-Disclosure Agreement first.");
      openLegal("nda");
      return;
    }
  };

  const onChangeEmailFromOtp = () => {
    // Close OTP modal and let them edit email
    closeOtpModal();
    setOtp(["", "", "", "", "", ""]);
    setOtpSentTo("");
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={styles.root}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <AgreementModal
          visible={legalOpen}
          docKey={legalKey}
          onClose={() => setLegalOpen(false)}
          onAgree={onAgree}
        />

        {/* OTP MODAL */}
        <Modal visible={otpOpen} transparent animationType="fade">
          <TouchableOpacity
            style={styles.otpBackdrop}
            activeOpacity={1}
            onPress={closeOtpModal}
          >
            <TouchableOpacity
              activeOpacity={1}
              onPress={() => {}}
              style={styles.otpCard}
            >
              <View style={styles.otpHeader}>
                <Text style={styles.otpTitle}>Email Verification</Text>
                <TouchableOpacity
                  onPress={closeOtpModal}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                  activeOpacity={0.85}
                >
                  <Text style={styles.otpClose}>✕</Text>
                </TouchableOpacity>
              </View>

              <Text style={styles.otpSub}>
                Enter the 6-digit code sent to{" "}
                <Text style={styles.otpEmail}>{maskEmail(otpSentTo)}</Text>
              </Text>

              <View style={styles.otpRow}>
                {otp.map((digit, i) => (
                  <TextInput
                    key={i}
                    ref={(r) => {
                      otpRefs.current[i] = r;
                    }}
                    value={digit}
                    onChangeText={(v) => {
                      if ((v || "").length > 1) {
                        onPasteOtp(v);
                        return;
                      }
                      onChangeOtpDigit(i, v);
                    }}
                    onKeyPress={({ nativeEvent }) =>
                      onKeyPressOtp(i, nativeEvent.key)
                    }
                    placeholder="•"
                    placeholderTextColor="#cbd5e1"
                    keyboardType="number-pad"
                    maxLength={1}
                    style={styles.otpInput}
                    returnKeyType="done"
                  />
                ))}
              </View>

              {otpError ? (
                <Text style={styles.otpError}>{otpError}</Text>
              ) : null}
              {otpInfo ? <Text style={styles.otpInfo}>{otpInfo}</Text> : null}

              <TouchableOpacity
                activeOpacity={0.9}
                onPress={handleVerifyOtp}
                disabled={!otpComplete || isVerifying}
                style={[
                  styles.otpBtn,
                  otpComplete && !isVerifying
                    ? styles.otpBtnOn
                    : styles.otpBtnOff,
                ]}
              >
                <Text style={styles.otpBtnText}>
                  {isVerifying ? "Verifying..." : "Verify"}
                </Text>
              </TouchableOpacity>

              <View style={styles.otpActions}>
                <TouchableOpacity
                  activeOpacity={0.85}
                  onPress={handleResend}
                  disabled={resendCooldown > 0}
                >
                  <Text
                    style={[
                      styles.otpLink,
                      resendCooldown > 0 && styles.otpLinkDisabled,
                    ]}
                  >
                    {resendCooldown > 0
                      ? `Resend in ${resendCooldown}s`
                      : "Resend code"}
                  </Text>
                </TouchableOpacity>

                <Text style={styles.otpDivider}>•</Text>

                <TouchableOpacity
                  activeOpacity={0.85}
                  onPress={onChangeEmailFromOtp}
                >
                  <Text style={styles.otpLink}>Change email</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          </TouchableOpacity>
        </Modal>

        {/* top row */}
        <View style={styles.topRow}>
          <Image
            source={require("../../image/jdklogo.png")}
            style={styles.logo}
          />

          <View style={styles.topRight}>
            <Text style={styles.topRightText}>Want to hire a worker?</Text>
            <TouchableOpacity
              onPress={() => router.push("/clientsignup/clientsignup")}
              activeOpacity={0.85}
            >
              <Text style={styles.topRightLink}>Apply as Client</Text>
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.pageTitle}>
            Sign up to be a <Text style={styles.blue}>Worker</Text>
          </Text>

          <View style={styles.form}>
            {/* First/Last */}
            <View
              style={[styles.row, STACK_NAMES && { flexDirection: "column" }]}
            >
              <View style={[styles.field, STACK_NAMES && { width: "100%" }]}>
                <Text style={styles.label}>First Name</Text>
                <TextInput
                  value={firstName}
                  onChangeText={setFirstName}
                  placeholder="First name"
                  placeholderTextColor="#94a3b8"
                  style={styles.input}
                />
              </View>

              <View style={[styles.field, STACK_NAMES && { width: "100%" }]}>
                <Text style={styles.label}>Last Name</Text>
                <TextInput
                  value={lastName}
                  onChangeText={setLastName}
                  placeholder="Last name"
                  placeholderTextColor="#94a3b8"
                  style={styles.input}
                />
              </View>
            </View>

            {/* Sex dropdown */}
            <View style={styles.field}>
              <Text style={styles.label}>Sex</Text>

              <View ref={sexBtnRef} collapsable={false}>
                <TouchableOpacity
                  style={styles.select}
                  onPress={openSexDropdown}
                  activeOpacity={0.85}
                >
                  <Text style={[styles.selectText, !sex && styles.placeholder]}>
                    {sex ? sex : "Select sex"}
                  </Text>
                  <Text style={styles.chev}>▾</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Sex dropdown menu */}
            <Modal visible={sexOpen} transparent animationType="fade">
              <TouchableOpacity
                style={styles.ddBackdrop}
                activeOpacity={1}
                onPress={() => setSexOpen(false)}
              >
                <View
                  style={[
                    styles.ddMenu,
                    {
                      left: sexAnchor.x,
                      top: sexAnchor.y + sexAnchor.h + 6,
                      width: sexAnchor.w,
                    },
                  ]}
                >
                  {(["Male", "Female"] as const).map((opt) => (
                    <TouchableOpacity
                      key={opt}
                      style={styles.ddItem}
                      activeOpacity={0.85}
                      onPress={() => {
                        setSex(opt);
                        setSexOpen(false);
                      }}
                    >
                      <Text style={styles.ddItemText}>{opt}</Text>
                      {sex === opt ? (
                        <Text style={styles.ddCheck}>✓</Text>
                      ) : null}
                    </TouchableOpacity>
                  ))}
                </View>
              </TouchableOpacity>
            </Modal>

            {/* Email */}
            <View style={styles.field}>
              <Text style={styles.label}>Email Address</Text>
              <TextInput
                value={email}
                onChangeText={setEmail}
                placeholder="@gmail.com"
                placeholderTextColor="#94a3b8"
                keyboardType="email-address"
                autoCapitalize="none"
                style={styles.input}
              />
            </View>

            {/* Password */}
            <View style={styles.field}>
              <Text style={styles.label}>Password (8 or more characters)</Text>

              <View style={styles.passWrap}>
                <TextInput
                  value={password}
                  onChangeText={setPassword}
                  placeholder="Password"
                  placeholderTextColor="#94a3b8"
                  secureTextEntry={!showPassword}
                  style={[styles.input, styles.passInput, styles.passText]}
                />

                <TouchableOpacity
                  onPress={() => setShowPassword((s) => !s)}
                  activeOpacity={0.8}
                  style={styles.eyeIconBtn}
                >
                  {showPassword ? (
                    <EyeOff size={18} color="#334155" />
                  ) : (
                    <Eye size={18} color="#334155" />
                  )}
                </TouchableOpacity>
              </View>

              <View style={styles.rulesRow}>
                <View style={{ flex: 1 }}>
                  <RuleLine ok={hasMin8} text="At least 8 characters" />
                  <RuleLine ok={hasNumber} text="One number" />
                </View>
                <View style={{ flex: 1 }}>
                  <RuleLine ok={hasUpper} text="One uppercase letter" />
                  <RuleLine ok={hasSpecial} text="One special character" />
                </View>
              </View>
            </View>

            {/* Confirm */}
            <View style={styles.field}>
              <Text style={styles.label}>Confirm Password</Text>

              <View style={styles.passWrap}>
                <TextInput
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  placeholder="Confirm password"
                  placeholderTextColor="#94a3b8"
                  secureTextEntry={!showConfirmPassword}
                  style={[styles.input, styles.passInput, styles.passText]}
                />

                <TouchableOpacity
                  onPress={() => setShowConfirmPassword((s) => !s)}
                  activeOpacity={0.8}
                  style={styles.eyeIconBtn}
                >
                  {showConfirmPassword ? (
                    <EyeOff size={18} color="#334155" />
                  ) : (
                    <Eye size={18} color="#334155" />
                  )}
                </TouchableOpacity>
              </View>

              {confirmPassword.length > 0 && !passwordsMatch ? (
                <Text style={styles.error}>Passwords do not match.</Text>
              ) : null}
            </View>

            {/* Agreements */}
            <View style={styles.agreeBlock}>
              {/* Privacy */}
              <View style={styles.agreeRow}>
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => tapLocked("privacy")}
                  style={[
                    styles.box,
                    agreePrivacy && styles.boxOn,
                    !agreePrivacy && styles.boxLocked,
                  ]}
                >
                  {agreePrivacy ? <Text style={styles.boxTick}>✓</Text> : null}
                </TouchableOpacity>

                <Text style={styles.agreeText}>
                  I have read and agree to JDK HOMECARE’s{" "}
                  <Text
                    style={styles.link}
                    onPress={() => openLegal("privacy")}
                  >
                    Privacy Policy
                  </Text>
                  .
                </Text>
              </View>

              {/* Policy + NDA */}
              <View style={[styles.agreeRow, { marginTop: 12 }]}>
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => {
                    if (!agreePolicy) return tapLocked("policy");
                    if (!agreeNda) return tapLocked("nda");
                  }}
                  style={[
                    styles.box,
                    agreePolicy && agreeNda && styles.boxOn,
                    !(agreePolicy && agreeNda) && styles.boxLocked,
                  ]}
                >
                  {agreePolicy && agreeNda ? (
                    <Text style={styles.boxTick}>✓</Text>
                  ) : null}
                </TouchableOpacity>

                <Text style={styles.agreeText}>
                  I have read and agree to the{" "}
                  <Text style={styles.link} onPress={() => openLegal("policy")}>
                    Policy Agreement
                  </Text>{" "}
                  and{" "}
                  <Text style={styles.link} onPress={() => openLegal("nda")}>
                    Non-Disclosure Agreement
                  </Text>
                  .
                </Text>
              </View>

              {agreeHint ? (
                <Text style={styles.lockHint}>{agreeHint}</Text>
              ) : null}

              {!agreePrivacy || !agreePolicy || !agreeNda ? (
                <Text style={styles.hint}>
                  Please open each document and tap “I Agree” to enable the
                  checkbox.
                </Text>
              ) : null}
            </View>

            {/* Create */}
            <TouchableOpacity
              activeOpacity={0.9}
              disabled={!canCreate || isCreating}
              onPress={handleCreate}
              style={[
                styles.btn,
                canCreate && !isCreating ? styles.btnOn : styles.btnOff,
              ]}
            >
              <Text style={styles.btnText}>
                {isCreating ? "Creating..." : "Create my account"}
              </Text>
            </TouchableOpacity>

            {/* Bottom */}
            <View style={styles.bottomRow}>
              <Text style={styles.bottomText}>Already have an account?</Text>
              <TouchableOpacity onPress={() => router.push("/login/login")}>
                <Text style={styles.bottomLink}>Log In</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#fff" },
  root: { flex: 1, backgroundColor: "#fff" },

  topRow: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 6,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 10,
  },
  logo: { width: 150, height: 28, resizeMode: "contain" },
  topRight: { alignItems: "flex-end" },
  topRightText: { fontSize: 12, color: "#111827" },
  topRightLink: { fontSize: 12, color: BLUE, fontWeight: "800", marginTop: 2 },

  scroll: { paddingHorizontal: 16, paddingBottom: 26 },
  pageTitle: {
    marginTop: 10,
    fontSize: 22,
    fontWeight: "900",
    color: "#111827",
    textAlign: "center",
    marginBottom: 14,
  },
  blue: { color: BLUE },

  form: { width: "100%", maxWidth: 520, alignSelf: "center" },

  row: { flexDirection: "row", gap: 12 },
  field: { marginBottom: 12, flex: 1 },

  label: {
    fontSize: 12,
    fontWeight: "800",
    color: "#111827",
    marginBottom: 6,
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 10,
    paddingHorizontal: 12,
    fontSize: 14,
    color: "#111827",
    backgroundColor: "#fff",
  },

  // password
  passText: { color: "#111827" },
  passWrap: { position: "relative", justifyContent: "center" },
  passInput: { paddingRight: 44 },

  eyeIconBtn: {
    position: "absolute",
    right: 10,
    height: 34,
    width: 34,
    alignItems: "center",
    justifyContent: "center",
  },

  select: {
    height: 48,
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 10,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  selectText: { fontSize: 14, fontWeight: "700", color: "#111827" },
  placeholder: { color: "#94a3b8" },
  chev: { fontSize: 16, fontWeight: "900", color: "#64748b" },

  ddBackdrop: { flex: 1, backgroundColor: "transparent" },
  ddMenu: {
    position: "absolute",
    backgroundColor: "#fff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#eef2f7",
    paddingVertical: 6,
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },
  ddItem: {
    height: 44,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  ddItemText: { fontSize: 13.5, fontWeight: "800", color: "#0f172a" },
  ddCheck: { fontSize: 16, fontWeight: "900", color: BLUE },

  rulesRow: { marginTop: 10, flexDirection: "row", gap: 12 },
  ruleText: { fontSize: 11.5, color: "#6b7280", marginBottom: 6 },
  ruleOk: { color: BLUE, fontWeight: "800" },

  error: { marginTop: 6, fontSize: 12, color: "#b91c1c", fontWeight: "800" },

  agreeBlock: { marginTop: 4, marginBottom: 10 },
  agreeRow: { flexDirection: "row", gap: 10, alignItems: "flex-start" },
  agreeText: { flex: 1, fontSize: 12.5, color: "#111827", lineHeight: 18 },
  link: { color: BLUE, fontWeight: "800" },
  hint: { marginTop: 8, marginLeft: 26, fontSize: 11, color: "#6b7280" },
  lockHint: {
    marginTop: 6,
    marginLeft: 26,
    fontSize: 11.5,
    color: "#334155",
    fontWeight: "800",
  },
  box: {
    width: 18,
    height: 18,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#d1d5db",
    marginTop: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  boxOn: { borderColor: BLUE },
  boxLocked: { borderColor: "#cbd5e1", backgroundColor: "#f8fafc" },
  boxTick: { fontSize: 12, fontWeight: "900", color: BLUE, marginTop: -1 },

  btn: {
    height: 48,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 6,
  },
  btnOff: { backgroundColor: "#d1d5db" },
  btnOn: { backgroundColor: "#cfd6df" },
  btnText: { fontSize: 14, fontWeight: "800", color: "#111827" },

  bottomRow: {
    marginTop: 14,
    flexDirection: "row",
    justifyContent: "center",
    gap: 6,
    flexWrap: "wrap",
  },
  bottomText: { fontSize: 13, color: "#111827" },
  bottomLink: { fontSize: 13, color: BLUE, fontWeight: "800" },

  otpBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "center",
    padding: 18,
  },
  otpCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#eef2f7",
  },
  otpHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  otpTitle: { fontSize: 16, fontWeight: "900", color: "#0f172a" },
  otpClose: { fontSize: 18, fontWeight: "900", color: "#334155" },
  otpSub: { marginTop: 2, fontSize: 12.5, color: "#334155", lineHeight: 18 },
  otpEmail: { color: "#111827", fontWeight: "900" },

  otpRow: {
    marginTop: 14,
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 8,
  },
  otpInput: {
    flex: 1,
    height: 52,
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 12,
    textAlign: "center",
    fontSize: 18,
    fontWeight: "900",
    color: "#111827",
    backgroundColor: "#fff",
  },
  otpError: {
    marginTop: 10,
    fontSize: 12,
    color: "#b91c1c",
    fontWeight: "900",
  },
  otpInfo: {
    marginTop: 10,
    fontSize: 12,
    color: "#334155",
    fontWeight: "700",
  },

  otpBtn: {
    height: 48,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 12,
  },
  otpBtnOff: { backgroundColor: "#d1d5db" },
  otpBtnOn: { backgroundColor: "#cfd6df" },
  otpBtnText: { fontSize: 14, fontWeight: "900", color: "#111827" },

  otpActions: {
    marginTop: 12,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
  },
  otpLink: { fontSize: 12.5, color: BLUE, fontWeight: "900" },
  otpLinkDisabled: { color: "#94a3b8" },
  otpDivider: { fontSize: 12, color: "#94a3b8", fontWeight: "900" },
});
