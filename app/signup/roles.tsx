import { Image, Pressable, Text, View } from 'dripsy'
import { useFonts } from 'expo-font'
import { useRouter } from 'expo-router'
import { useState } from 'react'
import { ImageBackground } from 'react-native'

export default function Roles() {
  const router = useRouter()
  const [selectedRole, setSelectedRole] = useState<'client' | 'worker' | null>(null)

  const [fontsLoaded] = useFonts({
    'Poppins-Regular': require('../../assets/fonts/Poppins/Poppins-Regular.ttf'),
    'Poppins-Bold': require('../../assets/fonts/Poppins/Poppins-Bold.ttf'),
    'Poppins-ExtraBold': require('../../assets/fonts/Poppins/Poppins-ExtraBold.ttf'),
  })

  if (!fontsLoaded) return null

  const roles = [
    {
      key: 'client',
      label: "I'm a client, hiring for a service",
      route: './clientsignup',
    },
    {
      key: 'worker',
      label: "I'm a worker, looking for a service job",
      route: './workersignup',
    },
  ]

  const selected = roles.find(r => r.key === selectedRole)

  return (
    <ImageBackground
      source={require('../../assets/login.jpg')}
      resizeMode="cover"
      style={{ flex: 1 }}
    >
      <View
        sx={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          px: 'lg',
          bg: 'transparent',
        }}
      >
        {/* Logo */}
        <Image
          source={require('../../assets/jdklogo.png')}
          style={{
            width: 280,
            height: 280,
            alignSelf: 'center',
            marginBottom: -70,
            marginTop: -150,
          }}
          resizeMode="contain"
        />

        {/* Heading */}
        <View
          sx={{
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            mb: 'xl',
            flexWrap: 'wrap',
          }}
        >
          <Text
            sx={{
              fontSize: 24,
              fontWeight: 'normal',
              fontFamily: 'Poppins-Bold',
              color: 'text',
            }}
          >
            Join as a{' '}
          </Text>
          <Text
            sx={{
              fontSize: 24,
              fontWeight: 'extrabold',
              fontFamily: 'Poppins-Bold',
              color: '#008CFC',
            }}
          >
            Client
          </Text>
          <Text
            sx={{
              fontSize: 24,
              fontWeight: 'normal',
              fontFamily: 'Poppins-Bold',
              color: 'text',
            }}
          >
            {' '}or{' '}
          </Text>
          <Text
            sx={{
              fontSize: 24,
              fontWeight: 'extrabold',
              fontFamily: 'Poppins-Bold',
              color: '#008CFC',
            }}
          >
            Worker
          </Text>
        </View>

        {/* Role Options */}
        {roles.map(({ key, label }) => {
          const isSelected = selectedRole === key
          return (
            <Pressable
              key={key}
              onPress={() => setSelectedRole(key)}
              sx={{
                flexDirection: 'row',
                alignItems: 'center',
                bg: 'transparent',
                padding: 'lg',
                borderRadius: 8,
                mb: 'md',
                width: '100%',
                borderWidth: 2,
                borderColor: isSelected ? '#008CFC' : '#ccc',
                opacity: isSelected ? 1 : 0.85,
              }}
            >
              {/* Circle Indicator */}
              <View
                sx={{
                  width: 20,
                  height: 20,
                  borderRadius: 10,
                  borderWidth: 2,
                  borderColor: isSelected ? '#008CFC' : '#ccc',
                  bg: isSelected ? '#008CFC' : 'transparent',
                  mr: 'md',
                }}
              />

              {/* Role Label */}
              <Text
                sx={{
                  flex: 1,
                  textAlign: 'left',
                  color: isSelected ? '#008CFC' : 'text',
                  fontWeight: 'bold',
                  fontSize: 14,
                  fontFamily: 'Poppins-Regular',
                }}
              >
                {label}
              </Text>
            </Pressable>

          )
        })}

        {/* Continue Button */}
        <Pressable
          onPress={() => {
            if (selected) router.push(selected.route)
          }}
          sx={{
            mt: 'sm',
            py: 10,
            px: 'lg',
            borderRadius: 8,
            borderColor: selected ? '#008CFC' : '#ccc',
            bg: selected ? '#008CFC' : '#f0f0f0',
            alignItems: 'center',
            width: '100%',
            opacity: selected ? 1 : 0.9,
          }}
        >
          <Text
            sx={{
              fontSize: 20,
              fontWeight: 'bold',
              fontFamily: 'Poppins-ExtraBold',
              color: selected ? '#fff' : '#999',
            }}
          >
            {selectedRole === 'client'
              ? 'Create Account as Client'
              : selectedRole === 'worker'
              ? 'Create Account as Worker'
              : 'Create Account'}
          </Text>
        </Pressable>

        {/* Login Link */}
        <View
          sx={{
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            mb: 'md',
            mt: 'md',
          }}
        >
          <Text
            sx={{
              fontSize: 14,
              fontWeight: 'normal',
              fontFamily: 'Poppins-Regular',
              color: 'text',
            }}
          >
            Already have an account?{' '}
          </Text>
          <Pressable onPress={() => router.push('/login/login')}>
            <Text
              sx={{
                fontSize: 14,
                fontWeight: 'normal',
                fontFamily: 'Poppins-Regular',
                color: '#008CFC',
                textDecorationLine: 'underline',
              }}
            >
              Login
            </Text>
          </Pressable>
        </View>
      </View>
    </ImageBackground>
  )
}
