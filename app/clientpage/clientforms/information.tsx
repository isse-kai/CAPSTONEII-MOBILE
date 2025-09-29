import { Pressable, Text } from 'dripsy'
import * as ImagePicker from 'expo-image-picker'
import { useEffect } from 'react'
import { Alert, Image, View } from 'react-native'
import FormField from '../../../components/FormField'
import { getCurrentUser } from '../../../supabase/auth'
import { getClientByAuthUid, updateClientProfile } from '../../../supabase/client'

export default function ClientInformation({
  form,
  setForm,
  onNext,
}: {
  form: {
    firstName: string
    lastName: string
    contactNumber: string
    email: string
    street: string
    barangay: string
    additionalAddress: string
    facebook: string
    instagram: string
    linkedin: string
    profilePicture: any
    profilePictureName: string
  }
  setForm: React.Dispatch<React.SetStateAction<typeof form>>
  onNext: () => void
}) {
  const handleChange = (key: keyof typeof form, value: string) => {
    setForm(prev => ({ ...prev, [key]: value }))
  }

  const handleImagePick = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.7,
    })

    if (!result.canceled && result.assets.length > 0) {
      const asset = result.assets[0]
      setForm(prev => ({
        ...prev,
        profilePicture: asset.uri,
        profilePictureName: asset.fileName || 'profile.jpg',
      }))
    }
  }

  const handleNext = async () => {
    try {
      const user = await getCurrentUser()
      await updateClientProfile(user.id, {
        first_name: form.firstName,
        last_name: form.lastName,
        email_address: form.email,
        contact_number: form.contactNumber,
        street: form.street,
        barangay: form.barangay,
        additional_address: form.additionalAddress,
        facebook: form.facebook,
        instagram: form.instagram,
        linkedin: form.linkedin,
        profile_picture_url: form.profilePicture,
      })
      onNext()
    } catch (err) {
      console.error('Profile update error:', err)
      Alert.alert('Error', 'Failed to save personal information.')
    }
  }

  useEffect(() => {
    const preload = async () => {
      try {
        const user = await getCurrentUser()
        const client = await getClientByAuthUid(user.id)
        if (client) {
          setForm(prev => ({
            ...prev,
            firstName: client.first_name || '',
            lastName: client.last_name || '',
            email: client.email_address || user.email || '',
            contactNumber: client.contact_number || '',
            street: client.street || '',
            barangay: client.barangay || '',
            additionalAddress: client.additional_address || '',
            facebook: client.facebook || '',
            instagram: client.instagram || '',
            linkedin: client.linkedin || '',
            profilePicture: client.profile_picture_url || null,
            profilePictureName: '',
          }))
        }
      } catch (err) {
        console.warn('Failed to preload client profile:', err)
      }
    }

    preload()
  }, [])

  return (
    <View style={{ gap: 16 }}>
      <FormField label="First Name" value={form.firstName} onChange={text => handleChange('firstName', text)} />
      <FormField label="Last Name" value={form.lastName} onChange={text => handleChange('lastName', text)} />
      <FormField label="Email" value={form.email} onChange={text => handleChange('email', text)} keyboardType="email-address" />
      <FormField label="Contact Number" value={form.contactNumber} onChange={text => handleChange('contactNumber', text)} keyboardType="phone-pad" />
      <FormField label="Street" value={form.street} onChange={text => handleChange('street', text)} />
      <FormField label="Barangay" value={form.barangay} onChange={text => handleChange('barangay', text)} />
      <FormField label="Additional Address" value={form.additionalAddress} onChange={text => handleChange('additionalAddress', text)} />
      <FormField label="Facebook" value={form.facebook} onChange={text => handleChange('facebook', text)} />
      <FormField label="Instagram" value={form.instagram} onChange={text => handleChange('instagram', text)} />
      <FormField label="LinkedIn" value={form.linkedin} onChange={text => handleChange('linkedin', text)} />

      {/* Profile Picture Upload */}
      <Pressable
        onPress={handleImagePick}
        sx={{
          bg: '#e0f2fe',
          borderRadius: 8,
          py: 10,
          px: 16,
          alignSelf: 'flex-start',
        }}
      >
        <Text sx={{ fontSize: 14, fontFamily: 'Poppins-Bold', color: '#0369a1' }}>
          {form.profilePicture ? 'Change Profile Picture' : 'Upload Profile Picture'}
        </Text>
      </Pressable>

      {form.profilePicture && (
        <Image
          source={{ uri: form.profilePicture }}
          style={{ width: 100, height: 100, borderRadius: 50, marginTop: 12 }}
        />
      )}

      <Pressable
        onPress={handleNext}
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
          Continue to Step 2
        </Text>
      </Pressable>
    </View>
  )
}
