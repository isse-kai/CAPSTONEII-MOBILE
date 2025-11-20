import * as Linking from 'expo-linking'
import { useRouter } from 'expo-router'
import { useEffect } from 'react'
import { supabase } from '../../supabase/db'

export default function AuthCallback() {
  const router = useRouter()

  useEffect(() => {
    const handleUrl = async (event: { url: string }) => {
      // Parse the deep link
      const parsed = Linking.parse(event.url)
      const queryParams = (parsed.queryParams ?? {}) as Record<
        string,
        string | string[] | undefined
      >

      const getString = (v: string | string[] | undefined) =>
        Array.isArray(v) ? v[0] : v

      // Supabase magic link flow: tokens are passed
      const access_token = getString(queryParams['access_token'])
      const refresh_token = getString(queryParams['refresh_token'])

      if (access_token && refresh_token) {
        // Set Supabase session
        const { error } = await supabase.auth.setSession({
          access_token,
          refresh_token,
        })
        if (!error) {
          router.replace('./clientpage/home')
        }
      }

      // OTP flow: code is passed
      const otpCode = getString(queryParams['code'])
      const email = getString(queryParams['email'])
      if (otpCode && email) {
        try {
          await supabase.auth.verifyOtp({
            email,
            token: otpCode,
            type: 'email',
          })
          router.replace('./clientpage/home')
        } catch (err) {
          console.error('OTP verification failed', err)
        }
      }
    }

    const subscription = Linking.addEventListener('url', handleUrl)
    return () => {
      // remove subscription listener
      subscription.remove()
    }
  }, [router])

  return null
}
