import { Pressable, Text, View } from 'dripsy'
import { useEffect, useState } from 'react'
import { supabase } from '../supabase/auth'

export default function Sidebar({ onClose }: { onClose: () => void }) {
  const [profile, setProfile] = useState<{
    first_name: string
    last_name: string
    email: string
  } | null>(null)

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: { user }, error: userError } = await supabase.auth.getUser()
      if (userError || !user) return

      const { data, error } = await supabase
        .from('profiles')
        .select('first_name, last_name, email')
        .eq('id', user.id)
        .single()

      if (!error && data) setProfile(data)
    }

    fetchProfile()
  }, [])

  return (
    <View sx={{ flex: 1, bg: '#fff', px: 20, py: 24 }}>
      <Text sx={{ fontSize: 24, fontFamily: 'Poppins-Bold', mb: 24 }}>Profile</Text>

      <Text sx={{ fontSize: 16, fontFamily: 'Poppins-Regular', mb: 8 }}>
        👤 {profile?.first_name} {profile?.last_name}
      </Text>
      <Text sx={{ fontSize: 16, fontFamily: 'Poppins-Regular', mb: 8 }}>
        📧 {profile?.email}
      </Text>

      <Pressable
        onPress={() => supabase.auth.signOut()}
        sx={{
          bg: '#ef4444',
          px: 16,
          py: 12,
          borderRadius: 8,
          mt: 32,
          alignItems: 'center',
        }}
      >
        <Text sx={{ color: 'white', fontFamily: 'Poppins-Bold', fontSize: 16 }}>
          Logout
        </Text>
      </Pressable>

      <Pressable
        onPress={onClose}
        sx={{ mt: 24, alignItems: 'center' }}
      >
        <Text sx={{ fontSize: 14, color: '#008CFC', fontFamily: 'Poppins-Regular' }}>
          Close Sidebar
        </Text>
      </Pressable>
    </View>
  )
}
