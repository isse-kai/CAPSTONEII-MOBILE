import { Pressable, Text, View } from 'dripsy'
import { usePathname, useRouter } from 'expo-router'
import React from 'react'
import { Image } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

export default function ClientNavbar() {
  const insets = useSafeAreaInsets()
  const router = useRouter()
  const pathname = usePathname()

  const navItems = [
    {
      label: 'Home',
      route: '/clientpage/home',
      icon: require('../../../assets/home-icon.png'),
    },
    {
      label: 'Messages',
      route: '/clientpage/clientnavbar/chat',
      icon: require('../../../assets/chat-icon.png'),
    },
    {
      label: 'Profile',
      route: '/clientpage/clientnavbar/profile',
      icon: require('../../../assets/profile-icon.png'),
    },
  ]

  return (
    <View
      sx={{
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        paddingBottom: insets.bottom + 4,
        paddingTop: 8,
        bg: '#ffffff',
        borderTopWidth: 1,
        borderColor: '#e5e7eb',
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 100,
      }}
    >
      {navItems.map(item => {
        const isActive = pathname === item.route
        return (
          <Pressable
            key={item.route}
            onPress={() => router.replace(item.route as any)}
            sx={{ alignItems: 'center', flex: 1 }}
          >
            <Image
              source={item.icon}
              style={{
                width: 24,
                height: 24,
                tintColor: isActive ? '#008CFC' : '#6b7280',
                marginBottom: 4,
              }}
              resizeMode="contain"
            />
            <Text
              sx={{
                fontSize: 12,
                fontFamily: 'Poppins-Regular',
                color: isActive ? '#008CFC' : '#6b7280',
              }}
            >
              {item.label}
            </Text>
          </Pressable>
        )
      })}
    </View>
  )
}
