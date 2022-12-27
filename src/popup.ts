import { getElementById } from "./dom"
import { subscribe } from "./events"

type PopupType = "item-popup" | "battle-result-popup" | "ability-popup" | "explore-popup"

interface Popup {
    element: HTMLElement
    onClose?: () => void
}

const popups: Popup[] = []

export function loadPopupSystem() {
    const popupElement = getElementById("popups")

    popupElement.addEventListener("click", tryClosePopup)

    subscribe("close", closePopup)
}

export function openPopup(type: PopupType, attributes: Record<string, string | number> = {}, onClose?: () => void) {
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
        element,
        onClose,
    })
}

function tryClosePopup(event: MouseEvent) {
    const popupElement = getElementById("popups")

    if (event.target === popupElement) {
        closePopup()
    }
}

export function closePopup() {
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
}
