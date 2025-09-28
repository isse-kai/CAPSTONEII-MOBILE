import { Pressable, Text, View } from 'dripsy'
import { useFonts } from 'expo-font'
import { useRouter } from 'expo-router'
import { MotiView } from 'moti'
import React, { useState } from 'react'
import {
    Alert,
    Dimensions,
    Image,
    ImageBackground,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    TextInput
} from 'react-native'
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context'
import { signupWorker } from '../../supabase/auth'

export default function WorkerSignup() {
  const router = useRouter()
  const insets = useSafeAreaInsets()
  const screenHeight = Dimensions.get('window').height

  const [first_name, setFirstName] = useState('')
  const [last_name, setLastName] = useState('')
  const [sex, setSex] = useState('')
  const [email_address, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm_password, setConfirmPassword] = useState('')
  const [is_email_opt_in, setIsEmailOptIn] = useState(false)
  const [is_agreed_to_terms, setIsAgreedToTerms] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const [fontsLoaded] = useFonts({
    'Poppins-Regular': require('../../assets/fonts/Poppins/Poppins-Regular.ttf'),
    'Poppins-Bold': require('../../assets/fonts/Poppins/Poppins-Bold.ttf'),
    'Poppins-ExtraBold': require('../../assets/fonts/Poppins/Poppins-ExtraBold.ttf'),
  })

  if (!fontsLoaded) return null

  const handleSignup = async () => {
    if (
      !first_name ||
      !last_name ||
      !sex ||
      !email_address ||
      !password ||
      !confirm_password
    ) {
      Alert.alert('Missing Fields', 'Please fill out all required fields.')
      return
    }

    if (password !== confirm_password) {
      Alert.alert('Password Mismatch', 'Passwords do not match.')
      return
    }

    if (!is_agreed_to_terms) {
      Alert.alert('Terms Required', 'You must agree to the terms and conditions.')
      return
    }

    setIsLoading(true)
    try {
      await signupWorker({
        email: email_address,
        password,
        first_name,
        last_name,
        sex,
        is_email_opt_in,
      })

      router.push('./workerpage/home')
    } catch (err: any) {
      Alert.alert('Signup Failed', err.message)
    } finally {
      setIsLoading(false)
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
            paddingTop: insets.top + 12,
            paddingBottom: insets.bottom + 12,
          }}
        >
          <ScrollView
            contentContainerStyle={{
              flexGrow: 1,
              minHeight: screenHeight - insets.top - insets.bottom - 24,
              paddingHorizontal: 16,
              justifyContent: 'center',
            }}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <MotiView
              from={{ opacity: 0, translateY: 20 }}
              animate={{ opacity: 1, translateY: 0 }}
              transition={{ type: 'timing', duration: 500 }}
              style={{ gap: 20 }}
            >
              {/* Logo */}
              <View sx={{ alignItems: 'center', mt: -24, mb: -8 }}>
                <Image
                  source={require('../../assets/jdklogo.png')}
                  style={{ width: 120, height: 120, resizeMode: 'contain' }}
                />
              </View>

              {/* Title */}
              <View sx={{ alignItems: 'center', mt: -10, mb: 4 }}>
                <Text
                  sx={{
                    fontSize: 22,
                    fontFamily: 'Poppins-ExtraBold',
                    color: '#000000',
                  }}
                >
                  SIGN UP
                </Text>
              </View>

              {/* Input Fields */}
              {[
                { label: 'First Name', value: first_name, setter: setFirstName },
                { label: 'Last Name', value: last_name, setter: setLastName },
                { label: 'Sex', value: sex, setter: setSex },
                { label: 'Email Address', value: email_address, setter: setEmail },
                { label: 'Password', value: password, setter: setPassword, secure: true },
                {
                  label: 'Confirm Password',
                  value: confirm_password,
                  setter: setConfirmPassword,
                  secure: true,
                },
              ].map(({ label, value, setter, secure }) => (
                <View key={label}>
                  <Text sx={{ fontSize: 16, color: '#000', mb: 6 }}>{label}</Text>
                  <TextInput
                    value={value}
                    onChangeText={setter}
                    placeholder={`Enter ${label.toLowerCase()}`}
                    placeholderTextColor="#ccc"
                    secureTextEntry={secure}
                    style={{
                      backgroundColor: '#ffffffcc',
                      borderRadius: 10,
                      paddingHorizontal: 16,
                      paddingVertical: 14,
                      fontSize: 16,
                    }}
                  />
                </View>
              ))}

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
                    fontSize: 14,
                    fontFamily: 'Poppins-Regular',
                    color: is_email_opt_in && is_agreed_to_terms ? '#008CFC' : '#000',
                    textDecorationLine: is_email_opt_in && is_agreed_to_terms ? 'underline' : 'none',
                    }}
                >
                    I agree to the Terms and Conditions and subscribe to email updates
                </Text>
                </Pressable>

              {/* Signup Button */}
              <Pressable
                onPress={handleSignup}
                disabled={isLoading}
                sx={{
                  bg: '#008CFC',
                  borderRadius: 10,
                  py: 14,
                  alignItems: 'center',
                }}
              >
                <Text
                  sx={{
                    fontSize: 18,
                    fontFamily: 'Poppins-Bold',
                    color: '#fff',
                  }}
                >
                  {isLoading ? 'Signing up...' : 'Sign Up'}
                </Text>
              </Pressable>

              {/* Already have account */}
              <View
                sx={{
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                  mt: 8,
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
    </ImageBackground>
  )
}
