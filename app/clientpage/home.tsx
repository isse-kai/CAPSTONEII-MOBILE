import { Ionicons } from '@expo/vector-icons'
import { Pressable, Text, View } from 'dripsy'
import { useFonts } from 'expo-font'
import { useRouter } from 'expo-router'
import { MotiView } from 'moti'
import { useEffect, useState } from 'react'
import { Dimensions, Image, ImageBackground, ScrollView } from 'react-native'
import Carousel from 'react-native-reanimated-carousel'
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context'
import { getCurrentUser } from '../../supabase/auth'
import { getClientByAuthUid } from '../../supabase/client'
import ClientNavbar from './clientnavbar/navbar'

const { width } = Dimensions.get('window')

const banners = [
  { id: 1, image: require('../../assets/banner.png') },
  { id: 2, image: require('../../assets/banner-2.png') },
  { id: 3, image: require('../../assets/banner-3.png') },
]

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

    <ImageBackground
      source={require('../../assets/welcome.jpg')}
      resizeMode="cover"
      style={{ flex: 1 }}
    >
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
          {/* Header Row */}
          <View
            sx={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              mb: 24,
            }}
          >
            <Text
              sx={{
                fontSize: 22,
                fontFamily: 'Poppins-Bold',
                color: '#001a33',
              }}
            >
              Welcome{firstName ? `, ${firstName}` : ''}
            </Text>

            <View sx={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
              <Pressable onPress={() => router.push('/search')}>
                <Ionicons name="search" size={24} color="#001a33" />
              </Pressable>

              <Pressable onPress={() => router.push('/notifications')}>
                <Ionicons name="notifications-outline" size={24} color="#001a33" />
              </Pressable>
            </View>
          </View>

          <View sx={{ gap: 16 }}>
            <Text
              sx={{
                fontSize: 18,
                fontFamily: 'Poppins-Bold',
                color: '#001a33',
              }}
            >
              Service Request Post
            </Text>

            <Pressable
              onPress={() => router.push('./postrequest')}
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
                Post a Service Request
              </Text>
              <Text
                sx={{
                  fontSize: 14,
                  fontFamily: 'Poppins-Regular',
                  color: '#4b5563',
                }}
              >
                Describe your needs and connect with available workers.
              </Text>
            </Pressable>

            {/* Banner Carousel */}
            <Carousel
              loop
              width={width - 32}
              height={160}
              autoPlay={true}
              autoPlayInterval={4000}
              data={banners}
              scrollAnimationDuration={1000}
              renderItem={({ item }: { item: { id: number; image: any } }) => (
                <View
                  key={item.id}
                  sx={{
                    borderRadius: 12,
                    overflow: 'hidden',
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 1 },
                    shadowOpacity: 0.1,
                    shadowRadius: 2,
                    elevation: 2,
                  }}
                >
                  <Image
                    source={item.image}
                    style={{
                      width: '100%',
                      height: 160,
                      resizeMode: 'cover',
                    }}
                  />
                </View>
              )}
            />
          </View>
        </MotiView>
      </ScrollView>

      {/* Sticky Bottom Navbar */}
      <ClientNavbar />
    </SafeAreaView>
    </ImageBackground>
  )
}
