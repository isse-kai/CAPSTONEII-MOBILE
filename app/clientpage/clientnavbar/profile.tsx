import { Ionicons } from '@expo/vector-icons'
import { Pressable, Text } from 'dripsy'
import { useFonts } from 'expo-font'
import { useRouter } from 'expo-router'
import { MotiImage, MotiView } from 'moti'
import React from 'react'
import { ImageBackground, ScrollView } from 'react-native'
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context'
import { getCurrentUser, logoutUser } from '../../../supabase/auth'
import Header from '../clientnavbar/header'
import ClientNavbar from '../clientnavbar/navbar'

export default function ClientProfile() {
  const router = useRouter()
  const insets = useSafeAreaInsets()

  const [fontsLoaded] = useFonts({
    'Poppins-Regular': require('../../assets/fonts/Poppins/Poppins-Regular.ttf'),
    'Poppins-Bold': require('../../assets/fonts/Poppins-Bold.ttf'),
    'Poppins-ExtraBold': require('../../assets/fonts/Poppins-ExtraBold.ttf'),
  })

  const [user, setUser] = React.useState<any>(null)

  React.useEffect(() => {
    const fetchUser = async () => {
      try {
        const u = await getCurrentUser()
        setUser(u)
      } catch (err) {
        console.error(err)
      }
    }
    fetchUser()
  }, [])

  if (!fontsLoaded) return null

  const handleLogout = async () => {
    try {
      await logoutUser()
      router.replace('../login/login')
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <ImageBackground
      source={require('../../assets/profile-bg.jpg')}
      style={{ flex: 1 }}
      resizeMode="cover"
    >
      <SafeAreaView
        style={{
          flex: 1,
          paddingBottom: insets.bottom,
          backgroundColor: 'rgba(249, 250, 251, 0.9)',
        }}
      >
        <Header />

        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            paddingHorizontal: 18,
            paddingBottom: 100,
          }}
          showsVerticalScrollIndicator={false}
        >
          <MotiView
            from={{ opacity: 0, translateY: 20 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: 'timing', duration: 400 }}
            style={{ alignItems: 'center', marginTop: 20 }}
          >
            {/* Profile Picture */}
            <MotiImage
              from={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', delay: 200 }}
              source={require('../../assets/profile.png')}
              style={{
                width: 120,
                height: 120,
                borderRadius: 60,
                marginBottom: 16,
              }}
            />

            {/* Username */}
            <Text
              sx={{
                fontSize: 22,
                fontFamily: 'Poppins-ExtraBold',
                color: '#000',
                mb: 4,
              }}
            >
              {user?.user_metadata?.first_name || 'Username'}
            </Text>

            {/* Email */}
            <Text
              sx={{
                fontSize: 14,
                fontFamily: 'Poppins-Regular',
                color: '#555',
                mb: 20,
              }}
            >
              {user?.email || 'user@email.com'}
            </Text>
          </MotiView>

          {/* Account Settings */}
          <Pressable
            onPress={() => router.push('../profiles/settings')}
            sx={{
              flexDirection: 'row',
              alignItems: 'center',
              bg: '#ffffffcc',
              borderRadius: 10,
              px: 16,
              py: 14,
              mb: 12,
            }}
          >
            <Ionicons name="settings-outline" size={22} color="#333" style={{ marginRight: 12 }} />
            <Text sx={{ fontSize: 16, fontFamily: 'Poppins-Bold', color: '#000' }}>
              Account Settings
            </Text>
          </Pressable>

          {/* Logout */}
          <Pressable
            onPress={handleLogout}
            sx={{
              flexDirection: 'row',
              alignItems: 'center',
              bg: '#ffffffcc',
              borderRadius: 10,
              px: 16,
              py: 14,
            }}
          >
            <Ionicons name="log-out-outline" size={22} color="#333" style={{ marginRight: 12 }} />
            <Text sx={{ fontSize: 16, fontFamily: 'Poppins-Bold', color: '#000' }}>
              Logout
            </Text>
          </Pressable>
        </ScrollView>

        {/* Bottom Navbar */}
        <ClientNavbar />
      </SafeAreaView>
    </ImageBackground>
  )
}
