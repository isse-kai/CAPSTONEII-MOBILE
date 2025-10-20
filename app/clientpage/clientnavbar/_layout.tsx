import { View } from 'dripsy';
import { Slot } from 'expo-router';
import ClientNavbar from './navbar';

export default function ClientNavbarLayout() {
  return (
    <View sx={{ flex: 1 }}>
      <Slot />
      <ClientNavbar />
    </View>
  )
}
