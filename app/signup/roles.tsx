import { Pressable, Text, View } from 'dripsy'
import { useRouter } from 'expo-router'

export default function Roles() {
  const router = useRouter()

  return (
    <View sx={{ flex: 1, justifyContent: 'center', alignItems: 'center', px: 'lg', bg: 'background' }}>
      <Text sx={{ fontSize: 24, fontWeight: 'bold', mb: 'xl', textAlign: 'center' }}>
        Are you a Client or a Worker?
      </Text>

      <Pressable
        onPress={() => router.push('./client')}
        sx={{
          bg: 'primary',
          py: 'md',
          px: 'lg',
          borderRadius: 'md',
          mb: 'md',
          width: '100%',
          alignItems: 'center',
        }}
      >
        <Text sx={{ textAlign: 'center', color: 'background', fontWeight: 'bold', fontSize: 18 }}>
          Im a client, hiring for a service
        </Text>
      </Pressable>

      <Pressable
        onPress={() => router.push('./worker')}
        sx={{
          bg: 'secondary',
          py: 'md',
          px: 'lg',
          borderRadius: 'md',
          width: '100%',
          alignItems: 'center',
        }}
      >
        <Text sx={{ textAlign: 'center', color: 'background', fontWeight: 'bold', fontSize: 18 }}>
          Im a worker, looking for a service job
        </Text>
      </Pressable>
    </View>
  )
}
