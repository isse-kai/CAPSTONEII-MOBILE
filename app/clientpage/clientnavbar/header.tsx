import { Ionicons } from '@expo/vector-icons'
import { Text, View } from 'dripsy'
import { useRouter } from 'expo-router'
import { AnimatePresence, MotiView } from 'moti'
import { useEffect, useState } from 'react'
import { Image, Pressable, TextInput } from 'react-native'
import { getNotificationsForCurrentUser } from '../../../supabase/services/notificationservice'

type Notification = {
  id: string
  title: string
  message?: string
  created_at?: string
  read?: boolean
}

const ClientHeader = () => {
  const router = useRouter()
  const [menuOpen, setMenuOpen] = useState(false)
  const [submenuOpen, setSubmenuOpen] = useState(false)
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [notifications, setNotifications] = useState<Notification[]>([])

  const toggleNotifications = () => {
    setNotificationsOpen(prev => !prev)
    setMenuOpen(false)
    setSubmenuOpen(false)
  }

  const toggleMenu = () => {
    setMenuOpen(prev => !prev)
    setNotificationsOpen(false)
  }

  useEffect(() => {
    if (!notificationsOpen) return

    const fetchNotifications = async () => {
      try {
        const data = await getNotificationsForCurrentUser()
        setNotifications(data.slice(0, 3))
      } catch {
        setNotifications([])
      }
    }

    fetchNotifications()
  }, [notificationsOpen])

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
            height: 50,
            resizeMode: 'contain',
          }}
        />

        <View sx={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
          <Pressable onPress={() => setShowSearch((prev) => !prev)}>
            <Ionicons name="search" size={24} color="#001a33" />
          </Pressable>

          <Pressable onPress={toggleNotifications}>
            <Ionicons name="notifications-outline" size={24} color="#001a33" />
          </Pressable>

          <Pressable onPress={toggleMenu}>
            <Ionicons name="menu" size={28} color="#001a33" />
          </Pressable>
        </View>
      </View>

      {/* === SEARCH BAR (slides in) === */}
      <AnimatePresence>
        {showSearch && (
          <MotiView
            from={{ opacity: 0, translateY: -10 }}
            animate={{ opacity: 1, translateY: 0 }}
            exit={{ opacity: 0, translateY: -10 }}
            transition={{ type: "timing", duration: 300 }}
            style={{
              marginBottom: 16,
              width: "100%",
              top: -14
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                backgroundColor: "#fff",
                borderRadius: 12,
                paddingHorizontal: 14,
                paddingVertical: 8,
                borderWidth: 1,
                borderColor: "#e5e7eb",
                shadowColor: "#000",
                shadowOpacity: 0.05,
                shadowRadius: 3,
                elevation: 2,
              }}
            >
              <Ionicons name="search-outline" size={20} color="#4b5563" />
              <TextInput
                placeholder="Search..."
                value={searchQuery}
                onChangeText={setSearchQuery}
                style={{
                  flex: 1,
                  marginLeft: 10,
                  fontSize: 15,
                  color: "#001a33",
                  fontFamily: "Poppins-Regular",
                }}
                placeholderTextColor="#9ca3af"
              />
              <Pressable onPress={() => setShowSearch(false)}>
                <Ionicons name="close" size={20} color="#6b7280" />
              </Pressable>
            </View>
          </MotiView>
        )}
      </AnimatePresence>

      {/* Notifications Dropdown */}
      <AnimatePresence>
        {notificationsOpen && (
          <MotiView
            from={{ opacity: 0, translateY: -10 }}
            animate={{ opacity: 1, translateY: 0 }}
            exit={{ opacity: 0, translateY: -10 }}
            transition={{ type: 'timing', duration: 300 }}
            style={{
              position: 'absolute',
              top: 60,
              right: 40,
              width: 260,
              backgroundColor: '#fff',
              borderRadius: 12,
              padding: 16,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.1,
              shadowRadius: 2,
              elevation: 4,
              zIndex: 999,
            }}
          >
            <Text sx={{ fontSize: 16, fontFamily: 'Poppins-Bold', color: '#001a33', mb: 8 }}>
              Notifications
            </Text>

            <View
              sx={{
                height: 1,
                backgroundColor: '#e5e7eb',
                mb: 12,
              }}
            />

            {notifications.length > 0 ? (
              notifications.map(n => (
                <Text
                  key={n.id}
                  sx={{ fontSize: 14, fontFamily: 'Poppins-Regular', color: '#4b5563', mb: 4 }}
                >
                  • {n.title}
                </Text>
              ))
            ) : (
              <Text sx={{ fontSize: 14, fontFamily: 'Poppins-Regular', color: '#9ca3af' }}>
                No notifications
              </Text>
            )}

            <Pressable onPress={() => router.push('/clientpage/clientnavbar/notifications')}>
              <Text
                sx={{
                  fontSize: 14,
                  fontFamily: 'Poppins-Bold',
                  color: '#008CFC',
                  textAlign: 'left',
                  mt: 8,
                }}
              >
                See all notifications
              </Text>
            </Pressable>
          </MotiView>
        )}
      </AnimatePresence>

      {/* Burger Dropdown Menu */}
      <AnimatePresence>
        {menuOpen && (
          <MotiView
            from={{ opacity: 0, translateY: -10 }}
            animate={{ opacity: 1, translateY: 0 }}
            exit={{ opacity: 0, translateY: -10 }}
            transition={{ type: 'timing', duration: 300 }}
            style={{
              position: 'absolute',
              top: 60,
              right: 2,
              width: 260,
              backgroundColor: '#fff',
              borderRadius: 12,
              padding: 16,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.1,
              shadowRadius: 2,
              elevation: 4,
              zIndex: 999,
            }}
          >
            <Pressable onPress={() => setSubmenuOpen(prev => !prev)}>
              <Text sx={{ fontSize: 16, fontFamily: 'Poppins-Bold', color: '#001a33' }}>
                Manage Request
              </Text>
            </Pressable>

            {submenuOpen && (
              <View sx={{ pl: 12, gap: 8, mt: 8 }}>
                <Pressable onPress={() => router.replace('./clientpage/clientnavbar/burgermenu/request')}>
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

            <Pressable onPress={() => router.replace('/clientpage/clientnavbar/burgermenu/hire')}>
              <Text sx={{ fontSize: 16, fontFamily: 'Poppins-Bold', color: '#001a33', mt: 12 }}>
                Hire a Worker
              </Text>
            </Pressable>
          </MotiView>
        )}
      </AnimatePresence>
    </View>
  )
}

export default ClientHeader
