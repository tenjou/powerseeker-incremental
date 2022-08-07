import { addHp } from "../character/status"
import { ItemConfigs, ItemEffect, ItemId } from "../config/ItemConfigs"
import { equipItem } from "../equipment/equipment"
import { getState } from "../state"
import { Item } from "../types"
import { emit } from "./../events"
import "./item-popup"

export function addItem(itemId: ItemId, power: number, amount: number = 1) {
    const { inventory, cache } = getState()

    const item = inventory.find((entry) => entry.id === itemId && entry.power === power)
    if (item) {
        item.amount += amount
        emit("item-update", item)
    } else {
        const newItem: Item = {
            uid: cache.lastItemIndex++,
            id: itemId,
            power,
            amount,
        }

        inventory.push(newItem)
        emit("item-add", newItem)
    }
}

export function removeItem(item: Item, amount: number = 1) {
    const { inventory } = getState()

    if (item.amount < amount) {
        console.error(`There are not enough items: ${item.id}, have: ${item.amount}, but need: ${amount}`)
        return
    }

    item.amount -= amount
    if (item.amount <= 0) {
        const itemIndex = inventory.findIndex((entry) => entry.uid === item.uid)
        if (itemIndex === -1) {
            console.error(`Could not find index for item with id: ${item.id}`)
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
            equipItem(item)
            break

        case "consumable":
            resolveItemEffects(itemConfig.effects)
            removeItem(item)
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
