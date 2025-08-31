import { Image, Pressable, Text, TextInput, View } from 'dripsy'
import { useFonts } from 'expo-font'
import { useRouter } from 'expo-router'
import { useEffect, useRef, useState } from 'react'
import { Animated, KeyboardAvoidingView, Platform, SafeAreaView, StatusBar } from 'react-native'

export default function Login() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  // Animation ref
  const fadeAnim = useRef(new Animated.Value(0)).current

  // Load Poppins fonts
  const [fontsLoaded] = useFonts({
    'Poppins-Regular': require('../../assets/fonts/Poppins/Poppins-Regular.ttf'),
    'Poppins-Medium': require('../../assets/fonts/Poppins/Poppins-Medium.ttf'),
    'Poppins-SemiBold': require('../../assets/fonts/Poppins/Poppins-SemiBold.ttf'),
    'Poppins-Bold': require('../../assets/fonts/Poppins/Poppins-Bold.ttf'),
    'Poppins-ExtraBold': require('../../assets/fonts/Poppins/Poppins-ExtraBold.ttf'),
  })

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start()
  }, [fadeAnim])

  const handleLogin = async () => {
    if (!email || !password) {
      return
    }

    setIsLoading(true)
    
    // Simulate login
    setTimeout(() => {
      setIsLoading(false)
      console.log('Login successful')
      // Navigate to dashboard/home
    }, 1500)
  }

  const handleSignUp = () => {
    console.log('Navigate to sign up')
    router.push('/signup/signup')
  }

  if (!fontsLoaded) {
    return null
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#ffffff' }}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      
      <KeyboardAvoidingView 
        style={{ flex: 1 }} 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <Animated.View
          style={{
            flex: 1,
            opacity: fadeAnim,
          }}
        >
          {/* Header */}
          <View sx={{
            alignItems: 'center',
            px: 'lg',
            pt: 'xl',
            pb: 'lg',
          }}>
            {/* Back button positioned absolutely */}
            <View sx={{
              position: 'absolute',
              left: 20,
              top: 24,
              zIndex: 1,
            }}>
              <Pressable
                onPress={() => router.back()}
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: 20,
                  backgroundColor: '#f8f9fa',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
                style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
              >
                <Text sx={{ fontSize: 18, color: '#001a33' }}>←</Text>
              </Pressable>
            </View>
            
            {/* Centered Logo */}
            <View sx={{
              alignItems: 'center',
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 8,
              elevation: 5,
            }}>
              <Image
                source={require('../../assets/jdklogo.png')}
                style={{
                  width: 100,
                  height: 100,
                }}
                resizeMode="contain"
              />
            </View>
          </View>

          {/* Content */}
          <View sx={{
            flex: 1,
            justifyContent: 'center',
            px: 'xxl',
            mx: 'lg',
          }}>
            {/* Title Section */}
            <View sx={{ mb: 'xl', alignItems: 'center' }}>
              <Text sx={{
                fontSize: 32,
                fontFamily: 'Poppins-ExtraBold',
                color: '#001a33',
                mb: 'xs',
                textAlign: 'center',
              }}>
                Welcome back
              </Text>
              
              <Text sx={{
                fontSize: 16,
                fontFamily: 'Poppins-Regular',
                color: '#4e6075',
                textAlign: 'center',
                mb: 'sm',
              }}>
                Log in to JDK HOMECARE
              </Text>

              {/* Simple brand identifier */}
              <View sx={{
                width: 40,
                height: 4,
                backgroundColor: '#0685f4',
                borderRadius: 2,
              }} />
            </View>

            {/* Form */}
            <View sx={{ mb: 'xl' }}>
              {/* Email Input */}
              <View sx={{ mb: 'lg' }}>
                <Text sx={{
                  fontSize: 14,
                  fontFamily: 'Poppins-Medium',
                  color: '#001a33',
                  mb: 'sm',
                }}>
                  Email
                </Text>
                <TextInput
                  placeholder="your@email.com"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoComplete="email"
                  style={{
                    height: 56,
                    paddingHorizontal: 20,
                    borderRadius: 12,
                    backgroundColor: '#f8f9fa',
                    fontSize: 16,
                    borderWidth: 1,
                    borderColor: email ? '#0685f4' : 'transparent',
                    color: '#001a33',
                    fontFamily: 'Poppins-Regular',
                  }}
                  placeholderTextColor="#9aa4b2"
                />
              </View>

              {/* Password Input */}
              <View sx={{ mb: 'lg' }}>
                <Text sx={{
                  fontSize: 14,
                  fontFamily: 'Poppins-Medium',
                  color: '#001a33',
                  mb: 'sm',
                }}>
                  Password
                </Text>
                <TextInput
                  placeholder="Enter your password"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                  autoComplete="password"
                  style={{
                    height: 56,
                    paddingHorizontal: 20,
                    borderRadius: 12,
                    backgroundColor: '#f8f9fa',
                    fontSize: 16,
                    borderWidth: 1,
                    borderColor: password ? '#0685f4' : 'transparent',
                    color: '#001a33',
                    fontFamily: 'Poppins-Regular',
                  }}
                  placeholderTextColor="#9aa4b2"
                />
              </View>

              {/* Forgot Password */}
              <View sx={{ alignItems: 'flex-end', mb: 'xl' }}>
                <Pressable onPress={() => console.log('Forgot password')}>
                  <Text sx={{
                    fontSize: 14,
                    color: '#0685f4',
                    fontFamily: 'Poppins-Medium',
                  }}>
                    Forgot password?
                  </Text>
                </Pressable>
              </View>

              {/* Login Button */}
              <Pressable
                onPress={handleLogin}
                disabled={isLoading || !email || !password}
                sx={{
                  height: 56,
                  backgroundColor: (!email || !password) ? '#e4e7ec' : (isLoading ? '#9aa4b2' : '#0685f4'),
                  borderRadius: 12,
                  alignItems: 'center',
                  justifyContent: 'center',
                  mb: 'lg',
                }}
                style={({ pressed }) => [
                  {
                    opacity: pressed && email && password && !isLoading ? 0.9 : 1,
                    transform: [{ scale: pressed && email && password && !isLoading ? 0.98 : 1 }],
                  }
                ]}
              >
                <Text sx={{
                  fontSize: 16,
                  fontFamily: 'Poppins-SemiBold',
                  color: (!email || !password) ? '#9aa4b2' : '#ffffff',
                }}>
                  {isLoading ? 'Logging in...' : 'Log in'}
                </Text>
              </Pressable>
            </View>

            {/* Sign Up Section */}
            <View sx={{
              alignItems: 'center',
              py: 'lg',
            }}>
              <Text sx={{
                fontSize: 15,
                color: '#4e6075',
                fontFamily: 'Poppins-Regular',
                mb: 'md',
              }}>
                Don't have an account?
              </Text>
              
              <Pressable
                onPress={handleSignUp}
                sx={{
                  paddingVertical: 'md',
                  paddingHorizontal: 'lg',
                }}
                style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
              >
                <Text sx={{
                  fontSize: 16,
                  color: '#0685f4',
                  fontFamily: 'Poppins-SemiBold',
                  textAlign: 'center',
                }}>
                  Create account
                </Text>
              </Pressable>
            </View>
          </View>

          {/* Footer */}
          <View sx={{
            px: 'xxl',
            mx: 'lg',
            pb: 'xl',
            alignItems: 'center',
          }}>
            <Text sx={{
              fontSize: 12,
              color: '#9aa4b2',
              textAlign: 'center',
              lineHeight: 18,
              fontFamily: 'Poppins-Regular',
            }}>
              By signing in, you agree to our Terms of Service{'\n'}
              and Privacy Policy
            </Text>
          </View>
        </Animated.View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}