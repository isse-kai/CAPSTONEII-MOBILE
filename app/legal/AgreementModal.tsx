import React from 'react';
import {
    Modal,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { LEGAL_CONTENT, LegalKey } from './legalContent';

const BLUE = '#1E88E5';

export default function AgreementModal({
  visible,
  docKey,
  onClose,
  onAgree,
}: {
  visible: boolean;
  docKey: LegalKey;
  onClose: () => void;
  onAgree: () => void;
}) {
  const content = LEGAL_CONTENT[docKey];

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.backdrop}>
        <SafeAreaView style={styles.sheet}>
          <View style={styles.header}>
            <Text style={styles.title}>{content.title}</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn} activeOpacity={0.85}>
              <Text style={styles.closeText}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.body} contentContainerStyle={{ paddingBottom: 18 }}>
            <Text style={styles.content}>{content.body}</Text>
          </ScrollView>

          <View style={styles.footer}>
            <TouchableOpacity onPress={onClose} style={styles.secondaryBtn} activeOpacity={0.9}>
              <Text style={styles.secondaryText}>Close</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={onAgree} style={styles.primaryBtn} activeOpacity={0.9}>
              <Text style={styles.primaryText}>I Agree</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    maxHeight: '86%',
    overflow: 'hidden',
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eef2f7',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  title: {
    flex: 1,
    fontSize: 16,
    fontWeight: '900',
    color: '#0f172a',
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#e6eaf2',
    backgroundColor: '#fbfcfe',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeText: { fontSize: 16, fontWeight: '900', color: '#334155' },

  body: { paddingHorizontal: 16, paddingTop: 12 },
  content: { fontSize: 13, lineHeight: 20, color: '#334155' },

  footer: {
    padding: 14,
    borderTopWidth: 1,
    borderTopColor: '#eef2f7',
    flexDirection: 'row',
    gap: 12,
  },
  secondaryBtn: {
    flex: 1,
    height: 46,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#d7dee9',
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryText: { fontSize: 14, fontWeight: '900', color: '#334155' },

  primaryBtn: {
    flex: 1,
    height: 46,
    borderRadius: 10,
    backgroundColor: BLUE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryText: { fontSize: 14, fontWeight: '900', color: '#fff' },
});
