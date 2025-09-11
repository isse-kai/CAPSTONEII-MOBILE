// app/signup/signup.tsx
import { Image, Pressable, ScrollView, Text, TextInput, View } from 'dripsy'
import { useFonts } from 'expo-font'
import { useRouter } from 'expo-router'
import { useEffect, useRef, useState } from 'react'
import { Alert, Animated, KeyboardAvoidingView, Platform, SafeAreaView, StatusBar } from 'react-native'

export default function SignUp() {
  const router = useRouter()
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showPw, setShowPw] = useState(false)
  const [showPw2, setShowPw2] = useState(false)

  const fadeAnim = useRef(new Animated.Value(0)).current
  const slideAnim = useRef(new Animated.Value(50)).current

  const [fontsLoaded] = useFonts({
    'Poppins-Regular': require('../../assets/fonts/Poppins/Poppins-Regular.ttf'),
    'Poppins-Medium': require('../../assets/fonts/Poppins/Poppins-Medium.ttf'),
    'Poppins-SemiBold': require('../../assets/fonts/Poppins/Poppins-SemiBold.ttf'),
    'Poppins-Bold': require('../../assets/fonts/Poppins/Poppins-Bold.ttf'),
    'Poppins-ExtraBold': require('../../assets/fonts/Poppins/Poppins-ExtraBold.ttf'),
  })

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 800, useNativeDriver: true })
    ]).start()
  }, [fadeAnim, slideAnim])

  const goLogin = () => router.replace('/signup/signup')
  const emailOk = (e: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)
  const pwOk = (p: string) => p.length >= 6

  const isFormValid =
    fullName.trim().length > 1 &&
    emailOk(email) &&
    pwOk(password) &&
    password === confirmPassword

  const handleSignUp = () => {
    if (!isFormValid) {
      Alert.alert('Check your details', 'Please fill up all fields correctly.')
      return
    }
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
      Alert.alert('Success', `Account created for ${fullName}`)
      router.replace('/login/login')
    }, 1100)
  }

  if (!fontsLoaded) return null

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f8f9fa' }}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8f9fa" />
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View sx={{ position: 'absolute', left: 16, top: Platform.OS === 'ios' ? 8 : 8, zIndex: 20 }}>
          <Pressable
            onPress={goLogin}
            accessibilityRole="button"
            accessibilityLabel="Go to login"
            sx={{ width: 44, height: 44, borderRadius: 22, backgroundColor: '#f1f5f9', justifyContent: 'center', alignItems: 'center' }}
            style={({ pressed }) => [{ opacity: pressed ? 0.8 : 1 }]}
          >
            <Text sx={{ fontSize: 18, color: '#001a33' }}>←</Text>
          </Pressable>
        </View>

        <Animated.View style={{ flex: 1, opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
          <ScrollView
            contentContainerStyle={{ flexGrow: 1 }}
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode={Platform.OS === 'ios' ? 'interactive' : 'on-drag'}
            showsVerticalScrollIndicator={false}
          >
            <View sx={{ flex: 1, px: 'lg', mx: 'md', minHeight: '100%' }}>
              <View sx={{ alignItems: 'center', pt: 'xl', pb: 'sm' }}>
                <Image source={require('../../assets/jdklogo.png')} style={{ width: 85, height: 85 }} resizeMode="contain" />
              </View>

              <View sx={{ alignItems: 'center', mb: 'lg' }}>
                <Text sx={{ fontSize: 24, fontFamily: 'Poppins-ExtraBold', color: '#001a33', mb: 'xs', textAlign: 'center' }}>
                  Create your account
                </Text>
                <Text sx={{ fontSize: 14, fontFamily: 'Poppins-Regular', color: '#4e6075', textAlign: 'center', lineHeight: 20 }}>
                  Sign up to start using JDK HOMECARE
                </Text>
              </View>

              <View sx={{ borderRadius: 14, p: 'lg', mb: 'lg' }}>
                <View sx={{ mb: 'md' }}>
                  <Text sx={{ fontSize: 13, fontFamily: 'Poppins-SemiBold', color: '#001a33', mb: 'xs' }}>Full Name</Text>
                  <TextInput
                    placeholder="Enter your full name"
                    value={fullName}
                    onChangeText={setFullName}
                    style={inputStyle(fullName)}
                    placeholderTextColor="#9aa4b2"
                    autoComplete="name"
                    blurOnSubmit={false}
                    returnKeyType="next"
                  />
                </View>

                <View sx={{ mb: 'md' }}>
                  <Text sx={{ fontSize: 13, fontFamily: 'Poppins-SemiBold', color: '#001a33', mb: 'xs' }}>Email Address</Text>
                  <TextInput
                    placeholder="your@email.com"
                    value={email}
                    onChangeText={setEmail}
                    style={inputStyle(email, emailOk(email))}
                    placeholderTextColor="#9aa4b2"
                    autoComplete="email"
                    keyboardType="email-address"
                    blurOnSubmit={false}
                    returnKeyType="next"
                  />
                  {!!email && !emailOk(email) && (
                    <Text sx={{ fontSize: 12, fontFamily: 'Poppins-Regular', color: '#dc3545', mt: 'xs' }}>
                      Please enter a valid email.
                    </Text>
                  )}
                </View>

                <View sx={{ mb: 'md' }}>
                  <Text sx={{ fontSize: 13, fontFamily: 'Poppins-SemiBold', color: '#001a33', mb: 'xs' }}>Password</Text>
                  <View sx={{ position: 'relative' }}>
                    <TextInput
                      placeholder="Create a password (min 6 chars)"
                      value={password}
                      onChangeText={setPassword}
                      secureTextEntry={!showPw}
                      style={inputStyle(password, pwOk(password))}
                      placeholderTextColor="#9aa4b2"
                      autoComplete="password-new"
                      blurOnSubmit={false}
                      returnKeyType="next"
                    />
                    <Pressable onPress={() => setShowPw(s => !s)} sx={{ position: 'absolute', right: 12, top: 10, padding: 6, borderRadius: 8 }}>
                      <Text sx={{ color: '#0685f4', fontSize: 12 }}>{showPw ? 'Hide' : 'Show'}</Text>
                    </Pressable>
                  </View>
                  {!!password && !pwOk(password) && (
                    <Text sx={{ fontSize: 12, fontFamily: 'Poppins-Regular', color: '#dc3545', mt: 'xs' }}>
                      Use at least 6 characters.
                    </Text>
                  )}
                </View>

                <View sx={{ mb: 'lg' }}>
                  <Text sx={{ fontSize: 13, fontFamily: 'Poppins-SemiBold', color: '#001a33', mb: 'xs' }}>Confirm Password</Text>
                  <View sx={{ position: 'relative' }}>
                    <TextInput
                      placeholder="Confirm your password"
                      value={confirmPassword}
                      onChangeText={setConfirmPassword}
                      secureTextEntry={!showPw2}
                      style={inputStyle(confirmPassword, confirmPassword.length > 0 && confirmPassword === password)}
                      placeholderTextColor="#9aa4b2"
                      autoComplete="password-new"
                      blurOnSubmit={false}
                      returnKeyType="done"
                    />
                    <Pressable onPress={() => setShowPw2(s => !s)} sx={{ position: 'absolute', right: 12, top: 10, padding: 6, borderRadius: 8 }}>
                      <Text sx={{ color: '#0685f4', fontSize: 12 }}>{showPw2 ? 'Hide' : 'Show'}</Text>
                    </Pressable>
                  </View>
                  {!!confirmPassword && (
                    <Text
                      sx={{
                        fontSize: 12,
                        fontFamily: 'Poppins-Regular',
                        color: confirmPassword === password ? '#28a745' : '#dc3545',
                        mt: 'xs'
                      }}
                    >
                      {confirmPassword === password ? '✓ Passwords match' : '✗ Passwords do not match'}
                    </Text>
                  )}
                </View>

                <Pressable
                  onPress={handleSignUp}
                  disabled={!isFormValid || isLoading}
                  sx={{
                    height: 54,
                    backgroundColor: !isFormValid ? '#e4e7ec' : isLoading ? '#9aa4b2' : '#0685f4',
                    borderRadius: 12,
                    alignItems: 'center',
                    justifyContent: 'center',
                    mb: 'md'
                  }}
                  style={({ pressed }) => [{ opacity: pressed && isFormValid && !isLoading ? 0.9 : 1, transform: [{ scale: pressed && isFormValid && !isLoading ? 0.98 : 1 }] }]}
                >
                  <Text sx={{ fontSize: 15, fontFamily: 'Poppins-SemiBold', color: !isFormValid ? '#9aa4b2' : '#ffffff' }}>
                    {isLoading ? 'Creating Account...' : 'Create Account'}
                  </Text>
                </Pressable>

                <View sx={{ alignItems: 'center' }}>
                  <Text sx={{ fontSize: 13, color: '#4e6075', fontFamily: 'Poppins-Regular', mb: 'xs' }}>
                    Already have an account?
                  </Text>
                  <Pressable onPress={goLogin} style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}>
                    <Text sx={{ fontSize: 15, color: '#0685f4', fontFamily: 'Poppins-SemiBold' }}>
                      Sign In
                    </Text>
                  </Pressable>
                </View>
              </View>

              <View sx={{ pb: 'lg', alignItems: 'center' }}>
                <Text sx={{ fontSize: 12, color: '#9aa4b2', textAlign: 'center', lineHeight: 18, fontFamily: 'Poppins-Regular' }}>
                  By creating an account, you agree to our{'\n'}
                  <Text sx={{ color: '#0685f4' }}>Terms of Service</Text> and <Text sx={{ color: '#0685f4' }}>Privacy Policy</Text>
                </Text>
              </View>
            </View>
          </ScrollView>
        </Animated.View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

const inputStyle = (value: string, ok?: boolean) => ({
  height: 46,
  paddingHorizontal: 15,
  borderRadius: 12,
  backgroundColor: 'transparent',
  fontSize: 14,
  borderWidth: 2,
  borderColor: value ? (ok === undefined ? '#0685f4' : ok ? '#28a745' : '#dc3545') : '#e4e7ec',
  color: '#001a33',
  fontFamily: 'Poppins-Regular',
} as const)
