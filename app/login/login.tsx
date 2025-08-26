import { Pressable, Text, TextInput, View } from 'dripsy'
import { useFonts } from 'expo-font'
import { useRouter } from 'expo-router'
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
      <View sx={{ flex: 1, justifyContent: 'center', px: 'md' }}>
        {/* Logo */}
        <Image
          source={require('../../assets/jdklogo.png')}
          style={{
            width: 280,
            height: 280,
            alignSelf: 'center',
            marginBottom: -70,
            marginTop: -150,
          }}
          resizeMode="contain"
        />

        {/* Header */}
        <View
          sx={{
            flexDirection: 'row',
            justifyContent: 'left',
            alignItems: 'center',
            mb: 'md',
            mt: 'md',
          }}
        >
          <Text
            sx={{
              fontSize: 26,
              fontWeight: '400',
              fontFamily: 'Poppins-Bold',
            }}
          >
            Login
          </Text>
        </View>

        {/* Email Input */}
        <TextInput
          placeholder="Email Address"
          value={email}
          onChangeText={setEmail}
          style={{
            padding: 20,
            marginBottom: 12,
            borderRadius: 8,
            backgroundColor: '#f3f4f6',
          }}
        />

        {/* Password Input with Toggle */}
        <View style={{ position: 'relative', marginBottom: 16 }}>
          <TextInput
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
            style={{
              padding: 20,
              borderRadius: 8,
              backgroundColor: '#f3f4f6',
              paddingRight: 60,
            }}
          />
          <Pressable
            onPress={() => setShowPassword(!showPassword)}
            style={{
              position: 'absolute',
              right: 16,
              top: 18,
              padding: 4,
            }}
          >
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

        {/* Login Button */}
        <Pressable
          onPress={() => console.log('Login pressed')}
          sx={{
            bg: '#008CFC',
            py: 10,
            borderRadius: 8,
            alignItems: 'center',
            mb: 'md',
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

        {/* Divider */}
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

        {/* Signup Prompt */}
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
              fontWeight: 'Regular',
              fontFamily: 'Poppins-Regular',
            }}
          >
            Don’t have an account?{' '}
          </Text>
          <Pressable onPress={() => router.push('/signup/roles')}>
            <Text
              sx={{
                fontSize: 14,
                fontWeight: 'Regular',
                fontFamily: 'Poppins-Regular',
                color: '#008CFC',
                textDecorationLine: 'underline',
              }}
            >
              Sign Up
            </Text>
          </Pressable>
        </View>
      </View>
    </ImageBackground>
  )
}
