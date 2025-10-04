import { Ionicons } from '@expo/vector-icons'
import { Text, View } from 'dripsy'
import { useRouter } from 'expo-router'
import { useState } from 'react'
import { Image, Pressable } from 'react-native'

const Header = () => {
  const router = useRouter()
  const [menuOpen, setMenuOpen] = useState(false)
  const [submenuOpen, setSubmenuOpen] = useState(false)

  return (
    <View>
      {/* Top Header Row */}
      <View
        sx={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          mb: 24,
        }}
      >
        {/* Logo */}
        <Image
          source={require('../../../assets/jdklogo.png')}
          style={{
            width: 120,
            height: 32,
            resizeMode: 'contain',
          }}
        />

        <View sx={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
          <Pressable onPress={() => router.push('/search')}>
            <Ionicons name="search" size={24} color="#001a33" />
          </Pressable>

          <Pressable onPress={() => router.push('/notifications')}>
            <Ionicons name="notifications-outline" size={24} color="#001a33" />
          </Pressable>

          <Pressable onPress={() => setMenuOpen(prev => !prev)}>
            <Ionicons name="menu" size={28} color="#001a33" />
          </Pressable>
        </View>
      </View>

      {/* Dropdown Menu */}
      {menuOpen && (
        <View
          sx={{
            bg: '#fff',
            borderRadius: 12,
            p: 16,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.1,
            shadowRadius: 2,
            elevation: 2,
            gap: 12,
          }}
        >
          {/* Manage Request */}
          <Pressable onPress={() => setSubmenuOpen(prev => !prev)}>
            <Text sx={{ fontSize: 16, fontFamily: 'Poppins-Bold', color: '#001a33' }}>
              Manage Request
            </Text>
          </Pressable>

          {submenuOpen && (
            <View sx={{ pl: 12, gap: 8 }}>
              <Pressable onPress={() => router.push('./burgermenu/current')}>
                <Text sx={{ fontSize: 14, fontFamily: 'Poppins-Regular', color: '#4b5563' }}>
                  Current Service Requests
                </Text>
              </Pressable>
              <Pressable onPress={() => router.push('./burgermenu/completed')}>
                <Text sx={{ fontSize: 14, fontFamily: 'Poppins-Regular', color: '#4b5563' }}>
                  Completed Requests
                </Text>
              </Pressable>
            </View>
          )}

          {/* Hire a Worker */}
          <Pressable onPress={() => router.push('./burgermenu/hire')}>
            <Text sx={{ fontSize: 16, fontFamily: 'Poppins-Bold', color: '#001a33' }}>
              Hire a Worker
            </Text>
          </Pressable>
        </View>
      )}
    </View>
  )
}

export default Header