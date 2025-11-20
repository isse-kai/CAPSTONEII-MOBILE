import { Text as DripsyText } from 'dripsy'
import { MotiView } from 'moti'
import React from 'react'
import { Modal, Pressable, TextInput, View } from 'react-native'

type Props = {
  showLoading: boolean
  showOtpModal: boolean
  otpCode: string
  setOtpCode: (code: string) => void
  serverOtp: string
  otpInfo?: string
  otpError?: string
  canResend?: boolean
  canResendAt?: number
  onVerified: () => void
  onResend?: () => void
}

export default function VerificationModal({
  showLoading,
  showOtpModal,
  otpCode,
  setOtpCode,
  serverOtp,
  otpInfo,
  otpError,
  canResend,
  canResendAt,
  onVerified,
  onResend,
}: Props) {
  if (!showLoading && !showOtpModal) return null

  return (
    <Modal visible={showLoading || showOtpModal} transparent animationType="fade">
      <View
        style={{
          flex: 1,
          backgroundColor: 'rgba(0,0,0,0.6)',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <MotiView
          from={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'timing', duration: 250 }}
          style={{
            backgroundColor: '#fff',
            padding: 24,
            borderRadius: 16,
            width: '85%',
            alignItems: 'center',
            shadowColor: '#000',
            shadowOpacity: 0.15,
            shadowRadius: 8,
            elevation: 6,
          }}
        >
          {/* Title */}
          <DripsyText sx={{ fontSize: 18, fontFamily: 'Poppins-Bold', mb: 12 }}>
            Enter 6-digit verification code
          </DripsyText>

          {/* Info / Error */}
          {otpInfo && (
            <DripsyText
              sx={{ fontSize: 14, fontFamily: 'Poppins-Regular', color: '#4b5563', mb: 8, textAlign: 'center' }}
            >
              {otpInfo}
            </DripsyText>
          )}
          {otpError && (
            <DripsyText
              sx={{ fontSize: 14, fontFamily: 'Poppins-Regular', color: '#ef4444', mb: 8, textAlign: 'center' }}
            >
              {otpError}
            </DripsyText>
          )}
          {canResend === false && canResendAt && (
            <DripsyText
              sx={{ fontSize: 12, fontFamily: 'Poppins-Regular', color: '#9ca3af', mb: 8, textAlign: 'center' }}
            >
              You can resend code in {Math.ceil((canResendAt - Date.now()) / 1000)}s
            </DripsyText>
          )}

          {/* OTP Input */}
          <TextInput
            value={otpCode}
            onChangeText={text => {
              setOtpCode(text)
              if (text.length === 6 && text === serverOtp) {
                onVerified()
              }
            }}
            keyboardType="number-pad"
            maxLength={6}
            style={{
              backgroundColor: '#f3f4f6',
              borderRadius: 10,
              paddingHorizontal: 16,
              paddingVertical: 14,
              fontSize: 20,
              letterSpacing: 8,
              textAlign: 'center',
              width: '100%',
              marginBottom: 16,
            }}
          />

          {/* Actions */}
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%' }}>
            {canResend && onResend && (
              <Pressable
                onPress={onResend}
                style={{
                  flex: 1,
                  marginRight: 8,
                  backgroundColor: '#f3f4f6',
                  borderRadius: 10,
                  paddingVertical: 12,
                  alignItems: 'center',
                }}
              >
                <DripsyText sx={{ color: '#333', fontFamily: 'Poppins-Bold' }}>Resend</DripsyText>
              </Pressable>
            )}

            <Pressable
              onPress={onVerified}
              disabled={showLoading}
              style={{
                flex: 1,
                marginLeft: 8,
                backgroundColor: '#008CFC',
                borderRadius: 10,
                paddingVertical: 12,
                alignItems: 'center',
              }}
            >
              <DripsyText sx={{ color: '#fff', fontFamily: 'Poppins-Bold' }}>
                {showLoading ? 'Verifying…' : 'Verify'}
              </DripsyText>
            </Pressable>
          </View>
        </MotiView>
      </View>
    </Modal>
  )
}
