import { EquipmentSlotType, ItemConfigs } from "../../config/item-configs"
import { getElement, getElementById, removeAllChildren } from "../../dom"
import { subscribe, unsubscribe } from "../../events"
import { sortInventory } from "../../inventory/ui/inventory-view"
import { ItemIconSlot } from "../../inventory/ui/item-icon-slot"
import { getState } from "../../state"
import { goTo } from "../../view"
import { EquipmentService } from "../equipment-service"
import { ViewHeaderSub } from "./../../components/view-header-sub"

export const loadEquipmentView = (segments: string[]) => {
    const { inventory } = getState()

    const equipmentSlot = segments.pop() as EquipmentSlotType
    if (!equipmentSlot) {
        goBack()
        return
    }

    getElement<ViewHeaderSub>("#equipment-header").update({ category: "equipment", subcategory: equipmentSlot })

    const items = inventory.filter((entry) => {
        const itemConfig = ItemConfigs[entry.id]
        if (itemConfig.type !== "equipment") {
            return false
        }

        return itemConfig.slot === equipmentSlot
    })

    sortInventory(items)

    const parent = getElementById("equipment-container")

    const emptyItemSlot = new ItemIconSlot()
    emptyItemSlot.updateAsEmpty()
    emptyItemSlot.onclick = () => {
        EquipmentService.unequip(equipmentSlot)
        goBack()
    }
    parent.appendChild(emptyItemSlot)

    for (const item of items) {
        const itemSlot = new ItemIconSlot()
        itemSlot.updateByItem(item)
        itemSlot.onclick = (event: MouseEvent) => {
            EquipmentService.equip(item)
            goBack()
        }
        parent.appendChild(itemSlot)
    }

    subscribe("close", goBack)
    getElementById("close-equipment").onclick = goBack
}

export const unloadEquipmentView = () => {
    unsubscribe("close", goBack)
    removeAllChildren("equipment-container")
}

const goBack = () => {
    goTo("/character")
}
