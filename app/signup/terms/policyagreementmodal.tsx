import { Text } from 'dripsy'
import React from 'react'
import { Modal, Pressable, ScrollView, View } from 'react-native'

interface PolicyAgreementModalProps {
  visible: boolean
  onCancel: () => void
  onAgree: () => void
}

export default function PolicyAgreementModal({ visible, onCancel, onAgree }: PolicyAgreementModalProps) {
  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View style={{ flex: 1, backgroundColor: '#000000aa', justifyContent: 'center', alignItems: 'center' }}>
        <View style={{ backgroundColor: '#fff', borderRadius: 12, padding: 20, width: '90%', maxHeight: '80%' }}>
          <Text sx={{ fontSize: 16, fontFamily: 'Poppins-Bold', mb: 12 }}>Policy Agreement</Text>
          
          {/* Scrollable Policy Agreement content */}
          <ScrollView style={{ marginBottom: 16 }}>
            <Text sx={{ fontSize: 14, color: '#000' }}>
              Please read the agreement below. Click “I Agree” to enable and check the checkbox.
              {"\n\n"}
              JDK HOMECARE Policy Agreement{"\n\n"}
              This Policy Agreement outlines the responsibilities and expectations for clients and workers using the platform.
              {"\n\n"}1. Service Use{"\n"}
              • Clients agree to provide accurate information when requesting services.{"\n"}
              • Workers agree to fulfill service requests professionally and responsibly.{"\n"}
              • Both parties agree to respect each other’s rights and obligations.
              {"\n\n"}2. Compliance{"\n"}
              • All users must comply with applicable laws and regulations.{"\n"}
              • Misuse of the platform may result in suspension or termination of accounts.
              {"\n\n"}3. Communication{"\n"}
              • Users agree to communicate respectfully and clearly.{"\n"}
              • JDK HOMECARE may send notifications and updates related to services and accounts.
              {"\n\n"}4. Termination{"\n"}
              • JDK HOMECARE reserves the right to terminate accounts for violations of this agreement.{"\n"}
              • Users may terminate their account at any time by contacting support.
              {"\n\n"}5. Updates{"\n"}
              This agreement may be updated periodically. Continued use of the platform means you accept the updated terms.
            </Text>
          </ScrollView>

          {/* Action buttons */}
          <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
            <Pressable
              onPress={onCancel}
              style={{
                paddingHorizontal: 16,
                paddingVertical: 10,
                borderRadius: 8,
                backgroundColor: '#e5e7eb',
                marginRight: 12,
              }}
            >
              <Text sx={{ color: '#000', fontFamily: 'Poppins-Bold' }}>Cancel</Text>
            </Pressable>
            <Pressable
              onPress={onAgree}
              style={{
                paddingHorizontal: 16,
                paddingVertical: 10,
                borderRadius: 8,
                backgroundColor: '#008CFC',
              }}
            >
              <Text sx={{ color: '#fff', fontFamily: 'Poppins-Bold' }}>I Agree</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  )
}
