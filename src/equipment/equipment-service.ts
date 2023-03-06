import { EquipmentSlotType, ItemConfigs } from "../config/item-configs"
import { emit } from "../events"
import { InventoryService } from "../inventory/inventory-service"
import { Item } from "../inventory/item-types"
import { PlayerService } from "../player/player-service"
import { getState } from "../state"
import { LoadoutService } from "./../loadout/loadout-service"

export const EquipmentService = {
    equip(item: Item) {
        const { equipment, loadout } = getState()

        const itemConfig = ItemConfigs[item.id]
        if (itemConfig.type !== "equipment") {
            console.error(`Could not equip item: ${item.id}`)
            return
        }

        const prevItem = equipment[itemConfig.slot]
        if (prevItem) {
            EquipmentService.unequip(itemConfig.slot)
        }

        equipment[itemConfig.slot] = item

        if (itemConfig.slot === "main_hand") {
            LoadoutService.equipBasicAttack(itemConfig.equipmentType)
        }

        PlayerService.calculateStats()
        InventoryService.remove(item)

        emit("equip", itemConfig.slot)
    },

    unequip(slotType: EquipmentSlotType) {
        const { equipment, loadout } = getState()

        const item = equipment[slotType]
        if (!item) {
            return
        }

        equipment[slotType] = null

        if (slotType === "main_hand") {
            loadout.attack = null
        }

        PlayerService.calculateStats()
        InventoryService.add(item)

        emit("unequip", slotType)
    },
}
