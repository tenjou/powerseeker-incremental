import { getState } from "./state"
import { Item } from "./types"
import { addChild, removeElement, setText } from "./dom"
import { ItemConfigs, ItemId } from "./config/ItemConfigs"
import { equipItem } from "./equipment"

function createInventoryItem(item: Item) {
    const element = document.createElement("inventory-item")
    element.id = `item-${item.uid}`
    element.onclick = () => handleItemUse(item)

    addChild("inventory", element)

    updateItem(item)
}

export function loadInventoryWidget() {
    const { inventory } = getState()

    for (const item of inventory) {
        createInventoryItem(item)
    }
}

function updateItem(item: Item) {
    const itemConfig = ItemConfigs[item.id]

    setText(`item-${item.uid}`, `${itemConfig.name} | ${item.amount}`)
}

export function addItem(itemId: ItemId, amount: number = 1) {
    const { inventory, cache } = getState()

    const item = inventory.find((entry) => entry.id === itemId)
    if (item) {
        item.amount += amount
        updateItem(item)
    } else {
        const newItem: Item = {
            uid: cache.lastItemIndex++,
            id: itemId,
            amount,
        }

        inventory.push(newItem)

        createInventoryItem(newItem)
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
        removeElement(`item-${item.uid}`)
    } else {
        updateItem(item)
    }
}

function handleItemUse(item: Item) {
    const itemConfig = ItemConfigs[item.id]

    switch (itemConfig.type) {
        case "armor":
            if (equipItem(item)) {
                removeItem(item.id)
            }
            break
    }
}
