import { Image, Pressable, Text, View } from 'dripsy'
import { useFonts } from 'expo-font'
import { useRouter } from 'expo-router'
import { MotiView } from 'moti'
import { useRef, useState } from 'react'
import {
  Dimensions,
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
} from 'react-native'
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context'

const { width: screenWidth, height: screenHeight } = Dimensions.get('window')

export default function Index() {
  const router = useRouter()
  const [currentIndex, setCurrentIndex] = useState(0)
  const scrollRef = useRef<ScrollView>(null)
  const insets = useSafeAreaInsets()

  const [fontsLoaded] = useFonts({
    'Poppins-Regular': require('../assets/fonts/Poppins/Poppins-Regular.ttf'),
    'Poppins-Bold': require('../assets/fonts/Poppins/Poppins-Bold.ttf'),
    'Poppins-ExtraBold': require('../assets/fonts/Poppins/Poppins-ExtraBold.ttf'),
  })

  if (!fontsLoaded) return null

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const page = Math.round(event.nativeEvent.contentOffset.x / screenWidth)
    setCurrentIndex(page)
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        style={{ flex: 1 }}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        {/* Slide 1 */}
        <SafeAreaView
          style={{
            width: screenWidth,
            height: screenHeight,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <MotiView
            from={{ opacity: 0, translateY: 20 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: 'timing', duration: 500, delay: 200 }}
            style={{ alignItems: 'center', justifyContent: 'center' }}
          >
            <Image
              source={require('../assets/1.jpg')}
              style={{
                width: 240,
                height: 160,
                marginBottom: 16,
                marginTop: 50,
              }}
              resizeMode="cover"
            />
            <Text
              sx={{
                fontSize: 26,
                fontFamily: 'Poppins-ExtraBold',
                color: '#008cfd',
                textAlign: 'center',
              }}
            >
              Welcome to
            </Text>
            <Image
              source={require('../assets/jdklogo.png')}
              style={{
                width: 250,
                height: 250,
                marginTop: -80,
              }}
              resizeMode="contain"
            />
            <Text
              sx={{
                fontSize: 16,
                fontFamily: 'Poppins-Regular',
                color: '#4e6075',
                textAlign: 'center',
                maxWidth: 300,
                mb: 100,
              }}
            >
              Reliable home services for a safer, better home.
            </Text>
          </MotiView>
        </SafeAreaView>

        {/* Slide 2 */}
        <SafeAreaView
          style={{
            width: screenWidth,
            height: screenHeight,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <MotiView
            from={{ opacity: 0, translateY: 20 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: 'timing', duration: 500, delay: 200 }}
            style={{ alignItems: 'center', justifyContent: 'center' }}
          >
            <Image
              source={require('../assets/2.png')}
              style={{
                width: 280,
                height: 200,
                marginLeft: -26,
                marginTop: -80,
              }}
              resizeMode="contain"
            />
            <Text
              sx={{
                fontSize: 26,
                fontFamily: 'Poppins-ExtraBold',
                color: '#008cfd',
                textAlign: 'center',
                mb: -20,
              }}
            >
              JDK Homecare:
            </Text>
            <Text
              sx={{
                fontSize: 26,
                fontFamily: 'Poppins-ExtraBold',
                color: '#008cfd',
                textAlign: 'center',
                mb: -20,
              }}
            >
              Home Service and
            </Text>
            <Text
              sx={{
                fontSize: 26,
                fontFamily: 'Poppins-ExtraBold',
                color: '#008cfd',
                textAlign: 'center',
                mb: 'sm',
              }}
            >
              Maintenance
            </Text>
            <Text
              sx={{
                fontSize: 12,
                fontFamily: 'Poppins-Regular',
                color: '#4e6075',
                textAlign: 'center',
                maxWidth: 320,
                mt: 12,
              }}
            >
              Connects clients with skilled workers to get their home services done. Whether you’re looking for a plumber, electrician, cleaner, or handyman, our platform makes it easy to find trusted workers. For workers, it’s a great opportunity to offer your skills and connect with clients in need of your expertise. Everyone’s home deserves the best care, and we’re here to make it happen.
            </Text>
          </MotiView>
        </SafeAreaView>

        {/* Slide 3 */}
        <SafeAreaView
          style={{
            width: screenWidth,
            height: screenHeight,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <MotiView
            from={{ opacity: 0, translateY: 20 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: 'timing', duration: 500, delay: 200 }}
            style={{ alignItems: 'center', justifyContent: 'center' }}
          >
            <Image
              source={require('../assets/3.jpg')}
              style={{ width: 260, height: 160, marginBottom: 16 }}
              resizeMode="cover"
            />
            <Text
              sx={{
                fontSize: 22,
                fontFamily: 'Poppins-ExtraBold',
                color: '#008cfd',
                textAlign: 'center',
                mb: 'sm',
              }}
            >
              Why Choose JDK HOMECARE?
            </Text>
            <Text
              sx={{
                fontSize: 14,
                fontFamily: 'Poppins-Regular',
                color: '#4e6075',
                textAlign: 'center',
                maxWidth: 300,
                mt: 16,
              }}
            >
              Home services and maintenance to keep your home in top shape. Whether it’s routine upkeep or unexpected repairs, our expert team is here to deliver fast, trusted solutions for all your needs.
            </Text>
          </MotiView>
        </SafeAreaView>
      </ScrollView>

      {/* Carousel Indicator */}
      <View
        style={{
          position: 'absolute',
          bottom: 140,
          left: 0,
          right: 0,
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          paddingHorizontal: insets.left + insets.right,
        }}
      >
        {[0, 1, 2].map((idx) => (
          <View
            key={idx}
            sx={{
              width: 10,
              height: 10,
              borderRadius: 5,
              bg: currentIndex === idx ? '#008cfd' : '#d1d5db',
              mx: 4,
            }}
          />
        ))}
      </View>

      {/* Get Started Button */}
      <View
        sx={{
          position: 'absolute',
          bottom: 60,
          left: 0,
          right: 0,
          alignItems: 'center',
        }}
      >
        <Pressable
          onPress={() => router.push('/login/login')}
          sx={{
            bg: '#008cfd',
            py: 16,
            px: 32,
            borderRadius: 30,
            minWidth: 180,
            alignItems: 'center',
          }}
        >
          <Text
            sx={{
              color: 'white',
              fontSize: 20,
              fontWeight: 'bold',
              fontFamily: 'Poppins-Bold',
            }}
          >
            Get Started
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  )
}
