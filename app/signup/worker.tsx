import { Pressable, Text, TextInput, View } from 'dripsy'
import { useState } from 'react'

export default function SignupWorker() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [serviceType, setServiceType] = useState('')
  const [experience, setExperience] = useState('')

  const handleSignup = () => {
    // Database
    console.log('Worker signup:', { name, email, serviceType, experience })
  }

  return (
    <View sx={{ flex: 1, justifyContent: 'center', px: 'lg', bg: 'background' }}>
      <Text sx={{ fontSize: 24, fontWeight: 'bold', mb: 'xl', textAlign: 'center' }}>
        Worker Signup
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
        sx={{ mb: 'md', p: 'md', bg: 'muted', borderRadius: 'md' }}
      />
      <TextInput
        placeholder="Service Type (e.g. Plumbing)"
        value={serviceType}
        onChangeText={setServiceType}
        sx={{ mb: 'md', p: 'md', bg: 'muted', borderRadius: 'md' }}
      />
      <TextInput
        placeholder="Years of Experience"
        value={experience}
        onChangeText={setExperience}
        keyboardType="numeric"
        sx={{ mb: 'xl', p: 'md', bg: 'muted', borderRadius: 'md' }}
      />

      <Pressable onPress={handleSignup} sx={{ bg: 'secondary', p: 'md', borderRadius: 'md' }}>
        <Text sx={{ textAlign: 'center', color: 'background', fontWeight: 'bold' }}>
          Sign Up as Worker
        </Text>
      </Pressable>
    </View>
  )
}
