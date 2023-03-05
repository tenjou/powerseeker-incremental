import { addHp } from "../character/status"
import { ItemConfigs, ItemEffect } from "../config/item-configs"
import { EquipmentService } from "../equipment/equipment-service"
import { getState } from "../state"
import { emit } from "../events"
import { Item } from "./item-types"
import "./ui/equipment-slot"
import "./ui/item-icon-slot"
import "./ui/item-popup"

export const InventoryService = {
    add(newItem: Item) {
        const { inventory } = getState()

        const itemConfig = ItemConfigs[newItem.id]
        if (itemConfig.type === "equipment") {
            inventory.push(newItem)
            emit("item-added", newItem)
            return
        }

        const prevItem = inventory.find((entry) => entry.id === newItem.id)
        if (prevItem) {
            prevItem.amount += newItem.amount
            emit("item-updated", newItem)
            return
        }

        inventory.push(newItem)
        emit("item-added", newItem)
    },

    remove(item: Item, amount: number = 1) {
        const { inventory } = getState()

        const itemConfig = ItemConfigs[item.id]
        if (itemConfig.type === "equipment" || item.amount <= amount) {
            if (item.amount < amount) {
                console.error(`There are not enough items: ${item.id}, have: ${item.amount}, but need: ${amount}`)
                return
            }

            const itemIndex = inventory.findIndex((entry) => entry.uid === item.uid)
            if (itemIndex === -1) {
                console.error(`Could not find index for item with id: ${item.id}`)
                return
            }

            inventory.splice(itemIndex, 1)
            emit("item-remove", item)
            return
        }

        if (item.amount < amount) {
            console.error(`There are not enough items: ${item.id}, have: ${item.amount}, but need: ${amount}`)
            return
        }

        item.amount -= amount
        emit("item-updated", item)
    },

    generateUId() {
        return String(getState().cache.lastItemIndex++)
    },
}

export function handleItemUse(item: Item) {
    const itemConfig = ItemConfigs[item.id]

    switch (itemConfig.type) {
        case "equipment":
            EquipmentService.equip(item)
            break

        case "consumable":
            resolveItemEffects(itemConfig.effects)
            InventoryService.remove(item)
            break
    }
}

function resolveItemEffects(effects: ItemEffect[]) {
    for (const effect of effects) {
        switch (effect.type) {
            case "restore_hp":
                addHp(effect.value)
                break
        }
    }
}

export function getItemByUId(uid: string) {
    const { inventory } = getState()

    return inventory.find((item) => item.uid === uid)
}
