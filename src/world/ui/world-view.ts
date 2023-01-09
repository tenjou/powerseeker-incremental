import { LocationConfigs, LocationId } from "../../config/location-config"
import { openPopup } from "../../popup"
import { getState } from "../../state"
import { BattleResultElement } from "./../../battle/ui/battle-result"
import { getElement, getElementById, removeAllChildren } from "./../../dom"
import { subscribe, unsubscribe } from "./../../events"
import { WorldService } from "./../world-service"
import "./explore-wilderness"
import { ExploreWilderness } from "./explore-wilderness"
import "./location-card"
import { LocationCard } from "./location-card"
import { LootService } from "./../../inventory/loot-service"

export function loadWorldView(segments: string[]) {
    const container = getElementById("world-container")

    for (const key in LocationConfigs) {
        const locationId = key as LocationId

        const locationCard = new LocationCard()
        locationCard.id = `location-${locationId}`
        locationCard.setAttribute("location", locationId)
        locationCard.onclick = () => WorldService.goToLocation(locationId)
        container.appendChild(locationCard)
    }

    subscribe("location-updated", updateWorldView)
    subscribe("exploration-started", updateExploration)
    subscribe("exploration-ended", updateExploration)
    subscribe("battle-ended", updateWorldView)

    const locationId = segments[0] as LocationId
    if (locationId) {
        WorldService.goToLocation(locationId)
    }

    updateWorldView()
    updateExploration()

    getElement("#create-item-button").onclick = () => {
        const { battleResult } = getState()

        const newItem = LootService.generateItem("axe", 10, 0)

        if (battleResult) {
            battleResult.loot.push(newItem)
            battleResult.xp = 100
            battleResult.gold = 213
        }

        getElement<BattleResultElement>("battle-result").update()

        openPopup("battle-result-popup", {}, () => {
            console.log("popup closed")
        })
    }
}

export function unloadWorldView() {
    removeAllChildren("world-container")
    unsubscribe("location-updated", updateWorldView)
    unsubscribe("exploration-started", updateExploration)
    unsubscribe("exploration-ended", updateExploration)
    unsubscribe("battle-ended", updateWorldView)
}

function updateWorldView() {
    const { battleResult } = getState()

    const locationCards = document.querySelectorAll<LocationCard>("location-card")
    locationCards.forEach((locationCard) => {
        const location = locationCard.getAttribute("location") as LocationId
        locationCard.toggleAttr("data-active", WorldService.isSelected(location))
    })

    if (battleResult) {
        openPopup("battle-result-popup", {}, () => {
            LootService.consumeBattleResult()
        })
    }

    // getElement<ExploreWilderness>("explore-wilderness").update(locationId)
}

const updateExploration = () => {
    const exploreWilderness = getElement<ExploreWilderness>("explore-wilderness")
    exploreWilderness.update()
}
