import { loadCharacterView, unloadCharacterView } from "./character/character-view"
import { toggleClassName } from "./dom"
import { loadInventoryView, unloadInventoryView } from "./inventory/inventory-view"

interface View {
    onLoad: () => void
    onUnload: () => void
}

type ViewType = "town" | "character" | "inventory"

const views: Record<ViewType, View> = {
    town: {
        onLoad: () => {},
        onUnload: () => {},
    },
    character: {
        onLoad: loadCharacterView,
        onUnload: unloadCharacterView,
    },
    inventory: {
        onLoad: loadInventoryView,
        onUnload: unloadInventoryView,
    },
}

let currView: ViewType | "" = ""

export function updateView() {
    const nextView = location.pathname.slice(1) as ViewType
    if (currView === nextView) {
        return
    }

    const view = views[nextView]
    if (!view) {
        console.error(`Could not find view: ${nextView}`)
        return
    }

    if (currView) {
        const unloadView = views[currView]
        if (!unloadView) {
            console.error(`Could not find view: ${currView}`)
            return
        }

        toggleClassName(`view-${currView}`, "hide", true)

        unloadView.onUnload()
    }

    currView = nextView
    view.onLoad()

    toggleClassName(`view-${nextView}`, "hide", false)
}
