import { Text, View } from 'dripsy'

export default function HomeScreen() {
  return (
    <View sx={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text sx={{ fontSize: 22, fontFamily: 'Poppins-Bold' }}>🏠 Home Screen</Text>
    </View>
  )
}