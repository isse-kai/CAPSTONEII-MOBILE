import { Text } from 'dripsy'
import { TextInput, View } from 'react-native'

type Props = {
  label: string
  value: string
  onChange: (text: string) => void
  placeholder?: string
  keyboardType?: 'default' | 'email-address'
}

export default function ProfileField({
  label,
  value,
  onChange,
  placeholder,
  keyboardType = 'default',
}: Props) {
  return (
    <View style={{ marginBottom: 16 }}>
      <Text
        sx={{
          fontSize: 16,
          fontFamily: 'Poppins-Bold',
          color: '#0284c7',
          mb: 6,
        }}
      >
        {label}
      </Text>
      <TextInput
        value={value}
        onChangeText={onChange}
        placeholder={placeholder}
        keyboardType={keyboardType}
        autoCapitalize="none"
        style={{
          borderWidth: 1,
          borderColor: '#d1d5db',
          borderRadius: 8,
          padding: 12,
          fontFamily: 'Poppins-Regular',
          fontSize: 14,
          backgroundColor: '#fff',
        }}
      />
    </View>
  )
}
