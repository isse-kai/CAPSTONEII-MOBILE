// import { Text } from 'dripsy'
// import React from 'react'
// import { Modal, Pressable, ScrollView, View } from 'react-native'

// interface PrivacyPolicyModalProps {
//   visible: boolean
//   onCancel: () => void
//   onAgree: () => void
// }

// export default function PrivacyPolicyModal({ visible, onCancel, onAgree }: PrivacyPolicyModalProps) {
//   return (
//     <Modal visible={visible} animationType="slide" transparent={true}>
//       <View style={{ flex: 1, backgroundColor: '#000000aa', justifyContent: 'center', alignItems: 'center' }}>
//         <View style={{ backgroundColor: '#fff', borderRadius: 12, padding: 20, width: '90%', maxHeight: '80%' }}>
//           <Text sx={{ fontSize: 16, fontFamily: 'Poppins-Bold', mb: 12 }}>Privacy Policy</Text>

//           {/* Scrollable content area */}
//           <ScrollView style={{ marginBottom: 16 }}>
//             <Text sx={{ fontSize: 14, color: '#000' }}>
//               Please read the policy below. Click “I Agree” to enable and check the checkbox.
//               {"\n\n"}
//               JDK HOMECARE Privacy Policy{"\n\n"}
//               This Privacy Policy explains how JDK HOMECARE collects, uses, stores, and protects your information when you use our platform.
//               {"\n\n"}1. Information We Collect{"\n"}
//               • Account information (name, email, sex) you provide during registration.{"\n"}
//               • Service-related information you submit when requesting or providing services.{"\n"}
//               • Device and usage data (basic logs, timestamps) to help secure and improve the platform.
//               {"\n\n"}2. How We Use Your Information{"\n"}
//               • To create and manage your account.{"\n"}
//               • To provide core features (service requests, matching, notifications).{"\n"}
//               • To improve security, prevent fraud, and comply with legal obligations.{"\n"}
//               • To communicate important updates related to your account and transactions.
//               {"\n\n"}3. Data Sharing{"\n"}
//               • We may share limited information with workers/clients only as necessary to fulfill a service request (e.g., name and request details).{"\n"}
//               • We do not sell your personal information. We may share information when required by law or to protect our users and platform.
//               {"\n\n"}4. Data Retention{"\n"}
//               We keep information only as long as needed to operate the service and meet legal and security requirements.
//               {"\n\n"}5. Security{"\n"}
//               We use reasonable safeguards to protect your information. No method of transmission or storage is 100% secure, but we work to protect your data.
//               {"\n\n"}6. Updates to this Policy{"\n"}
//               We may update this policy from time to time. Continued use of the platform means you accept the updated policy.
//             </Text>
//           </ScrollView>

//           {/* Action buttons */}
//           <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginTop: 16 }}>
//           <Pressable
//               onPress={onCancel}
//               style={{
//               paddingHorizontal: 16,
//               paddingVertical: 10,
//               borderRadius: 8,
//               backgroundColor: '#e5e7eb', // light neutral gray
//               marginRight: 12,
//               }}
//           >
//               <Text sx={{ color: '#000', fontFamily: 'Poppins-Bold' }}>Cancel</Text>
//           </Pressable>
//           <Pressable
//               onPress={onAgree}
//               style={{
//               paddingHorizontal: 16,
//               paddingVertical: 10,
//               borderRadius: 8,
//               backgroundColor: '#008CFC', // your app’s primary blue
//               }}
//           >
//             <Text sx={{ color: '#fff', fontFamily: 'Poppins-Bold' }}>I Agree</Text>
//           </Pressable>
//         </View>
//         </View>
//       </View>
//     </Modal>
//   )
// }
