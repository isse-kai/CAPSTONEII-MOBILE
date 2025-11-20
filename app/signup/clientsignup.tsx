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
import { resendSignupEmail, signupClient, verifyEmailOtp } from '../../supabase/auth'
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
  const [is_email_opt_in, setIsEmailOptIn] = useState(false)
  const [is_agreed_to_terms, setIsAgreedToTerms] = useState(false)

  const [error_message, setErrorMessage] = useState('')
  const [info_message, setInfoMessage] = useState('')

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  const [loading, setLoading] = useState(false)

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

  const handleSignup = async () => {
  if (!first_name || !last_name || !sex || !email_address || !password || !confirm_password) {
    setErrorMessage('Please fill out all required fields.')
    return
  }

  if (password !== confirm_password) {
    setErrorMessage('Passwords do not match.')
    return
  }

  if (password.trim().length < 12) {
    setErrorMessage('Password must be at least 12 characters long.')
    return
  }

  if (!is_agreed_to_terms) {
    setErrorMessage('You must agree to the terms and conditions.')
    return
  }

  setLoading(true)
  setErrorMessage('')
  setInfoMessage('')

  try {
    await signupClient({
      email: email_address,
      first_name,
      last_name,
      sex,
      is_email_opt_in,
    })

    setInfoMessage('We sent a 6-digit verification code to your email. Enter it below to continue.')
    setOtpInfo('Check your Gmail inbox for the code.')
    setOtpOpen(true)
  } catch (err: any) {
    setErrorMessage(err.message)
  } finally {
    setLoading(false)
  }
}

  const handleResend = async () => {
    try {
      await resendSignupEmail(email_address)
      setInfoMessage('Verification email resent. Please check your inbox.')
    } catch (err: any) {
      setErrorMessage(err.message)
    }
  }

  const handleVerify = async () => {
    try {
      await verifyEmailOtp(email_address, otpCode)
      setOtpOpen(false)
      router.push('/clientpage/home')
    } catch (err: any) {
      setOtpError(err.message)
    }
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

              {/* Title */}
              <View sx={{ alignItems: 'center', mb: 4 }}>
                <Text sx={{ fontSize: 20, fontFamily: 'Poppins-ExtraBold', color: '#000000' }}>
                  Sign Up as <Text sx={{ fontSize: 20, fontFamily: 'Poppins-ExtraBold', color: '#008CFC' }}>Client</Text>
                </Text>
              </View>

              {/* First + Last Name */}
              <View style={{ flexDirection: 'row', gap: 10 }}>
                <View style={{ flex: 1 }}>
                  <Text sx={{ fontSize: 16, color: '#000', mb: 6 }}>First Name</Text>
                  <TextInput
                    value={first_name}
                    onChangeText={setFirstName}
                    placeholder="Enter first name"
                    placeholderTextColor="#ccc"
                    style={inputStyle}
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <Text sx={{ fontSize: 16, color: '#000', mb: 6 }}>Last Name</Text>
                  <TextInput
                    value={last_name}
                    onChangeText={setLastName}
                    placeholder="Enter last name"
                    placeholderTextColor="#ccc"
                    style={inputStyle}
                  />
                </View>
              </View>

              {/* Sex Dropdown */}
              <View style={{ position: 'relative' }}>
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
                    {sex || 'Select Sex'}
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
              <View>
                <Text sx={{ fontSize: 16, color: '#000', mb: 6 }}>Email Address</Text>
                <TextInput
                  value={email_address}
                  onChangeText={setEmail}
                  placeholder="Enter email"
                  placeholderTextColor="#ccc"
                  style={inputStyle}
                />
              </View>

              {/* Password */}
              <View style={{ position: 'relative' }}>
                <Text sx={{ fontSize: 16, color: '#000', mb: 6 }}>Password</Text>
                <TextInput
                  value={password}
                  onChangeText={setPassword}
                  placeholder="Enter password"
                  placeholderTextColor="#ccc"
                  secureTextEntry
                  style={inputStyle}
                />
                <Pressable
                  onPress={() => setShowPassword(prev => !prev)}
                  style={{ position: 'absolute', right: 16, top: 42 }}
                >
                  <Ionicons name={showPassword ? 'eye-off' : 'eye'} size={20} color="#333" />
                </Pressable>
              </View>

              {/* Confirm Password */}
              <View style={{ position: 'relative' }}>
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

              {/* Terms and Email Opt-In */}
              <Pressable
                onPress={() => {
                  const next = !(is_email_opt_in && is_agreed_to_terms)
                  setIsEmailOptIn(next)
                  setIsAgreedToTerms(next)
                }}
                sx={{ flexDirection: 'row', alignItems: 'center', mt: 12 }}
              >
                <View
                  sx={{
                    width: 18,
                    height: 18,
                    borderWidth: 1,
                    borderColor: '#000',
                    borderRadius: 4,
                    bg: is_email_opt_in && is_agreed_to_terms ? '#008CFC' : 'transparent',
                    mr: 10,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {is_email_opt_in && is_agreed_to_terms && (
                    <Text sx={{ color: '#fff', fontSize: 12 }}>✓</Text>
                  )}
                </View>
                <Text
                  sx={{
                    fontSize: 12,
                    fontFamily: 'Poppins-Regular',
                    color: '#000',
                  }}
                >
                  I agree to JDK HOMECARE’s Terms of Service and Privacy Policy
                </Text>
              </Pressable>

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
                disabled={loading}
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
                  {loading ? 'Sending verification email…' : 'Sign Up'}
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
            </MotiView>
          </ScrollView>
        </SafeAreaView>
      </KeyboardAvoidingView>

      <VerificationModal
        showLoading={loading}
        showOtpModal={otpOpen}
        otpCode={otpCode}
        setOtpCode={setOtpCode}
        serverOtp={''}
        otpInfo={otpInfo || 'Enter the 6-digit code sent to your email.'}
        otpError={otpError}
        canResend={true}
        canResendAt={0}
        onVerified={handleVerify}
        onResend={handleResend}
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
