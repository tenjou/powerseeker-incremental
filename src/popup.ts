import { getElement } from "./dom"
import { subscribe } from "./events"

type PopupType = "item-popup" | "battle-result-popup"

const popups: HTMLElement[] = []

export function loadPopupSystem() {
    const popupElement = getElement("popups")

    popupElement.addEventListener("click", tryClosePopup)

    subscribe("close", closePopup)
}

export function openPopup(type: PopupType, attributes: Record<string, string | number> = {}) {
    const popup = document.createElement(type)

    for (let attributeId in attributes) {
        popup.setAttribute(attributeId, String(attributes[attributeId]))
    }

    document.getElementById("popups")?.appendChild(popup)

    if (popups.length > 0) {
        const prevPopup = popups[popups.length - 1]
        prevPopup.classList.add("hide")
    }

    popups.push(popup)
}

function tryClosePopup(event: MouseEvent) {
    const popupElement = getElement("popups")

    if (event.target === popupElement) {
        closePopup()
    }
}

export function closePopup() {
    const lastPopup = popups.pop()
    lastPopup?.remove()

    if (popups.length > 0) {
        const popup = popups[popups.length - 1]
        popup.classList.remove("hide")
    }
}
