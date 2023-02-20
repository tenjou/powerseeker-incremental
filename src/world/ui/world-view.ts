import { AreaConfigs, AreaId } from "../../config/area-configs"
import { LocationConfigs, LocationId } from "../../config/location-configs"
import { PopupService } from "../../popup"
import { getState } from "../../state"
import { getUrlSegments } from "../../url"
import { getElementById, removeAllChildren, setText } from "./../../dom"
import { subscribe } from "./../../events"
import { i18n } from "./../../i18n"
import { LootService } from "./../../inventory/loot-service"
import "./location-card"
import { LocationCard } from "./location-card"

export function loadWorldView() {
    subscribe("area-updated", updateWorldView)
    subscribe("location-added", addLocation)
    subscribe("location-updated", updateLocation)
}

export const unloadWorldView = () => {}

export const updateWorldView = (segments: string[]) => {
    const { battleResult } = getState()

    if (battleResult) {
        PopupService.open("battle-result-popup", {}, () => {
            LootService.consumeBattleResult()
        })
    }

    const selectedAreaId = segments[0] as AreaId

    setText("area-name", i18n(selectedAreaId))
    setText("area-description", i18n(`${selectedAreaId}_description`))

    loadLocations()
}

const loadLocations = () => {
    const { locations } = getState()

    const parent = getElementById("view-world")

    const areaConfig = getCurrAreaConfig()
    const locationIds = areaConfig.locations

    const locationMenu = getElementById("area-locations", parent)
    removeAllChildren(locationMenu)

    for (const locationId of locationIds) {
        const locationState = locations[locationId]
        if (!locationState) {
            continue
        }

        const locationConfig = LocationConfigs[locationId]

        const locationCard = new LocationCard()
        locationMenu.appendChild(locationCard)
        locationCard.update(locationConfig, locationState)
    }
}

const addLocation = () => {
    removeAllChildren("area-locations")
    loadLocations()
}

const updateLocation = (locationId: LocationId) => {
    const { locations } = getState()

    const locationConfig = LocationConfigs[locationId]

    const locationState = locations[locationId]
    const locationCard = getElementById(`location-${locationId}`) as LocationCard
    locationCard.update(locationConfig, locationState)
}

const getCurrAreaConfig = () => {
    const segments = getUrlSegments()
    const selectedAreaId = segments[segments.length - 1] as AreaId
    const areaConfig = AreaConfigs[selectedAreaId]

    return areaConfig
}
