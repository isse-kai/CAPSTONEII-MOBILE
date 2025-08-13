// import { Pressable, Text, TextInput, View } from 'dripsy'
// import { useState } from 'react'

// export default function SignupClient() {
//   const [name, setName] = useState('')
//   const [email, setEmail] = useState('')
//   const [password, setPassword] = useState('')

//   const handleSignup = () => {
//     // Database
//     console.log('Client signup:', { name, email })
//   }

//   return (
//     <View sx={{ flex: 1, justifyContent: 'center', px: 'lg', bg: 'background' }}>
//       <Text sx={{ fontSize: 24, fontWeight: 'bold', mb: 'xl', textAlign: 'center' }}>
//         Client Signup
//       </Text>

//       <TextInput
//         placeholder="Name"
//         value={name}
//         onChangeText={setName}
//         sx={{ mb: 'md', p: 'md', bg: 'muted', borderRadius: 'md' }}
//       />
//       <TextInput
//         placeholder="Email"
//         value={email}
//         onChangeText={setEmail}
//         keyboardType="email-address"
//         autoCapitalize="none"
//         sx={{ mb: 'md', p: 'md', bg: 'muted', borderRadius: 'md' }}
//       />
//       <TextInput
//         placeholder="Password"
//         value={password}
//         onChangeText={setPassword}
//         secureTextEntry
//         sx={{ mb: 'xl', p: 'md', bg: 'muted', borderRadius: 'md' }}
//       />

//       <Pressable onPress={handleSignup} sx={{ bg: 'primary', p: 'md', borderRadius: 'md' }}>
//         <Text sx={{ textAlign: 'center', color: 'background', fontWeight: 'bold' }}>
//           Sign Up as Client
//         </Text>
//       </Pressable>
//     </View>
//   )
// }





// import { Image, Pressable, Text, TextInput, View } from 'dripsy'
// import { useFonts } from 'expo-font'
// import { useRouter } from 'expo-router'
// import { useState } from 'react'
// import { Alert, ImageBackground } from 'react-native'

// export default function ClientSignUpPage() {
//   const router = useRouter()

//   const [first_name, setFirstName] = useState('')
//   const [last_name, setLastName] = useState('')
//   const [sex, setSex] = useState('')
//   const [email_address, setEmail] = useState('')
//   const [password, setPassword] = useState('')
//   const [confirm_password, setConfirmPassword] = useState('')
//   const [is_agreed_to_terms, setIsAgreedToTerms] = useState(false)
//   const [error_message, setErrorMessage] = useState('')

//   const [fontsLoaded] = useFonts({
//     'Poppins-Regular': require('../../assets/fonts/Poppins/Poppins-Regular.ttf'),
//     'Poppins-Bold': require('../../assets/fonts/Poppins/Poppins-Bold.ttf'),
//     'Poppins-ExtraBold': require('../../assets/fonts/Poppins/Poppins-ExtraBold.ttf'),
//   })

//   const isFormValid = (
//     first_name.trim() &&
//     last_name.trim() &&
//     sex.trim() &&
//     email_address.trim() &&
//     password.trim() &&
//     confirm_password.trim() &&
//     password === confirm_password &&
//     is_agreed_to_terms
//   )

//   const handleSubmit = () => {
//     if (!isFormValid) {
//       setErrorMessage('Please complete all fields correctly.')
//       return
//     }

//     setErrorMessage('')
//     Alert.alert('Success', 'Account created successfully!')
//     router.push('/login/login') // Simulated navigation
//   }

//   return (
//     <ImageBackground
//       source={require('../../assets/signup.jpg')}
//       style={{ flex: 1 }}
//       resizeMode="cover"
//     >
//       <View
//         sx={{
//           flex: 1,
//           justifyContent: 'center',
//           px: 'md',
//         }}
//       >
//         <Image
//           source={require('../../assets/jdklogo.png')}
//           style={{ width: 180, height: 180, alignSelf: 'center', marginBottom: -40, marginTop: -120 }}
//           resizeMode="contain"
//         />

//         <Text
//           sx={{
//             fontSize: 26,
//             fontWeight: 'bold',
//             mb: 'md',
//             textAlign: 'center',
//             fontFamily: 'Poppins-ExtraBold',
//           }}
//         >
//           Sign up to be a <Text sx={{ color: 'blue' }}>Client</Text>
//         </Text>

//         <TextInput
//           placeholder="First Name"
//           value={first_name}
//           onChangeText={setFirstName}
//           style={inputStyle}
//         />
//         <TextInput
//           placeholder="Last Name"
//           value={last_name}
//           onChangeText={setLastName}
//           style={inputStyle}
//         />
//         <TextInput
//           placeholder="Sex (Male/Female)"
//           value={sex}
//           onChangeText={setSex}
//           style={inputStyle}
//         />
//         <TextInput
//           placeholder="Email Address"
//           value={email_address}
//           onChangeText={setEmail}
//           keyboardType="email-address"
//           style={inputStyle}
//         />
//         <TextInput
//           placeholder="Password"
//           value={password}
//           onChangeText={setPassword}
//           secureTextEntry
//           style={inputStyle}
//         />
//         <TextInput
//           placeholder="Confirm Password"
//           value={confirm_password}
//           onChangeText={setConfirmPassword}
//           secureTextEntry
//           style={inputStyle}
//         />

//         <Pressable onPress={() => setIsAgreedToTerms(!is_agreed_to_terms)} sx={{ mb: 'sm' }}>
//           <Text sx={{ fontSize: 14, fontFamily: 'Poppins-Regular' }}>
//             {is_agreed_to_terms ? '☑' : '☐'} I agree to JDK HOMECARE’s{' '}
//             <Text sx={{ color: 'blue' }}>Terms of Service</Text> and{' '}
//             <Text sx={{ color: 'blue' }}>Privacy Policy</Text>.
//           </Text>
//         </Pressable>

//         <Pressable
//           onPress={handleSubmit}
//           sx={{
//             bg: 'blue',
//             py: 'sm',
//             borderRadius: 'md',
//             alignItems: 'center',
//             mb: 'md',
//           }}
//         >
//           <Text
//             sx={{
//               textAlign: 'center',
//               color: 'background',
//               fontWeight: 'bold',
//               fontSize: 18,
//               fontFamily: 'Poppins-ExtraBold',
//             }}
//           >
//             Create my account
//           </Text>
//         </Pressable>

//         {error_message ? (
//           <Text sx={{ color: 'red', textAlign: 'center', fontFamily: 'Poppins-Regular' }}>
//             {error_message}
//           </Text>
//         ) : null}

//         <Pressable onPress={() => router.push('/login/login')} sx={{ mt: 'md' }}>
//           <Text sx={{ textAlign: 'center', fontFamily: 'Poppins-Regular' }}>
//             Already have an account? <Text sx={{ color: 'blue' }}>Log In</Text>
//           </Text>
//         </Pressable>
//       </View>
//     </ImageBackground>
//   )
// }

// const inputStyle = {
//   padding: 12,
//   marginBottom: 12,
//   borderRadius: 8,
//   backgroundColor: '#f3f4f6',
// }
