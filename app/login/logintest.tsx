// import { Pressable, Text, View } from 'dripsy'
// import { useFonts } from 'expo-font'
// import { useRouter } from 'expo-router'
// import { MotiView } from 'moti'
// import React, { useState } from 'react'
// import {
//   Alert,
//   Image,
//   ImageBackground,
//   ScrollView,
//   TextInput,
// } from 'react-native'
// import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context'
// import { loginUser } from '../../supabase/auth'

// export default function Login() {
//   const router = useRouter()
//   const insets = useSafeAreaInsets()

//   const [email, setEmail] = useState('')
//   const [password, setPassword] = useState('')
//   const [showPassword, setShowPassword] = useState(false)
//   const [isLoading, setIsLoading] = useState(false)

//   const [fontsLoaded] = useFonts({
//     'Poppins-Regular': require('../../assets/fonts/Poppins/Poppins-Regular.ttf'),
//     'Poppins-Bold': require('../../assets/fonts/Poppins/Poppins-Bold.ttf'),
//     'Poppins-ExtraBold': require('../../assets/fonts/Poppins/Poppins-ExtraBold.ttf'),
//   })

//   if (!fontsLoaded) return null

//   const handleLogin = async () => {
//     if (!email || !password) {
//       Alert.alert('Missing Fields', 'Please enter both email and password')
//       return
//     }

//     setIsLoading(true)
//     try {
//       const { token, role, profile } = await loginUser(email, password)
//       console.log('Logged in:', { token, role, profile })

//       if (role === 'client') {
//         router.push('/client/clienthome')
//       } else {
//         router.push('/worker/home')
//       }
//     } catch (err: any) {
//       Alert.alert('Login Failed', err.message)
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   return (
//     <ImageBackground
//       source={require('../../assets/login.jpg')}
//       style={{ flex: 1 }}
//       resizeMode="cover"
//     >
//       <SafeAreaView
//         style={{
//           flex: 1,
//           paddingTop: insets.top + 12,
//           paddingBottom: insets.bottom + 12,
//         }}
//       >
//         <ScrollView
//           contentContainerStyle={{
//             flexGrow: 1,
//             paddingHorizontal: 16,
//             paddingVertical: 24,
//             justifyContent: 'center',
//           }}
//           keyboardShouldPersistTaps="handled"
//         >
//           <MotiView
//             from={{ opacity: 0, translateY: 20 }}
//             animate={{ opacity: 1, translateY: 0 }}
//             transition={{ type: 'timing', duration: 500 }}
//             style={{ gap: 24 }}
//           >
//             {/* Logo */}
//             <View sx={{ alignItems: 'center', mb: 12 }}>
//               <Image
//                 source={require('../../assets/jdklogo.png')}
//                 style={{ width: 100, height: 100, resizeMode: 'contain' }}
//               />
//               <Text
//                 sx={{
//                   fontSize: 20,
//                   fontFamily: 'Poppins-ExtraBold',
//                   color: '#ffffff',
//                   mt: 8,
//                 }}
//               >
//                 JDK Homecare
//               </Text>
//             </View>

//             {/* Email */}
//             <View>
//               <Text sx={{ fontSize: 14, color: '#fff', mb: 4 }}>Email</Text>
//               <TextInput
//                 value={email}
//                 onChangeText={setEmail}
//                 placeholder="Enter your email"
//                 placeholderTextColor="#ccc"
//                 style={{
//                   backgroundColor: '#ffffffcc',
//                   borderRadius: 8,
//                   paddingHorizontal: 12,
//                   paddingVertical: 10,
//                   fontSize: 14,
//                 }}
//               />
//             </View>

//             {/* Password */}
//             <View>
//               <Text sx={{ fontSize: 14, color: '#fff', mb: 4 }}>Password</Text>
//               <TextInput
//                 value={password}
//                 onChangeText={setPassword}
//                 placeholder="Enter your password"
//                 placeholderTextColor="#ccc"
//                 secureTextEntry={!showPassword}
//                 style={{
//                   backgroundColor: '#ffffffcc',
//                   borderRadius: 8,
//                   paddingHorizontal: 12,
//                   paddingVertical: 10,
//                   fontSize: 14,
//                 }}
//               />
//               <Pressable onPress={() => setShowPassword(prev => !prev)} sx={{ mt: 6 }}>
//                 <Text sx={{ fontSize: 12, color: '#fff' }}>
//                   {showPassword ? 'Hide' : 'Show'} Password
//                 </Text>
//               </Pressable>
//             </View>

//             {/* Login Button */}
//             <Pressable
//               onPress={handleLogin}
//               disabled={isLoading}
//               sx={{
//                 bg: '#008CFC',
//                 borderRadius: 8,
//                 py: 12,
//                 alignItems: 'center',
//               }}
//             >
//               <Text
//                 sx={{
//                   fontSize: 16,
//                   fontFamily: 'Poppins-Bold',
//                   color: '#fff',
//                 }}
//               >
//                 {isLoading ? 'Logging in...' : 'Login'}
//               </Text>
//             </Pressable>
//           </MotiView>
//         </ScrollView>
//       </SafeAreaView>
//     </ImageBackground>
//   )
// }
