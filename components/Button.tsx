import { theme } from '@/theme'
import { Pressable, Text } from 'dripsy'
import { PressableProps } from 'react-native'

type ButtonProps = {
  label: string
  onPress: () => void
  color?: keyof typeof theme.colors
  size?: 'sm' | 'md' | 'lg'
} & PressableProps

export const Button = ({ label, onPress, color = 'blue', size = 'md', ...props }: ButtonProps) => {
  const paddingMap = { sm: 'sm', md: 'md', lg: 'lg' }

  return (
    <Pressable
      onPress={onPress}
      sx={{
        bg: color,
        px: paddingMap[size],
        py: 'sm',
        borderRadius: 'md',
        alignItems: 'center',
        justifyContent: 'center',
      }}
      {...props}
    >
      <Text
        sx={{
          color: 'background',
          fontSize: 16,
          fontWeight: 'bold',
        }}
      >
        {label}
      </Text>
    </Pressable>
  )
}
