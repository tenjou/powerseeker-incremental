import { ItemConfigs } from "./config/ItemConfigs"
import { addChild } from "./dom"
import { getState } from "./state"
import { Item } from "./types"

function createEquipmentSlot(item: Item | null, slotName: string) {
    const element = document.createElement("equipment-slot")
    if (item) {
        const itemConfig = ItemConfigs[item.id]
        element.innerText = itemConfig.name
    } else {
        element.innerText = slotName
    }

    element.onclick = () => handleUnequip()

    if (!item) {
        element.classList.add("empty")
    }

    addChild("equipment", element)
}

export function loadEquipmentWidget() {
    const { equipment } = getState()

    createEquipmentSlot(equipment.hand1, "Hand_1")
    createEquipmentSlot(equipment.body, "Body")
}

function handleUnequip() {
    console.log("unequip")
}
