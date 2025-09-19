import { Image, Pressable, Text, TextInput, View } from 'dripsy'
import { useFonts } from 'expo-font'
import { useRouter } from 'expo-router'
import { useEffect, useRef, useState } from 'react'
import { Animated, KeyboardAvoidingView, Platform, SafeAreaView, StatusBar } from 'react-native'

export default function ClientLogin() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

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
    if (fontsLoaded) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }).start()
    }
  }, [fadeAnim, fontsLoaded])

  const handleLogin = () => {
    if (!email?.trim() || !password?.trim()) return
    router.push('/_sitemap')
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
            {/* Logo */}
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
                  width: 80,
                  height: 80,
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
            {/* Title */}
            <View sx={{ mb: 'xl', alignItems: 'center' }}>
              <Text sx={{
                fontSize: 28,
                fontFamily: 'Poppins-Bold',
                color: '#001a33',
                mb: 'xs',
                textAlign: 'center',
              }}>
                Login Now
              </Text>
              
              <Text sx={{
                fontSize: 16,
                fontFamily: 'Poppins-Regular',
                color: '#4e6075',
                textAlign: 'center',
                mb: 'sm',
              }}>
                Welcome to JDK HOMECARE
              </Text>

              <View sx={{
                width: 30,
                height: 3,
                backgroundColor: '#0685f4',
                borderRadius: 2,
              }} />
            </View>

            {/* Form */}
            <View sx={{ mb: 'xl' }}>
              {/* Email */}
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
                    height: 50,
                    paddingHorizontal: 16,
                    borderRadius: 10,
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

              {/* Password */}
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
                    height: 50,
                    paddingHorizontal: 16,
                    borderRadius: 10,
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

              {/* Login Button */}
              <Pressable
                onPress={handleLogin}
                disabled={!email?.trim() || !password?.trim()}
                sx={{
                  height: 50,
                  backgroundColor: (!email?.trim() || !password?.trim()) ? '#e4e7ec' : '#0685f4',
                  borderRadius: 10,
                  alignItems: 'center',
                  justifyContent: 'center',
                  mb: 'lg',
                }}
                style={({ pressed }) => [
                  {
                    opacity: pressed && email && password ? 0.9 : 1,
                    transform: [{ scale: pressed && email && password ? 0.98 : 1 }],
                  }
                ]}
              >
                <Text sx={{
                  fontSize: 16,
                  fontFamily: 'Poppins-SemiBold',
                  color: (!email?.trim() || !password?.trim()) ? '#9aa4b2' : '#ffffff',
                }}>
                  Login
                </Text>
              </Pressable>
            </View>

            {/* Support + Sign In Links */}
            <View sx={{
              alignItems: 'center',
              py: 'lg',
            }}>
              <Text sx={{
                fontSize: 14,
                color: '#4e6075',
                fontFamily: 'Poppins-Regular',
                mb: 'sm',
              }}>
                Need help?
              </Text>
              
              {/* Contact Support */}
              <Pressable
                onPress={() => console.log('Contact support')}
                sx={{
                  paddingVertical: 'sm',
                  paddingHorizontal: 'md',
                }}
                style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
              >
                <Text sx={{
                  fontSize: 14,
                  color: '#0685f4',
                  fontFamily: 'Poppins-SemiBold',
                  textAlign: 'center',
                }}>
                  Contact Support
                </Text>
              </Pressable>

              {/* Sign In Button */}
              <Pressable
                onPress={() => router.push('/signup/signup')} // adjust the route here
                sx={{
                  paddingVertical: 'sm',
                  paddingHorizontal: 'md',
                  mt: 'md',
                }}
                style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
              >
                <Text sx={{
                  fontSize: 14,
                  color: '#0685f4',
                  fontFamily: 'Poppins-SemiBold',
                  textAlign: 'center',
                }}>
                  Sign In
                </Text>
              </Pressable>
            </View>
          </View>
        </Animated.View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}
