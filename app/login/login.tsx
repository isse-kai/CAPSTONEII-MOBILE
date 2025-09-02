import { Pressable, Text, TextInput, View } from 'dripsy'
import { useFonts } from 'expo-font'
import { useRouter } from 'expo-router'
import { MotiView } from 'moti'
import { useState } from 'react'
import { Image, ImageBackground } from 'react-native'

export default function Login() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const [fontsLoaded] = useFonts({
    'Poppins-Regular': require('../../assets/fonts/Poppins/Poppins-Regular.ttf'),
    'Poppins-Bold': require('../../assets/fonts/Poppins/Poppins-Bold.ttf'),
    'Poppins-ExtraBold': require('../../assets/fonts/Poppins/Poppins-ExtraBold.ttf'),
  })

  if (!fontsLoaded) return null

  return (
    <ImageBackground
      source={require('../../assets/login.jpg')}
      style={{ flex: 1 }}
      resizeMode="cover"
    >
      <MotiView
        from={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ type: 'timing', duration: 600 }}
        style={{ flex: 1 }}
      >
        {/* Back Button */}
        <MotiView
          from={{ opacity: 0, translateX: -20 }}
          animate={{ opacity: 1, translateX: 0 }}
          transition={{ type: 'timing', duration: 500, delay: 50 }}
        >
          <View
            style={{
              position: 'absolute',
              top: 50,
              left: 20,
              zIndex: 10,
            }}
          >
            <Pressable
              onPress={() => router.back()}
              style={({ pressed }) => ({
                backgroundColor: pressed ? '#e0e0e0' : '#f3f4f6',
                padding: 10,
                borderRadius: 20,
                elevation: 2,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.2,
                shadowRadius: 2,
                height: 40,
                width: 40,
              })}
            >
              <Text
                sx={{
                  fontSize: 18,
                  fontFamily: 'Poppins-Bold',
                  color: '#001a33',
                  textAlign: 'center',
                  lineHeight: 20,
                }}
              >
                ←
              </Text>
            </Pressable>
          </View>
        </MotiView>

        <View sx={{ flex: 1, justifyContent: 'center', px: 'md' }}>
          {/* Logo */}
          <MotiView
            from={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'timing', duration: 600, delay: 100 }}
          >
            <Image
              source={require('../../assets/jdklogo.png')}
              style={{
                width: 220,
                height: 220,
                alignSelf: 'center',
                marginBottom: -100,
                marginTop: -100,
              }}
              resizeMode="contain"
            />
          </MotiView>

          <MotiView
            from={{ opacity: 0, translateY: -20 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: 'timing', duration: 500, delay: 200 }}
          >
            <View
              sx={{
                justifyContent: 'center',
                alignItems: 'left',
                mb: 5,
                mt: 'lg'
              }}
            >
              <Text
                sx={{
                  fontSize: 26,
                  fontWeight: '400',
                  fontFamily: 'Poppins-Bold',
                  textAlign: 'left',
                }}
              >
                Login
              </Text>
            </View>
          </MotiView>


          {/* Email */}
          <MotiView
            from={{ opacity: 0, translateY: 20 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: 'timing', duration: 500, delay: 300 }}
          >
            <View style={{ marginBottom: 12 }}>
              <Text
                sx={{
                  fontSize: 14,
                  fontFamily: 'Poppins-Medium',
                  color: '#001a33',
                  mb: 'sm',
                }}
              >
                Email
              </Text>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  backgroundColor: '#f3f4f6',
                  borderRadius: 8,
                  paddingHorizontal: 16,
                  paddingVertical: 12,
                }}
              >
                <TextInput
                  placeholder="Email Address"
                  value={email}
                  onChangeText={setEmail}
                  style={{
                    flex: 1,
                    fontSize: 16,
                    fontFamily: 'Poppins-Regular',
                  }}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>
            </View>
          </MotiView>


          {/* Password */}
          <MotiView
            from={{ opacity: 0, translateY: 20 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: 'timing', duration: 500, delay: 400 }}
          >
            <View sx={{ mb: 'lg' }}>
              <Text
                sx={{
                  fontSize: 14,
                  fontFamily: 'Poppins-Medium',
                  color: '#001a33',
                  mb: 'sm',
                }}
              >
                Password
              </Text>
              <View style={{ marginBottom: 2 }}>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    backgroundColor: '#f3f4f6',
                    borderRadius: 8,
                    paddingHorizontal: 16,
                    paddingVertical: 12,
                  }}
                >
                  <TextInput
                    placeholder="Password"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!showPassword}
                    style={{
                      flex: 1,
                      fontSize: 16,
                      fontFamily: 'Poppins-Regular',
                    }}
                  />
                  <Pressable onPress={() => setShowPassword(!showPassword)}>
                    <Text
                      sx={{
                        fontSize: 14,
                        fontFamily: 'Poppins-Regular',
                        color: '#008CFC',
                      }}
                    >
                      {showPassword ? 'Hide' : 'Show'}
                    </Text>
                  </Pressable>
                </View>
              </View>

              {/* Forgot Password */}
              <View sx={{ alignItems: 'flex-end', mt: 'md' }}>
                <Pressable onPress={() => console.log('Forgot password')}>
                  <Text
                    sx={{
                      fontSize: 14,
                      color: '#0685f4',
                      fontFamily: 'Poppins-Medium',
                    }}
                  >
                    Forgot password?
                  </Text>
                </Pressable>
              </View>
            </View>
          </MotiView>

          {/* Login Button */}
          <MotiView
            from={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'timing', duration: 500, delay: 500 }}
          >
            <Pressable
              onPress={() => console.log('Login pressed')}
              sx={{
                bg: '#008CFC',
                py: 10,
                borderRadius: 8,
                alignItems: 'center',
                mb: 4
              }}
            >
              <Text
                sx={{
                  textAlign: 'center',
                  color: 'background',
                  fontWeight: 'bold',
                  fontSize: 20,
                  fontFamily: 'Poppins-ExtraBold',
                }}
              >
                Login
              </Text>
            </Pressable>
          </MotiView>

          {/* Divider */}
          <MotiView
            from={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ type: 'timing', duration: 400, delay: 600 }}
          >
            <Text
              sx={{
                fontSize: 20,
                fontWeight: 'extrabold',
                fontFamily: 'Poppins-Regular',
                color: 'black',
                textAlign: 'center',
              }}
            >
              or
            </Text>
          </MotiView>

          {/* Google Login */}
          <MotiView
            from={{ opacity: 0, translateY: 20 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: 'timing', duration: 500, delay: 700 }}
          >
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
          </MotiView>

          {/* Signup */}
          <MotiView
            from={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ type: 'timing', duration: 500, delay: 800 }}
          >
            <View
              sx={{
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                mb: 'md',
                mt: 'md',
              }}
            >
              <Text
                sx={{
                  fontSize: 14,
                  fontFamily: 'Poppins-Regular',
                  color: '#001a33',
                }}
              >
                Don’t have an account?{' '}
              </Text>
              <Pressable onPress={() => router.push('/signup/roles')}>
                <Text
                  sx={{
                    fontSize: 14,
                    fontFamily: 'Poppins-Regular',
                    color: '#008CFC',
                  }}
                >
                  Sign Up
                </Text>
              </Pressable>
            </View>
          </MotiView>
        </View>
      </MotiView>
    </ImageBackground>
  )
  }
  