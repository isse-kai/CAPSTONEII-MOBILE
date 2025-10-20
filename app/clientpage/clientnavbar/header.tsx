import { Ionicons } from '@expo/vector-icons'
import { Text, View } from 'dripsy'
import { useRouter } from 'expo-router'
import { useState } from 'react'
import { Image, Pressable } from 'react-native'

const Header = () => {
  const router = useRouter()
  const [menuOpen, setMenuOpen] = useState(false)
  const [submenuOpen, setSubmenuOpen] = useState(false)
  const [notificationsOpen, setNotificationsOpen] = useState(false)

  return (
    <View>
      {/* Top Header Row */}
      <View
        sx={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          mb: 20,
        }}
      >
        {/* Logo */}
        <Image
          source={require('../../../assets/jdklogo.png')}
          style={{
            width: 120,
            height: 50,
            resizeMode: 'contain',
          }}
        />

        <View sx={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
          <Pressable onPress={() => router.push('/search')}>
            <Ionicons name="search" size={24} color="#001a33" />
          </Pressable>

          <Pressable onPress={() => setNotificationsOpen(prev => !prev)}>
            <Ionicons name="notifications-outline" size={24} color="#001a33" />
          </Pressable>

          <Pressable onPress={() => setMenuOpen(prev => !prev)}>
            <Ionicons name="menu" size={28} color="#001a33" />
          </Pressable>
        </View>
      </View>

      {/* Notifications Dropdown (Overlay) */}
      {notificationsOpen && (
        <View
          sx={{
            position: 'absolute',
            top: 72,
            right: 64,
            width: 260,
            bg: '#fff',
            borderRadius: 12,
            p: 16,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.1,
            shadowRadius: 2,
            elevation: 4,
            zIndex: 999,
            gap: 12,
          }}
        >
          <Text sx={{ fontSize: 16, fontFamily: 'Poppins-Bold', color: '#001a33' }}>
            Notifications
          </Text>

          <Text sx={{ fontSize: 14, fontFamily: 'Poppins-Regular', color: '#4b5563' }}>
            • Your request for cleaning has been accepted.
          </Text>
          <Text sx={{ fontSize: 14, fontFamily: 'Poppins-Regular', color: '#4b5563' }}>
            • New worker available in your area.
          </Text>
          <Text sx={{ fontSize: 14, fontFamily: 'Poppins-Regular', color: '#4b5563' }}>
            • Completed service feedback requested.
          </Text>
        </View>
      )}

      {/* Burger Dropdown Menu (Overlay) */}
      {menuOpen && (
        <View
          sx={{
            position: 'absolute',
            top: 60,
            right: 2,
            width: 260,
            bg: '#fff',
            borderRadius: 12,
            p: 16,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.1,
            shadowRadius: 2,
            elevation: 4,
            zIndex: 999,
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
              <Pressable onPress={() => router.replace('/clientpage/clientnavbar/burgermenu/current')}>
                <Text sx={{ fontSize: 14, fontFamily: 'Poppins-Regular', color: '#4b5563' }}>
                  Current Service Requests
                </Text>
              </Pressable>
              <Pressable onPress={() => router.replace('/clientpage/clientnavbar/burgermenu/completed')}>
                <Text sx={{ fontSize: 14, fontFamily: 'Poppins-Regular', color: '#4b5563' }}>
                  Completed Requests
                </Text>
              </Pressable>
            </View>
          )}

          {/* Hire a Worker */}
          <Pressable onPress={() => router.replace('/clientpage/clientnavbar/burgermenu/hire')}>
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
