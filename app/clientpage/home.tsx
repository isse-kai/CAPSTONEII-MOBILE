import { Pressable, Text, View } from 'dripsy'
import { useFonts } from 'expo-font'
import { useRouter } from 'expo-router'
import { MotiView } from 'moti'
import { useEffect, useState } from 'react'
import { ScrollView } from 'react-native'
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context'
import { getCurrentUser } from '../../supabase/auth'
import { getClientByAuthUid } from '../../supabase/client'
import ClientNavbar from './clientnavbar/navbar'

export default function ClientHome() {
  const router = useRouter()
  const insets = useSafeAreaInsets()

  const [fontsLoaded] = useFonts({
    'Poppins-Regular': require('../../assets/fonts/Poppins/Poppins-Regular.ttf'),
    'Poppins-Bold': require('../../assets/fonts/Poppins/Poppins-Bold.ttf'),
  })

  const [firstName, setFirstName] = useState('')

  useEffect(() => {
    const loadUserProfile = async () => {
      try {
        const user = await getCurrentUser()
        const client = await getClientByAuthUid(user.id)
        if (client?.first_name) setFirstName(client.first_name)
      } catch (err) {
        console.warn('Failed to load client profile:', err)
      }
    }

    loadUserProfile()
  }, [])

  if (!fontsLoaded) return null

  return (
    <SafeAreaView
      style={{
        flex: 1,
        paddingTop: insets.top + 4,
        paddingBottom: insets.bottom + 4,
        backgroundColor: '#f9fafb',
      }}
    >
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          paddingHorizontal: 16,
          paddingVertical: 12,
          paddingBottom: 100,
        }}
        keyboardShouldPersistTaps="handled"
      >
        <MotiView
          from={{ opacity: 0, translateY: 20 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'timing', duration: 500 }}
          style={{ flex: 1 }}
        >
          <Text
            sx={{
              fontSize: 22,
              fontFamily: 'Poppins-Bold',
              color: '#001a33',
              mb: 24,
            }}
          >
            Welcome, {firstName ? `, ${firstName}` : ''}
          </Text>

          <View sx={{ gap: 16 }}>
            <Text
              sx={{
                fontSize: 18,
                fontFamily: 'Poppins-Bold',
                color: '#001a33',
              }}
            >
              Services for You
            </Text>

            <Pressable
              onPress={() => router.push('/client/schedule')}
              sx={{
                bg: '#fff',
                borderRadius: 12,
                p: 16,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.1,
                shadowRadius: 2,
                elevation: 2,
              }}
            >
              <Text
                sx={{
                  fontSize: 16,
                  fontFamily: 'Poppins-Bold',
                  color: '#008CFC',
                  marginBottom: 4,
                }}
              >
                View Schedule
              </Text>
              <Text
                sx={{
                  fontSize: 14,
                  fontFamily: 'Poppins-Regular',
                  color: '#4b5563',
                }}
              >
                See upcoming appointments and manage your bookings.
              </Text>
            </Pressable>

            <Pressable
              onPress={() => router.push('./forms/request')}
              sx={{
                bg: '#fff',
                borderRadius: 12,
                p: 16,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.1,
                shadowRadius: 2,
                elevation: 2,
              }}
            >
              <Text
                sx={{
                  fontSize: 16,
                  fontFamily: 'Poppins-Bold',
                  color: '#008CFC',
                  marginBottom: 4,
                }}
              >
                Request Service
              </Text>
              <Text
                sx={{
                  fontSize: 14,
                  fontFamily: 'Poppins-Regular',
                  color: '#4b5563',
                }}
              >
                Submit a new service request and connect with providers.
              </Text>
            </Pressable>
          </View>
        </MotiView>
      </ScrollView>

      {/* Sticky Bottom Navbar */}
      <ClientNavbar />
    </SafeAreaView>
  )
}
