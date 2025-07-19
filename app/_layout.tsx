import { DripsyProvider } from 'dripsy'
import { Slot } from 'expo-router'
import { theme } from '../theme'

export default function Layout() {
  return (
    <DripsyProvider theme={theme}>
      <Slot />
    </DripsyProvider>
  )
}
