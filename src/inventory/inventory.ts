import { equipItem } from "../equipment/equipment"
import { addHp } from "../character/status"
import { ItemConfigs, ItemEffect, ItemId } from "../config/ItemConfigs"
import { getState } from "../state"
import { Item } from "../types"
import { emit } from "./../events"

export function addItem(itemId: ItemId, amount: number = 1) {
    const { inventory, cache } = getState()

    const item = inventory.find((entry) => entry.id === itemId)
    if (item) {
        item.amount += amount
        emit("item-update", item)
    } else {
        const newItem: Item = {
            uid: cache.lastItemIndex++,
            id: itemId,
            amount,
        }

        inventory.push(newItem)
        emit("item-add", item)
    }
}

export function removeItem(itemId: ItemId, amount: number = 1) {
    const { inventory } = getState()

    const item = inventory.find((entry) => entry.id === itemId)
    if (!item) {
        console.error(`Could not find any item with id: ${itemId}`)
        return
    }

    if (item.amount < amount) {
        console.error(`There are not enough items: ${itemId}, have: ${item.amount}, but need: ${amount}`)
        return
    }

    item.amount -= amount
    if (item.amount <= 0) {
        const itemIndex = inventory.findIndex((entry) => entry.id === itemId)
        if (itemIndex === -1) {
            console.error(`Could not find index for item with id: ${itemId}`)
            return
        }

        inventory.splice(itemIndex, 1)
        emit("item-remove", item)
    } else {
        emit("item-update", item)
    }
}

export function handleItemUse(item: Item) {
    const itemConfig = ItemConfigs[item.id]

    switch (itemConfig.type) {
        case "armor":
            if (equipItem(item)) {
                removeItem(item.id)
            }
            break

        case "consumable":
            resolveItemEffects(itemConfig.effects)
            removeItem(item.id)
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
