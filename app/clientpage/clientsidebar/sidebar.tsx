import { Pressable, View } from 'dripsy'
import { useEffect, useRef, useState } from 'react'
import { Animated } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import Sidebar from '../../../components/Sidebar'

export default function ClientSidebar() {
  const insets = useSafeAreaInsets()
  const [visible, setVisible] = useState(false)
  const translateX = useRef(new Animated.Value(-260)).current
  const backdropOpacity = useRef(new Animated.Value(0)).current

  useEffect(() => {
    Animated.parallel([
      Animated.timing(translateX, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(backdropOpacity, {
        toValue: 0.4,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => setVisible(true))
  }, [translateX, backdropOpacity])

  const handleClose = () => {
    Animated.parallel([
      Animated.timing(translateX, {
        toValue: -260,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(backdropOpacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => setVisible(false))
  }

  return (
    <View
      sx={{
        flex: 1,
        bg: '#f9fafb',
        paddingTop: insets.top,
        paddingBottom: insets.bottom,
      }}
    >
      {/* Backdrop */}
      {visible && (
        <Animated.View
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: '#000',
            opacity: backdropOpacity,
          }}
        >
          <Pressable
            onPress={handleClose}
            style={{ flex: 1 }}
          />
        </Animated.View>
      )}

      {/* Sidebar */}
      <Animated.View
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          bottom: 0,
          width: 260,
          transform: [{ translateX }],
          elevation: 4,
        }}
      >
        <Sidebar onClose={handleClose} />
      </Animated.View>
    </View>
  )
}
