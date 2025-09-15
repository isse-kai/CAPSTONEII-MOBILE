import { Pressable, ScrollView, Text, View } from 'dripsy'
import { useFonts } from 'expo-font'
import { useRouter } from 'expo-router'
import { useEffect, useRef } from 'react'
import { Animated, SafeAreaView, StatusBar } from 'react-native'

export default function LearnMore() {
  const router = useRouter()
  const fadeAnim = useRef(new Animated.Value(0)).current
  const slideAnim = useRef(new Animated.Value(50)).current

  const [fontsLoaded] = useFonts({
    'Poppins-Regular': require('../../assets/fonts/Poppins/Poppins-Regular.ttf'),
    'Poppins-Medium': require('../../assets/fonts/Poppins/Poppins-Medium.ttf'),
    'Poppins-SemiBold': require('../../assets/fonts/Poppins/Poppins-SemiBold.ttf'),
    'Poppins-Bold': require('../../assets/fonts/Poppins/Poppins-Bold.ttf'),
    'Poppins-ExtraBold': require('../../assets/fonts/Poppins/Poppins-ExtraBold.ttf'),
  })

  useEffect(() => {
    // Entrance animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start()
  }, [fadeAnim, slideAnim])

  if (!fontsLoaded) {
    return null
  }

  // Line 43: ServiceCard
type ServiceCardProps = {
  icon: string
  title: string
  description: string
}

const ServiceCard = ({ icon, title, description }: ServiceCardProps) => (
  <View sx={{
    backgroundColor: '#ffffff',
    borderRadius: 12,
    p: 'lg',
    mb: 'md',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  }}>
    <Text sx={{ fontSize: 24, mb: 'sm' }}>{icon}</Text>
    <Text sx={{
      fontSize: 16,
      fontFamily: 'Poppins-SemiBold',
      color: '#001a33',
      mb: 'sm',
    }}>
      {title}
    </Text>
    <Text sx={{
      fontSize: 14,
      fontFamily: 'Poppins-Regular',
      color: '#4e6075',
      lineHeight: 20,
    }}>
      {description}
    </Text>
  </View>
)


  // Line 73: FeatureItem
type FeatureItemProps = {
  title: string
  description: string
}

const FeatureItem = ({ title, description }: FeatureItemProps) => (
  <View sx={{ flexDirection: 'row', mb: 'md', alignItems: 'flex-start' }}>
    <View sx={{
      width: 6,
      height: 6,
      borderRadius: 3,
      backgroundColor: '#0685f4',
      mt: 'sm',
      mr: 'md',
    }} />
    <View sx={{ flex: 1 }}>
      <Text sx={{
        fontSize: 14,
        fontFamily: 'Poppins-SemiBold',
        color: '#001a33',
        mb: 'xs',
      }}>
        {title}
      </Text>
      <Text sx={{
        fontSize: 13,
        fontFamily: 'Poppins-Regular',
        color: '#4e6075',
        lineHeight: 18,
      }}>
        {description}
      </Text>
    </View>
  </View>
)

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f8f9fa' }}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8f9fa" />
      
      <Animated.View
        style={{
          flex: 1,
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        }}
      >
        <ScrollView style={{ flex: 1 }}>
          {/* Header */}
          <View sx={{
            backgroundColor: '#ffffff',
            px: 'lg',
            py: 'lg',
            borderBottomLeftRadius: 20,
            borderBottomRightRadius: 20,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 3,
          }}>
            <View sx={{ flexDirection: 'row', alignItems: 'center', mb: 'lg' }}>
              <Pressable
                onPress={() => router.back()}
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: 20,
                  backgroundColor: '#f0f0f0',
                  justifyContent: 'center',
                  alignItems: 'center',
                  mr: 'md',
                }}
              >
                <Text sx={{ fontSize: 18 }}>←</Text>
              </Pressable>
              
              <View sx={{ flex: 1 }}>
                <Text sx={{
                  fontSize: 24,
                  fontFamily: 'Poppins-Bold',
                  color: '#001a33',
                }}>
                  About JDK HOMECARE
                </Text>
              </View>
            </View>
          </View>

          {/* Content */}
          <View sx={{ px: 'lg', py: 'lg' }}>
            {/* Mission Statement */}
            <View sx={{ mb: 'xl' }}>
              <Text sx={{
                fontSize: 18,
                fontFamily: 'Poppins-SemiBold',
                color: '#0685f4',
                mb: 'md',
                textAlign: 'center',
              }}>
                Your Trusted Home Service Partner
              </Text>
              <Text sx={{
                fontSize: 15,
                fontFamily: 'Poppins-Regular',
                color: '#4e6075',
                lineHeight: 22,
                textAlign: 'center',
                mb: 'lg',
              }}>
                JDK HOMECARE connects homeowners with skilled professionals to ensure your home 
                receives the best care possible. We believe every home deserves quality service.
              </Text>
            </View>

            {/* Services Section */}
            <View sx={{ mb: 'xl' }}>
              <Text sx={{
                fontSize: 20,
                fontFamily: 'Poppins-Bold',
                color: '#001a33',
                mb: 'lg',
              }}>
                Our Services
              </Text>

              <ServiceCard
                icon="🔧"
                title="Plumbing Services"
                description="Professional plumbers for repairs, installations, and maintenance"
              />

              <ServiceCard
                icon="⚡"
                title="Electrical Work"
                description="Licensed electricians for safe and reliable electrical services"
              />

              <ServiceCard
                icon="🔨"
                title="Carpentry & Repairs"
                description="Skilled carpenters for home improvements and repairs"
              />

              <ServiceCard
                icon="🧹"
                title="Cleaning Services"
                description="Professional cleaning for homes and offices"
              />
            </View>

            {/* Why Choose Us */}
            <View sx={{ mb: 'xl' }}>
              <Text sx={{
                fontSize: 20,
                fontFamily: 'Poppins-Bold',
                color: '#001a33',
                mb: 'lg',
              }}>
                Why Choose JDK HOMECARE?
              </Text>

              <View sx={{
                backgroundColor: '#ffffff',
                borderRadius: 12,
                p: 'lg',
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 8,
                elevation: 3,
              }}>
                <FeatureItem
                  title="Trusted Professionals"
                  description="All workers are vetted and verified for your safety"
                />
                <FeatureItem
                  title="Easy Booking"
                  description="Simple app-based booking system"
                />
                <FeatureItem
                  title="Quality Assurance"
                  description="We ensure high-quality service delivery"
                />
                <FeatureItem
                  title="24/7 Support"
                  description="Customer support available when you need it"
                />
                <FeatureItem
                  title="Fair Pricing"
                  description="Transparent and competitive pricing"
                />
              </View>
            </View>

            {/* How It Works */}
            <View sx={{ mb: 'xl' }}>
              <Text sx={{
                fontSize: 20,
                fontFamily: 'Poppins-Bold',
                color: '#001a33',
                mb: 'lg',
              }}>
                How It Works
              </Text>

              {[ "Choose your required service", "Get matched with qualified workers", "Schedule and enjoy quality service" ].map((step, index) => (
                <View key={index} sx={{ flexDirection: 'row', alignItems: 'center', mb: 'lg' }}>
                  <View sx={{
                    width: 30,
                    height: 30,
                    borderRadius: 15,
                    backgroundColor: '#0685f4',
                    justifyContent: 'center',
                    alignItems: 'center',
                    mr: 'md',
                  }}>
                    <Text sx={{ color: '#ffffff', fontFamily: 'Poppins-Bold' }}>{index + 1}</Text>
                  </View>
                  <Text sx={{
                    flex: 1,
                    fontSize: 14,
                    fontFamily: 'Poppins-Regular',
                    color: '#4e6075',
                  }}>
                    {step}
                  </Text>
                </View>
              ))}
            </View>

            {/* Call to Action */}
            <View sx={{ alignItems: 'center', pb: 'xl' }}>
              <Pressable
                onPress={() => router.push('/login/login')}
                sx={{
                  backgroundColor: '#0685f4',
                  py: 'lg',
                  px: 'xl',
                  borderRadius: 12,
                  width: '100%',
                  shadowColor: '#0685f4',
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.3,
                  shadowRadius: 8,
                  elevation: 8,
                  mb: 'md',
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
                  fontFamily: 'Poppins-SemiBold',
                  textAlign: 'center',
                }}>
                  Get Started Today
                </Text>
              </Pressable>

              <Text sx={{
                fontSize: 12,
                fontFamily: 'Poppins-Regular',
                color: '#4e6075',
                textAlign: 'center',
              }}>
                Join thousands of satisfied customers
              </Text>
            </View>
          </View>
        </ScrollView>
      </Animated.View>
    </SafeAreaView>
  )
}