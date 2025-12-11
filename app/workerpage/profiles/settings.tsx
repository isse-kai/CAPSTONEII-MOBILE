// app/workerpage/profiles/settings.tsx (WorkerAccountSettings)
import { Ionicons } from '@expo/vector-icons'
import { Pressable, Text } from 'dripsy'
import { useFonts } from 'expo-font'
import { useRouter } from 'expo-router'
import moment from 'moment'
import { MotiView } from 'moti'
import React from 'react'
import {
  ImageBackground,
  ScrollView,
  TextInput,
  View,
} from 'react-native'
import DateTimePickerModal from 'react-native-modal-datetime-picker'
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context'
import { getCurrentUser } from '../../../supabase/services/loginservice'
import {
  getUserWorkerByAuthUid,
} from '../../../supabase/services/workerprofileservice'
import WorkerHeader from '../workernavbar/header'
import WorkerNavbar from '../workernavbar/navbar'

export default function WorkerAccountSettings() {
  const [user, setUser] = React.useState<any>(null)
  const [workerProfile, setWorkerProfile] = React.useState<any>(null)

  const router = useRouter()
  const insets = useSafeAreaInsets()

  const [fontsLoaded] = useFonts({
    'Poppins-Regular': require('../../../assets/fonts/Poppins/Poppins-Regular.ttf'),
    'Poppins-Bold': require('../../../assets/fonts/Poppins/Poppins-Bold.ttf'),
    'Poppins-ExtraBold': require('../../../assets/fonts/Poppins/Poppins-ExtraBold.ttf'),
  })

  const [dob, setDob] = React.useState<string>('')
  const [age, setAge] = React.useState<string>('') // age state
  const [showPicker, setShowPicker] = React.useState(false)

  React.useEffect(() => {
    const fetchUserAndProfile = async () => {
      try {
        // Auth user (from Supabase auth)
        const authUser = await getCurrentUser()
        setUser(authUser)

        // Worker profile (from your own Supabase table, e.g. user_worker)
        const profile = await getUserWorkerByAuthUid(authUser.id)
        setWorkerProfile(profile)

        // Prefer DOB / age from DB profile if available
        const dbDob =
          profile?.date_of_birth ||
          profile?.dob ||
          authUser?.user_metadata?.dob

        const dbAge =
          profile?.age ??
          authUser?.user_metadata?.age

        if (dbDob) {
          setDob(dbDob)
          const calculatedAge = moment().diff(
            moment(dbDob, 'YYYY-MM-DD'),
            'years'
          )
          setAge(calculatedAge.toString())
        } else if (dbAge != null) {
          setAge(String(dbAge))
        }
      } catch (err) {
        console.error('Failed to load worker account', err)
      }
    }

    fetchUserAndProfile()
  }, [])

  const handleConfirmDob = (selectedDate: Date) => {
    setShowPicker(false)
    if (selectedDate) {
      const formatted = moment(selectedDate).format('YYYY-MM-DD')
      setDob(formatted)

      // compute age based on selected DOB
      const calculatedAge = moment().diff(moment(selectedDate), 'years')
      setAge(calculatedAge.toString())
    }
  }

  if (!fontsLoaded) return null

  // shared style for readonly text inputs
  const readonlyInputStyle = {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12, // enlarged
    fontSize: 15,
    fontFamily: 'Poppins-Regular' as const,
    backgroundColor: '#f9fafb',
    color: '#374151',
  }

  return (
    <ImageBackground
      source={require('../../../assets/login.jpg')}
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
            <WorkerHeader />

            {/* Account Details */}
            <View
              style={{
                backgroundColor: '#ffffffcc',
                borderRadius: 12,
                padding: 16,
                marginBottom: 20,
              }}
            >
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: 8,
                }}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Ionicons
                    name="person-outline"
                    size={22}
                    color="#374151"
                    style={{ marginRight: 8 }}
                  />
                  <Text sx={{ fontSize: 18, fontFamily: 'Poppins-Bold' }}>
                    Profile
                  </Text>
                </View>
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
                      backgroundColor: user?.confirmed_at
                        ? '#22c55e'
                        : '#ef4444',
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

              {/* ROLE INDICATOR: WORKER ACCOUNT */}
              <View
                style={{
                  alignSelf: 'flex-start',
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginBottom: 12,
                  paddingHorizontal: 10,
                  paddingVertical: 4,
                  borderRadius: 999,
                  backgroundColor: 'rgba(37,99,235,0.08)', // soft blue
                }}
              >
                <Ionicons
                  name="briefcase-outline"
                  size={16}
                  color="#1D4ED8"
                  style={{ marginRight: 6 }}
                />
                <Text
                  sx={{
                    fontSize: 12,
                    fontFamily: 'Poppins-Bold',
                    color: '#1D4ED8',
                    letterSpacing: 0.5,
                  }}
                >
                  WORKER ACCOUNT
                </Text>
              </View>

              <View style={{ marginBottom: 12 }}>
                <Text
                  sx={{
                    fontSize: 14,
                    fontFamily: 'Poppins-Bold',
                    mb: 2,
                  }}
                >
                  ACCOUNT CREATED
                </Text>
                <Text
                  sx={{
                    fontSize: 14,
                    fontFamily: 'Poppins-Regular',
                    color: '#374151',
                  }}
                >
                  {user?.created_at
                    ? new Date(user.created_at).toLocaleString()
                    : 'N/A'}
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
              <Text
                sx={{
                  fontSize: 18,
                  fontFamily: 'Poppins-Bold',
                  mb: 12,
                }}
              >
                Personal Information
              </Text>

              {/* First Name */}
              <View style={{ marginBottom: 14 }}>
                <Text
                  sx={{
                    fontSize: 12,
                    fontFamily: 'Poppins-Bold',
                    mb: 4,
                  }}
                >
                  FIRST NAME:
                </Text>
                <TextInput
                  value={
                    workerProfile?.first_name ||
                    user?.user_metadata?.first_name ||
                    'N/A'
                  }
                  editable={false}
                  style={readonlyInputStyle}
                />
              </View>

              {/* Last Name */}
              <View style={{ marginBottom: 14 }}>
                <Text
                  sx={{
                    fontSize: 12,
                    fontFamily: 'Poppins-Bold',
                    mb: 4,
                  }}
                >
                  LAST NAME:
                </Text>
                <TextInput
                  value={
                    workerProfile?.last_name ||
                    user?.user_metadata?.last_name ||
                    'N/A'
                  }
                  editable={false}
                  style={readonlyInputStyle}
                />
              </View>

              {/* Email */}
              <View style={{ marginBottom: 14 }}>
                <Text
                  sx={{
                    fontSize: 12,
                    fontFamily: 'Poppins-Bold',
                    mb: 4,
                  }}
                >
                  EMAIL:
                </Text>
                <TextInput
                  value={
                    workerProfile?.email_address ||
                    user?.email ||
                    'N/A'
                  }
                  editable={false}
                  style={readonlyInputStyle}
                />
              </View>

              {/* Age */}
              <View style={{ marginBottom: 14 }}>
                <Text
                  sx={{
                    fontSize: 12,
                    fontFamily: 'Poppins-Bold',
                    mb: 4,
                  }}
                >
                  AGE:
                </Text>
                <TextInput
                  value={age || 'N/A'}
                  editable={false}
                  style={readonlyInputStyle}
                />
              </View>

              {/* Contact Number */}
              <View style={{ marginBottom: 16 }}>
                <Text
                  sx={{
                    fontSize: 12,
                    fontFamily: 'Poppins-Bold',
                    mb: 4,
                  }}
                >
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
                      paddingHorizontal: 12,
                      paddingVertical: 12,
                      backgroundColor: '#f9fafb',
                    }}
                  >
                    <Text
                      sx={{
                        fontSize: 14,
                        fontFamily: 'Poppins-Regular',
                      }}
                    >
                      🇵🇭 +63
                    </Text>
                  </View>
                  <TextInput
                    defaultValue={
                      workerProfile?.contact_number ||
                      user?.user_metadata?.contact_number ||
                      ''
                    }
                    placeholder="Enter contact number"
                    keyboardType="number-pad"
                    style={{
                      flex: 1,
                      paddingHorizontal: 12,
                      paddingVertical: 12,
                      fontSize: 15,
                      fontFamily: 'Poppins-Regular',
                      backgroundColor: '#fff',
                    }}
                  />
                </View>
              </View>

              {/* Date of Birth */}
              <View style={{ marginBottom: 12 }}>
                <Text
                  sx={{
                    fontSize: 12,
                    fontFamily: 'Poppins-Bold',
                    mb: 4,
                  }}
                >
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
                    paddingHorizontal: 12,
                    paddingVertical: 12,
                    backgroundColor: '#f9fafb',
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

                <View style={{ flexDirection: 'row', marginTop: 8 }}>
                  <Pressable
                    onPress={() => {
                      setDob('')
                      setAge('')
                    }}
                    style={{
                      backgroundColor: '#ef4444',
                      paddingVertical: 8,
                      paddingHorizontal: 14,
                      borderRadius: 6,
                      marginRight: 8,
                    }}
                  >
                    <Text
                      sx={{
                        fontSize: 14,
                        fontFamily: 'Poppins-Bold',
                        color: '#fff',
                      }}
                    >
                      Remove
                    </Text>
                  </Pressable>
                  <Pressable
                    onPress={() => console.log('Change DOB to', dob)}
                    style={{
                      backgroundColor: '#008CFC',
                      paddingVertical: 8,
                      paddingHorizontal: 14,
                      borderRadius: 6,
                    }}
                  >
                    <Text
                      sx={{
                        fontSize: 14,
                        fontFamily: 'Poppins-Bold',
                        color: '#fff',
                      }}
                    >
                      Change
                    </Text>
                  </Pressable>
                </View>
              </View>
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
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginBottom: 12,
                }}
              >
                <Ionicons
                  name="shield-checkmark-outline"
                  size={22}
                  color="#374151"
                  style={{ marginRight: 8 }}
                />
                <Text
                  sx={{
                    fontSize: 18,
                    fontFamily: 'Poppins-Bold',
                  }}
                >
                  Security
                </Text>
              </View>

              {/* Current Password */}
              <View style={{ marginBottom: 14 }}>
                <Text
                  sx={{
                    fontSize: 12,
                    fontFamily: 'Poppins-Bold',
                    mb: 4,
                  }}
                >
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
                  <Ionicons
                    name="lock-closed-outline"
                    size={20}
                    color="#6b7280"
                    style={{ marginHorizontal: 8 }}
                  />
                  <TextInput
                    placeholder="Enter current password"
                    secureTextEntry
                    style={{
                      flex: 1,
                      paddingHorizontal: 12,
                      paddingVertical: 12,
                      fontSize: 15,
                      fontFamily: 'Poppins-Regular',
                    }}
                  />
                </View>
              </View>

              {/* New Password */}
              <View style={{ marginBottom: 14 }}>
                <Text
                  sx={{
                    fontSize: 12,
                    fontFamily: 'Poppins-Bold',
                    mb: 4,
                  }}
                >
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
                  <Ionicons
                    name="key-outline"
                    size={20}
                    color="#6b7280"
                    style={{ marginHorizontal: 8 }}
                  />
                  <TextInput
                    placeholder="Enter new password"
                    secureTextEntry
                    style={{
                      flex: 1,
                      paddingHorizontal: 12,
                      paddingVertical: 12,
                      fontSize: 15,
                      fontFamily: 'Poppins-Regular',
                    }}
                  />
                </View>
              </View>

              {/* Confirm New Password */}
              <View style={{ marginBottom: 16 }}>
                <Text
                  sx={{
                    fontSize: 12,
                    fontFamily: 'Poppins-Bold',
                    mb: 4,
                  }}
                >
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
                  <Ionicons
                    name="checkmark-done-outline"
                    size={20}
                    color="#6b7280"
                    style={{ marginHorizontal: 8 }}
                  />
                  <TextInput
                    placeholder="Confirm new password"
                    secureTextEntry
                    style={{
                      flex: 1,
                      paddingHorizontal: 12,
                      paddingVertical: 12,
                      fontSize: 15,
                      fontFamily: 'Poppins-Regular',
                    }}
                  />
                </View>
              </View>

              {/* Update Button */}
              <Pressable
                onPress={() => console.log('Change password pressed')}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: '#008CFC',
                  paddingVertical: 12,
                  borderRadius: 8,
                }}
              >
                <Text
                  sx={{
                    fontSize: 14,
                    fontFamily: 'Poppins-Bold',
                    color: '#fff',
                  }}
                >
                  Update Password
                </Text>
              </Pressable>
            </View>
          </MotiView>
        </ScrollView>

        <WorkerNavbar />
      </SafeAreaView>
    </ImageBackground>
  )
}
