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
              <View style={{ marginBottom: 12 }}>
                <Text sx={{ fontSize: 14, fontFamily: 'Poppins-Regular', mb: 4 }}>
                  First Name:
                </Text>
                <TextInput
                  value={user?.user_metadata?.first_name || 'N/A'}
                  editable={false}
                  style={{
                    borderWidth: 1,
                    borderColor: '#d1d5db',
                    borderRadius: 8,
                    paddingHorizontal: 10,
                    fontSize: 14,
                    fontFamily: 'Poppins-Regular',
                    backgroundColor: '#f9fafb',
                    color: '#374151',
                  }}
                />
              </View>

              {/* Last Name */}
              <View style={{ marginBottom: 12 }}>
                <Text sx={{ fontSize: 14, fontFamily: 'Poppins-Regular', mb: 4 }}>
                  Last Name:
                </Text>
                <TextInput
                  value={user?.user_metadata?.last_name || 'N/A'}
                  editable={false}
                  style={{
                    borderWidth: 1,
                    borderColor: '#d1d5db',
                    borderRadius: 8,
                    paddingHorizontal: 10,
                    fontSize: 14,
                    fontFamily: 'Poppins-Regular',
                    backgroundColor: '#f9fafb',
                    color: '#374151',
                  }}
                />
              </View>

              {/* Email */}
              <View style={{ marginBottom: 12 }}>
                <Text sx={{ fontSize: 14, fontFamily: 'Poppins-Regular', mb: 4 }}>
                  Email:
                </Text>
                <TextInput
                  value={user?.email || 'N/A'}
                  editable={false}
                  style={{
                    borderWidth: 1,
                    borderColor: '#d1d5db',
                    borderRadius: 8,
                    paddingHorizontal: 10,
                    fontSize: 14,
                    fontFamily: 'Poppins-Regular',
                    backgroundColor: '#f9fafb',
                    color: '#374151',
                  }}
                />
              </View>

              {/* Age */}
              <View style={{ marginBottom: 12 }}>
                <Text sx={{ fontSize: 14, fontFamily: 'Poppins-Regular', mb: 4 }}>
                  Age:
                </Text>
                <TextInput
                  value={user?.user_metadata?.age?.toString() || 'N/A'}
                  editable={false}
                  style={{
                    borderWidth: 1,
                    borderColor: '#d1d5db',
                    borderRadius: 8,
                    paddingHorizontal: 10,
                    fontSize: 14,
                    fontFamily: 'Poppins-Regular',
                    backgroundColor: '#f9fafb',
                    color: '#374151',
                  }}
                />
              </View>

              {/* Contact Number (still editable) */}
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

              {/* Date of Birth */}
              <View style={{ marginBottom: 12 }}>
                <Text sx={{ fontSize: 14, fontFamily: 'Poppins-Regular', mb: 4 }}>
                  Date of Birth:
                </Text>

                <Pressable
                  onPress={() => setShowPicker(true)}
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
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

                  <Ionicons name="calendar-outline" size={20} color="#6b7280" />
                </Pressable>

                <DateTimePickerModal
                  isVisible={showPicker}
                  mode="date"
                  onConfirm={handleConfirmDob}
                  onCancel={() => setShowPicker(false)}
                  date={dob ? new Date(dob) : new Date()}
                />

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

            {/* Security */}
            <View
              style={{
                backgroundColor: '#ffffffcc',
                borderRadius: 12,
                padding: 16,
                marginBottom: 20,
              }}
            >
              <Text sx={{ fontSize: 18, fontFamily: 'Poppins-Bold', mb: 12 }}>
                Security
              </Text>

              {/* Current Password */}
              <View style={{ marginBottom: 12 }}>
                <Text sx={{ fontSize: 14, fontFamily: 'Poppins-Regular', mb: 4 }}>
                  Current Password:
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
                  <Ionicons name="lock-closed-outline" size={20} color="#6b7280" style={{ marginHorizontal: 8 }} />
                  <TextInput
                    placeholder="Enter current password"
                    secureTextEntry
                    style={{
                      flex: 1,
                      paddingHorizontal: 10,
                      fontSize: 14,
                      fontFamily: 'Poppins-Regular',
                    }}
                  />
                </View>
              </View>

              {/* New Password */}
              <View style={{ marginBottom: 12 }}>
                <Text sx={{ fontSize: 14, fontFamily: 'Poppins-Regular', mb: 4 }}>
                  New Password:
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
                  <Ionicons name="key-outline" size={20} color="#6b7280" style={{ marginHorizontal: 8 }} />
                  <TextInput
                    placeholder="Enter new password"
                    secureTextEntry
                    style={{
                      flex: 1,
                      paddingHorizontal: 10,
                      fontSize: 14,
                      fontFamily: 'Poppins-Regular',
                    }}
                  />
                </View>
              </View>

              {/* Confirm New Password */}
              <View style={{ marginBottom: 12 }}>
                <Text sx={{ fontSize: 14, fontFamily: 'Poppins-Regular', mb: 4 }}>
                  Confirm New Password:
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
                  <Ionicons name="checkmark-done-outline" size={20} color="#6b7280" style={{ marginHorizontal: 8 }} />
                  <TextInput
                    placeholder="Confirm new password"
                    secureTextEntry
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
                onPress={() => console.log("Change password pressed")}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: '#008CFC',
                  paddingVertical: 10,
                  borderRadius: 8,
                }}
              >
                <Ionicons name="refresh-outline" size={20} color="#fff" style={{ marginRight: 6 }} />
                <Text sx={{ fontSize: 14, fontFamily: 'Poppins-Bold', color: '#fff' }}>
                  Update Password
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
