import type { TouchableOpacityProps } from 'react-native'
import { type ButtonIconTypeStyleProps, Container, Icon } from './styles'
import type { MaterialIcons } from '@expo/vector-icons'

type Props = TouchableOpacityProps & {
  icon: keyof typeof MaterialIcons.glyphMap
  type?: ButtonIconTypeStyleProps
}

export function IconButton({ icon, type = 'PLUS', ...rest }: Props) {
  return (
    <Container {...rest}>
      <Icon name={icon} type={type} />
    </Container>
  )
}
