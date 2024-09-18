import AsyncStorage from '@react-native-async-storage/async-storage'
import type { PlayerStorageDTO } from './PlayerStorageDTO'
import { PLAYER_COLLECTION } from '@storage/storageConfig'
import { playersGetByGroup } from './playersGetByGroup'
import { AppError } from '@utils/AppError'

export async function playerAddByGroup(
  newPlayer: PlayerStorageDTO,
  group: string
) {
  try {
    const storedPlayers = await playersGetByGroup(group)

    const playerAlreadyExist = storedPlayers.filter(
      player => player.name === newPlayer.name
    )

    if (playerAlreadyExist.length > 0) {
      throw new AppError('Esse jogador já está em um time')
    }

    const storage = JSON.stringify([...storedPlayers, newPlayer])

    await AsyncStorage.setItem(`${PLAYER_COLLECTION}-${group}`, storage)
  } catch (error) {
    console.log(error)
    throw error
  }
}
