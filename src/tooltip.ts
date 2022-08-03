import { ItemConfigs, ItemId } from "./config/ItemConfigs"
import { i18n } from "./local"

export function loadTooltip() {
    const tooltipElement = document.querySelector("tooltip")
    if (!tooltipElement) {
        console.error(`Could not find tooltip element`)
        return
    }

    window.onmousemove = (event) => {
        const element = event.target as HTMLElement
        const itemId = element.getAttribute("item-id")

        if (itemId) {
            const itemConfig = ItemConfigs[itemId as ItemId]

            tooltipElement.classList.remove("hide")
            tooltipElement.setAttribute("style", `left: ${event.x}px; top: ${event.y - 20}px`)
            tooltipElement.innerHTML = i18n(itemConfig.id)
        } else {
            tooltipElement.classList.add("hide")
        }
    }
}
