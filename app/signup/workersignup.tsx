import { Picker } from '@react-native-picker/picker'
import { Pressable, Text, TextInput, View, useResponsiveValue } from 'dripsy'
import Checkbox from 'expo-checkbox'
import { useFonts } from 'expo-font'
import { useRouter } from 'expo-router'
import { useState } from 'react'
import {
  Image,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native'

export default function WorkerSignup() {
  const router = useRouter()

  const [fontsLoaded] = useFonts({
    'Poppins-Regular': require('../../assets/fonts/Poppins/Poppins-Regular.ttf'),
    'Poppins-Bold': require('../../assets/fonts/Poppins/Poppins-Bold.ttf'),
    'Poppins-ExtraBold': require('../../assets/fonts/Poppins/Poppins-ExtraBold.ttf'),
  })

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    sex: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreedToTerms: false,
  })

  const isFormValid =
    form.firstName &&
    form.lastName &&
    form.sex &&
    form.email &&
    form.password.length >= 8 &&
    form.password === form.confirmPassword &&
    form.agreedToTerms

  const fontSizeLabel = useResponsiveValue([14, 16])
  const fontSizeInput = useResponsiveValue([13, 15])
  const fontSizeButton = useResponsiveValue([16, 18])
  const paddingY = useResponsiveValue([8, 10])
  const spacing = useResponsiveValue(['sm', 'md'])

  if (!fontsLoaded) return null

  return (
    <ImageBackground
      source={require('../../assets/login.jpg')}
      style={{ flex: 1 }}
      resizeMode="cover"
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
        >
          <View
            sx={{
              flexGrow: 1,
              justifyContent: 'center',
              px: spacing,
              py: spacing,
              bg: 'transparent',
            }}
          >
            {/* Logo */}
            <Image
              source={require('../../assets/jdklogo.png')}
              style={{
                width: 250,
                height: 250,
                alignSelf: 'center',
                marginBottom: -80,
                marginTop: -90,
              }}
              resizeMode="contain"
            />
            
            {/* Google Login */}
            <Pressable onPress={() => router.push('/signup/workersignup')}>
              {({ hovered }) => (
                <View
                  sx={{
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                    bg: hovered ? '#008CFC' : 'transparent',
                    py: paddingY,
                    borderRadius: 8,
                    mb: spacing,
                    borderWidth: 1,
                    borderColor: '#008CFC',
                  }}
                >
                  <Image
                    source={require('../../assets/google.png')}
                    style={{ width: 24, height: 24, marginRight: 8 }}
                    resizeMode="contain"
                  />
                  <Text
                    sx={{
                      textAlign: 'center',
                      color: hovered ? 'background' : '#008CFC',
                      fontWeight: 'bold',
                      fontSize: fontSizeButton,
                      fontFamily: 'Poppins-ExtraBold',
                    }}
                  >
                    Continue with Google
                  </Text>
                </View>
              )}
            </Pressable>

            {/* First & Last Name */}
            <Text sx={{ fontFamily: 'Poppins-Bold', fontSize: fontSizeLabel, mb: 4 }}>
              Name
            </Text>
            <View sx={{ flexDirection: 'row', gap: 12, mb: spacing }}>
              <TextInput
                placeholder="First Name"
                value={form.firstName}
                onChangeText={text => setForm({ ...form, firstName: text })}
                sx={{
                  flex: 1,
                  borderWidth: 1,
                  borderColor: '#ccc',
                  borderRadius: 8,
                  px: spacing,
                  py: paddingY,
                  fontSize: fontSizeInput,
                  fontFamily: 'Poppins-Regular',
                }}
              />
              <TextInput
                placeholder="Last Name"
                value={form.lastName}
                onChangeText={text => setForm({ ...form, lastName: text })}
                sx={{
                  flex: 1,
                  borderWidth: 1,
                  borderColor: '#ccc',
                  borderRadius: 8,
                  px: spacing,
                  py: paddingY,
                  fontSize: fontSizeInput,
                  fontFamily: 'Poppins-Regular',
                }}
              />
            </View>

            {/* Sex */}
            <Text sx={{ fontFamily: 'Poppins-Bold', fontSize: fontSizeLabel, mb: 4 }}>
              Sex
            </Text>
            <View
              sx={{
                borderWidth: 1,
                borderColor: '#ccc',
                borderRadius: 8,
                mb: spacing,
                overflow: 'hidden',
              }}
            >
              <Picker
                selectedValue={form.sex}
                onValueChange={value => setForm({ ...form, sex: value })}
                style={{ height: 50, fontSize: fontSizeInput }}
              >
                <Picker.Item label="Select Sex" value="" />
                <Picker.Item label="Male" value="male" />
                <Picker.Item label="Female" value="female" />
              </Picker>
            </View>

            {/* Email */}
            <Text sx={{ fontFamily: 'Poppins-Bold', fontSize: fontSizeLabel, mb: 4 }}>
              Email Address
            </Text>
            <TextInput
              placeholder="Email Address"
              value={form.email}
              onChangeText={text => setForm({ ...form, email: text })}
              keyboardType="email-address"
              autoCapitalize="none"
              sx={{
                borderWidth: 1,
                borderColor: '#ccc',
                borderRadius: 8,
                px: spacing,
                py: paddingY,
                mb: spacing,
                fontSize: fontSizeInput,
                fontFamily: 'Poppins-Regular',
              }}
            />

            {/* Password */}
            <Text sx={{ fontFamily: 'Poppins-Bold', fontSize: fontSizeLabel, mb: 4 }}>
              Password
            </Text>
            <TextInput
              placeholder="Password (8 or more characters)"
              value={form.password}
              onChangeText={text => setForm({ ...form, password: text })}
              secureTextEntry
              sx={{
                borderWidth: 1,
                borderColor: '#ccc',
                borderRadius: 8,
                px: spacing,
                py: paddingY,
                mb: spacing,
                fontSize: fontSizeInput,
                fontFamily: 'Poppins-Regular',
              }}
            />

            {/* Confirm Password */}
            <Text sx={{ fontFamily: 'Poppins-Bold', fontSize: fontSizeLabel, mb: 4 }}>
              Confirm Password
            </Text>
            <TextInput
              placeholder="Confirm Password"
              value={form.confirmPassword}
              onChangeText={text => setForm({ ...form, confirmPassword: text })}
              secureTextEntry
              sx={{
                borderWidth: 1,
                borderColor: '#ccc',
                borderRadius: 8,
                px: spacing,
                py: paddingY,
                mb: spacing,
                fontSize: fontSizeInput,
                fontFamily: 'Poppins-Regular',
              }}
            />

            {/* Terms and Conditions */}
            <View
              sx={{
                flexDirection: 'row',
                alignItems: 'center',
                mb: spacing,
                flexWrap: 'wrap',
              }}
            >
              <Checkbox
                value={form.agreedToTerms}
                onValueChange={value => setForm({ ...form, agreedToTerms: value })}
                color={form.agreedToTerms ? '#008CFC' : undefined}
                style={{ marginTop: 2 }}
              />
              <Text
                sx={{
                  ml: 'sm',
                  fontSize: fontSizeInput,
                  fontFamily: 'Poppins-Regular',
                  color: 'text',
                  flex: 1,
                  flexWrap: 'wrap',
                }}
              >
                I agree to JDK HOMECARE’s{' '}
                <Pressable onPress={() => router.push('/terms')}>
                  <Text
                    sx={{
                      fontSize: fontSizeInput,
                      fontFamily: 'Poppins-Regular',
                      color: '#008CFC',
                      textDecorationLine: 'underline',
                      mb: -8
                    }}
                  >
                    Terms of Service
                  </Text>
                </Pressable>{' '}
                and{' '}
                <Pressable onPress={() => router.push('/privacy')}>
                  <Text
                    sx={{
                      fontSize: fontSizeInput,
                      fontFamily: 'Poppins-Regular',
                      color: '#008CFC',
                      textDecorationLine: 'underline',
                      mb: -8
                    }}
                  >
                    Privacy Policy
                  </Text>
                </Pressable>
                .
              </Text>
            </View>

            {/* Create Account Button */}
            <Pressable
              onPress={() => {
                if (isFormValid) {
                  console.log('Create account with:', form)
                  // router.push('/worker/dashboard')
                }
              }}
              sx={{
                bg: isFormValid ? '#008CFC' : '#ccc',
                py: paddingY,
                borderRadius: 8,
                alignItems: 'center',
                mb: spacing,
              }}
              disabled={!isFormValid}
            >
              <Text
                sx={{
                  fontSize: fontSizeButton,
                  fontFamily: 'Poppins-Bold',
                  color: '#fff',
                }}
              >
                Create My Account
              </Text>
            </Pressable>

            {/* Login Prompt */}
            <View
              sx={{
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                mt: 'sm',
              }}
            >
              <Text
                sx={{
                  fontSize: fontSizeInput,
                  fontFamily: 'Poppins-Regular',
                  color: 'text',
                }}
              >
                Already have an account?{' '}
              </Text>
              <Pressable onPress={() => router.push('/login/login')}>
                <Text
                  sx={{
                    fontSize: fontSizeInput,
                    fontFamily: 'Poppins-Regular',
                    color: '#008CFC',
                    textDecorationLine: 'underline',
                  }}
                >
                  Login
                </Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ImageBackground>
  )
}