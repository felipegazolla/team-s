import { Header } from '@components/Header'
import { Container, Content, Icon } from './styles'
import { Highlight } from '@components/Highlight'
import { Button } from '@components/Button'
import { Input } from '@components/Input'
import { useNavigation } from '@react-navigation/native'
import { useState } from 'react'

export function NewGroup() {
  const [group, setGroup] = useState('')

  const navigate = useNavigation()

  function handleNewGroup() {
    navigate.navigate('players', { group: group })
  }

  return (
    <Container>
      <Header showBackButton />
      <Content>
        <Icon />
        <Highlight
          title="Nova turma"
          subtitle="crie uma turma para adicionar pessoas"
        />
        <Input placeholder="Nome da turma" onChangeText={setGroup} />
        <Button
          onPress={handleNewGroup}
          style={{ marginTop: 20 }}
          title="Criar"
        />
      </Content>
    </Container>
  )
}
