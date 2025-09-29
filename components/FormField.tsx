import { Text, View } from 'dripsy';
import { TextInput } from 'react-native';

type FormFieldProps = {
  label: string;
  value: string;
  onChange: (text: string) => void;
  placeholder?: string;
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
};

export default function FormField({
  label,
  value,
  onChange,
  placeholder,
  keyboardType = 'default',
}: FormFieldProps) {
  return (
    <View sx={{ mb: 16 }}>
      <Text sx={{ fontSize: 14, fontFamily: 'Poppins-Bold', color: '#0284c7', mb: 6 }}>
        {label}
      </Text>
      <TextInput
        value={value}
        onChangeText={onChange}
        placeholder={placeholder}
        keyboardType={keyboardType}
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
