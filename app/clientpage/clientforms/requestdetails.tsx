import { Picker } from '@react-native-picker/picker'
import { Pressable, Text } from 'dripsy'
import * as ImagePicker from 'expo-image-picker'
import { useEffect } from 'react'
import { Image, View } from 'react-native'
import FormField from '../../../components/FormField'
import { getCurrentUser } from '../../../supabase/auth'
import { getClientByAuthUid } from '../../../supabase/client'

const serviceTasks = {
  Carpentry: ['General Carpentry', 'Furniture Repair', 'Wood Polishing', 'Door & Window Fitting', 'Custom Furniture Design', 'Modular Kitchen Installation', 'Flooring & Decking', 'Cabinet & Wardrobe Fixing', 'Wall Paneling & False Ceiling', 'Wood Restoration & Refinishing'],
  'Electrical Works': ['Wiring Repair', 'Appliance Installation', 'Lighting Fixtures', 'Circuit Breaker & Fuse Repair', 'CCTV & Security System Setup', 'Fan & Exhaust Installation', 'Inverter & Battery Setup', 'Switchboard & Socket Repair', 'Electrical Safety Inspection', 'Smart Home Automation'],
  Plumbing: ['Leak Fixing', 'Pipe Installation', 'Bathroom Fittings', 'Drain Cleaning & Unclogging', 'Water Tank Installation', 'Gas Pipeline Installation', 'Septic Tank & Sewer Repair', 'Water Heater Installation', 'Toilet & Sink Repair', 'Kitchen Plumbing Solutions'],
  'Car Washing': ['Exterior Wash', 'Interior Cleaning', 'Wax & Polish', 'Underbody Cleaning', 'Engine Bay Cleaning', 'Headlight Restoration', 'Ceramic Coating', 'Tire & Rim Cleaning', 'Vacuum & Odor Removal', 'Paint Protection Film Application'],
  Laundry: ['Dry Cleaning', 'Ironing', 'Wash & Fold', 'Steam Pressing', 'Stain Removal Treatment', 'Curtains & Upholstery Cleaning', 'Delicate Fabric Care', 'Shoe & Leather Cleaning', 'Express Same-Day Laundry', 'Eco-Friendly Washing'],
}

export default function ServiceRequestDetails({
  form,
  setForm,
  onNext,
}: {
  form: {
    serviceType: keyof typeof serviceTasks | ''
    serviceTask: string
    serviceDescription: string
    preferredDate: string
    preferredTime: string
    isUrgent: string
    toolsProvided: string
    image: string | null
    imageName: string
  }
  setForm: React.Dispatch<React.SetStateAction<typeof form>>
  onNext: () => void
}) {
  const serviceTypes = Object.keys(serviceTasks)

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
        image: asset.uri,
        imageName: asset.fileName || 'attachment.jpg',
      }))
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
            preferredDate: prev.preferredDate || '',
            preferredTime: prev.preferredTime || '',
            isUrgent: prev.isUrgent || '',
            toolsProvided: prev.toolsProvided || '',
          }))
        }
      } catch (err) {
        console.warn('Failed to preload client context:', err)
      }
    }

    preload()
  }, [])

  return (
    <View style={{ gap: 16 }}>
      {/* Service Type Dropdown */}
      <Text sx={{ fontSize: 14, fontFamily: 'Poppins-Bold', color: '#0284c7' }}>Service Type</Text>
      <Picker
        selectedValue={form.serviceType}
        onValueChange={value => handleChange('serviceType', value)}
        style={{ backgroundColor: '#fff', borderRadius: 8 }}
      >
        <Picker.Item label="Select service type" value="" />
        {serviceTypes.map(type => (
          <Picker.Item key={type} label={type} value={type} />
        ))}
      </Picker>

      {/* Service Task Dropdown */}
      {form.serviceType && (
        <>
          <Text sx={{ fontSize: 14, fontFamily: 'Poppins-Bold', color: '#0284c7' }}>Service Task</Text>
          <Picker
            selectedValue={form.serviceTask}
            onValueChange={value => handleChange('serviceTask', value)}
            style={{ backgroundColor: '#fff', borderRadius: 8 }}
          >
            <Picker.Item label="Select service task" value="" />
            {serviceTasks[form.serviceType].map(task => (
              <Picker.Item key={task} label={task} value={task} />
            ))}
          </Picker>
        </>
      )}

      <FormField
        label="Service Description"
        value={form.serviceDescription}
        onChange={text => handleChange('serviceDescription', text)}
        placeholder="Describe the issue or request"
      />
      <FormField
        label="Preferred Date"
        value={form.preferredDate}
        onChange={text => handleChange('preferredDate', text)}
        placeholder="YYYY-MM-DD"
      />
      <FormField
        label="Preferred Time"
        value={form.preferredTime}
        onChange={text => handleChange('preferredTime', text)}
        placeholder="HH:MM"
      />

      {/* Is Urgent Dropdown */}
      <Text sx={{ fontSize: 14, fontFamily: 'Poppins-Bold', color: '#0284c7' }}>Is Urgent?</Text>
      <Picker
        selectedValue={form.isUrgent}
        onValueChange={value => handleChange('isUrgent', value)}
        style={{ backgroundColor: '#fff', borderRadius: 8 }}
      >
        <Picker.Item label="Select urgency" value="" />
        <Picker.Item label="Yes" value="Yes" />
        <Picker.Item label="No" value="No" />
      </Picker>

      {/* Tools Provided Dropdown */}
      <Text sx={{ fontSize: 14, fontFamily: 'Poppins-Bold', color: '#0284c7' }}>Tools Provided?</Text>
      <Picker
        selectedValue={form.toolsProvided}
        onValueChange={value => handleChange('toolsProvided', value)}
        style={{ backgroundColor: '#fff', borderRadius: 8 }}
      >
        <Picker.Item label="Select tools option" value="" />
        <Picker.Item label="Yes" value="Yes" />
        <Picker.Item label="No" value="No" />
      </Picker>

      {/* Image Upload (Attachment) */}
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
          {form.image ? 'Change Attachment' : 'Upload Reference Image'}
        </Text>
      </Pressable>

      {form.image && (
        <Image
          source={{ uri: form.image }}
          style={{ width: 100, height: 100, borderRadius: 8, marginTop: 12 }}
        />
      )}

      <Pressable
        onPress={onNext}
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
          Continue to Step 3
        </Text>
      </Pressable>
    </View>
  )
}
