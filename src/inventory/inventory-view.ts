import { getElement, removeAllChildren } from "../dom"
import { getState } from "../state"
import { getView } from "../view"
import { Item } from "./../types"
import { handleItemUse } from "./inventory"

export function loadInventoryView() {
    const { inventory } = getState()

    for (const item of inventory) {
        addInventoryViewItem(item)
    }
}

export function unloadInventoryView() {
    removeAllChildren("inventory-container")
}

export function addInventoryViewItem(item: Item) {
    if (getView() !== "inventory") {
        return
    }

    const parent = document.querySelector("inventory-container")
    if (!parent) {
        console.error(`Could not find inventory-container`)
        return
    }

    const itemSlot = document.createElement("item-slot")
    itemSlot.id = `item-${item.uid}`
    itemSlot.setAttribute("item-id", item.id)
    itemSlot.setAttribute("amount", String(item.amount))
    itemSlot.onclick = () => handleItemUse(item)
    parent.appendChild(itemSlot)
}

export function updateItemView(item: Item) {
    const element = getElement(`item-${item.uid}`)
    element.setAttribute("amount", String(item.amount))
}
