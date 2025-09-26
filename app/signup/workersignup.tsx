import { Picker } from '@react-native-picker/picker'
import { Pressable, Text, TextInput, View } from 'dripsy'
import { Checkbox } from 'expo-checkbox'
import { useFonts } from 'expo-font'
import { useRouter } from 'expo-router'
import { useState } from 'react'
import {
  Image,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
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
      source={require('../../assets/login.jpg')}
      style={{ flex: 1 }}
      resizeMode="cover"
    >
      <SafeAreaView style={{ flex: 1 }}>
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
                paddingHorizontal: 16,
                paddingVertical: 16,
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
                      paddingVertical: 10,
                      borderRadius: 8,
                      marginBottom: 16,
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
                        fontSize: 18,
                        fontFamily: 'Poppins-ExtraBold',
                      }}
                    >
                      Continue with Google
                    </Text>
                  </View>
                )}
              </Pressable>

              {/* Name */}
              <Text sx={{ fontFamily: 'Poppins-Bold', fontSize: 16, marginBottom: 4 }}>
                Name
              </Text>
              <View sx={{ flexDirection: 'row', gap: 12, marginBottom: 16 }}>
                <TextInput
                  placeholder="First Name"
                  value={form.firstName}
                  onChangeText={text => setForm({ ...form, firstName: text })}
                  sx={{
                    flex: 1,
                    borderWidth: 1,
                    borderColor: '#ccc',
                    borderRadius: 8,
                    paddingHorizontal: 16,
                    paddingVertical: 10,
                    fontSize: 15,
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
                    paddingHorizontal: 16,
                    paddingVertical: 10,
                    fontSize: 15,
                    fontFamily: 'Poppins-Regular',
                  }}
                />
              </View>

              {/* Sex */}
              <Text sx={{ fontFamily: 'Poppins-Bold', fontSize: 16, marginBottom: 4 }}>
                Sex
              </Text>
              <View
                sx={{
                  borderWidth: 1,
                  borderColor: '#ccc',
                  borderRadius: 8,
                  marginBottom: 16,
                  overflow: 'hidden',
                }}
              >
                <Picker
                  selectedValue={form.sex}
                  onValueChange={value => setForm({ ...form, sex: value })}
                  style={{ height: 50, fontSize: 15 }}
                >
                  <Picker.Item label="Select Sex" value="" />
                  <Picker.Item label="Male" value="male" />
                  <Picker.Item label="Female" value="female" />
                </Picker>
              </View>

              {/* Email */}
              <Text sx={{ fontFamily: 'Poppins-Bold', fontSize: 16, marginBottom: 4 }}>
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
                  paddingHorizontal: 16,
                  paddingVertical: 10,
                  marginBottom: 16,
                  fontSize: 15,
                  fontFamily: 'Poppins-Regular',
                }}
              />

              {/* Password */}
              <Text sx={{ fontFamily: 'Poppins-Bold', fontSize: 16, marginBottom: 4 }}>
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
                  paddingHorizontal: 16,
                  paddingVertical: 10,
                  marginBottom: 16,
                  fontSize: 15,
                  fontFamily: 'Poppins-Regular',
                }}
              />

              {/* Confirm Password */}
              <Text sx={{ fontFamily: 'Poppins-Bold', fontSize: 16, marginBottom: 4 }}>
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
                  paddingHorizontal: 16,
                  paddingVertical: 10,
                  marginBottom: 16,
                  fontSize: 15,
                  fontFamily: 'Poppins-Regular',
                }}
              />

              {/* Terms and Conditions */}
              <View
                sx={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginBottom: 16,
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
                    marginLeft: 8,
                    fontSize: 15,
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
                        fontSize: 15,
                        fontFamily: 'Poppins-Regular',
                        color: '#008CFC',
                        textDecorationLine: 'underline',
                        marginBottom: -8,
                      }}
                    >
                      Terms of Service
                    </Text>
                  </Pressable>{' '}
                  and{' '}
                  <Pressable onPress={() => router.push('/privacy')}>
                    <Text
                      sx={{
                        fontSize: 15,
                        fontFamily: 'Poppins-Regular',
                        color: '#008CFC',
                        textDecorationLine: 'underline',
                        marginBottom: -8,
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
                  backgroundColor: isFormValid ? '#008CFC' : '#ccc',
                  paddingVertical: 10,
                  borderRadius: 8,
                  alignItems: 'center',
                  marginBottom: 16,
                  opacity: isFormValid ? 1 : 0.6,
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

              {/* Login Prompt */}
              <View
                sx={{
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginTop: 12,
                }}
              >
                <Text
                  sx={{
                    fontSize: 15,
                    fontFamily: 'Poppins-Regular',
                    color: 'text',
                  }}
                >
                  Already have an account?{' '}
                </Text>
                <Pressable onPress={() => router.push('/login/login')}>
                  <Text
                    sx={{
                      fontSize: 15,
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
      </SafeAreaView>
    </ImageBackground>
  )
}
