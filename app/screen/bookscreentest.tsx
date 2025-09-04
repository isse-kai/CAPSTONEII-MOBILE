import { useRouter } from 'expo-router'
import { Pressable, Text, View } from 'react-native'

export default function BookScreen() {
  const router = useRouter()

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
      {/* Back Button (top-left) */}
      <Pressable
        onPress={() => router.push('/home/hometest')}
        style={{
          position: 'absolute',
          top: 50,
          left: 20,
          backgroundColor: '#0685f4',
          paddingHorizontal: 12,
          paddingVertical: 8,
          borderRadius: 8,
        }}
      >
        <Text style={{ color: '#fff', fontWeight: 'bold' }}>⬅ Back</Text>
      </Pressable>

      {/* Screen Content */}
      <Text style={{ fontSize: 22, fontWeight: 'bold' }}>📚 Book Screen</Text>
    </View>
  )
}