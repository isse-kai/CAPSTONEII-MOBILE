import { Text } from 'dripsy'
import React from 'react'
import { Modal, Pressable, ScrollView, View } from 'react-native'

interface AgreementsModalProps {
  visible: boolean
  onCancel: () => void
  onAgree: () => void
}

export default function AgreementsModal({ visible, onCancel, onAgree }: AgreementsModalProps) {
  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View style={{ flex: 1, backgroundColor: '#000000aa', justifyContent: 'center', alignItems: 'center' }}>
        <View style={{ backgroundColor: '#fff', borderRadius: 12, padding: 20, width: '90%' }}>
          <Text sx={{ fontSize: 16, fontFamily: 'Poppins-Bold', mb: 12 }}>Policy Agreement & NDA</Text>
          <ScrollView style={{ maxHeight: 300 }}>
            <Text sx={{ fontSize: 14, color: '#000' }}>
              {/* Insert your Policy Agreement and NDA text here */}
              This is where the Policy Agreement and NDA content goes...
            </Text>
          </ScrollView>
          <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginTop: 16 }}>
            <Pressable onPress={onCancel} style={{ marginRight: 12 }}>
              <Text sx={{ color: '#ef4444', fontFamily: 'Poppins-Bold' }}>Cancel</Text>
            </Pressable>
            <Pressable onPress={onAgree}>
              <Text sx={{ color: '#16a34a', fontFamily: 'Poppins-Bold' }}>I Agree</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  )
}
