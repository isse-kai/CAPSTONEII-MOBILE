import { Image, Pressable, Text, View } from 'dripsy'
import { useFonts } from 'expo-font'
import { useRouter } from 'expo-router'
import { MotiView } from 'moti'
import { useState } from 'react'
import { ImageBackground, ScrollView } from 'react-native'
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context'

export default function Roles() {
  const router = useRouter()
  const [selectedRole, setSelectedRole] = useState<'client' | 'worker' | null>(null)
  const insets = useSafeAreaInsets()

  const [fontsLoaded] = useFonts({
    'Poppins-Regular': require('../../assets/fonts/Poppins/Poppins-Regular.ttf'),
    'Poppins-Bold': require('../../assets/fonts/Poppins/Poppins-Bold.ttf'),
    'Poppins-ExtraBold': require('../../assets/fonts/Poppins/Poppins-ExtraBold.ttf'),
  })

  if (!fontsLoaded) return null

  const roles = [
    {
      key: 'client',
      label: "I'm a client, hiring for a service",
      route: '/signup/clientsignup',
    },
    {
      key: 'worker',
      label: "I'm a worker, looking for a service job",
      route: '/signup/workersignup',
    },
  ]

  const selected = roles.find(r => r.key === selectedRole)

  return (
    <ImageBackground
      source={require('../../assets/login.jpg')}
      resizeMode="cover"
      style={{ flex: 1 }}
    >
      <SafeAreaView
        style={{
          flex: 1,
          paddingTop: insets.top + 8,
          paddingBottom: insets.bottom + 8,
        }}
      >
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <View
            sx={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              px: 'lg',
              py: 'xl',
              bg: 'transparent',
            }}
          >
            {/* Back Button */}
            <MotiView
              from={{ opacity: 0, translateX: -20 }}
              animate={{ opacity: 1, translateX: 0 }}
              transition={{ type: 'timing', duration: 500, delay: 50 }}
              style={{ position: 'absolute', top: insets.top + 8, left: 20, zIndex: 10 }}
            >
              <Pressable
                onPress={() => router.back()}
                sx={{
                  bg: '#f3f4f6',
                  borderRadius: 20,
                  height: 40,
                  width: 40,
                  justifyContent: 'center',
                  alignItems: 'center',
                  elevation: 2,
                }}
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
            </MotiView>

            {/* Logo */}
            <MotiView
              from={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: 'timing', duration: 600, delay: 100 }}
            >
              <Image
                source={require('../../assets/jdklogo.png')}
                style={{
                  width: 180,
                  height: 180,
                  alignSelf: 'center',
                  marginBottom: -10,
                  marginTop: -180
                }}
                resizeMode="contain"
              />
            </MotiView>

            {/* Heading */}
            <MotiView
              from={{ opacity: 0, translateY: -20 }}
              animate={{ opacity: 1, translateY: 0 }}
              transition={{ type: 'timing', duration: 500, delay: 100 }}
              style={{ marginBottom: 24 }}
            >
              <View
                sx={{
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                }}
              >
                <Text sx={{ fontSize: 24, fontFamily: 'Poppins-Bold', color: 'text' }}>
                  Join as a{' '}
                </Text>
                <Text sx={{ fontSize: 24, fontFamily: 'Poppins-Bold', color: '#008CFC' }}>
                  Client
                </Text>
                <Text sx={{ fontSize: 24, fontFamily: 'Poppins-Bold', color: 'text' }}>
                  {' '}or{' '}
                </Text>
                <Text sx={{ fontSize: 24, fontFamily: 'Poppins-Bold', color: '#008CFC' }}>
                  Worker
                </Text>
              </View>
            </MotiView>

            {/* Role Options */}
            {roles.map(({ key, label }, index) => {
              const isSelected = selectedRole === key
              return (
                <MotiView
                  key={key}
                  from={{ opacity: 0, translateY: 20 }}
                  animate={{ opacity: 1, translateY: 0 }}
                  transition={{ type: 'timing', duration: 500, delay: 200 + index * 100 }}
                  style={{ width: '100%' }}
                >
                  <Pressable
                    onPress={() => setSelectedRole(key as 'client' | 'worker')}
                    sx={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      bg: 'transparent',
                      padding: 'lg',
                      borderRadius: 8,
                      mb: 'md',
                      borderWidth: 2,
                      borderColor: isSelected ? '#008CFC' : '#ccc',
                      opacity: isSelected ? 1 : 0.85,
                    }}
                  >
                    <View
                      sx={{
                        width: 20,
                        height: 20,
                        borderRadius: 10,
                        borderWidth: 2,
                        borderColor: isSelected ? '#008CFC' : '#ccc',
                        bg: isSelected ? '#008CFC' : 'transparent',
                        mr: 'md',
                      }}
                    />
                    <Text
                      sx={{
                        flex: 1,
                        textAlign: 'left',
                        color: isSelected ? '#008CFC' : 'text',
                        fontWeight: 'bold',
                        fontSize: 14,
                        fontFamily: 'Poppins-Regular',
                      }}
                    >
                      {label}
                    </Text>
                  </Pressable>
                </MotiView>
              )
            })}

            {/* Continue Button */}
            <MotiView
              from={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: 'timing', duration: 500, delay: 400 }}
              style={{ width: '100%' }}
            >
              <Pressable
                onPress={() => {
                  if (selected) router.push(selected.route as '/signup/clientsignup' | '/signup/workersignup')
                }}
                sx={{
                  mt: 'sm',
                  py: 10,
                  px: 'lg',
                  borderRadius: 8,
                  borderColor: selected ? '#008CFC' : '#ccc',
                  bg: selected ? '#008CFC' : '#f0f0f0',
                  alignItems: 'center',
                  opacity: selected ? 1 : 0.9,
                }}
              >
                <Text
                  sx={{
                    fontSize: 18,
                    fontFamily: 'Poppins-ExtraBold',
                    color: selected ? '#fff' : '#999',
                  }}
                >
                  {selectedRole === 'client'
                    ? 'Create Account as Client'
                    : selectedRole === 'worker'
                    ? 'Create Account as Worker'
                    : 'Create Account'}
                </Text>
              </Pressable>
            </MotiView>

            {/* Login Link */}
            <MotiView
              from={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ type: 'timing', duration: 400, delay: 500 }}
              style={{ marginTop: 16 }}
            >
              <View
                sx={{
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <Text
                  sx={{
                    fontSize: 14,
                    fontFamily: 'Poppins-Regular',
                    color: 'text',
                  }}
                >
                  Already have an account?{' '}
                </Text>
                <Pressable onPress={() => router.push('/login/login')}>
                  <Text
                    sx={{
                      fontSize: 14,
                      fontFamily: 'Poppins-Regular',
                      color: '#008CFC',
                    }}
                  >
                    Login
                  </Text>
                </Pressable>
              </View>
            </MotiView>
          </View>
        </ScrollView>
      </SafeAreaView>
    </ImageBackground>
  )
  }
