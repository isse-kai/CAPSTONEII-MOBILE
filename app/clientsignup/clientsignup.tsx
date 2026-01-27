import { useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import AgreementModal from "../legal/AgreementModal";
import type { LegalKey } from "../legal/legalContent";

const BLUE = "#1E88E5";
const clamp = (v: number, min: number, max: number) =>
  Math.max(min, Math.min(max, v));

function RuleLine({ ok, text }: { ok: boolean; text: string }) {
  return (
    <Text style={[styles.ruleText, ok && styles.ruleOk]}>
      {ok ? "✓ " : "• "}
      {text}
    </Text>
  );
}

export default function ClientSignupScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { width, height } = useWindowDimensions();

  const s = width / 375;
  const isShort = height < 720;
  const STACK_NAMES = width < 360;

  // ✅ same logo sizing as your Login/Role screens
  const LOGO_W = clamp(180 * s, 160, 260);
  const LOGO_H = clamp(40 * s, 34, 60);

  // responsive sizing
  const H_PAD = clamp(16 * s, 14, 24);
  const PAGE_TITLE = clamp(22 * s, 18, 28);
  const LABEL_SIZE = clamp(12 * s, 11, 14);
  const INPUT_H = clamp(48 * s, 46, 56);
  const BTN_H = clamp(48 * s, 46, 58);

  const RADIUS = clamp(10 * s, 8, 14);
  const CARD_RADIUS = clamp(18 * s, 14, 22);
  const CARD_PAD = clamp(18 * s, 14, 22);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [sex, setSex] = useState<"Male" | "Female" | "Other" | "">("");
  const [sexOpen, setSexOpen] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [agreePrivacy, setAgreePrivacy] = useState(false);
  const [agreePolicy, setAgreePolicy] = useState(false);
  const [agreeNda, setAgreeNda] = useState(false);

  const [legalOpen, setLegalOpen] = useState(false);
  const [legalKey, setLegalKey] = useState<LegalKey>("privacy");

  const openLegal = (key: LegalKey) => {
    setLegalKey(key);
    setLegalOpen(true);
  };

  const onAgree = () => {
    if (legalKey === "privacy") setAgreePrivacy(true);
    if (legalKey === "policy") setAgreePolicy(true);
    if (legalKey === "nda") setAgreeNda(true);
    setLegalOpen(false);
  };

  // Password rules
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

  const handleCreate = () => {
    if (!canCreate) return;

    console.log("CLIENT SIGNUP", {
      role: "client",
      firstName,
      lastName,
      sex,
      email,
      password,
      agreePrivacy,
      agreePolicy,
      agreeNda,
    });
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

        {/* top row */}
        <View style={[styles.topRow, { paddingHorizontal: H_PAD }]}>
          <Image
            source={require("../../image/jdklogo.png")}
            style={{ width: LOGO_W, height: LOGO_H, resizeMode: "contain" }}
          />

          <View style={styles.topRight}>
            <Text
              style={[styles.topRightText, { fontSize: clamp(12 * s, 11, 14) }]}
            >
              Want to work as a worker?
            </Text>
            <TouchableOpacity
              onPress={() => router.push("/workersignup/workersignup")}
              activeOpacity={0.85}
            >
              <Text
                style={[
                  styles.topRightLink,
                  { fontSize: clamp(12 * s, 11, 14) },
                ]}
              >
                Apply as Worker
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView
          contentContainerStyle={{
            paddingHorizontal: H_PAD,
            paddingBottom: Math.max(insets.bottom, 22),
          }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* ✅ CARD */}
          <View
            style={[styles.cardWrap, { maxWidth: clamp(560 * s, 360, 680) }]}
          >
            <View
              style={[
                styles.card,
                { borderRadius: CARD_RADIUS, padding: CARD_PAD },
              ]}
            >
              <Text style={[styles.pageTitle, { fontSize: PAGE_TITLE }]}>
                Sign up to be a <Text style={styles.blue}>Client</Text>
              </Text>

              {/* FORM */}
              <View style={styles.form}>
                {/* First/Last */}
                <View
                  style={[
                    styles.row,
                    STACK_NAMES && { flexDirection: "column" },
                  ]}
                >
                  <View
                    style={[styles.field, STACK_NAMES && { width: "100%" }]}
                  >
                    <Text style={[styles.label, { fontSize: LABEL_SIZE }]}>
                      First Name
                    </Text>
                    <TextInput
                      value={firstName}
                      onChangeText={setFirstName}
                      placeholder="First name"
                      placeholderTextColor="#94a3b8"
                      style={[
                        styles.input,
                        {
                          height: INPUT_H,
                          borderRadius: RADIUS,
                          paddingHorizontal: clamp(12 * s, 12, 18),
                          fontSize: clamp(14 * s, 13, 16),
                        },
                      ]}
                    />
                  </View>

                  <View
                    style={[styles.field, STACK_NAMES && { width: "100%" }]}
                  >
                    <Text style={[styles.label, { fontSize: LABEL_SIZE }]}>
                      Last Name
                    </Text>
                    <TextInput
                      value={lastName}
                      onChangeText={setLastName}
                      placeholder="Last name"
                      placeholderTextColor="#94a3b8"
                      style={[
                        styles.input,
                        {
                          height: INPUT_H,
                          borderRadius: RADIUS,
                          paddingHorizontal: clamp(12 * s, 12, 18),
                          fontSize: clamp(14 * s, 13, 16),
                        },
                      ]}
                    />
                  </View>
                </View>

                {/* Sex dropdown */}
                <View style={styles.field}>
                  <Text style={[styles.label, { fontSize: LABEL_SIZE }]}>
                    Sex
                  </Text>
                  <TouchableOpacity
                    style={[
                      styles.select,
                      {
                        height: INPUT_H,
                        borderRadius: RADIUS,
                        paddingHorizontal: clamp(12 * s, 12, 18),
                      },
                    ]}
                    onPress={() => setSexOpen(true)}
                    activeOpacity={0.85}
                  >
                    <Text
                      style={[
                        styles.selectText,
                        { fontSize: clamp(14 * s, 13, 16) },
                        !sex && styles.placeholder,
                      ]}
                    >
                      {sex ? sex : "Select sex"}
                    </Text>
                    <Text
                      style={[styles.chev, { fontSize: clamp(16 * s, 14, 18) }]}
                    >
                      ▾
                    </Text>
                  </TouchableOpacity>
                </View>

                {/* Sex modal */}
                <Modal visible={sexOpen} transparent animationType="fade">
                  <TouchableOpacity
                    style={styles.backdrop}
                    activeOpacity={1}
                    onPress={() => setSexOpen(false)}
                  >
                    <View
                      style={[
                        styles.pickSheet,
                        { borderRadius: clamp(14 * s, 12, 18) },
                      ]}
                    >
                      <Text
                        style={[
                          styles.pickTitle,
                          { fontSize: clamp(14 * s, 13, 16) },
                        ]}
                      >
                        Select sex
                      </Text>

                      {(["Male", "Female", "Other"] as const).map((opt) => (
                        <TouchableOpacity
                          key={opt}
                          style={[
                            styles.pickItem,
                            {
                              height: clamp(46 * s, 44, 54),
                              borderRadius: clamp(10 * s, 8, 14),
                            },
                          ]}
                          activeOpacity={0.85}
                          onPress={() => {
                            setSex(opt);
                            setSexOpen(false);
                          }}
                        >
                          <Text
                            style={[
                              styles.pickItemText,
                              { fontSize: clamp(13.5 * s, 13, 16) },
                            ]}
                          >
                            {opt}
                          </Text>
                          {sex === opt ? (
                            <Text style={styles.pickCheck}>✓</Text>
                          ) : null}
                        </TouchableOpacity>
                      ))}

                      <TouchableOpacity
                        style={[
                          styles.pickCancel,
                          {
                            height: clamp(44 * s, 42, 52),
                            borderRadius: clamp(10 * s, 8, 14),
                          },
                        ]}
                        onPress={() => setSexOpen(false)}
                        activeOpacity={0.9}
                      >
                        <Text
                          style={[
                            styles.pickCancelText,
                            { fontSize: clamp(13.5 * s, 13, 16) },
                          ]}
                        >
                          Cancel
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </TouchableOpacity>
                </Modal>

                {/* Email */}
                <View style={styles.field}>
                  <Text style={[styles.label, { fontSize: LABEL_SIZE }]}>
                    Email Address
                  </Text>
                  <TextInput
                    value={email}
                    onChangeText={setEmail}
                    placeholder="@gmail.com"
                    placeholderTextColor="#94a3b8"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    style={[
                      styles.input,
                      {
                        height: INPUT_H,
                        borderRadius: RADIUS,
                        paddingHorizontal: clamp(12 * s, 12, 18),
                        fontSize: clamp(14 * s, 13, 16),
                      },
                    ]}
                  />
                </View>

                {/* Password */}
                <View style={styles.field}>
                  <Text style={[styles.label, { fontSize: LABEL_SIZE }]}>
                    Password (8 or more characters)
                  </Text>
                  <TextInput
                    value={password}
                    onChangeText={setPassword}
                    placeholder="Password"
                    placeholderTextColor="#94a3b8"
                    secureTextEntry
                    style={[
                      styles.input,
                      {
                        height: INPUT_H,
                        borderRadius: RADIUS,
                        paddingHorizontal: clamp(12 * s, 12, 18),
                        fontSize: clamp(14 * s, 13, 16),
                      },
                    ]}
                  />

                  <View
                    style={[styles.rulesRow, { gap: clamp(12 * s, 10, 16) }]}
                  >
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
                  <Text style={[styles.label, { fontSize: LABEL_SIZE }]}>
                    Confirm Password
                  </Text>
                  <TextInput
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    placeholder="Confirm password"
                    placeholderTextColor="#94a3b8"
                    secureTextEntry
                    style={[
                      styles.input,
                      {
                        height: INPUT_H,
                        borderRadius: RADIUS,
                        paddingHorizontal: clamp(12 * s, 12, 18),
                        fontSize: clamp(14 * s, 13, 16),
                      },
                    ]}
                  />
                  {confirmPassword.length > 0 && !passwordsMatch ? (
                    <Text
                      style={[
                        styles.error,
                        { fontSize: clamp(12 * s, 11, 14) },
                      ]}
                    >
                      Passwords do not match.
                    </Text>
                  ) : null}
                </View>

                {/* Agreements */}
                <View style={styles.agreeBlock}>
                  <View style={styles.agreeRow}>
                    <View style={[styles.box, agreePrivacy && styles.boxOn]}>
                      {agreePrivacy ? (
                        <Text style={styles.boxTick}>✓</Text>
                      ) : null}
                    </View>
                    <Text
                      style={[
                        styles.agreeText,
                        { fontSize: clamp(12.5 * s, 12, 15) },
                      ]}
                    >
                      JDK HOMECARE’s{" "}
                      <Text
                        style={styles.link}
                        onPress={() => openLegal("privacy")}
                      >
                        Privacy Policy
                      </Text>
                      .
                    </Text>
                  </View>
                  {!agreePrivacy ? (
                    <Text
                      style={[styles.hint, { fontSize: clamp(11 * s, 10, 13) }]}
                    >
                      Please read the Privacy Policy to enable this checkbox.
                    </Text>
                  ) : null}

                  <View
                    style={[
                      styles.agreeRow,
                      { marginTop: clamp(12 * s, 10, 16) },
                    ]}
                  >
                    <View
                      style={[
                        styles.box,
                        agreePolicy && agreeNda && styles.boxOn,
                      ]}
                    >
                      {agreePolicy && agreeNda ? (
                        <Text style={styles.boxTick}>✓</Text>
                      ) : null}
                    </View>
                    <Text
                      style={[
                        styles.agreeText,
                        { fontSize: clamp(12.5 * s, 12, 15) },
                      ]}
                    >
                      JDK HOMECARE’s{" "}
                      <Text
                        style={styles.link}
                        onPress={() => openLegal("policy")}
                      >
                        Policy Agreement
                      </Text>{" "}
                      and{" "}
                      <Text
                        style={styles.link}
                        onPress={() => openLegal("nda")}
                      >
                        Non-Disclosure Agreement
                      </Text>
                      .
                    </Text>
                  </View>
                  {!agreePolicy || !agreeNda ? (
                    <Text
                      style={[styles.hint, { fontSize: clamp(11 * s, 10, 13) }]}
                    >
                      Please read and agree to both links to enable this
                      checkbox.
                    </Text>
                  ) : null}
                </View>

                {/* Button */}
                <TouchableOpacity
                  activeOpacity={0.9}
                  disabled={!canCreate}
                  onPress={handleCreate}
                  style={[
                    styles.btn,
                    {
                      height: BTN_H,
                      borderRadius: RADIUS,
                      marginTop: clamp(6 * s, 4, 10),
                    },
                    canCreate ? styles.btnOn : styles.btnOff,
                  ]}
                >
                  <Text
                    style={[
                      styles.btnText,
                      { fontSize: clamp(14 * s, 13, 16) },
                    ]}
                  >
                    Create my account
                  </Text>
                </TouchableOpacity>

                {/* Bottom */}
                <View
                  style={[
                    styles.bottomRow,
                    { marginTop: clamp(14 * s, 12, 18) },
                  ]}
                >
                  <Text
                    style={[
                      styles.bottomText,
                      { fontSize: clamp(13 * s, 12, 15) },
                    ]}
                  >
                    Already have an account?
                  </Text>
                  <TouchableOpacity onPress={() => router.push("/login/login")}>
                    <Text
                      style={[
                        styles.bottomLink,
                        { fontSize: clamp(13 * s, 12, 15) },
                      ]}
                    >
                      Log In
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>

          <View style={{ height: isShort ? 18 : 26 }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#fff" },
  root: { flex: 1, backgroundColor: "#fff" },

  topRow: {
    paddingTop: 14, // ✅ more breathing space like login
    paddingBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 10,
  },

  topRight: { alignItems: "flex-end" },
  topRightText: { color: "#111827" },
  topRightLink: { color: BLUE, fontWeight: "800", marginTop: 2 },

  // ✅ center card container
  cardWrap: {
    width: "100%",
    alignSelf: "center",
    marginTop: 10,
  },

  // ✅ CARD STYLE (same family as login/role)
  card: {
    width: "100%",
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#eef2f7",
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
  },

  pageTitle: {
    fontWeight: "900",
    color: "#111827",
    textAlign: "center",
    marginBottom: 14,
  },
  blue: { color: BLUE },

  form: {
    width: "100%",
    alignSelf: "center",
  },

  row: { flexDirection: "row", gap: 12 },
  field: { marginBottom: 12, flex: 1 },

  label: {
    fontWeight: "800",
    color: "#111827",
    marginBottom: 6,
  },

  input: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    paddingHorizontal: 12,
    color: "#111827",
    backgroundColor: "#fff",
  },

  select: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  selectText: { fontWeight: "700", color: "#111827" },
  placeholder: { color: "#94a3b8" },
  chev: { fontWeight: "900", color: "#64748b" },

  rulesRow: {
    marginTop: 10,
    flexDirection: "row",
  },
  ruleText: { fontSize: 11.5, color: "#6b7280", marginBottom: 6 },
  ruleOk: { color: BLUE, fontWeight: "800" },

  error: { marginTop: 6, color: "#b91c1c", fontWeight: "800" },

  agreeBlock: { marginTop: 4, marginBottom: 10 },
  agreeRow: { flexDirection: "row", gap: 10, alignItems: "flex-start" },
  box: {
    width: 16,
    height: 16,
    borderRadius: 3,
    borderWidth: 1,
    borderColor: "#d1d5db",
    marginTop: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  boxOn: { borderColor: BLUE },
  boxTick: { fontSize: 12, fontWeight: "900", color: BLUE, marginTop: -1 },
  agreeText: { flex: 1, color: "#111827", lineHeight: 18 },
  link: { color: BLUE, fontWeight: "800" },
  hint: { marginTop: 4, marginLeft: 26, color: "#6b7280" },

  btn: {
    alignItems: "center",
    justifyContent: "center",
  },
  btnOff: { backgroundColor: "#d1d5db" },
  btnOn: { backgroundColor: "#cfd6df" },
  btnText: { fontWeight: "800", color: "#111827" },

  bottomRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 6,
    flexWrap: "wrap",
  },
  bottomText: { color: "#111827" },
  bottomLink: { color: BLUE, fontWeight: "800" },

  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.35)",
    justifyContent: "center",
    padding: 18,
  },
  pickSheet: {
    backgroundColor: "#fff",
    padding: 14,
    borderWidth: 1,
    borderColor: "#eef2f7",
  },
  pickTitle: {
    fontWeight: "900",
    color: "#0f172a",
    marginBottom: 10,
  },
  pickItem: {
    borderWidth: 1,
    borderColor: "#eef2f7",
    backgroundColor: "#fbfcfe",
    paddingHorizontal: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  pickItemText: { fontWeight: "800", color: "#0f172a" },
  pickCheck: { fontSize: 16, fontWeight: "900", color: BLUE },
  pickCancel: {
    borderWidth: 1,
    borderColor: "#d7dee9",
    alignItems: "center",
    justifyContent: "center",
  },
  pickCancelText: { fontWeight: "900", color: "#334155" },
});
