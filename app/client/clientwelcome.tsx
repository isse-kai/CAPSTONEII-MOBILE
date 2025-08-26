import { Text, View } from 'dripsy'
import { useRouter } from 'expo-router'
import { useRef } from 'react'
import { Animated, Dimensions, Image, ImageBackground, PanResponder, ScrollView } from 'react-native'

const { width } = Dimensions.get('window')

export default function ClientWelcome() {
  const router = useRouter()
  const firstName = 'Juan'
  const lastName = 'Dela Cruz'
  const sex = 'Male'
  const prefix = sex === 'Male' ? 'Mr.' : sex === 'Female' ? 'Ms.' : ''

  const translateX = useRef(new Animated.Value(0)).current

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return (
          Math.abs(gestureState.dx) > 20 &&
          Math.abs(gestureState.dx) > Math.abs(gestureState.dy) &&
          gestureState.dx > 0
        )
      },
      onPanResponderMove: Animated.event(
        [null, { dx: translateX }],
        { useNativeDriver: false }
      ),
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dx > width * 0.3) {
          Animated.timing(translateX, {
            toValue: width,
            duration: 250,
            useNativeDriver: true,
          }).start(() => {
            router.replace('/clienthome')
          })
        } else {
          // Otherwise, snap back
          Animated.spring(translateX, {
            toValue: 0,
            useNativeDriver: true,
          }).start()
        }
      },
    })
  ).current

  return (
    <ImageBackground
      source={require('../../assets/welcome.jpg')}
      style={{ flex: 1 }}
      resizeMode="cover"
    >
      <ScrollView style={{ flex: 1 }}>
        <Animated.View
          style={{
            flex: 1,
            paddingHorizontal: 24,
            paddingVertical: 36,
            transform: [{ translateX }],
          }}
          {...panResponder.panHandlers}
        >
          {/* Logo */}
          <Image
            source={require('../../assets/jdklogo.png')}
            style={{
              width: 250,
              height: 250,
              alignSelf: 'flex-start',
              marginBottom: -80,
              marginTop: -90,
            }}
            resizeMode="contain"
          />

          <Text
            sx={{
              fontSize: 36,
              fontWeight: '400',
              textAlign: 'left',
              mb: -5,
              fontFamily: 'Poppins-ExtraBold',
            }}
          >
            Welcome Client, {prefix}{' '}
            <Text sx={{
              color: '#008cfc',
              fontFamily: 'Poppins-ExtraBold',
              fontWeight: '400',
              fontSize: 36
            }}>
              {firstName} {lastName}
            </Text>
            !
          </Text>

          <Text sx={{
            fontSize: 20,
            textAlign: 'left',
            fontFamily: 'Poppins-Regular',
            mb: 10
          }}>
            We’re excited to have you with us. Let’s get started with your first service request!
          </Text>

          <Text sx={{
            textAlign: 'left',
            mb: 10,
            fontSize: 20,
            fontFamily: 'Poppins-Regular'
          }}>
            <Text
              sx={{
                color: '#008cfc',
                fontFamily: 'Poppins-Bold',
                fontWeight: '400',
                fontSize: 20,
              }}
            >
              JDK HOMECARE
            </Text>
            {' '}
            provides better home service and maintenance solutions. Whether it’s cleaning, repairs, or anything in between, we’ve got you covered. Your satisfaction is our priority!
          </Text>

          <Text sx={{
            textAlign: 'left',
            mt: 5,
            mb: -20,
            fontSize: 20,
            color: '#6b7280',
          }}>
            We’re here to help you make your home a better place to live.
          </Text>

          {/* Swipe Label */}
          <View sx={{ alignItems: 'center', mt: 50, mb: 10 }}>
            <Text sx={{
              color: '#008cfc',
              fontSize: 18,
              fontFamily: 'Poppins-Bold',
              textAlign: 'center'
            }}>
              Swipe right anywhere to proceed &rarr;
            </Text>
          </View>
        </Animated.View>
      </ScrollView>
    </ImageBackground>
  )
}