import { ItemConfigs } from "../config/item-configs"
import { i18n } from "../local"
import { SlotType } from "../types"
import { goTo } from "../view"
import { getElement, removeAllChildren, setText } from "./../dom"
import { subscribe, unsubscribe } from "./../events"
import { openItemPopup, sortInventory } from "./../inventory/inventory-view"
import { getState } from "./../state"
import { unequipItem } from "./equipment"

export function loadEquipmentView(segments: string[]) {
    const { inventory } = getState()

    const equipmentSlot = segments.pop()
    if (!equipmentSlot) {
        goBack()
        return
    }

    const items = inventory.filter((entry) => {
        const itemConfig = ItemConfigs[entry.id]
        return itemConfig.type === "armor" && itemConfig.slot === equipmentSlot
    })

    sortInventory(items)

    const parent = getElement("equipment-container")

    const itemSlot = document.createElement("item-slot")
    itemSlot.onclick = () => {
        unequipItem(equipmentSlot as SlotType)
        goBack()
    }
    parent.appendChild(itemSlot)

    for (const item of items) {
        const itemSlot = document.createElement("item-slot")
        itemSlot.id = `item-${item.uid}`
        itemSlot.setAttribute("uid", String(item.uid))
        itemSlot.setAttribute("item-id", item.id)
        itemSlot.onclick = (event: MouseEvent) => {
            openItemPopup(event)
        }
        parent.appendChild(itemSlot)
    }

    setText("equipment-category", i18n(equipmentSlot))

    subscribe("close", goBack)
    getElement("close-equipment").onclick = goBack
}

export function unloadEquipmentView() {
    unsubscribe("close", goBack)
    removeAllChildren("equipment-container")
}

function goBack() {
    goTo("/character")
}
