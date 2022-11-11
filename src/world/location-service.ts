import { LocationId } from "../config/location-config"
import { getState } from "../state"
import { emit } from "./../events"

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
        }

        emit("location-added", locationId)
    },

    addProgress(locationId: LocationId, progress: number) {
        const { locations } = getState()

        const location = locations[locationId]
        if (!location) {
            console.error(`No such locations added: ${locationId}`)
            return
        }

        location.progress += progress

        emit("location-updated", locationId)
    },

    get(locationId: LocationId) {
        const { locations } = getState()

        return locations[locationId] ?? null
    },
}
