import { Text } from 'dripsy'
import React from 'react'
import { Modal, Pressable, ScrollView, View } from 'react-native'

interface NDAModalProps {
  visible: boolean
  onCancel: () => void
  onAgree: () => void
}

export default function NDAModal({ visible, onCancel, onAgree }: NDAModalProps) {
  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View style={{ flex: 1, backgroundColor: '#000000aa', justifyContent: 'center', alignItems: 'center' }}>
        <View style={{ backgroundColor: '#fff', borderRadius: 12, padding: 20, width: '90%', maxHeight: '80%' }}>
          <Text sx={{ fontSize: 16, fontFamily: 'Poppins-Bold', mb: 12 }}>Non‑Disclosure Agreement</Text>
          
          {/* Scrollable NDA content */}
          <ScrollView style={{ marginBottom: 16 }}>
            <Text sx={{ fontSize: 14, color: '#000' }}>
              Please read the agreement below. Click “I Agree” to enable and check the checkbox.
              {"\n\n"}
              JDK HOMECARE Non‑Disclosure Agreement (NDA){"\n\n"}
              This NDA explains how confidential information shared between clients and workers is protected.
              {"\n\n"}1. Definition of Confidential Information{"\n"}
              • Any personal, service, or business information shared during use of the platform.{"\n"}
              • Documents, communications, or data exchanged between parties.{"\n"}
              • Information marked as confidential or reasonably understood to be confidential.
              {"\n\n"}2. Obligations of Parties{"\n"}
              • Do not disclose confidential information to unauthorized persons.{"\n"}
              • Use confidential information only for the purpose of fulfilling service requests.{"\n"}
              • Protect information with reasonable safeguards.
              {"\n\n"}3. Exclusions{"\n"}
              • Information already public or independently developed without access to confidential data.{"\n"}
              • Information disclosed with written consent.
              {"\n\n"}4. Term{"\n"}
              Obligations remain in effect during and after use of the platform, unless otherwise released in writing.
              {"\n\n"}5. Breach{"\n"}
              Unauthorized disclosure may result in account termination and legal action.
              {"\n\n"}6. Updates{"\n"}
              JDK HOMECARE may update this NDA. Continued use of the platform means you accept the updated terms.
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
