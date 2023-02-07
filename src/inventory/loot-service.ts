import { ItemConfigEquipment, ItemConfigs, ItemId, ItemStatTypes } from "../config/item-configs"
import { addCurrency } from "../currencies/currencies"
import { PlayerService } from "../player/player-service"
import { getState } from "../state"
import { randomNumber, shuffle } from "../utils"
import { addItem } from "./inventory"
import { Item, ItemStat } from "./item-types"
import { updateState } from "./../state"
import { WorldService } from "./../world/world-service"

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
            uid: generateUId(),
            id: itemId,
            rarity: 0,
            amount: 1,
            level: 1,
            power: 1,
            stats: [],
        }

        return item
    },

    consumeBattleResult() {
        const { battleResult } = getState()

        if (!battleResult) {
            console.error("No battle result to consume")
            return
        }

        PlayerService.addExp(battleResult.xp)
        addCurrency("gold", battleResult.gold)

        for (const itemReward of battleResult.loot) {
            addItem(itemReward)
        }

        for (const locationProgress of battleResult.locationProgress) {
            WorldService.progressLocation(locationProgress.locationId, locationProgress.progress)
        }

        updateState({
            battleResult: null,
        })
    },
}

function generateUId() {
    return String(getState().cache.lastItemIndex++)
}
