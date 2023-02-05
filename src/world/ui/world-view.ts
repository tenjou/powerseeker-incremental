import { AreaConfigs, AreaId, LocationId } from "../../config/area-configs"
import { openPopup } from "../../popup"
import { getState } from "../../state"
import { getElement, getElementById, removeAllChildren, setText } from "./../../dom"
import { subscribe, unsubscribe } from "./../../events"
import { i18n } from "./../../i18n"
import { LootService } from "./../../inventory/loot-service"
import { WorldService } from "./../world-service"
import "./area-card"
import { AreaCard } from "./area-card"
import "./explore-wilderness"
import { ExploreWilderness } from "./explore-wilderness"
import "./location-card"
import { LocationCard } from "./location-card"

export function loadWorldView(segments: string[]) {
    const parent = getElementById("view-world")
    const areaMenu = getElementById("area-menu", parent)

    for (const key in AreaConfigs) {
        const areaId = key as AreaId
        const locationCard = new AreaCard()
        locationCard.id = `area-${areaId}`
        locationCard.setAttribute("area", areaId)
        locationCard.onclick = () => WorldService.goToArea(areaId)
        areaMenu.appendChild(locationCard)
    }

    subscribe("area-updated", updateWorldView)
    subscribe("location-updated", updateLocation)
    // subscribe("exploration-started", updateExploration)
    // subscribe("exploration-ended", updateExploration)
    // subscribe("battle-ended", updateWorldView)

    // const areaId = segments[0] as AreaId
    // if (areaId) {
    //     WorldService.goToArea(areaId)
    // }

    updateWorldView()
    // updateExploration()
}

export function unloadWorldView() {
    unsubscribe("area-updated", updateWorldView)
    unsubscribe("exploration-started", updateExploration)
    unsubscribe("exploration-ended", updateExploration)
    unsubscribe("battle-ended", updateWorldView)
}

function updateWorldView() {
    const { battleResult } = getState()

    const parent = getElementById("view-world")

    const areaCards = parent.querySelectorAll<AreaCard>("area-card")
    areaCards.forEach((areaCard) => {
        const area = areaCard.getAttribute("area") as AreaId
        areaCard.toggleAttr("data-active", WorldService.isSelected(area))
    })

    if (battleResult) {
        openPopup("battle-result-popup", {}, () => {
            LootService.consumeBattleResult()
        })
    }

    const selectedAreaId = WorldService.getSelectedAreaId()
    setText("area-name", i18n(selectedAreaId))
    setText("area-description", i18n(`${selectedAreaId}_description`))

    loadLocations()
}

const updateExploration = () => {
    const exploreWilderness = getElement<ExploreWilderness>("explore-wilderness")
    exploreWilderness.update()
}

const loadLocations = () => {
    const { locations } = getState()

    const parent = getElementById("view-world")

    const areaConfig = getCurrAreaConfig()
    const locationConfigs = areaConfig.locations

    const locationMenu = getElementById("area-locations", parent)
    removeAllChildren(locationMenu)

    for (const locationId in locationConfigs) {
        const locationState = locations[locationId]
        if (!locationState) {
            continue
        }

        const locationConfig = locationConfigs[locationId]

        const locationCard = new LocationCard()
        locationMenu.appendChild(locationCard)
        locationCard.update(locationConfig, locationState)
    }
}

const updateLocation = (locationId: LocationId) => {
    const { locations } = getState()

    const areaConfig = getCurrAreaConfig()
    const locationConfig = areaConfig.locations[locationId]

    const locationState = locations[locationId]
    const locationCard = getElementById(`location-${locationId}`) as LocationCard
    locationCard.update(locationConfig, locationState)
}

const getCurrAreaConfig = () => {
    const selectedArea = WorldService.getSelectedArea()
    const areaConfig = AreaConfigs[selectedArea.id]

    return areaConfig
}
