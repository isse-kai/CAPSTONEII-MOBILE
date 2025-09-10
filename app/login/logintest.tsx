// import { Pressable, Text, TextInput, View } from 'dripsy'
// import { useFonts } from 'expo-font'
// import { useRouter } from 'expo-router'
// import { MotiView } from 'moti'
// import { useState } from 'react'
// import { Alert, Image, ImageBackground } from 'react-native'
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
//         router.push('/')
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
//           paddingTop: insets.top + 8,
//           paddingBottom: insets.bottom + 8,
//           paddingHorizontal: 16,
//         }}
//       >
//         <MotiView
//           from={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           transition={{ type: 'timing', duration: 600 }}
//           style={{ flex: 1 }}
//         >
//           {/* Back Button */}
//           <MotiView
//             from={{ opacity: 0, translateX: -20 }}
//             animate={{ opacity: 1, translateX: 0 }}
//             transition={{ type: 'timing', duration: 500, delay: 50 }}
//           >
//             <View sx={{ position: 'absolute', top: 0, left: 0 }}>
//               <Pressable
//                 onPress={() => router.back()}
//                 sx={{
//                   bg: '#f3f4f6',
//                   p: 10,
//                   borderRadius: 20,
//                   elevation: 2,
//                   shadowColor: '#000',
//                   shadowOffset: { width: 0, height: 1 },
//                   shadowOpacity: 0.2,
//                   shadowRadius: 2,
//                   height: 40,
//                   width: 40,
//                   ml: 8,
//                   mt: 8,
//                 }}
//               >
//                 <Text
//                   sx={{
//                     fontSize: 18,
//                     fontFamily: 'Poppins-Bold',
//                     color: '#001a33',
//                     textAlign: 'center',
//                     lineHeight: 20,
//                   }}
//                 >
//                   ←
//                 </Text>
//               </Pressable>
//             </View>
//           </MotiView>

//           <View sx={{ flex: 1, justifyContent: 'center' }}>
//             {/* Logo */}
//             <MotiView
//               from={{ opacity: 0, scale: 0.8 }}
//               animate={{ opacity: 1, scale: 1 }}
//               transition={{ type: 'timing', duration: 600, delay: 100 }}
//             >
//               <Image
//                 source={require('../../assets/jdklogo.png')}
//                 style={{
//                   width: 180,
//                   height: 180,
//                   alignSelf: 'center',
//                   marginBottom: -10,
//                 }}
//                 resizeMode="contain"
//               />
//             </MotiView>

//             {/* Login Title */}
//             <MotiView
//               from={{ opacity: 0, translateY: -20 }}
//               animate={{ opacity: 1, translateY: 0 }}
//               transition={{ type: 'timing', duration: 500, delay: 200 }}
//             >
//               <Text
//                 sx={{
//                   fontSize: 26,
//                   fontWeight: '400',
//                   fontFamily: 'Poppins-Bold',
//                   textAlign: 'left',
//                   mb: 'md',
//                 }}
//               >
//                 Login
//               </Text>
//             </MotiView>

//             {/* Email Input */}
//             <MotiView
//               from={{ opacity: 0, translateY: 20 }}
//               animate={{ opacity: 1, translateY: 0 }}
//               transition={{ type: 'timing', duration: 500, delay: 300 }}
//             >
//               <Text
//                 sx={{
//                   fontSize: 14,
//                   fontFamily: 'Poppins-Medium',
//                   color: '#001a33',
//                   mb: 'sm',
//                 }}
//               >
//                 Email
//               </Text>
//               <View
//                 sx={{
//                   flexDirection: 'row',
//                   alignItems: 'center',
//                   bg: '#f3f4f6',
//                   borderRadius: 8,
//                   px: 16,
//                   py: 12,
//                   mb: 'md',
//                 }}
//               >
//                 <TextInput
//                   placeholder="Email Address"
//                   value={email}
//                   onChangeText={setEmail}
//                   style={{
//                     flex: 1,
//                     fontSize: 16,
//                     fontFamily: 'Poppins-Regular',
//                   }}
//                   keyboardType="email-address"
//                   autoCapitalize="none"
//                 />
//               </View>
//             </MotiView>

//             {/* Password Input */}
//             <MotiView
//               from={{ opacity: 0, translateY: 20 }}
//               animate={{ opacity: 1, translateY: 0 }}
//               transition={{ type: 'timing', duration: 500, delay: 400 }}
//             >
//               <Text
//                 sx={{
//                   fontSize: 14,
//                   fontFamily: 'Poppins-Medium',
//                   color: '#001a33',
//                   mb: 'sm',
//                 }}
//               >
//                 Password
//               </Text>
//               <View
//                 sx={{
//                   flexDirection: 'row',
//                   alignItems: 'center',
//                   bg: '#f3f4f6',
//                   borderRadius: 8,
//                   px: 16,
//                   py: 12,
//                 }}
//               >
//                 <TextInput
//                   placeholder="Password"
//                   value={password}
//                   onChangeText={setPassword}
//                   secureTextEntry={!showPassword}
//                   style={{
//                     flex: 1,
//                     fontSize: 16,
//                     fontFamily: 'Poppins-Regular',
//                   }}
//                 />
//                 <Pressable onPress={() => setShowPassword(!showPassword)}>
//                   <Text
//                     sx={{
//                       fontSize: 14,
//                       fontFamily: 'Poppins-Regular',
//                       color: '#008CFC',
//                     }}
//                   >
//                     {showPassword ? 'Hide' : 'Show'}
//                   </Text>
//                 </Pressable>
//               </View>

//               {/* Forgot Password */}
//               <View sx={{ alignItems: 'flex-end', mt: 'md' }}>
//                 <Pressable onPress={() => console.log('Forgot password')}>
//                   <Text
//                     sx={{
//                       fontSize: 14,
//                       color: '#0685f4',
//                       fontFamily: 'Poppins-Medium',
//                     }}
//                   >
//                     Forgot password?
//                   </Text>
//                 </Pressable>
//               </View>
//             </MotiView>

//             {/* Login Button */}
//             <MotiView
//               from={{ opacity: 0, scale: 0.9 }}
//               animate={{ opacity: 1, scale: 1 }}
//               transition={{ type: 'timing', duration: 500, delay: 500 }}
//             >
//               <Pressable
//                 onPress={handleLogin}
//                 sx={{
//                   bg: '#008CFC',
//                   py: 10,
//                   borderRadius: 8,
//                   alignItems: 'center',
//                   mt: 'lg',
//                   mb: 4,
//                 }}
//               >
//                 <Text
//                   sx={{
//                     textAlign: 'center',
//                     color: 'background',
//                     fontWeight: 'bold',
//                     fontSize: 20,
//                     fontFamily: 'Poppins-ExtraBold',
//                   }}
//                 >
//                   {isLoading ? 'Logging in...' : 'Login'}
//                 </Text>
//               </Pressable>
//             </MotiView>

//             {/* Divider */}
//             <MotiView
//             from={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             transition={{ type: 'timing', duration: 400, delay: 600 }}
//             >
//             <Text
//                 sx={{
//                 fontSize: 20,
//                 fontWeight: 'extrabold',
//                 fontFamily: 'Poppins-Regular',
//                 color: 'black',
//                 textAlign: 'center',
//                 }}
//             >
//                 or
//             </Text>
//             </MotiView>

//             {/* Google Login */}
//             <MotiView
//             from={{ opacity: 0, translateY: 20 }}
//             animate={{ opacity: 1, translateY: 0 }}
//             transition={{ type: 'timing', duration: 500, delay: 700 }}
//             >
//             <Pressable onPress={() => router.push('/signup/clientsignup')}>
//                 {({ hovered }) => (
//                 <View
//                     sx={{
//                     flexDirection: 'row',
//                     justifyContent: 'center',
//                     alignItems: 'center',
//                     bg: hovered ? '#008CFC' : 'transparent',
//                     py: 10,
//                     borderRadius: 8,
//                     mb: 'md',
//                     borderWidth: 1,
//                     borderColor: '#008CFC',
//                     }}
//                 >
//                     <Image
//                     source={require('../../assets/google.png')}
//                     style={{
//                         width: 24,
//                         height: 24,
//                         marginRight: 8,
//                     }}
//                     resizeMode="contain"
//                     />
//                     <Text
//                     sx={{
//                         textAlign: 'center',
//                         color: hovered ? 'background' : '#008CFC',
//                         fontWeight: 'bold',
//                         fontSize: 20,
//                         fontFamily: 'Poppins-ExtraBold',
//                     }}
//                     >
//                     Continue with Google
//                     </Text>
//                 </View>
//                 )}
//             </Pressable>
//             </MotiView>

//             {/* Signup Prompt */}
//             <MotiView
//               from={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               transition={{ type: 'timing', duration: 500, delay: 600 }}
//             >
//               <View
//                 sx={{
//                   flexDirection: 'row',
//                   justifyContent: 'center',
//                   alignItems: 'center',
//                   mb: insets.bottom + 16,
//                   mt: 'md',
//                 }}
//               >
//                 <Text
//                   sx={{
//                     fontSize: 14,
//                     fontFamily: 'Poppins-Regular',
//                     color: '#001a33',
//                   }}
//                 >
//                   Don’t have an account?{' '}
//                 </Text>
//                 <Pressable onPress={() => router.push('/signup/roles')}>
//                   <Text
//                     sx={{
//                       fontSize: 14,
//                       fontFamily: 'Poppins-Regular',
//                       color: '#008CFC',
//                     }}
//                   >
//                     Sign Up
//                   </Text>
//                 </Pressable>
//               </View>
//             </MotiView>
//           </View>
//         </MotiView>
//       </SafeAreaView>
//     </ImageBackground>
//   )
// }
