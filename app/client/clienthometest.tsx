import { Pressable, Text, View } from 'dripsy'
import { useFonts } from 'expo-font'
import { useRouter } from 'expo-router'
import { MotiView } from 'moti'
import { useEffect, useState } from 'react'
import { SafeAreaView, ScrollView } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import ClientNavbar from './clientnavbar'

export default function ClientHome() {
  const router = useRouter()
  const insets = useSafeAreaInsets()

  const [fontsLoaded] = useFonts({
    'Poppins-Regular': require('../../assets/fonts/Poppins/Poppins-Regular.ttf'),
    'Poppins-Bold': require('../../assets/fonts/Poppins/Poppins-Bold.ttf'),
  })

  const [isNewClient, setIsNewClient] = useState(true) // Replace with real logic

  useEffect(() => {
    const checkClientStatus = async () => {
      const result = await fetchClientStatus()
      setIsNewClient(result.isNew)
    }
    checkClientStatus()
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
          paddingBottom: 100, // space for navbar
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
            Welcome back 👋
          </Text>

          {isNewClient && (
            <MotiView
              from={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: 'timing', duration: 400 }}
              style={{
                backgroundColor: '#e0f2fe',
                borderRadius: 12,
                padding: 16,
                marginBottom: 20,
              }}
            >
              <Text
                sx={{
                  fontSize: 16,
                  fontFamily: 'Poppins-Bold',
                  color: '#0369a1',
                  marginBottom: 6,
                }}
              >
                Welcome to JDK Homecare!
              </Text>
              <Text
                sx={{
                  fontSize: 14,
                  fontFamily: 'Poppins-Regular',
                  color: '#0369a1',
                }}
              >
                Let’s get started by setting up your preferences and exploring available services.
              </Text>
              <Pressable
                onPress={() => router.push('/client/getting-started')}
                sx={{
                  mt: 12,
                  bg: '#0284c7',
                  borderRadius: 8,
                  py: 10,
                  px: 16,
                  alignSelf: 'flex-start',
                }}
              >
                <Text
                  sx={{
                    fontSize: 14,
                    fontFamily: 'Poppins-Bold',
                    color: '#fff',
                  }}
                >
                  Get Started
                </Text>
              </Pressable>
            </MotiView>
          )}

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
              onPress={() => router.push('/client/book-care')}
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
                Book a Caregiver
              </Text>
              <Text
                sx={{
                  fontSize: 14,
                  fontFamily: 'Poppins-Regular',
                  color: '#4b5563',
                }}
              >
                Find trusted professionals for home care, companionship, and more.
              </Text>
            </Pressable>

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
          </View>
        </MotiView>
      </ScrollView>

      {/* Sticky Bottom Navbar */}
      <ClientNavbar />
    </SafeAreaView>
  )
}

// Mock function — replace with real logic
async function fetchClientStatus() {
  return { isNew: true }
}
