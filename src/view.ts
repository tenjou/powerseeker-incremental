import { loadCharacterView, unloadCharacterView } from "./character/ui/character-view"
import { toggleClassName } from "./dom"
import { loadInventoryView, unloadInventoryView } from "./inventory/ui/inventory-view"
import { loadSkillsView, unloadSkillsView } from "./skills/skills-view"
import { loadEquipmentView, unloadEquipmentView } from "./equipment/equipment-view"
import { loadAbilitiesView, unloadAbilitiesView } from "./abilities/abilities-view"
import { loadLoadoutView, unloadLoadoutView } from "./loadout/loadout-vew"
import { loadWorldView, unloadWorldView } from "./world/world-view"
import { loadTownView, unloadTownView } from "./town/town"

interface View {
    onLoad: (segments: string[]) => void
    onUnload: () => void
}

type ViewType = "town" | "world" | "character" | "inventory" | "skills" | "equipment" | "abilities" | "loadout"

const views: Record<ViewType, View> = {
    town: {
        onLoad: loadTownView,
        onUnload: unloadTownView,
    },
    world: {
        onLoad: loadWorldView,
        onUnload: unloadWorldView,
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
    abilities: {
        onLoad: loadAbilitiesView,
        onUnload: unloadAbilitiesView,
    },
    loadout: {
        onLoad: loadLoadoutView,
        onUnload: unloadLoadoutView,
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

    let view = views[nextView]
    if (!view) {
        nextView = "character"
        view = views.character
        history.replaceState({}, "", `/${nextView}`)
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
    window.dispatchEvent(new Event("pushstate"))
}
