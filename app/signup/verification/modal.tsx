import { Text as DripsyText } from 'dripsy'
import React from 'react'
import { TextInput, View } from 'react-native'

type Props = {
  showLoading: boolean
  showOtpModal: boolean
  otpCode: string
  setOtpCode: (code: string) => void
  serverOtp: string
  onVerified: () => void
}

export default function VerificationModal({
  showLoading,
  showOtpModal,
  otpCode,
  setOtpCode,
  serverOtp,
  onVerified,
}: Props) {
  if (!showLoading && !showOtpModal) return null

  return (
    <>
      {/* Loading Modal */}
      {showLoading && (
        <View
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: '#00000055',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 998,
          }}
        >
          <DripsyText sx={{ fontSize: 18, fontFamily: 'Poppins-Bold', color: '#fff' }}>
            Sending verification code…
          </DripsyText>
        </View>
      )}

      {/* OTP Modal */}
      {showOtpModal && (
        <View
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: '#000000aa',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 999,
          }}
        >
          <View
            style={{
              backgroundColor: '#fff',
              padding: 24,
              borderRadius: 12,
              width: '80%',
              alignItems: 'center',
            }}
          >
            <DripsyText sx={{ fontSize: 18, fontFamily: 'Poppins-Bold', mb: 12 }}>
              Enter 6-digit verification code
            </DripsyText>

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
              }}
            />
          </View>
        </View>
      )}
    </>
  )
}
