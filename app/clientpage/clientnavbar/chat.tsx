import { Ionicons } from '@expo/vector-icons'
import { Text, View } from 'dripsy'
import { useFonts } from 'expo-font'
import { useRouter } from 'expo-router'
import { MotiView } from 'moti'
import { useState } from 'react'
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  TextInput
} from 'react-native'
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context'
import Header from './header'

export default function ChatList() {
  const router = useRouter()
  const insets = useSafeAreaInsets()
  const [searchQuery, setSearchQuery] = useState('')
  const [isFocused, setIsFocused] = useState(false)

  const [fontsLoaded] = useFonts({
    'Poppins-Regular': require('../../../assets/fonts/Poppins/Poppins-Regular.ttf'),
    'Poppins-Bold': require('../../../assets/fonts/Poppins/Poppins-Bold.ttf'),
  })

  const [people] = useState([
    { id: 'anna', name: 'Anna Reyes', role: 'Electrician' },
    { id: 'mark', name: 'Mark Santos', role: 'Plumber' },
    { id: 'liza', name: 'Liza Cruz', role: 'Cleaner' },
    { id: 'john', name: 'John Tan', role: 'Carpenter' },
  ])

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
            <Header />

            {/* Chat Title */}
            <Text
              sx={{
                fontSize: 18,
                fontFamily: 'Poppins-Bold',
                color: '#001a33',
                mb: 12,
              }}
            >
              Messages
            </Text>

            {/* Search Tab */}
            <View
              sx={{
                flexDirection: 'row',
                alignItems: 'center',
                borderRadius: 12,
                borderWidth: 1,
                borderColor: isFocused ? '#008CFC' : '#d1d5db', // gray-300 default
                px: 14,
                py: 2,
                mb: 16,
                bg: 'transparent',
              }}
            >
              <Ionicons name="search" size={24} color="#001a33" />
              <TextInput
                value={searchQuery}
                onChangeText={setSearchQuery}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                placeholder="Search"
                placeholderTextColor="#6b7280"
                style={{
                  flex: 1,
                  marginLeft: 10,
                  fontSize: 16,
                  fontFamily: 'Poppins-Regular',
                  color: '#001a33',
                  lineHeight: 22
                }}
              />
            </View>



            {/* People List */}
            <FlatList
              data={people}
              keyExtractor={item => item.id}
              renderItem={({ item }) => (
                <Pressable
                  onPress={() => router.replace(`/clientpage/clientnavbar/chat/${item.id}`)}
                >
                  <View
                    sx={{
                      flexDirection: 'row',
                      alignItems: 'center',
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
                    <View
                      sx={{
                        width: 48,
                        height: 48,
                        borderRadius: 24,
                        bg: '#e5e7eb',
                        justifyContent: 'center',
                        alignItems: 'center',
                        mr: 12,
                      }}
                    >
                      <Text sx={{ fontSize: 20 }}>👤</Text>
                    </View>
                    <View>
                      <Text
                        sx={{
                          fontSize: 16,
                          fontFamily: 'Poppins-Bold',
                          color: '#001a33',
                        }}
                      >
                        {item.name}
                      </Text>
                      <Text
                        sx={{
                          fontSize: 14,
                          fontFamily: 'Poppins-Regular',
                          color: '#4b5563',
                        }}
                      >
                        {item.role}
                      </Text>
                    </View>
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
