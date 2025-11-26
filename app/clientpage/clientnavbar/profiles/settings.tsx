import { Ionicons } from '@expo/vector-icons'
import { Pressable, Text } from 'dripsy'
import { useFonts } from 'expo-font'
import { useRouter } from 'expo-router'
import moment from "moment"
import { MotiView } from 'moti'
import React from 'react'
import { ImageBackground, ScrollView, TextInput, View } from 'react-native'
import DateTimePickerModal from "react-native-modal-datetime-picker"
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context'
import { getCurrentUser } from '../../../../supabase/auth'
import Header from '../../clientnavbar/header'
import ClientNavbar from '../../clientnavbar/navbar'

export default function AccountSettings() {
  const [user, setUser] = React.useState<any>(null)
  const [facebook, setFacebook] = React.useState("")
  const [instagram, setInstagram] = React.useState("")
  const router = useRouter()
  const insets = useSafeAreaInsets()

  const [fontsLoaded] = useFonts({
    'Poppins-Regular': require('../../../../assets/fonts/Poppins/Poppins-Regular.ttf'),
    'Poppins-Bold': require('../../../../assets/fonts/Poppins/Poppins-Bold.ttf'),
    'Poppins-ExtraBold': require('../../../../assets/fonts/Poppins/Poppins-ExtraBold.ttf'),
  })

  const [dob, setDob] = React.useState<string>('')
  const [showPicker, setShowPicker] = React.useState(false)

  React.useEffect(() => {
    const fetchUser = async () => {
      try {
        const u = await getCurrentUser()
        setUser(u)
        setFacebook(u?.user_metadata?.facebook || "")
        setInstagram(u?.user_metadata?.instagram || "")
        if (u?.user_metadata?.dob) {
          setDob(u.user_metadata.dob)
        }
      } catch (err) {
        console.error(err)
      }
    }
    fetchUser()
  }, [])

const handleConfirmDob = (selectedDate: Date) => {
  setShowPicker(false)
  if (selectedDate) {
    const formatted = moment(selectedDate).format("YYYY-MM-DD")
    setDob(formatted)
  }
}
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

              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  alignSelf: 'flex-start',
                  marginBottom: 6,
                  paddingHorizontal: 12,
                  paddingVertical: 6,
                  borderRadius: 12,
                  backgroundColor: user?.confirmed_at ? '#dcfce7' : '#fee2e2',
                }}
              >
                <View
                  style={{
                    width: 12,
                    height: 12,
                    borderRadius: 6,
                    marginRight: 8,
                    backgroundColor: user?.confirmed_at ? '#22c55e' : '#ef4444',
                  }}
                />
                <Text
                  sx={{
                    fontSize: 14,
                    fontFamily: 'Poppins-Bold',
                    color: user?.confirmed_at ? '#166534' : '#991b1b',
                  }}
                >
                  {user?.confirmed_at ? 'Active' : 'Inactive'}
                </Text>
              </View>
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

              {/* Contact Number */}
              <View style={{ marginBottom: 12 }}>
                <Text sx={{ fontSize: 14, fontFamily: 'Poppins-Regular', mb: 4 }}>
                  Contact:
                </Text>

                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    borderWidth: 1,
                    borderColor: '#d1d5db',
                    borderRadius: 8,
                    overflow: 'hidden',
                  }}
                >
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      paddingHorizontal: 10,
                      backgroundColor: '#f9fafb',
                    }}
                  >
                    <Text sx={{ fontSize: 14, fontFamily: 'Poppins-Regular' }}>🇵🇭 +63</Text>
                    <View
                      style={{
                        width: 1,
                        height: '100%',
                        backgroundColor: '#d1d5db',
                        marginLeft: 8,
                      }}
                    />
                  </View>

                  <TextInput
                    defaultValue={user?.user_metadata?.contact_number || ''}
                    placeholder="Enter contact number"
                    keyboardType="number-pad"
                    style={{
                      flex: 1,
                      paddingHorizontal: 10,
                      fontSize: 14,
                      fontFamily: 'Poppins-Regular',
                    }}
                  />
                </View>

                {/* Action buttons */}
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

              {/* Date of Birth (Calendar Picker) */}
              <View style={{ marginBottom: 12 }}>
                <Text sx={{ fontSize: 14, fontFamily: 'Poppins-Regular', mb: 4 }}>
                  Date of Birth:
                </Text>

                <Pressable
                  onPress={() => setShowPicker(true)}
                  style={{
                    borderWidth: 1,
                    borderColor: '#d1d5db',
                    borderRadius: 8,
                    paddingHorizontal: 10,
                    paddingVertical: 12,
                  }}
                >
                  <Text
                    sx={{
                      fontSize: 14,
                      fontFamily: 'Poppins-Regular',
                      color: dob ? '#000' : '#9ca3af',
                    }}
                  >
                    {dob || 'Select date'}
                  </Text>
                </Pressable>

                <DateTimePickerModal
                    isVisible={showPicker}
                    mode="date"
                    onConfirm={handleConfirmDob}
                    onCancel={() => setShowPicker(false)}
                    date={dob ? new Date(dob) : new Date()}
                  />

                  {/* Action buttons */}
                    <View style={{ flexDirection: 'row', marginTop: 6 }}>
                      <Pressable
                        onPress={() => setDob('')}
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
                        onPress={() => console.log('Change DOB to', dob)}
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

              {/* Facebook */}
              <View style={{ marginBottom: 12 }}>
                <Text sx={{ fontSize: 14, fontFamily: 'Poppins-Regular', mb: 4 }}>
                  Facebook:
                </Text>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    borderWidth: 1,
                    borderColor: '#d1d5db',
                    borderRadius: 8,
                    overflow: 'hidden',
                  }}
                >
                  <Ionicons name="logo-facebook" size={22} color="#1877F2" style={{ marginHorizontal: 8 }} />
                  <TextInput
                    value={facebook}
                    onChangeText={setFacebook}
                    placeholder="Enter Facebook profile link"
                    style={{
                      flex: 1,
                      paddingHorizontal: 10,
                      fontSize: 14,
                      fontFamily: 'Poppins-Regular',
                    }}
                  />
                </View>
              </View>

              {/* Instagram */}
              <View style={{ marginBottom: 12 }}>
                <Text sx={{ fontSize: 14, fontFamily: 'Poppins-Regular', mb: 4 }}>
                  Instagram:
                </Text>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    borderWidth: 1,
                    borderColor: '#d1d5db',
                    borderRadius: 8,
                    overflow: 'hidden',
                  }}
                >
                  <Ionicons name="logo-instagram" size={22} color="#C13584" style={{ marginHorizontal: 8 }} />
                  <TextInput
                    value={instagram}
                    onChangeText={setInstagram}
                    placeholder="Enter Instagram profile link"
                    style={{
                      flex: 1,
                      paddingHorizontal: 10,
                      fontSize: 14,
                      fontFamily: 'Poppins-Regular',
                    }}
                  />
                </View>
              </View>

              {/* Update Button */}
              <Pressable
                onPress={() => {
                  console.log("Update social media info", { facebook, instagram })
                  router.push("/clientpage/home")
                }}
                style={{
                  backgroundColor: '#008CFC',
                  paddingVertical: 10,
                  borderRadius: 8,
                  alignItems: 'center',
                }}
              >
                <Text sx={{ fontSize: 14, fontFamily: 'Poppins-Bold', color: '#fff' }}>
                  Update Information
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
