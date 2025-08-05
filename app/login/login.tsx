import { Image, Pressable, Text, TextInput, View } from 'dripsy'
import { useFonts } from 'expo-font'
import { useRouter } from 'expo-router'
import { useState } from 'react'
import { ImageBackground } from 'react-native'

export default function Login() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const [fontsLoaded] = useFonts({
      'Poppins-Regular': require('../../assets/fonts/Poppins/Poppins-Regular.ttf'),
      'Poppins-Bold': require('../../assets/fonts/Poppins/Poppins-Bold.ttf'),
      'Poppins-ExtraBold': require('../../assets/fonts/Poppins/Poppins-ExtraBold.ttf'),
    })

  return (
    <ImageBackground
      source={require('../../assets/login.jpg')}
      style={{ flex: 1 }}
      resizeMode="cover"
    >
      <View
        sx={{
          flex: 1,
          justifyContent: 'center',
          px: 'md',
        }}
      >
        {/* Vector Image */}
        <Image
          source={require('../../assets/4.png')}
          style={{ width: 250, height: 250, alignSelf: 'center', marginBottom: -50, marginTop: -200 }}
          resizeMode="contain"
        />

        <Text sx={{ 
          fontSize: 30, 
          fontWeight: 'bold', 
          mb: 'md', 
          textAlign: 'center',
          fontFamily: 'Poppins-ExtraBold' }}
          >
          Login
        </Text>

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
            alignItems: 'center',
            mb: 'md',
          }}
        >
          <Text sx={{ 
            textAlign: 'center', 
            color: 'background', 
            fontWeight: 'bold', 
            fontSize: 18, 
            fontFamily: 'Poppins-ExtraBold'}}>
            Login
          </Text>
        </Pressable>
      </View>
    </ImageBackground>
  )
}