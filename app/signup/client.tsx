import { Pressable, Text, TextInput, View } from 'dripsy'
import { useState } from 'react'

export default function SignupClient() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSignup = () => {
    // Database
    console.log('Client signup:', { name, email })
  }

  return (
    <View sx={{ flex: 1, justifyContent: 'center', px: 'lg', bg: 'background' }}>
      <Text sx={{ fontSize: 24, fontWeight: 'bold', mb: 'xl', textAlign: 'center' }}>
        Client Signup
      </Text>

      <TextInput
        placeholder="Name"
        value={name}
        onChangeText={setName}
        sx={{ mb: 'md', p: 'md', bg: 'muted', borderRadius: 'md' }}
      />
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        sx={{ mb: 'md', p: 'md', bg: 'muted', borderRadius: 'md' }}
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        sx={{ mb: 'xl', p: 'md', bg: 'muted', borderRadius: 'md' }}
      />

      <Pressable onPress={handleSignup} sx={{ bg: 'primary', p: 'md', borderRadius: 'md' }}>
        <Text sx={{ textAlign: 'center', color: 'background', fontWeight: 'bold' }}>
          Sign Up as Client
        </Text>
      </Pressable>
    </View>
  )
}
