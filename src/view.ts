import { loadCharacterView, unloadCharacterView } from "./character/ui/character-view"
import { toggleClassName } from "./dom"
import { loadInventoryView, unloadInventoryView } from "./inventory/ui/inventory-view"
import { loadSkillsView, unloadSkillsView } from "./skills/skills-view"
import { loadEquipmentView, unloadEquipmentView } from "./equipment/ui/equipment-view"
import { loadAbilitiesView, unloadAbilitiesView } from "./abilities/ui/abilities-view"
import { loadLoadoutView, unloadLoadoutView } from "./loadout/ui/loadout-vew"
import { loadWorldView, unloadWorldView } from "./world/ui/world-view"
import { loadTownView, unloadTownView } from "./town/town"
import { loadJobsView, unloadJobsView } from "./jobs/ui/jobs-view"
import { loadBattleView, unloadBattleView } from "./battle/ui/battle-view"

interface View {
    onLoad: (segments: string[]) => void
    onUnload: () => void
    customContainer?: string
}

type ViewType = "town" | "world" | "character" | "inventory" | "skills" | "equipment" | "abilities" | "loadout" | "jobs" | "battle"

const mainContainerId = "main-container"

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
    jobs: {
        onLoad: loadJobsView,
        onUnload: unloadJobsView,
    },
    battle: {
        onLoad: loadBattleView,
        onUnload: unloadBattleView,
        customContainer: "battle-container",
    },
}

let currView: ViewType | "" = ""

export function updateView(forceView?: ViewType) {
    const url = location.pathname
    const segments = url.split("/")
    segments.shift()

    let nextView = forceView ? forceView : (segments.shift() as ViewType)
    if (!nextView) {
        nextView = "world"
        history.replaceState({}, "", `/${nextView}`)
    }

    if (currView === nextView) {
        return
    }

    let view = views[nextView]
    if (!view) {
        nextView = "world"
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

        if (unloadView.customContainer) {
            toggleClassName(mainContainerId, "hide", false)
            toggleClassName(unloadView.customContainer, "hide", true)
        }

        unloadView.onUnload()
    }

    currView = nextView

    if (view.customContainer) {
        toggleClassName(view.customContainer, "hide", false)
        toggleClassName(mainContainerId, "hide", true)
    }
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
