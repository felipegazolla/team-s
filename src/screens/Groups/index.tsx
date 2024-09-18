import { Container } from './styles'

import { useCallback, useState } from 'react'
import { Alert, FlatList } from 'react-native'

import { Header } from '@components/Header'
import { Highlight } from '@components/Highlight'
import { GroupCard } from '@components/GroupCard'
import { EmptyList } from '@components/EmptyList'
import { Button } from '@components/Button'

import { useFocusEffect, useNavigation } from '@react-navigation/native'

import { groupGetAll } from '@storage/group/groupGetAll'
import { Loading } from '@components/Loading'

export function Groups() {
  const [isLoading, setIsLoading] = useState(true)
  const [groups, setGroups] = useState<string[]>([])

  const navigation = useNavigation()

  function handleNewGroup() {
    navigation.navigate('new')
  }

  async function fetchGroups() {
    try {
      setIsLoading(true)
      const data = await groupGetAll()
      setGroups(data)

    } catch (error) {
      console.log(error)
      Alert.alert('Grupos', 'Não foi possivel carregar os grupos')
    } finally {
      setIsLoading(false)
    }
  }

  function handleOpenGroup(group: string) {
    navigation.navigate('players', { group })
  }

  useFocusEffect(
    // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
    useCallback(() => {
      fetchGroups()
    }, [])
  )

  return (
    <Container>
      <Header />

      <Highlight title="Grupos" subtitle="jogue com a seu grupo" />

      {isLoading ? (
        <Loading />
      ) : (
        <FlatList
          data={groups}
          keyExtractor={item => item}
          renderItem={({ item }) => (
            <GroupCard onPress={() => handleOpenGroup(item)} title={item} />
          )}
          contentContainerStyle={groups.length === 0 && { flex: 1 }}
          ListEmptyComponent={() => (
            <EmptyList message="Cadastre o primeiro grupo!" />
          )}
          showsVerticalScrollIndicator={false}
        />
      )}
      <Button onPress={handleNewGroup} title="Criar novo grupo" />
    </Container>
  )
}
