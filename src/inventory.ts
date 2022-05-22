import { getState } from "./state"
import { Item } from "./types"
import { setText } from "./dom"

function updateItem(item: Item) {
    setText(`item-${item.id}`, `${item.id} | ${item.amount}`)
}

export function addItem(itemId: string, amount: number = 1) {
    const inventory = getState().inventory

    let item = inventory[itemId]
    if (item) {
        item.amount += amount
    } else {
        item = {
            id: itemId,
            amount,
        }
        inventory[item.id] = item

        const itemElement = document.createElement("item")
        itemElement.id = `item-${item.id}`

        const list = document.getElementById("list-inventory")
        if (list) {
            list.appendChild(itemElement)
        }
    }

    updateItem(item)
}
