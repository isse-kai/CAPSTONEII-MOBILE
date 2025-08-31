import { Image, Pressable, Text, View } from 'dripsy'
import { useFonts } from 'expo-font'
import { useRouter } from 'expo-router'
import { useEffect, useRef, useState } from 'react'
import { Animated, Dimensions, ImageBackground, StyleSheet } from 'react-native'

const AnimatedImageBackground = Animated.createAnimatedComponent(ImageBackground)
const { width, height } = Dimensions.get('window')

const slideshowImages = [
  require('../assets/carpentry_crop.jpg'),
  require('../assets/electrical_crop.jpg'),
  require('../assets/plumbing_crop.jpg'),
]

export default function Index() {
  const router = useRouter()
  const [bgIndex, setBgIndex] = useState(0)
  const fadeAnim = useRef(new Animated.Value(1)).current
  const slideAnim = useRef(new Animated.Value(0)).current

  // Load Poppins fonts
  const [fontsLoaded] = useFonts({
    'Poppins-Regular': require('../assets/fonts/Poppins/Poppins-Regular.ttf'),
    'Poppins-Medium': require('../assets/fonts/Poppins/Poppins-Medium.ttf'),
    'Poppins-SemiBold': require('../assets/fonts/Poppins/Poppins-SemiBold.ttf'),
    'Poppins-Bold': require('../assets/fonts/Poppins/Poppins-Bold.ttf'),
    'Poppins-ExtraBold': require('../assets/fonts/Poppins/Poppins-ExtraBold.ttf'),
  })

  useEffect(() => {
    // Entrance animation
    Animated.timing(slideAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start()

    const interval = setInterval(() => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }).start(() => {
        setBgIndex((prev) => (prev + 1) % slideshowImages.length)
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }).start()
      })
    }, 4000) // Slightly longer interval for better viewing

    return () => clearInterval(interval)
  }, [fadeAnim, slideAnim])

  if (!fontsLoaded) {
    return null
  }

  return (
    <View style={{ flex: 1 }}>
      {/* Animated background with gradient overlay */}
      <AnimatedImageBackground
        source={slideshowImages[bgIndex]}
        style={[StyleSheet.absoluteFillObject, { opacity: fadeAnim }]}
        resizeMode="cover" // Better for responsive design
      >
        {/* Gradient overlay for better text readability */}
        <View 
          style={{ 
            flex: 1, 
            backgroundColor: 'rgba(255,255,255,0.85)',
            // Add subtle gradient effect if needed
          }} 
        />
      </AnimatedImageBackground>

      {/* Foreground content with animation */}
      <Animated.View
        style={{
          flex: 1,
          transform: [{
            translateY: slideAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [50, 0],
            }),
          }],
          opacity: slideAnim,
        }}
      >
        <View
          sx={{
            flex: 1,
            px: 'lg', // Better padding
            py: 'xl', // Add vertical padding
            justifyContent: 'space-between', // Better distribution
          }}
        >
          {/* Header with Logo */}
          <View sx={{ alignItems: 'flex-start', mt: 'lg' }}>
            <View sx={{ 
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 8,
              elevation: 5,
            }}>
              <Image
                source={require('../assets/jdklogo.png')}
                style={{
                  width: 140,
                  height: 140,
                }}
                resizeMode="contain"
              />
            </View>
          </View>

          {/* Main Content */}
          <View sx={{ flex: 1, justifyContent: 'center', py: 'xl' }}>
            {/* Hero Section */}
            <View sx={{ mb: 'xl' }}>
              <Text
                sx={{
                  fontSize: width > 400 ? 32 : 28, // Responsive font size
                  fontWeight: '800',
                  color: '#001a33',
                  mb: 'md',
                  fontFamily: 'Poppins-ExtraBold',
                  lineHeight: width > 400 ? 38 : 34,
                  letterSpacing: -0.5,
                }}
              >
                Reliable home services for a safer, better home.
              </Text>

              <View sx={{
                width: 60,
                height: 4,
                backgroundColor: '#0685f4',
                borderRadius: 2,
                mb: 'lg',
              }} />

              <Text
                sx={{
                  fontSize: 18,
                  fontWeight: '600',
                  color: '#0685f4',
                  mb: 'md',
                  fontFamily: 'Poppins-SemiBold',
                  letterSpacing: 0.3,
                }}
              >
                JDK HOMECARE
              </Text>

              <Text
                sx={{
                  fontSize: 16,
                  color: '#4e6075',
                  lineHeight: 24,
                  fontFamily: 'Poppins-Regular',
                  mb: 'lg', 
                }}
              >
                Connect with skilled professionals for all your home service needs. 
                From plumbing and electrical work to cleaning and repairs – we make it easy 
                to find trusted experts who deliver quality results.
              </Text>

              {/* Feature highlights */}
              <View sx={{ flexDirection: 'row', flexWrap: 'wrap', mb: 'lg' }}>
                {['Trusted Workers', 'Quick Booking', '24/7 Support'].map((feature, index) => (
                  <View 
                    key={feature}
                    sx={{
                      backgroundColor: 'rgba(6, 133, 244, 0.1)',
                      paddingHorizontal: 'md',
                      paddingVertical: 'sm',
                      borderRadius: 20,
                      mr: 'sm',
                      mb: 'sm',
                    }}
                  >
                    <Text sx={{
                      color: '#0685f4',
                      fontSize: 12,
                      fontFamily: 'Poppins-Medium',
                      fontWeight: '500',
                    }}>
                      {feature}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          </View>

          {/* Call-to-Action Section */}
          <View sx={{ pb: 'xl' }}>
            <View sx={{ flexDirection: 'column', alignItems: 'stretch' }}>
              {/* Primary CTA */}
              <Pressable
                onPress={() => {
                  console.log('Navigating to login page...')
                  router.push('/login/login')
                }}
                sx={{
                  bg: '#0685f4',
                  py: 'lg',
                  px: 'xl',
                  borderRadius: 12,
                  mb: 'md',
                  shadowColor: '#0685f4',
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.3,
                  shadowRadius: 8,
                  elevation: 8,
                }}
                style={({ pressed }) => [
                  {
                    opacity: pressed ? 0.9 : 1,
                    transform: [{ scale: pressed ? 0.98 : 1 }],
                  }
                ]}
              >
                <Text sx={{ 
                  color: '#ffffff', 
                  fontSize: 18, 
                  fontWeight: '600', 
                  fontFamily: 'Poppins-SemiBold',
                  textAlign: 'center',
                  letterSpacing: 0.5,
                }}>
                  Book a Service Now
                </Text>
              </Pressable>

              {/* Secondary CTA */}
              <Pressable
                onPress={() => {
                  // Add navigation to services or about page
                  console.log('Learn more pressed')
                  router.push('/learnmore/learnmore')
                }}
                sx={{
                  borderWidth: 2,
                  borderColor: '#0685f4',
                  py: 'md',
                  px: 'xl',
                  borderRadius: 12,
                  backgroundColor: 'transparent',
                }}
                style={({ pressed }) => [
                  {
                    opacity: pressed ? 0.8 : 1,
                  }
                ]}
              >
                <Text sx={{ 
                  color: '#0685f4', 
                  fontSize: 16, 
                  fontWeight: '500', 
                  fontFamily: 'Poppins-Medium',
                  textAlign: 'center',
                }}>
                  Learn More
                </Text>
              </Pressable>
            </View>

            {/* Bottom indicator dots for slideshow */}
            <View sx={{ 
              flexDirection: 'row', 
              justifyContent: 'center', 
              mt: 'lg',
              gap: 'sm'
            }}>
              {slideshowImages.map((_, index) => (
                <View
                  key={index}
                  sx={{
                    width: 8,
                    height: 8,
                    borderRadius: 4,
                    backgroundColor: bgIndex === index ? '#0685f4' : 'rgba(6, 133, 244, 0.3)',
                  }}
                />
              ))}
            </View>
          </View>
        </View>
      </Animated.View>
    </View>
  )
}