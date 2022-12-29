import { AbilityConfigs, AbilityId } from "./config/ability-configs"
import { ItemConfigs, ItemId } from "./config/item-configs"
import { i18n } from "./i18n"
import "./tooltip/ui/ItemTooltip"
import { ItemTooltip } from "./tooltip/ui/ItemTooltip"

let tooltipElement: HTMLElement
let itemTooltipElement: ItemTooltip

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
    const itemId = element.getAttribute("item-id") as ItemId | null
    const abilityId = element.getAttribute("ability-id") as AbilityId | null

    if (itemId && element.tagName === "ITEM-SLOT") {
        const itemConfig = ItemConfigs[itemId]
        showTooltip(event, itemConfig.id)
    } else if (abilityId && element.tagName === "ABILITY-SLOT") {
        const abilityConfig = AbilityConfigs[abilityId]
        showTooltip(event, abilityConfig.id)
    } else {
        tooltipElement.classList.add("hide")
        itemTooltipElement.classList.add("hide")
    }
}

function showTooltip(event: MouseEvent, id: string, type: "item" | "other" = "other") {
    itemTooltipElement.classList.remove("hide")
    itemTooltipElement.setAttribute("style", `left: ${event.x}px; top: ${event.y}px`)
    itemTooltipElement.update()
}
