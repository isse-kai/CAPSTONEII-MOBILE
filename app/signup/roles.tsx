import { Pressable, Text, View } from 'dripsy'
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
        <Text
          sx={{
            fontSize: 28,
            fontWeight: 'bold',
            fontFamily: 'Poppins-Bold',
            mb: 'xl',
            textAlign: 'center',
            color: 'text',
          }}
        >
          Are you a Client or a Worker?
        </Text>

        {roles.map(({ key, label }) => {
          const isSelected = selectedRole === key
          return (
            <Pressable
              key={key}
              onPress={() => setSelectedRole(key as 'client' | 'worker')}
              sx={{
                bg: 'transparent',
                py: 'md',
                px: 'lg',
                borderRadius: 8,
                mb: 'md',
                width: '100%',
                alignItems: 'center',
                borderWidth: 2,
                borderColor: isSelected ? '#008CFC' : '#ccc',
                opacity: isSelected ? 1 : 0.85,
              }}
            >
              <Text
                sx={{
                  textAlign: 'center',
                  color: isSelected ? '#008CFC' : 'text',
                  fontWeight: 'bold',
                  fontSize: 18,
                  fontFamily: 'Poppins-Regular',
                }}
              >
                {label}
              </Text>
            </Pressable>
          )
        })}

        {selectedRole && (
          <Pressable
            onPress={() => {
              if (selectedRole) {
                const selected = roles.find(r => r.key === selectedRole)
                if (selected) router.push(selected.route)
              }
            }}
            sx={{
              mt: 'lg',
              py: 10,
              px: 'lg',
              borderRadius: 8,
              borderWidth: 1,
              borderColor: selectedRole ? '#008CFC' : '#ccc',
              bg: 'transparent',
              alignItems: 'center',
              width: '100%',
              opacity: selectedRole ? 1 : 0.5,
              pointerEvents: selectedRole ? 'auto' : 'none',
            }}
          >
            <Text
              sx={{
                fontSize: 20,
                fontWeight: 'bold',
                fontFamily: 'Poppins-ExtraBold',
                color: selectedRole ? '#008CFC' : '#999',
              }}
            >
              Continue
            </Text>
          </Pressable>

        )}
      </View>
    </ImageBackground>
  )
}
