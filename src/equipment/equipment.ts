import { EquipmentSlot, ItemConfigs } from "../config/item-configs"
import { emit } from "../events"
import { getState } from "../state"
import { removeItem } from "../inventory/inventory"
import { Item } from "../inventory/item-types"
import { InventoryService } from "./../inventory/inventory"
import { PlayerService } from "./../player/player-service"

export function equipItem(item: Item) {
    const { equipment } = getState()

    const itemConfig = ItemConfigs[item.id]
    if (itemConfig.type !== "equipment") {
        console.error(`Could not equip item: ${item.id}`)
        return
    }

    const prevItem = equipment[itemConfig.slot]
    if (prevItem) {
        unequipItem(itemConfig.slot)
    }

    equipment[itemConfig.slot] = item
    emit("equip", itemConfig.slot)
    PlayerService.calculateStats()

    removeItem(item)
}

export function unequipItem(slotType: EquipmentSlot) {
    const { equipment } = getState()

    const item = equipment[slotType]
    if (!item) {
        return
    }

    equipment[slotType] = null
    emit("unequip", slotType)
    PlayerService.calculateStats()

    InventoryService.add(item)
}
