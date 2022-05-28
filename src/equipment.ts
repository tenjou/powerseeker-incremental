import { ItemConfigs } from "./config/ItemConfigs"
import { addChild, setText, toggleClassName } from "./dom"
import { addItem } from "./inventory"
import { getState } from "./state"
import { Item, SlotType } from "./types"

function createEquipmentSlot(slotType: SlotType) {
    const element = document.createElement("equipment-slot")
    element.id = `equipment-slot-${slotType}`
    element.onclick = () => unequipItem(slotType)

    addChild("equipment", element)
    updateEquipment(slotType)
}

export function loadEquipmentWidget() {
    createEquipmentSlot("hand_1")
    createEquipmentSlot("body")
}

function updateEquipment(slotType: SlotType) {
    const { equipment } = getState()

    const item = equipment[slotType]
    const elementId = `equipment-slot-${slotType}`

    if (item) {
        const itemConfig = ItemConfigs[item.id]
        setText(elementId, itemConfig.name)
    } else {
        setText(elementId, slotType)
    }

    toggleClassName(elementId, "empty", !item)
}

export function equipItem(item: Item) {
    const { equipment } = getState()

    const itemConfig = ItemConfigs[item.id]
    if (itemConfig.type !== "armor") {
        console.error(`Could not equip item: ${item.id}`)
        return false
    }

    const prevItem = equipment[itemConfig.slot]
    if (prevItem) {
        unequipItem(itemConfig.slot)
    }

    equipment[itemConfig.slot] = item
    updateEquipment(itemConfig.slot)

    return true
}

function unequipItem(slotType: SlotType) {
    const { equipment } = getState()

    const item = equipment[slotType]
    if (!item) {
        console.error(`There are not unequipable items in slot: ${slotType}`)
        return
    }

    equipment[slotType] = null
    updateEquipment(slotType)

    addItem(item.id, 1)
}
