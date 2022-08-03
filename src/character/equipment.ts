import { ItemConfigs } from "../config/ItemConfigs"
import { emit } from "./../events"
import { getState } from "./../state"
import { Item, SlotType } from "./../types"
import { recalculateStats } from "./status"
import { addItem } from "./../inventory/inventory"

export function equipItem(item: Item) {
    const { equipment } = getState()

    const itemConfig = ItemConfigs[item.id]
    if (itemConfig.type !== "armor") {
        console.error(`Could not equip item: ${item.id}`)
        return false
    }

    const prevItem = equipment[itemConfig.slot]
    if (prevItem) {
        unequipItem(itemConfig.slot)
    }

    equipment[itemConfig.slot] = item
    emit("equip", itemConfig.slot)
    recalculateStats()

    return true
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

    addItem(item.id, 1)
}
