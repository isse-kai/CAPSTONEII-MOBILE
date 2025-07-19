import { Pressable, Text, TextInput, View } from 'dripsy'
import { useRouter } from 'expo-router'
import { useState } from 'react'

export default function Login() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  return (
    <View
      sx={{
        flex: 1,
        justifyContent: 'center',
        px: 'md',
        bg: 'background',
      }}
    >
      <Text sx={{ fontSize: 24, fontWeight: 'bold', mb: 'md' }}>Login</Text>

      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={{
          padding: 12,
          marginBottom: 12,
          borderRadius: 8,
          backgroundColor: '#f3f4f6',
        }}
      />

      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={{
          padding: 12,
          marginBottom: 16,
          borderRadius: 8,
          backgroundColor: '#f3f4f6',
        }}
      />

      <Pressable
        onPress={() => console.log('Login pressed')}
        sx={{
          bg: 'blue',
          py: 'sm',
          borderRadius: 'md',
        }}
      >
        <Text sx={{ textAlign: 'center', color: 'background', fontWeight: 'bold' }}>
          Login
        </Text>
      </Pressable>
    </View>
  )
}
