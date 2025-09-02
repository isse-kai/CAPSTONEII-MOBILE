import { Image, Pressable, Text, View } from 'dripsy'
import { useFonts } from 'expo-font'
import { useRouter } from 'expo-router'
import { MotiView } from 'moti'
import { useRef, useState } from 'react'
import {
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  useWindowDimensions,
} from 'react-native'

const carouselData = [
  {
    key: '1',
    vector: require('../assets/1.jpg'),
    title: 'Welcome to',
    description: 'Reliable home services for a safer, better home.',
    showLogo: true,
  },
  {
    key: '2',
    vector: require('../assets/2.png'),
    title: 'JDK HOMECARE: Home Service and Maintenance',
    description:
      'Connects clients with skilled workers to get their home services done. Whether you’re looking for a plumber, electrician, cleaner, or handyman, our platform makes it easy to find trusted workers. For workers, it’s a great opportunity to offer your skills and connect with clients in need of your expertise. Everyone’s home deserves the best care, and we’re here to make it happen.',
    showLogo: false,
  },
  {
    key: '3',
    vector: require('../assets/3.jpg'),
    title: 'Why Choose JDK HOMECARE?',
    description:
      'Home services and maintenance to keep your home in top shape. Whether it’s routine upkeep or unexpected repairs, our expert team is here to deliver fast, trusted solutions for all your needs.',
    showLogo: false,
  },
]

export default function Index() {
  const router = useRouter()
  const { width, height } = useWindowDimensions()
  const [currentIndex, setCurrentIndex] = useState(0)
  const scrollRef = useRef<ScrollView>(null)

  const [fontsLoaded] = useFonts({
    'Poppins-Regular': require('../assets/fonts/Poppins/Poppins-Regular.ttf'),
    'Poppins-Bold': require('../assets/fonts/Poppins/Poppins-Bold.ttf'),
    'Poppins-ExtraBold': require('../assets/fonts/Poppins/Poppins-ExtraBold.ttf'),
  })

  if (!fontsLoaded) return null

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const page = Math.round(event.nativeEvent.contentOffset.x / width)
    setCurrentIndex(page)
  }

  return (
    <View sx={{ flex: 1, bg: 'white' }}>
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        style={{ flex: 1 }}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        {carouselData.map((item, idx) => (
          <View
            key={item.key}
            style={{
              width,
              height,
              justifyContent: 'center',
              alignItems: 'center',
              paddingHorizontal: 24,
            }}
          >
            <MotiView
              from={{ opacity: 0, translateY: 20 }}
              animate={{ opacity: 1, translateY: 0 }}
              transition={{ type: 'timing', duration: 500, delay: 200 }}
              style={{ alignItems: 'center' }}
            >
              <Image
                source={item.vector}
                style={{
                  width: width * 0.7,
                  height: width * 0.5,
                  marginBottom: 20,
                }}
                resizeMode="contain"
              />

              <Text
                sx={{
                  fontSize: 24,
                  fontWeight: '300',
                  color: '#008cfd',
                  fontFamily: 'Poppins-ExtraBold',
                  mb: 'sm',
                  textAlign: 'center',
                  maxWidth: 320,
                }}
              >
                {item.title}
              </Text>

              {item.showLogo && (
                <Image
                  source={require('../assets/jdklogo.png')}
                  style={{
                    width: width * 0.6,
                    height: width * 0.6,
                    marginTop: -80,
                    marginBottom: 20,
                  }}
                  resizeMode="contain"
                />
              )}

              <Text
                sx={{
                  fontSize: idx === 1 ? 12 : idx === 2 ? 14 : 16,
                  color: '#4e6075',
                  textAlign: 'center',
                  fontFamily: 'Poppins-Regular',
                  maxWidth: 320,
                  mt: item.showLogo ? 0 : 20,
                }}
              >
                {item.description}
              </Text>
            </MotiView>
          </View>
        ))}
      </ScrollView>

      {/* Carousel Indicator */}
      <View
        sx={{
          position: 'absolute',
          bottom: 140,
          left: 0,
          right: 0,
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        {carouselData.map((_, idx) => (
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
          style={({ pressed }) => ({
            backgroundColor: pressed ? '#003255ff' : '#008cfd',
            paddingVertical: 16,
            paddingHorizontal: 32,
            borderRadius: 30,
            minWidth: width * 0.5,
            alignItems: 'center',
            opacity: pressed ? 0.85 : 1,
          })}
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
    </View>
  )
}
