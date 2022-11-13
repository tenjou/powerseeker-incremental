import { LocationId } from "../config/location-config"
import { getState } from "../state"
import { emit } from "./../events"
import { LocationConfigs } from "./../config/location-config"
import { EntityConfig } from "../config/entity-configs"
import { Entity } from "./location-types"
import { roll } from "../utils"

export const LocationService = {
    addLocation(locationId: LocationId) {
        const { locations } = getState()

        if (locations[locationId]) {
            console.error(`Already have such location: ${locationId}`)
            return
        }

        locations[locationId] = {
            id: locationId,
            progress: 0,
            entities: [],
        }

        emit("location-added", locationId)
    },

    explore(locationId: LocationId) {
        const { locations } = getState()

        const location = locations[locationId]
        if (!location) {
            console.error(`No such locations added: ${locationId}`)
            return
        }

        location.progress += 5

        const locationConfig = LocationConfigs[locationId]
        for (const entityConfig of locationConfig.entities) {
            if (!roll(entityConfig.chance)) {
                continue
            }
            const entity = createEntity(entityConfig)
            location.entities.push(entity)
        }

        emit("location-updated", locationId)
    },

    remove(uid: number) {
        const locationId: LocationId = "forest"
        const location = LocationService.get(locationId)
        if (!location) {
            console.error(`Missing location: ${locationId}`)
            return
        }

        const index = location.entities.findIndex((entry) => entry.uid === uid)
        if (index === -1) {
            console.error(`Could not find entity: ${uid}`)
            return
        }

        location.entities.splice(index, 1)

        emit("location-removed", uid)
    },

    get(locationId: LocationId) {
        const { locations } = getState()

        return locations[locationId] ?? null
    },
}

function createEntity(entityConfig: EntityConfig): Entity {
    const { cache } = getState()

    return {
        uid: cache.lastEntityIndex++,
        entityId: entityConfig.id,
    }
}
