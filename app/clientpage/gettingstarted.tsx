import { Pressable, Text, View } from 'dripsy'
import { useFonts } from 'expo-font'
import { useRouter } from 'expo-router'
import { MotiView } from 'moti'
import { ScrollView } from 'react-native'
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context'

export default function GettingStarted() {
  const router = useRouter()
  const insets = useSafeAreaInsets()

  const [fontsLoaded] = useFonts({
    'Poppins-Regular': require('../../../assets/fonts/Poppins/Poppins-Regular.ttf'),
    'Poppins-Bold': require('../../../assets/fonts/Poppins/Poppins-Bold.ttf'),
  })

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
            Getting Started 🚀
          </Text>

          <View sx={{ gap: 16 }}>
            <Text
              sx={{
                fontSize: 16,
                fontFamily: 'Poppins-Regular',
                color: '#4b5563',
              }}
            >
              Let’s personalize your experience and help you find the right services.
            </Text>

            <Pressable
              onPress={() => router.push('./forms/preferences')}
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
                  color: '#0284c7',
                  mb: 4,
                }}
              >
                Set Preferences
              </Text>
              <Text
                sx={{
                  fontSize: 14,
                  fontFamily: 'Poppins-Regular',
                  color: '#4b5563',
                }}
              >
                Choose your care needs, availability, and communication preferences.
              </Text>
            </Pressable>

            <Pressable
              onPress={() => router.push('/client/services')}
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
                  color: '#0284c7',
                  mb: 4,
                }}
              >
                Explore Services
              </Text>
              <Text
                sx={{
                  fontSize: 14,
                  fontFamily: 'Poppins-Regular',
                  color: '#4b5563',
                }}
              >
                Browse available homecare services tailored to your needs.
              </Text>
            </Pressable>

            <Pressable
              onPress={() => router.push('/client/support')}
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
                  color: '#0284c7',
                  mb: 4,
                }}
              >
                Need Help?
              </Text>
              <Text
                sx={{
                  fontSize: 14,
                  fontFamily: 'Poppins-Regular',
                  color: '#4b5563',
                }}
              >
                Connect with our support team or read FAQs to get started smoothly.
              </Text>
            </Pressable>
          </View>
        </MotiView>
      </ScrollView>
    </SafeAreaView>
  )
}
