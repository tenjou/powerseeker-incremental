import { getElement, removeAllChildren } from "../../dom"
import { startBattle } from "../../battle/battle"
import "./location-card"
import { LocationId, LocationConfigs } from "./../../config/location-config"
import { LocationService } from "./../location-service"
import { subscribe } from "./../../events"
import { LocationCard } from "./location-card"

export function loadWorldView() {
    const worldParent = getElement("world")
    const locationContainer = getElement("location-container")

    // const forestBattle = document.createElement("x-button")
    // forestBattle.setAttribute("class", "black")
    // forestBattle.innerHTML = "Forest Battle"
    // forestBattle.onclick = () => startBattle("test_battle")
    // worldParent.appendChild(forestBattle)

    for (const locationId in LocationConfigs) {
        const location = LocationService.get(locationId as LocationId)
        const element = document.createElement("location-card")
        element.id = `location-${locationId}`
        if (location) {
            element.setAttribute("location", locationId)
        }
        locationContainer.appendChild(element)
    }

    subscribe("location-updated", updateLocation)
}

export function unloadWorldView() {
    removeAllChildren("world")
    removeAllChildren("location-container")
}

function updateLocation(locationId: LocationId) {
    const element = getElement(`location-${locationId}`) as LocationCard
    element.update()
}
