type PopupType = "battle-result-popup"

const popups: HTMLElement[] = []

export function openPopup(type: PopupType) {
    const popup = document.createElement(type)
    document.getElementById("popups")?.appendChild(popup)

    if (popups.length > 0) {
        const prevPopup = popups[popups.length - 1]
        prevPopup.classList.add("hide")
    }

    popups.push(popup)
}

export function closePopup() {
    const lastPopup = popups.pop()
    lastPopup?.remove()

    if (popups.length > 0) {
        const popup = popups[popups.length - 1]
        popup.classList.remove("hide")
    }
}
