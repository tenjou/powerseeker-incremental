import { getElement, removeAllChildren } from "../../dom"
import { startBattle } from "../../battle/battle"
import "./location-card"
import { LocationId, LocationConfigs } from "./../../config/location-config"
import { LocationService } from "./../location-service"
import { subscribe, unsubscribe } from "./../../events"
import { LocationCard } from "./location-card"
import { EntityCard } from "./../../entities/ui/entity-card"

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

    subscribe("location-updated", update)
}

export function unloadWorldView() {
    removeAllChildren("world")
    removeAllChildren("location-container")

    unsubscribe("location-updated", update)
}

function update(locationId: LocationId) {
    const location = LocationService.get(locationId)
    if (!location) {
        console.error(`Missing location: ${locationId}`)
        return
    }

    const element = getElement(`location-${locationId}`) as LocationCard
    element.update()

    const parent = getElement("entities-container")
    const missingEntities = location.entities.length - parent.children.length

    for (let n = 0; n < missingEntities; n += 1) {
        const entityCard = document.createElement("entity-card")
        parent.appendChild(entityCard)
    }

    for (let n = 0; n < location.entities.length; n += 1) {
        const entity = location.entities[n]
        const entityCard = parent.children[n] as EntityCard
        entityCard.update(entity)
    }
}
