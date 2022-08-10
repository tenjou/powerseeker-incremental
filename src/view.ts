import { loadCharacterView, unloadCharacterView } from "./character/character-view"
import { toggleClassName } from "./dom"
import { loadInventoryView, unloadInventoryView } from "./inventory/inventory-view"
import { loadSkillsView, unloadSkillsView } from "./skills/skills-view"
import { loadEquipmentView, unloadEquipmentView } from "./equipment/equipment-view"

interface View {
    onLoad: (segments: string[]) => void
    onUnload: () => void
}

type ViewType = "town" | "character" | "inventory" | "skills" | "equipment"

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
    skills: {
        onLoad: loadSkillsView,
        onUnload: unloadSkillsView,
    },
    equipment: {
        onLoad: loadEquipmentView,
        onUnload: unloadEquipmentView,
    },
}

let currView: ViewType | "" = ""

export function updateView() {
    const url = location.pathname
    const segments = url.split("/")
    segments.shift()

    let nextView = segments.shift() as ViewType
    if (!nextView) {
        nextView = "character"
        history.replaceState({}, "", `/${nextView}`)
    }

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
        toggleClassName(`nav-${currView}`, "active", false)

        unloadView.onUnload()
    }

    currView = nextView
    view.onLoad(segments)

    toggleClassName(`view-${nextView}`, "hide", false)
    toggleClassName(`nav-${nextView}`, "active", true)
}

export function goTo(url: string | null) {
    if (!url) {
        return
    }

    history.pushState({}, "", url)
    window.dispatchEvent(new Event("onpushstate"))
}
