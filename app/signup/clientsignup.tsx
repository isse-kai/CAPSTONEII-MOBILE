import { Ionicons } from '@expo/vector-icons'
import { Pressable, Text, View } from 'dripsy'
import { useFonts } from 'expo-font'
import { useRouter } from 'expo-router'
import { MotiView } from 'moti'
import React, { useState } from 'react'
import {
  Image,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TextInput,
  TouchableOpacity,
} from 'react-native'
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context'
import AgreementsModal from './terms/agreementsmodal'
import PrivacyPolicyModal from './terms/privacypolicymodal'
import VerificationModal from './verification/verificationmodal'

export default function ClientSignup() {
  const router = useRouter()
  const insets = useSafeAreaInsets()

  const [first_name, setFirstName] = useState('')
  const [last_name, setLastName] = useState('')
  const [sex, setSex] = useState('')
  const [showSexDropdown, setShowSexDropdown] = useState(false)
  const [email_address, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm_password, setConfirmPassword] = useState('')

  const [acceptedPrivacy, setAcceptedPrivacy] = useState(false)
  const [acceptedAgreements, setAcceptedAgreements] = useState(false)

  const [privacyModalOpen, setPrivacyModalOpen] = useState(false)
  const [agreementsModalOpen, setAgreementsModalOpen] = useState(false)

  const [error_message, setErrorMessage] = useState('')
  const [info_message, setInfoMessage] = useState('')

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  const [loading] = useState(false)

  const [otpOpen, setOtpOpen] = useState(false)
  const [otpCode, setOtpCode] = useState('')
  const [otpInfo, setOtpInfo] = useState('')
  const [otpError, setOtpError] = useState('')

  const [fontsLoaded] = useFonts({
    'Poppins-Regular': require('../../assets/fonts/Poppins/Poppins-Regular.ttf'),
    'Poppins-Bold': require('../../assets/fonts/Poppins/Poppins-Bold.ttf'),
    'Poppins-ExtraBold': require('../../assets/fonts/Poppins/Poppins-ExtraBold.ttf'),
  })

  if (!fontsLoaded) return null

  // Password requirements
  const passwordRequirements = {
    length: (pw: string) => pw.length >= 8,
    uppercase: (pw: string) => /[A-Z]/.test(pw),
    number: (pw: string) => /\d/.test(pw),
    special: (pw: string) => /[^A-Za-z0-9]/.test(pw),
  }

  const getPasswordStrength = (pw: string) => {
    let score = 0
    if (passwordRequirements.length(pw)) score++
    if (passwordRequirements.uppercase(pw)) score++
    if (passwordRequirements.number(pw)) score++
    if (passwordRequirements.special(pw)) score++
    return score
  }

  const handleSignup = () => {
    if (!first_name || !last_name || !sex || !email_address || !password || !confirm_password) {
      setErrorMessage('Please fill out all required fields.')
      return
    }

    if (password !== confirm_password) {
      setErrorMessage('Passwords do not match.')
      return
    }

    if (getPasswordStrength(password) < 4) {
      setErrorMessage('Password must meet all requirements.')
      return
    }

    if (!acceptedPrivacy || !acceptedAgreements) {
      setErrorMessage('You must accept Privacy Policy and Agreements.')
      return
    }

    setErrorMessage('')
    setInfoMessage('Form validated successfully. (Backend removed)')
    setOtpInfo('This is where OTP verification would appear.')
    setOtpOpen(true)
  }

  const handleResend = () => {
    setInfoMessage('Resend triggered (no backend).')
  }

  const handleVerify = () => {
    setOtpOpen(false)
    router.push('/clientpage/home')
  }

  return (
    <ImageBackground
      source={require('../../assets/login.jpg')}
      style={{ flex: 1 }}
      resizeMode="cover"
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <SafeAreaView
          style={{
            flex: 1,
            paddingTop: insets.top - 20,
            paddingBottom: insets.bottom - 40,
          }}
        >
          <ScrollView
            contentContainerStyle={{
              flexGrow: 1,
              paddingHorizontal: 16,
              justifyContent: 'center',
            }}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <MotiView style={{ gap: 20 }}>
              {/* Logo */}
              <View sx={{ alignItems: 'center', mt: -50, mb: -70 }}>
                <Image
                  source={require('../../assets/jdklogo.png')}
                  style={{ width: 180, height: 180, resizeMode: 'contain' }}
                />
              </View>

              {/* Signup Form Card */}
              <View
                style={{
                  backgroundColor: '#ffffffcc',
                  borderRadius: 12,
                  padding: 16,
                  marginBottom: 20,
                  alignSelf: 'center',
                  width: '100%',
                  maxWidth: 420,
                }}
              >
                {/* Title */}
                <View sx={{ alignItems: 'center', mb: 4 }}>
                  <Text sx={{ fontSize: 20, fontFamily: 'Poppins-ExtraBold', color: '#000000' }}>
                    Sign Up to be a <Text sx={{ fontSize: 20, fontFamily: 'Poppins-ExtraBold', color: '#008CFC' }}>Client</Text>
                  </Text>
                </View>

                {/* First + Last Name */}
                <View style={{ flexDirection: 'row', gap: 10, marginBottom: 12 }}>
                  <View style={{ flex: 1 }}>
                    <Text sx={{ fontSize: 16, color: '#000', mb: 6 }}>First Name</Text>
                    <TextInput
                      value={first_name}
                      onChangeText={setFirstName}
                      placeholder="First name"
                      placeholderTextColor="#ccc"
                      style={inputStyle}
                    />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text sx={{ fontSize: 16, color: '#000', mb: 6 }}>Last Name</Text>
                    <TextInput
                      value={last_name}
                      onChangeText={setLastName}
                      placeholder="Last name"
                      placeholderTextColor="#ccc"
                      style={inputStyle}
                    />
                  </View>
                </View>

                {/* Sex Dropdown */}
                <View style={{ position: 'relative', marginBottom: 12 }}>
                  <Text sx={{ fontSize: 16, color: '#000', mb: 6 }}>Sex</Text>
                  <TouchableOpacity
                    onPress={() => setShowSexDropdown(prev => !prev)}
                    style={{
                      ...inputStyle,
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <Text style={{ fontSize: 16, color: sex ? '#000' : '#999' }}>
                      {sex || 'Select sex'}
                    </Text>
                    <Ionicons
                      name={showSexDropdown ? 'chevron-up' : 'chevron-down'}
                      size={20}
                      color="#333"
                    />
                  </TouchableOpacity>

                  {showSexDropdown && (
                    <MotiView
                      from={{ opacity: 0, translateY: -10 }}
                      animate={{ opacity: 1, translateY: 0 }}
                      transition={{ type: 'timing', duration: 200 }}
                      style={{
                        position: 'absolute',
                        top: 80,
                        left: 0,
                        right: 0,
                        backgroundColor: '#fff',
                        borderRadius: 10,
                        zIndex: 999,
                        elevation: 4,
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: 1 },
                        shadowOpacity: 0.1,
                        shadowRadius: 2,
                      }}
                    >
                      {['Clear', 'Male', 'Female'].map(option => (
                        <TouchableOpacity
                          key={option}
                          onPress={() => {
                            setSex(option === 'Clear' ? '' : option)
                            setShowSexDropdown(false)
                          }}
                          style={{
                            paddingVertical: 12,
                            paddingHorizontal: 16,
                            borderBottomWidth: option === 'Female' ? 0 : 1,
                            borderColor: '#eee',
                          }}
                        >
                          <Text style={{ fontSize: 16, color: option === 'Clear' ? '#888' : '#000' }}>
                          {option === 'Clear' ? 'Select Sex' : option}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </MotiView>
                )}
              </View>

              {/* Email */}
              <View style={{ marginBottom: 12 }}>
                <Text sx={{ fontSize: 16, color: '#000', mb: 6 }}>Email Address</Text>
                <TextInput
                  value={email_address}
                  onChangeText={setEmail}
                  placeholder="@gmail.com"
                  placeholderTextColor="#ccc"
                  style={inputStyle}
                  autoCapitalize="none"
                />
              </View>

              {/* Password */}
              <View style={{ position: 'relative', marginBottom: 12 }}>
                <Text sx={{ fontSize: 16, color: '#000', mb: 6 }}>
                  Password (8 or more characters)
                </Text>
                <TextInput
                  value={password}
                  onChangeText={setPassword}
                  placeholder="Password"
                  placeholderTextColor="#ccc"
                  secureTextEntry={!showPassword}
                  style={inputStyle}
                />
                <Pressable
                  onPress={() => setShowPassword(prev => !prev)}
                  style={{ position: 'absolute', right: 16, top: 42 }}
                >
                  <Ionicons name={showPassword ? 'eye-off' : 'eye'} size={20} color="#333" />
                </Pressable>

                {/* Meter bar */}
                <View style={{ marginTop: 8, height: 6, borderRadius: 3, backgroundColor: '#e5e7eb' }}>
                  <View
                    style={{
                      height: 6,
                      borderRadius: 3,
                      backgroundColor: '#16a34a',
                      width: `${(getPasswordStrength(password) / 4) * 100}%`,
                    }}
                  />
                </View>

                {/* Checklist */}
                <View style={{ flexDirection: 'row', marginTop: 8 }}>
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 12, color: passwordRequirements.length(password) ? '#16a34a' : '#ef4444' }}>
                      • At least 8 characters
                    </Text>
                    <Text style={{ fontSize: 12, color: passwordRequirements.number(password) ? '#16a34a' : '#ef4444' }}>
                      • One number
                    </Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 12, color: passwordRequirements.uppercase(password) ? '#16a34a' : '#ef4444' }}>
                      • One uppercase letter
                    </Text>
                    <Text style={{ fontSize: 12, color: passwordRequirements.special(password) ? '#16a34a' : '#ef4444' }}>
                      • One special character
                    </Text>
                  </View>
                </View>
              </View>

              {/* Confirm Password */}
              <View style={{ position: 'relative', marginBottom: 12 }}>
                <Text sx={{ fontSize: 16, color: '#000', mb: 6 }}>Confirm Password</Text>
                <TextInput
                  value={confirm_password}
                  onChangeText={setConfirmPassword}
                  placeholder="Confirm password"
                  placeholderTextColor="#ccc"
                  secureTextEntry={!showConfirm}
                  style={inputStyle}
                />
                <Pressable
                  onPress={() => setShowConfirm(prev => !prev)}
                  style={{ position: 'absolute', right: 16, top: 42 }}
                >
                  <Ionicons name={showConfirm ? 'eye-off' : 'eye'} size={20} color="#333" />
                </Pressable>
              </View>

              {/* Privacy Policy Checkbox */}
              <View sx={{ flexDirection: 'row', alignItems: 'flex-start', mt: 12 }}>
                <View
                  sx={{
                    width: 18,
                    height: 18,
                    borderWidth: 1,
                    borderColor: '#000',
                    borderRadius: 4,
                    bg: acceptedPrivacy ? '#008CFC' : 'transparent',
                    mr: 10,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {acceptedPrivacy && <Text sx={{ color: '#fff', fontSize: 12 }}>✓</Text>}
                </View>
                <Pressable onPress={() => setPrivacyModalOpen(true)}>
                  <Text sx={{ fontSize: 12, fontFamily: 'Poppins-Regular', color: '#000' }}>
                    JDK HOMECARE’s{' '}
                    <Text
                      sx={{
                        fontSize: 12,
                        fontFamily: 'Poppins-Bold',
                        color: '#008CFC',
                        textDecorationLine: 'underline',
                      }}
                    >
                      Privacy Policy
                    </Text>
                  </Text>
                </Pressable>
              </View>

              {/* Policy Agreement + NDA Checkbox */}
              <View sx={{ flexDirection: 'row', alignItems: 'flex-start', mt: 12 }}>
                <View
                  sx={{
                    width: 18,
                    height: 18,
                    borderWidth: 1,
                    borderColor: '#000',
                    borderRadius: 4,
                    bg: acceptedAgreements ? '#008CFC' : 'transparent',
                    mr: 10,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {acceptedAgreements && <Text sx={{ color: '#fff', fontSize: 12 }}>✓</Text>}
                </View>
                <Pressable onPress={() => setAgreementsModalOpen(true)}>
                  <Text sx={{ fontSize: 12, fontFamily: 'Poppins-Regular', color: '#000' }}>
                    JDK HOMECARE’s{' '}
                    <Text
                      sx={{
                        fontSize: 12,
                        fontFamily: 'Poppins-Bold',
                        color: '#008CFC',
                        textDecorationLine: 'underline',
                      }}
                    >
                      Policy Agreement
                    </Text>{' '}
                    and{' '}
                    <Text
                      sx={{
                        fontSize: 12,
                        fontFamily: 'Poppins-Bold',
                        color: '#008CFC',
                        textDecorationLine: 'underline',
                      }}
                    >
                      Non‑Disclosure Agreement
                    </Text>
                  </Text>
                </Pressable>
              </View>

              {/* Error Message */}
              {error_message ? (
                <Text sx={{ fontSize: 14, color: '#ef4444', mt: 8 }}>{error_message}</Text>
              ) : null}

              {/* Info Message */}
              {info_message ? (
                <Text sx={{ fontSize: 14, color: '#16a34a', mt: 8 }}>{info_message}</Text>
              ) : null}

              {/* Signup Button */}
              <Pressable
                onPress={handleSignup}
                sx={{
                  bg: '#008CFC',
                  borderRadius: 10,
                  py: 14,
                  alignItems: 'center',
                  mt: 16,
                }}
              >
                <Text
                  sx={{
                    fontSize: 18,
                    fontFamily: 'Poppins-Bold',
                    color: '#fff',
                    lineHeight: 22,
                  }}
                >
                  Sign Up
                </Text>
              </Pressable>

              {/* Already have account */}
              <View
                sx={{
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                  mt: 8,
                  mb: 30,
                }}
              >
                <Text sx={{ fontSize: 14, color: '#000', fontFamily: 'Poppins-Regular' }}>
                  Already have an account?{' '}
                </Text>
                <Pressable onPress={() => router.push('../login/login')}>
                  <Text
                    sx={{
                      fontSize: 14,
                      fontFamily: 'Poppins-Bold',
                      color: '#008CFC',
                      textDecorationLine: 'underline',
                    }}
                  >
                    Login
                  </Text>
                </Pressable>
              </View>
            </View>
          </MotiView>
        </ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingView>

    <VerificationModal
      showLoading={false}
      showOtpModal={otpOpen}
      otpCode={otpCode}
      setOtpCode={setOtpCode}
      serverOtp={''}
      otpInfo={otpInfo || 'Enter the 6-digit code (simulated).'}
      otpError={otpError}
      canResend={true}
      canResendAt={0}
      onVerified={handleVerify}
      onResend={handleResend}
    />

    {/* Privacy Policy Modal */}
    <PrivacyPolicyModal
      visible={privacyModalOpen}
      onCancel={() => setPrivacyModalOpen(false)}
      onAgree={() => {
        setAcceptedPrivacy(true)
        setPrivacyModalOpen(false)
      }}
    />

    <AgreementsModal
      visible={agreementsModalOpen}
      onCancel={() => setAgreementsModalOpen(false)}
      onAgree={() => {
        setAcceptedAgreements(true)
        setAgreementsModalOpen(false)
      }}
    />
  </ImageBackground>
  )
}

const inputStyle = {
  backgroundColor: '#ffffffcc',
  borderRadius: 10,
  paddingHorizontal: 16,
  paddingVertical: 14,
  fontSize: 16,
  color: '#000',
}
