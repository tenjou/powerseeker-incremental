import { getElementById } from "./dom"
import { subscribe } from "./events"

type PopupType = "item-popup" | "battle-result-popup" | "ability-popup" | "explore-popup" | "location-popup"

interface Popup {
    type: PopupType
    element: HTMLElement
    onClose?: () => void
}

const popups: Popup[] = []

export const PopupService = {
    load() {
        const popupElement = getElementById("popups")

        popupElement.addEventListener("click", tryClosePopup)

        subscribe("close", PopupService.close)
    },

    open(type: PopupType, attributes: Record<string, string | number> = {}, onClose?: () => void) {
        const element = document.createElement(type)

        element.id = type

        for (let attributeId in attributes) {
            element.setAttribute(attributeId, String(attributes[attributeId]))
        }

        document.getElementById("popups")?.appendChild(element)

        if (popups.length > 0) {
            const prevPopup = popups[popups.length - 1]
            prevPopup.element.classList.add("hide")
        }

        popups.push({
            type,
            element,
            onClose,
        })
    },

    close() {
        const lastPopup = popups.pop()
        if (lastPopup) {
            lastPopup.element.remove()
            if (lastPopup.onClose) {
                lastPopup.onClose()
            }
        }

        if (popups.length > 0) {
            const popup = popups[popups.length - 1]
            popup.element.classList.remove("hide")
        }
    },

    closeAll() {
        while (popups.length > 0) {
            PopupService.close()
        }
    },
}

const tryClosePopup = (event: MouseEvent) => {
    const popupElement = getElementById("popups")

    if (event.target === popupElement) {
        PopupService.close()
    }
}
