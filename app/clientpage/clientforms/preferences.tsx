import { Pressable, Text, View } from 'dripsy'
import { useFonts } from 'expo-font'
import { useRouter } from 'expo-router'
import { MotiView } from 'moti'
import { useEffect, useState } from 'react'
import { Alert, ScrollView } from 'react-native'
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context'
import ProfileField from '../../../components/form/ProfileField'
import { supabase } from '../../../supabase/auth'

export default function PreferencesForm() {
  const router = useRouter()
  const insets = useSafeAreaInsets()

  const [fontsLoaded] = useFonts({
    'Poppins-Regular': require('../../../../assets/fonts/Poppins/Poppins-Regular.ttf'),
    'Poppins-Bold': require('../../../../assets/fonts/Poppins-Bold.ttf'),
  })

  const [first_name, setFirstName] = useState('')
  const [last_name, setLastName] = useState('')
  const [sex, setSex] = useState('')
  const [email_address, setEmail] = useState('')

  useEffect(() => {
    const loadUserProfile = async () => {
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser()

      if (authError || !user) return

      const { data, error } = await supabase
        .from('profiles')
        .select('first_name, last_name, sex, email_address')
        .eq('id', user.id)
        .single()

      if (error) return console.error('Error fetching profile:', error)

      setFirstName(data.first_name || '')
      setLastName(data.last_name || '')
      setSex(data.sex || '')
      setEmail(data.email_address || '')
    }

    loadUserProfile()
  }, [])

  const handleSubmit = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) return Alert.alert('Error', 'User not authenticated.')

    const { error } = await supabase
      .from('profiles')
      .update({ first_name, last_name, sex, email_address })
      .eq('id', user.id)

    if (error) {
      console.error('Update error:', error)
      return Alert.alert('Error', 'Failed to save preferences.')
    }

    Alert.alert('Success', 'Preferences saved.')
    router.push('/client/profile/edit')
  }

  if (!fontsLoaded) return null

  return (
    <SafeAreaView
      style={{
        flex: 1,
        paddingTop: insets.top + 4,
        paddingBottom: insets.bottom + 4,
        backgroundColor: '#f9fafb',
      }}
    >
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          paddingHorizontal: 16,
          paddingVertical: 12,
          paddingBottom: 100,
        }}
        keyboardShouldPersistTaps="handled"
      >
        <MotiView
          from={{ opacity: 0, translateY: 20 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'timing', duration: 500 }}
          style={{ flex: 1 }}
        >
          <Text
            sx={{
              fontSize: 22,
              fontFamily: 'Poppins-Bold',
              color: '#001a33',
              mb: 24,
            }}
          >
            Edit Your Profile
          </Text>

          <View sx={{ gap: 12 }}>
            <ProfileField
              label="First Name"
              value={first_name}
              onChange={setFirstName}
              placeholder="Enter your first name"
            />
            <ProfileField
              label="Last Name"
              value={last_name}
              onChange={setLastName}
              placeholder="Enter your last name"
            />
            <ProfileField
              label="Sex"
              value={sex}
              onChange={setSex}
              placeholder="e.g. Male, Female, Non-binary"
            />
            <ProfileField
              label="Email Address"
              value={email_address}
              onChange={setEmail}
              placeholder="Enter your email"
              keyboardType="email-address"
            />

            <Pressable
              onPress={handleSubmit}
              sx={{
                mt: 16,
                bg: '#0284c7',
                borderRadius: 10,
                py: 12,
                px: 20,
                alignSelf: 'flex-start',
              }}
            >
              <Text sx={{ fontSize: 16, fontFamily: 'Poppins-Bold', color: '#fff' }}>
                Save Profile
              </Text>
            </Pressable>
          </View>
        </MotiView>
      </ScrollView>
    </SafeAreaView>
  )
}
