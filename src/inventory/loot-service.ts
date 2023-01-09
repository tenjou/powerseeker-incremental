import { ItemConfigEquipment, ItemConfigs, ItemId, ItemStatTypes } from "../config/item-configs"
import { getState } from "../state"
import { randomNumber, shuffle } from "../utils"
import { Item, ItemStat } from "./item-types"

export const LootService = {
    generateEquipment(equipmentConfig: ItemConfigEquipment, maxLevel: number, luck: number): Item {
        const level = randomNumber(1, maxLevel)
        const rarity = randomNumber(0, 4)
        let power = 0

        const stats: ItemStat[] = new Array(equipmentConfig.stats.length + rarity)
        for (let n = 0; n < equipmentConfig.stats.length; n++) {
            const statType = equipmentConfig.stats[n]
            stats[n] = {
                type: statType,
                value: level,
            }

            power += level
        }

        shuffle(ItemStatTypes)

        for (let n = equipmentConfig.stats.length; n < stats.length; n++) {
            const statType = ItemStatTypes[n]
            const statValue = randomNumber(1, level)
            stats[n] = {
                type: statType,
                value: statValue,
            }

            power += statValue
        }

        const item: Item = {
            uid: generateUId(),
            id: equipmentConfig.id,
            rarity,
            level,
            power,
            amount: 1,
            stats,
        }

        return item
    },

    generateItem(itemId: ItemId, maxLevel: number, luck: number): Item {
        const itemConfig = ItemConfigs[itemId]
        if (!itemConfig) {
            throw new Error(`Could not find item config for id: ${itemId}`)
        }

        if (itemConfig.type === "equipment") {
            return LootService.generateEquipment(itemConfig, maxLevel, luck)
        }

        const item: Item = {
            uid: "",
            id: itemId,
            rarity: 0,
            amount: 1,
            level: 1,
            power: 1,
            stats: [],
        }

        return item
    },
}

function generateUId() {
    return String(getState().cache.lastItemIndex++)
}
