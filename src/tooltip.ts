import { AbilityConfigs, AbilityId } from "./config/ability-configs"
import { ItemConfigs, ItemId } from "./config/item-configs"
import { i18n } from "./local"

let tooltipElement: HTMLElement

export function loadTooltipSystem() {
    const element = document.querySelector("tooltip")
    if (!element) {
        console.error(`Could not find tooltip element`)
        return
    }

    tooltipElement = element as HTMLElement

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
    }
}

function showTooltip(event: MouseEvent, id: string) {
    tooltipElement.classList.remove("hide")
    tooltipElement.setAttribute("style", `left: ${event.x}px; top: ${event.y - 20}px`)
    tooltipElement.innerHTML = i18n(id)
}
