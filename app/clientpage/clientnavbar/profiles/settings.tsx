import { Ionicons } from '@expo/vector-icons'
import { Pressable, Text } from 'dripsy'
import { useFonts } from 'expo-font'
import moment from "moment"
import { MotiView } from 'moti'
import React from 'react'
import { ImageBackground, ScrollView, TextInput, View } from 'react-native'
import DateTimePickerModal from "react-native-modal-datetime-picker"
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context'
import { getClientByAuthUid, updateClientProfile } from '../../../../supabase/services/clientprofileservice'
import { getCurrentUser } from '../../../../supabase/services/loginservice'

import Header from '../../clientnavbar/header'
import ClientNavbar from '../../clientnavbar/navbar'

export default function AccountSettings() {
  const [user, setUser] = React.useState<any>(null)
  const [facebook, setFacebook] = React.useState("")
  const [instagram, setInstagram] = React.useState("")
  // const router = useRouter()
  const insets = useSafeAreaInsets()

  const [fontsLoaded] = useFonts({
    'Poppins-Regular': require('../../../../assets/fonts/Poppins/Poppins-Regular.ttf'),
    'Poppins-Bold': require('../../../../assets/fonts/Poppins/Poppins-Bold.ttf'),
    'Poppins-ExtraBold': require('../../../../assets/fonts/Poppins/Poppins-ExtraBold.ttf'),
  })

  const [dob, setDob] = React.useState<string>('')
  const [contactNumber, setContactNumber] = React.useState<string>("")
  // const age = React.useMemo(() => calculateAge(dob), [dob])
  const [showPicker, setShowPicker] = React.useState(false)

  const handleUpdateProfile = async () => {
  try {
    if (!user) return

    const newAge = calculateAge(dob)

    await updateClientProfile(user.id, {
      contact_number: contactNumber || null,
      date_of_birth: dob || null,
      age: newAge,
      social_facebook: facebook || null,
      social_instagram: instagram || null,
    })

    console.log("Profile updated successfully")
    // router.push("/clientpage/home")
  } catch (err) {
    console.error("Failed to update profile:", err)
  }
}

  function calculateAge(dob: string): string {
  if (!dob) return ""
  const birthDate = new Date(dob)
  const today = new Date()
  let age = today.getFullYear() - birthDate.getFullYear()
  const m = today.getMonth() - birthDate.getMonth()
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--
  }
  return age.toString()
}

  React.useEffect(() => {
    const fetchUser = async () => {
      try {
        const u = await getCurrentUser()
        setUser(u)

        if (!u) return

        const profile = await getClientByAuthUid(u.id)
        setDob(profile?.date_of_birth || "")
        setContactNumber(profile?.contact_number || "")
        setFacebook(profile?.social_facebook || "")
        setInstagram(profile?.social_instagram || "")
        setDob(profile?.date_of_birth || "")
      } catch (err) {
        console.error("Error fetching account settings:", err)
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
          {/* Header */}
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 12,
            }}
          >
            {/* Profile */}
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Ionicons
                name="person-outline"
                size={22}
                color="#374151"
                style={{ marginRight: 8 }}
              />
              <Text sx={{ fontSize: 18, fontFamily: 'Poppins-Bold' }}>Profile</Text>
            </View>

            {/* Active/Inactive */}
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
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

          {/* Account Created */}
          <View style={{ marginBottom: 12 }}>
            <Text sx={{ fontSize: 14, fontFamily: 'Poppins-Bold', mb: 2 }}>
              ACCOUNT CREATED
            </Text>
            <Text sx={{ fontSize: 14, fontFamily: 'Poppins-Regular', color: '#374151' }}>
              {user?.created_at ? new Date(user.created_at).toLocaleString() : 'N/A'}
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
                <Text sx={{ fontSize: 12, fontFamily: 'Poppins-Bold', mb: 4 }}>
                  FIRST NAME:
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
                <Text sx={{ fontSize: 12, fontFamily: 'Poppins-Bold', mb: 4 }}>
                  LAST NAME:
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
                <Text sx={{ fontSize: 12, fontFamily: 'Poppins-Bold', mb: 4 }}>
                  EMAIL:
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
                <Text sx={{ fontSize: 12, fontFamily: 'Poppins-Bold', mb: 4 }}>AGE:</Text>
                <TextInput
                  value={calculateAge(dob).toString()}
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

              {/* Contact Number */}
                <View style={{ marginBottom: 12 }}>
                  <Text sx={{ fontSize: 12, fontFamily: 'Poppins-Bold', mb: 4 }}>
                    CONTACT NUMBER:
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
                      value={contactNumber}
                      onChangeText={setContactNumber}
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
                    onPress={handleUpdateProfile}
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
                <Text sx={{ fontSize: 12, fontFamily: 'Poppins-Bold', mb: 4 }}>
                  DATE OF BIRTH:
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
                  onConfirm={(selectedDate) => {
                    setShowPicker(false)
                    if (selectedDate) {
                      const formatted = moment(selectedDate).format("YYYY-MM-DD")
                      setDob(formatted)
                    }
                  }}
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
                    onPress={handleUpdateProfile}
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
                <Text sx={{ fontSize: 12, fontFamily: 'Poppins-Bold', mb: 4 }}>
                  FACEBOOK:
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
                <Text sx={{ fontSize: 12, fontFamily: 'Poppins-Bold', mb: 4 }}>
                  INSTAGRAM:
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
                onPress={handleUpdateProfile}
                style={{
                  backgroundColor: '#008CFC',
                  paddingVertical: 10,
                  borderRadius: 8,
                  alignItems: 'center',
                }}
              >
                <Text sx={{ fontSize: 14, fontFamily: 'Poppins-Bold', color: '#fff' }}>
                  Confirm
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
              {/* Header row with icon + text */}
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
                <Ionicons
                  name="shield-checkmark-outline"   // ✅ Shield with check icon
                  size={22}
                  color="#374151"
                  style={{ marginRight: 8 }}
                />
                <Text sx={{ fontSize: 18, fontFamily: 'Poppins-Bold' }}>Security</Text>
              </View>

              {/* Current Password */}
              <View style={{ marginBottom: 12 }}>
                <Text sx={{ fontSize: 12, fontFamily: 'Poppins-Bold', mb: 4 }}>
                  CURRENT PASSWORD:
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
                <Text sx={{ fontSize: 12, fontFamily: 'Poppins-Bold', mb: 4 }}>
                  NEW PASSWORD:
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
                <Text sx={{ fontSize: 12, fontFamily: 'Poppins-Bold', mb: 4 }}>
                  CONFIRM NEW PASSWORD:
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
