import { Ionicons } from '@expo/vector-icons'
import { Pressable, Text } from 'dripsy'
import { useFonts } from 'expo-font'
import { useRouter } from 'expo-router'
import { MotiView } from 'moti'
import React from 'react'
import { ImageBackground, ScrollView, TextInput, View } from 'react-native'
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context'
import { getCurrentUser } from '../../../../supabase/auth'
import Header from '../../clientnavbar/header'
import ClientNavbar from '../../clientnavbar/navbar'

export default function AccountSettings() {
  const router = useRouter()
  const insets = useSafeAreaInsets()

  const [fontsLoaded] = useFonts({
    'Poppins-Regular': require('../../../../assets/fonts/Poppins/Poppins-Regular.ttf'),
    'Poppins-Bold': require('../../../../assets/fonts/Poppins/Poppins-Bold.ttf'),
    'Poppins-ExtraBold': require('../../../../assets/fonts/Poppins/Poppins-ExtraBold.ttf'),
  })

  const [user, setUser] = React.useState<any>(null)

  React.useEffect(() => {
    const fetchUser = async () => {
      try {
        const u = await getCurrentUser()
        setUser(u)
      } catch (err) {
        console.error(err)
      }
    }
    fetchUser()
  }, [])

  if (!fontsLoaded) return null

  return (
    <ImageBackground
      source={require('../../../../assets/login.jpg')}
      style={{ flex: 1 }}
      resizeMode="cover"
    >
      <SafeAreaView
        style={{
          flex: 1,
          paddingBottom: insets.bottom,
          backgroundColor: 'rgba(249, 250, 251, 0.9)',
        }}
      >
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            paddingHorizontal: 18,
            paddingBottom: 100,
          }}
          showsVerticalScrollIndicator={false}
        >
          <MotiView
            from={{ opacity: 0, translateY: 20 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: 'timing', duration: 400 }}
            style={{ flex: 1 }}
          >

            <Header />

            {/* Account Details */}
            <View
              style={{
                backgroundColor: '#ffffffcc',
                borderRadius: 12,
                padding: 16,
                marginBottom: 20,
              }}
            >
              <Text sx={{ fontSize: 18, fontFamily: 'Poppins-Bold', mb: 12 }}>
                Account Details
              </Text>
              <Text sx={{ fontSize: 14, fontFamily: 'Poppins-Regular', mb: 6 }}>
                Created At: {user?.created_at ? new Date(user.created_at).toLocaleString() : 'N/A'}
              </Text>
              <Text sx={{ fontSize: 14, fontFamily: 'Poppins-Regular', mb: 6 }}>
                Status: {user?.confirmed_at ? 'Active' : 'Inactive'}
              </Text>
            </View>

            {/* Personal Information */}
            <View
            style={{
                backgroundColor: '#ffffffcc',
                borderRadius: 12,
                padding: 16,
                marginBottom: 20,
            }}
            >
            <Text sx={{ fontSize: 18, fontFamily: 'Poppins-Bold', mb: 12 }}>
                Personal Information
            </Text>

            {/* First Name */}
            <Text sx={{ fontSize: 14, fontFamily: 'Poppins-Regular', mb: 6 }}>
                First Name: {user?.user_metadata?.first_name || 'N/A'}
            </Text>

            {/* Last Name */}
            <Text sx={{ fontSize: 14, fontFamily: 'Poppins-Regular', mb: 6 }}>
                Last Name: {user?.user_metadata?.last_name || 'N/A'}
            </Text>

            {/* Email */}
            <Text sx={{ fontSize: 14, fontFamily: 'Poppins-Regular', mb: 6 }}>
                Email: {user?.email || 'N/A'}
            </Text>

            {/* Age */}
            <Text sx={{ fontSize: 14, fontFamily: 'Poppins-Regular', mb: 6 }}>
                Age: {user?.user_metadata?.age || 'N/A'}
            </Text>

            {/* Contact Number (Editable) */}
            <View style={{ marginBottom: 12 }}>
                <Text sx={{ fontSize: 14, fontFamily: 'Poppins-Regular', mb: 4 }}>
                Contact:
                </Text>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text sx={{ fontSize: 14, mr: 6 }}>🇵🇭 +63</Text>
                <TextInput
                    defaultValue={user?.user_metadata?.contact_number || ''}
                    placeholder="Enter contact number"
                    style={{
                    flex: 1,
                    borderWidth: 1,
                    borderColor: '#d1d5db',
                    borderRadius: 8,
                    paddingHorizontal: 10,
                    fontSize: 14,
                    fontFamily: 'Poppins-Regular',
                    }}
                />
                </View>
                <View style={{ flexDirection: 'row', marginTop: 6 }}>
                <Pressable
                    onPress={() => console.log('Remove contact')}
                    style={{
                    backgroundColor: '#ef4444',
                    paddingVertical: 6,
                    paddingHorizontal: 12,
                    borderRadius: 6,
                    marginRight: 8,
                    }}
                >
                    <Text sx={{ fontSize: 14, fontFamily: 'Poppins-Bold', color: '#fff' }}>
                    Remove
                    </Text>
                </Pressable>
                <Pressable
                    onPress={() => console.log('Change contact')}
                    style={{
                    backgroundColor: '#008CFC',
                    paddingVertical: 6,
                    paddingHorizontal: 12,
                    borderRadius: 6,
                    }}
                >
                    <Text sx={{ fontSize: 14, fontFamily: 'Poppins-Bold', color: '#fff' }}>
                    Change
                    </Text>
                </Pressable>
                </View>
            </View>

            {/* Date of Birth (Editable) */}
            <View>
                <Text sx={{ fontSize: 14, fontFamily: 'Poppins-Regular', mb: 4 }}>
                Date of Birth:
                </Text>
                <TextInput
                defaultValue={user?.user_metadata?.dob || ''}
                placeholder="YYYY-MM-DD"
                style={{
                    borderWidth: 1,
                    borderColor: '#d1d5db',
                    borderRadius: 8,
                    paddingHorizontal: 10,
                    fontSize: 14,
                    fontFamily: 'Poppins-Regular',
                }}
                />
                <View style={{ flexDirection: 'row', marginTop: 6 }}>
                <Pressable
                    onPress={() => console.log('Remove DOB')}
                    style={{
                    backgroundColor: '#ef4444',
                    paddingVertical: 6,
                    paddingHorizontal: 12,
                    borderRadius: 6,
                    marginRight: 8,
                    }}
                >
                    <Text sx={{ fontSize: 14, fontFamily: 'Poppins-Bold', color: '#fff' }}>
                    Remove
                    </Text>
                </Pressable>
                <Pressable
                    onPress={() => console.log('Change DOB')}
                    style={{
                    backgroundColor: '#008CFC',
                    paddingVertical: 6,
                    paddingHorizontal: 12,
                    borderRadius: 6,
                    }}
                >
                    <Text sx={{ fontSize: 14, fontFamily: 'Poppins-Bold', color: '#fff' }}>
                    Change
                    </Text>
                </Pressable>
                </View>
            </View>
            </View>


            {/* Social Media */}
            <View
              style={{
                backgroundColor: '#ffffffcc',
                borderRadius: 12,
                padding: 16,
                marginBottom: 20,
              }}
            >
              <Text sx={{ fontSize: 18, fontFamily: 'Poppins-Bold', mb: 12 }}>
                Social Media
              </Text>
              <Pressable
                onPress={() => router.push(user?.user_metadata?.facebook || 'https://facebook.com')}
                sx={{ flexDirection: 'row', alignItems: 'center', mb: 10 }}
              >
                <Ionicons name="logo-facebook" size={22} color="#1877F2" style={{ marginRight: 8 }} />
                <Text sx={{ fontSize: 14, fontFamily: 'Poppins-Regular', color: '#1877F2' }}>
                  {user?.user_metadata?.facebook || 'Facebook'}
                </Text>
              </Pressable>

              <Pressable
                onPress={() => router.push(user?.user_metadata?.instagram || 'https://instagram.com')}
                sx={{ flexDirection: 'row', alignItems: 'center' }}
              >
                <Ionicons name="logo-instagram" size={22} color="#C13584" style={{ marginRight: 8 }} />
                <Text sx={{ fontSize: 14, fontFamily: 'Poppins-Regular', color: '#C13584' }}>
                  {user?.user_metadata?.instagram || 'Instagram'}
                </Text>
              </Pressable>
            </View>
          </MotiView>
        </ScrollView>

        <ClientNavbar />
      </SafeAreaView>
    </ImageBackground>
  )
}
