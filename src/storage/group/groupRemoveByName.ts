import AsyncStorage from "@react-native-async-storage/async-storage";
import { groupGetAll } from "./groupGetAll";
import { GROUP_COLLECTION, PLAYER_COLLECTION } from "@storage/storageConfig";

export async function groupRemoveByName(groupDeleted: string) {
  try {
    const storedGroup = await groupGetAll()
    const groups = storedGroup.filter(group => group !== groupDeleted)

    await AsyncStorage.setItem(GROUP_COLLECTION, JSON.stringify(groups))
    await AsyncStorage.removeItem(`${PLAYER_COLLECTION}-${groupDeleted}`)

  } catch (error) {
    console.log(error)
    throw error
  }
}
