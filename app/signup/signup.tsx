import { Image, Pressable, Text, View } from 'dripsy'
import { useFonts } from 'expo-font'
import { useRouter } from 'expo-router'
import { useEffect, useRef } from 'react'
import { Animated, Dimensions, SafeAreaView, StatusBar } from 'react-native'

const { width } = Dimensions.get('window')

export default function Signup() {
  const router = useRouter()
  
  // Animation ref
  const fadeAnim = useRef(new Animated.Value(0)).current
  const slideAnim = useRef(new Animated.Value(50)).current

  // Load Poppins fonts
  const [fontsLoaded] = useFonts({
    'Poppins-Regular': require('../../assets/fonts/Poppins/Poppins-Regular.ttf'),
    'Poppins-Medium': require('../../assets/fonts/Poppins/Poppins-Medium.ttf'),
    'Poppins-SemiBold': require('../../assets/fonts/Poppins/Poppins-SemiBold.ttf'),
    'Poppins-Bold': require('../../assets/fonts/Poppins/Poppins-Bold.ttf'),
    'Poppins-ExtraBold': require('../../assets/fonts/Poppins/Poppins-ExtraBold.ttf'),
  })

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      })
    ]).start()
  }, [fadeAnim, slideAnim])

  const handleClientSignup = () => {
    router.push('/signas/client')
  }

  const handleWorkerSignup = () => {
    router.push('/signas/worker')
  }

  if (!fontsLoaded) {
    return null
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#ffffff' }}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      
      <Animated.View
        style={{
          flex: 1,
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        }}
      >
        {/* Header */}
        <View sx={{
          alignItems: 'center',
          px: 'lg',
          pt: 'xl',
          pb: 'xl',
        }}>
          {/* Back button positioned absolutely */}
          <View sx={{
            position: 'absolute',
            left: 20,
            top: 24,
            zIndex: 1,
          }}>
            <Pressable
              onPress={() => router.back()}
              sx={{
                width: 40,
                height: 40,
                borderRadius: 20,
                backgroundColor: '#f8f9fa',
                justifyContent: 'center',
                alignItems: 'center',
              }}
              style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
            >
              <Text sx={{ fontSize: 18, color: '#001a33' }}>←</Text>
            </Pressable>
          </View>
          
          {/* Centered Logo */}
          <View sx={{
            alignItems: 'center',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 8,
            elevation: 5,
          }}>
            <Image
              source={require('../../assets/jdklogo.png')}
              style={{
                width: 100,
                height: 100,
              }}
              resizeMode="contain"
            />
          </View>
        </View>

        {/* Main Content */}
        <View sx={{
          flex: 1,
          justifyContent: 'center',
          px: 'xl',
          mx: 'lg',
        }}>
          {/* Title Section */}
          <View sx={{ mb: '2xl', alignItems: 'center' }}>
            <Text sx={{
              fontSize: 32,
              fontFamily: 'Poppins-ExtraBold',
              color: '#001a33',
              mb: 'sm',
              textAlign: 'center',
            }}>
              Join JDK HOMECARE
            </Text>
            
            <Text sx={{
              fontSize: 16,
              fontFamily: 'Poppins-Regular',
              color: '#4e6075',
              textAlign: 'center',
              mb: 'lg',
              lineHeight: 24,
            }}>
              Choose how you'd like to get started
            </Text>

            {/* Brand accent */}
            <View sx={{
              width: 50,
              height: 4,
              margin: 10,
              backgroundColor: '#0685f4',
              borderRadius: 2,
            }} />
          </View>

          {/* Role Selection Buttons */}
          <View sx={{ mb: '2xl' }}>
            <View sx={{ 
              flexDirection: 'row', 
              justifyContent: 'space-between',
            }}>
              {/* Client Button */}
              <Pressable
                onPress={handleClientSignup}
                sx={{
                  flex: 1,
                  backgroundColor: '#ffffff',
                  borderWidth: 2,
                  borderColor: '#0685f4',
                  borderRadius: 16,
                  p: 'lg',
                  alignItems: 'center',
                  minHeight: 160,
                  justifyContent: 'center',
                  shadowColor: '#0685f4',
                  shadowOffset: { width: 0, height: 3 },
                  shadowOpacity: 0.1,
                  shadowRadius: 8,
                  elevation: 4,
                  mr: 'md', // spacing between buttons
                }}
                style={({ pressed }) => [
                  {
                    opacity: pressed ? 0.9 : 1,
                    transform: [{ scale: pressed ? 0.97 : 1 }],
                  }
                ]}
              >
                <View sx={{
                  width: 50,
                  height: 50,
                  borderRadius: 25,
                  backgroundColor: '#0685f4',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mb: 'lg',
                }}>
                  <Text sx={{ fontSize: 24, color: '#ffffff' }}>🏠</Text>
                </View>
                
                <Text sx={{
                  fontSize: 16,
                  fontFamily: 'Poppins-Bold',
                  color: '#001a33',
                  mb: 'sm',
                  textAlign: 'center',
                }}>
                  Sign as Client
                </Text>
                
                <Text sx={{
                  fontSize: 12,
                  fontFamily: 'Poppins-Regular',
                  color: '#4e6075',
                  textAlign: 'center',
                  lineHeight: 16,
                }}>
                  Book home{'\n'}services
                </Text>
              </Pressable>

              {/* Worker Button */}
              <Pressable
                onPress={handleWorkerSignup}
                sx={{
                  flex: 1,
                  backgroundColor: '#0685f4',
                  borderRadius: 16,
                  p: 'lg',
                  alignItems: 'center',
                  minHeight: 160,
                  justifyContent: 'center',
                  shadowColor: '#0685f4',
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.3,
                  shadowRadius: 12,
                  elevation: 8,
                  ml: 'md', // spacing between buttons
                }}
                style={({ pressed }) => [
                  {
                    opacity: pressed ? 0.9 : 1,
                    transform: [{ scale: pressed ? 0.97 : 1 }],
                  }
                ]}
              >
                <View sx={{
                  width: 50,
                  height: 50,
                  borderRadius: 25,
                  backgroundColor: '#ffffff',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mb: 'lg',
                }}>
                  <Text sx={{ fontSize: 24, color: '#0685f4' }}>🔧</Text>
                </View>
                
                <Text sx={{
                  fontSize: 16,
                  fontFamily: 'Poppins-Bold',
                  color: '#ffffff',
                  mb: 'sm',
                  textAlign: 'center',
                }}>
                  Sign as Worker
                </Text>
                
                <Text sx={{
                  fontSize: 12,
                  fontFamily: 'Poppins-Regular',
                  color: '#ffffff',
                  textAlign: 'center',
                  lineHeight: 16,
                  opacity: 0.9,
                }}>
                  Offer your{'\n'}services
                </Text>
              </Pressable>
            </View>
          </View>

          {/* Additional Info */}
          <View sx={{ alignItems: 'center', mb: '2xl' }}>
            <Text sx={{
              margin: 10,
              fontSize: 14,
              fontFamily: 'Poppins-Regular',
              color: '#4e6075',
              textAlign: 'center',
              lineHeight: 20,
            }}>
              Already have an account?{' '}
              <Text sx={{
                color: '#0685f4',
                fontFamily: 'Poppins-SemiBold',
              }}>
                Sign in
              </Text>
            </Text>
          </View>
        </View>

        {/* Footer */}
        <View sx={{
          px: 'xl',
          pb: '2xl',
          alignItems: 'center',
        }}>
          <Text sx={{
            fontSize: 12,
            color: '#9aa4b2',
            textAlign: 'center',
            lineHeight: 18,
            fontFamily: 'Poppins-Regular',
          }}>
            By continuing, you agree to our Terms of Service{'\n'}
            and Privacy Policy
          </Text>
        </View>
      </Animated.View>
    </SafeAreaView>
  )
}
