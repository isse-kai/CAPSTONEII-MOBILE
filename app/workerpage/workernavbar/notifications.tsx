import { Text, View } from 'dripsy'
import { useFonts } from 'expo-font'
import { useRouter, type Href } from 'expo-router'
import { MotiView } from 'moti'
import { useEffect, useState } from 'react'
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
} from 'react-native'
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context'
import { supabase } from '../../../supabase/db'
import WorkerHeader from './header'

export default function WorkerNotifications() {
  const router = useRouter()
  const insets = useSafeAreaInsets()

  const [fontsLoaded] = useFonts({
    'Poppins-Regular': require('../../../assets/fonts/Poppins/Poppins-Regular.ttf'),
    'Poppins-Bold': require('../../../assets/fonts/Poppins/Poppins-Bold.ttf'),
  })

  type Notification = {
    id: string
    title?: string
    message?: string
    detail?: string
    created_at?: string
  }

  const [notifications, setNotifications] = useState<Notification[]>([])

  useEffect(() => {
    const fetchNotifications = async () => {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .order('created_at', { ascending: false })

      if (!error && Array.isArray(data)) {
        setNotifications(data)
      }
    }

    fetchNotifications()
  }, [])

  if (!fontsLoaded) return null

  return (
    <SafeAreaView
      style={{
        flex: 1,
        paddingTop: insets.top - 20,
        paddingBottom: insets.bottom + 2,
        backgroundColor: 'rgba(249, 250, 251, 0.9)',
      }}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <View sx={{ flex: 1, px: 16, py: 12 }}>
          <MotiView
            from={{ opacity: 0, translateY: 20 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: 'timing', duration: 500 }}
            style={{ flex: 1 }}
          >
            <WorkerHeader />

            {/* Notifications Title */}
            <Text
              sx={{
                fontSize: 18,
                fontFamily: 'Poppins-Bold',
                color: '#001a33',
                mb: 12,
              }}
            >
              Notifications
            </Text>

            {/* Notification List */}
            <FlatList
              data={notifications}
              keyExtractor={item => item.id}
              renderItem={({ item }) => (
                <Pressable
                  onPress={() => router.push(`/workerpage/workernavbar/notifications/${item.id}` as Href)}
                >
                  <View
                    sx={{
                      bg: '#fff',
                      borderRadius: 12,
                      px: 14,
                      py: 12,
                      mb: 12,
                      shadowColor: '#000',
                      shadowOffset: { width: 0, height: 1 },
                      shadowOpacity: 0.1,
                      shadowRadius: 2,
                      elevation: 2,
                    }}
                  >
                    <Text
                      sx={{
                        fontSize: 16,
                        fontFamily: 'Poppins-Bold',
                        color: '#001a33',
                        mb: 4,
                      }}
                    >
                      {item.title}
                    </Text>
                    <Text
                      sx={{
                        fontSize: 14,
                        fontFamily: 'Poppins-Regular',
                        color: '#4b5563',
                      }}
                    >
                      {item.message || item.detail}
                    </Text>
                  </View>
                </Pressable>
              )}
              contentContainerStyle={{ paddingBottom: 16 }}
            />
          </MotiView>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}
