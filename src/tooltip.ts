import { AbilityConfigs, AbilityId } from "./config/ability-configs"
import { ItemId } from "./config/item-configs"
import { getItemByUId } from "./inventory/inventory"
import { Item, ItemSlotType } from "./inventory/item-types"
import { getState } from "./state"
import "./tooltip/ui/item-tooltip"
import { ItemTooltip } from "./tooltip/ui/item-tooltip"

let tooltipElement: HTMLElement
let itemTooltipElement: ItemTooltip
let prevHoverElement: HTMLElement | null = null

export function loadTooltipSystem() {
    const element = document.querySelector("tooltip")
    if (!element) {
        console.error(`Could not find tooltip element`)
        return
    }

    tooltipElement = element as HTMLElement
    itemTooltipElement = document.querySelector("item-tooltip") as ItemTooltip

    window.onmousemove = handeMouseMoveTooltip
    window.onclick = () => {
        tooltipElement.classList.add("hide")
    }
}

export function handeMouseMoveTooltip(event: MouseEvent) {
    event.stopPropagation()

    const element = event.target as HTMLElement
    const tagName = element.tagName
    // const abilityId = element.getAttribute("ability-id") as AbilityId | null

    console.log(tagName)
    if (tagName === "ITEM-ICON-SLOT" || tagName === "ABILITY-SLOT") {
        itemTooltipElement.classList.remove("hide")
        itemTooltipElement.setAttribute("style", `left: ${event.x}px; top: ${event.y}px`)
    } else {
        tooltipElement.classList.add("hide")
        itemTooltipElement.classList.add("hide")
    }

    if (prevHoverElement !== element) {
        switch (element.tagName) {
            case "ITEM-SLOT":
            case "ITEM-ICON-SLOT": {
                const itemUId = element.getAttribute("uid")
                const itemSlotType = element.getAttribute("slot-type") as ItemSlotType | null
                if (itemUId && itemSlotType) {
                    showItemTooltip(itemUId, itemSlotType)
                }
                break
            }
        }
    }

    // if (itemId && element.tagName === "ITEM-SLOT") {
    //     showItemTooltip(event, itemId)
    // } else if (abilityId && element.tagName === "ABILITY-SLOT") {
    //     const abilityConfig = AbilityConfigs[abilityId]
    //     showTooltip(event, abilityConfig.id)
    // } else {
    //     tooltipElement.classList.add("hide")
    //     itemTooltipElement.classList.add("hide")
    // }

    prevHoverElement = element
}

function showTooltip(event: MouseEvent, id: string) {
    itemTooltipElement.classList.remove("hide")
    itemTooltipElement.setAttribute("style", `left: ${event.x}px; top: ${event.y}px`)
}

function showItemTooltip(itemUId: string, slotType: ItemSlotType) {
    let buffer: Item[]

    switch (slotType) {
        case ItemSlotType.Inventory:
            buffer = getState().inventory
            break
        case ItemSlotType.BattleResult:
            buffer = getState().battleResult?.loot || []
            break

        default:
            console.error(`Unknown slot type ${slotType}`)
            return
    }

    const item = buffer.find((item) => item.uid === itemUId)
    if (!item) {
        console.error(`Could not find item with uid ${itemUId}`)
        return
    }

    itemTooltipElement.updateItem(item)
}
