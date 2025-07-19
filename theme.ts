import { makeTheme } from 'dripsy'

export const theme = makeTheme({
  colors: {
    background: '#ffffff',
    text: '#1f2937',
    blue: '#3b82f6',
  },
  space: {
    sm: 8,
    md: 16,
    lg: 24,
  },
  text: {
    body: { fontSize: 16 },
    heading: { fontSize: 24, fontWeight: 'bold' },
  },
})
