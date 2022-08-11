import { ItemSlot } from "../components/item-slot"
import { getElement, removeAllChildren, removeElement } from "../dom"
import { getState } from "../state"
import { ItemConfigs, ItemType } from "../config/item-configs"
import { subscribe, unsubscribe } from "./../events"
import { openPopup } from "./../popup"
import { Item } from "./../types"

const ItemTypeSortWeight: Record<ItemType, number> = {
    armor: 100,
    consumable: 50,
    resource: 25,
}

export function loadInventoryView() {
    updateInventoryView()

    subscribe("item-add", updateInventoryView)
    subscribe("item-remove", removeItem)
    subscribe("item-update", updateItem)
}

export function unloadInventoryView() {
    removeAllChildren("inventory-container")

    unsubscribe("item-add", updateInventoryView)
    unsubscribe("item-remove", removeItem)
    unsubscribe("item-update", updateItem)
}

function updateInventoryView() {
    const parent = document.querySelector("inventory-container")
    if (!parent) {
        console.error(`Could not find inventory-container`)
        return
    }

    const inventory = sortInventory(getState().inventory)

    const missingChildren = inventory.length - parent.children.length
    for (let n = 0; n < missingChildren; n += 1) {
        const itemSlot = document.createElement("item-slot")
        itemSlot.onclick = openItemPopup
        parent.appendChild(itemSlot)
    }

    for (let n = 0; n < inventory.length; n += 1) {
        const item = inventory[n]
        const itemSlot = parent.children[n] as ItemSlot
        itemSlot.id = `item-${item.uid}`
        itemSlot.setAttribute("uid", String(item.uid))
        itemSlot.setAttribute("item-id", item.id)
    }
}

function removeItem(item: Item) {
    removeElement(`item-${item.uid}`)
}

function updateItem(item: Item) {
    const element = getElement(`item-${item.uid}`) as ItemSlot
    element.update()
}

export function sortInventory(inventory: Item[]) {
    inventory.sort((a, b) => {
        if (a.id === b.id) {
            if (b.rarity !== a.rarity) {
                return b.rarity - a.rarity
            }
            return b.power - a.power
        }

        const itemConfigA = ItemConfigs[a.id]
        const itemConfigB = ItemConfigs[b.id]

        return ItemTypeSortWeight[itemConfigB.type] - ItemTypeSortWeight[itemConfigA.type]
    })

    return inventory
}

export function openItemPopup(event: MouseEvent, onClose?: () => void) {
    const { inventory } = getState()

    const element = event.target as HTMLElement
    const uid = Number(element.getAttribute("uid"))
    const item = inventory.find((entry) => entry.uid === uid)
    if (!item) {
        console.error(`Could not find item with UID: ${uid}`)
        return
    }

    openPopup(
        "item-popup",
        {
            uid: item.uid,
            "item-id": item.id,
        },
        onClose
    )
}
