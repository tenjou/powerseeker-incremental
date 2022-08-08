import { ItemConfigs } from "../config/ItemConfigs"
import { emit } from "../events"
import { getState } from "../state"
import { Item, SlotType } from "../types"
import { recalculateStats } from "../character/status"
import { addItem, removeItem } from "../inventory/inventory"

export function equipItem(item: Item) {
    const { equipment } = getState()

    const itemConfig = ItemConfigs[item.id]
    if (itemConfig.type !== "armor") {
        console.error(`Could not equip item: ${item.id}`)
        return
    }

    const prevItem = equipment[itemConfig.slot]
    if (prevItem) {
        unequipItem(itemConfig.slot)
    }

    equipment[itemConfig.slot] = item
    emit("equip", itemConfig.slot)
    recalculateStats()

    removeItem(item)
}

export function unequipItem(slotType: SlotType) {
    const { equipment } = getState()

    const item = equipment[slotType]
    if (!item) {
        return
    }

    equipment[slotType] = null
    emit("unequip", slotType)
    recalculateStats()

    addItem(item.id, {
        power: item.power,
        rarity: item.rarity,
        amount: 1,
    })
}
