import { Ionicons } from '@expo/vector-icons'
import { Pressable, Text, View } from 'dripsy'
import { useFonts } from 'expo-font'
import { useRouter } from 'expo-router'
import { AnimatePresence, MotiImage, MotiView } from 'moti'
import { useEffect, useRef, useState } from 'react'
import {
  Dimensions,
  Image,
  ImageBackground,
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView
} from 'react-native'
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

const workers = [
  { id: 1, name: 'Anna Reyes', role: 'Electrician' },
  { id: 2, name: 'Mark Santos', role: 'Plumber' },
  { id: 3, name: 'Liza Cruz', role: 'Cleaner' },
  { id: 4, name: 'John Tan', role: 'Carpenter' },
]

export default function ClientHome() {
  const router = useRouter()
  const insets = useSafeAreaInsets()
  const scrollRef = useRef<ScrollView>(null)

  const [fontsLoaded] = useFonts({
    'Poppins-Regular': require('../../assets/fonts/Poppins/Poppins-Regular.ttf'),
    'Poppins-Bold': require('../../assets/fonts/Poppins/Poppins-Bold.ttf'),
  })

  const [firstName, setFirstName] = useState('')
  const [bannerIndex, setBannerIndex] = useState(0)
  const [scrollX, setScrollX] = useState(0)

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

  useEffect(() => {
    const timer = setInterval(() => {
      setBannerIndex(prev => (prev + 1) % banners.length)
    }, 4000)
    return () => clearInterval(timer)
  }, [])

  const scrollBy = (offset: number) => {
    const newX = scrollX + offset
    setScrollX(newX)
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ x: newX, animated: true })
    }
  }

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    setScrollX(event.nativeEvent.contentOffset.x)
  }

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
          backgroundColor: 'rgba(249, 250, 251, 0.9)',
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

            {/* Banner Slideshow */}
            <View
              sx={{
                width: width - 32,
                height: 110,
                borderRadius: 12,
                overflow: 'hidden',
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.1,
                shadowRadius: 2,
                elevation: 2,
                mb: 16,
              }}
            >
              <AnimatePresence>
                <MotiImage
                  key={banners[bannerIndex].id}
                  source={banners[bannerIndex].image}
                  style={{
                    width: '100%',
                    height: '100%',
                    resizeMode: 'contain',
                    position: 'absolute',
                  }}
                  from={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ type: 'timing', duration: 800 }}
                />
              </AnimatePresence>
            </View>


            {/* Service Request Section */}
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
                  borderWidth: 2,
                  borderColor: '#008CFC',
                  borderRadius: 12,
                  p: 16,
                  bg: 'transparent',
                }}
              >
                <View sx={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                  <Image
                    source={require('../../assets/add-icon.png')}
                    style={{
                      width: 40,
                      height: 40,
                      resizeMode: 'contain',
                    }}
                  />
                  <View sx={{ flex: 1 }}>
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
                      No active service requests found. You can post a new service request to find available workers.
                    </Text>
                  </View>
                </View>
              </Pressable>
            </View>

            {/* Worker Carousel */}
            <View sx={{ mt: 24 }}>
              {/* Header with title + browse + arrows */}
              <View sx={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', mb: 8 }}>
                <View sx={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                  <Text
                    sx={{
                      fontSize: 18,
                      fontFamily: 'Poppins-Bold',
                      color: '#001a33',
                    }}
                  >
                    Available Workers
                  </Text>
                  <Pressable onPress={() => router.push('/workers')}>
                    <Text
                      sx={{
                        fontSize: 14,
                        fontFamily: 'Poppins-Regular',
                        color: '#008CFC',
                      }}
                    >
                      Browse
                    </Text>
                  </Pressable>
                </View>

                <View sx={{ flexDirection: 'row', gap: 12 }}>
                  <Pressable onPress={() => scrollBy(-160)}>
                    <Ionicons name="chevron-back" size={24} color="#001a33" />
                  </Pressable>
                  <Pressable onPress={() => scrollBy(160)}>
                    <Ionicons name="chevron-forward" size={24} color="#001a33" />
                  </Pressable>
                </View>
              </View>

              {/* Scrollable worker cards */}
              <ScrollView
                ref={scrollRef}
                horizontal
                onScroll={handleScroll}
                scrollEventThrottle={16}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ gap: 12 }}
              >
                {workers.map(worker => (
                  <View
                    key={worker.id}
                    sx={{
                      width: 160,
                      bg: '#fff',
                      borderRadius: 12,
                      p: 12,
                      shadowColor: '#000',
                      shadowOffset: { width: 0, height: 1 },
                      shadowOpacity: 0.1,
                      shadowRadius: 2,
                      elevation: 2,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  >
                    <View
                      sx={{
                        width: 80,
                        height: 80,
                        borderRadius: 40,
                        bg: '#e5e7eb',
                        mb: 8,
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}
                    >
                      <Text sx={{ fontSize: 24, color: '#6b7280' }}>👤</Text>
                    </View>
                    <Text
                      sx={{
                        fontSize: 16,
                        fontFamily: 'Poppins-Bold',
                        color: '#001a33',
                        textAlign: 'center',
                      }}
                    >
                      {worker.name}
                    </Text>
                    <Text
                      sx={{
                        fontSize: 14,
                        fontFamily: 'Poppins-Regular',
                        color: '#4b5563',
                        textAlign: 'center',
                      }}
                    >
                      {worker.role}
                    </Text>
                  </View>
                ))}
              </ScrollView>

              {/* Scroll indicator dots */}
              <View sx={{ flexDirection: 'row', justifyContent: 'center', mt: 12 }}>
                {workers.map((_, index) => {
                  const isActive = Math.round(scrollX / 160) === index
                  return (
                    <View
                      key={index}
                      sx={{
                        width: 8,
                        height: 8,
                        borderRadius: 4,
                        bg: isActive ? '#008CFC' : '#d1d5db',
                        mx: 4,
                      }}
                    />
                  )
                })}
              </View>
            </View>



          </MotiView>
        </ScrollView>

        {/* Sticky Bottom Navbar */}
        <ClientNavbar />
      </SafeAreaView>
    </ImageBackground>
  )
}

