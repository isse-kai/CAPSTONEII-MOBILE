import { Text as DripsyText } from 'dripsy'
import React from 'react'
import { TextInput, View } from 'react-native'

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
          <DripsyText sx={{ fontSize: 18, fontFamily: 'Poppins-Bold', mb: 12 }}>
            Enter 6-digit verification code
          </DripsyText>

          {/* Dynamic messages */}
          {otpInfo && (
            <DripsyText sx={{ fontSize: 14, fontFamily: 'Poppins-Regular', color: '#4b5563', mb: 8 }}>
              {otpInfo}
            </DripsyText>
          )}

          {otpError && (
            <DripsyText sx={{ fontSize: 14, fontFamily: 'Poppins-Regular', color: '#ef4444', mb: 8 }}>
              {otpError}
            </DripsyText>
          )}

          {canResend === false && canResendAt ? (
            <DripsyText sx={{ fontSize: 12, fontFamily: 'Poppins-Regular', color: '#9ca3af', mb: 8 }}>
              You can resend code in {Math.ceil((canResendAt - Date.now()) / 1000)}s
            </DripsyText>
          ) : null}

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
