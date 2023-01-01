import { AbilityConfigs, AbilityId } from "./config/ability-configs"
import { ItemId } from "./config/item-configs"
import { getItemByUId } from "./inventory/inventory"
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

    if (tagName === "ITEM-SLOT" || tagName === "ABILITY-SLOT") {
        itemTooltipElement.classList.remove("hide")
        itemTooltipElement.setAttribute("style", `left: ${event.x}px; top: ${event.y}px`)
    } else {
        tooltipElement.classList.add("hide")
        itemTooltipElement.classList.add("hide")
    }

    if (prevHoverElement !== element) {
        switch (element.tagName) {
            case "ITEM-SLOT": {
                const itemUId = element.getAttribute("uid")
                if (itemUId) {
                    showItemTooltip(itemUId)
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

function showItemTooltip(itemUId: string) {
    const item = getItemByUId(itemUId)
    if (!item) {
        console.error(`Could not find item with uid ${itemUId}`)
        return
    }

    itemTooltipElement.updateItem(item)
}
