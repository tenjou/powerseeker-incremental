import { LocationId } from "../config/location-config"
import { getState } from "../state"
import { emit } from "./../events"
import { LocationConfigs } from "./../config/location-config"

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
            location.entities.push({
                id: entityConfig.id,
            })
        }

        emit("location-updated", locationId)
    },

    get(locationId: LocationId) {
        const { locations } = getState()

        return locations[locationId] ?? null
    },
}
