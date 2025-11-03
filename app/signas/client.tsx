// app/signas/client.tsx
import { Image, Pressable, Text, TextInput, View } from "dripsy";
import { useFonts } from "expo-font";
import { useRouter } from "expo-router";
import {
  ArrowLeft,
  Check,
  ChevronDown,
  Globe,
  Info,
  Lock,
  LogIn,
  Mail,
  User,
  UserRound,
} from "lucide-react-native";
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Animated,
  KeyboardAvoidingView,
  Modal,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  TouchableOpacity,
} from "react-native";
import { signUpClient } from "../../lib/auth";

/* ---------- Theme ---------- */
const C = {
  bg: "#f7f9fc",
  card: "#ffffff",
  text: "#0f172a",
  sub: "#64748b",
  blue: "#1e86ff",
  blueDark: "#0c62c9",
  border: "#e6eef7",
  field: "#f8fafc",
  placeholder: "#9aa4b2",
  ok: "#16a34a",
  warn: "#f59e0b",
  bad: "#ef4444",
  chip: "#eef6ff",
};
const PAD = 22;
const GAP = 16;
const MIN_PW = 12;

export default function ClientSignUp() {
  const router = useRouter();

  // form
  const [first, setFirst] = useState("");
  const [last, setLast] = useState("");
  const [sex, setSex] = useState<string | null>(null);
  const [sexOpen, setSexOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [pw2, setPw2] = useState("");
  const [agree, setAgree] = useState(false);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  // anim
  const fade = useRef(new Animated.Value(0)).current;
  const slide = useRef(new Animated.Value(22)).current;

  const [fontsLoaded] = useFonts({
    "Poppins-Regular": require("../../assets/fonts/Poppins/Poppins-Regular.ttf"),
    "Poppins-Medium": require("../../assets/fonts/Poppins/Poppins-Medium.ttf"),
    "Poppins-SemiBold": require("../../assets/fonts/Poppins/Poppins-SemiBold.ttf"),
    "Poppins-Bold": require("../../assets/fonts/Poppins/Poppins-Bold.ttf"),
    "Poppins-ExtraBold": require("../../assets/fonts/Poppins/Poppins-ExtraBold.ttf"),
  });

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fade, { toValue: 1, duration: 500, useNativeDriver: true }),
      Animated.timing(slide, { toValue: 0, duration: 500, useNativeDriver: true }),
    ]).start();
  }, [fade, slide]);

  /* ---------- Validation ---------- */
  const emailOk = useMemo(() => /\S+@\S+\.\S+/.test(email), [email]);

  const pwScore = useMemo(() => {
    let s = 0;
    if (pw.length >= MIN_PW) s += 1;
    if (/[A-Z]/.test(pw)) s += 1;
    if (/[0-9]/.test(pw)) s += 1;
    if (/[^A-Za-z0-9]/.test(pw)) s += 1;
    return s; // 0–4
  }, [pw]);

  const pwHint = useMemo(() => {
    if (!pw) return { label: "Password", color: C.sub };
    if (pwScore <= 1) return { label: "Weak", color: C.bad };
    if (pwScore === 2) return { label: "Okay", color: C.warn };
    return { label: "Strong", color: C.ok };
  }, [pwScore, pw]);

  const pwMatch = useMemo(() => pw.length >= MIN_PW && pw === pw2, [pw, pw2]);

  const canSubmit = useMemo(
    () => first.trim() && last.trim() && !!sex && emailOk && pwMatch && agree,
    [first, last, sex, emailOk, pwMatch, agree]
  );

  const submit = async () => {
    if (!canSubmit || loading) return;
    setLoading(true);
    setErr(null);
    try {
      await signUpClient({
        email,
        password: pw,
        first,
        last,
        sex: (sex as "Male" | "Female") ?? null,
      });
      router.replace("/login/login");
    } catch (e: any) {
      setErr(e?.message ?? "Sign up failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!fontsLoaded) return null;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: C.bg }}>
      <StatusBar barStyle="dark-content" backgroundColor={C.bg} />
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={{ flex: 1 }}>
        <Animated.View style={{ flex: 1, opacity: fade, transform: [{ translateY: slide }] }}>
          <ScrollView
            contentContainerStyle={{ paddingBottom: 28 }}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {/* Header */}
            <View sx={{ px: PAD, pt: 12, pb: 8, alignItems: "center", position: "relative" }}>
              <Pressable
                onPress={() => router.back()}
                sx={{
                  position: "absolute",
                  left: PAD,
                  top: 12,
                  width: 44,
                  height: 44,
                  borderRadius: 22,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <ArrowLeft color={C.text} size={26} />
              </Pressable>

              <Image
                source={require("../../assets/jdklogo.png")}
                sx={{ width: 82, height: 82 }}
                resizeMode="contain"
              />
            </View>

            {/* Title */}
            <View sx={{ alignItems: "center", mb: 10, px: PAD }}>
              <Text
                sx={{
                  color: C.text,
                  fontFamily: "Poppins-ExtraBold",
                  fontSize: 26,
                  textAlign: "center",
                }}
              >
                Sign up to be a <Text sx={{ color: C.blue }}>Client</Text>
              </Text>
            </View>

            {/* Card */}
            <View
              sx={{
                mx: PAD,
                bg: C.card,
                borderWidth: 1,
                borderColor: C.border,
                borderRadius: 22,
                px: PAD,
                py: 20,
                shadowColor: "#000",
                shadowOpacity: Platform.OS === "android" ? 0 : 0.05,
                shadowRadius: 14,
                shadowOffset: { width: 0, height: 8 },
                elevation: 1,
              }}
            >
              {/* Google */}
              <Pressable
                onPress={() => {}}
                sx={{
                  height: 52,
                  borderWidth: 1.8,
                  borderColor: C.blue,
                  borderRadius: 16,
                  alignItems: "center",
                  justifyContent: "center",
                  flexDirection: "row",
                  columnGap: 10,
                }}
              >
                <Globe color={C.blue} size={18} />
                <Text sx={{ color: C.text, fontFamily: "Poppins-SemiBold" }}>
                  Continue with Google
                </Text>
              </Pressable>

              {/* or divider */}
              <View sx={{ flexDirection: "row", alignItems: "center", my: 18 }}>
                <View sx={{ flex: 1, height: 1, bg: C.border }} />
                <Text sx={{ color: C.sub, mx: 12 }}>or</Text>
                <View sx={{ flex: 1, height: 1, bg: C.border }} />
              </View>

              {/* --- VERTICAL FORM --- */}
              <Field label="First Name" icon={<User color={C.sub} size={16} />}>
                <Input value={first} onChangeText={setFirst} placeholder="First name" />
              </Field>

              <Field label="Last Name" icon={<User color={C.sub} size={16} />}>
                <Input value={last} onChangeText={setLast} placeholder="Last name" />
              </Field>

              <Field label="Sex" icon={<UserRound color={C.sub} size={16} />}>
                <Pressable onPress={() => setSexOpen(true)} sx={selectBtn}>
                  <Text sx={{ color: sex ? C.text : C.placeholder }}>{sex || "Select sex"}</Text>
                  <ChevronDown color={C.sub} size={18} />
                </Pressable>
              </Field>

              <Field label="Email Address" icon={<Mail color={C.sub} size={16} />}>
                <Input
                  value={email}
                  onChangeText={setEmail}
                  placeholder="Email address"
                  autoCapitalize="none"
                  keyboardType="email-address"
                  rightStatus={email ? (emailOk ? "ok" : "bad") : "none"}
                />
              </Field>

              <Field
                label={
                  <Text>
                    Password <Text sx={{ color: C.sub }}>(12+)</Text>
                  </Text>
                }
                icon={<Lock color={C.sub} size={16} />}
              >
                <Input value={pw} onChangeText={setPw} placeholder="Password" secureTextEntry />
                {!!pw && (
                  <Text sx={{ mt: 8, color: pwHint.color, fontSize: 12 }}>
                    {pwHint.label} • Use letters, numbers & symbols
                  </Text>
                )}
              </Field>

              <Field label="Confirm Password" icon={<Lock color={C.sub} size={16} />}>
                <Input
                  value={pw2}
                  onChangeText={setPw2}
                  placeholder="Confirm"
                  secureTextEntry
                  rightStatus={pw2 ? (pwMatch ? "ok" : "bad") : "none"}
                />
              </Field>

              <View sx={{ flexDirection: "row", alignItems: "center", mt: 16 }}>
                <Info color={C.sub} size={16} />
                <Text sx={{ color: C.sub, ml: 8, fontSize: 12 }}>
                  You can edit your details anytime in Settings.
                </Text>
              </View>

              <Pressable
                onPress={() => setAgree((v) => !v)}
                sx={{ flexDirection: "row", alignItems: "center", mt: 18 }}
              >
                <View
                  sx={{
                    width: 24,
                    height: 24,
                    borderRadius: 8,
                    borderWidth: 1.5,
                    borderColor: C.border,
                    alignItems: "center",
                    justifyContent: "center",
                    bg: agree ? C.blue : "#fff",
                  }}
                >
                  {agree ? <Check color="#fff" size={14} /> : null}
                </View>

                <Text sx={{ color: C.text, ml: 12, flex: 1 }}>
                  I agree to JDK HOMECARE’s <Text sx={{ color: C.blue }}>Terms of Service</Text> and{" "}
                  <Text sx={{ color: C.blue }}>Privacy Policy</Text>.
                </Text>
              </Pressable>

              {err ? <Text sx={{ color: C.bad, mt: 10, fontSize: 12 }}>{err}</Text> : null}

              <Pressable
                onPress={submit}
                disabled={!canSubmit || loading}
                sx={{
                  height: 54,
                  borderRadius: 16,
                  alignItems: "center",
                  justifyContent: "center",
                  mt: 18,
                  bg: !canSubmit ? "#cfd8e3" : loading ? C.blueDark : C.blue,
                }}
                style={({ pressed }) => [{ opacity: pressed && canSubmit && !loading ? 0.92 : 1 }]}
              >
                <Text sx={{ color: "#fff", fontFamily: "Poppins-Bold", fontSize: 15 }}>
                  Create my account
                </Text>
              </Pressable>

              <View sx={{ alignItems: "center", mt: 12 }}>
                <Text sx={{ color: C.sub }}>
                  Already have an account?{" "}
                  <Text onPress={() => router.replace("/login/login")} sx={{ color: C.blue }}>
                    <LogIn color={C.blue} size={14} /> Log In
                  </Text>
                </Text>
              </View>
            </View>
          </ScrollView>
        </Animated.View>
      </KeyboardAvoidingView>

      {/* Sex modal */}
      <Modal visible={sexOpen} transparent animationType="fade" onRequestClose={() => setSexOpen(false)}>
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.35)",
            justifyContent: "flex-end",
          }}
        >
          <View
            style={{
              backgroundColor: "#fff",
              borderTopLeftRadius: 22,
              borderTopRightRadius: 22,
              paddingBottom: 10,
            }}
          >
            <View
              style={{
                paddingHorizontal: PAD,
                paddingVertical: 16,
                borderBottomWidth: 1,
                borderBottomColor: C.border,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Text style={{ fontWeight: "900", fontSize: 18, color: C.text }}>Select sex</Text>
              <TouchableOpacity onPress={() => setSexOpen(false)} style={{ padding: 6 }}>
                <Text style={{ color: C.blue, fontWeight: "800" }}>Close</Text>
              </TouchableOpacity>
            </View>

            {["Male", "Female"].map((opt) => (
              <TouchableOpacity
                key={opt}
                onPress={() => {
                  setSex(opt);
                  setSexOpen(false);
                }}
                style={{
                  paddingHorizontal: PAD,
                  paddingVertical: 16,
                  borderBottomWidth: 1,
                  borderBottomColor: C.border,
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <UserRound color={C.sub} size={18} />
                <Text style={{ color: C.text, marginLeft: 12 }}>{opt}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

/* ---------- UI bits ---------- */
function Field({
  label,
  children,
  icon,
}: {
  label: string | React.ReactNode;
  children: React.ReactNode;
  icon?: React.ReactNode;
}) {
  return (
    <View sx={{ width: "100%", marginBottom: GAP }}>
      <View sx={{ flexDirection: "row", alignItems: "center", marginBottom: 8 }}>
        {icon ? <View sx={{ width: 18, mr: 8 }}>{icon}</View> : null}
        {typeof label === "string" ? (
          <Text sx={{ color: C.text, fontFamily: "Poppins-SemiBold" }}>{label}</Text>
        ) : (
          label
        )}
      </View>
      {children}
    </View>
  );
}

const Input = ({ rightStatus = "none", ...props }: any & { rightStatus?: "ok" | "bad" | "none" }) => (
  <View
    sx={{
      position: "relative",
      height: 52,
      bg: C.field,
      borderWidth: 2,
      borderColor: C.border,
      borderRadius: 16,
      justifyContent: "center",
      px: 16,
    }}
  >
    <TextInput
      {...props}
      style={{
        color: C.text,
        fontSize: 16,
        padding: 0,
      }}
      placeholderTextColor={C.placeholder}
    />
    {rightStatus !== "none" ? (
      <View
        style={{
          position: "absolute",
          right: 10,
          top: 0,
          bottom: 0,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {rightStatus === "ok" ? <Check color={C.ok} size={18} /> : <Info color={C.bad} size={18} />}
      </View>
    ) : null}
  </View>
);

const selectBtn = {
  height: 52,
  bg: C.field,
  borderWidth: 2,
  borderColor: C.border,
  borderRadius: 16,
  px: 16,
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
} as const;
