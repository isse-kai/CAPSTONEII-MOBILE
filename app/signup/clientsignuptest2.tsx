import {
    Image,
    Pressable,
    ScrollView,
    Text,
    TextInput,
    View,
} from 'dripsy'
import { useFonts } from 'expo-font'
import { useRouter } from 'expo-router'
import { useEffect, useRef, useState } from 'react'
import {
    Alert,
    Animated,
    KeyboardAvoidingView,
    Platform,
    StatusBar,
    useWindowDimensions,
} from 'react-native'
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context'
import { supabase } from '../../supabase/client'

export default function ClientSignUp() {
  const router = useRouter()
  const insets = useSafeAreaInsets()
  const { width, height } = useWindowDimensions()

  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const fadeAnim = useRef(new Animated.Value(0)).current
  const slideAnim = useRef(new Animated.Value(20)).current

  const [fontsLoaded] = useFonts({
    'Poppins-Regular': require('../../assets/fonts/Poppins/Poppins-Regular.ttf'),
    'Poppins-Medium': require('../../assets/fonts/Poppins/Poppins-Medium.ttf'),
    'Poppins-SemiBold': require('../../assets/fonts/Poppins/Poppins-SemiBold.ttf'),
    'Poppins-Bold': require('../../assets/fonts/Poppins/Poppins-Bold.ttf'),
    'Poppins-ExtraBold': require('../../assets/fonts/Poppins/Poppins-ExtraBold.ttf'),
  })

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start()
  }, [])

  const handleSignUp = async () => {
    if (!fullName || !email || !password || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields')
      return
    }
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match')
      return
    }
    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters')
      return
    }

    setIsLoading(true)

    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
      })
      if (authError) throw authError

      const auth_uid = authData.user?.id
      if (!auth_uid) throw new Error('No user ID returned from Supabase')

      const { error: profileError } = await supabase.from('user_client').insert([
        {
          auth_uid,
          first_name: fullName,
          email_address: email,
          is_agreed_to_terms: true,
          agreed_at: new Date().toISOString(),
        },
      ])
      if (profileError) throw profileError

      Alert.alert('Success', `Client account created for ${fullName}`)
      router.push('/login/login')
    } catch (err: any) {
      Alert.alert('Signup Failed', err.message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSignIn = () => router.push('/login/login')

  const isFormValid =
    fullName && email && password && confirmPassword && password === confirmPassword

  if (!fontsLoaded) return null

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: '#f8f9fa',
        paddingTop: insets.top,
        paddingBottom: insets.bottom,
      }}
    >
      <StatusBar barStyle="dark-content" backgroundColor="#f8f9fa" />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <Animated.View
          style={{
            flex: 1,
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          }}
        >
          <ScrollView
            contentContainerStyle={{
              flexGrow: 1,
              justifyContent: 'center',
              paddingHorizontal: width * 0.06,
              paddingBottom: height * 0.1,
            }}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {/* Logo + Back Button */}
            <View sx={{ alignItems: 'center', mb: 'lg', position: 'relative' }}>
              <View sx={{ position: 'absolute', left: 0, top: 0 }}>
                <Pressable
                  onPress={() => router.back()}
                  style={({ pressed }) => ({
                    backgroundColor: pressed ? '#e0e0e0' : '#f3f4f6',
                    padding: 10,
                    borderRadius: 20,
                    elevation: 2,
                    height: 40,
                    width: 40,
                    justifyContent: 'center',
                    alignItems: 'center',
                  })}
                >
                  <Text
                    sx={{
                      fontSize: 18,
                      fontFamily: 'Poppins-Bold',
                      color: '#001a33',
                      textAlign: 'center',
                    }}
                  >
                    ←
                  </Text>
                </Pressable>
              </View>
              <Image
                source={require('../../assets/jdklogo.png')}
                style={{ width: 80, height: 80, marginTop: 12 }}
                resizeMode="contain"
              />
            </View>

            {/* Title */}
            <View sx={{ alignItems: 'center', mb: 'lg' }}>
              <Text
                sx={{
                  fontSize: 22,
                  fontFamily: 'Poppins-ExtraBold',
                  color: '#001a33',
                  mb: 'xs',
                  textAlign: 'center',
                }}
              >
                Join as Client
              </Text>
              <Text
                sx={{
                  fontSize: 14,
                  fontFamily: 'Poppins-Regular',
                  color: '#4e6075',
                  textAlign: 'center',
                  lineHeight: 20,
                }}
              >
                Create your account and start booking home services
              </Text>
            </View>

            {/* Form Fields */}
            <View sx={{ mb: 'lg' }}>
              {[
                { label: 'Full Name', value: fullName, setter: setFullName },
                { label: 'Email Address', value: email, setter: setEmail },
                { label: 'Password', value: password, setter: setPassword, secure: true },
                { label: 'Confirm Password', value: confirmPassword, setter: setConfirmPassword, secure: true },
              ].map((field, i) => (
                <View key={i} sx={{ mb: 'md' }}>
                  <Text sx={{ fontSize: 13, fontFamily: 'Poppins-SemiBold', color: '#001a33', mb: 'xs' }}>
                    {field.label}
                  </Text>
                  <TextInput
                    placeholder={`Enter your ${field.label.toLowerCase()}`}
                    value={field.value}
                    onChangeText={field.setter}
                    secureTextEntry={field.secure}
                    sx={{
                      height: 46,
                      px: 'md',
                      borderRadius: 12,
                      borderWidth: 2,
                      borderColor:
                        field.label === 'Confirm Password'
                          ? confirmPassword && password === confirmPassword
                            ? '#28a745'
                            : confirmPassword && password !== confirmPassword
                            ? '#dc3545'
                            : '#e4e7ec'
                          : field.value
                          ? '#0685f4'
                          : '#e4e7ec',
                      fontSize: 14,
                      fontFamily: 'Poppins-Regular',
                      color: '#001a33',
                      bg: 'transparent',
                    }}
                    placeholderTextColor="#9aa4b2"
                  />
                  {field.label === 'Confirm Password' && confirmPassword && (
                    <Text
                      sx={{
                        fontSize: 12,
                        fontFamily: 'Poppins-Regular',
                        color: password === confirmPassword ? '#28a745' : '#dc3545',
                        mt: 'xs',
                      }}
                    >
                      {password === confirmPassword
                        ? '✓ Passwords match'
                        : '✗ Passwords do not match'}
                    </Text>
                  )}
                </View>
              ))}
            </View>

            {/* Sign Up Button */}
            <Pressable
              onPress={handleSignUp}
              disabled={!isFormValid || isLoading}
              style={({ pressed }) => ({
                backgroundColor: !isFormValid
                  ? '#e4e7ec'
                  : isLoading
                  ? '#9aa4b2'
                  : pressed
                  ? '#0571d3'
                  : '#0685f4',
                paddingVertical: 16,
                borderRadius: 12,
                alignItems: 'center',
                justifyContent: 'center',
                opacity: pressed && isFormValid && !isLoading ? 0.9 : 1,
              })}
            >
              <Text
                sx={{
                  fontSize: 15,
                  fontFamily: 'Poppins-SemiBold',
                  color: !isFormValid ? '#9aa4b2' : '#ffffff',
                }}
              >
                {isLoading ? 'Creating Account...' : 'Create Client Account'}
              </Text>
            </Pressable>

            {/* Sign In Link */}
            <View sx={{ alignItems: 'center', mt: 'md' }}>
              <Text
                sx={{
                  fontSize: 13,
                  color: '#4e6075',
                  fontFamily: 'Poppins-Regular',
                }}
              >
                Already have an account?{' '}
                <Text
                  onPress={handleSignIn}
                  sx={{
                    fontSize: 13,
                    fontFamily: 'Poppins-SemiBold',
                    color: '#0685f4',
                  }}
                >
                  Sign in
                </Text>
              </Text>
            </View>

            {/* Footer */}
            <View sx={{ alignItems: 'center', mt: 'lg' }}>
              <Text
                sx={{
                  fontSize: 12,
                  fontFamily: 'Poppins-Regular',
                  color: '#9aa4b2',
                  textAlign: 'center',
                  lineHeight: 18,
                }}
              >
                By signing up, you agree to our{' '}
                <Text
                  sx={{
                    fontSize: 12,
                    fontFamily: 'Poppins-SemiBold',
                    color: '#0685f4',
                  }}
                >
                  Terms of Service
                </Text>{' '}
                and{' '}
                <Text
                  sx={{
                    fontSize: 12,
                    fontFamily: 'Poppins-SemiBold',
                    color: '#0685f4',
                  }}
                >
                  Privacy Policy
                </Text>
                .
              </Text>
            </View>
          </ScrollView>
        </Animated.View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}
