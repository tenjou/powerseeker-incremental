import { LocationConfigs, LocationId } from "../../config/location-config"
import { getElement, getElementById, removeAllChildren } from "./../../dom"
import { subscribe, unsubscribe } from "./../../events"
import { LocationCard } from "./../../exploration/ui/location-card"
import { WorldService } from "./../world-service"
import "./explore-wilderness"
import { ExploreWilderness } from "./explore-wilderness"
import "./location-card"
import { generateLootItem } from "./../../inventory/inventory"
import { getState } from "../../state"
import { BattleResult } from "./../../battle/battle-types"
import { BattleResultElement } from "./../../battle/ui/battle-result"

export function loadWorldView(segments: string[]) {
    const container = getElementById("world-container")

    for (const key in LocationConfigs) {
        const locationId = key as LocationId

        const locationCard = document.createElement("location-card")
        locationCard.id = `location-${locationId}`
        locationCard.setAttribute("location", locationId)
        locationCard.onclick = () => WorldService.goToLocation(locationId)
        container.appendChild(locationCard)
    }

    subscribe("location-updated", updateWorldView)
    subscribe("exploration-started", updateExploration)
    subscribe("exploration-ended", updateExploration)

    const locationId = segments[0] as LocationId
    if (locationId) {
        WorldService.goToLocation(locationId)
    }

    updateWorldView()
    updateExploration()

    getElement("#create-item-button").onclick = () => {
        const { battleResult } = getState()

        const newItem = generateLootItem("leather_clothing", 1, 0)

        if (battleResult) {
            battleResult.loot.push(newItem)
        }

        getElement<BattleResultElement>("battle-result").update()
    }
}

export function unloadWorldView() {
    removeAllChildren("world-container")
    unsubscribe("location-updated", updateWorldView)
    unsubscribe("exploration-started", updateExploration)
    unsubscribe("exploration-ended", updateExploration)
}

function updateWorldView() {
    const locationCards = document.querySelectorAll<LocationCard>("location-card")
    locationCards.forEach((locationCard) => {
        const location = locationCard.getAttribute("location") as LocationId
        locationCard.toggleAttr("data-active", WorldService.isSelected(location))
    })

    // getElement<ExploreWilderness>("explore-wilderness").update(locationId)
}

const updateExploration = () => {
    const exploreWilderness = getElement<ExploreWilderness>("explore-wilderness")
    exploreWilderness.update()
}
