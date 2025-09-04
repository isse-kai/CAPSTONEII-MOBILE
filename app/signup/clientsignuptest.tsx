// import { Image, Pressable, ScrollView, Text, TextInput, View } from 'dripsy'
// import { useFonts } from 'expo-font'
// import { useRouter } from 'expo-router'
// import { useEffect, useRef, useState } from 'react'
// import { Alert, Animated, KeyboardAvoidingView, Platform, SafeAreaView, StatusBar } from 'react-native'

// export default function ClientSignUp() {
//   const router = useRouter()
//   const [fullName, setFullName] = useState('')
//   const [email, setEmail] = useState('')
//   const [password, setPassword] = useState('')
//   const [confirmPassword, setConfirmPassword] = useState('')
//   const [isLoading, setIsLoading] = useState(false)

//   const fadeAnim = useRef(new Animated.Value(0)).current
//   const slideAnim = useRef(new Animated.Value(50)).current

//   const [fontsLoaded] = useFonts({
//     'Poppins-Regular': require('../../assets/fonts/Poppins/Poppins-Regular.ttf'),
//     'Poppins-Medium': require('../../assets/fonts/Poppins/Poppins-Medium.ttf'),
//     'Poppins-SemiBold': require('../../assets/fonts/Poppins/Poppins-SemiBold.ttf'),
//     'Poppins-Bold': require('../../assets/fonts/Poppins/Poppins-Bold.ttf'),
//     'Poppins-ExtraBold': require('../../assets/fonts/Poppins/Poppins-ExtraBold.ttf'),
//   })

//   useEffect(() => {
//     Animated.parallel([
//       Animated.timing(fadeAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
//       Animated.timing(slideAnim, { toValue: 0, duration: 800, useNativeDriver: true })
//     ]).start()
//   }, [fadeAnim, slideAnim])

//   const handleSignUp = async () => {
//     if (!fullName || !email || !password || !confirmPassword) {
//       Alert.alert('Error', 'Please fill in all fields')
//       return
//     }
//     if (password !== confirmPassword) {
//       Alert.alert('Error', 'Passwords do not match')
//       return
//     }
//     if (password.length < 6) {
//       Alert.alert('Error', 'Password must be at least 6 characters')
//       return
//     }
//     setIsLoading(true)
//     setTimeout(() => {
//       setIsLoading(false)
//       Alert.alert('Success', `Client account created for ${fullName}`)
//       router.push('/')
//     }, 2000)
//   }

//   const handleSignIn = () => router.push('/login/login')
//   if (!fontsLoaded) return null

//   const isFormValid = fullName && email && password && confirmPassword && password === confirmPassword

//   return (
//     <SafeAreaView style={{ flex: 1, backgroundColor: '#f8f9fa' }}>
//       <StatusBar barStyle="dark-content" backgroundColor="#f8f9fa" />
//       <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
//         <Animated.View style={{ flex: 1, opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
//           <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
//             <View sx={{ flex: 1, px: 'lg', mx: 'md', minHeight: '100%' }}>

//               {/* Header */}
//               <View sx={{ alignItems: 'center', pt: 'md', pb: 'sm', position: 'relative' }}>
//                 <View sx={{ position: 'absolute', left: 0, top: 18, zIndex: 1 }}>
//                   <Pressable
//                     onPress={() => router.back()}
//                     sx={{ width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center' }}
//                     style={({ pressed }) => [{ opacity: pressed ? 0.8 : 1 }]}
//                   >
//                     <Text sx={{ fontSize: 17, color: '#001a33' }}>←</Text>
//                   </Pressable>
//                 </View>
//                 <Image source={require('../../assets/jdklogo.png')} style={{ width: 75, height: 75, marginTop: 12 }} resizeMode="contain" />
//               </View>

//               {/* Title Section */}
//               <View sx={{ alignItems: 'center', mb: 'lg' }}>
//                 <View sx={{ width: 45, height: 45, borderRadius: 22, backgroundColor: '#0685f4', alignItems: 'center', justifyContent: 'center', mb: 'sm' }}>
//                   <Text sx={{ fontSize: 22, color: '#ffffff' }}>🏠</Text>
//                 </View>
//                 <Text sx={{ fontSize: 22, fontFamily: 'Poppins-ExtraBold', color: '#001a33', mb: 'xs', textAlign: 'center' }}>Join as Client</Text>
//                 <Text sx={{ fontSize: 14, fontFamily: 'Poppins-Regular', color: '#4e6075', textAlign: 'center', lineHeight: 20 }}>
//                   Create your account and start booking home services
//                 </Text>
//               </View>

//               {/* Form Card */}
//               <View sx={{ borderRadius: 14, p: 'lg', mb: 'lg' }}>
//                 {['Full Name', 'Email Address', 'Password', 'Confirm Password'].map((label, i) => {
//                   let value, setter, placeholder, secure = false, keyboardType = 'default', autoComplete = 'off'
//                   switch(label) {
//                     case 'Full Name': value=fullName; setter=setFullName; placeholder='Enter your full name'; autoComplete='name'; break;
//                     case 'Email Address': value=email; setter=setEmail; placeholder='your@email.com'; keyboardType='email-address'; autoComplete='email'; break;
//                     case 'Password': value=password; setter=setPassword; placeholder='Create a password'; secure=true; autoComplete='password-new'; break;
//                     case 'Confirm Password': value=confirmPassword; setter=setConfirmPassword; placeholder='Confirm your password'; secure=true; autoComplete='password-new'; break;
//                   }
//                   return (
//                     <View key={i} sx={{ mb: i === 3 ? 'md' : 'md' }}>
//                       <Text sx={{ fontSize: 13, fontFamily: 'Poppins-SemiBold', color: '#001a33', mb: 'xs' }}>{label}</Text>
//                       <TextInput
//                         placeholder={placeholder}
//                         value={value}
//                         onChangeText={setter}
//                         secureTextEntry={secure}
//                         style={{
//                           height: 46,
//                           paddingHorizontal: 15,
//                           borderRadius: 12,
//                           backgroundColor: 'transparent',
//                           fontSize: 14,
//                           borderWidth: 2,
//                           borderColor: i === 3
//                             ? confirmPassword && password === confirmPassword ? '#28a745'
//                               : confirmPassword && password !== confirmPassword ? '#dc3545'
//                               : '#e4e7ec'
//                             : value ? '#0685f4' : '#e4e7ec',
//                           color: '#001a33',
//                           fontFamily: 'Poppins-Regular'
//                         }}
//                         placeholderTextColor="#9aa4b2"
//                       />
//                       {i === 3 && confirmPassword && (
//                         <Text sx={{ fontSize: 12, fontFamily: 'Poppins-Regular', color: password === confirmPassword ? '#28a745' : '#dc3545', mt: 'xs' }}>
//                           {password === confirmPassword ? '✓ Passwords match' : '✗ Passwords do not match'}
//                         </Text>
//                       )}
//                     </View>
//                   )
//                 })}

//                 {/* Sign Up Button */}
//                 <Pressable
//                   onPress={handleSignUp}
//                   disabled={!isFormValid || isLoading}
//                   sx={{ height: 54, backgroundColor: !isFormValid ? '#e4e7ec' : (isLoading ? '#9aa4b2' : '#0685f4'), borderRadius: 12, alignItems: 'center', justifyContent: 'center', mb: 'md' }}
//                   style={({ pressed }) => [{ opacity: pressed && isFormValid && !isLoading ? 0.9 : 1, transform: [{ scale: pressed && isFormValid && !isLoading ? 0.98 : 1 }] }]}
//                 >
//                   <Text sx={{ fontSize: 15, fontFamily: 'Poppins-SemiBold', color: !isFormValid ? '#9aa4b2' : '#ffffff' }}>
//                     {isLoading ? 'Creating Account...' : 'Create Client Account'}
//                   </Text>
//                 </Pressable>

//                 {/* Sign In Link */}
//                 <View sx={{ alignItems: 'center' }}>
//                   <Text sx={{ fontSize: 13, color: '#4e6075', fontFamily: 'Poppins-Regular', mb: 'xs' }}>Already have an account?</Text>
//                   <Pressable onPress={handleSignIn} style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}>
//                     <Text sx={{ fontSize: 15, color: '#0685f4', fontFamily: 'Poppins-SemiBold' }}>Sign In</Text>
//                   </Pressable>
//                 </View>
//               </View>

//               {/* Footer */}
//               <View sx={{ pb: 'lg', alignItems: 'center' }}>
//                 <Text sx={{ fontSize: 12, color: '#9aa4b2', textAlign: 'center', lineHeight: 18, fontFamily: 'Poppins-Regular' }}>
//                   By creating an account, you agree to our{'\n'}
//                   <Text sx={{ color: '#0685f4' }}>Terms of Service</Text> and <Text sx={{ color: '#0685f4' }}>Privacy Policy</Text>
//                 </Text>
//               </View>
//             </View>
//           </ScrollView>
//         </Animated.View>
//       </KeyboardAvoidingView>
//     </SafeAreaView>
//   )
// }