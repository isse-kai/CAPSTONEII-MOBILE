import { Pressable, Text, View } from 'dripsy'
import { useFonts } from 'expo-font'
import { useRouter } from 'expo-router'
import { MotiView } from 'moti'
import React, { useState } from 'react'
import {
    Alert,
    Image,
    ImageBackground,
    KeyboardAvoidingView,
    Platform,
    View as RNView,
    TextInput,
    TouchableOpacity,
} from 'react-native'
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context'
import { loginUser } from '../../supabase/auth'

export default function Login() {
  const router = useRouter()
  const insets = useSafeAreaInsets()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const [fontsLoaded] = useFonts({
    'Poppins-Regular': require('../../assets/fonts/Poppins/Poppins-Regular.ttf'),
    'Poppins-Bold': require('../../assets/fonts/Poppins/Poppins-Bold.ttf'),
    'Poppins-ExtraBold': require('../../assets/fonts/Poppins/Poppins-ExtraBold.ttf'),
  })

  if (!fontsLoaded) return null

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Missing Fields', 'Please enter both email and password')
      return
    }

    setIsLoading(true)
    try {
      const { token, role, profile } = await loginUser(email, password)
      console.log('Logged in:', { token, role, profile })

      if (role === 'client') {
        router.push('/client/clienthome')
      } else {
        router.push('/worker/home')
      }
    } catch (err: any) {
      Alert.alert('Login Failed', err.message)
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
          <View
            style={{
              flex: 1,
              paddingHorizontal: 16,
              justifyContent: 'center',
            }}
          >
            <MotiView
              from={{ opacity: 0, translateY: 20 }}
              animate={{ opacity: 1, translateY: 0 }}
              transition={{ type: 'timing', duration: 500 }}
              style={{ gap: 20 }}
            >
              {/* Logo */}
              <View sx={{ alignItems: 'center', mb: -8 }}>
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
                  LOGIN
                </Text>
              </View>

              {/* Email */}
              <View>
                <Text sx={{ fontSize: 16, color: '#000', mb: 6 }}>Email</Text>
                <TextInput
                  value={email}
                  onChangeText={setEmail}
                  placeholder="Enter your email"
                  placeholderTextColor="#ccc"
                  style={{
                    backgroundColor: '#ffffffcc',
                    borderRadius: 10,
                    paddingHorizontal: 16,
                    paddingVertical: 14,
                    fontSize: 16,
                  }}
                />
              </View>

              {/* Password with icon */}
              <View>
                <Text sx={{ fontSize: 16, color: '#000', mb: 6 }}>Password</Text>
                <RNView
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    backgroundColor: '#ffffffcc',
                    borderRadius: 10,
                    paddingHorizontal: 16,
                  }}
                >
                  <TextInput
                    value={password}
                    onChangeText={setPassword}
                    placeholder="Enter your password"
                    placeholderTextColor="#ccc"
                    secureTextEntry={!showPassword}
                    style={{
                      flex: 1,
                      paddingVertical: 14,
                      fontSize: 16,
                    }}
                  />
                  <TouchableOpacity onPress={() => setShowPassword(prev => !prev)}>
                    <Image
                      source={
                        showPassword
                          ? require('../../assets/view.png')
                          : require('../../assets/hide.png')
                      }
                      style={{ width: 24, height: 24, tintColor: '#333' }}
                    />
                  </TouchableOpacity>
                </RNView>
              </View>

              {/* Login Button */}
              <Pressable
                onPress={handleLogin}
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
                  {isLoading ? 'Logging in...' : 'Login'}
                </Text>
              </Pressable>

              {/* Sign Up Prompt */}
              <View
                sx={{
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                  mt: 8,
                }}
              >
                <Text sx={{ fontSize: 14, color: '#000', fontFamily: 'Poppins-Regular' }}>
                  Don’t have an account?{' '}
                </Text>
                <Pressable onPress={() => router.push('/signup')}>
                  <Text
                    sx={{
                      fontSize: 14,
                      fontFamily: 'Poppins-Bold',
                      color: '#008CFC',
                      textDecorationLine: 'underline',
                    }}
                  >
                    Sign up
                  </Text>
                </Pressable>
              </View>
            </MotiView>
          </View>
        </SafeAreaView>
      </KeyboardAvoidingView>
    </ImageBackground>
  )
}
