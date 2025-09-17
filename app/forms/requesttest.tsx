import { Text, View } from 'dripsy'
import { MotiView } from 'moti'
import React, { useState } from 'react'
import { SafeAreaView, ScrollView, TextInput } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

export default function RequestClientInfo() {
  const insets = useSafeAreaInsets()

  const [first, setFirst] = useState<string>('')
  const [last, setLast] = useState<string>('')
  const [phone, setPhone] = useState<string>('')
  const [email, setEmail] = useState<string>('')
  const [brgy, setBrgy] = useState<string | null>(null)
  const [street, setStreet] = useState<string>('')
  const [addr, setAddr] = useState<string>('')
  const [fb, setFb] = useState<string>('')
  const [ig, setIg] = useState<string>('')
  const [li, setLi] = useState<string>('')
  const [photo, setPhoto] = useState<string | null>(null)

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
          paddingHorizontal: 16,
          paddingBottom: 100,
        }}
        keyboardShouldPersistTaps="handled"
      >
        <MotiView
          from={{ opacity: 0, translateY: 20 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'timing', duration: 500 }}
          style={{ gap: 16 }}
        >
          <Text sx={{ fontSize: 20, fontWeight: 'bold', mb: 8, color: '#001a33' }}>
            Personal Information
          </Text>

          {[
            { label: 'First Name', value: first, setter: setFirst },
            { label: 'Last Name', value: last, setter: setLast },
            { label: 'Phone Number', value: phone, setter: setPhone },
            { label: 'Email Address', value: email, setter: setEmail },
            { label: 'Barangay', value: brgy ?? '', setter: setBrgy },
            { label: 'Street', value: street, setter: setStreet },
            { label: 'Full Address', value: addr, setter: setAddr },
            { label: 'Facebook', value: fb, setter: setFb },
            { label: 'Instagram', value: ig, setter: setIg },
            { label: 'LinkedIn', value: li, setter: setLi },
          ].map((field, index) => (
            <View key={index}>
              <Text sx={{ fontSize: 14, mb: 4, color: '#374151' }}>{field.label}</Text>
              <TextInput
                value={field.value}
                onChangeText={field.setter}
                placeholder={`Enter ${field.label}`}
                style={{
                  backgroundColor: '#fff',
                  borderRadius: 8,
                  paddingHorizontal: 12,
                  paddingVertical: 10,
                  fontSize: 14,
                  borderWidth: 1,
                  borderColor: '#e5e7eb',
                }}
              />
            </View>
          ))}

          {/* Optional: Photo URL input */}
          <View>
            <Text sx={{ fontSize: 14, mb: 4, color: '#374151' }}>Profile Photo URL</Text>
            <TextInput
              value={photo ?? ''}
              onChangeText={setPhoto}
              placeholder="Paste image URL"
              style={{
                backgroundColor: '#fff',
                borderRadius: 8,
                paddingHorizontal: 12,
                paddingVertical: 10,
                fontSize: 14,
                borderWidth: 1,
                borderColor: '#e5e7eb',
              }}
            />
          </View>
        </MotiView>
      </ScrollView>
    </SafeAreaView>
  )
}
