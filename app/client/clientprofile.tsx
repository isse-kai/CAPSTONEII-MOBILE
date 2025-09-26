import { Pressable, Text, View } from 'dripsy'
import { useState } from 'react'
import { Animated } from 'react-native'

export default function ClientProfile() {
  const [sidebarVisible, setSidebarVisible] = useState(false)
  const sidebarTranslate = useState(new Animated.Value(-240))[0]

  const toggleSidebar = () => {
    Animated.timing(sidebarTranslate, {
      toValue: sidebarVisible ? -240 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start()
    setSidebarVisible(!sidebarVisible)
  }

  return (
    <View sx={{ flex: 1 }}>
      {/* Toggle Button */}
      <Pressable
        onPress={toggleSidebar}
        sx={{
          bg: '#008CFC',
          px: 16,
          py: 10,
          borderRadius: 8,
          alignSelf: 'flex-start',
          m: 16,
        }}
      >
        <Text sx={{ color: 'white', fontFamily: 'Poppins-Bold' }}>
          {sidebarVisible ? 'Close Sidebar' : 'Open Sidebar'}
        </Text>
      </Pressable>

      {/* Sidebar */}
      <Animated.View
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          bottom: 0,
          width: 240,
          backgroundColor: '#f3f4f6',
          padding: 16,
          transform: [{ translateX: sidebarTranslate }],
          elevation: 4,
        }}
      >
        <Text sx={{ fontSize: 18, fontFamily: 'Poppins-Bold', mb: 12 }}>Profile</Text>
        <Text sx={{ fontSize: 14, fontFamily: 'Poppins-Regular', mb: 8 }}>Name: Jane Doe</Text>
        <Text sx={{ fontSize: 14, fontFamily: 'Poppins-Regular', mb: 8 }}>Email: jane@example.com</Text>
        <Pressable
          onPress={() => console.log('Logout')}
          sx={{
            bg: '#ef4444',
            px: 12,
            py: 8,
            borderRadius: 6,
            mt: 16,
          }}
        >
          <Text sx={{ color: 'white', fontFamily: 'Poppins-Bold' }}>Logout</Text>
        </Pressable>
      </Animated.View>

      {/* Main Content */}
      <View sx={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text sx={{ fontSize: 24, fontFamily: 'Poppins-Bold' }}>Client Profile</Text>
      </View>
    </View>
  )
}
