import { Container, Content, Icon } from './styles'

import { Header } from '@components/Header'
import { Highlight } from '@components/Highlight'
import { Button } from '@components/Button'
import { Input } from '@components/Input'

import { useState } from 'react'
import { Alert } from 'react-native'

import { useNavigation } from '@react-navigation/native'

import { groupCreate } from '@storage/group/groupCreate'

import { AppError } from '@utils/AppError'

export function NewGroup() {
  const [group, setGroup] = useState('')

  const navigate = useNavigation()

  async function handleNewGroup() {
    if (group.trim().length === 0) {
      return Alert.alert('Novo grupo', 'Informe o nome do grupo')
    }

    try {
      await groupCreate(group)
      navigate.navigate('players', { group })
    } catch (error) {
      if (error instanceof AppError) {
        Alert.alert('Novo grupo', error.message)
      } else {
        Alert.alert('Novo grupo', 'Não foi possivel criar um novo grupo.')
        console.log(error)
      }
    }
  }

  return (
    <Container>
      <Header showBackButton />
      <Content>
        <Icon />
        <Highlight
          title="Novo grupo"
          subtitle="crie um grupo para adicionar pessoas"
        />
        <Input placeholder="Nome do grupo" onChangeText={setGroup} />
        <Button
          onPress={handleNewGroup}
          style={{ marginTop: 20 }}
          title="Criar"
        />
      </Content>
    </Container>
  )
}
