import { ItemId } from "./config/item-configs"
import { Item, ItemSlotType } from "./inventory/item-types"
import { getState } from "./state"
import "./tooltip/ui/item-tooltip"
import { ItemTooltip } from "./tooltip/ui/item-tooltip"

const validTags: string[] = ["ITEM-ICON-SLOT", "XP-ICON-SLOT", "ABILITY-SLOT"]

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

    if (validTags.includes(element.tagName)) {
        itemTooltipElement.classList.remove("hide")
        itemTooltipElement.setAttribute("style", `left: ${event.x}px; top: ${event.y}px`)
    } else {
        tooltipElement.classList.add("hide")
        itemTooltipElement.classList.add("hide")
    }

    if (prevHoverElement !== element) {
        switch (element.tagName) {
            case "ITEM-SLOT":
            case "ITEM-ICON-SLOT":
            case "XP-ICON-SLOT": {
                const itemId = element.getAttribute("item-id") as ItemId | null
                if (itemId) {
                    const amount = Number(element.getAttribute("amount"))
                    showItemTooltipByItemId(itemId, amount)
                } else {
                    const itemUId = element.getAttribute("uid")
                    const itemSlotType = element.getAttribute("slot-type") as ItemSlotType | null
                    if (itemUId && itemSlotType) {
                        showItemTooltipByUId(itemUId, itemSlotType)
                    }
                }
                break
            }
        }
    }

    prevHoverElement = element
}

function showItemTooltipByUId(itemUId: string, slotType: ItemSlotType) {
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

    itemTooltipElement.updateByItem(item)
}

function showItemTooltipByItemId(itemId: ItemId, amount: number) {
    itemTooltipElement.updateByItemId(itemId, amount)
}
