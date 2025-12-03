import { Image, Pressable, Text, View } from 'dripsy'
import { useRouter } from 'expo-router'
import React, { useEffect, useRef, useState } from 'react'
import { Animated, useWindowDimensions } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

const BG = '#f1f1f1'
const PRIMARY = '#0057FF'
const TEXT = '#111827'
const MUTED = '#6B7280'
const BORDER = '#E5E7EB'

const serviceImages = [
  { src: require('../assets/Carpenter.png'), label: 'Carpentry services' },
  { src: require('../assets/Electrician.png'), label: 'Electrical services' },
  { src: require('../assets/Plumber.png'), label: 'Plumbing services' },
  { src: require('../assets/Car Washer.png'), label: 'Car washing services' },
  { src: require('../assets/Laundry.png'), label: 'Laundry services' },
]

export default function GetStarted() {
  const router = useRouter()
  const [index, setIndex] = useState(0)
  const fadeAnim = useRef(new Animated.Value(1)).current
  const { width, height } = useWindowDimensions()

  // dynamic sizes for responsiveness
  const horizontalPadding = width < 360 ? 16 : 20
  const cardHeight = Math.min(360, height * 0.45) // hero box height
  const logoWidth = Math.min(140, width * 0.35)
  const circleTopSize = width * 0.45
  const circleBottomSize = width * 0.6

  // fine-tuned responsive offsets to keep same look on different sizes
  const cardRightOffset = width * 0.045          // ~18px on 400px wide screens
  const imageRightOffset = width * 0.075         // ~30px on 400px wide screens
  const mainTextBottomOffset = height * 0.02     // 2% of screen height
  const subTextBottomOffset = height * 0.0125    // 1.25% of screen height

  // image scaling based on screen size (keeps same visual feel but avoids over-crop)
  const imageWidthPercent =
    width < 360 ? '135%' : width < 400 ? '125%' : '120%'
  const imageHeightPercent = height < 640 ? '115%' : '120%'

  // Dissolve carousel
  useEffect(() => {
    const interval = setInterval(() => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }).start(() => {
        setIndex((prev) => (prev + 1) % serviceImages.length)
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 550,
          useNativeDriver: true,
        }).start()
      })
    }, 3200)

    return () => clearInterval(interval)
  }, [fadeAnim])

  const handleLogin = () => router.push('/login/login')
  const handleSignup = () => router.push('/signup/roles')

  const current = serviceImages[index]

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: BG }}>
      <View
        sx={{
          flex: 1,
          px: horizontalPadding,
          pt: 20,
          pb: 20,
          backgroundColor: BG,
        }}
      >
        {/* Background circles */}
        <View
          pointerEvents="none"
          sx={{
            position: 'absolute',
            top: -circleTopSize * 0.25,
            right: -circleTopSize * 0.4,
            width: circleTopSize,
            height: circleTopSize,
            borderRadius: 999,
            backgroundColor: '#EFF6FF',
          }}
        />
        <View
          pointerEvents="none"
          sx={{
            position: 'absolute',
            bottom: height * 0.22,
            left: -circleBottomSize * 0.45,
            width: circleBottomSize,
            height: circleBottomSize,
            borderRadius: 999,
            backgroundColor: '#E0ECFF',
          }}
        />

        {/* Logo */}
        <View
          sx={{
            alignItems: 'flex-start',
            mb: 16,
          }}
        >
          <Image
            source={require('../assets/jdklogo.png')}
            style={{ width: logoWidth, height: 40 }}
            resizeMode="contain"
          />
        </View>

        {/* Box that touches the LEFT edge (like your design) */}
        <View
          sx={{
            // break out only on the LEFT: match the screen padding
            ml: -horizontalPadding,
            mr: 0,
            mb: 24,
          }}
        >
          <View
            sx={{
              borderWidth: 1,
              borderColor: BORDER,
              borderTopLeftRadius: 0,
              borderBottomLeftRadius: 0,
              borderTopRightRadius: 16,
              borderBottomRightRadius: 16,
              overflow: 'hidden',
              height: cardHeight,
              backgroundColor: '#F9FAFB',
              right: cardRightOffset,
            }}
          >
            <Animated.Image
              source={current.src}
              style={{
                width: imageWidthPercent,
                height: imageHeightPercent,
                opacity: fadeAnim,
                right: imageRightOffset,
              }}
              resizeMode="contain"
            />
          </View>
        </View>

        {/* Pagination spacing (dots removed, spacing kept) */}
        <View
          sx={{
            flexDirection: 'row',
            justifyContent: 'center',
            mb: 24,
          }}
        >
          {/* dots removed as requested */}
        </View>

        {/* Text content */}
        <View
          sx={{
            mb: 32,
          }}
        >
          <Text
            sx={{
              fontSize: width < 360 ? 13 : 14,
              lineHeight: 22,
              color: TEXT,
              textAlign: 'left',
              bottom: mainTextBottomOffset,
            }}
          >
            <Text
              sx={{
                color: PRIMARY,
                fontWeight: '700',
              }}
            >
              JDK Homecare{' '}
            </Text>
            helps you easily book trusted home service workers and track every
            job in one simple app.
          </Text>

          {/* 🔹 Small description added below main description */}
          <Text
            sx={{
              mt: 6,
              fontSize: 12,
              color: MUTED,
              textAlign: 'left',
              bottom: subTextBottomOffset,
            }}
          >
            Designed for both clients and workers, so every home service request
            stays clear, organized, and easy to manage.
          </Text>
        </View>

        {/* Push buttons to bottom */}
        <View sx={{ flex: 1 }} />

        {/* Buttons */}
        <View>
          {/* Log in */}
          <Pressable
            onPress={handleLogin}
            sx={{
              borderRadius: 999,
              overflow: 'hidden',
              mb: 12,
            }}
          >
            <View
              sx={{
                borderRadius: 999,
                py: 14,
                alignItems: 'center',
                backgroundColor: PRIMARY,
              }}
            >
              <Text
                sx={{
                  fontSize: 15,
                  fontWeight: '600',
                  color: '#FFFFFF',
                }}
              >
                Log in
              </Text>
            </View>
          </Pressable>

          {/* Sign up */}
          <Pressable
            onPress={handleSignup}
            sx={{
              borderRadius: 999,
              overflow: 'hidden',
            }}
          >
            <View
              sx={{
                borderRadius: 999,
                py: 14,
                alignItems: 'center',
                backgroundColor: '#FFFFFF',
                borderWidth: 1,
                borderColor: BORDER,
              }}
            >
              <Text
                sx={{
                  fontSize: 15,
                  fontWeight: '600',
                  color: TEXT,
                }}
              >
                Sign up
              </Text>
            </View>
          </Pressable>

          <Text
            sx={{
              mt: 10,
              fontSize: 10,
              color: MUTED,
              textAlign: 'center',
            }}
          >
            By continuing, you agree to the terms and privacy policy.
          </Text>
        </View>
      </View>
    </SafeAreaView>
  )
}
