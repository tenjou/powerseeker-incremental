import { addHp } from "../character/status"
import { ItemConfigs, ItemEffect, ItemId } from "../config/item-configs"
import { equipItem } from "../equipment/equipment"
import { getState } from "../state"
import { emit } from "./../events"
import { Item } from "./item-types"
import "./ui/item-popup"

export function addItem(item: Item) {
    const { inventory, cache } = getState()

    // const amount = props.amount || 1
    // const power = props.power || 1
    // const rarity = props.rarity || 0

    // const item = inventory.find((entry) => entry.id === itemId && entry.power === power && entry.rarity === rarity)
    // if (item) {
    //     item.amount += amount
    //     emit("item-update", item)
    // } else {
    //     const newItem: Item = {
    //         uid: String(cache.lastItemIndex++),
    //         id: itemId,
    //         power,
    //         rarity,
    //         amount,
    //         stats: [],
    //     }

    //     inventory.push(newItem)
    //     emit("item-add", newItem)
    // }
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
        case "equipment":
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

export function getItemByUId(uid: string) {
    const { inventory } = getState()

    return inventory.find((item) => item.uid === uid)
}

export function generateLootItem(itemId: ItemId, maxLevel: number, luck: number) {
    const itemConfig = ItemConfigs[itemId]
    if (!itemConfig) {
        throw new Error(`Could not find item config for id: ${itemId}`)
    }

    const level = 1
    const power = 1
    const rarity = 1

    const item: Item = {
        uid: String(getState().cache.lastItemIndex++),
        id: itemId,
        power,
        rarity,
        amount: 1,
        stats: [],
    }

    return item
}
