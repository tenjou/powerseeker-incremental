import { loadAbilitiesView, unloadAbilitiesView } from "./abilities/ui/abilities-view"
import { loadBattleView, unloadBattleView } from "./battle/ui/battle-view"
import { loadCharacterView, unloadCharacterView } from "./character/ui/character-view"
import { toggleClassName } from "./dom"
import { loadEquipmentView, unloadEquipmentView } from "./equipment/ui/equipment-view"
import { EventCallbackInfo, unsubscribe, watchSubscribers } from "./events"
import { loadInventoryView, unloadInventoryView } from "./inventory/ui/inventory-view"
import { loadLoadoutView, unloadLoadoutView } from "./loadout/ui/loadout-vew"
import { loadSkillsView, unloadSkillsView } from "./skills/skills-view"
import { loadTownView, unloadTownView } from "./town/town"
import { loadWorldView, unloadWorldView, updateWorldView } from "./world/ui/world-view"

interface View {
    onLoad: (segments: string[]) => void
    onUnload: () => void
    onUpdate?: (segments: string[]) => void
    customContainer?: string
}

type ViewType = "town" | "world" | "character" | "inventory" | "skills" | "equipment" | "abilities" | "loadout" | "battle"

const mainContainerId = "main-container"

const views: Record<ViewType, View> = {
    town: {
        onLoad: loadTownView,
        onUnload: unloadTownView,
    },
    world: {
        onLoad: loadWorldView,
        onUnload: unloadWorldView,
        onUpdate: updateWorldView,
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
    battle: {
        onLoad: loadBattleView,
        onUnload: unloadBattleView,
        customContainer: "battle-container",
    },
}

let currView: ViewType | "" = ""
let currSubscribers: EventCallbackInfo[] = []

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
        let view = views[currView]
        if (view.onUpdate) {
            view.onUpdate(segments)
        }
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

        if (currSubscribers.length > 0) {
            for (const subscriber of currSubscribers) {
                unsubscribe(subscriber.type, subscriber.callback)
            }

            currSubscribers.length = 0
        }
    }

    currView = nextView

    if (view.customContainer) {
        toggleClassName(view.customContainer, "hide", false)
        toggleClassName(mainContainerId, "hide", true)
    }

    watchSubscribers(registerViewSubscribers)
    view.onLoad(segments)
    if (view.onUpdate) {
        view.onUpdate(segments)
    }
    watchSubscribers(null)

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

const registerViewSubscribers = (info: EventCallbackInfo) => {
    currSubscribers.push(info)
}
