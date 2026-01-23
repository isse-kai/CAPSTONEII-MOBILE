import { useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import {
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
} from 'react-native';
import AgreementModal from '../legal/AgreementModal';
import type { LegalKey } from '../legal/legalContent';

const BLUE = '#1E88E5';
const { width } = Dimensions.get('window');

function RuleLine({ ok, text }: { ok: boolean; text: string }) {
  return (
    <Text style={[styles.ruleText, ok && styles.ruleOk]}>
      {ok ? '✓ ' : '• '}
      {text}
    </Text>
  );
}

export default function ClientSignupScreen() {
  const router = useRouter();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [sex, setSex] = useState<'Male' | 'Female' | 'Other' | ''>('');
  const [sexOpen, setSexOpen] = useState(false);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [agreePrivacy, setAgreePrivacy] = useState(false);
  const [agreePolicy, setAgreePolicy] = useState(false);
  const [agreeNda, setAgreeNda] = useState(false);

  const [legalOpen, setLegalOpen] = useState(false);
  const [legalKey, setLegalKey] = useState<LegalKey>('privacy');

  const openLegal = (key: LegalKey) => {
    setLegalKey(key);
    setLegalOpen(true);
  };

  const onAgree = () => {
    if (legalKey === 'privacy') setAgreePrivacy(true);
    if (legalKey === 'policy') setAgreePolicy(true);
    if (legalKey === 'nda') setAgreeNda(true);
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

    console.log('CLIENT SIGNUP', {
      role: 'client',
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

  const STACK_NAMES = width < 360;

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={styles.root}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <AgreementModal
          visible={legalOpen}
          docKey={legalKey}
          onClose={() => setLegalOpen(false)}
          onAgree={onAgree}
        />

        {/* top row */}
        <View style={styles.topRow}>
          <Image source={require('../../image/jdklogo.png')} style={styles.logo} />

          <View style={styles.topRight}>
            <Text style={styles.topRightText}>Want to work as a worker?</Text>
            <TouchableOpacity
              onPress={() => router.push('/workersignup/workersignup')}
              activeOpacity={0.85}
            >
              <Text style={styles.topRightLink}>Apply as Worker</Text>
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
          <Text style={styles.pageTitle}>
            Sign up to be a <Text style={styles.blue}>Client</Text>
          </Text>

          {/* FORM */}
          <View style={styles.form}>
            {/* First/Last */}
            <View style={[styles.row, STACK_NAMES && { flexDirection: 'column' }]}>
              <View style={[styles.field, STACK_NAMES && { width: '100%' }]}>
                <Text style={styles.label}>First Name</Text>
                <TextInput
                  value={firstName}
                  onChangeText={setFirstName}
                  placeholder="First name"
                  placeholderTextColor="#94a3b8"
                  style={styles.input}
                />
              </View>

              <View style={[styles.field, STACK_NAMES && { width: '100%' }]}>
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
              <TouchableOpacity
                style={styles.select}
                onPress={() => setSexOpen(true)}
                activeOpacity={0.85}
              >
                <Text style={[styles.selectText, !sex && styles.placeholder]}>
                  {sex ? sex : 'Select sex'}
                </Text>
                <Text style={styles.chev}>▾</Text>
              </TouchableOpacity>
            </View>

            {/* Sex modal */}
            <Modal visible={sexOpen} transparent animationType="fade">
              <TouchableOpacity
                style={styles.backdrop}
                activeOpacity={1}
                onPress={() => setSexOpen(false)}
              >
                <View style={styles.pickSheet}>
                  <Text style={styles.pickTitle}>Select sex</Text>

                  {(['Male', 'Female', 'Other'] as const).map((opt) => (
                    <TouchableOpacity
                      key={opt}
                      style={styles.pickItem}
                      activeOpacity={0.85}
                      onPress={() => {
                        setSex(opt);
                        setSexOpen(false);
                      }}
                    >
                      <Text style={styles.pickItemText}>{opt}</Text>
                      {sex === opt ? <Text style={styles.pickCheck}>✓</Text> : null}
                    </TouchableOpacity>
                  ))}

                  <TouchableOpacity
                    style={styles.pickCancel}
                    onPress={() => setSexOpen(false)}
                    activeOpacity={0.9}
                  >
                    <Text style={styles.pickCancelText}>Cancel</Text>
                  </TouchableOpacity>
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
              <TextInput
                value={password}
                onChangeText={setPassword}
                placeholder="Password"
                placeholderTextColor="#94a3b8"
                secureTextEntry
                style={styles.input}
              />

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
              <TextInput
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                placeholder="Confirm password"
                placeholderTextColor="#94a3b8"
                secureTextEntry
                style={styles.input}
              />
              {confirmPassword.length > 0 && !passwordsMatch ? (
                <Text style={styles.error}>Passwords do not match.</Text>
              ) : null}
            </View>

            {/* Agreements */}
            <View style={styles.agreeBlock}>
              <View style={styles.agreeRow}>
                <View style={[styles.box, agreePrivacy && styles.boxOn]}>
                  {agreePrivacy ? <Text style={styles.boxTick}>✓</Text> : null}
                </View>
                <Text style={styles.agreeText}>
                  JDK HOMECARE’s{' '}
                  <Text style={styles.link} onPress={() => openLegal('privacy')}>
                    Privacy Policy
                  </Text>
                  .
                </Text>
              </View>
              {!agreePrivacy ? (
                <Text style={styles.hint}>Please read the Privacy Policy to enable this checkbox.</Text>
              ) : null}

              <View style={[styles.agreeRow, { marginTop: 12 }]}>
                <View style={[styles.box, agreePolicy && styles.boxOn]}>
                  {agreePolicy ? <Text style={styles.boxTick}>✓</Text> : null}
                </View>
                <Text style={styles.agreeText}>
                  JDK HOMECARE’s{' '}
                  <Text style={styles.link} onPress={() => openLegal('policy')}>
                    Policy Agreement
                  </Text>{' '}
                  and{' '}
                  <Text style={styles.link} onPress={() => openLegal('nda')}>
                    Non-Disclosure Agreement
                  </Text>
                  .
                </Text>
              </View>
              {!agreePolicy || !agreeNda ? (
                <Text style={styles.hint}>Please read and agree to both links to enable this checkbox.</Text>
              ) : null}
            </View>

            {/* Button */}
            <TouchableOpacity
              activeOpacity={0.9}
              disabled={!canCreate}
              onPress={handleCreate}
              style={[styles.btn, canCreate ? styles.btnOn : styles.btnOff]}
            >
              <Text style={styles.btnText}>Create my account</Text>
            </TouchableOpacity>

            {/* Bottom */}
            <View style={styles.bottomRow}>
              <Text style={styles.bottomText}>Already have an account?</Text>
              <TouchableOpacity onPress={() => router.push('/login/login')}>
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
  safe: { flex: 1, backgroundColor: '#fff' },
  root: { flex: 1, backgroundColor: '#fff' },

  topRow: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 6,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 10,
  },
  logo: { width: 150, height: 28, resizeMode: 'contain' },
  topRight: { alignItems: 'flex-end' },
  topRightText: { fontSize: 12, color: '#111827' },
  topRightLink: { fontSize: 12, color: BLUE, fontWeight: '800', marginTop: 2 },

  scroll: { paddingHorizontal: 16, paddingBottom: 26 },
  pageTitle: {
    marginTop: 10,
    fontSize: 22,
    fontWeight: '900',
    color: '#111827',
    textAlign: 'center',
    marginBottom: 14,
  },
  blue: { color: BLUE },

  form: {
    width: '100%',
    maxWidth: 520,
    alignSelf: 'center',
  },

  row: { flexDirection: 'row', gap: 12 },
  field: { marginBottom: 12, flex: 1 },

  label: {
    fontSize: 12,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 6,
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 10,
    paddingHorizontal: 12,
    fontSize: 14,
    color: '#111827',
    backgroundColor: '#fff',
  },

  select: {
    height: 48,
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 10,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  selectText: { fontSize: 14, fontWeight: '700', color: '#111827' },
  placeholder: { color: '#94a3b8' },
  chev: { fontSize: 16, fontWeight: '900', color: '#64748b' },

  rulesRow: {
    marginTop: 10,
    flexDirection: 'row',
    gap: 12,
  },
  ruleText: { fontSize: 11.5, color: '#6b7280', marginBottom: 6 },
  ruleOk: { color: BLUE, fontWeight: '800' },

  error: { marginTop: 6, fontSize: 12, color: '#b91c1c', fontWeight: '800' },

  agreeBlock: { marginTop: 4, marginBottom: 10 },
  agreeRow: { flexDirection: 'row', gap: 10, alignItems: 'flex-start' },
  box: {
    width: 16,
    height: 16,
    borderRadius: 3,
    borderWidth: 1,
    borderColor: '#d1d5db',
    marginTop: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  boxOn: { borderColor: BLUE },
  boxTick: { fontSize: 12, fontWeight: '900', color: BLUE, marginTop: -1 },
  agreeText: { flex: 1, fontSize: 12.5, color: '#111827', lineHeight: 18 },
  link: { color: BLUE, fontWeight: '800' },
  hint: { marginTop: 4, marginLeft: 26, fontSize: 11, color: '#6b7280' },

  btn: {
    height: 48,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 6,
  },
  btnOff: { backgroundColor: '#d1d5db' },
  btnOn: { backgroundColor: '#cfd6df' },
  btnText: { fontSize: 14, fontWeight: '800', color: '#111827' },

  bottomRow: {
    marginTop: 14,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
    flexWrap: 'wrap',
  },
  bottomText: { fontSize: 13, color: '#111827' },
  bottomLink: { fontSize: 13, color: BLUE, fontWeight: '800' },

  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'center',
    padding: 18,
  },
  pickSheet: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#eef2f7',
  },
  pickTitle: { fontSize: 14, fontWeight: '900', color: '#0f172a', marginBottom: 10 },
  pickItem: {
    height: 46,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#eef2f7',
    backgroundColor: '#fbfcfe',
    paddingHorizontal: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  pickItemText: { fontSize: 13.5, fontWeight: '800', color: '#0f172a' },
  pickCheck: { fontSize: 16, fontWeight: '900', color: BLUE },
  pickCancel: {
    height: 44,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#d7dee9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pickCancelText: { fontSize: 13.5, fontWeight: '900', color: '#334155' },
});
