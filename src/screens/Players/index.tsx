import { Container, Counter, Form, HeaderList } from './styles'

import { Header } from '@components/Header'
import { Highlight } from '@components/Highlight'
import { IconButton } from '@components/IconButton'
import { Input } from '@components/Input'
import { Filter } from '@components/Filter'
import { PlayerCard } from '@components/PlayerCard'
import { EmptyList } from '@components/EmptyList'
import { Button } from '@components/Button'

import { useEffect, useRef, useState } from 'react'
import { Alert, FlatList, type TextInput } from 'react-native'

import { useNavigation, useRoute } from '@react-navigation/native'

import { AppError } from '@utils/AppError'

import { playerAddByGroup } from '@storage/player/playerAddByGroup'
import { playersGetByGroupAndTeam } from '@storage/player/playersGetByGroupAndTeam'
import type { PlayerStorageDTO } from '@storage/player/PlayerStorageDTO'
import { playerRemoveByGroup } from '@storage/player/playerRemoveByGroup'
import { groupRemoveByName } from '@storage/group/groupRemoveByName'
import { Loading } from '@components/Loading'

type RouteParams = {
  group: string
}

export function Players() {
  const [isLoading, setIsLoading] = useState(true)
  const [newPlayerName, setNewPlayerName] = useState('')
  const [team, setTeam] = useState('Time A')
  const [players, setPlayers] = useState<PlayerStorageDTO[]>([])

  const route = useRoute()

  const { group } = route.params as RouteParams

  const newPlayerNameInputRef = useRef<TextInput>(null)

  const navigation = useNavigation()

  async function handleAddPlayer() {
    if (newPlayerName.trim().length === 0) {
      return Alert.alert('Novo jogador', 'Informe o nome do jogador.')
    }

    const newPlayer = {
      name: newPlayerName,
      team,
    }

    try {
      await playerAddByGroup(newPlayer, group)

      newPlayerNameInputRef.current?.blur()
      setNewPlayerName('')
      fetchPlayersByTeam()
    } catch (error) {
      if (error instanceof AppError) {
        Alert.alert('Novo jogador', error.message)
      } else {
        console.log(error)
        Alert.alert('Novo jogador', 'Não foi possivel cadastrar.')
      }
    }
  }

  async function fetchPlayersByTeam() {
    try {
      setIsLoading(true)
      const playersByTeam = await playersGetByGroupAndTeam(group, team)
      setPlayers(playersByTeam)
    } catch (error) {
      console.log(error)
      Alert.alert('Jogadores', 'Não foi possivel carregar os jogadores')
    } finally {
      setIsLoading(false)
    }
  }

  async function handleRemovePlayer(playerName: string) {
    try {
      await playerRemoveByGroup(playerName, group)
      fetchPlayersByTeam()
    } catch (error) {
      console.log(error)
      Alert.alert('Remover jogador', 'Não foi possivel remover.')
    }
  }

  async function groupRemove() {
    try {
      await groupRemoveByName(group)
      navigation.navigate('groups')
    } catch (error) {
      console.log(error)
      Alert.alert('Remover grupo', 'Não foi possivel remover o grupo.')
    }
  }

  async function handleGroupRemove() {
    Alert.alert('Remover', 'Deseja remover o grupo?', [
      { text: 'Não', style: 'cancel' },
      {
        text: 'Sim',
        onPress: () => groupRemove(),
      },
    ])
  }

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    fetchPlayersByTeam()
  }, [team])

  return (
    <Container>
      <Header showBackButton />
      <Highlight title={group} subtitle="adicione a galera e separe os times" />
      <Form>
        <Input
          inputRef={newPlayerNameInputRef}
          placeholder="Adicione uma pessoa"
          onChangeText={setNewPlayerName}
          autoCorrect={false}
          value={newPlayerName}
          onSubmitEditing={handleAddPlayer}
          returnKeyType="done"
        />
        <IconButton icon="add" onPress={handleAddPlayer} />
      </Form>

      <HeaderList>
        <FlatList
          data={['Time A', 'Time B']}
          keyExtractor={item => item}
          renderItem={({ item }) => (
            <Filter
              isActive={item === team}
              onPress={() => setTeam(item)}
              title={item}
            />
          )}
          horizontal
        />

        <Counter>{players.length}</Counter>
      </HeaderList>

      {isLoading ? (
        <Loading />
      ) : (
        <FlatList
          data={players}
          keyExtractor={item => item.name}
          renderItem={({ item }) => (
            <PlayerCard
              onRemove={() => {
                handleRemovePlayer(item.name)
              }}
              name={item.name}
            />
          )}
          ListEmptyComponent={() => (
            <EmptyList message="Adicione participantes ao grupo" />
          )}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[
            { paddingBottom: 100 },
            players.length === 0 && { flex: 1 },
          ]}
        />
      )}

      <Button onPress={handleGroupRemove} title="Remover grupo" type="RED" />
    </Container>
  )
}
