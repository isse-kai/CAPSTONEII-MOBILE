import { Picker } from '@react-native-picker/picker'
import { Pressable, Text, TextInput, View } from 'dripsy'
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

  if (!fontsLoaded) return null

  return (
    <ImageBackground
      source={require('../../assets/login.jpg')} // ✅ Replace with your actual image
      style={{ flex: 1 }}
      resizeMode="cover"
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <View
            sx={{
              flex: 1,
              justifyContent: 'center',
              px: 'lg',
              py: 'lg',
              bg: 'transparent',
            }}
          >
            {/* Google Login */}
            <Pressable onPress={() => router.push('/signup/clientsignup')}>
              {({ hovered }) => (
                <View
                  sx={{
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                    bg: hovered ? '#008CFC' : 'transparent',
                    py: 10,
                    borderRadius: 8,
                    mb: 'md',
                    borderWidth: 1,
                    borderColor: '#008CFC',
                  }}
                >
                  <Image
                    source={require('../../assets/google.png')}
                    style={{
                      width: 24,
                      height: 24,
                      marginRight: 8,
                    }}
                    resizeMode="contain"
                  />
                  <Text
                    sx={{
                      textAlign: 'center',
                      color: hovered ? 'background' : '#008CFC',
                      fontWeight: 'bold',
                      fontSize: 20,
                      fontFamily: 'Poppins-ExtraBold',
                    }}
                  >
                    Continue with Google
                  </Text>
                </View>
              )}
            </Pressable>

            {/* First & Last Name */}
            <Text sx={{ fontFamily: 'Poppins-Bold', mb: 4 }}>Name</Text>
            <View sx={{ flexDirection: 'row', gap: 12, mb: 'md' }}>
              <TextInput
                placeholder="First Name"
                value={form.firstName}
                onChangeText={text => setForm({ ...form, firstName: text })}
                sx={{
                  flex: 1,
                  borderWidth: 1,
                  borderColor: '#ccc',
                  borderRadius: 8,
                  px: 'md',
                  py: 10,
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
                  px: 'md',
                  py: 10,
                  fontFamily: 'Poppins-Regular',
                }}
              />
            </View>

            {/* Sex */}
            <Text sx={{ fontFamily: 'Poppins-Bold', mb: 4 }}>Sex</Text>
            <View
              sx={{
                borderWidth: 1,
                borderColor: '#ccc',
                borderRadius: 8,
                mb: 'md',
                overflow: 'hidden',
              }}
            >
              <Picker
                selectedValue={form.sex}
                onValueChange={value => setForm({ ...form, sex: value })}
                style={{
                  height: 50,
                  fontFamily: 'Poppins-Regular',
                }}
              >
                <Picker.Item label="Select Sex" value="" />
                <Picker.Item label="Male" value="male" />
                <Picker.Item label="Female" value="female" />
              </Picker>
            </View>

            {/* Email */}
            <Text sx={{ fontFamily: 'Poppins-Bold', mb: 4 }}>Email Address</Text>
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
                px: 'md',
                py: 10,
                mb: 'md',
                fontFamily: 'Poppins-Regular',
              }}
            />

            {/* Password */}
            <Text sx={{ fontFamily: 'Poppins-Bold', mb: 4 }}>Password</Text>
            <TextInput
              placeholder="Password (8 or more characters)"
              value={form.password}
              onChangeText={text => setForm({ ...form, password: text })}
              secureTextEntry
              sx={{
                borderWidth: 1,
                borderColor: '#ccc',
                borderRadius: 8,
                px: 'md',
                py: 10,
                mb: 'md',
                fontFamily: 'Poppins-Regular',
              }}
            />

            {/* Confirm Password */}
            <Text sx={{ fontFamily: 'Poppins-Bold', mb: 4 }}>Confirm Password</Text>
            <TextInput
              placeholder="Confirm Password"
              value={form.confirmPassword}
              onChangeText={text => setForm({ ...form, confirmPassword: text })}
              secureTextEntry
              sx={{
                borderWidth: 1,
                borderColor: '#ccc',
                borderRadius: 8,
                px: 'md',
                py: 10,
                mb: 'md',
                fontFamily: 'Poppins-Regular',
              }}
            />

            {/* Terms and Conditions */}
            <View sx={{ flexDirection: 'row', alignItems: 'center', mb: 'lg' }}>
              <Checkbox
                value={form.agreedToTerms}
                onValueChange={value => setForm({ ...form, agreedToTerms: value })}
                color={form.agreedToTerms ? '#008CFC' : undefined}
              />
              <Text
                sx={{
                  ml: 'sm',
                  fontSize: 14,
                  fontFamily: 'Poppins-Regular',
                  color: 'text',
                  flex: 1,
                }}
              >
                I agree to JDK HOMECARE’s Terms of Service and Privacy Policy.
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
                py: 12,
                borderRadius: 8,
                alignItems: 'center',
                mb: 'md',
              }}
              disabled={!isFormValid}
            >
              <Text
                sx={{
                  fontSize: 18,
                  fontFamily: 'Poppins-Bold',
                  color: '#fff',
                }}
              >
                Create My Account
              </Text>
            </Pressable>

            {/* Apply as Worker Text Button */}
            <Pressable onPress={() => router.push('/signup/workersignup')}>
              <Text
                sx={{
                  fontSize: 14,
                  fontFamily: 'Poppins-Regular',
                  color: '#008CFC',
                  textDecorationLine: 'underline',
                  textAlign: 'center',
                }}
              >
                Apply as Worker
              </Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ImageBackground>
  )
}
