import { getElement, removeAllChildren, removeElement } from "../dom"
import { getState } from "../state"
import { subscribe, unsubscribe } from "./../events"
import { Item } from "./../types"
import { handleItemUse } from "./inventory"

export function loadInventoryView() {
    const { inventory } = getState()

    for (const item of inventory) {
        addItem(item)
    }

    subscribe("item-add", addItem)
    subscribe("item-remove", removeItem)
    subscribe("item-update", updateItem)
}

export function unloadInventoryView() {
    removeAllChildren("inventory-container")

    unsubscribe("item-add", addItem)
    unsubscribe("item-remove", removeItem)
    unsubscribe("item-update", updateItem)
}

function addItem(item: Item) {
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

function removeItem(item: Item) {
    removeElement(`item-${item.uid}`)
}

function updateItem(item: Item) {
    const element = getElement(`item-${item.uid}`)
    element.setAttribute("amount", String(item.amount))
}
