import { Image, Pressable, Text, View } from 'dripsy'
import { useFonts } from 'expo-font'
import { useRouter } from 'expo-router'
import { useEffect, useRef, useState } from 'react'
import { Animated, ImageBackground, StyleSheet } from 'react-native'

const AnimatedImageBackground = Animated.createAnimatedComponent(ImageBackground)

const slideshowImages = [
  require('../assets/carpentry_crop.jpg'),
  require('../assets/electrical_crop.jpg'),
  require('../assets/plumbing_crop.jpg'),
]

export default function Index() {
  const router = useRouter()
  const [bgIndex, setBgIndex] = useState(0)
  const fadeAnim = useRef(new Animated.Value(1)).current

  // Load Poppins fonts
  const [fontsLoaded] = useFonts({
    'Poppins-Regular': require('../assets/fonts/Poppins/Poppins-Regular.ttf'),
    'Poppins-Bold': require('../assets/fonts/Poppins/Poppins-Bold.ttf'),
    'Poppins-ExtraBold': require('../assets/fonts/Poppins/Poppins-ExtraBold.ttf'),
    // Add more weights if needed
  })

  useEffect(() => {
    const interval = setInterval(() => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }).start(() => {
        setBgIndex((prev) => (prev + 1) % slideshowImages.length)
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }).start()
      })
    }, 3000)
    return () => clearInterval(interval)
  }, [fadeAnim])

  if (!fontsLoaded) {
    return null
  }

  return (
    <View style={{ flex: 1 }}>
      {/* Animated background */}
      <AnimatedImageBackground
        source={slideshowImages[bgIndex]}
        style={[StyleSheet.absoluteFillObject, { opacity: fadeAnim }]}
        resizeMode="stretch"
      >
        <View style={{ flex: 1, backgroundColor: 'rgba(255,255,255,0.4)' }} />
      </AnimatedImageBackground>

      {/* Foreground content */}
      <View
        sx={{
          flex: 1,
          px: 'md',
        }}
      >

        {/* Logo */}
        <View sx={{ alignItems: 'flex-start', mt: -20, ml: -10, mb: -50 }}>
          <Image
            source={require('../assets/jdklogo.png')}
            style={{
              width: 160,
              height: 160,
            }}
            resizeMode="contain"
          />
        </View>

        {/* Heading Section */}
        <View sx={{mb: 'md' }}>
          <Text
            sx={{
              fontSize: 28,
              fontWeight: '400',
              color: '#001a33',
              mb: 'sm',
              fontFamily: 'Poppins-ExtraBold',
            }}
          >
            Reliable home services for a safer, better home.
          </Text>

          <Text
            sx={{
              fontSize: 20,
              fontWeight: '200',
              color: '#0685f4',
              mb: 'sm',
              fontFamily: 'Poppins-Bold',
            }}
          >
            JDK HOMECARE: Home Service and Maintenance
          </Text>

          <Text
            sx={{
              fontSize: 14,
              color: '#4e6075',
              lineHeight: 20,
              maxWidth: 300,
              fontFamily: 'Poppins-Regular',
            }}
          >
            Connects clients with skilled workers to get their home services done. 
            Whether you’re looking for a plumber, electrician, cleaner, or handyman, our platform makes it easy to find trusted workers. 
            For workers, it’s a great opportunity to offer your skills and connect with clients in need of your expertise. 
            Everyone’s home deserves the best care, and we’re here to make it happen.
          </Text>
        </View>

        {/* Buttons */}
        <View
          sx={{
            justifyContent: 'center',
            alignItems: 'flex-start',
          }}
        >
          <View sx={{ flexDirection: 'row' }}>
          <Pressable
            onPress={() => router.push('/login/login')}
            sx={{
              bg: '#008cfd',
              py: 'md',
              px: 'lg',
              borderRadius: 10,
            }}
          >
            <Text sx={{ 
              color: 'background', 
              fontSize: 16, 
              fontWeight: 'bold', 
              fontFamily: 'Poppins-Bold' 
              }}
              >
              Book a Service Now
            </Text>
          </Pressable>
        </View>
        </View>
      </View>
    </View>
  )
}