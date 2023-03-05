import { i18n } from "./i18n"
import { ItemIconSlot } from "./inventory/ui/item-icon-slot"
import "./tooltip/ui/item-tooltip"
import { ItemTooltip } from "./tooltip/ui/item-tooltip"

let tooltipElement: HTMLElement
let itemTooltipElement: ItemTooltip
let prevHoverElement: HTMLElement | null = null
let prevTooltipElement: HTMLElement | null = null

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
        prevHoverElement = null
        if (prevTooltipElement) {
            prevTooltipElement.classList.remove("show")
            prevTooltipElement = null
        }
    }
}

export function handeMouseMoveTooltip(event: MouseEvent) {
    event.stopPropagation()

    const element = event.target as HTMLElement

    if (prevHoverElement !== element) {
        const tooltip = element.getAttribute("tooltip")

        if (!tooltip) {
            prevHoverElement = null

            if (prevTooltipElement) {
                prevTooltipElement.classList.remove("show")
                prevTooltipElement = null
            }
            return
        }

        prevTooltipElement = itemTooltipElement

        switch (tooltip) {
            case ":item": {
                const itemSlot = element as ItemIconSlot
                itemTooltipElement.updateByItem(itemSlot.item)
                break
            }

            default:
                prevTooltipElement = tooltipElement
                prevTooltipElement.innerHTML = i18n(tooltip || "")
                break
        }

        prevTooltipElement.classList.add("show")
    }

    if (prevTooltipElement) {
        const parentWidth = prevTooltipElement.parentElement.clientWidth
        const bounds = prevTooltipElement.getBoundingClientRect()

        const left = event.x + bounds.width > parentWidth ? parentWidth - bounds.width : event.x
        const top = event.y < bounds.height ? bounds.height : event.y

        prevTooltipElement.setAttribute("style", `left: ${left}px; top: ${top}px`)
    }

    prevHoverElement = element
}

export const setTooltip = (element: HTMLElement, tooltip: string) => {
    element.setAttribute("tooltip", tooltip)
}
