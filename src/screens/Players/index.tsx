import { Header } from '@components/Header'
import { Container, Form } from './styles'
import { Highlight } from '@components/Highlight'
import { IconButton } from '@components/IconButton'
import { Input } from '@components/Input'

export function Players() {
  return (
    <Container>
      <Header showBackButton />
      <Highlight
        title="Nome da turma"
        subtitle="adicione a galera e separe os times"
      />
      <Form>
        <Input placeholder="Adicione a pessoa" autoCorrect={false} />
        <IconButton icon="add" />
      </Form>
    </Container>
  )
}
